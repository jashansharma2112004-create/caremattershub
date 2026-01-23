import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { SEO, BreadcrumbSchema } from '@/components/SEO';

const Privacy = () => {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Care Matters Hub privacy policy. Learn how we collect, use, and protect your personal information in accordance with Australian privacy laws."
        canonical="/privacy"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />

      {/* Hero Section */}
      <section className="section-padding gradient-primary">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Privacy Policy</h1>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Your privacy is important to us. This policy outlines how Care Matters Hub collects, uses, and protects your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom px-4 md:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
            <p className="text-muted-foreground text-sm mb-8">
              Last updated: January 2026
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Care Matters Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We comply with the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth) and the NDIS Quality and Safeguards Commission requirements.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect the following types of personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Name, email address, phone number, and postal address</li>
              <li>NDIS participant information and plan details</li>
              <li>Health information relevant to providing care services</li>
              <li>Employment history and qualifications (for job applicants)</li>
              <li>Feedback and testimonials you provide</li>
              <li>Website usage data and analytics</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your personal information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Provide and improve our healthcare and support services</li>
              <li>Communicate with you about your care needs</li>
              <li>Process service registrations and job applications</li>
              <li>Comply with NDIS reporting requirements</li>
              <li>Send service updates and important notifications</li>
              <li>Respond to your inquiries and feedback</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>NDIS and related government agencies as required by law</li>
              <li>Healthcare professionals involved in your care</li>
              <li>Service providers who assist our operations (under strict confidentiality)</li>
              <li>Emergency services when necessary for your safety</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encrypted data transmission, secure storage systems, and staff training on privacy obligations.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under Australian privacy law, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Lodge a complaint about our privacy practices</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Cookies and Analytics</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our website may use cookies and similar technologies to enhance your browsing experience and collect anonymous usage statistics. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
            </p>
            <div className="bg-muted/50 p-6 rounded-xl mb-8">
              <p className="text-foreground font-medium mb-2">Care Matters Hub</p>
              <p className="text-muted-foreground">Email: <a href="mailto:sunil@caremattershub.com.au" className="text-primary hover:underline">sunil@caremattershub.com.au</a></p>
              <p className="text-muted-foreground">Phone: <a href="tel:+61452030000" className="text-primary hover:underline">+61 452 030 000</a></p>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated revision date.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-soft">
        <div className="container-custom px-4 md:px-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Have Questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            If you have any concerns about your privacy or how we handle your information, please don't hesitate to contact us.
          </p>
          <Button asChild>
            <Link to="/contact">
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
