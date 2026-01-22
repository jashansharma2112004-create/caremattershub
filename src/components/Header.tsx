import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, Facebook, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo-small.webp';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const servicesList = [
  { name: 'Personal Care', path: '/services#personal-care' },
  { name: 'Daily Living Support', path: '/services#daily-living' },
  { name: 'Community Participation', path: '/services#community' },
  { name: 'Transport Assistance', path: '/services#transport' },
  { name: 'Respite Care', path: '/services#respite' },
  { name: 'View All Services', path: '/services' },
];

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Register', path: '/register' },
  { name: 'Careers', path: '/careers' },
  { name: 'Feedback', path: '/feedback' },
];

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/caremattershub', icon: 'instagram' },
  { name: 'Facebook', url: 'https://www.facebook.com/caremattershub', icon: 'facebook' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@caremattershub', icon: 'tiktok' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isServicesActive = location.pathname === '/services';

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Care Matters Hub - Every Life Matters" 
              width={64} 
              height={64} 
              className="h-12 md:h-14 w-12 md:w-14 rounded-full object-cover shadow-md animate-blink" 
            />
            <span className="text-sm md:text-base font-bold text-primary whitespace-nowrap">Care Matters Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}
            >
              About Us
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                isServicesActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              }`}>
                Our Services
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border border-border shadow-lg z-50">
                {servicesList.map((service) => (
                  <DropdownMenuItem key={service.path} asChild>
                    <Link 
                      to={service.path} 
                      className="w-full cursor-pointer"
                    >
                      {service.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.filter(link => !['Home', 'About Us'].includes(link.name)).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social & CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/caremattershub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://www.facebook.com/share/1BBVzwFH6X/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.tiktok.com/@caremattershub" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" aria-label="TikTok">
                <TikTokIcon className="h-4 w-4" />
              </a>
            </div>
            <Button asChild className="rounded-full">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in">
            <nav className="flex flex-col p-4 gap-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                About Us
              </Link>
              
              {/* Mobile Services Links */}
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Our Services
              </div>
              {servicesList.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-2 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  {service.name}
                </Link>
              ))}

              {navLinks.filter(link => !['Home', 'About Us'].includes(link.name)).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="space-y-2 mb-4">
                  <a href="tel:+61452030000" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>0452 030 000</span>
                  </a>
                  <a href="tel:+61469786104" className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>0469 786 104</span>
                  </a>
                </div>
                <Button asChild className="w-full rounded-full">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
