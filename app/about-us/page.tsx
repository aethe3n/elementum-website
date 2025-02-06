'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function AboutUsPage() {
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
          <div className="text-center mb-16 branded-section py-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">About Elementum Global</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Your trusted partner in global trade and financial solutions
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 branded-section py-20">
            {/* Our Story */}
            <div className="scroll-animation">
              <div className="glimmer-card p-8">
                <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                  <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Our Story</h2>
                <p className="text-neutral-400 mb-6">
                  Founded on the principles of integrity and excellence, Elementum Global has established itself as a leading force in international trade. We bridge markets and create opportunities for businesses worldwide.
                </p>
              </div>
            </div>

            {/* Our Mission */}
            <div className="scroll-animation scroll-delay-1">
              <div className="glimmer-card p-8">
                <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                  <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
                <p className="text-neutral-400 mb-6">
                  To empower businesses through secure, efficient, and innovative trading solutions. We strive to create lasting partnerships and facilitate global commerce with integrity and excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-12 scroll-animation scroll-delay-2 branded-section py-20">
            <div className="glimmer-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Our Core Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Integrity</h3>
                  </div>
                  <p className="text-neutral-400">Conducting business with honesty and transparency</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="text-lg font-semibold">Excellence</h3>
                  </div>
                  <p className="text-neutral-400">Delivering superior service and results</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <h3 className="text-lg font-semibold">Global Vision</h3>
                  </div>
                  <p className="text-neutral-400">Connecting markets across borders</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center scroll-animation scroll-delay-3 branded-section py-20">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Ready to Partner With Us?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join us in shaping the future of global trade
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