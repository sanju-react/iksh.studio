import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStudio?: boolean;
  monochrome?: boolean;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  animated = false,
}) => {
  const sizeMap = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  return (
    <div
      className={`inline-flex items-center select-none group cursor-pointer ${className}`}
      aria-label="IKSH STUDIO Logo"
    >
      <img
        src="/header-logo.png"
        alt="IKSH STUDIO"
        className={`${sizeMap[size]} w-auto object-contain transition-all duration-300 ${
          animated ? 'group-hover:scale-105 group-hover:brightness-110' : ''
        }`}
      />
    </div>
  );
};
