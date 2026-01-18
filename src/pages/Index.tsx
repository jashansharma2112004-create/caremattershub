import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Clock, ArrowRight, CheckCircle, Phone, Mail, MessageCircle, Star, HelpCircle, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
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
import logo from '@/assets/logo.jpg';
import HeroSlideshow from '@/components/HeroSlideshow';

const services = [
  {
    icon: Heart,
    title: 'Personal Care',
    description: 'Daily living support with dignity and respect.',
  },
  {
    icon: Users,
    title: 'Community Access',
    description: 'Building connections and social participation.',
  },
  {
    icon: Shield,
    title: 'Health Support',
    description: 'Medication management and health monitoring.',
  },
  {
    icon: Clock,
    title: 'Respite Care',
    description: 'Quality relief for primary caregivers.',
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

const testimonials = [
  {
    name: 'Sarah M.',
    rating: 5,
    text: 'Care Matters Hub has been a blessing for our family. The carers are professional, kind, and truly care about my mother\'s wellbeing.',
  },
  {
    name: 'James P.',
    rating: 5,
    text: 'Excellent service from start to finish. They took the time to understand my needs and matched me with the perfect support worker.',
  },
  {
    name: 'Linda T.',
    rating: 5,
    text: 'Highly recommend! The team goes above and beyond. My son looks forward to his community participation activities every week.',
  },
];

const Index = () => {
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* Faded Logo on Left */}
          <img 
            src={logo} 
            alt="" 
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
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8">
                <Link to="/register">
                  Register for Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                asChild
                className="bg-transparent hover:bg-primary/10 border-2 border-primary text-primary rounded-full px-8"
              >
                <a href="tel:0452030000">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  EMERGENCY
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent hover:bg-primary/10 border-2 border-primary text-primary rounded-full px-8"
                onClick={() => setShowEmergencyDialog(true)}
              >
                <Phone className="mr-2 h-5 w-5" />
                Need Care Now?
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
              <p className="text-sm text-muted-foreground">Monday - Friday: 9am - 5pm</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <a href="tel:0452030000" className="text-sm text-muted-foreground hover:text-primary">0452 030 000</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Shubhpreet Cheema</p>
                    <p className="text-sm text-primary mb-1">Clinical Services Manager</p>
                    <a href="tel:0469786104" className="text-sm text-muted-foreground hover:text-primary">0469 786 104</a>
                  </div>
                </div>
              </div>
              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Office Hours</p>
                <p className="text-sm text-muted-foreground">Mon - Fri: 9am - 5pm</p>
                <p className="text-xs text-primary mt-1">24/7 Emergency Support Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Hear from families who trust us with their care needs.
            </p>
          </div>

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
              <Button size="lg" variant="outline" asChild className="bg-transparent hover:bg-primary/10 border-2 border-primary text-primary rounded-full px-8">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center text-primary-foreground/80 text-sm">
              <a href="mailto:sunil@caremattershub.com.au" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
                sunil@caremattershub.com.au
              </a>
              <a href="tel:0452030000" className="flex items-center justify-center gap-2 hover:text-primary-foreground">
                <Phone className="h-4 w-4" />
                0452 030 000
              </a>
            </div>
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
