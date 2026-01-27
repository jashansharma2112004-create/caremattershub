import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, ChevronLeft, ChevronRight, MessageSquareHeart } from 'lucide-react';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApprovedTestimonials } from '@/hooks/useApprovedTestimonials';

const ITEMS_PER_PAGE = 6;

const Testimonials = () => {
  const { testimonials, isLoading, error } = useApprovedTestimonials();
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter testimonials by rating
  const filteredTestimonials = useMemo(() => {
    if (ratingFilter === 'all') return testimonials;
    return testimonials.filter((t) => t.rating === parseInt(ratingFilter));
  }, [testimonials, ratingFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const paginatedTestimonials = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTestimonials.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTestimonials, currentPage]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (value: string) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  return (
    <Layout>
      <SEO
        title="Client Testimonials | NDIS Provider Reviews Melbourne"
        description="Read reviews and testimonials from families who trust Care Matters Hub for NDIS support. Real stories from our Melbourne disability care community."
        canonical="/testimonials"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Testimonials', url: '/testimonials' },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-20">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquareHeart className="h-4 w-4" />
              Client Testimonials
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Real stories from families who trust Care Matters Hub with their care needs. 
              Your feedback helps us continue delivering compassionate, quality support.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/feedback">Share Your Experience</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filter & Grid Section */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              Showing {filteredTestimonials.length} testimonial{filteredTestimonials.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={ratingFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4 rounded" />
                      ))}
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredTestimonials.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <MessageSquareHeart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No testimonials found</h3>
              <p className="text-muted-foreground mb-6">
                {ratingFilter !== 'all' 
                  ? `No ${ratingFilter}-star testimonials yet.` 
                  : 'Be the first to share your experience!'}
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/feedback">Submit a Testimonial</Link>
              </Button>
            </div>
          )}

          {/* Testimonials Grid */}
          {!isLoading && !error && paginatedTestimonials.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTestimonials.map((testimonial) => (
                  <Card 
                    key={testimonial.id} 
                    className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-1 mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      <blockquote className="text-foreground mb-4 leading-relaxed">
                        "{testimonial.text}"
                      </blockquote>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{testimonial.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-full ${
                          currentPage === page ? '' : 'text-muted-foreground'
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary/5">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Share Your Experience
            </h2>
            <p className="text-muted-foreground mb-6">
              Your feedback helps us improve and lets other families know what to expect. 
              We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="rounded-full">
                <Link to="/feedback">Submit Feedback</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
