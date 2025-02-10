import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is authenticated for protected routes
  const protectedPaths = ['/market-ai']
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // Get the token from cookies
    const session = request.cookies.get('__session')?.value
    
    if (!session) {
      // Store the original URL to redirect back after login
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Log request details
  console.log('Request path:', request.nextUrl.pathname)

  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Handle root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // Get response
  const response = NextResponse.next()

  // Add security headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com https://*.google.com https://apis.google.com https://*.vercel-scripts.com https://*.vercel-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com;
    frame-src 'self' https://*.firebaseapp.com https://*.google.com https://elementumglobal-be6b9.firebaseapp.com https://accounts.google.com;
    connect-src 'self' 
      https://*.firebaseapp.com 
      https://*.googleapis.com 
      https://identitytoolkit.googleapis.com 
      https://securetoken.googleapis.com 
      https://www.googleapis.com 
      wss://*.firebaseio.com 
      https://*.google.com
      https://accounts.google.com
      https://*.vercel-scripts.com
      https://*.vercel-analytics.com
      http://localhost:*;
    form-action 'self';
  `.replace(/\s{2,}/g, ' ').trim()

  // Set security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
} 