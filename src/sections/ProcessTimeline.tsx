import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processData } from '../data/process';
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Compass,
  Layers,
  Palette,
  Code2,
  Rocket,
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Phase Icons mapping
const PHASE_ICONS = [Compass, Layers, Palette, Code2, Rocket, TrendingUp];

export const ProcessTimeline: React.FC = () => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressKey, setProgressKey] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentStep = useMemo(() => processData[activeStepIdx], [activeStepIdx]);
  const CurrentIcon = PHASE_ICONS[activeStepIdx] || Compass;

  // Auto-play timer effect
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % processData.length);
      setProgressKey((prev) => prev + 1);
    }, 7500);

    return () => clearInterval(timer);
  }, [isPlaying, activeStepIdx]);

  // Initial ScrollTrigger entrance animation for the section
  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        '.process-header-elem',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Tabs entrance
      gsap.fromTo(
        '.process-tab-btn',
        { y: 30, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: tabsContainerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Main Card entrance
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Rich animation whenever activeStepIdx changes
  useEffect(() => {
    if (prefersReducedMotion || !cardContentRef.current) return;

    const ctx = gsap.context(() => {
      // Animate phase badge and title
      gsap.fromTo(
        '.phase-badge',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.7)' }
      );

      gsap.fromTo(
        '.phase-title',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.phase-desc',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: 0.05, ease: 'power2.out' }
      );

      // Animate Visualizer HUD
      gsap.fromTo(
        '.phase-visualizer',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      // Animate checklist items with stagger
      const items = cardContentRef.current?.querySelectorAll('.milestone-item');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { x: -18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
        );

        const checkIcons = cardContentRef.current?.querySelectorAll('.check-icon');
        if (checkIcons && checkIcons.length > 0) {
          gsap.fromTo(
            checkIcons,
            { scale: 0, rotate: -45 },
            { scale: 1, rotate: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }
          );
        }
      }
    }, cardRef);

    return () => ctx.revert();
  }, [activeStepIdx, prefersReducedMotion]);

  // Mouse move handler for interactive card spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleSelectStep = (idx: number) => {
    setActiveStepIdx(idx);
    setProgressKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveStepIdx((prev) => (prev === 0 ? processData.length - 1 : prev - 1));
    setProgressKey((prev) => prev + 1);
  };

  const handleNext = () => {
    setActiveStepIdx((prev) => (prev === processData.length - 1 ? 0 : prev + 1));
    setProgressKey((prev) => prev + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="process-section"
      className="py-24 md:py-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-sage-300/15 pb-8">
        <div>
          <span className="process-header-elem font-mono text-xs text-accent-gold uppercase tracking-widest block mb-2 font-medium">
            [ 06 // METHODOLOGY & DELIVERY ]
          </span>
          <h2 className="process-header-elem font-serif-title text-5xl sm:text-6xl md:text-7xl text-ivory-200">
            HOW WE WORK.
          </h2>
        </div>
        <div className="process-header-elem flex flex-col sm:items-end gap-3 max-w-md">
          <p className="font-sans text-sm sm:text-base text-sage-300">
            A disciplined, collaborative roadmap engineered to eliminate ambiguity and deliver undeniable category dominance.
          </p>
          {/* Autoplay Play/Pause Toggle & Step counter */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-sage-300/20 text-xs font-mono text-sage-300 hover:text-accent-emerald hover:border-accent-emerald/40 transition-all cursor-pointer"
              title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-accent-emerald" />
                  <span>AUTOPLAY ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-sage-400" />
                  <span>AUTOPLAY PAUSED</span>
                </>
              )}
            </button>
            <span className="font-mono text-xs text-accent-gold/80">
              {currentStep.number} / 0{processData.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Track Line with Animated Shimmer */}
      <div className="relative mb-6 hidden lg:block">
        <div className="w-full h-[3px] bg-forest-850 rounded-full overflow-hidden relative">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-accent-emerald via-accent-mint to-accent-gold transition-all duration-700 ease-out relative"
            style={{
              width: `${((activeStepIdx + 1) / processData.length) * 100}%`
            }}
          >
            {/* Glowing Leading Head */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#2FE69E]" />
          </div>
        </div>
      </div>

      {/* Interactive Step Navigation Ribbon */}
      <div ref={tabsContainerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {processData.map((step, idx) => {
          const isActive = activeStepIdx === idx;
          const StepIcon = PHASE_ICONS[idx] || Compass;

          return (
            <button
              key={step.number}
              onClick={() => handleSelectStep(idx)}
              className={`process-tab-btn p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                isActive
                  ? 'bg-forest-800/95 border-accent-emerald text-white shadow-[0_0_30px_rgba(47,230,158,0.22)] scale-[1.02] -translate-y-0.5'
                  : 'bg-forest-900/60 border-sage-300/10 text-sage-300 hover:border-sage-300/30 hover:bg-forest-850/70 hover:-translate-y-0.5'
              }`}
            >
              {/* Subtle Auto-play Progress Fill on active card */}
              {isActive && isPlaying && (
                <div
                  key={progressKey}
                  className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-accent-emerald to-accent-gold animate-[progress_7.5s_linear_forwards]"
                  style={{
                    animationDuration: '7.5s',
                    animationTimingFunction: 'linear'
                  }}
                />
              )}

              {/* Top Step Number, Icon & Duration */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <StepIcon
                    className={`w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-accent-emerald' : 'text-sage-400'
                    }`}
                  />
                  <span
                    className={`font-mono text-xs transition-colors ${
                      isActive ? 'text-accent-emerald font-bold' : 'text-sage-400'
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-sage-400 uppercase tracking-wider">
                  {step.duration}
                </span>
              </div>

              {/* Step Title */}
              <h3
                className={`font-serif text-lg tracking-wide transition-colors ${
                  isActive ? 'text-accent-gold font-semibold' : 'text-ivory-200 group-hover:text-white'
                }`}
              >
                {step.title}
              </h3>

              {/* Active Indicator Line on bottom of tab */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-emerald shadow-[0_0_8px_#2FE69E]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive Card with Mouse Spotlight & Kinetic Transitions */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="bg-forest-850/85 border border-sage-300/20 rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all duration-300"
      >
        {/* Interactive Mouse Following Spotlight */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-60"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(47,230,158,0.12), transparent 70%)`
          }}
        />

        {/* Ambient Corner Glow */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-accent-emerald/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-accent-gold/5 blur-3xl pointer-events-none" />

        <div ref={cardContentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="phase-badge inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-1.5 rounded-full bg-forest-800/90 text-accent-gold border border-accent-gold/40 font-medium shadow-[0_0_15px_rgba(216,195,158,0.12)]">
                <CurrentIcon className="w-3.5 h-3.5" />
                PHASE {currentStep.number}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-sage-300 bg-forest-900/60 px-3 py-1.5 rounded-full border border-sage-300/10">
                <Clock className="w-3.5 h-3.5 text-accent-gold" />
                <span>{currentStep.duration}</span>
              </div>
            </div>

            <h3 className="phase-title font-serif-title text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
              {currentStep.title} —{' '}
              <span className="font-editorial italic font-normal text-accent-gold">
                {currentStep.phase}
              </span>
            </h3>

            <p className="phase-desc font-sans text-base sm:text-lg text-sage-200 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Navigation & Controls inside card */}
            <div className="flex items-center justify-between pt-4 border-t border-sage-300/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full border border-sage-300/20 bg-forest-900/50 flex items-center justify-center text-ivory-200 hover:border-accent-gold hover:text-accent-gold hover:bg-forest-750 transition-all cursor-pointer active:scale-95 shadow-md"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full border border-sage-300/20 bg-forest-900/50 flex items-center justify-center text-ivory-200 hover:border-accent-gold hover:text-accent-gold hover:bg-forest-750 transition-all cursor-pointer active:scale-95 shadow-md"
                  aria-label="Next step"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick phase jumping pills */}
              <div className="flex items-center gap-1.5">
                {processData.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeStepIdx === i
                        ? 'w-8 bg-accent-gold shadow-[0_0_8px_#D8C39E]'
                        : 'w-2 bg-sage-300/30 hover:bg-sage-300/60'
                    }`}
                    aria-label={`Jump to Phase ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Milestones Checklist & Interactive HUD Visualizer Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Visualizer Interactive HUD Graphic for current phase */}
            <div className="phase-visualizer bg-gradient-to-br from-forest-900/95 to-forest-950/95 p-5 rounded-xl border border-sage-300/15 relative overflow-hidden shadow-inner">
              {/* Animated HUD Elements depending on active phase */}
              <div className="flex items-center justify-between mb-3 border-b border-sage-300/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-accent-gold font-semibold">
                    PHASE {currentStep.number} TELEMETRY & SCOPE
                  </span>
                </div>
                <span className="font-mono text-[10px] text-sage-400 uppercase">
                  ACTIVE ENGINE // 60 FPS
                </span>
              </div>

              {/* Dynamic Phase-Specific Animated Graphics */}
              {activeStepIdx === 0 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-accent-gold animate-spin" style={{ animationDuration: '10s' }} />
                    <span>Competitive Whitespace Radar</span>
                  </div>
                  <span className="text-accent-gold">100% UNBIASED</span>
                </div>
              )}
              {activeStepIdx === 1 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent-gold" />
                    <span>System Architecture Blueprint</span>
                  </div>
                  <span className="text-accent-gold">4 REFINED VECTORS</span>
                </div>
              )}
              {activeStepIdx === 2 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-accent-gold" />
                    <span>Haute Design & Motion Choreography</span>
                  </div>
                  <span className="text-accent-gold">AWWWARDS LEVEL</span>
                </div>
              )}
              {activeStepIdx === 3 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-accent-gold" />
                    <span>React + GSAP Scroll Engine</span>
                  </div>
                  <span className="text-accent-gold">SUB-SECOND SPEED</span>
                </div>
              )}
              {activeStepIdx === 4 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-accent-gold" />
                    <span>Cross-Platform Deployment Matrix</span>
                  </div>
                  <span className="text-accent-gold">ZERO DOWNTIME</span>
                </div>
              )}
              {activeStepIdx === 5 && (
                <div className="flex items-center justify-between py-2 px-3 bg-forest-800/40 rounded-lg border border-accent-gold/20 text-xs font-mono text-sage-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-gold" />
                    <span>Iterative CRO & Category Domination</span>
                  </div>
                  <span className="text-accent-gold">EXPONENTIAL ROI</span>
                </div>
              )}
            </div>

            {/* Milestones Checklist Container */}
            <div className="bg-forest-900/90 p-6 sm:p-7 rounded-xl border border-sage-300/15 relative">
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs text-accent-gold uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  KEY DELIVERABLES & ACTIVITIES:
                </span>
                <span className="font-mono text-[10px] text-sage-400">
                  {currentStep.keyActivities.length} MILESTONES
                </span>
              </div>

              <div className="space-y-3">
                {currentStep.keyActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="milestone-item flex items-center justify-between p-3 rounded-lg bg-forest-850/60 border border-sage-300/10 hover:border-accent-emerald/40 hover:bg-forest-800/80 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 text-sm sm:text-base text-ivory-200">
                      <div className="w-6 h-6 rounded-full bg-forest-750 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-emerald/20 transition-colors">
                        <CheckCircle2 className="check-icon w-4 h-4 text-accent-emerald flex-shrink-0" />
                      </div>
                      <span className="leading-snug group-hover:text-white transition-colors">
                        {activity}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-accent-gold/60 uppercase tracking-widest pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

