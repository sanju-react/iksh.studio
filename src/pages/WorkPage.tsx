import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { projectsData } from '../data/projects';
import { ProjectItem } from '../types';
import { useCursor } from '../hooks/useCursor';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ArrowRight, Filter } from 'lucide-react';
import { FinalCTA } from '../sections/FinalCTA';
import { SoftAurora } from '../components/common/SoftAurora';

interface WorkPageProps {
  onSelectProject: (project: ProjectItem) => void;
  onContact: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ onSelectProject, onContact }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const { setCursor, resetCursor } = useCursor();
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const filterOptions = ['All', 'Packaging', 'Branding', 'Editorial', '3D CGI', 'Signage'];

  const lines = [
    { text: 'SELECTED', className: 'text-ivory-200 font-serif-title tracking-tight' },
    { text: 'WORKS &', className: 'text-accent-gold font-editorial italic font-normal' },
    { text: 'ARTIFACTS.', className: 'text-white font-sans font-black tracking-tighter' },
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

  const filteredProjects = activeFilter === 'All'
    ? projectsData
    : projectsData.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase())) ||
        p.category.toLowerCase().includes(activeFilter.toLowerCase())
      );

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
                An ongoing archive of brand systems, interactive digital boutiques, and bespoke visual identities engineered for category leaders.
              </p>
            </div>
            <div className="lg:col-span-4 flex items-center lg:justify-end text-xs font-mono text-sage-400">
              <span>{projectsData.length} CURATED CASE STUDIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <div className="px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto pb-20 pt-10">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12">
          <span className="font-mono text-xs text-sage-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> FILTER BY:
          </span>
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 border ${
                activeFilter === filter
                  ? 'bg-ivory-200 text-forest-950 border-ivory-200 font-semibold'
                  : 'bg-forest-900/60 text-sage-300 border-sage-300/20 hover:border-sage-300/40 hover:text-ivory-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-28">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              onMouseEnter={() => setCursor('project', 'VIEW CASE')}
              onMouseLeave={() => resetCursor()}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-forest-900 border border-sage-300/15 p-4 sm:p-6 transition-all duration-500 hover:border-sage-300/40 hover:bg-forest-850/80"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-6 bg-forest-950">
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
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
              </div>

              {/* Content Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif-title text-3xl sm:text-4xl text-white group-hover:text-accent-gold transition-colors">
                      {project.title}
                    </h2>
                    <p className="font-serif italic text-sage-300 text-sm sm:text-base">
                      {project.subtitle}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-sage-300/20 flex items-center justify-center text-ivory-200 group-hover:bg-ivory-200 group-hover:text-forest-950 transition-all flex-shrink-0">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-forest-800 text-sage-300 border border-sage-300/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <FinalCTA onStartProject={onContact} />
      </div>
    </main>
  );
};
