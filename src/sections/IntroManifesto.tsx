import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface StatCounterProps {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
  isTriggered: boolean;
}

const StatCounter: React.FC<StatCounterProps> = ({
  target,
  suffix,
  label,
  decimals = 0,
  isTriggered,
}) => {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!isTriggered) return;

    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = easeProgress * target;

      setCurrentVal(val);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentVal(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [isTriggered, target]);

  return (
    <div className="stat-card border-r last:border-r-0 border-sage-300/10 pr-4 group cursor-default">
      <span className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-ivory-200 block mb-2 tabular-nums group-hover:text-accent-gold transition-colors duration-300">
        {decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal)}
        <span className="text-accent-gold font-normal">{suffix}</span>
      </span>
      <span className="font-mono text-xs text-sage-400 uppercase tracking-wider block">
        {label}
      </span>
    </div>
  );
};

export const IntroManifesto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const statsBoxRef = useRef<HTMLDivElement>(null);
  const [countersTriggered, setCountersTriggered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const stats = [
    { target: 38, suffix: '+', label: 'Global Projects Delivered', decimals: 0 },
    { target: 14, suffix: '', label: 'Design & Tech Awards', decimals: 0 },
    { target: 100, suffix: '%', label: 'Bespoke Craft, 0 Templates', decimals: 0 },
    { target: 4.9, suffix: '/5', label: 'Client Satisfaction Index', decimals: 1 },
  ];

  useEffect(() => {
    const el = statsBoxRef.current;
    if (!el) return;

    // IntersectionObserver triggers when user scrolls into the section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCountersTriggered(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Main statement text reveal on scroll
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll('.manifesto-word');
        gsap.fromTo(
          words,
          { opacity: 0.2, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              end: 'bottom 55%',
              scrub: 0.4,
            },
          }
        );
      }

      // Stats box entrance
      if (statsBoxRef.current) {
        gsap.fromTo(
          statsBoxRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsBoxRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const pillars = [
    { title: 'STRATEGY', desc: 'Uncovering brand truths and category whitespace to position you as an undisputed leader.' },
    { title: 'DESIGN', desc: 'Crafting bespoke typography, visual identity systems, and tactile luxury brand assets.' },
    { title: 'TECHNOLOGY', desc: 'Engineering 60fps web flagships, interactive 3D spaces, and headless web ecosystems.' },
    { title: 'MARKETING', desc: 'Scaling digital acquisition funnels and social systems that turn audience into cult loyalty.' },
  ];

  return (
    <section
      ref={containerRef}
      className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none"
    >
      {/* Editorial Section Label */}
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-xs text-accent-gold uppercase tracking-widest font-medium">
          [ 01 // MANIFESTO & PHILOSOPHY ]
        </span>
        <div className="h-[1px] flex-1 bg-sage-300/15" />
      </div>

      {/* Monumental Headline */}
      <div className="max-w-5xl mb-16">
        <h2
          ref={headingRef}
          className="font-serif-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-ivory-200"
        >
          <span className="manifesto-word inline-block mr-3">WE</span>
          <span className="manifesto-word inline-block mr-3">TURN</span>
          <span className="manifesto-word inline-block mr-3 font-editorial italic text-accent-gold">
            IDEAS
          </span>
          <br className="hidden sm:inline" />
          <span className="manifesto-word inline-block mr-3">INTO</span>
          <span className="manifesto-word inline-block mr-3 font-editorial italic text-white font-normal">
            IDENTITIES.
          </span>
        </h2>

        <p
          ref={bodyRef}
          className="mt-10 font-sans text-lg sm:text-2xl md:text-3xl text-sage-300 font-light leading-relaxed max-w-4xl"
        >
          From strategy to design, from websites to campaigns, we create digital experiences
          built to make brands matter.
        </p>
      </div>

      {/* 4 Studio Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {pillars.map((pillar, idx) => (
          <div
            key={pillar.title}
            className="p-8 rounded-2xl bg-forest-850/40 border border-sage-300/10 hover:border-sage-300/30 hover:bg-forest-800/40 transition-all duration-500 group flex flex-col justify-between h-72"
          >
            <div>
              <span className="font-mono text-xs text-accent-emerald block mb-4">
                0{idx + 1}
              </span>
              <h3 className="font-serif text-2xl text-white group-hover:text-accent-gold transition-colors">
                {pillar.title}
              </h3>
            </div>
            <p className="font-sans text-sm text-sage-300 leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Studio Statistics & Authority Row with Animated Counters */}
      <div
        ref={statsBoxRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 md:p-12 rounded-2xl bg-forest-950 border border-sage-300/15 shadow-xl"
      >
        {stats.map((stat, i) => (
          <StatCounter
            key={i}
            target={stat.target}
            suffix={stat.suffix}
            label={stat.label}
            decimals={stat.decimals}
            isTriggered={countersTriggered}
          />
        ))}
      </div>
    </section>
  );
};
