import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook, Shield } from 'lucide-react';
import logo from '@/assets/logo-small.webp';
import ndisLogo from '@/assets/ndis-logo.png';
import { useAuth } from '@/contexts/AuthContext';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const Footer = () => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-foreground text-secondary">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={logo} alt="Care Matters Hub - Every Life Matters" width={64} height={64} loading="lazy" decoding="async" className="h-16 w-16 rounded-full object-cover" />
              <span className="text-lg font-semibold">Care Matters Hub</span>
            </Link>
            <p className="text-secondary/70 text-sm leading-relaxed mb-4">
              Supporting independence, dignity, and well-being for individuals and families across Australia.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/caremattershub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/share/16pMDnRjSJ/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@caremattershub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary/80">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Home</Link>
              <Link to="/about" className="text-sm text-secondary/70 hover:text-secondary transition-colors">About Us</Link>
              <Link to="/services" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Our Services</Link>
              <Link to="/register" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Register</Link>
              <Link to="/careers" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Careers</Link>
              <Link to="/testimonials" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Testimonials</Link>
              <Link to="/feedback" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Feedback</Link>
              <Link to="/contact" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Contact</Link>
              <Link to="/privacy" className="text-sm text-secondary/70 hover:text-secondary transition-colors">Privacy Policy</Link>
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
              <a href="mailto:shubh@caremattershub.com.au" className="flex items-start gap-3 text-sm text-secondary/70 hover:text-secondary transition-colors">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>shubh@caremattershub.com.au</span>
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-secondary/80">Service Hours</h4>
            <div className="text-sm text-secondary/70 space-y-1">
              <p>Monday - Friday: 9am - 6pm</p>
              <p>Saturday: 9am - 4pm</p>
              <p>Sunday: Closed</p>
              <p className="mt-3 text-xs">24/7 Emergency Support Available</p>
            </div>
          </div>
        </div>

        {/* NDIS Logo Section */}
        <div className="mt-10 pt-8 border-t border-secondary/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://www.ndis.gov.au" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src={ndisLogo} 
                alt="NDIS Registered Provider - I Heart NDIS" 
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-auto object-contain"
              />
            </a>
            <p className="text-sm text-secondary/60 text-center">
              Registered NDIS Provider
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-secondary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary/60">
              © 2026 Care Matters Hub. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://caremattershub.com.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-secondary/60 hover:text-secondary transition-colors"
              >
                caremattershub.com.au
              </a>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1.5 text-sm text-secondary/60 hover:text-secondary transition-colors"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
