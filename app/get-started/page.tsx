'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function GetStartedPage() {
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Started with Elementum Global</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Begin your journey towards efficient and secure global trading solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="scroll-animation">
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-black/30 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87D3B] text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 bg-black/30 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87D3B] text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-black/30 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87D3B] text-white"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full px-4 py-2 bg-black/30 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B87D3B] text-white h-32"
                      placeholder="Tell us about your needs"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-[#B87D3B] hover:bg-[#96652F] text-white">
                    Submit Request
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Schedule Meeting Section */}
              <div className="scroll-animation">
                <div className="glimmer-card p-8">
                  <h3 className="text-xl font-bold mb-4">Schedule a Meeting</h3>
                  <p className="text-neutral-400 mb-6">
                    Prefer to discuss your needs directly? Schedule a consultation with our team at your convenience.
                  </p>
                  <Button 
                    className="w-full bg-[#B87D3B] hover:bg-[#96652F] text-white transition-all duration-300 py-6 text-lg font-medium relative overflow-hidden group"
                    asChild
                  >
                    <Link 
                      href="https://app.reclaim.ai/m/elementum-global/introduction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Schedule a Consultation</span>
                      <svg 
                        className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" 
                        />
                      </svg>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Why Choose Us Section */}
              <div className="scroll-animation scroll-delay-1">
                <div className="glimmer-card p-8">
                  <h3 className="text-xl font-bold mb-4">Why Choose Us</h3>
                  <ul className="space-y-4 text-neutral-400">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Global Network of Partners
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Secure Transaction Management
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tailored Trading Solutions
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="scroll-animation scroll-delay-2">
                <div className="glimmer-card p-8">
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4 text-neutral-400">
                    <p className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      elementumglobal.llc@gmail.com
                    </p>
                    <p className="flex items-center">
                      <svg className="w-6 h-6 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +1 805 338-1909
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 