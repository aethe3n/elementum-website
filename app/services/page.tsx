'use client'

import { Button } from "@/components/ui/button"
import { ServiceCard } from "@/components/service-card"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { trackEvent, trackEngagement, trackConversion } from '@/lib/utils'

export default function ServicesPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Track services page view
    trackEvent('page_view', { page: 'services' });

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

  const handleServiceClick = (serviceName: string) => {
    trackEngagement('service_click', { service: serviceName });
  };

  const handleGetStartedClick = () => {
    trackConversion('service_inquiry');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#B87D3B]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#B87D3B" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Services Header */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">Our Services</h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Comprehensive trading solutions designed to empower your global business operations
          </p>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="relative z-10 py-20 px-6 bg-black/30 branded-section">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12">
          {/* Precious Metals */}
          <div className="space-y-8">
            <ServiceCard
              title="Precious Metals"
              description="Global trading solutions for gold, silver, and other precious metals. We facilitate secure and efficient transactions worldwide."
              icon={
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              features={[
                "Secure Storage Solutions",
                "Global Market Access",
                "Competitive Pricing"
              ]}
              href="/services/precious-metals"
              onClick={() => handleServiceClick('precious_metals')}
            />

            <ServiceCard
              title="Food Products"
              description="International trade and distribution of agricultural and food commodities, ensuring quality and reliability."
              icon={
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z M12 8v8 M8 12h8" />
                </svg>
              }
              features={[
                "Quality Assurance",
                "Global Distribution Network",
                "Supply Chain Management"
              ]}
              href="/services/food-products"
              onClick={() => handleServiceClick('food_products')}
            />
          </div>

          <div className="space-y-8">
            <ServiceCard
              title="OTC Trading"
              description="Secure and efficient cryptocurrency exchange services with competitive rates and personalized support."
              icon={
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              features={[
                "Competitive Rates",
                "Secure Transactions",
                "Expert Guidance"
              ]}
              href="/services/otc-trading"
              onClick={() => handleServiceClick('otc_trading')}
            />

            <ServiceCard
              title="Petroleum Services"
              description="Comprehensive petroleum trading and distribution solutions, ensuring reliable supply chain and competitive pricing in global energy markets."
              icon={
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              features={[
                "Global Distribution",
                "Market Analysis",
                "Supply Chain Solutions"
              ]}
              href="/services/petroleum-services"
              onClick={() => handleServiceClick('petroleum_services')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 branded-section">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-neutral-400 mb-8">
            Contact us today to discuss how we can help transform your business with our global trading solutions.
          </p>
          <Button 
            onClick={handleGetStartedClick}
            size="lg" 
            className="rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/get-started">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 