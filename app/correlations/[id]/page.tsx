'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CorrelationData {
  date: string
  value: number
}

interface DetailedCorrelation {
  title: string
  impact: 'positive' | 'negative' | 'neutral'
  correlation: number
  description: string
  details: string
  historicalData: CorrelationData[]
  analysis: string
  relatedFactors: string[]
}

// Mock data - In production, this would come from your API
const MOCK_CORRELATIONS: Record<string, DetailedCorrelation> = {
  'fed-interest-rate': {
    title: "Fed Interest Rate Decision",
    impact: "negative",
    correlation: -0.75,
    description: "Strong negative correlation with precious metals prices",
    details: "Federal Reserve interest rate decisions have historically shown a significant inverse relationship with precious metals prices, particularly gold. When interest rates rise, the opportunity cost of holding non-yielding assets like gold increases, typically leading to price pressure on precious metals.",
    historicalData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 1).toISOString(),
      value: -0.75 + (Math.random() * 0.2 - 0.1)
    })),
    analysis: "The Federal Reserve's monetary policy decisions, particularly interest rate changes, have been a crucial driver of precious metals market dynamics. Higher rates typically strengthen the USD and increase the opportunity cost of holding non-yielding assets like gold, creating downward pressure on prices.",
    relatedFactors: [
      "USD Strength",
      "Inflation Expectations",
      "Market Risk Sentiment",
      "Global Economic Conditions"
    ]
  },
  'global-supply-chain': {
    title: "Global Supply Chain Updates",
    impact: "positive",
    correlation: 0.82,
    description: "Positive impact on commodity market movements",
    details: "Supply chain disruptions and improvements have shown a strong positive correlation with commodity market movements. Changes in global logistics efficiency directly impact commodity availability and pricing across markets.",
    historicalData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 1).toISOString(),
      value: 0.82 + (Math.random() * 0.2 - 0.1)
    })),
    analysis: "Global supply chain dynamics have become increasingly important in commodity market analysis. Disruptions can lead to supply constraints and price increases, while improvements in logistics efficiency can help normalize market conditions.",
    relatedFactors: [
      "Shipping Costs",
      "Port Congestion",
      "Manufacturing Output",
      "Trade Relations"
    ]
  },
  'economic-growth': {
    title: "Economic Growth Data",
    impact: "neutral",
    correlation: 0.12,
    description: "Limited correlation with current forex trends",
    details: "Economic growth indicators have shown varying degrees of correlation with forex markets, depending on relative growth rates between countries and broader market conditions.",
    historicalData: Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2023, i, 1).toISOString(),
      value: 0.12 + (Math.random() * 0.2 - 0.1)
    })),
    analysis: "The relationship between economic growth and forex markets is complex and often influenced by multiple factors. While growth differentials between countries can impact currency values, the correlation is not always straightforward.",
    relatedFactors: [
      "GDP Growth Rates",
      "Employment Data",
      "Industrial Production",
      "Consumer Spending"
    ]
  }
}

export default function CorrelationPage({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [correlation, setCorrelation] = useState<DetailedCorrelation | null>(null)

  useEffect(() => {
    // In production, this would be an API call
    setCorrelation(MOCK_CORRELATIONS[params.id])
  }, [params.id])

  useEffect(() => {
    if (!canvasRef.current || !correlation?.historicalData) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = '#4A4A4A'
    ctx.lineWidth = 1
    
    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    
    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Plot data points
    const data = correlation.historicalData
    const xStep = (width - 2 * padding) / (data.length - 1)
    const yScale = (height - 2 * padding) / 2 // Scale for correlation range [-1, 1]

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = '#2A2A2A'
    ctx.setLineDash([5, 5])
    
    // Horizontal grid lines
    for (let i = -1; i <= 1; i += 0.25) {
      const y = height - padding - (i + 1) * yScale
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      
      // Add labels
      ctx.fillStyle = '#808080'
      ctx.font = '12px Inter'
      ctx.textAlign = 'right'
      ctx.fillText(i.toFixed(2), padding - 10, y + 4)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Plot line
    ctx.beginPath()
    ctx.strokeStyle = correlation.impact === 'positive' 
      ? '#22C55E' 
      : correlation.impact === 'negative'
      ? '#EF4444'
      : '#EAB308'
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - (point.value + 1) * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Add date labels for first and last points
      if (i === 0 || i === data.length - 1) {
        ctx.fillStyle = '#808080'
        ctx.font = '12px Inter'
        ctx.textAlign = 'center'
        ctx.fillText(new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }), x, height - padding + 20)
      }
    })
    ctx.stroke()

  }, [correlation])

  if (!correlation) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#B87D3B] border-t-transparent rounded-full"></div>
      </div>
    )
  }

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
          {/* Header */}
          <div className="mb-12">
            <Button
              variant="outline"
              className="mb-8 border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
              asChild
            >
              <Link href="/latest-insights">← Back to Insights</Link>
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-4">{correlation.title}</h1>
                <p className="text-xl text-neutral-400">{correlation.description}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm ${
                correlation.impact === 'positive' 
                  ? 'bg-green-500/20 text-green-400'
                  : correlation.impact === 'negative'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {correlation.impact.charAt(0).toUpperCase() + correlation.impact.slice(1)} Impact
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2">
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-semibold mb-6">Historical Correlation</h2>
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full"
                />
                <div className="mt-6 text-sm text-neutral-400">
                  This chart shows the historical correlation strength over the past 12 months
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-8">
              {/* Correlation Strength */}
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-semibold mb-4">Correlation Strength</h2>
                <div className="text-4xl font-bold mb-2">
                  {(correlation.correlation * 100).toFixed(0)}%
                </div>
                <div className="text-neutral-400">
                  {Math.abs(correlation.correlation) > 0.7 
                    ? 'Strong correlation'
                    : Math.abs(correlation.correlation) > 0.3
                    ? 'Moderate correlation'
                    : 'Weak correlation'}
                </div>
              </div>

              {/* Related Factors */}
              <div className="glimmer-card p-8">
                <h2 className="text-2xl font-semibold mb-4">Related Factors</h2>
                <div className="space-y-2">
                  {correlation.relatedFactors.map((factor, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-neutral-400"
                    >
                      <svg className="w-4 h-4 text-[#B87D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="mt-8">
            <div className="glimmer-card p-8">
              <h2 className="text-2xl font-semibold mb-4">Detailed Analysis</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-neutral-400 mb-6">{correlation.details}</p>
                <h3 className="text-xl font-semibold mb-4">Market Impact Analysis</h3>
                <p className="text-lg text-neutral-400">{correlation.analysis}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 