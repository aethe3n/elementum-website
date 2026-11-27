import Image from "next/image";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/images/logo-light.png" alt="Elementum Global" width={775} height={175} />
            <p>
              Sustainable cacao sourcing and trade facilitation — connecting African producers with international
              buyers.
            </p>
          </div>
          <div className="footer-col">
            <h3>Products</h3>
            <ul role="list">
              <li><a href="/#products">Cacao</a></li>
              <li><a href="/#products">Vanilla</a></li>
              <li><a href="/#products">Coffee</a></li>
              <li><a href="/#products">Pepper</a></li>
              <li><a href="/#products">Metals &amp; minerals</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <ul role="list">
              <li><a href="/#services">What we do</a></li>
              <li><a href="/#process">How we work</a></li>
              <li><a href="/#sustainability">Sustainability</a></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact</h3>
            <ul role="list">
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><a href="/#inquiry">Register interest</a></li>
              <li>Delaware, USA</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {site.legalName}. All rights reserved.</span>
          <a href="/privacy">Privacy notice</a>
        </div>
      </div>
    </footer>
  );
}
