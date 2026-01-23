/**
 * Google Analytics 4 Integration
 * 
 * Privacy-safe, production-ready analytics with:
 * - Production-only tracking
 * - IP anonymization
 * - Consent management support
 * - Admin route exclusion
 * - Scroll depth tracking
 * - Outbound link tracking
 * - Form submission tracking
 */

// GA4 Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

// Check if we're in production and have a valid measurement ID
const isProduction = import.meta.env.PROD;
const isEnabled = isProduction && GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-');

// Admin routes to exclude from tracking
const EXCLUDED_ROUTES = ['/admin', '/admin/login', '/admin/reset-password'];

// Consent state management
let hasConsent = true; // Default to true if no consent banner exists

// Extend window for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Initialize gtag function
 */
function initGtag() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
  }
}

/**
 * Load GA4 script asynchronously
 */
export function loadGA4Script(): void {
  if (!isEnabled || typeof window === 'undefined') {
    if (!isProduction) {
      console.log('[Analytics] Disabled in development mode');
    }
    return;
  }

  // Check if already loaded
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) {
    return;
  }

  initGtag();

  // Create and inject script asynchronously
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Configure GA4 with privacy settings
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // IP anonymization
    send_page_view: false, // Disable automatic page views (we handle them manually)
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('[Analytics] GA4 initialized');
}

/**
 * Check if current route should be tracked
 */
function shouldTrackRoute(pathname: string): boolean {
  return !EXCLUDED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if tracking is allowed (consent + enabled + valid route)
 */
function canTrack(pathname?: string): boolean {
  if (!isEnabled || !hasConsent) return false;
  if (pathname && !shouldTrackRoute(pathname)) return false;
  return true;
}

/**
 * Set user consent status
 */
export function setAnalyticsConsent(consent: boolean): void {
  hasConsent = consent;
  
  if (isEnabled && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied',
    });
  }
}

/**
 * Track page view event
 */
export function trackPageView(pathname: string, title?: string): void {
  if (!canTrack(pathname)) return;

  window.gtag('event', 'page_view', {
    page_path: pathname,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!canTrack(window.location.pathname)) return;

  window.gtag('event', eventName, params);
}

/**
 * Track form submission
 */
export function trackFormSubmission(
  formName: string,
  formType: 'registration' | 'feedback' | 'job_application' | 'testimonial' | 'contact',
  additionalParams?: Record<string, unknown>
): void {
  if (!canTrack(window.location.pathname)) return;

  window.gtag('event', 'form_submission', {
    form_name: formName,
    form_type: formType,
    ...additionalParams,
  });

  // Also track as conversion for specific form types
  if (formType === 'registration' || formType === 'job_application') {
    window.gtag('event', 'generate_lead', {
      form_name: formName,
      form_type: formType,
    });
  }
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, linkText?: string): void {
  if (!canTrack(window.location.pathname)) return;

  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: url,
    link_text: linkText,
    transport_type: 'beacon',
  });
}

/**
 * Track scroll depth
 */
let scrollDepthTracked: Set<number> = new Set();

export function trackScrollDepth(depth: number): void {
  if (!canTrack(window.location.pathname)) return;
  
  // Only track specific thresholds once per page
  const thresholds = [25, 50, 75, 90, 100];
  const nearestThreshold = thresholds.find(t => depth >= t && !scrollDepthTracked.has(t));
  
  if (nearestThreshold) {
    scrollDepthTracked.add(nearestThreshold);
    window.gtag('event', 'scroll', {
      percent_scrolled: nearestThreshold,
    });
  }
}

/**
 * Reset scroll tracking for new page
 */
export function resetScrollTracking(): void {
  scrollDepthTracked = new Set();
}

/**
 * Initialize scroll depth tracking listener
 */
export function initScrollTracking(): () => void {
  if (!isEnabled) return () => {};

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    const scrollPercent = Math.round(
      ((scrollTop + windowHeight) / documentHeight) * 100
    );
    
    trackScrollDepth(scrollPercent);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

/**
 * Initialize outbound link tracking
 */
export function initOutboundLinkTracking(): () => void {
  if (!isEnabled) return () => {};

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if it's an external link
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        trackOutboundLink(href, link.textContent || undefined);
      }
    } catch {
      // Invalid URL, skip tracking
    }
  };

  document.addEventListener('click', handleClick);
  
  return () => {
    document.removeEventListener('click', handleClick);
  };
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return isEnabled;
}
