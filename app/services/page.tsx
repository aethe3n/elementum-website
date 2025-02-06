'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesPage() {
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
            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Precious Metals</h2>
              <p className="text-neutral-400 mb-6">
                Global trading solutions for gold, silver, and other precious metals. We facilitate secure and efficient transactions worldwide.
              </p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Storage Solutions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Global Market Access
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Competitive Pricing
                </li>
              </ul>
            </div>

            {/* Food Products */}
            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z M12 8v8 M8 12h8" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Food Products</h2>
              <p className="text-neutral-400 mb-6">
                International trade and distribution of agricultural and food commodities, ensuring quality and reliability.
              </p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Quality Assurance
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Global Distribution Network
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Supply Chain Management
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            {/* OTC Trading */}
            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">OTC Trading</h2>
              <p className="text-neutral-400 mb-6">
                Secure and efficient cryptocurrency exchange services with competitive rates and personalized support.
              </p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Competitive Rates
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Transactions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Expert Guidance
                </li>
              </ul>
            </div>

            {/* Escrow Services */}
            <div className="glimmer-card p-8 hover-float">
              <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
                <svg className="w-12 h-12 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Petroleum Services</h2>
              <p className="text-neutral-400 mb-6">
                Comprehensive petroleum trading and distribution solutions, ensuring reliable supply chain and competitive pricing in global energy markets.
              </p>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Global Distribution
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Market Analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Supply Chain Solutions
                </li>
              </ul>
            </div>
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
            size="lg" 
            className="rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/get-started">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 