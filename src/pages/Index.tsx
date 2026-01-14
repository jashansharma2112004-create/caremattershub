import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Clock, ArrowRight, CheckCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-care.jpg';

const teamMembers = [
  {
    name: 'Sunil Bagga',
    role: 'Operations Manager',
    description: 'Sunil leads our operations with a focus on delivering seamless, high-quality care services. With extensive experience in healthcare management, he ensures our team delivers excellence in every interaction.',
    phone: '+61 452 030 000',
    email: 'Sunil@caremattershub.com.au',
  },
  {
    name: 'Shubhpreet Cheema',
    role: 'Clinical Services Manager',
    description: 'Shubhpreet oversees our clinical services, bringing expertise in healthcare coordination and patient care. She is dedicated to ensuring the highest standards of clinical excellence and compassionate support.',
    phone: '+61 469 786 104',
    email: 'Shubh@caremattershub.com.au',
  },
];

const services = [
  {
    icon: Heart,
    title: 'Personal Care',
    description: 'Compassionate assistance with daily living activities, ensuring comfort and dignity.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Building connections and fostering independence through community engagement programs.',
  },
  {
    icon: Shield,
    title: 'Health Management',
    description: 'Professional support for medication management and health monitoring services.',
  },
  {
    icon: Clock,
    title: 'Respite Care',
    description: 'Providing relief for primary caregivers with quality temporary care solutions.',
  },
];

const values = [
  'Person-centred care approach',
  'Qualified and experienced staff',
  'Flexible service delivery',
  'NDIS registered provider',
  'Culturally sensitive care',
  'Available 7 days a week',
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        
        <div className="relative container-custom px-4 md:px-8 py-20">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-accent/30">
              Healthcare & Support Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Every Life <span className="text-accent">Matters</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              At Care Matters Hub, we're dedicated to supporting your independence and well-being. 
              Our compassionate team provides professional healthcare and support services tailored to your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/register">
                  Register for Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Supporting Your Journey to <span className="text-gradient">Independence</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Care Matters Hub is an Australian-owned healthcare and support services provider committed to enhancing 
              the quality of life for individuals and families. We believe in treating every person with dignity, 
              respect, and compassion while fostering independence and well-being.
            </p>
          </div>

          {/* Value Points */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 bg-card rounded-lg shadow-healthcare"
              >
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare and support services designed to meet your individual needs and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="card-healthcare group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <service.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our experienced leadership team is committed to delivering exceptional care and support services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="card-healthcare">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {member.description}
                </p>
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <a 
                    href={`tel:${member.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards quality care and support. Our team is here to help you 
            find the right services for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/register">Register Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Speak to Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
