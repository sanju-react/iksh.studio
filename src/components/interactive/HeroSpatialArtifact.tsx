import React, { useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import { useCursor } from '../../hooks/useCursor';

export const HeroSpatialArtifact: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const { setCursor, resetCursor } = useCursor();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50, opacity: 0 });
    resetCursor();
  };

  return (
    <div
      className="relative hidden lg:block select-none"
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursor('explore', 'PURE CRAFT')}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="relative w-80 p-6 rounded-2xl bg-forest-850/80 backdrop-blur-xl border border-sage-300/20 shadow-[0_20px_50px_rgba(4,16,12,0.6)] cursor-pointer group overflow-hidden"
      >
        {/* Dynamic Interactive Light Glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(47, 230, 158, 0.25) 0%, transparent 65%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-sage-300/15 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
            </span>
            <span className="font-mono text-[10px] text-accent-emerald uppercase tracking-widest font-semibold">
              STUDIO TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-sage-400">
            <Radio className="w-3 h-3 text-sage-400" />
            <span>21.17° N</span>
          </div>
        </div>

        {/* Center Hologram Mark */}
        <div className="py-3 flex flex-col items-center justify-center text-center">
          <div className="relative w-20 h-20 flex items-center justify-center mb-3">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 rounded-full bg-accent-emerald/20 blur-xl group-hover:bg-accent-emerald/35 transition-all duration-500" />

            {/* Stylized Feather Brand Crest SVG */}
            <svg
              viewBox="0 0 64 64"
              className="w-14 h-14 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
            >
              <defs>
                <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5F3EA" />
                  <stop offset="50%" stopColor="#D8C39E" />
                  <stop offset="100%" stopColor="#2FE69E" />
                </linearGradient>
              </defs>
              <path
                d="M 16 20 C 22 13, 34 11, 46 19 C 38 21, 33 26, 30 32 C 27 26, 22 22, 16 20 Z"
                fill="url(#crestGold)"
              />
              <path
                d="M 8 28 C 20 20, 36 21, 52 32 C 42 33, 36 38, 32 46 C 30 39, 24 33, 8 28 Z"
                fill="url(#crestGold)"
                opacity="0.9"
              />
              <circle cx="32" cy="54" r="3" fill="#2FE69E" />
            </svg>
          </div>

          <span className="font-serif italic text-lg text-ivory-200 block">
            Iksh Haute Craft
          </span>
          <span className="font-mono text-[10px] text-sage-300 uppercase tracking-widest mt-0.5">
            Surat • Worldwide
          </span>
        </div>

        {/* Bottom Equalizer Frequency Wave & Live Indicator */}
        <div className="mt-5 pt-4 border-t border-sage-300/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-sage-300">
            <span>60FPS KINETIC ENGINE</span>
          </div>

          {/* 6 Animated Equalizer Soundwave Bars */}
          <div className="flex items-end gap-1 h-4">
            <div className="w-1 bg-accent-emerald rounded-full animate-eq-1" />
            <div className="w-1 bg-accent-gold rounded-full animate-eq-2" />
            <div className="w-1 bg-ivory-200 rounded-full animate-eq-3" />
            <div className="w-1 bg-accent-emerald rounded-full animate-eq-4" />
            <div className="w-1 bg-accent-gold rounded-full animate-eq-2" />
            <div className="w-1 bg-accent-emerald rounded-full animate-eq-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
