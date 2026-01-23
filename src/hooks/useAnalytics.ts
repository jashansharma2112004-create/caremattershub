import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  loadGA4Script,
  trackPageView,
  resetScrollTracking,
  initScrollTracking,
  initOutboundLinkTracking,
  isAnalyticsEnabled,
} from '@/lib/analytics';

/**
 * Hook to track page views on route changes
 * Also initializes scroll depth and outbound link tracking
 */
export function useAnalytics() {
  const location = useLocation();
  const hasHandledInitialPageViewRef = useRef(false);

  // Initialize GA4 on mount
  useEffect(() => {
    loadGA4Script();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    // Reset scroll tracking for new page
    resetScrollTracking();

    // If `index.html` already fired the initial page_view via gtag('config', ...),
    // skip the first SPA page_view to avoid duplicates.
    const isFirstRouteEffect = !hasHandledInitialPageViewRef.current;
    hasHandledInitialPageViewRef.current = true;

    const initialPageViewAlreadySent =
      typeof window !== 'undefined' &&
      (window as any).__GA4_INITIAL_PAGEVIEW__ === true;

    if (isFirstRouteEffect && initialPageViewAlreadySent) return;

    // Small delay to ensure document.title is updated
    const timeoutId = setTimeout(() => {
      trackPageView(location.pathname, document.title);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Initialize scroll and outbound link tracking
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const cleanupScroll = initScrollTracking();
    const cleanupOutbound = initOutboundLinkTracking();

    return () => {
      cleanupScroll();
      cleanupOutbound();
    };
  }, []);
}
