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
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MOONSHOT_API_KEY: process.env.MOONSHOT_API_KEY,
    JB_NEWS_API_KEY: process.env.JB_NEWS_API_KEY,
    NEXT_PUBLIC_BUILD_TIMESTAMP: Date.now().toString(),
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
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://accounts.google.com; style-src 'self' 'unsafe-inline' https://*.googleapis.com; img-src 'self' blob: data: https://*.googleusercontent.com https://*.jblanked.com https://*.unsplash.com https://*.alphavantage.co https://*.finnhub.io https://*.polygon.io; connect-src 'self' https://*.elementumglobal.com https://*.firebaseapp.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://*.firebaseio.com; frame-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://accounts.google.com; form-action 'self'; frame-ancestors 'self';"
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*'
        }
      ]
    }
  },
  generateBuildId: async () => {
    // This will be unique for every build
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig 