import React, { useState, useEffect } from 'react';
import { PageView } from '../../types';
import { Logo } from '../common/Logo';
import { MagneticButton } from '../common/MagneticButton';
import { MobileMenu } from './MobileMenu';
import { Menu, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-500 ease-out select-none ${
          isScrolled
            ? 'py-3.5 bg-forest-950/85 backdrop-blur-xl border-b border-sage-300/10 shadow-[0_10px_30px_rgba(4,16,12,0.4)]'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            aria-label="IKSH STUDIO Home"
          >
            <Logo size={isScrolled ? 'sm' : 'md'} animated={true} />
          </div>

          {/* Desktop Center Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-forest-850/60 backdrop-blur-md px-5 py-2 rounded-full border border-sage-300/15">
            <button
              onClick={() => onNavigate('home')}
              className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                currentPage === 'home'
                  ? 'bg-ivory-200 text-forest-950 font-semibold shadow-sm'
                  : 'text-sage-300 hover:text-ivory-200'
              }`}
            >
              Home
            </button>
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                  currentPage === link.page
                    ? 'bg-ivory-200 text-forest-950 font-semibold shadow-sm'
                    : 'text-sage-300 hover:text-ivory-200'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Desktop CTA */}
            <div className="hidden sm:block">
              <MagneticButton
                onClick={() => onNavigate('contact')}
                variant="primary"
                cursorType="cta"
                cursorText="LET'S TALK"
                className="!py-2.5 !px-5 text-xs"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full border border-sage-300/20 bg-forest-800/40 flex items-center justify-center text-ivory-200 hover:bg-forest-700 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </>
  );
};
