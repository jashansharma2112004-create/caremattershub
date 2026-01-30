import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Clock, ArrowRight, CheckCircle, Phone, Mail, MessageCircle, Star, HelpCircle, AlertCircle, Home, Car, Stethoscope, Brain } from 'lucide-react';
import { useApprovedTestimonials } from '@/hooks/useApprovedTestimonials';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { SEO, OrganizationSchema, LocalBusinessSchema, WebsiteSchema, FAQSchema } from '@/components/SEO';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import logoSmall from '@/assets/logo-compressed.webp';
import HeroSlideshow from '@/components/HeroSlideshow';
import LazyGoogleMap from '@/components/LazyGoogleMap';

const services = [
  {
    icon: Home,
    title: 'Supported Independent Living (SIL)',
    description: '24/7 support to live independently in your own home.',
  },
  {
    icon: Clock,
    title: 'Short & Medium Term Accommodation',
    description: 'Flexible STA/MTA options for respite and transitions.',
  },
  {
    icon: Shield,
    title: 'Personal Care & Daily Living',
    description: 'Compassionate assistance with daily activities.',
  },
  {
    icon: Users,
    title: 'Household & Shared Living',
    description: 'Support for household tasks and shared living.',
  },
  {
    icon: Car,
    title: 'Community Access & Transport',
    description: 'Stay connected with reliable transport services.',
  },
  {
    icon: Stethoscope,
    title: 'Community Nursing Care',
    description: 'Professional nursing in your home or community.',
  },
  {
    icon: Brain,
    title: 'Complex Care',
    description: 'Medication, wound care, enteral feeding & more.',
  },
  {
    icon: Heart,
    title: 'Restrictive Practices',
    description: 'NDIS-compliant safety protocols when needed.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Get in Touch',
    description: 'Call us or fill out our registration form to tell us about your needs.',
  },
  {
    number: '02',
    title: 'We Create Your Plan',
    description: 'Our team works with you to develop a care plan that fits your life.',
  },
  {
    number: '03',
    title: 'Start Your Services',
    description: 'Receive quality care from our experienced and friendly team. Services can start same day!',
  },
];

const whyChooseUs = [
  'Locally owned Australian business',
  'Experienced, qualified care professionals',
  'Flexible services that work around you',
  'Registered NDIS provider',
  'Genuine care for every individual',
  'Services can start same day',
];

const faqs = [
  {
    question: 'What services does Care Matters Hub provide?',
    answer: 'We provide NDIS-approved support services including personal care, daily living assistance, community participation, and tailored support to help individuals live independently.',
  },
  {
    question: 'Are you a registered NDIS provider?',
    answer: 'Yes, Care Matters Hub is a registered NDIS provider and follows all NDIS quality and safeguarding standards.',
  },
  {
    question: 'Who can access your services?',
    answer: 'Anyone with an approved NDIS plan can access our services. We also assist participants in understanding and utilising their plans effectively.',
  },
  {
    question: 'How do I register for services?',
    answer: 'You can register directly through our website using the registration form or contact us via phone or email. Services can start on the same day!',
  },
  {
    question: 'How can I apply for a job at Care Matters Hub?',
    answer: 'Visit our Careers / Apply for Job section and submit your application along with your resume.',
  },
  {
    question: 'How is feedback handled?',
    answer: 'We value your feedback. All feedback submitted through our website is reviewed by our management team to continuously improve our services.',
  },
];

