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
  }
}

module.exports = nextConfig 