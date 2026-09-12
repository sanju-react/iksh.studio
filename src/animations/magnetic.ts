import gsap from 'gsap';

export function applyMagneticEffect(
  element: HTMLElement,
  strength: number = 0.35,
  textElement?: HTMLElement | null
) {
  let boundRect: DOMRect | null = null;

  const handleMouseEnter = () => {
    boundRect = element.getBoundingClientRect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!boundRect) boundRect = element.getBoundingClientRect();

    const { clientX, clientY } = e;
    const { left, top, width, height } = boundRect;

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    gsap.to(element, {
      x: deltaX * strength,
      y: deltaY * strength,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (textElement) {
      gsap.to(textElement, {
        x: deltaX * (strength * 0.6),
        y: deltaY * (strength * 0.6),
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });

    if (textElement) {
      gsap.to(textElement, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    }

    boundRect = null;
  };

  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}
