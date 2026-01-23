import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Star, Loader2, Send } from 'lucide-react';
import { trackFormSubmission } from '@/lib/analytics';

const TestimonialForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !text.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in your name and feedback.',
        variant: 'destructive',
      });
      return;
    }

    if (text.trim().length < 20) {
      toast({
        title: 'Feedback Too Short',
        description: 'Please provide at least 20 characters of feedback.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          name: name.trim(),
          email: email.trim() || null,
          text: text.trim(),
          rating,
          status: 'pending',
        });

      if (error) throw error;

      // Track form submission
      trackFormSubmission('Testimonial Form', 'testimonial', {
        rating,
      });

      setIsSubmitted(true);
      toast({
        title: 'Thank You!',
        description: 'Your testimonial has been submitted for review.',
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-green-600 fill-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground">
          Your testimonial has been submitted and is pending review by our team.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="testimonial-name">Your Name *</Label>
        <Input
          id="testimonial-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John D."
          maxLength={100}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial-email">Email (optional)</Label>
        <Input
          id="testimonial-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          maxLength={255}
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">We'll only use this to follow up if needed.</p>
      </div>

      <div className="space-y-2">
        <Label>Your Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground/30'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial-text">Your Feedback *</Label>
        <Textarea
          id="testimonial-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience with Care Matters Hub..."
          rows={4}
          maxLength={500}
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground text-right">{text.length}/500</p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Testimonial
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your testimonial will be reviewed before being published on our website.
      </p>
    </form>
  );
};

export default TestimonialForm;
