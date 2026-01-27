import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';

const teamMembers = [
  {
    name: 'Sunil Bagga',
    role: 'Operations Manager',
    phone: '+61 452 030 000',
    email: 'Sunil@caremattershub.com.au',
  },
  {
    name: 'Shubhpreet Cheema',
    role: 'Clinical Services Manager',
    phone: '+61 469 786 104',
    email: 'Shubh@caremattershub.com.au',
  },
];

const Contact = () => {
  return (
    <Layout>
      <SEO
        title="Contact Us - Get in Touch"
        description="Contact Care Matters Hub for NDIS support services in Melbourne. Call +61 452 030 000 or +61 469 786 104. 24/7 emergency support available."
        canonical="/contact"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />

      {/* Hero Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Contact Us</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              We're here to help. Reach out to our team to discuss your care needs or learn more 
              about our services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Team Contacts */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">Our Team</h2>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="card-healthcare">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    
                    <div className="space-y-3">
                      <a 
                        href={`tel:${member.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <span>{member.phone}</span>
                      </a>
                      
                      <a 
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <span className="break-all">{member.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="card-healthcare">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Business Hours</h3>
                      <div className="text-muted-foreground text-sm space-y-1">
                        <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                        <p>Saturday: 9:00 AM – 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                      <p className="text-primary text-sm mt-3 font-medium">24/7 Emergency Support Available</p>
                    </div>
                  </div>
                </div>

                <div className="card-healthcare">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Service Area</h3>
                      <p className="text-muted-foreground text-sm">
                        We provide healthcare and support services across Australia. 
                        Contact us to confirm service availability in your area.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-healthcare bg-primary/5 border border-primary/10">
                  <h3 className="font-semibold text-foreground mb-3">Ready to Get Started?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Register for our services online and we'll be in touch within 1-2 business days 
                    to discuss your care needs.
                  </p>
                  <Button asChild>
                    <Link to="/register">
                      Register for Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-foreground">How Can We Help?</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link 
              to="/services" 
              className="card-healthcare text-center hover:border-primary/20 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">View Services</h3>
              <p className="text-muted-foreground text-sm">Explore our full range of care services</p>
            </Link>

            <Link 
              to="/about" 
              className="card-healthcare text-center hover:border-primary/20 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">About Us</h3>
              <p className="text-muted-foreground text-sm">Learn about our mission and values</p>
            </Link>

            <Link 
              to="/feedback" 
              className="card-healthcare text-center hover:border-primary/20 transition-colors"
            >
              <h3 className="font-semibold text-foreground mb-2">Give Feedback</h3>
              <p className="text-muted-foreground text-sm">Share your experience with us</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Website Link */}
      <section className="py-8 bg-card border-t border-border">
        <div className="container-custom px-4 md:px-8 text-center">
          <a 
            href="https://caremattershub.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caremattershub.com.au
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
