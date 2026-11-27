"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CircleAlert, CircleCheck } from "lucide-react";
import { productOptions, roleOptions, site, volumeOptions } from "@/lib/site";
import { SELECT_EVENT } from "./InquireLink";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "company" | "role" | "products" | "consent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [products, setProducts] = useState<string[]>([]);
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const onSelect = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      setProducts((prev) => (prev.includes(value) ? prev : [...prev, value]));
      setErrors((prev) => ({ ...prev, products: undefined }));
    };
    window.addEventListener(SELECT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_EVENT, onSelect);
  }, []);

  function toggleProduct(value: string) {
    setProducts((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));
    setErrors((prev) => ({ ...prev, products: undefined }));
  }

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    if (name.length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) e.email = "Please enter a valid email address.";
    if (company.length < 2) e.company = "Please enter your company or organisation.";
    if (!fd.get("role")) e.role = "Please choose what describes you best.";
    if (products.length === 0) e.products = "Select at least one product.";
    if (!fd.get("consent")) e.consent = "Please confirm so we can reply to you.";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setServerError(null);
    const fd = new FormData(ev.currentTarget);
    const v = validate(fd);
    setErrors(v);
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] select`);
      el?.focus();
      return;
    }

    setStatus("submitting");
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      country: fd.get("country"),
      role: fd.get("role"),
      products,
      volume: fd.get("volume"),
      message: fd.get("message"),
      consent: Boolean(fd.get("consent")),
      website: fd.get("website"), // honeypot
      elapsedMs: Date.now() - startedAt.current,
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Errors };
      if (res.ok && data.ok) {
        setStatus("success");
        formRef.current?.reset();
        setProducts([]);
        return;
      }
      if (data.fields) setErrors(data.fields);
      setServerError(data.error || "Something went wrong while sending your inquiry.");
      setStatus("error");
    } catch {
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-card" aria-live="polite">
        <div className="success">
          <div className="success-icon">
            <CircleCheck aria-hidden />
          </div>
          <h3>Thank you — we have your inquiry.</h3>
          <p>
            Our team reviews every request personally and will reply from {site.email}. If it is urgent, you can
            also write to us directly.
          </p>
          <button type="button" className="btn btn--ghost" onClick={() => setStatus("idle")}>
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  const fieldProps = (name: keyof Errors) => ({
    "data-field": name,
    "data-invalid": errors[name] ? "true" : undefined,
  });

  return (
    <div className="form-card">
      <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-describedby="form-note">
        <div className="form-row">
          <div className="field" {...fieldProps("name")}>
            <label htmlFor="f-name">
              Full name <span className="req">*</span>
            </label>
            <input id="f-name" name="name" className="input" autoComplete="name" placeholder="Jane Doe"
              aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} maxLength={120} />
            {errors.name && <span id="e-name" className="field-error">{errors.name}</span>}
          </div>
          <div className="field" {...fieldProps("company")}>
            <label htmlFor="f-company">
              Company <span className="req">*</span>
            </label>
            <input id="f-company" name="company" className="input" autoComplete="organization" placeholder="Company name"
              aria-invalid={!!errors.company} aria-describedby={errors.company ? "e-company" : undefined} maxLength={160} />
            {errors.company && <span id="e-company" className="field-error">{errors.company}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="field" {...fieldProps("email")}>
            <label htmlFor="f-email">
              Business email <span className="req">*</span>
            </label>
            <input id="f-email" name="email" type="email" className="input" autoComplete="email" placeholder="name@company.com"
              aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : undefined} maxLength={200} />
            {errors.email && <span id="e-email" className="field-error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor="f-country">
              Country <span className="opt">(optional)</span>
            </label>
            <input id="f-country" name="country" className="input" autoComplete="country-name" placeholder="e.g. Netherlands" maxLength={80} />
          </div>
        </div>

        <div className="form-row">
          <div className="field" {...fieldProps("role")}>
            <label htmlFor="f-role">
              I am a… <span className="req">*</span>
            </label>
            <select id="f-role" name="role" className="select" defaultValue=""
              aria-invalid={!!errors.role} aria-describedby={errors.role ? "e-role" : undefined}>
              <option value="" disabled>Choose one</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <span id="e-role" className="field-error">{errors.role}</span>}
          </div>
          <div className="field">
            <label htmlFor="f-volume">
              Estimated volume <span className="opt">(optional)</span>
            </label>
            <select id="f-volume" name="volume" className="select" defaultValue="">
              <option value="">Select a range</option>
              {volumeOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="field" {...fieldProps("products")} aria-describedby={errors.products ? "e-products" : undefined}>
          <legend>
            Products of interest <span className="req">*</span>
          </legend>
          <div className="check-grid">
            {productOptions.map((p) => (
              <label key={p.value} className="check-pill">
                <input type="checkbox" name="products" value={p.value}
                  checked={products.includes(p.value)} onChange={() => toggleProduct(p.value)} />
                <span>
                  <Check aria-hidden />
                  {p.label}
                </span>
              </label>
            ))}
          </div>
          {errors.products && <span id="e-products" className="field-error">{errors.products}</span>}
        </fieldset>

        <div className="field">
          <label htmlFor="f-message">
            Your requirements <span className="opt">(optional)</span>
          </label>
          <textarea id="f-message" name="message" className="textarea" maxLength={4000}
            placeholder="Grade or specification, destination port, preferred terms, timing — whatever helps us prepare a relevant answer." />
        </div>

        <div className="hp" aria-hidden="true">
          <label htmlFor="f-website">Website</label>
          <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="field" {...fieldProps("consent")}>
          <label className="consent" htmlFor="f-consent">
            <input id="f-consent" type="checkbox" name="consent" value="yes"
              aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "e-consent" : undefined} />
            <span>
              I agree that Elementum Global may use these details to respond to my inquiry, as described in the{" "}
              <a href="/privacy">privacy notice</a>.
            </span>
          </label>
          {errors.consent && <span id="e-consent" className="field-error">{errors.consent}</span>}
        </div>

        {status === "error" && serverError && (
          <div className="alert alert--error" role="alert">
            <CircleAlert aria-hidden />
            <span>
              {serverError} You can also email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
            </span>
          </div>
        )}

        <div className="form-actions">
          <p id="form-note" className="form-note">Every inquiry is read and answered personally.</p>
          <button type="submit" className="btn btn--dark" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <span className="spinner" aria-hidden /> Sending…
              </>
            ) : (
              <>
                Send inquiry <ArrowRight aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
