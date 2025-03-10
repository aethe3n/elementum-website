import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/context/AuthContext";
import UserProfileButton from "@/components/UserProfileButton";
import { FeedbackButton } from '@/components/FeedbackButton';

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Elementum Global - Global Trading & Financial Services",
  description: "Empowering businesses with secure and efficient global trading capabilities.",
  icons: {
    icon: [
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
    other: [
      {
        rel: 'manifest',
        url: '/manifest.json'
      }
    ]
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1A1A1A' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}>
      <body className="flex flex-col min-h-screen bg-[#1A1A1A] text-white">
        <AuthProvider>
          {/* Navigation */}
          <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/50 backdrop-blur-lg">
            <div className="w-full flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <div className="relative h-16 w-48">
                  <Image
                    src="/images/EG2.jpg"
                    alt="Elementum Global"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/about-us" className="text-sm font-light text-neutral-200 hover:text-[#B87D3B] transition-colors tracking-wide">About Us</Link>
                <Link href="/services" className="text-sm font-light text-neutral-200 hover:text-[#B87D3B] transition-colors tracking-wide">Services</Link>
                <Link href="/latest-insights" className="text-sm font-light text-neutral-200 hover:text-[#B87D3B] transition-colors tracking-wide">Latest Insights</Link>
                <Link href="/blog" className="text-sm font-light text-neutral-200 hover:text-[#B87D3B] transition-colors tracking-wide">Blog</Link>
                <Link href="/market-ai" className="text-sm font-light text-neutral-200 hover:text-[#B87D3B] transition-colors tracking-wide">Market AI</Link>
                <Button size="sm" className="rounded-full bg-[#B87D3B] hover:bg-[#96652F] text-white font-light tracking-wide px-6">
                  <Link href="/get-started">Get Started</Link>
                </Button>
                <UserProfileButton />
              </nav>
            </div>
          </header>

          {children}

          <footer className="border-t border-neutral-800 py-12 px-6 relative z-10 bg-black/50 backdrop-blur-lg">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative h-8 w-8">
                    <Image
                      src="/images/Elementum Global-1000x1000.png"
                      alt="Elementum Global"
                      fill
                      className="object-contain filter contrast-125 brightness-110 sepia-[0.1] hue-rotate-[5deg]"
                    />
                  </div>
                  <span className="text-lg tracking-tight font-light text-[#BF946F]">ElementumGlobal</span>
                </div>
                <p className="text-sm text-neutral-400 font-light tracking-wide">Empowering businesses with global trading and financial solutions</p>
              </div>
              <div>
                <h4 className="font-light tracking-wide mb-4 text-white">Services</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Precious Metals</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Food Products</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Petroleum Services</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">OTC Trading</li>
                </ul>
              </div>
              <div>
                <h4 className="font-light tracking-wide mb-4 text-white">Company</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">About Us</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Careers</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Contact</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">Blog</li>
                </ul>
              </div>
              <div>
                <h4 className="font-light tracking-wide mb-4 text-white">Connect</h4>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">LinkedIn</li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">
                    <a href="https://x.com/ElementumGlobal" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </li>
                  <li className="hover:text-[#B87D3B] transition-colors cursor-pointer font-light tracking-wide">info@elementumglobal.com</li>
                </ul>
              </div>
            </div>
          </footer>
          <FeedbackButton />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
