'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function PreciousMetalsPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">Precious Metals Trading</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Global trading solutions for gold, silver, platinum, and other precious metals
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Overview Section */}
            <div className="scroll-animation">
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-bold mb-6">Our Precious Metals Services</h2>
                <p className="text-neutral-400 mb-6">
                  We provide comprehensive precious metals trading services, facilitating secure and efficient transactions worldwide. Our expertise spans across various precious metals markets, ensuring optimal execution and competitive pricing for our clients.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Physical Trading</h3>
                      <p className="text-neutral-400">Direct trading of physical precious metals with secure storage and delivery options</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Market Analysis</h3>
                      <p className="text-neutral-400">Expert market analysis and price forecasting to support informed trading decisions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2">Secure Storage</h3>
                      <p className="text-neutral-400">State-of-the-art vault facilities with comprehensive insurance coverage</p>
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
                      24/7 Global Market Access
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Competitive Pricing Structure
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure Transaction Processing
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Expert Market Guidance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 scroll-animation scroll-delay-2">
            <div className="glimmer-card p-8">
              <h2 className="text-2xl font-bold mb-6">Why Choose Us for Precious Metals Trading?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Experience</h3>
                  <p className="text-neutral-400">Years of expertise in precious metals markets with a proven track record of successful trades</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Security</h3>
                  <p className="text-neutral-400">Industry-leading security measures protecting your assets and transactions</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Support</h3>
                  <p className="text-neutral-400">Dedicated support team available 24/7 to assist with your trading needs</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center scroll-animation scroll-delay-3">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Ready to Start Trading?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
              Contact us to discuss your precious metals trading needs and learn how we can help you achieve your investment goals
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