'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { NewsArticle, getLatestNews } from "@/lib/news-service"
import { ServiceCard } from "../components/service-card"
import ProjectUpdates from '@/components/ProjectUpdates'

const cities = [
  // Americas
  { name: "New York", x: 285, y: 280, size: 6, importance: "major" },
  { name: "Los Angeles", x: 200, y: 320, size: 5, importance: "major" },
  { name: "Vancouver", x: 180, y: 250, size: 4, importance: "minor" },
  { name: "São Paulo", x: 350, y: 500, size: 5, importance: "major" },
  
  // Europe
  { name: "London", x: 520, y: 250, size: 6, importance: "major" },
  { name: "Rotterdam", x: 540, y: 260, size: 5, importance: "major" },
  { name: "Hamburg", x: 550, y: 240, size: 4, importance: "minor" },
  
  // Asia & Pacific
  { name: "Singapore", x: 820, y: 450, size: 6, importance: "major" },
  { name: "Hong Kong", x: 850, y: 380, size: 5, importance: "major" },
  { name: "Tokyo", x: 900, y: 320, size: 5, importance: "major" },
  { name: "Shanghai", x: 850, y: 350, size: 4, importance: "minor" },
  { name: "Sydney", x: 900, y: 550, size: 4, importance: "minor" },
  
  // Middle East & Africa
  { name: "Dubai", x: 680, y: 380, size: 5, importance: "major" },
  { name: "Cape Town", x: 580, y: 550, size: 4, importance: "minor" }
];

// Define specific trade routes to reduce clutter
const tradeRoutes = [
  ["Los Angeles", "Shanghai"],
  ["Los Angeles", "Tokyo"],
  ["Vancouver", "Hong Kong"],
  ["New York", "London"],
  ["New York", "Rotterdam"],
  ["Rotterdam", "Singapore"],
  ["Hamburg", "Dubai"],
  ["London", "Hong Kong"],
  ["São Paulo", "Cape Town"],
  ["Singapore", "Shanghai"],
  ["Hong Kong", "Tokyo"],
  ["Dubai", "Singapore"]
];

