import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useCursor } from '../../hooks/useCursor';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { cursorType, cursorText } = useCursor();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Check if touch device or reduced motion
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center cursor coordinates initially offscreen
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });

    const ticker = () => {
      xTo(mouse.x);
      yTo(mouse.y);
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      gsap.ticker.remove(ticker);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // React to different cursor modes
    switch (cursorType) {
      case 'project':
        gsap.to(cursor, {
          width: 100,
          height: 100,
          backgroundColor: '#F5F3EA',
          color: '#08251D',
          border: 'none',
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
        break;

      case 'cta':
        gsap.to(cursor, {
          width: 90,
          height: 90,
          backgroundColor: '#2FE69E',
          color: '#04100C',
          border: 'none',
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
        break;

      case 'pointer':
        gsap.to(cursor, {
          width: 48,
          height: 48,
          backgroundColor: 'rgba(245, 243, 234, 0.15)',
          border: '1px solid rgba(245, 243, 234, 0.4)',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;

      case 'drag':
      case 'explore':
        gsap.to(cursor, {
          width: 80,
          height: 80,
          backgroundColor: 'rgba(245, 243, 234, 0.9)',
          color: '#08251D',
          border: 'none',
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
        break;

      case 'close':
        gsap.to(cursor, {
          width: 60,
          height: 60,
          backgroundColor: '#F5F3EA',
          color: '#08251D',
          border: 'none',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;

      case 'default':
      default:
        gsap.to(cursor, {
          width: 12,
          height: 12,
          backgroundColor: '#F5F3EA',
          color: 'transparent',
          border: 'none',
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        break;
    }
  }, [cursorType]);

  // Don't render cursor UI on mobile/touch
  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center text-center font-mono text-[10px] tracking-wider font-semibold leading-tight select-none shadow-2xl backdrop-blur-[2px] hidden md:flex"
      style={{
        transform: 'translate(-50%, -50%)',
        mixBlendMode: cursorType === 'default' ? 'difference' : 'normal',
      }}
    >
      <span ref={textRef} className="px-2 uppercase">
        {cursorText}
      </span>
    </div>
  );
};
