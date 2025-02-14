"use client";

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
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

        {/* Content */}
        <div className="relative z-10 glimmer-card p-8 backdrop-blur-sm">
          <div className="w-16 h-16 bg-[#B87D3B]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-[#B87D3B]" />
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4">
            Premium Plans Coming Soon
          </h1>
          
          <p className="text-xl text-neutral-400 mb-8">
            We're working hard to bring you our premium features. Stay tuned for exciting updates!
          </p>
          
          <div className="space-y-6">
            <div className="p-4 bg-black/30 rounded-lg border border-[#B87D3B]/20">
              <h3 className="text-lg font-medium text-[#B87D3B] mb-2">What to Expect</h3>
              <ul className="text-neutral-300 space-y-2">
                <li>• Advanced Market Analysis Tools</li>
                <li>• Real-time Trading Signals</li>
                <li>• Priority Support</li>
                <li>• Custom Alerts</li>
                <li>• Portfolio Management</li>
              </ul>
            </div>
            
            <Button
              variant="outline"
              className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B] hover:text-white"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 