export default function Page() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai' | 'market', content: string}>>([]);

  // Add scroll restoration control
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Disable the browser's scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Example questions array
  const exampleQuestions = [
    "What's driving the current gold price movements?",
    "How are forex markets responding to recent economic data?",
    "What's the outlook for commodity prices this quarter?"
  ];

  const submitQuestion = async (question: string) => {
    setChatMessages(prev => [...prev, { type: 'user', content: question }]);
    // Add actual API call implementation here
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.scroll-animation').forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    getLatestNews().then(setArticles);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-foreground">
      <style jsx global>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
            filter: blur(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
          background-size: 200% auto;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(1deg); }
          50% { transform: translate(0, -20px) rotate(0deg); }
          75% { transform: translate(-10px, -10px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg) scale(0.95); }
          to { transform: rotate(360deg) scale(1.05); }
        }

        .spiral-bg {
          position: absolute;
          width: 120%;
          height: 120%;
          left: -10%;
          top: -10%;
          background: radial-gradient(circle at center, rgba(252, 157, 68, 0.15) 0%, transparent 70%);
          animation: rotate 60s linear infinite;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dynamic-bg {
          position: absolute;
          inset: -20px;
          background: 
            radial-gradient(circle at 20% 20%, rgba(252, 157, 68, 0.08) 0%, transparent 70%),
            radial-gradient(circle at 80% 80%, rgba(252, 157, 68, 0.08) 0%, transparent 70%);
          filter: blur(80px);
          opacity: 0.7;
          z-index: 0;
          animation: float 30s ease-in-out infinite;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.6s; }
        .delay-3 { animation-delay: 0.9s; }
        
        .glimmer-card {
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(252, 157, 68, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glimmer-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 40px -20px rgba(252, 157, 68, 0.3),
            0 0 20px rgba(252, 157, 68, 0.1);
          border-color: rgba(252, 157, 68, 0.3);
          background: rgba(0, 0, 0, 0.4);
        }
        
        .glimmer-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(252, 157, 68, 0.15),
            rgba(252, 157, 68, 0.25),
            rgba(252, 157, 68, 0.15),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glimmer-card:hover::before {
          opacity: 1;
        }

        .service-icon-container {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glimmer-card:hover .service-icon-container {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 
            0 0 30px -5px rgba(252, 157, 68, 0.3),
            inset 0 0 20px rgba(252, 157, 68, 0.2);
        }

        @keyframes nodeGlow {
          0%, 100% { r: var(--base-size); opacity: 0.8; }
          50% { r: calc(var(--base-size) * 1.3); opacity: 0.4; }
        }

        @keyframes cityAppear {
          0% { 
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.2);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes labelAppear {
          0% { 
            opacity: 0;
            transform: translateY(10px);
          }
          100% { 
            opacity: 0.6;
            transform: translateY(0);
          }
        }
        
        @keyframes tradeRoute {
          0% { 
            stroke-dashoffset: 1000; 
            opacity: 0; 
          }
          100% { 
            stroke-dashoffset: 0; 
            opacity: 0.4; 
          }
        }
        
        .trade-route {
          stroke-dasharray: 1000;
          animation: tradeRoute 3s ease-in-out forwards;
          opacity: 0;
        }

        .trade-route:hover {
          opacity: 0.8;
          filter: drop-shadow(0 0 12px rgba(252, 157, 68, 0.6));
          stroke-width: 2;
        }

        .city-node {
          animation: cityAppear 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        .city-label {
          animation: labelAppear 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        .scroll-animation {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          filter: blur(10px);
        }

        .scroll-animation.animate-in {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }

        .scroll-delay-1 { transition-delay: 0.3s; }
        .scroll-delay-2 { transition-delay: 0.6s; }
        .scroll-delay-3 { transition-delay: 0.9s; }
      `}</style>

      {/* World Map and Trade Routes */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="spiral-bg"></div>
        <div className="dynamic-bg"></div>
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
          {/* Cities First */}
          {cities.map((city, index) => (
            <g key={city.name}>
              <circle
                cx={city.x}
                cy={city.y + 40}
                r={city.size}
                className="city-node"
                fill="#BF946B"
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  '--base-size': `${city.size}px`
                } as any}
              />
              <text
                x={city.x}
                y={city.y + 60}
                className="city-label text-xs fill-neutral-400"
                textAnchor="middle"
                style={{ 
                  animationDelay: `${(index * 200) + 500}ms`
                }}
              >
                {city.name}
              </text>
            </g>
          ))}

          {/* Trade Routes After */}
          {tradeRoutes.map((route, i) => {
            const start = cities.find(c => c.name === route[0]);
            const end = cities.find(c => c.name === route[1]);
            if (!start || !end) return null;

            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 20;

            return (
              <path
                key={`route-${i}`}
                className="trade-route"
                d={`M${start.x},${start.y + 40} Q${midX},${midY} ${end.x},${end.y + 40}`}
                stroke="#BF946B"
                strokeWidth="1"
                fill="none"
                style={{ 
                  animationDelay: `${(cities.length * 200) + 1000 + (i * 300)}ms`
                }}
              />
            );
          })}
        </svg>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center -translate-y-40">
          <div className="text-center px-6 scroll-animation space-y-4">
            <div className="relative h-[750px] w-[750px] mx-auto mb-4">
              <Image
                src="/images/Elementum Global-1000x1000.png"
                alt="Elementum Global"
                fill
                className="object-contain filter contrast-125 brightness-110 sepia-[0.1] hue-rotate-[5deg]"
                priority
                style={{ filter: 'brightness(0.95) sepia(0.2) hue-rotate(355deg) saturate(1.5)' }}
              />
            </div>
            <div className="inline-flex items-center px-3 py-1 text-sm text-[#BF946B] mb-2 glimmer-pill">
              <span>Global Trading & Financial Services</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight fade-in delay-1 animate-gradient bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-[length:200%_auto] bg-clip-text text-transparent transition-all duration-300 hover:scale-[1.02]" style={{ textShadow: '0 0 30px rgba(252,157,68,0.2)', letterSpacing: '-0.02em' }}>
              Transform Your Business<br />
              With Global Solutions
            </h2>
            <p className="text-xl text-neutral-400 mb-4 max-w-2xl mx-auto fade-in delay-2">
              Empowering businesses with secure and efficient global trading capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in delay-3">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-[#FC9D44] hover:bg-[#BF946B] text-white px-12 py-8 text-xl font-bold" asChild>
                <Link href="/get-started">Schedule Consultation</Link>
              </Button>
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-[#FC9D44] hover:bg-[#BF946B] text-white px-8 py-6 text-lg font-bold" asChild>
                <Link href="/market-ai">Market Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Updates Section */}
      <ProjectUpdates />

      {/* Services Section */}
      <section className="py-20 px-6 bg-black/30 backdrop-blur-md relative">
        <div className="max-w-[1200px] mx-auto scroll-animation">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-clip-text text-transparent">Our Services</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Comprehensive trading and financial solutions tailored to your business needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Precious Metals */}
            <div className="space-y-8">
              <ServiceCard
                title="Precious Metals"
                description="Global trading solutions for gold, silver, and other precious metals. We facilitate secure and efficient transactions worldwide."
                icon={
                  <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
                features={[
                  "Secure Storage Solutions",
                  "Global Market Access",
                  "Competitive Pricing"
                ]}
                href="/services/precious-metals"
              />

              <ServiceCard
                title="Food Products"
                description="International trade and distribution of agricultural and food commodities, ensuring quality and reliability."
                icon={
                  <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z M12 8v8 M8 12h8" />
                  </svg>
                }
                features={[
                  "Quality Assurance",
                  "Global Distribution Network",
                  "Supply Chain Management"
                ]}
                href="/services/food-products"
              />
            </div>

            <div className="space-y-8">
              <ServiceCard
                title="OTC Trading"
                description="Secure and efficient cryptocurrency exchange services with competitive rates and personalized support."
                icon={
                  <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                features={[
                  "Competitive Rates",
                  "Secure Transactions",
                  "Expert Guidance"
                ]}
                href="/services/otc-trading"
              />

              <ServiceCard
                title="Petroleum Services"
                description="Comprehensive petroleum trading and distribution solutions, ensuring reliable supply chain and competitive pricing in global energy markets."
                icon={
                  <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                }
                features={[
                  "Global Distribution",
                  "Market Analysis",
                  "Supply Chain Solutions"
                ]}
                href="/services/petroleum-services"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Summary Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-[1200px] mx-auto scroll-animation">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-clip-text text-transparent">Who We Are</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Your trusted partner in global trade and financial solutions</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#BF946B]/10">
                <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Our Story</h3>
              <p className="text-neutral-400">
                Founded on principles of integrity and excellence, bridging markets and creating opportunities worldwide.
              </p>
            </div>

            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#BF946B]/10">
                <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-neutral-400">
                Empowering businesses through secure, efficient, and innovative trading solutions.
              </p>
            </div>

            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#BF946B]/10">
                <svg className="w-12 h-12 text-[#BF946B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Global Vision</h3>
              <p className="text-neutral-400">
                Connecting markets across borders with integrity and excellence.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="rounded-full border-[#BF946B] text-[#BF946B] hover:bg-[#BF946B]/10"
              asChild
            >
              <Link href="/about-us">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog/News Section */}
      <section className="py-20 px-6 bg-black/30 backdrop-blur-md relative">
        <div className="max-w-[1200px] mx-auto scroll-animation">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-clip-text text-transparent">Latest Insights</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Stay informed with the latest updates in global trade and finance</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={index} className="glimmer-card p-6 hover-float">
                <div className="aspect-video mb-4 bg-[#BF946B]/10 rounded-lg overflow-hidden">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#BF946B]/20 to-transparent" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#BF946B] px-3 py-1 rounded-full bg-[#BF946B]/10 inline-block">
                    {article.category}
                  </p>
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{article.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2">
                    {article.description}
                  </p>
                  <Link 
                    href="/latest-insights"
                    className="text-sm text-[#BF946B] hover:text-[#FC9D44] transition-colors inline-flex items-center gap-1"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="rounded-full border-[#BF946B] text-[#BF946B] hover:bg-[#BF946B]/10"
              asChild
            >
              <Link href="/latest-insights">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-[800px] mx-auto text-center scroll-animation">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-neutral-400 mb-8">
            Let's discuss how we can help achieve your trading and financial goals
          </p>
          <Button 
            size="lg" 
            className="rounded-full bg-[#FC9D44] hover:bg-[#BF946B] text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/get-started">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}