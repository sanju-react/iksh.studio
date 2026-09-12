import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2 } from 'lucide-react';

export const HeroShowreel: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative z-10 py-6 md:py-10 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto select-none">
      <div
        onClick={togglePlay}
        className="relative group rounded-2xl md:rounded-3xl overflow-hidden bg-forest-950 border border-sage-300/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-pointer"
      >
        {/* Aspect Ratio Container for Responsive Video */}
        <div className="relative w-full h-[56vh] sm:h-[68vh] md:h-[78vh] lg:h-[82vh] max-h-[840px] flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src="/Finally.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />

          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/20 pointer-events-none" />

          {/* Top HUD Tag */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-forest-950/70 backdrop-blur-md border border-sage-300/20 text-accent-gold font-mono text-[11px] uppercase tracking-widest pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span>IKSH STUDIO SHOWREEL</span>
          </div>

          {/* Play/Pause Overlay Indicator (Only when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-forest-950/40 backdrop-blur-xs">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent-gold/90 text-forest-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
              </div>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-forest-900/80 hover:bg-forest-800 backdrop-blur-md border border-sage-300/20 text-ivory-200 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-accent-gold" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-accent-gold fill-current" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-forest-900/80 hover:bg-forest-800 backdrop-blur-md border border-sage-300/20 text-ivory-200 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-sage-400" />
                    <span className="hidden sm:inline">Unmute Sound</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-accent-gold animate-pulse" />
                    <span className="hidden sm:inline">Sound Active</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-mono text-[11px] text-sage-300/80 bg-forest-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-sage-300/10">
                4K DIGITAL SHOWCASE
              </span>

              <button
                type="button"
                onClick={handleFullscreen}
                className="p-2 rounded-full bg-forest-900/80 hover:bg-forest-800 backdrop-blur-md border border-sage-300/20 text-ivory-200 transition-colors cursor-pointer"
                title="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5 text-accent-gold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
