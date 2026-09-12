import React, { useEffect, useRef } from 'react';

interface LuminousConstellationProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const LuminousConstellation: React.FC<LuminousConstellationProps> = ({
  particleCount = 85,
  connectionDistance = 140,
  mouseRadius = 180,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const colors = [
      '#D8C39E', // Warm Gold
      '#2FE69E', // Vibrant Emerald
      '#F5F3EA', // Soft Ivory
      '#E8DCC4', // Champagne
    ];

    const particles: Particle[] = [];

    const createParticles = () => {
      particles.length = 0;
      const count = Math.min(particleCount, Math.floor((width * height) / 12000));
      for (let i = 0; i < count; i++) {
        const baseRadius = Math.random() * 2 + 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          baseRadius,
          radius: baseRadius,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.6 + 0.3,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      createParticles();
    };

    createParticles();
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic drift
        p.x += p.vx + Math.sin(time + p.pulseOffset) * 0.15;
        p.y += p.vy + Math.cos(time + p.pulseOffset) * 0.15;

        // Bounce boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Pulsating size
        p.radius = p.baseRadius + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.6;

        // Interactive mouse gravity & repel
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * 2.5;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;

            // Draw interactive connector to mouse cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(47, 230, 158, ${(1 - dist / mouseRadius) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3.5
        );
        glowGradient.addColorStop(0, p.color);
        glowGradient.addColorStop(0.4, p.color);
        glowGradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.fill();

        // Core particle point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            // Subtle gradient line between colors
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, p.color);
            grad.addColorStop(1, p2.color);

            ctx.strokeStyle = grad;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.85;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, connectionDistance, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
