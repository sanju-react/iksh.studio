import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { servicesData } from '../data/services';
import { CheckCircle2, ChevronDown, ArrowUpRight } from 'lucide-react';
import { FinalCTA } from '../sections/FinalCTA';
import { MagneticButton } from '../components/common/MagneticButton';
import { SoftAurora } from '../components/common/SoftAurora';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ServicesPageProps {
  onContact: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onContact }) => {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lines = [
    { text: 'CRAFTED FOR', className: 'text-ivory-200 font-serif-title tracking-tight' },
    { text: 'CATEGORY', className: 'text-accent-gold font-editorial italic font-normal' },
    { text: 'LEADERSHIP.', className: 'text-white font-sans font-black tracking-tighter' },
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

  const faqs = [
    {
      q: 'How long does a full brand identity & web flagship project take?',
      a: 'A typical comprehensive engagement (Brand Identity + Custom Interactive Website) spans 8 to 12 weeks. We work in disciplined sprints with clear weekly milestones and staging deliverables.'
    },
    {
      q: 'Do you work with startups or only established global brands?',
      a: 'We partner with ambitious teams at both stages. Whether you are an early-stage founder preparing for a Series A launch or an established luxury brand orchestrating a complete digital transformation, we tailor our systems to your goals.'
    },
    {
      q: 'What technologies do you use for web development?',
      a: 'We architect modern digital experiences using React, Next.js, Vite, TypeScript, Tailwind CSS, GSAP for 60fps animations, WebGL / Three.js for interactive 3D, and headless CMS platforms (Sanity, Strapi, Shopify Plus).'
    },
    {
      q: 'How does your ongoing growth & marketing partnership work?',
      a: 'Post-launch, we offer dedicated monthly creative retainers covering multi-channel performance marketing, organic social design systems, ongoing conversion rate optimization (CRO), and continuous feature evolution.'
    }
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
                We combine brand psychology, high-art design, and cutting-edge web engineering to create unforgettable digital ecosystems.
              </p>
            </div>
            <div className="lg:col-span-4 flex items-center lg:justify-end text-xs font-mono text-sage-400">
              <span>{servicesData.length} CORE PRACTICE DISCIPLINES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Content Section */}
      <div className="px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto pb-20 pt-10">
        {/* Deep-Dive Services Cards */}
        <div className="space-y-16 mb-28">
          {servicesData.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="p-8 sm:p-12 rounded-3xl bg-forest-900 border border-sage-300/15 hover:border-sage-300/30 transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left Column Text */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base text-accent-emerald font-semibold">
                      {service.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-forest-800 text-sage-300 font-mono text-xs uppercase">
                      {service.tag}
                    </span>
                  </div>

                  <h2 className="font-serif-title text-3xl sm:text-5xl text-white">
                    {service.title}
                  </h2>

                  <p className="font-sans text-base sm:text-lg text-sage-200 leading-relaxed">
                    {service.fullDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="pt-2">
                    <h4 className="font-mono text-xs uppercase text-accent-gold tracking-wider mb-3 font-semibold">
                      WHAT WE DELIVER:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ivory-200">
                          <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <MagneticButton
                      onClick={onContact}
                      variant="outline"
                      className="!py-3 !px-6 text-xs uppercase font-mono tracking-wider"
                    >
                      <span>Inquire About {service.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                    </MagneticButton>
                  </div>
                </div>

                {/* Right Column Image */}
                <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] bg-forest-950 border border-sage-300/15">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-4xl mx-auto mb-28">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block mb-2 font-medium">
              CLARITY & TRANSPARENCY
            </span>
            <h2 className="font-serif-title text-4xl sm:text-5xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="rounded-2xl border border-sage-300/15 bg-forest-900/80 p-6 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif text-lg sm:text-xl text-ivory-200">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-sage-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-accent-emerald' : ''
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <p className="mt-4 pt-4 border-t border-sage-300/10 text-sm sm:text-base text-sage-300 leading-relaxed font-sans">
                      {faq.a}
                    </p>
                  )}
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
