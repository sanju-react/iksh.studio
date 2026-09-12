import React from 'react';
import { MagneticButton } from '../components/common/MagneticButton';
import { LuminousConstellation } from '../components/common/LuminousConstellation';
import { studioInfo } from '../data/studio';
import { launchEmailClient } from '../utils/contact';
import { ArrowUpRight, Mail } from 'lucide-react';

interface FinalCTAProps {
  onStartProject: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onStartProject }) => {
  return (
    <section className="pt-16 md:pt-24 pb-24 md:pb-36 px-4 sm:px-8 md:px-12 max-w-[1720px] mx-auto z-10 relative select-none text-center">
      {/* Interactive Luminous Constellation Canvas */}
      <LuminousConstellation
        particleCount={75}
        connectionDistance={140}
        mouseRadius={180}
      />

      {/* Radiant Glowing Nebula Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] rounded-full bg-accent-emerald/10 blur-[150px]" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] rounded-full bg-accent-gold/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 -translate-y-2 md:-translate-y-5">
        <h2 className="font-serif-title text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-medium text-ivory-200 uppercase leading-[0.92] tracking-tight">
          HAVE AN IDEA? <br />
          <span className="font-editorial italic font-normal text-accent-gold">
            LET'S MAKE
          </span> <br />
          IT REAL.
        </h2>

        <p className="font-sans text-base sm:text-xl md:text-2xl text-sage-200 font-light max-w-xl mx-auto leading-relaxed">
          We collaborate with founders and category leaders ready to redefine what is possible in their industry.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton
            onClick={onStartProject}
            variant="primary"
            cursorType="cta"
            cursorText="LET'S TALK"
            className="!py-5 !px-10 text-sm shadow-[0_0_35px_rgba(47,230,158,0.25)]"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </MagneticButton>

          <a
            href={`mailto:${studioInfo.email}`}
            onClick={(e) =>
              launchEmailClient(e, {
                to: studioInfo.email,
                subject: 'Project Inquiry — IKSH Studio',
              })
            }
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-sage-300/30 hover:border-accent-gold bg-forest-950/70 backdrop-blur-md text-ivory-200 hover:text-accent-gold hover:bg-forest-900/90 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
          >
            <Mail className="w-4 h-4 text-accent-gold" />
            <span>{studioInfo.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
