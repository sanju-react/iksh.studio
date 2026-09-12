import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { MagneticButton } from '../components/common/MagneticButton';
import { SoftAurora } from '../components/common/SoftAurora';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface HeroProps {
  isAppLoaded?: boolean;
  onExploreWork: () => void;
  onContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isAppLoaded = true,
  onExploreWork,
  onContact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = [
    { text: 'WE MAKE', className: 'text-ivory-200 font-serif-title tracking-tight' },
    { text: 'BRANDS', className: 'text-accent-gold font-editorial italic font-normal' },
    { text: 'IMPOSSIBLE', className: 'text-white font-sans font-black tracking-tighter' },
    { text: 'TO IGNORE.', className: 'text-ivory-200 font-editorial italic font-normal' },
  ];

  useLayoutEffect(() => {
    const words = headlineRef.current?.querySelectorAll('.hero-word');
    if (!words || words.length === 0) return;

    // While preloader is active, keep text hidden and primed
    if (!isAppLoaded) {
      gsap.set(words, {
        yPercent: 120,
        opacity: 0,
        rotateX: 25,
        transformOrigin: '50% 100%',
      });
      if (subtitleRef.current) gsap.set(subtitleRef.current, { y: 25, opacity: 0 });
      if (actionsRef.current) gsap.set(actionsRef.current, { y: 20, opacity: 0 });
      return;
    }

    // Reset and kill previous tweens
    gsap.killTweensOf(words);
    if (subtitleRef.current) gsap.killTweensOf(subtitleRef.current);
    if (actionsRef.current) gsap.killTweensOf(actionsRef.current);

    // Initial state
    gsap.set(words, {
      yPercent: 120,
      opacity: 0,
      rotateX: 25,
      transformOrigin: '50% 100%',
    });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { y: 25, opacity: 0 });
    if (actionsRef.current) gsap.set(actionsRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.15 });

    tl.to(words, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
    });

    if (subtitleRef.current) {
      tl.to(
        subtitleRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.45'
      );
    }

    if (actionsRef.current) {
      tl.to(
        actionsRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.45'
      );
    }

    return () => {
      tl.kill();
    };
  }, [isAppLoaded]);

  // Subtle interactive 3D parallax on mouse move across hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !headlineRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(headlineRef.current, {
      x: x * 15,
      y: y * 10,
      rotateX: -y * 4,
      rotateY: x * 4,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || !headlineRef.current) return;
    gsap.to(headlineRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-8 px-4 sm:px-8 md:px-12 w-full max-w-[1720px] mx-auto z-10 select-none overflow-hidden"
    >
      {/* Soft Aurora Background Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#071C17"
          color2="#2FE69E"
          color3="#D8C39E"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
        {/* Subtle vignette layer to keep typography contrast clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/40 via-transparent to-forest-950/60 pointer-events-none" />
      </div>

      {/* Center Main Editorial Heading (Shifted Upwards) */}
      <div className="mt-2 sm:mt-4 md:mt-6 mb-auto py-2 md:py-4 relative w-full z-10 -translate-y-2 sm:-translate-y-4 md:-translate-y-6">
        <h1
          ref={headlineRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.8rem] xl:text-[9.2rem] font-medium leading-[0.90] tracking-[-0.035em] uppercase transition-transform will-change-transform"
          style={{ perspective: 1200 }}
        >
          {lines.map((line, lineIdx) => (
            <div
              key={lineIdx}
              className="overflow-hidden py-0.5 flex flex-wrap items-baseline"
            >
              {line.text.split(' ').map((word, wordIdx) => (
                <span
                  key={wordIdx}
                  className="overflow-hidden mr-4 sm:mr-6 md:mr-8 inline-block"
                >
                  <span
                    className={`hero-word inline-block will-change-transform transition-colors duration-200 hover:text-accent-emerald ${line.className}`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </h1>

        {/* Narrative Description & CTA Row */}
        <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-sage-300/10 pt-8">
          <div className="lg:col-span-7">
            <p
              ref={subtitleRef}
              className="font-sans text-base sm:text-lg md:text-xl text-sage-200/90 font-light leading-relaxed max-w-2xl"
            >
              IKSH Studio is an independent creative digital studio crafting brands,
              visual identities, digital experiences and marketing systems that people remember.
            </p>
          </div>

          <div
            ref={actionsRef}
            className="lg:col-span-5 flex flex-wrap items-center gap-4 lg:justify-end"
          >
            <MagneticButton
              onClick={onExploreWork}
              variant="primary"
              cursorType="pointer"
              cursorText="EXPLORE"
              className="!py-4 !px-8 text-sm"
            >
              <span>View Selected Work</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
            </MagneticButton>

            <MagneticButton
              onClick={onContact}
              variant="outline"
              cursorType="cta"
              cursorText="LET'S TALK"
              className="!py-4 !px-8 text-sm"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Studio Highlights */}
      <div className="flex items-center justify-between border-t border-sage-300/10 pt-6 font-mono text-xs text-sage-400">
        <button
          onClick={onExploreWork}
          className="flex items-center gap-2 hover:text-ivory-200 transition-colors cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>SCROLL TO EXPLORE ARCHIVE</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">BRANDING • DESIGN • DIGITAL • MARKETING</span>
        </div>
      </div>
    </section>
  );
};
