import Image from "next/image";
import { ArrowRight, Building2, Factory, Handshake, HandHeart, Leaf, Mail, Network, Plus, Search, ShieldCheck, Ship, TreePine, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import InquireLink from "@/components/InquireLink";
import InquiryForm from "@/components/InquiryForm";
import { site, type ProductValue } from "@/lib/site";

const products: { value: ProductValue; name: string; line: string; img: string; alt: string }[] = [
  { value: "cacao", name: "Cacao", line: "Our core focus.", img: "/images/cacao.webp", alt: "Cacao beans drying on a wooden rack" },
  { value: "vanilla", name: "Vanilla", line: "Cured vanilla beans.", img: "/images/vanilla.webp", alt: "Bundle of cured vanilla beans" },
  { value: "coffee", name: "Coffee", line: "Green coffee.", img: "/images/coffee.webp", alt: "Ripe coffee cherries on the branch" },
  { value: "pepper", name: "Pepper", line: "Whole pepper and spices.", img: "/images/pepper.webp", alt: "Black peppercorns and green pepper berries" },
];

const faqs = [
  {
    q: "What does Elementum Global do?",
    a: "We source agricultural commodities at origin and connect producers with international buyers, coordinating each trade as a single point of contact.",
  },
  {
    q: "Which products do you work with?",
    a: "Cacao is our core focus, alongside vanilla, coffee and pepper. We are also expanding into metals and minerals and can look into other agricultural products on request.",
  },
  {
    q: "Do you hold your own stock?",
    a: "No. We work with trusted producers and partner exporters at origin and coordinate the trade between them and the buyer.",
  },
  {
    q: "How do specifications, pricing and terms work?",
    a: "Every request is different, so we discuss product details, volumes and terms personally on a call once we understand what you need.",
  },
  {
    q: "How do you approach sustainability?",
    a: "We prioritise organic and fair trade supply where available, work toward traceable and responsible sourcing, and give back to the communities and landscapes behind our products.",
  },
  {
    q: "How do we start?",
    a: "Send us a short message through the form below or email us. We will get back to you to arrange a call.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <Reveal />
      <main id="main">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <Image src="/images/hero.webp" alt="Ripening cacao pods on a shaded cacao tree" fill priority sizes="100vw" />
          </div>
          <div className="container hero-inner">
            <span className="eyebrow">Commodity sourcing &amp; trade</span>
            <h1 id="hero-title">
              Agricultural commodities, <span className="accent">sourced at origin.</span>
            </h1>
            <p className="hero-sub">
              We connect producers with international buyers — responsibly, and built on long-term relationships.
            </p>
            <div className="hero-actions">
              <a href="#inquiry" className="btn btn--gold">
                Get in touch <ArrowRight aria-hidden />
              </a>
              <a href="#products" className="btn btn--ghost-light">
                Our products
              </a>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="section" aria-labelledby="intro-title">
          <div className="container intro-grid">
            <div className="intro-media" data-reveal>
              <Image
                src="/images/forest.webp"
                alt="Young cacao trees growing under tall shade trees"
                width={1672}
                height={941}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
            <div className="intro-copy" data-reveal>
              <span className="eyebrow">About us</span>
              <h2 id="intro-title" className="h2">
                Trade built on <span className="accent">relationships.</span>
              </h2>
              <p className="lead">
                Elementum Global is a U.S.-registered sourcing and trade company. We work closely with producers and
                partners at origin and bring their products to buyers around the world — fairly, transparently and
                with care for the places they come from.
              </p>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="section section--sand" aria-labelledby="products-title">
          <div className="container">
            <div className="section-head section-head--center" data-reveal>
              <span className="eyebrow">Products</span>
              <h2 id="products-title" className="h2">
                What we <span className="accent">source.</span>
              </h2>
            </div>

            <div className="simple-products">
              {products.map((p, i) => (
                <article key={p.value} className="simple-product" data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                  <div className="simple-product-media">
                    <Image src={p.img} alt={p.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  </div>
                  <div className="simple-product-body">
                    <h3>{p.name}</h3>
                    <p>{p.line}</p>
                    <InquireLink product={p.value}>Inquire</InquireLink>
                  </div>
                </article>
              ))}
            </div>

            <div className="expanding">
              <article className="expand-card expand-card--minerals" data-reveal>
                <Image src="/images/minerals.webp" alt="Raw mineral ore samples on slate" fill sizes="(max-width: 760px) 100vw, 60vw" />
                <span className="status-pill">Expanding</span>
                <h3>Metals &amp; minerals</h3>
                <p>A growing part of our network.</p>
                <InquireLink product="metals-minerals">Register interest</InquireLink>
              </article>
              <article className="expand-card expand-card--agri" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <span className="status-pill">On request</span>
                <h3>More agricultural products</h3>
                <p>Looking for something else? Ask us.</p>
                <InquireLink product="other-agri">Ask about a product</InquireLink>
              </article>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="section" aria-labelledby="services-title">
          <div className="container">
            <div className="section-head section-head--center" data-reveal>
              <span className="eyebrow">What we do</span>
              <h2 id="services-title" className="h2">
                From origin <span className="accent">to buyer.</span>
              </h2>
            </div>
            <ul className="services" role="list">
              <li className="service" data-reveal>
                <div className="service-icon">
                  <Search aria-hidden />
                </div>
                <h3>Sourcing</h3>
                <p>Finding reliable supply and the right partners at origin.</p>
              </li>
              <li className="service" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <div className="service-icon">
                  <TrendingUp aria-hidden />
                </div>
                <h3>Buyer relationships</h3>
                <p>Building lasting partnerships with buyers worldwide.</p>
              </li>
              <li className="service" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
                <div className="service-icon">
                  <Handshake aria-hidden />
                </div>
                <h3>Trade coordination</h3>
                <p>One point of contact to bring each trade together.</p>
              </li>
            </ul>

            <div className="model" data-reveal>
              <div className="model-media">
                <Image src="/images/port.webp" alt="Container port with cranes at dusk" fill sizes="(max-width: 860px) 100vw, 50vw" />
              </div>
              <div className="model-copy">
                <span className="eyebrow">How we work</span>
                <h3>Clear roles. One point of contact.</h3>
                <p>
                  Our partner exporters handle export at origin. We manage the relationships and keep every trade
                  moving, so buyers and producers always know who to talk to.
                </p>
              </div>
            </div>

            <ul className="audience audience--4" role="list" aria-label="Who we work with">
              <li data-reveal>
                <Building2 aria-hidden />
                <h3>Importers &amp; traders</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
                <Factory aria-hidden />
                <h3>Processors &amp; manufacturers</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
                <Ship aria-hidden />
                <h3>Trade &amp; logistics partners</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
                <Network aria-hidden />
                <h3>Aligned investors</h3>
              </li>
            </ul>
          </div>
        </section>

        {/* SUSTAINABILITY */}
        <section id="sustainability" className="section section--dark" aria-labelledby="sustain-title">
          <div className="container">
            <div className="section-head section-head--center" data-reveal>
              <span className="eyebrow">Sustainability</span>
              <h2 id="sustain-title" className="h2">
                Good trade <span className="accent">gives back.</span>
              </h2>
            </div>
            <ul className="pillars" role="list">
              <li data-reveal>
                <TreePine aria-hidden />
                <h3>Reforestation</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
                <HandHeart aria-hidden />
                <h3>Local communities</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
                <Leaf aria-hidden />
                <h3>Organic &amp; fair trade</h3>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
                <ShieldCheck aria-hidden />
                <h3>Responsible sourcing</h3>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section section--sand" aria-labelledby="faq-title">
          <div className="container faq-wrap">
            <div className="section-head section-head--center" data-reveal>
              <span className="eyebrow">FAQ</span>
              <h2 id="faq-title" className="h2">
                Good <span className="accent">to know.</span>
              </h2>
            </div>
            <div className="faq" data-reveal>
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    {f.q}
                    <Plus aria-hidden />
                  </summary>
                  <p className="answer">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="inquiry" className="section" aria-labelledby="inquiry-title">
          <div className="container inquiry-grid">
            <div className="inquiry-copy" data-reveal>
              <span className="eyebrow">Contact</span>
              <h2 id="inquiry-title" className="h2">
                Let&apos;s <span className="accent">talk.</span>
              </h2>
              <p className="lead">
                Tell us briefly what you are interested in and we will set up a call.
              </p>
              <ul className="contact-list" role="list">
                <li>
                  <span className="contact-icon">
                    <Mail aria-hidden />
                  </span>
                  <div>
                    <small>Email</small>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </div>
                </li>
              </ul>
            </div>
            <div data-reveal>
              <InquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
