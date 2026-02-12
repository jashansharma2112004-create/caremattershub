import { Link } from 'react-router-dom';
import { Target, Heart, Award, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';
import teamImage from '@/assets/team.jpg';

const coreValues = [
  {
    icon: Heart,
    title: 'Independence',
    description: 'We empower individuals to maintain control over their lives and decisions, providing support that enhances autonomy rather than creating dependency.',
  },
  {
    icon: Award,
    title: 'Dignity',
    description: 'Every person deserves to be treated with respect and compassion. We honour the inherent worth of each individual we serve.',
  },
  {
    icon: Target,
    title: 'Well-Being',
    description: 'Our holistic approach addresses physical, emotional, and social needs, promoting overall health and quality of life for our clients.',
  },
];

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Us | NDIS Care Provider Melbourne"
        description="Learn about Care Matters Hub, a trusted NDIS provider in Melbourne. Our mission is empowering lives through compassionate, person-centred disability support services."
        canonical="/about"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ]}
      />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-primary px-4 md:px-8">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">About Care Matters Hub</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              We are dedicated to providing exceptional healthcare and support services that make a 
              genuine difference in the lives of Australians.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Empowering Lives Through Compassionate Care
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At Care Matters Hub, our mission is to enhance the quality of life for individuals and families 
                  across Australia by delivering person-centred healthcare and support services. We believe that 
                  every life matters, and this belief drives everything we do.
                </p>
                <p>
                  Founded on principles of compassion, integrity, and excellence, we work closely with our clients 
                  to understand their unique needs and goals. Our team of dedicated professionals brings expertise, 
                  empathy, and genuine care to every interaction.
                </p>
                <p>
                  Whether you're seeking support for yourself or a loved one, we're committed to being a trusted 
                  partner on your journey towards greater independence and well-being.
                </p>
                <p>
                  We proudly support people from all cultural backgrounds and treat every individual with dignity, 
                  respect, and understanding. Our services are inclusive, culturally sensitive, and tailored to meet 
                  diverse needs.
                </p>
                <p className="italic text-foreground/80">
                  "Every culture has a story, and we honour each one with respect, compassion, and inclusive care."
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={teamImage} 
                alt="Care Matters Hub Team" 
                className="rounded-2xl shadow-healthcare-hover w-full object-cover aspect-square"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg max-w-[200px]">
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm opacity-90">Commitment to Quality Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div key={index} className="card-healthcare text-center">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why Choose Care Matters Hub?</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-5 bg-card rounded-xl shadow-healthcare">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">01</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Person-Centred Approach</h3>
                  <p className="text-muted-foreground text-sm">We tailor our services to your individual needs, preferences, and goals rather than taking a one-size-fits-all approach.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-card rounded-xl shadow-healthcare">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">02</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Qualified Professionals</h3>
                  <p className="text-muted-foreground text-sm">Our team consists of trained, experienced, and compassionate healthcare professionals who are passionate about making a difference.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-card rounded-xl shadow-healthcare">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">03</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Flexible & Responsive</h3>
                  <p className="text-muted-foreground text-sm">We understand that needs can change. Our flexible service delivery adapts to your evolving circumstances.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-card rounded-xl shadow-healthcare">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">04</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Culturally Sensitive</h3>
                  <p className="text-muted-foreground text-sm">We respect and celebrate diversity, providing culturally appropriate care that honours your background and traditions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-primary px-4 md:px-8">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
            Let's Start Your Care Journey Together
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
            Reach out today to discuss how we can support you or your loved ones.
          </p>
          <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link to="/contact">
              Contact Our Team
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
