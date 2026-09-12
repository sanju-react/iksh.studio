import React, { useState } from 'react';
import { studioInfo } from '../data/studio';
import { ChevronDown } from 'lucide-react';

export const AboutStudio: React.FC = () => {
  const [openValueIdx, setOpenValueIdx] = useState<number | null>(0);

  return (
    <section
      id="about-section"
      className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none"
    >
      {/* Section Tag */}
      <div className="flex items-center gap-4 mb-16">
        <span className="font-mono text-xs text-accent-gold uppercase tracking-widest font-medium">
          [ 05 // ABOUT IKSH STUDIO ]
        </span>
        <div className="h-[1px] flex-1 bg-sage-300/15" />
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column Heading */}
        <div className="lg:col-span-5">
          <h2 className="font-serif-title text-5xl sm:text-6xl md:text-7xl text-ivory-200 uppercase leading-[0.95] sticky top-32">
            WE ARE <br />
            <span className="font-editorial italic text-accent-gold font-normal">IKSH.</span>
          </h2>
        </div>

        {/* Right Column Editorial Story */}
        <div className="lg:col-span-7 space-y-8">
          <p className="font-sans text-xl sm:text-2xl md:text-3xl text-ivory-200 font-light leading-relaxed">
            IKSH Studio is a creative studio focused on building brands, digital experiences and visual systems that feel relevant, memorable and human.
          </p>

          <p className="font-sans text-base sm:text-lg text-sage-300 leading-relaxed">
            We combine strategy, design, technology and culture to create work that looks beautiful and works hard. We reject corporate complacency and template culture in favor of distinct editorial craft and ruthless performance.
          </p>

          {/* Interactive Core Values Accordion */}
          <div className="pt-6 space-y-3">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-wider block mb-4 font-medium">
              STUDIO PRINCIPLES & ETHOS
            </span>

            {studioInfo.values.map((val, idx) => {
              const isOpen = openValueIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenValueIdx(isOpen ? null : idx)}
                  className="rounded-xl border border-sage-300/15 bg-forest-850/50 overflow-hidden transition-all duration-300 cursor-pointer"
                >
                  <div className="p-5 flex items-center justify-between gap-4">
                    <span className="font-serif text-lg sm:text-xl text-ivory-200">
                      0{idx + 1}. {val.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-sage-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-accent-emerald' : ''
                      }`}
                    />
                  </div>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-sage-300 font-sans leading-relaxed border-t border-sage-300/10">
                      {val.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