const Index = () => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  
  // Fetch only admin-approved testimonials from database
  const { testimonials, isLoading: isLoadingTestimonials } = useApprovedTestimonials();

  return (
    <Layout>
      <SEO
        title="NDIS Provider Melbourne | Disability Support Services"
        description="Care Matters Hub is a registered NDIS provider in Melbourne. We offer disability support, personal care, community nursing, SIL, and independent living services. Same-day service available."
        canonical="/"
      />
      <OrganizationSchema />
      <LocalBusinessSchema />
      <WebsiteSchema />
      <FAQSchema faqs={faqs} />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Faded Logo on Left */}
          <img 
            src={logoSmall} 
            alt="" 
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            className="absolute top-8 left-8 w-20 h-20 md:w-28 md:h-28 rounded-full object-cover opacity-30 z-10"
          />
          
          {/* Hero Slideshow */}
          <HeroSlideshow />
          
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative container-custom px-4 md:px-8 py-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-5 leading-tight tracking-tight">
              <span className="drop-shadow-lg">Every Life Matters</span>
            </h1>
            <p className="text-lg text-primary-foreground/90 mb-8 leading-relaxed">
              We're here to support your independence and well-being. 
              Care that's built around you, not the other way around.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 py-6 text-base">
                <Link to="/register">
                  Register for Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent hover:bg-destructive/10 border-2 border-destructive text-destructive rounded-full px-10 py-6 text-base"
                onClick={() => setShowEmergencyDialog(true)}
              >
                <AlertCircle className="mr-2 h-5 w-5" />
                EMERGENCY
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Dialog */}
      <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Emergency Care Contact
            </DialogTitle>
            <DialogDescription>
              For urgent care needs, please contact us immediately:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="font-semibold text-foreground mb-3">24/7 Emergency Support</p>
              <div className="space-y-2">
                <a href="tel:+61452030000" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Sunil Bagga</p>
                    <p className="text-sm text-muted-foreground">+61 452 030 000</p>
                  </div>
                </a>
                <a href="tel:+61469786104" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Shubhpreet Cheema</p>
                    <p className="text-sm text-muted-foreground">+61 469 786 104</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold text-foreground mb-2">Business Hours</p>
              <p className="text-sm text-muted-foreground">Monday - Friday: 9am - 6pm</p>
              <p className="text-sm text-muted-foreground">Saturday: 9am - 4pm</p>
              <p className="text-sm text-muted-foreground">Sunday: Closed</p>
              <p className="text-xs text-muted-foreground mt-2 italic">
                For after-hours and emergencies, call either number above. 
                Non-emergency inquiries: response within 48 business hours.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About / Who We Are */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Care Matters Hub is an Australian healthcare and support services provider based in Melbourne. 
              We started with a simple belief: everyone deserves care that respects their choices and helps them live life on their terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our team brings together years of experience in disability support, aged care, and community services. 
              We're not just caregivers — we're partners in your journey towards independence.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Support services designed to fit your life, not ours. <span className="font-semibold text-primary">Services can start same day!</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/services">
                See All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Getting started is straightforward. Here's what to expect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Families Trust Us
              </h2>
              <p className="text-muted-foreground mb-8">
                We know choosing a care provider is a big decision. Here's what sets us apart.
              </p>
              <div className="grid gap-3">
                {whyChooseUs.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">Our Management</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    SB
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sunil Bagga</p>
                    <p className="text-sm text-primary mb-1">Operations Manager</p>
                    <a href="tel:0452030000" className="block text-sm text-muted-foreground hover:text-primary">0452 030 000</a>
                    <a href="mailto:sunil@caremattershub.com.au" className="text-sm text-muted-foreground hover:text-primary">sunil@caremattershub.com.au</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Shubhpreet Cheema</p>
                    <p className="text-sm text-primary mb-1">Clinical Services Manager</p>
                    <a href="tel:0469786104" className="block text-sm text-muted-foreground hover:text-primary">0469 786 104</a>
                    <a href="mailto:shubh@caremattershub.com.au" className="text-sm text-muted-foreground hover:text-primary">shubh@caremattershub.com.au</a>
                  </div>
                </div>
              </div>
              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Office Hours</p>
                <p className="text-sm text-muted-foreground">Mon - Fri: 9am - 6pm</p>
                <p className="text-sm text-muted-foreground">Saturday: 9am - 4pm</p>
                <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                <p className="text-xs text-primary mt-1">24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from families who trust us with their care needs.
            </p>
          </div>

          {isLoadingTestimonials ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-5 w-5 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="h-16 bg-muted rounded mb-4" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-foreground">— {testimonial.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No testimonials available at this time.</p>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our services and how we can help you.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              Get in touch today. We're here to answer your questions and help you find the right support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8">
                <Link to="/register">Register for Service</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent hover:bg-primary-foreground/10 border-2 border-primary-foreground text-primary-foreground rounded-full px-8">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center text-primary-foreground/80 text-sm">
              <a href="mailto:sunil@caremattershub.com.au" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
                sunil@caremattershub.com.au
              </a>
              <a href="mailto:shubh@caremattershub.com.au" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
                shubh@caremattershub.com.au
              </a>
              <a href="tel:0452030000" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Phone className="h-4 w-4" />
                0452 030 000
              </a>
              <a href="tel:0469786104" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Phone className="h-4 w-4" />
                0469 786 104
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Location Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Location</h2>
            <p className="text-muted-foreground mb-8">
              Visit us at our Melbourne office or get in touch for home-based services across Victoria.
            </p>
            <div className="rounded-xl overflow-hidden shadow-md">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=9+Damper+Way,+Lynbrook,+Melbourne,+Victoria,+Australia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <LazyGoogleMap
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.6736285384073!2d145.25506421531647!3d-38.05889897971536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad615f3d9c10c1d%3A0x5a0e3d5b2a0e2c47!2s9%20Damper%20Way%2C%20Lynbrook%20VIC%203975%2C%20Australia!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                  title="Care Matters Hub Location - 9 Damper Way, Lynbrook, Melbourne"
                  height={300}
                />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              9 Damper Way, Lynbrook, Melbourne, Victoria
            </p>
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto">
            <Star className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Already using our services?
            </h3>
            <p className="text-muted-foreground mb-6">
              Your feedback helps us improve. We'd love to hear about your experience.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/feedback">
                Share Your Feedback
                <MessageCircle className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
