import { useState, useEffect } from 'react';
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

  useEffect(() => {
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

    fetchTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, isLoading, error };
}
