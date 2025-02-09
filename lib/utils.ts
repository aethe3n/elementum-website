import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Analytics utility functions
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', eventName, properties);
  }
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('pageview', { path: url });
  }
}

export function trackConversion(type: string, value?: number) {
  trackEvent('conversion', { type, value });
}

export function trackEngagement(action: string, details?: Record<string, any>) {
  trackEvent('engagement', { action, ...details });
}

export function trackError(error: Error, context?: string) {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    context
  });
}
