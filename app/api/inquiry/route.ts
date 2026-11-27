import { NextResponse } from "next/server";
import { productOptions, roleOptions, volumeOptions } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRODUCT_LABELS = new Map<string, string>(productOptions.map((p) => [p.value, p.label]));

// Best-effort, per-instance rate limit (5 requests / 10 minutes / IP).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam traps: honeypot filled, or submitted implausibly fast. Pretend success.
  if (str(body.website, 200) || (typeof body.elapsedMs === "number" && body.elapsedMs < 2500)) {
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions in a short time. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const data = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    company: str(body.company, 160),
    country: str(body.country, 80),
    role: str(body.role, 80),
    volume: str(body.volume, 80),
    message: str(body.message, 4000),
    products: Array.isArray(body.products)
      ? Array.from(new Set(body.products.filter((p): p is string => typeof p === "string" && PRODUCT_LABELS.has(p))))
      : [],
    consent: body.consent === true,
  };

  const fields: Record<string, string> = {};
  if (data.name.length < 2) fields.name = "Please enter your name.";
  if (!EMAIL_RE.test(data.email)) fields.email = "Please enter a valid email address.";
  if (data.company.length < 2) fields.company = "Please enter your company or organisation.";
  if (data.role && !(roleOptions as readonly string[]).includes(data.role)) data.role = "";
  if (data.volume && !(volumeOptions as readonly string[]).includes(data.volume)) data.volume = "";
  if (data.products.length === 0) fields.products = "Select at least one product.";
  if (!data.consent) fields.consent = "Please confirm so we can reply to you.";
  if (Object.keys(fields).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO || "info@elementumglobal.com";
  const from = process.env.INQUIRY_FROM || "Elementum Global Website <website@elementumglobal.com>";

  if (!apiKey) {
    console.error("[inquiry] RESEND_API_KEY is not configured — inquiry not delivered", {
      company: data.company,
      products: data.products,
    });
    return NextResponse.json(
      { ok: false, error: "Our inquiry form is temporarily unavailable." },
      { status: 503 },
    );
  }

  const productList = data.products.map((p) => PRODUCT_LABELS.get(p)!).join(", ");
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Country", data.country || "—"],
    ["Role", data.role || "—"],
    ["Products", productList],
    ["Estimated volume", data.volume || "—"],
  ].filter(([k, v]) => !(v === "—" && ["Country", "Role", "Estimated volume"].includes(k))) as [string, string][];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nMessage:\n${data.message || "—"}\n\n— Sent from the inquiry form on elementumglobal.com`;

  const html = `<!doctype html><html><body style="margin:0;background:#f6f0e7;font-family:Arial,Helvetica,sans-serif;color:#2a2420">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffcf7;border:1px solid #e4d9c9;border-radius:12px;overflow:hidden">
    <tr><td style="background:#2e2622;padding:20px 28px;color:#dfb468;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">New website inquiry</td></tr>
    <tr><td style="padding:24px 28px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 0;color:#675c52;width:150px;vertical-align:top;border-bottom:1px solid #efe6d8">${esc(k)}</td><td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #efe6d8">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#675c52;font-size:12px;text-transform:uppercase;letter-spacing:1px">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(data.message || "—")}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#9a8e81">Reply directly to this email to answer ${esc(data.name)}.</p>
    </td></tr>
  </table></td></tr></table></body></html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Website inquiry — ${productList} — ${data.company}`.slice(0, 200),
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[inquiry] Resend error", res.status, await res.text().catch(() => ""));
      return NextResponse.json(
        { ok: false, error: "We couldn't deliver your inquiry just now." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[inquiry] Delivery failed", err);
    return NextResponse.json({ ok: false, error: "We couldn't deliver your inquiry just now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
