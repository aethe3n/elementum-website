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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live *.vercel.app *.vercel-scripts.com *.firebaseapp.com *.googleapis.com apis.google.com accounts.google.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' blob: data: *.jblanked.com *.unsplash.com *.alphavantage.co *.finnhub.io *.polygon.io *.googleusercontent.com; connect-src 'self' *.vercel.app *.elementumglobal.com api.openai.com api.deepseek.ai api.polygon.io finnhub.io www.alphavantage.co www.jblanked.com va.vercel-scripts.com *.firebaseapp.com *.googleapis.com identitytoolkit.googleapis.com securetoken.googleapis.com; frame-src 'self' *.firebaseapp.com *.googleapis.com accounts.google.com; form-action 'self'; frame-ancestors 'self' *.elementumglobal.com *.firebaseapp.com accounts.google.com;"
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