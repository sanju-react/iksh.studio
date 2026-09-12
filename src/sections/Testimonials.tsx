import React, { useState } from 'react';
import { testimonialsData } from '../data/testimonials';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = testimonialsData[activeIdx];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-16">
        <span className="font-mono text-xs text-accent-gold uppercase tracking-widest font-medium">
          [ 07 // CLIENT PERSPECTIVES ]
        </span>
        <div className="h-[1px] flex-1 bg-sage-300/15" />
      </div>

      <div className="bg-forest-850/60 border border-sage-300/15 rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
        {/* Background Quote Icon */}
        <Quote className="absolute -top-6 -right-6 w-48 h-48 text-sage-300/5 pointer-events-none rotate-12" />

        <div className="max-w-4xl relative z-10">
          {/* Quote text */}
          <blockquote className="font-serif-title text-2xl sm:text-4xl md:text-5xl text-ivory-200 font-normal leading-snug tracking-tight mb-12">
            "{current.quote}"
          </blockquote>

          {/* Author & Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-sage-300/10">
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.author}
                className="w-14 h-14 rounded-full object-cover border border-sage-300/30"
              />
              <div>
                <h4 className="font-serif text-xl text-white">{current.author}</h4>
                <p className="font-mono text-xs text-sage-300">
                  {current.role} — <span className="text-accent-gold">{current.company}</span>
                </p>
                {current.metrics && (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-accent-emerald mt-1">
                    {current.metrics}
                  </span>
                )}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-sage-400 mr-2">
                0{activeIdx + 1} / 0{testimonialsData.length}
              </span>
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 hover:bg-forest-700 hover:border-ivory-200 transition-colors"
                aria-label="Previous quote"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 hover:bg-forest-700 hover:border-ivory-200 transition-colors"
                aria-label="Next quote"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
