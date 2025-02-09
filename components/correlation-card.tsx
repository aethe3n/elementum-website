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

    // Draw correlation gauge
    const centerX = 100
    const centerY = 100
    const radius = 80

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
    ctx.lineWidth = 10
    ctx.strokeStyle = '#2A2A2A'
    ctx.stroke()

    // Draw correlation arc
    const startAngle = Math.PI
    const endAngle = Math.PI + (correlation * Math.PI)
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.lineWidth = 10
    ctx.strokeStyle = impact === 'positive' 
      ? '#22C55E' 
      : impact === 'negative'
      ? '#EF4444'
      : '#EAB308'
    ctx.stroke()

    // Draw correlation value
    ctx.font = 'bold 24px Inter'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${Math.abs(correlation * 100)}%`, centerX, centerY)

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