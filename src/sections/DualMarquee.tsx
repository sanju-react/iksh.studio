import React from 'react';

export const DualMarquee: React.FC = () => {
  const marqueeItems1 = [
    'BRANDING',
    'GRAPHIC DESIGN',
    'DIGITAL MARKETING',
    'WEBSITE DESIGN & DEV',
    'CREATIVE STRATEGY',
    'SOCIAL MEDIA SYSTEMS',
  ];

  const marqueeItems2 = [
    'SURAT • INDIA',
    'AWWWARDS WINNER',
    'HAUTE COUTURE DIGITAL',
    'BESPOKE CODE',
    'ZERO TEMPLATES',
    'EDITORIAL EXCELLENCE',
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden border-y border-sage-300/10 bg-forest-950/60 select-none z-10 relative">
      {/* Track 1: Left */}
      <div className="flex overflow-hidden mb-6">
        <div className="animate-marquee-left flex items-center gap-8 md:gap-14 whitespace-nowrap">
          {[...marqueeItems1, ...marqueeItems1, ...marqueeItems1].map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 md:gap-14">
              <span className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-ivory-200/90 hover:text-accent-gold transition-colors cursor-default">
                {text}
              </span>
              <span className="font-mono text-sm text-sage-400">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Track 2: Right (Reverse) */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee-right flex items-center gap-8 md:gap-14 whitespace-nowrap">
          {[...marqueeItems2, ...marqueeItems2, ...marqueeItems2].map((text, idx) => (
            <div key={idx} className="flex items-center gap-8 md:gap-14">
              <span className="font-editorial italic text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-sage-300/70 hover:text-white transition-colors cursor-default">
                {text}
              </span>
              <span className="font-mono text-sm text-accent-gold">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
