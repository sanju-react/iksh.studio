import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export const BrandingShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll speeds for different columns
      if (col1Ref.current) {
        gsap.to(col1Ref.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (col2Ref.current) {
        gsap.to(col2Ref.current, {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      if (col3Ref.current) {
        gsap.to(col3Ref.current, {
          y: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const showcaseItems = [
    {
      title: "L'Oréal Peptide Care",
      category: 'Packaging CGI & 3D',
      image: '/Archive/1.png',
    },
    {
      title: 'KOFI Craft Cold Brew',
      category: 'Signage & Cup Suite',
      image: '/Kofi/Post 1.jpg',
    },
    {
      title: 'NUR (نور) Specialty Café',
      category: 'Brand & Cup Carrier',
      image: '/NUR/2.jpg',
    },
    {
      title: 'Peptide Editorial Series',
      category: 'High-Fashion Portraiture',
      image: '/Archive/2.png',
    },
    {
      title: 'KOFI Outdoor Signage',
      category: 'Storefront Architecture',
      image: '/Kofi/Post 2.jpg',
    },
    {
      title: 'NUR Moka Pot Pour',
      category: 'Culinary Photography',
      image: '/NUR/6.jpg',
    },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none overflow-hidden"
    >
      {/* Editorial Headline */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <span className="font-mono text-xs text-accent-gold font-medium uppercase tracking-widest block mb-4">
          [ 04 // VISUAL ECOSYSTEMS ]
        </span>
        <h2 className="font-serif-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory-200 uppercase leading-[0.98]">
          BRANDS NEED <br />
          <span className="font-editorial italic font-normal text-accent-gold">MORE THAN</span> <br />
          A LOGO.
        </h2>
        <p className="mt-6 font-sans text-base sm:text-lg text-sage-300 max-w-2xl mx-auto">
          We design holistic sensory ecosystems where every touchpoint—from debossed packaging to digital micro-animations—reinforces your brand prestige.
        </p>
      </div>

      {/* Asymmetric Parallax Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Column 1 */}
        <div ref={col1Ref} className="space-y-6 md:space-y-8">
          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-[4/5]">
            <img
              src={showcaseItems[0].image}
              alt={showcaseItems[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[0].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[0].title}
              </h3>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-square">
            <img
              src={showcaseItems[1].image}
              alt={showcaseItems[1].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[1].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[1].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div ref={col2Ref} className="space-y-6 md:space-y-8 sm:mt-12">
          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-square">
            <img
              src={showcaseItems[2].image}
              alt={showcaseItems[2].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[2].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[2].title}
              </h3>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-[4/5]">
            <img
              src={showcaseItems[3].image}
              alt={showcaseItems[3].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[3].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[3].title}
              </h3>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div ref={col3Ref} className="space-y-6 md:space-y-8 sm:col-span-2 lg:col-span-1">
          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-[4/5]">
            <img
              src={showcaseItems[4].image}
              alt={showcaseItems[4].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[4].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[4].title}
              </h3>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 aspect-square">
            <img
              src={showcaseItems[5].image}
              alt={showcaseItems[5].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <span className="font-mono text-xs text-accent-gold font-medium uppercase">
                {showcaseItems[5].category}
              </span>
              <h3 className="font-serif text-2xl text-white">
                {showcaseItems[5].title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
