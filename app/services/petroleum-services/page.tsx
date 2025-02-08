'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function PetroleumServicesPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

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

      <main className="relative z-10 py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">Petroleum Services</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Comprehensive petroleum trading and logistics solutions for global energy markets
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Overview Section */}
            <div className="scroll-animation">
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-bold mb-6">Our Petroleum Services</h2>
                <p className="text-neutral-400 mb-6">
                  We offer end-to-end solutions in petroleum trading, storage, and distribution. Our services are designed to meet the complex needs of the global energy market while ensuring reliability and efficiency.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Trading Solutions</h3>
                      <p className="text-neutral-400">Comprehensive trading services for crude oil and refined products</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Storage & Distribution</h3>
                      <p className="text-neutral-400">Strategic storage facilities and efficient distribution networks</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Risk Management</h3>
                      <p className="text-neutral-400">Advanced risk management and hedging strategies</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-8">
              <div className="scroll-animation scroll-delay-1">
                <div className="glimmer-card p-8">
                  <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                  <ul className="space-y-4 text-neutral-400">
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Global Market Access
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Logistics Expertise
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Quality Assurance
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Regulatory Compliance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 scroll-animation scroll-delay-2">
            <div className="glimmer-card p-8">
              <h2 className="text-2xl font-bold mb-6">Why Choose Our Petroleum Services?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Experience</h3>
                  <p className="text-neutral-400">Decades of industry expertise and market knowledge</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Infrastructure</h3>
                  <p className="text-neutral-400">State-of-the-art storage and distribution facilities</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Network</h3>
                  <p className="text-neutral-400">Extensive global network of partners and suppliers</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center scroll-animation scroll-delay-3">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Ready to Partner With Us?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
              Contact our team to discuss how our petroleum services can benefit your business
            </p>
            <Button 
              size="lg" 
              className="rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white px-8 py-6 text-lg"
              asChild
            >
              <Link href="/get-started">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
} 