'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-neutral-400 mb-6">
          We apologize for the inconvenience. Our team has been notified and is working to resolve the issue.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
          >
            Go Home
          </Button>
          <Button
            onClick={() => reset()}
            className="bg-[#B87D3B] hover:bg-[#96652F]"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
} 