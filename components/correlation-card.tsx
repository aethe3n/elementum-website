import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

interface CorrelationCardProps {
  title: string
  impact: 'positive' | 'negative' | 'neutral'
  correlation: number
  description: string
  details: string
  id: string
}

export function CorrelationCard({ 
  title, 
  impact, 
  correlation, 
  description,
  details,
  id 
}: CorrelationCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, 200, 200)

    // Configuration
    const centerX = 100
    const centerY = 100
    const radius = 80
    const startAngle = Math.PI
    const endAngle = 2 * Math.PI
    const lineWidth = 10

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = '#2A2A2A'
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw correlation arc
    const correlationAngle = startAngle + (correlation + 1) * Math.PI / 2
    const gradient = ctx.createLinearGradient(
      centerX - radius, 
      centerY, 
      centerX + radius, 
      centerY
    )

    if (impact === 'positive') {
      gradient.addColorStop(0, '#22C55E88')
      gradient.addColorStop(1, '#22C55EFF')
    } else if (impact === 'negative') {
      gradient.addColorStop(0, '#EF444488')
      gradient.addColorStop(1, '#EF4444FF')
    } else {
      gradient.addColorStop(0, '#EAB30888')
      gradient.addColorStop(1, '#EAB308FF')
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, correlationAngle)
    ctx.strokeStyle = gradient
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - lineWidth, startAngle, endAngle)
    ctx.fillStyle = '#1A1A1A'
    ctx.fill()

    // Add correlation text
    ctx.font = 'bold 24px Inter'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.abs(correlation * 100)}%`, centerX, centerY)

    // Add impact indicator
    const indicatorY = centerY + 30
    ctx.font = '14px Inter'
    ctx.fillStyle = impact === 'positive' 
      ? '#22C55E' 
      : impact === 'negative'
      ? '#EF4444'
      : '#EAB308'
    ctx.fillText(impact.toUpperCase(), centerX, indicatorY)

    // Add decorative elements
    const dotRadius = 2
    const dotCount = 24
    for (let i = 0; i < dotCount; i++) {
      const angle = startAngle + (i * Math.PI) / (dotCount - 1)
      const x = centerX + (radius + 15) * Math.cos(angle)
      const y = centerY + (radius + 15) * Math.sin(angle)
      
      ctx.beginPath()
      ctx.arc(x, y, dotRadius, 0, 2 * Math.PI)
      ctx.fillStyle = '#2A2A2A'
      ctx.fill()
    }

  }, [correlation, impact])

  return (
    <div className="glimmer-card p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className={`px-2 py-0.5 rounded-full text-xs ${
          impact === 'positive' 
            ? 'bg-green-500/20 text-green-400'
            : impact === 'negative'
            ? 'bg-red-500/20 text-red-400'
            : 'bg-yellow-500/20 text-yellow-400'
        }`}>
          {impact.charAt(0).toUpperCase() + impact.slice(1)}
        </div>
      </div>

      <p className="text-sm text-neutral-400 mb-6">{description}</p>

      <canvas 
        ref={canvasRef}
        width={200}
        height={200}
        className="mx-auto mb-6"
      />

      <div className="flex justify-center">
        <Button
          variant="outline"
          className="rounded-full border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
          asChild
        >
          <Link href={`/correlations/${id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  )
} 