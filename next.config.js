/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.jblanked.com',
      'jblanked.com',
      'images.unsplash.com',
      'www.alphavantage.co',
      'finnhub.io',
      'api.polygon.io'
    ],
    unoptimized: true
  },
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    JB_NEWS_API_KEY: process.env.JB_NEWS_API_KEY
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  reactStrictMode: true,
  output: 'standalone',
  distDir: '.next',
  generateEtags: true,
  experimental: {
    optimizeCss: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live *.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: *.jblanked.com *.unsplash.com *.alphavantage.co *.finnhub.io *.polygon.io; connect-src 'self' *.vercel.app api.anthropic.com api.polygon.io finnhub.io www.alphavantage.co www.jblanked.com;"
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'browsing-topics=(), private-state-token-redemption=(), private-state-token-issuance=()'
          }
        ]
      }
    ]
  },
  // Enable source maps for debugging
  productionBrowserSourceMaps: true,
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  // Add strict mode for better error catching
  typescript: {
    ignoreBuildErrors: false
  },
  // Handle static files
  async rewrites() {
    return {
      beforeFiles: [
        // Handle favicon.ico at the root
        {
          source: '/favicon.ico',
          destination: '/public/favicon.ico'
        }
      ]
    }
  }
}

module.exports = nextConfig 