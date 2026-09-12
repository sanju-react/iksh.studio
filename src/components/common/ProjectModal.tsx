import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ProjectItem } from '../../types';
import { X, ArrowUpRight, Maximize2, ChevronLeft, ChevronRight, Sparkles, Layers, Grid, Image as ImageIcon } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onInquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onInquire,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'grid'>('gallery');

  // Reset selected photo when project changes
  useEffect(() => {
    setSelectedPhotoIdx(0);
    setIsLightboxOpen(false);
    setActiveTab('gallery');
  }, [project]);

  useEffect(() => {
    if (!project) return;

    // Prevent background body scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );

      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
      );
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && project) {
        setSelectedPhotoIdx((prev) => (prev + 1) % project.galleryImages.length);
      } else if (e.key === 'ArrowLeft' && project) {
        setSelectedPhotoIdx((prev) => (prev - 1 + project.galleryImages.length) % project.galleryImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      ctx.revert();
    };
  }, [project, onClose, isLightboxOpen]);

  if (!project) return null;

  const currentPhoto = project.galleryImages[selectedPhotoIdx] || project.heroImage;
  const totalPhotos = project.galleryImages.length;

  return (
    <>
      <div
        ref={modalRef}
        data-lenis-prevent="true"
        className="fixed inset-0 z-[9995] bg-forest-950/95 backdrop-blur-2xl overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 overscroll-contain"
        onClick={onClose}
      >
        <div className="min-h-full w-full flex items-start justify-center py-2 sm:py-6">
          {/* Modal Container */}
          <div
            ref={contentRef}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-forest-900 border border-sage-300/25 rounded-2xl sm:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden text-ivory-200 mb-8"
          >
            {/* Sticky Header Bar */}
            <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-forest-900/98 backdrop-blur-md border-b border-sage-300/20">
              <div className="flex items-center gap-3">
                <span className="font-serif-title text-xl sm:text-2xl text-white font-medium">
                  {project.title}
                </span>
                <span className="text-sage-400 font-mono text-xs hidden sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/20 border border-accent-emerald/40 font-mono text-xs text-accent-emerald font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>All {totalPhotos} Photos Available</span>
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-forest-950/80 p-1 rounded-xl border border-sage-300/20">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                      activeTab === 'gallery'
                        ? 'bg-accent-gold text-forest-950 font-semibold shadow-sm'
                        : 'text-sage-300 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Featured View</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                      activeTab === 'grid'
                        ? 'bg-accent-gold text-forest-950 font-semibold shadow-sm'
                        : 'text-sage-300 hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>All Photos Grid ({totalPhotos})</span>
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest-800 border border-sage-300/25 flex items-center justify-center text-ivory-200 hover:bg-forest-700 hover:text-white hover:scale-105 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* TAB 1: FEATURED GALLERY & THUMBNAIL SWITCHER */}
            {activeTab === 'gallery' && (
              <div className="p-4 sm:p-6 md:p-8 bg-forest-950/80 border-b border-sage-300/15 space-y-5">
                {/* Primary Large Featured Photo Frame */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-forest-950 border border-sage-300/25 group shadow-2xl">
                  <img
                    key={currentPhoto}
                    src={currentPhoto}
                    alt={`${project.title} photo ${selectedPhotoIdx + 1}`}
                    decoding="async"
                    className="w-full h-full object-cover transition-all duration-300 ease-out cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                  />

                  {/* Prev Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos);
                    }}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-forest-950/85 backdrop-blur-md border border-sage-300/40 flex items-center justify-center text-white hover:bg-forest-900 hover:scale-110 transition-all z-20 shadow-2xl"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next Navigation Arrow */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIdx((prev) => (prev + 1) % totalPhotos);
                    }}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-forest-950/85 backdrop-blur-md border border-sage-300/40 flex items-center justify-center text-white hover:bg-forest-900 hover:scale-110 transition-all z-20 shadow-2xl"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Top Corner Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-forest-950/90 backdrop-blur-md border border-accent-gold/40 font-mono text-xs text-accent-gold font-bold shadow-lg">
                      PHOTO {selectedPhotoIdx + 1} OF {totalPhotos}
                    </span>
                    <span className="hidden sm:inline px-3 py-1.5 rounded-full bg-forest-950/85 backdrop-blur-md border border-sage-300/20 font-mono text-xs text-sage-300">
                      {project.category}
                    </span>
                  </div>

                  {/* Full-Screen Zoom Button */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-950/90 backdrop-blur-md border border-sage-300/40 font-mono text-xs text-white hover:bg-forest-850 hover:border-accent-gold/60 transition-all shadow-lg"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-accent-gold" />
                    <span>Click to Expand / Fullscreen</span>
                  </button>
                </div>

                {/* Instant Multi-Thumbnail Selector Strip */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-accent-gold font-semibold tracking-wider">
                      <Sparkles className="w-4 h-4 text-accent-gold animate-pulse" />
                      <span>CLICK ANY THUMBNAIL TO SWITCH PHOTO ({totalPhotos} TOTAL):</span>
                    </span>
                    <span className="text-sage-300 hidden sm:inline">Use keyboard ← → arrows to navigate</span>
                  </div>

                  {/* Thumbnails row */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                    {project.galleryImages.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`relative flex-shrink-0 w-24 sm:w-32 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedPhotoIdx === idx
                            ? 'border-accent-gold scale-105 shadow-[0_0_20px_rgba(212,175,55,0.45)] ring-2 ring-accent-gold/50'
                            : 'border-sage-300/25 opacity-65 hover:opacity-100 hover:border-sage-300/60'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                          selectedPhotoIdx === idx
                            ? 'bg-accent-gold text-forest-950'
                            : 'bg-forest-950/90 text-white'
                        }`}>
                          0{idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DIRECT GRID & DETAILS: COMPLETE ALL PHOTOS ASSET GRID */}
            <div className="p-5 sm:p-8 md:p-10 space-y-10">
              {/* Title & Metadata Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-sage-300/15 pb-6">
                <div>
                  <span className="font-mono text-xs text-accent-gold uppercase tracking-widest block mb-1 font-semibold">
                    {project.category}
                  </span>
                  <h2 className="font-serif-title text-3xl sm:text-5xl text-white">
                    {project.title}
                  </h2>
                  <p className="font-serif italic text-sage-300 text-base sm:text-lg mt-1">
                    {project.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-forest-800 border border-sage-300/20 font-mono text-xs text-accent-emerald">
                    Year: {project.year}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-forest-800 border border-sage-300/20 font-mono text-xs text-sage-300">
                    {project.duration}
                  </span>
                </div>
              </div>

              {/* Complete All Photos Exploration Grid — Displays ALL photos simultaneously */}
              <div className="space-y-4 bg-forest-950/60 p-5 sm:p-7 rounded-2xl border border-sage-300/20">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-mono text-xs text-accent-gold uppercase tracking-widest font-bold flex items-center gap-2">
                      <Grid className="w-4 h-4" />
                      <span>COMPLETE VISUAL ASSET ARCHIVE ({totalPhotos} PHOTOS)</span>
                    </h3>
                    <p className="font-sans text-xs text-sage-300 mt-1">
                      Every visual asset designed for this campaign. Click any card to view in full resolution.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent-emerald/15 border border-accent-emerald/30 font-mono text-xs text-accent-emerald font-semibold">
                    {totalPhotos} High-Res Visuals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {project.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPhotoIdx(idx);
                        setIsLightboxOpen(true);
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 aspect-[4/3] bg-forest-950 group cursor-pointer shadow-md transition-all duration-300 ${
                        selectedPhotoIdx === idx
                          ? 'border-accent-gold ring-2 ring-accent-gold/40'
                          : 'border-sage-300/20 hover:border-accent-gold/60 hover:shadow-xl'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} photo ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-forest-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-sage-300/40 flex items-center gap-2 text-accent-gold text-xs font-mono font-medium shadow-xl">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View High-Res (0{idx + 1})</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-forest-950/90 backdrop-blur-sm border border-sage-300/20 font-mono text-[11px] text-ivory-200">
                        Asset 0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overview, Challenge, Solution & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-mono text-xs text-accent-gold uppercase tracking-widest mb-2 font-medium">
                      THE BRIEF & OVERVIEW
                    </h3>
                    <p className="text-sage-200 text-base sm:text-lg leading-relaxed font-sans">
                      {project.overview}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div className="p-4 rounded-xl bg-forest-950/40 border border-sage-300/10">
                      <h4 className="font-mono text-xs text-sage-400 uppercase tracking-widest mb-1.5">
                        THE CHALLENGE
                      </h4>
                      <p className="text-sage-300 text-xs sm:text-sm leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-forest-950/40 border border-sage-300/10">
                      <h4 className="font-mono text-xs text-sage-400 uppercase tracking-widest mb-1.5">
                        THE SOLUTION
                      </h4>
                      <p className="text-sage-300 text-xs sm:text-sm leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verified Impact & Color Palette */}
                <div className="space-y-6 bg-forest-850/60 p-5 sm:p-6 rounded-2xl border border-sage-300/15 h-fit">
                  <div>
                    <span className="font-mono text-[11px] text-sage-400 uppercase tracking-wider block mb-1">
                      CLIENT
                    </span>
                    <span className="font-sans font-semibold text-white text-base">
                      {project.client}
                    </span>
                  </div>

                  <div className="border-t border-sage-300/10 pt-4">
                    <h4 className="font-mono text-xs text-accent-gold uppercase tracking-widest mb-3 font-medium">
                      VERIFIED IMPACT
                    </h4>
                    <div className="space-y-3">
                      {project.impact.map((item, idx) => (
                        <div key={idx} className="border-b border-sage-300/10 pb-2.5 last:border-b-0">
                          <span className="font-serif text-2xl font-bold text-accent-emerald block">
                            {item.stat}
                          </span>
                          <span className="font-mono text-xs text-sage-300">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="pt-4 border-t border-sage-300/10">
                    <span className="font-mono text-[11px] text-sage-400 uppercase tracking-wider block mb-2">
                      BRAND COLOR SYSTEM
                    </span>
                    <div className="flex gap-2">
                      {project.palette.map((color, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs px-3 py-1 rounded-full bg-forest-800 text-sage-300 border border-sage-300/15"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Modal Bottom CTA */}
              <div className="bg-forest-800/40 p-6 md:p-8 rounded-2xl border border-sage-300/15 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-serif text-2xl text-white">Inspired by this project?</h4>
                  <p className="font-sans text-xs sm:text-sm text-sage-300">
                    Let's discuss how we can engineer a similar visual system for your brand.
                  </p>
                </div>
                <MagneticButton
                  onClick={() => {
                    onClose();
                    onInquire(project.title);
                  }}
                  variant="primary"
                >
                  <span>Inquire For Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen High-Res Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-forest-950/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Header */}
          <div className="flex items-center justify-between w-full max-w-6xl mx-auto z-10">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg text-white font-medium">
                {project.title}
              </span>
              <span className="font-mono text-xs text-accent-gold font-semibold px-2.5 py-0.5 rounded-full bg-forest-900 border border-accent-gold/30">
                PHOTO {selectedPhotoIdx + 1} OF {totalPhotos}
              </span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-forest-800 border border-sage-300/30 flex items-center justify-center text-ivory-200 hover:bg-forest-700 hover:scale-105 transition-all"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image with Navigation */}
          <div
            className="relative flex items-center justify-center max-w-6xl max-h-[80vh] mx-auto w-full my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={() =>
                setSelectedPhotoIdx((prev) => (prev - 1 + totalPhotos) % totalPhotos)
              }
              className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-forest-900/90 border border-sage-300/40 flex items-center justify-center text-white hover:bg-forest-800 hover:scale-110 transition-all z-20 shadow-2xl"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Displayed Image */}
            <img
              key={currentPhoto}
              src={currentPhoto}
              alt={`${project.title} photo ${selectedPhotoIdx + 1}`}
              className="max-w-full max-h-[76vh] object-contain rounded-2xl shadow-2xl border border-sage-300/25 animate-fadeIn"
            />

            {/* Next Button */}
            <button
              onClick={() =>
                setSelectedPhotoIdx((prev) => (prev + 1) % totalPhotos)
              }
              className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-forest-900/90 border border-sage-300/40 flex items-center justify-center text-white hover:bg-forest-800 hover:scale-110 transition-all z-20 shadow-2xl"
              aria-label="Next image"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Lightbox Footer Thumbnail Strip */}
          <div
            className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 z-10 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {project.galleryImages.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIdx(idx)}
                className={`w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedPhotoIdx === idx
                    ? 'border-accent-gold scale-105 ring-2 ring-accent-gold/40'
                    : 'border-sage-300/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
