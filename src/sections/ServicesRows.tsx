import React, { useState } from 'react';
import { servicesData } from '../data/services';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useCursor } from '../hooks/useCursor';

interface ServicesRowsProps {
  onSelectService?: (serviceId: string) => void;
}

export const ServicesRows: React.FC<ServicesRowsProps> = ({ onSelectService }) => {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedId, setExpandedId] = useState<string | null>('branding');
  const { setCursor, resetCursor } = useCursor();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const activeService = servicesData.find((s) => s.id === activeHoverId);

  return (
    <section
      id="services-section"
      className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none"
    >
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 border-b border-sage-300/15 pb-8">
        <div>
          <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block mb-2 font-medium">
            [ 02 // DISCIPLINES & CAPABILITIES ]
          </span>
          <h2 className="font-serif-title text-5xl sm:text-6xl md:text-7xl text-ivory-200">
            WHAT WE DO.
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-sage-300 max-w-md">
          A bespoke synthesis of brand strategy, high-fashion art direction, and modern web engineering.
        </p>
      </div>

      {/* Floating Hover Image Preview (Follows cursor smoothly on desktop) */}
      <div
        className="pointer-events-none fixed z-40 hidden lg:block transition-opacity duration-300 rounded-xl overflow-hidden shadow-2xl border border-sage-300/20"
        style={{
          width: 320,
          height: 220,
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: activeHoverId ? 1 : 0,
          transform: 'translate(-50%, -50%) scale(1)',
        }}
      >
        {activeService && (
          <div className="relative w-full h-full bg-forest-950">
            <img
              src={activeService.image}
              alt={activeService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
            <span className="absolute bottom-3 left-4 font-mono text-xs text-ivory-200 uppercase tracking-wider">
              {activeService.tag}
            </span>
          </div>
        )}
      </div>

      {/* Editorial Service Rows */}
      <div
        className="relative divide-y divide-sage-300/10"
        onMouseMove={handleMouseMove}
      >
        {servicesData.map((service) => {
          const isExpanded = expandedId === service.id;

          return (
            <div
              key={service.id}
              onMouseEnter={() => {
                setActiveHoverId(service.id);
                setCursor('pointer', 'EXPLORE');
              }}
              onMouseLeave={() => {
                setActiveHoverId(null);
                resetCursor();
              }}
              onClick={() => {
                setExpandedId(isExpanded ? null : service.id);
                if (onSelectService) onSelectService(service.id);
              }}
              className="group py-8 md:py-12 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Number & Service Name */}
                <div className="flex items-baseline gap-6 sm:gap-10">
                  <span className="font-mono text-sm sm:text-base text-accent-emerald transition-transform duration-300 group-hover:translate-x-2">
                    {service.number}
                  </span>
                  <h3 className="font-serif-title text-3xl sm:text-5xl md:text-6xl text-ivory-200 group-hover:text-accent-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>

                {/* Short Desc & Arrow */}
                <div className="flex items-center justify-between lg:justify-end gap-8 pl-12 lg:pl-0">
                  <p className="font-sans text-xs sm:text-sm md:text-base text-sage-300 max-w-md hidden sm:block">
                    {service.shortDesc}
                  </p>

                  <div className="w-12 h-12 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 group-hover:border-ivory-200 group-hover:bg-ivory-200 group-hover:text-forest-950 transition-all duration-300">
                    <ArrowUpRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-90' : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Collapsible Deep-Dive Deliverables Box */}
              {isExpanded && (
                <div className="mt-8 pt-6 border-t border-sage-300/10 grid grid-cols-1 md:grid-cols-12 gap-8 pl-12 sm:pl-16">
                  <div className="md:col-span-5">
                    <p className="text-sage-200 text-sm sm:text-base leading-relaxed mb-4">
                      {service.fullDesc}
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full bg-forest-800 text-accent-emerald font-mono text-xs">
                      {service.tag}
                    </span>
                  </div>

                  <div className="md:col-span-7">
                    <span className="font-mono text-xs text-sage-400 uppercase tracking-wider block mb-3">
                      KEY DELIVERABLES & CAPABILITIES:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-ivory-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
