import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Elementum Global handles personal data submitted through elementumglobal.com.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <Header solid />
      <main id="main" className="legal">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Privacy notice</h1>
          <p className="updated">Last updated: November 2026</p>

          <h2>Who we are</h2>
          <p>
            This website is operated by {site.legalName}, a limited liability company registered in Delaware, United
            States. You can contact us about privacy at <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>What we collect</h2>
          <p>When you submit the inquiry form, we receive the information you enter:</p>
          <ul>
            <li>your name, company, business email address and, optionally, your country;</li>
            <li>your role, the products you are interested in, an estimated volume and any message you include.</li>
          </ul>
          <p>
            Our hosting provider also processes technical data such as IP address and browser information, which is
            needed to deliver the website securely. We do not use advertising or tracking cookies.
          </p>

          <h2>How we use it</h2>
          <p>
            We use your information only to respond to your inquiry and, where relevant, to discuss a potential
            business relationship with you. The legal basis is your consent and our legitimate interest in replying
            to business inquiries. We do not sell your data or share it for marketing purposes.
          </p>

          <h2>Service providers</h2>
          <p>
            The website is hosted by Vercel Inc. Inquiry emails are delivered by Resend and received in our business
            mailbox. These providers process data on our behalf and may store it outside your country, including in
            the United States.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep inquiry emails for as long as needed to handle your request and any resulting business
            relationship, and delete them when they are no longer required.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct or delete your personal data, to
            object to or restrict its use, and to withdraw consent at any time. To exercise these rights, email{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>. If you are in the EU or UK, you may also complain to
            your local data protection authority.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
