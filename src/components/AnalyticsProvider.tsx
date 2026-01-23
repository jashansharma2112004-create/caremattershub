import { useAnalytics } from '@/hooks/useAnalytics';

/**
 * Analytics Provider component
 * Wraps the app to enable automatic page view tracking on route changes
 * Must be used inside BrowserRouter
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}
