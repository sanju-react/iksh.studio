import React from 'react';
import { PageView } from '../../types';
import { Logo } from '../common/Logo';
import { LiveClock } from '../common/LiveClock';
import { KineticRollText } from '../common/KineticRollText';
import { studioInfo } from '../../data/studio';
import { launchEmailClient } from '../../utils/contact';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToTop }) => {
  const navItems: { label: string; page: PageView }[] = [
    { label: 'Work', page: 'work' },
    { label: 'Services', page: 'services' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <footer className="border-t border-sage-300/15 bg-forest-950 text-ivory-200 select-none z-10 relative">
      {/* Top Banner Grid */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Studio Brand & Tagline */}
          <div className="lg:col-span-5 space-y-6">
            <div onClick={() => onNavigate('home')} className="cursor-pointer">
              <Logo size="lg" animated={true} />
            </div>
            <p className="font-serif italic text-sage-300 text-lg md:text-xl max-w-sm">
              "We make brands impossible to ignore."
            </p>
            <div className="pt-2">
              <LiveClock showLocation={true} />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block font-medium">
              NAVIGATION
            </span>
            <ul className="space-y-3 font-mono text-sm text-sage-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="group hover:text-ivory-200 transition-colors flex items-center cursor-pointer"
                >
                  <KineticRollText
                    text="HOME"
                    cloneClassName="text-accent-gold font-bold"
                    chromatic={true}
                    staggerDelay={16}
                  />
                </button>
              </li>
              {navItems.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className="group hover:text-ivory-200 transition-colors flex items-center cursor-pointer"
                  >
                    <KineticRollText
                      text={item.label.toUpperCase()}
                      cloneClassName="text-accent-gold font-bold"
                      chromatic={true}
                      staggerDelay={16}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Inquiries */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block font-medium">
              COMMISSIONS & SOCIALS
            </span>
            <div className="space-y-2 font-mono text-sm">
              <a
                href={`mailto:${studioInfo.email}`}
                onClick={(e) =>
                  launchEmailClient(e, {
                    to: studioInfo.email,
                    subject: 'Project Inquiry — IKSH Studio',
                  })
                }
                className="text-ivory-200 hover:text-accent-gold flex items-center gap-1.5 transition-colors group cursor-pointer"
              >
                <KineticRollText
                  text={studioInfo.email}
                  cloneClassName="text-accent-gold"
                  chromatic={true}
                  staggerDelay={12}
                />
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="text-xs text-sage-400">
                Surat, Gujarat, India
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 font-mono text-xs text-sage-300">
              {studioInfo.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ivory-200 transition-colors flex items-center gap-1 group"
                >
                  <KineticRollText
                    text={s.label}
                    cloneClassName="text-accent-gold font-bold"
                    chromatic={true}
                    staggerDelay={15}
                  />
                  <ArrowUpRight className="w-3 h-3 text-sage-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-sage-300/10 py-8 px-4 sm:px-8 md:px-12">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-sage-400">
          <div>
            © {new Date().getFullYear()} IKSH STUDIO. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-6">
            <span>DESIGNED & ENGINEERED BESPOKE</span>
            <button
              onClick={onScrollToTop}
              className="group inline-flex items-center gap-1.5 text-ivory-200 hover:text-accent-gold transition-colors cursor-pointer"
            >
              <KineticRollText
                text="BACK TO TOP"
                cloneClassName="text-accent-gold font-bold"
                chromatic={true}
                staggerDelay={14}
              />
              <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
