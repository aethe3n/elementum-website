import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Factory,
  Handshake,
  HandHeart,
  Leaf,
  Mail,
  MapPin,
  Plus,
  Route,
  Search,
  ShieldCheck,
  Ship,
  Sprout,
  TreePine,
  TrendingUp,
  Users,
  FileCheck2,
  Network,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import InquireLink from "@/components/InquireLink";
import InquiryForm from "@/components/InquiryForm";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Does Elementum Global hold its own stock?",
    a: "No. We work as an intermediary. Product is supplied through our producer relationships and established partner exporters at origin, who handle export. We manage the relationship and coordinate the transaction from first inquiry to shipment.",
  },
  {
    q: "On what terms are offers made?",
    a: "Terms are confirmed per offer. Cacao is typically quoted FOB origin port. Specifications, packaging, documentation and payment terms are agreed in writing before contract.",
  },
  {
    q: "Which origins do you work with?",
    a: "Our focus is Africa, built on long-standing family relationships with farms and producers. Our current cacao offers come from Cameroon, with further Central African origins considered case by case.",
  },
  {
    q: "Can I receive samples or detailed specifications?",
    a: "Yes, for qualified buyers. Tell us your product, grade requirements and destination in the inquiry form and we will come back with what is available and how samples can be arranged.",
  },
  {
    q: "Is there a minimum order quantity?",
    a: "It depends on the product and the lot. Commercial cacao volumes are usually traded by the container. Smaller trial lots can sometimes be arranged — share your expected volume and we will tell you what is realistic.",
  },
  {
    q: "How do you approach sustainability and EUDR?",
    a: "We prioritise organic and Fairtrade supply where available and work toward traceable, deforestation-free sourcing with no child or forced labour. For buyers in the EU, we work with our partners on the traceability information required under the EU Deforestation Regulation.",
  },
  {
    q: "Do you already supply metals and minerals?",
    a: "We are building supplier relationships in metals and minerals and in further agricultural products. If you have a specific requirement, register your interest — we will tell you honestly whether and when we can help.",
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
            <Image
              src="/images/hero.webp"
              alt="Ripening cacao pods on a shaded cacao tree"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="container hero-inner">
            <span className="eyebrow">Commodity sourcing &amp; trade facilitation</span>
            <h1 id="hero-title">
              Agricultural commodities, <span className="accent">sourced at origin.</span>
            </h1>
            <p className="hero-sub">
              Elementum Global connects African producers with international buyers. Cacao is our lead
              product, alongside vanilla, coffee and pepper, and we are adding metals and minerals.
            </p>
            <div className="hero-actions">
              <a href="#inquiry" className="btn btn--gold">
                Register your interest <ArrowRight aria-hidden />
              </a>
              <a href="#products" className="btn btn--ghost-light">
                Explore products
              </a>
            </div>
            <ul className="hero-facts" role="list">
              <li>
                <strong>U.S.-registered</strong>Elementum Global LLC, Delaware
              </li>
              <li>
                <strong>Rooted in Africa</strong>Long-standing farm relationships
              </li>
              <li>
                <strong>Partner exporters</strong>Export handled at origin
              </li>
              <li>
                <strong>Responsible trade</strong>Organic &amp; Fairtrade prioritised
              </li>
            </ul>
          </div>
        </section>

        {/* INTRO */}
        <section className="section" aria-labelledby="intro-title">
          <div className="container intro-grid">
            <div className="intro-media" data-reveal>
              <Image
                src="/images/cacao.webp"
                alt="Fermented cacao beans drying on a wooden rack"
                width={1200}
                height={900}
                sizes="(max-width: 900px) 100vw, 50vw"
              />
              <div className="intro-badge">
                <strong>Cacao first.</strong>
                <span>Our core focus, sourced from Cameroon and other Central African origins.</span>
              </div>
            </div>
            <div className="intro-copy" data-reveal>
              <span className="eyebrow">About Elementum Global</span>
              <h2 id="intro-title" className="h2">
                Trade built on <span className="accent">relationships</span>, not just transactions.
              </h2>
              <p className="lead">
                We are a U.S.-registered commodity sourcing and trade facilitation company. Our roots are in
                long-standing family relationships with farms across Africa, and our role is to connect that
                supply with serious international buyers. We aim to make trade sustainable, fair and organic
                wherever possible.
              </p>
              <div className="attr-grid">
                <div className="attr">
                  <Sprout aria-hidden />
                  <h3>Close to origin</h3>
                  <p>Direct relationships with producers and partner exporters on the ground.</p>
                </div>
                <div className="attr">
                  <FileCheck2 aria-hidden />
                  <h3>Clear terms</h3>
                  <p>Origin, specifications and terms stated up front for every offer.</p>
                </div>
                <div className="attr">
                  <Route aria-hidden />
                  <h3>Coordinated execution</h3>
                  <p>One point of contact from first inquiry to shipment.</p>
                </div>
                <div className="attr">
                  <ShieldCheck aria-hidden />
                  <h3>Responsible sourcing</h3>
                  <p>Traceable, deforestation-free supply as the standard we work toward.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="section section--sand" aria-labelledby="products-title">
          <div className="container">
            <div className="section-head section-head--split" data-reveal>
              <div>
                <span className="eyebrow">Product portfolio</span>
                <h2 id="products-title" className="h2">
                  What we source <span className="accent">today.</span>
                </h2>
              </div>
              <p className="lead">
                Every lot is offered with its origin, specification and terms confirmed in writing.
                Availability changes with the season — tell us what you need and we will match it to current
                supply.
              </p>
            </div>

            <div className="product-grid">
              <article className="product product--lead" data-reveal>
                <div className="product-media">
                  <Image
                    src="/images/hero.webp"
                    alt="Cacao pods ripening on the tree"
                    fill
                    sizes="(max-width: 760px) 100vw, 55vw"
                    style={{ objectPosition: "75% center" }}
                  />
                  <span className="product-tag">Lead product</span>
                </div>
                <div className="product-body">
                  <span className="product-num">01</span>
                  <h3>Cacao beans</h3>
                  <p>
                    Dry, fermented cacao beans for importers, grinders and chocolate makers. Offers are lot-based
                    and come from partner-sourced supply in Cameroon, with further Central African origins
                    considered case by case.
                  </p>
                  <ul className="product-specs" role="list">
                    <li>
                      <span>Form</span>Dry fermented beans
                    </li>
                    <li>
                      <span>Origin</span>Cameroon &amp; Central Africa
                    </li>
                    <li>
                      <span>Terms</span>Typically FOB origin port
                    </li>
                    <li>
                      <span>Specs</span>Confirmed per lot
                    </li>
                  </ul>
                  <InquireLink product="cacao" className="btn btn--dark">
                    Request a cacao offer
                  </InquireLink>
                </div>
              </article>

              <article className="product" data-reveal style={{ ["--reveal-delay" as string]: "0ms" }}>
                <div className="product-media">
                  <Image src="/images/vanilla.webp" alt="Bundle of cured vanilla beans" fill sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="product-body">
                  <span className="product-num">02</span>
                  <h3>Vanilla</h3>
                  <p>Cured vanilla beans from our producer network. Grade, length and moisture specified per lot.</p>
                  <div className="chips">
                    <span className="chip">Cured beans</span>
                    <span className="chip">Grade per lot</span>
                  </div>
                  <InquireLink product="vanilla">Inquire about vanilla</InquireLink>
                </div>
              </article>

              <article className="product" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <div className="product-media">
                  <Image src="/images/coffee.webp" alt="Ripe red coffee cherries on the branch" fill sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="product-body">
                  <span className="product-num">03</span>
                  <h3>Coffee</h3>
                  <p>Green coffee from African origins. Variety, grade and available volume confirmed per offer.</p>
                  <div className="chips">
                    <span className="chip">Green coffee</span>
                    <span className="chip">Origin per offer</span>
                  </div>
                  <InquireLink product="coffee">Inquire about coffee</InquireLink>
                </div>
              </article>

              <article className="product" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
                <div className="product-media">
                  <Image src="/images/pepper.webp" alt="Whole black peppercorns and fresh green pepper berries" fill sizes="(max-width: 760px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
                <div className="product-body">
                  <span className="product-num">04</span>
                  <h3>Pepper</h3>
                  <p>Whole black pepper and related spices, sourced to your specification and confirmed per lot.</p>
                  <div className="chips">
                    <span className="chip">Whole black pepper</span>
                    <span className="chip">To specification</span>
                  </div>
                  <InquireLink product="pepper">Inquire about pepper</InquireLink>
                </div>
              </article>
            </div>

            <div className="expanding">
              <article className="expand-card expand-card--minerals" data-reveal>
                <Image src="/images/minerals.webp" alt="Raw copper ore, dark metallic ore and quartz on slate" fill sizes="(max-width: 760px) 100vw, 60vw" />
                <span className="status-pill">Expanding</span>
                <h3>Metals &amp; minerals</h3>
                <p>
                  We are building supplier relationships in metals and minerals. If you have a specific requirement,
                  tell us — we will let you know honestly where we can help.
                </p>
                <InquireLink product="metals-minerals">Register interest</InquireLink>
              </article>
              <article className="expand-card expand-card--agri" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <span className="status-pill">On request</span>
                <h3>Other agricultural products</h3>
                <p>
                  Our producer network reaches beyond our core four. Looking for another agricultural commodity
                  from Africa? Share the product and specification and we will check availability.
                </p>
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
                More than an introduction. <span className="accent">A coordinated trade.</span>
              </h2>
              <p className="lead">
                We sit between origin and buyer, so each side has one accountable counterpart.
              </p>
            </div>
            <ul className="services" role="list">
              <li className="service" data-reveal>
                <div className="service-icon">
                  <Search aria-hidden />
                </div>
                <h3>Sourcing &amp; introductions</h3>
                <p>We identify reliable supply and bring the right producers and buyers together.</p>
                <ul role="list">
                  <li>Identify reliable producers and exporters</li>
                  <li>Introduce supply to qualified buyers</li>
                </ul>
              </li>
              <li className="service" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <div className="service-icon">
                  <TrendingUp aria-hidden />
                </div>
                <h3>Buyer development</h3>
                <p>We look for long-term partners, not one-off deals.</p>
                <ul role="list">
                  <li>Find importers, traders and processors</li>
                  <li>Build repeat, long-term offtake relationships</li>
                </ul>
              </li>
              <li className="service" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
                <div className="service-icon">
                  <Handshake aria-hidden />
                </div>
                <h3>Transaction coordination</h3>
                <p>We keep each deal moving, from offer to shipment.</p>
                <ul role="list">
                  <li>Align specifications, terms and timelines</li>
                  <li>Coordinate communication and documents</li>
                </ul>
              </li>
            </ul>

            <div className="model" data-reveal>
              <div className="model-media">
                <Image src="/images/port.webp" alt="Container port with cranes at dusk" fill sizes="(max-width: 860px) 100vw, 50vw" />
              </div>
              <div className="model-copy">
                <span className="eyebrow">Our model</span>
                <h3>Clear roles. One point of contact.</h3>
                <p>
                  Export is handled by established partner exporters at origin. Elementum Global manages the
                  relationships and coordinates each transaction — and we aim to be clear about origin,
                  specifications and terms at every step.
                </p>
                <div className="model-roles">
                  <div className="model-role">
                    <strong>Partner exporters</strong>
                    <span>Aggregation, quality preparation, export documentation and loading at origin.</span>
                  </div>
                  <div className="model-role">
                    <strong>Elementum Global</strong>
                    <span>Buyer relationship, offer, specification alignment and transaction coordination.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="section section--sand" aria-labelledby="process-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="eyebrow">How we work</span>
              <h2 id="process-title" className="h2">
                From first inquiry <span className="accent">to shipment.</span>
              </h2>
            </div>
            <ol className="steps" role="list">
              <li className="step" data-reveal>
                <span className="step-num">STEP 01</span>
                <h3>Tell us what you need</h3>
                <p>Product, grade, volume, destination and timing. The more specific, the faster we can respond.</p>
              </li>
              <li className="step" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
                <span className="step-num">STEP 02</span>
                <h3>Offer &amp; specification</h3>
                <p>We match your request to available supply and share origin, specification and indicative terms.</p>
              </li>
              <li className="step" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
                <span className="step-num">STEP 03</span>
                <h3>Agree terms</h3>
                <p>Samples where needed, then price, quality, documentation and payment terms agreed in writing.</p>
              </li>
              <li className="step" data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
                <span className="step-num">STEP 04</span>
                <h3>Ship &amp; follow through</h3>
                <p>Our partner exporter ships; we coordinate documents and communication until delivery.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* WHO WE WORK WITH */}
        <section className="section" aria-labelledby="partners-title">
          <div className="container">
            <div className="section-head section-head--split" data-reveal>
              <div>
                <span className="eyebrow">Who we want to meet</span>
                <h2 id="partners-title" className="h2">
                  Partners for <span className="accent">long-term trade.</span>
                </h2>
              </div>
              <p className="lead">
                We are looking for counterparts who value reliable origin relationships and want to build
                volume over time.
              </p>
            </div>
            <ul className="audience" role="list">
              <li data-reveal>
                <Building2 aria-hidden />
                <h3>Importers &amp; traders</h3>
                <p>Cocoa and commodity importers sourcing from Africa.</p>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
                <Factory aria-hidden />
                <h3>Processors &amp; grinders</h3>
                <p>Cocoa processors needing consistent bean supply.</p>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
                <Leaf aria-hidden />
                <h3>Manufacturers</h3>
                <p>Chocolate and food makers buying at origin.</p>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
                <Ship aria-hidden />
                <h3>Trade &amp; logistics</h3>
                <p>Partners supporting trade flows into Europe and beyond.</p>
              </li>
              <li data-reveal style={{ ["--reveal-delay" as string]: "240ms" }}>
                <Network aria-hidden />
                <h3>Investors</h3>
                <p>Aligned investors with agribusiness experience.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* SUSTAINABILITY */}
        <section id="sustainability" className="section section--dark" aria-labelledby="sustain-title">
          <div className="container sustain-grid">
            <div className="sustain-copy" data-reveal>
              <span className="eyebrow">Sustainability commitment</span>
              <h2 id="sustain-title" className="h2">
                Good trade should <span className="accent">give back to its origin.</span>
              </h2>
              <p className="lead">
                Sustainability is not a label for us — it shapes which supply we take on and how we work with the
                communities behind it.
              </p>
              <Image
                src="/images/forest.webp"
                alt="Young cacao trees growing under tall shade trees in morning mist"
                width={1672}
                height={941}
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
            <div className="commitments-wrap" style={{ display: "grid", gap: "var(--space-4)" }}>
              <ul className="commitments" role="list">
                <li className="commitment" data-reveal>
                  <div className="commitment-icon">
                    <TreePine aria-hidden />
                  </div>
                  <h3>Reforestation</h3>
                  <p>A share of our revenue is set aside for reforestation in producing regions.</p>
                </li>
                <li className="commitment" data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
                  <div className="commitment-icon">
                    <HandHeart aria-hidden />
                  </div>
                  <h3>Local communities</h3>
                  <p>We support local communities around our supply chains and aim to give back where we trade.</p>
                </li>
                <li className="commitment" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
                  <div className="commitment-icon">
                    <Leaf aria-hidden />
                  </div>
                  <h3>Organic &amp; fair trade</h3>
                  <p>We prioritise organic and Fairtrade supply wherever it is available.</p>
                </li>
                <li className="commitment" data-reveal style={{ ["--reveal-delay" as string]: "180ms" }}>
                  <div className="commitment-icon">
                    <ShieldCheck aria-hidden />
                  </div>
                  <h3>Responsible sourcing</h3>
                  <p>Working toward traceable, deforestation-free supply, with no child labour and no forced labour.</p>
                </li>
              </ul>
              <div className="eudr-note" data-reveal>
                <FileCheck2 aria-hidden />
                <p>
                  <strong>Selling into the EU?</strong> We work with our partner exporters on the traceability
                  information that buyers need under the EU Deforestation Regulation (EUDR).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPANY */}
        <section id="company" className="section" aria-labelledby="company-title">
          <div className="container company">
            <div className="company-copy" data-reveal>
              <span className="eyebrow">The company</span>
              <h2 id="company-title" className="h2">
                Small team. <span className="accent">Long-term view.</span>
              </h2>
              <p className="lead">
                Elementum Global was founded to make trade between African origins and international markets more
                direct, transparent and fair. Our objectives are simple:
              </p>
              <ul className="objectives" role="list">
                <li>
                  <span>
                    <strong>Long-term offtake</strong> — build lasting relationships with buyers.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Real transactions</strong> — progress deals from first offer to shipment.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Give back</strong> — reinvest in the communities behind our supply.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Aligned growth</strong> — welcome investment that fits our model and values.
                  </span>
                </li>
              </ul>
            </div>
            <div className="facts" data-reveal>
              <dl>
                <div className="row">
                  <dt>Company</dt>
                  <dd>{site.legalName}</dd>
                </div>
                <div className="row">
                  <dt>Registered</dt>
                  <dd>Delaware, United States</dd>
                </div>
                <div className="row">
                  <dt>Focus</dt>
                  <dd>Commodity sourcing &amp; trade facilitation</dd>
                </div>
                <div className="row">
                  <dt>Products</dt>
                  <dd>Cacao, vanilla, coffee, pepper · expanding into metals &amp; minerals</dd>
                </div>
                <div className="row">
                  <dt>Co-founders</dt>
                  <dd>Joshua Hohl &amp; Brendan Ollivier</dd>
                </div>
                <div className="row">
                  <dt>Contact</dt>
                  <dd>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section section--sand" aria-labelledby="faq-title">
          <div className="container faq-wrap">
            <div className="section-head section-head--center" data-reveal>
              <span className="eyebrow">Frequently asked</span>
              <h2 id="faq-title" className="h2">
                Answers for <span className="accent">buyers.</span>
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

        {/* INQUIRY */}
        <section id="inquiry" className="section" aria-labelledby="inquiry-title">
          <div className="container inquiry-grid">
            <div className="inquiry-copy" data-reveal>
              <span className="eyebrow">Register your interest</span>
              <h2 id="inquiry-title" className="h2">
                Your next origin partner is <span className="accent">one message away.</span>
              </h2>
              <p className="lead">
                Whether you are looking for a specific lot of cacao or exploring a new origin for vanilla, coffee,
                pepper or minerals, tell us what you need. We will come back with a relevant answer — not a
                generic price list.
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
                <li>
                  <span className="contact-icon">
                    <MapPin aria-hidden />
                  </span>
                  <div>
                    <small>Registered</small>
                    <span>{site.legalName} · Delaware, USA</span>
                  </div>
                </li>
                <li>
                  <span className="contact-icon">
                    <Users aria-hidden />
                  </span>
                  <div>
                    <small>Working with</small>
                    <span>Buyers, processors, partners &amp; producers</span>
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
