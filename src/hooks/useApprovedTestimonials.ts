import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
}

interface UseApprovedTestimonialsResult {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
}

export function useApprovedTestimonials(): UseApprovedTestimonialsResult {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip if already fetched
    if (hasFetched.current) return;
    
    let isMounted = true;

    async function fetchTestimonials() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch only approved testimonials (RLS policy enforces this)
        const { data, error: fetchError } = await supabase
          .from('testimonials')
          .select('id, name, rating, text')
          .order('created_at', { ascending: false });

        if (!isMounted) return;

        if (fetchError) {
          console.error('Error fetching testimonials:', fetchError);
          setError('Failed to load testimonials');
          setTestimonials([]);
          return;
        }

        setTestimonials(data || []);
        hasFetched.current = true;
      } catch (err) {
        console.error('Testimonials error:', err);
        if (isMounted) {
          setError('Failed to load testimonials');
          setTestimonials([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Defer fetch until after initial paint to avoid blocking LCP
    // Use setTimeout as fallback for Safari which doesn't support requestIdleCallback
    const deferFetch = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window && typeof (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback === 'function') {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(() => fetchTestimonials(), { timeout: 3000 });
      } else {
        setTimeout(fetchTestimonials, 100);
      }
    };

    deferFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, isLoading, error };
}
