import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div>
        <span className="eyebrow">404</span>
        <h1>This page doesn&apos;t exist.</h1>
        <p>The link may be outdated, or the page has moved as part of our new website.</p>
        <a href="/" className="btn btn--dark">
          Back to homepage <ArrowRight aria-hidden />
        </a>
      </div>
    </main>
  );
}
