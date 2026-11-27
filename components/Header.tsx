"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

const links = [
  { href: "/#products", label: "Products" },
  { href: "/#services", label: "What we do" },
  { href: "/#sustainability", label: "Sustainability" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#inquiry", label: "Contact" },
];

export default function Header({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cls = ["site-header", scrolled || solid ? "is-solid" : "", open ? "menu-open" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={cls}>
      <div className="container">
        <a href="/" className="brand" aria-label="Elementum Global — home">
          <Image className="logo-on-dark" src="/images/logo-light.png" alt="" width={775} height={175} priority />
          <Image className="logo-on-light" src="/images/logo-dark.png" alt="" width={775} height={175} priority />
        </a>
        <nav className="nav" aria-label="Main">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href="/#inquiry" className="btn btn--gold">
            Get in touch
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </nav>
      </div>
      <div id="mobile-menu" className={`mobile-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/#inquiry" className="btn btn--dark" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          Get in touch <ArrowRight aria-hidden />
        </a>
      </div>
    </header>
  );
}
