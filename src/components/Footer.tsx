import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '@/assets/logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-foreground text-secondary">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Care Matters Hub - Every Life Matters" className="h-20 w-auto" />
            </Link>
            <p className="text-secondary/70 text-sm leading-relaxed">
              Supporting independence, dignity, and well-being for individuals and families across Australia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary/80">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Home</Link>
              <Link to="/about" className="text-sm text-secondary/70 hover:text-secondary transition-colors">About Us</Link>
              <Link to="/services" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Our Services</Link>
              <Link to="/register" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Register</Link>
              <Link to="/feedback" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Feedback</Link>
              <Link to="/contact" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary/80">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+61452030000" className="flex items-start gap-3 text-sm text-secondary/70 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+61 452 030 000</span>
              </a>
              <a href="tel:+61469786104" className="flex items-start gap-3 text-sm text-secondary/70 hover:text-secondary transition-colors">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+61 469 786 104</span>
              </a>
              <a href="mailto:sunil@caremattershub.com.au" className="flex items-start gap-3 text-sm text-secondary/70 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>sunil@caremattershub.com.au</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary/80">Service Hours</h4>
            <div className="text-sm text-secondary/70 space-y-1">
              <p>Monday - Friday: 8am - 6pm</p>
              <p>Saturday: 9am - 4pm</p>
              <p>Sunday: Closed</p>
              <p className="mt-3 text-xs">24/7 Emergency Support Available</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary/60">
              © 2026 Care Matters Hub. All Rights Reserved.
            </p>
            <a 
              href="https://caremattershub.com.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-secondary/60 hover:text-secondary transition-colors"
            >
              caremattershub.com.au
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
