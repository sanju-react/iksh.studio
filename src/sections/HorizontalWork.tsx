import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectsData } from '../data/projects';
import { ProjectItem } from '../types';
import { useCursor } from '../hooks/useCursor';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalWorkProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAllWork: () => void;
}

export const HorizontalWork: React.FC<HorizontalWorkProps> = ({
  onSelectProject,
  onViewAllWork,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !trackRef.current || !triggerRef.current) return;

    // Only apply GSAP pinning on desktop (> 1024px)
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      if (!track) return;

      const scrollDistance = track.scrollWidth - window.innerWidth + 120;

      const pinTween = gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        pinTween.kill();
      };
    });

    return () => mm.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={triggerRef} className="relative z-10 select-none overflow-hidden bg-forest-950 py-20 lg:py-0">
      <div
        ref={sectionRef}
        className="min-h-screen flex flex-col justify-center max-w-full"
      >
        {/* Top Header */}
        <div className="max-w-[1720px] mx-auto w-full px-4 sm:px-8 md:px-12 pt-8 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent-gold font-mono text-xs uppercase tracking-widest mb-2 font-medium">
              [ 03 // CURATED PORTFOLIO ]
            </div>
            <h2 className="font-serif-title text-5xl sm:text-6xl md:text-7xl text-ivory-200">
              SELECTED WORK.
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden lg:inline font-mono text-xs text-sage-400">
              SCROLL DOWN TO NAVIGATE HORIZONTALLY →
            </span>
            <button
              onClick={onViewAllWork}
              className="inline-flex items-center gap-2 font-mono text-xs text-ivory-200 uppercase tracking-wider hover:text-accent-emerald transition-colors pb-1 border-b border-sage-300/30"
            >
              <span>View All {projectsData.length.toString().padStart(2, '0')} Cases</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Track (pinned on desktop, scrollable on mobile) */}
        <div
          ref={trackRef}
          className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 px-6 md:px-12 lg:pl-16 lg:pr-28 overflow-x-auto lg:overflow-visible no-scrollbar"
        >
          {projectsData.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              onMouseEnter={() => setCursor('project', 'VIEW CASE')}
              onMouseLeave={() => resetCursor()}
              className="flex-shrink-0 w-full sm:w-[480px] lg:w-[620px] group cursor-pointer"
            >
              {/* Image Container with Zoom and Badge */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 shadow-xl mb-5">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Corner Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-sage-300/20 font-mono text-[11px] text-ivory-200">
                    0{idx + 1}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-sage-300/20 font-mono text-[11px] text-accent-emerald">
                    {project.year}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-forest-950/85 backdrop-blur-md border border-accent-gold/40 font-mono text-[11px] text-accent-gold font-medium">
                    {project.galleryImages.length} Photos
                  </span>
                </div>

                {/* Bottom Impact Floating Tag */}
                {project.impact[0] && (
                  <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-950/90 backdrop-blur-md border border-sage-300/20 font-mono text-xs text-ivory-200">
                    <span className="text-accent-emerald font-semibold">{project.impact[0].stat}</span>
                    <span className="text-sage-300">{project.impact[0].label}</span>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-accent-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs text-sage-300 mt-1 uppercase tracking-wider">
                    {project.category}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 group-hover:bg-ivory-200 group-hover:text-forest-950 transition-all flex-shrink-0">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}

          {/* End Callout Card */}
          <div className="flex-shrink-0 w-full sm:w-[360px] lg:w-[420px] rounded-2xl bg-forest-850/60 border border-sage-300/20 p-8 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block mb-4 font-medium">
                LOOKING FOR MORE?
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white mb-4">
                We craft bespoke systems for ambitious brands worldwide.
              </h3>
              <p className="font-sans text-sm text-sage-300">
                Explore our full archive or request a tailored capabilities presentation for your industry.
              </p>
            </div>

            <div className="pt-8">
              <button
                onClick={onViewAllWork}
                className="w-full py-4 rounded-full bg-ivory-200 text-forest-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Full Archive</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
