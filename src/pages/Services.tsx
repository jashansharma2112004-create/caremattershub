import { Link } from 'react-router-dom';
import { 
  Heart, Users, Shield, Clock, Home, Car, 
  Stethoscope, Brain, Smile, ArrowRight, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema, ServiceSchema } from '@/components/SEO';

const services = [
  {
    icon: Home,
    title: 'Supported Independent Living (SIL)',
    description: 'Comprehensive support to help you live independently in your own home or shared accommodation. We provide 24/7 assistance tailored to your individual needs and goals.',
    features: ['24/7 support available', 'Skill building', 'Daily living assistance', 'Goal-focused care'],
  },
  {
    icon: Clock,
    title: 'Short & Medium Term Accommodation (STA / MTA)',
    description: 'Flexible accommodation options for respite, transition periods, or while exploring longer-term housing solutions. Quality care in a comfortable environment.',
    features: ['Respite care', 'Transition support', 'Flexible stays', 'Full care included'],
  },
  {
    icon: Shield,
    title: 'Specialized Disability Accommodation (SDA)',
    description: 'Purpose-built housing designed for people with extreme functional impairment or very high support needs. Coming soon to better serve our community.',
    features: ['Accessible design', 'High support ready', 'Modern facilities', 'Coming soon'],
    comingSoon: true,
  },
  {
    icon: Heart,
    title: 'Personal Care & Daily Living Support',
    description: 'Compassionate assistance with all aspects of daily living including personal hygiene, dressing, grooming, and mobility support while respecting your dignity.',
    features: ['Personal hygiene', 'Dressing support', 'Mobility assistance', 'Meal assistance'],
  },
  {
    icon: Users,
    title: 'Household Tasks & Shared Living Support',
    description: 'Support with maintaining a clean, safe, and comfortable living environment. We help you manage household responsibilities and thrive in shared living arrangements.',
    features: ['Cleaning support', 'Laundry assistance', 'Meal preparation', 'Shared living coordination'],
  },
  {
    icon: Car,
    title: 'Community Access, Transport & Activities',
    description: 'Enabling your participation in community life through reliable transport and activity support. We help you stay connected and engaged with the world around you.',
    features: ['Transport services', 'Social outings', 'Activity support', 'Community engagement'],
  },
  {
    icon: Stethoscope,
    title: 'Community Nursing Care',
    description: 'Professional nursing services delivered in the comfort of your home or community setting. Our qualified nurses provide skilled clinical care with compassion.',
    features: ['Registered nurses', 'Home-based care', 'Health monitoring', 'Care coordination'],
  },
  {
    icon: Brain,
    title: 'Complex Care',
    description: 'Specialized clinical support for complex health needs including medication management, wound care, catheter management, stoma management, enteral feeding, and dysphagia management.',
    features: ['Medication management', 'Wound care', 'Catheter & stoma care', 'Enteral feeding & dysphagia'],
  },
  {
    icon: Smile,
    title: 'Implementing Restrictive Practices',
    description: 'When necessary, we implement restrictive practices in accordance with NDIS guidelines, ensuring the safety and wellbeing of participants while upholding their rights and dignity.',
    features: ['NDIS compliant', 'Rights-focused', 'Safety protocols', 'Regular reviews'],
  },
];

const Services = () => {
  const serviceSchemaData = services.map(s => ({ name: s.title, description: s.description }));

  return (
    <Layout>
      <SEO
        title="NDIS Services Melbourne | SIL, Personal Care & Nursing"
        description="Explore NDIS services by Care Matters Hub: Supported Independent Living (SIL), personal care, community nursing, STA/MTA, and complex care. Same-day service in Melbourne."
        canonical="/services"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />
      <ServiceSchema services={serviceSchemaData} />

      {/* Hero Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Our Services</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Comprehensive healthcare and support services designed to meet your individual needs 
              and help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card-healthcare">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NDIS Section */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">NDIS Registered Provider</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Care Matters Hub is a registered NDIS provider, offering services under the National 
              Disability Insurance Scheme. We can help you navigate your NDIS plan and access the 
              supports you're entitled to.
            </p>
            <p className="text-muted-foreground">
              Whether you're self-managed, plan-managed, or NDIA-managed, we're here to support your journey.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How to Get Started</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting the support you need is simple. Here's how to begin your journey with us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
              <p className="text-muted-foreground text-sm">Reach out via phone, email, or our registration form to discuss your needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Consultation</h3>
              <p className="text-muted-foreground text-sm">We'll arrange a meeting to understand your goals and create a tailored care plan.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Start Services</h3>
              <p className="text-muted-foreground text-sm">Begin receiving quality care and support from our dedicated team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Access Our Services?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Register today to start receiving the care and support you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link to="/register">
                Register for Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Contact Us First</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
