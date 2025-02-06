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
  experimental: {
    optimizeCss: true
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'browsing-topics=(), private-state-token-redemption=(), private-state-token-issuance=()'
          }
        ]
      }
    ]
  },
  // Add better error handling and debugging
  onError(error) {
    console.error('Next.js build error:', error);
  },
  // Enable source maps for debugging
  productionBrowserSourceMaps: true,
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  // Add strict mode for better error catching
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig 