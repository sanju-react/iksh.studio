import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PageView } from '../../types';
import { Logo } from '../common/Logo';
import { LiveClock } from '../common/LiveClock';
import { studioInfo } from '../../data/studio';
import { launchEmailClient } from '../../utils/contact';
import { ArrowUpRight, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.4,
        ease: 'power3.out',
      });

      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('.mobile-link-item');
        tl.fromTo(
          items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          '-=0.2'
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.35,
        ease: 'power3.in',
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems: { label: string; page: PageView }[] = [
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleLinkClick = (page: PageView) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9990] bg-forest-950/98 backdrop-blur-2xl flex flex-col justify-between p-6 md:p-12 opacity-0 pointer-events-none transition-all select-none"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-sage-300/10 pb-6">
        <div onClick={() => handleLinkClick('home')}>
          <Logo size="md" />
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 hover:bg-forest-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div ref={linksRef} className="flex flex-col gap-5 my-auto py-6">
        <div className="mobile-link-item">
          <button
            onClick={() => handleLinkClick('home')}
            className={`w-full text-left font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors ${
              currentPage === 'home' ? 'text-accent-gold italic' : 'text-ivory-200 hover:text-accent-gold'
            }`}
          >
            <span>Home</span>
          </button>
        </div>

        {navItems.map((item) => (
          <div key={item.page} className="mobile-link-item">
            <button
              onClick={() => handleLinkClick(item.page)}
              className={`w-full text-left font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight transition-colors ${
                currentPage === item.page ? 'text-accent-gold italic' : 'text-ivory-200 hover:text-accent-gold'
              }`}
            >
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div ref={footerRef} className="border-t border-sage-300/10 pt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-sage-300">
          <LiveClock showLocation={true} />
          <span className="text-ivory-200">{studioInfo.availability}</span>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs font-mono pt-2">
          <a
            href={`mailto:${studioInfo.email}`}
            onClick={(e) =>
              launchEmailClient(e, {
                to: studioInfo.email,
                subject: 'Project Inquiry — IKSH Studio',
              })
            }
            className="text-ivory-200 hover:text-accent-emerald flex items-center gap-1 transition-colors cursor-pointer"
          >
            {studioInfo.email}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <div className="flex gap-4 text-sage-300">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-ivory-200">IG</a>
            <a href="https://behance.net" target="_blank" rel="noreferrer" className="hover:text-ivory-200">BE</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-ivory-200">LI</a>
          </div>
        </div>
      </div>
    </div>
  );
};
