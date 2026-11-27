# Elementum Global — website

Marketing site for [elementumglobal.com](https://elementumglobal.com): sustainable cacao sourcing and trade facilitation, with vanilla, coffee, pepper and expanding metals & minerals.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, plain CSS (`app/globals.css`), lucide-react icons
- **Hosting:** Vercel (`main` → production)
- **Inquiry form:** `components/InquiryForm.tsx` → `app/api/inquiry/route.ts` → email via [Resend](https://resend.com) to `info@elementumglobal.com`

## Local development

```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY to test real delivery
npm run dev
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key used to send inquiry emails (required in production) |
| `INQUIRY_TO` | Recipient, defaults to `info@elementumglobal.com` |
| `INQUIRY_FROM` | Sender on a Resend-verified domain, defaults to `Elementum Global Website <website@elementumglobal.com>` |

Without `RESEND_API_KEY` the form shows a friendly error with the email address as a fallback.
