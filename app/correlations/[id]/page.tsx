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

// This would come from your API in production
const MOCK_CORRELATION_DATA: Record<string, DetailedCorrelation> = {
  'fed-interest-rate': {
    title: "Fed Interest Rate Decision",
    impact: "negative",
    correlation: -0.75,
    description: "Strong negative correlation with gold prices",
    details: "Recent Fed policy shifts show a -0.75 correlation coefficient with gold prices, indicating significant inverse relationship between rate decisions and precious metal valuations.",
    historicalData: [
      { date: '2024-01', value: -0.72 },
      { date: '2024-02', value: -0.75 },
      { date: '2024-03', value: -0.78 },
    ],
    analysis: "Federal Reserve interest rate decisions have shown a consistently strong negative correlation with gold prices over the past quarter. This relationship is driven by several factors including the opportunity cost of holding non-yielding assets and USD strength.",
    relatedFactors: [
      "USD Index Performance",
      "Treasury Yields",
      "Inflation Expectations"
    ]
  },
  'supply-chain': {
    title: "Global Supply Chain Updates",
    impact: "positive",
    correlation: 0.82,
    description: "Positive impact on commodity price movements",
    details: "Supply chain disruptions show 0.82 correlation with commodity price increases, particularly affecting industrial metals and energy sectors.",
    historicalData: [
      { date: '2024-01', value: 0.80 },
      { date: '2024-02', value: 0.82 },
      { date: '2024-03', value: 0.85 },
    ],
    analysis: "Global supply chain metrics have maintained a strong positive correlation with commodity prices, particularly in industrial metals and energy sectors. Disruptions in key shipping routes and production centers continue to drive price movements.",
    relatedFactors: [
      "Container Shipping Rates",
      "Port Congestion Metrics",
      "Manufacturing PMI"
    ]
  },
  'economic-growth': {
    title: "Economic Growth Data",
    impact: "neutral",
    correlation: 0.12,
    description: "Limited correlation with forex trends",
    details: "GDP growth rates show minimal correlation (0.12) with major currency pairs, suggesting other factors are currently driving forex markets.",
    historicalData: [
      { date: '2024-01', value: 0.15 },
      { date: '2024-02', value: 0.12 },
      { date: '2024-03', value: 0.10 },
    ],
    analysis: "Economic growth indicators have shown surprisingly low correlation with major currency pairs this quarter. This suggests that other factors, such as monetary policy and geopolitical events, are currently the dominant drivers of forex market movements.",
    relatedFactors: [
      "GDP Growth Rates",
      "Employment Data",
      "Consumer Spending"
    ]
  }
}

export default function CorrelationPage({ params }: { params: { id: string } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<DetailedCorrelation | null>(null)

  useEffect(() => {
    // In production, this would be an API call
    setData(MOCK_CORRELATION_DATA[params.id])
  }, [params.id])

  useEffect(() => {
    if (!canvasRef.current || !data) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const width = 800
    const height = 400
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = '#4A4A4A'
    ctx.lineWidth = 2
    
    // X axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    
    // Y axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Plot data points
    const dataPoints = data.historicalData
    const xStep = (width - 2 * padding) / (dataPoints.length - 1)
    const yScale = (height - 2 * padding) / 2 // Scale for correlation range [-1, 1]

    ctx.beginPath()
    ctx.strokeStyle = data.impact === 'positive' 
      ? '#22C55E' 
      : data.impact === 'negative'
      ? '#EF4444'
      : '#EAB308'
    ctx.lineWidth = 3

    dataPoints.forEach((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - ((point.value + 1) * yScale)
      
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Add labels
    ctx.font = '12px Inter'
    ctx.fillStyle = '#9CA3AF'
    ctx.textAlign = 'center'
    
    // X axis labels
    dataPoints.forEach((point, i) => {
      const x = padding + i * xStep
      ctx.fillText(point.date, x, height - padding + 20)
    })

    // Y axis labels
    ctx.textAlign = 'right'
    ctx.fillText('-1.0', padding - 10, height - padding)
    ctx.fillText('0.0', padding - 10, height - padding - yScale)
    ctx.fillText('1.0', padding - 10, padding)

  }, [data])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <Button
            variant="outline"
            className="mb-8 rounded-full border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
            asChild
          >
            <Link href="/latest-insights">← Back to Insights</Link>
          </Button>

          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <div className={`px-3 py-1 rounded-full text-sm ${
              data.impact === 'positive' 
                ? 'bg-green-500/20 text-green-400'
                : data.impact === 'negative'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              Correlation: {Math.abs(data.correlation * 100)}%
            </div>
          </div>

          <p className="text-xl text-neutral-400">{data.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="glimmer-card p-6">
            <h2 className="text-xl font-semibold mb-4">Historical Correlation</h2>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full"
            />
          </div>

          <div className="glimmer-card p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis</h2>
            <p className="text-neutral-400 mb-6">{data.analysis}</p>
            
            <h3 className="text-lg font-semibold mb-3">Related Factors</h3>
            <ul className="space-y-2">
              {data.relatedFactors.map((factor, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-neutral-400"
                >
                  <span className="w-2 h-2 rounded-full bg-[#B87D3B]" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glimmer-card p-6">
          <h2 className="text-xl font-semibold mb-4">Detailed Analysis</h2>
          <p className="text-neutral-400 whitespace-pre-line">{data.details}</p>
        </div>
      </div>
    </div>
  )
} 