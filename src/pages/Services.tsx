import { Link } from 'react-router-dom';
import { 
  Heart, Users, Shield, Clock, Home, Car, 
  Stethoscope, Brain, Smile, ArrowRight, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const services = [
  {
    icon: Heart,
    title: 'Personal Care',
    description: 'Compassionate assistance with daily living activities including bathing, dressing, grooming, and mobility support. Our carers ensure your comfort while respecting your privacy and dignity.',
    features: ['Personal hygiene assistance', 'Dressing support', 'Mobility assistance', 'Toileting support'],
  },
  {
    icon: Home,
    title: 'Domestic Assistance',
    description: 'Support with household tasks to maintain a clean, safe, and comfortable living environment. We help you stay independent in your own home.',
    features: ['Cleaning and tidying', 'Laundry services', 'Meal preparation', 'Shopping assistance'],
  },
  {
    icon: Users,
    title: 'Community Participation',
    description: 'Building connections and fostering social engagement through community access programs. We support you to participate in activities you enjoy.',
    features: ['Social outings', 'Group activities', 'Event attendance', 'Hobby support'],
  },
  {
    icon: Stethoscope,
    title: 'Health Management',
    description: 'Professional support for managing your health needs, including medication management and coordination with healthcare providers.',
    features: ['Medication reminders', 'Health monitoring', 'Appointment support', 'Care coordination'],
  },
  {
    icon: Clock,
    title: 'Respite Care',
    description: 'Providing relief for primary caregivers while ensuring your loved one receives quality care. Short-term or regular respite options available.',
    features: ['In-home respite', 'Flexible scheduling', 'Emergency respite', 'Weekend care'],
  },
  {
    icon: Car,
    title: 'Transport Services',
    description: 'Safe and reliable transport for medical appointments, social activities, and community access. We help you get where you need to go.',
    features: ['Medical appointments', 'Social outings', 'Shopping trips', 'Activity transport'],
  },
  {
    icon: Brain,
    title: 'Capacity Building',
    description: 'Support to develop skills and capabilities that enhance your independence and participation in daily life and community activities.',
    features: ['Life skills development', 'Goal setting', 'Daily living skills', 'Independence training'],
  },
  {
    icon: Smile,
    title: 'Social Support',
    description: 'Companionship and emotional support to enhance wellbeing and reduce social isolation. Building meaningful connections matters.',
    features: ['One-on-one companionship', 'Activity participation', 'Conversation and company', 'Emotional support'],
  },
];

const Services = () => {
  return (
    <Layout>
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
