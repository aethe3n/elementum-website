'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { NewsArticle, getLatestNews } from "@/lib/news-service"

const cities = [
  // Americas
  { name: "New York", x: 285, y: 280, size: 6, importance: "major" },
  { name: "Los Angeles", x: 200, y: 320, size: 5, importance: "major" },
  { name: "Vancouver", x: 180, y: 250, size: 4, importance: "minor" },
  { name: "São Paulo", x: 350, y: 500, size: 5, importance: "major" },
  
  // Europe
  { name: "London", x: 520, y: 250, size: 6, importance: "major" },
  { name: "Rotterdam", x: 540, y: 260, size: 5, importance: "major" },
  { name: "Hamburg", x: 550, y: 240, size: 4, importance: "minor" },
  
  // Asia
  { name: "Singapore", x: 820, y: 450, size: 6, importance: "major" },
  { name: "Hong Kong", x: 880, y: 350, size: 6, importance: "major" },
  { name: "Shanghai", x: 900, y: 320, size: 5, importance: "major" },
  { name: "Tokyo", x: 950, y: 300, size: 6, importance: "major" },
  { name: "Dubai", x: 700, y: 380, size: 5, importance: "major" },
  
  // Oceania
  { name: "Sydney", x: 950, y: 550, size: 5, importance: "major" },
  
  // Africa
  { name: "Cape Town", x: 580, y: 550, size: 4, importance: "minor" },
  { name: "Lagos", x: 520, y: 420, size: 4, importance: "minor" }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-[#B87D3B] to-[#96652F] bg-clip-text text-transparent">
              AI Companion
            </span>
          </h1>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            Experience the future of learning with Elementum. Our AI-powered platform adapts to your needs,
            providing personalized guidance and support on your journey.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              className="bg-[#B87D3B] hover:bg-[#96652F] px-8"
            >
              <Link href="/chat">
                Start Learning
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#B87D3B] text-[#B87D3B] hover:bg-[#B87D3B]/10"
            >
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}