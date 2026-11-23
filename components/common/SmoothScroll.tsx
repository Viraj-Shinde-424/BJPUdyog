import React, { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Universal Smooth Scrolling Provider powered by Lenis ("linus").
 * Provides luxury momentum scrolling across the entire BJP Udyog Setu platform
 * while respecting user accessibility preferences (prefers-reduced-motion).
 */
export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth natural cubic deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return null;
};
export default SmoothScroll;
