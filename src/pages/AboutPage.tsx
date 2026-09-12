import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { studioInfo } from '../data/studio';
import { LiveClock } from '../components/common/LiveClock';
import { Compass, Eye, HeartHandshake, ShieldCheck } from 'lucide-react';
import { FinalCTA } from '../sections/FinalCTA';
import { SoftAurora } from '../components/common/SoftAurora';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface AboutPageProps {
  onContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onContact }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = [
    { text: 'AN INDEPENDENT', className: 'text-ivory-200 font-serif-title tracking-tight' },
    { text: 'CREATIVE', className: 'text-accent-gold font-editorial italic font-normal' },
    { text: 'SANCTUARY.', className: 'text-white font-sans font-black tracking-tighter' },
  ];

  useLayoutEffect(() => {
    const words = headlineRef.current?.querySelectorAll('.hero-word');
    if (!words || words.length === 0) return;

    gsap.killTweensOf(words);
    if (subtitleRef.current) gsap.killTweensOf(subtitleRef.current);

    gsap.set(words, {
      yPercent: 120,
      opacity: 0,
      rotateX: 25,
      transformOrigin: '50% 100%',
    });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(words, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.85,
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

    return () => {
      tl.kill();
    };
  }, []);

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

  const ethosList = [
    {
      icon: Eye,
      title: 'Artistic Distinctiveness',
      desc: 'We refuse generic templates and design trends. We construct tailored visual vernaculars that position our partners as undisputed category icons.',
    },
    {
      icon: Compass,
      title: 'Strategic Architecture',
      desc: 'Form follows conviction. Every color swatch, typographic scale, and motion curve is backed by psychological research and commercial intent.',
    },
    {
      icon: ShieldCheck,
      title: 'Obsessive Engineering',
      desc: 'We write bespoke React and GSAP code, ensuring 60fps animations, 100% Lighthouse scores, and sub-second load times across every device.',
    },
    {
      icon: HeartHandshake,
      title: 'Collaborative Partnership',
      desc: 'We operate as an extension of your leadership team, offering direct access to principal designers without account manager bottlenecks.',
    },
  ];

  return (
    <main className="relative z-10 select-none">
      {/* Page Hero with SoftAurora - Exactly like Home Hero */}
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[85vh] md:min-h-[88vh] flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-12 px-4 sm:px-8 md:px-12 w-full max-w-[1720px] mx-auto z-10 select-none overflow-hidden"
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

          {/* Narrative Description Row */}
          <div className="mt-10 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-sage-300/10 pt-8">
            <div className="lg:col-span-8">
              <p
                ref={subtitleRef}
                className="font-sans text-base sm:text-lg md:text-xl text-sage-200/90 font-light leading-relaxed max-w-2xl"
              >
                An intimate studio of obsessive brand architects, designers, and creative engineers crafting bespoke digital identities.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap items-center lg:justify-end gap-4 text-xs font-mono text-sage-400">
              <LiveClock showLocation={true} />
            </div>
          </div>
        </div>
      </section>

      {/* About Content Section */}
      <div className="px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto pb-20 pt-10">
        {/* Studio Narrative & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-28">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs text-accent-emerald uppercase tracking-widest block font-semibold">
              OUR MANIFESTO
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl text-white leading-[1.05]">
              We believe great brands are felt before they are understood.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-6 text-sage-300 font-sans text-base sm:text-lg leading-relaxed">
            <p>
              In an era overflowing with template designs and algorithmically sanitized aesthetics, true luxury lies in distinctiveness. IKSH Studio was founded to bridge the divide between fine art sensibility and rigorous digital engineering.
            </p>
            <p>
              We purposefully keep our client roster small to ensure every partner receives direct access to principal designers. No middle managers, no bloated overhead — just pure creative output and uncompromising craft.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Studio Ethos */}
        <div className="mb-28">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block mb-2 font-medium">
              HOW WE OPERATE
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-white">
              The IKSH Studio Ethos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ethosList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-forest-900/80 border border-sage-300/15 hover:border-accent-emerald/40 transition-all duration-300 flex flex-col justify-between h-80"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-accent-emerald mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-3">{item.title}</h3>
                  </div>
                  <p className="font-sans text-sm text-sage-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <FinalCTA onStartProject={onContact} />
      </div>
    </main>
  );
};
