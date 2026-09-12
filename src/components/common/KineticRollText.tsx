import React from 'react';

interface KineticRollTextProps {
  text: string;
  className?: string;
  cloneClassName?: string;
  chromatic?: boolean;
  staggerDelay?: number;
  isActive?: boolean;
}

export const KineticRollText: React.FC<KineticRollTextProps> = ({
  text,
  className = '',
  cloneClassName = '',
  chromatic = true,
  staggerDelay = 20,
  isActive = false,
}) => {
  const letters = text.split('');

  return (
    <span
      className={`kinetic-roll-container relative inline-flex items-center overflow-hidden leading-none select-none group/roll cursor-pointer ${
        chromatic ? 'hover-chromatic-split' : ''
      } ${className}`}
      aria-label={text}
    >
      <span className="inline-flex" aria-hidden="true">
        {letters.map((char, index) => (
          <span
            key={index}
            className="relative inline-block overflow-hidden pointer-events-none"
          >
            {/* Top Primary Letter */}
            <span
              className={`inline-block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/roll:-translate-y-full group-hover:-translate-y-full ${
                isActive ? 'text-accent-gold font-bold' : ''
              }`}
              style={{
                transitionDelay: `${index * staggerDelay}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>

            {/* Bottom Clone Letter that rolls up */}
            <span
              className={`absolute inset-0 inline-block transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover/roll:translate-y-0 group-hover:translate-y-0 ${
                cloneClassName || 'text-accent-gold'
              }`}
              style={{
                transitionDelay: `${index * staggerDelay}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
};
