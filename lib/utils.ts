import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Analytics utility functions
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Implement your analytics tracking here
  console.log('Track Event:', eventName, properties)
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('pageview', { path: url });
  }
}

export function trackConversion(type: string, value?: number) {
  trackEvent('conversion', { type, value });
}

export function trackEngagement(action: string, properties?: Record<string, any>) {
  // Implement your engagement tracking here
  console.log('Track Engagement:', action, properties)
}

export function trackError(error: Error, context: string) {
  // Implement your error tracking here
  console.error('Track Error:', context, error)
}
