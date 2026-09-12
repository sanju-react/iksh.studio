import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Logo } from './Logo';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Animate progress counter from 0 to 100
      const counterObj = { val: 0 };
      tl.to(counterObj, {
        val: 100,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          setCount(Math.round(counterObj.val));
        },
      });

      // Progress bar line scaling
      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        0
      );

      // Exit transition: clip-path curtain upwards reveal
      tl.to(
        textRef.current,
        {
          y: -30,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
        },
        '-=0.15'
      );

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.6,
        ease: 'power4.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-forest-950 flex flex-col justify-between p-8 md:p-14 select-none"
      style={{ willChange: 'transform' }}
    >
      {/* Top micro metadata */}
      <div className="flex items-center justify-between font-mono text-[11px] text-sage-300 tracking-widest uppercase">
        <span>IKSH STUDIO</span>
        <span>SURAT • INDIA</span>
        <span>EST. 2026</span>
      </div>

      {/* Center hero logo & brand statement */}
      <div ref={textRef} className="my-auto flex flex-col items-center text-center">
        <div className="mb-6 scale-110 md:scale-125">
          <Logo size="lg" animated={true} />
        </div>
        <p className="font-serif italic text-sage-300 text-base md:text-xl max-w-md tracking-wide">
          "We make brands impossible to ignore."
        </p>
      </div>

      {/* Bottom loading progress line & counter */}
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-sage-300 tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse"></span>
            INITIALIZING STUDIO ARCHITECTURE
          </span>
          <span ref={counterRef} className="text-ivory-200 font-semibold tabular-nums text-sm">
            {count.toString().padStart(2, '0')}%
          </span>
        </div>

        {/* Thin progress line */}
        <div className="w-full h-[1px] bg-forest-800 overflow-hidden relative">
          <div
            ref={lineRef}
            className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-accent-emerald via-ivory-200 to-accent-gold origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>
    </div>
  );
};
