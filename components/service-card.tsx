import Link from "next/link"
import { ReactNode } from "react"

interface ServiceCardProps {
  title: string
  description: string
  icon: ReactNode
  features: string[]
  href: string
}

export function ServiceCard({ title, description, icon, features, href }: ServiceCardProps) {
  return (
    <Link href={href} className="block">
      <div className="glimmer-card p-8 hover-float">
        <div className="mb-6 service-icon-container p-4 rounded-xl inline-block bg-[#B87D3B]/10">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
        <p className="text-neutral-400 mb-6">
          {description}
        </p>
        <ul className="space-y-3 text-neutral-300">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg className="w-5 h-5 text-[#B87D3B] mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
} 