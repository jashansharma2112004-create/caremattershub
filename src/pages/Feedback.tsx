import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { trackFormSubmission } from '@/lib/analytics';

const formSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  serviceTaken: z.string().min(1, 'Please select the service you received'),
  rating: z.string().min(1, 'Please provide a rating'),
  feedback: z.string().min(10, 'Please share your feedback (at least 10 characters)'),
});

type FormData = z.infer<typeof formSchema>;

const services = [
  'Supported Independent Living (SIL)',
  'Short & Medium Term Accommodation (STA/MTA)',
  'Personal Care & Daily Living',
  'Household & Shared Living',
  'Community Access & Transport',
  'Community Nursing Care',
  'Complex Care',
  'Restrictive Practices',
  'Other',
];

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      serviceTaken: '',
      rating: '',
      feedback: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Send email notification via edge function
      const { error: emailError } = await supabase.functions.invoke('send-notification', {
        body: {
          type: 'feedback',
          data: data,
        },
      });

      if (emailError) {
        console.error('Email notification failed');
      }

      // Track form submission
      trackFormSubmission('Service Feedback Form', 'feedback', {
        service_type: data.serviceTaken,
        rating: data.rating,
      });

      setIsSubmitted(true);
      
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for taking the time to share your feedback with us.',
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Feedback Received',
        description: 'Thank you for taking the time to share your feedback with us.',
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom px-4 md:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Thank You for Your Feedback!</h1>
              <p className="text-muted-foreground mb-8">
                Your feedback is invaluable in helping us improve our services. We truly appreciate 
                you taking the time to share your experience with us.
              </p>
              <Button asChild>
                <a href="/">Return to Home</a>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Share Your Feedback"
        description="Share your experience with Care Matters Hub. Your feedback helps us improve our NDIS support services and better serve the Melbourne community."
        canonical="/feedback"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Feedback', url: '/feedback' },
        ]}
      />

      {/* Hero Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Share Your Feedback</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Your feedback helps us continuously improve our services. We'd love to hear about 
              your experience with Care Matters Hub.
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="card-healthcare">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">Your opinion matters to us</span>
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-6">Service Feedback Form</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="serviceTaken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Received *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the service you received" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card">
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating *</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const currentRating = parseInt(field.value) || 0;
                                const isActive = star <= (hoveredStar || currentRating);
                                return (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => field.onChange(star.toString())}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                                    aria-label={`Rate ${star} out of 5 stars`}
                                  >
                                    <Star 
                                      className={`h-8 w-8 transition-colors ${
                                        isActive 
                                          ? 'text-accent fill-accent' 
                                          : 'text-muted-foreground/30'
                                      }`} 
                                    />
                                  </button>
                                );
                              })}
                            </div>
                            {(hoveredStar || parseInt(field.value)) > 0 && (
                              <p className="text-sm text-muted-foreground">
                                {ratingLabels[(hoveredStar || parseInt(field.value)) - 1]}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please share your experience with our services. What did you like? What could we improve?"
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Your feedback is confidential and will be used to improve our services.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Feedback;
