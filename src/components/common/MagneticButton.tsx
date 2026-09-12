import React, { useRef, useEffect } from 'react';
import { applyMagneticEffect } from '../../animations/magnetic';
import { useCursor } from '../../hooks/useCursor';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  cursorType?: 'pointer' | 'cta' | 'project';
  cursorText?: string;
  strength?: number;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  variant = 'primary',
  cursorType = 'cta',
  cursorText = "LET'S TALK",
  strength = 0.35,
  type = 'button',
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const { setCursor, resetCursor } = useCursor();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || prefersReducedMotion) return;

    const cleanup = applyMagneticEffect(el as HTMLElement, strength, textRef.current);
    return cleanup;
  }, [strength, prefersReducedMotion]);

  const handleMouseEnter = () => {
    setCursor(cursorType, cursorText);
  };

  const handleMouseLeave = () => {
    resetCursor();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-ivory-200 text-forest-950 hover:bg-white border border-ivory-200 shadow-[0_0_25px_rgba(245,243,234,0.15)]';
      case 'secondary':
        return 'bg-forest-800 text-ivory-200 hover:bg-forest-700 border border-sage-300/20';
      case 'outline':
        return 'bg-transparent text-ivory-200 hover:bg-ivory-200 hover:text-forest-950 border border-sage-300/30 hover:border-ivory-200';
      case 'text':
        return 'bg-transparent text-ivory-200 hover:text-white p-0';
      default:
        return 'bg-ivory-200 text-forest-950';
    }
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-mono text-xs tracking-wider uppercase font-semibold px-7 py-3.5 rounded-full transition-all duration-300 select-none group cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed';

  const combinedClassName = `${baseStyles} ${getVariantStyles()} ${className}`;

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={combinedClassName}
      >
        <span ref={textRef} className="relative z-10 inline-flex items-center gap-2 pointer-events-none">
          {children}
        </span>
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={combinedClassName}
    >
      <span ref={textRef} className="relative z-10 inline-flex items-center gap-2 pointer-events-none">
        {children}
      </span>
    </button>
  );
};
