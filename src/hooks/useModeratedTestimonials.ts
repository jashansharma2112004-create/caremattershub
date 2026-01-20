import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  name: string;
  rating: number;
  text: string;
}

interface UseModeratedTestimonialsResult {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: string | null;
}

export function useModeratedTestimonials(
  rawTestimonials: Testimonial[]
): UseModeratedTestimonialsResult {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function moderateTestimonials() {
      if (!rawTestimonials.length) {
        setTestimonials([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const texts = rawTestimonials.map((t) => t.text);

        const { data, error: fnError } = await supabase.functions.invoke(
          'moderate-content',
          { body: { texts } }
        );

        if (!isMounted) return;

        if (fnError) {
          console.error('Moderation function error:', fnError);
          // On error, show all testimonials (fail-open for UX)
          setTestimonials(rawTestimonials);
          setError('Content moderation unavailable');
          setIsLoading(false);
          return;
        }

        const results = data?.results || [];

        // Filter to only approved testimonials
        const approved = rawTestimonials.filter((_, index) => {
          const result = results[index];
          return result?.isApproved !== false;
        });

        setTestimonials(approved);
      } catch (err) {
        console.error('Moderation error:', err);
        if (isMounted) {
          // On error, show all testimonials (fail-open for UX)
          setTestimonials(rawTestimonials);
          setError('Content moderation unavailable');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    moderateTestimonials();

    return () => {
      isMounted = false;
    };
  }, [rawTestimonials]);

  return { testimonials, isLoading, error };
}
