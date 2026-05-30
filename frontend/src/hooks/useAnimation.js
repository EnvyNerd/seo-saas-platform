import { useEffect, useRef } from 'react';

/**
 * Hook to add staggered animations to multiple elements
 * Automatically applies animation delay based on child index
 */
export function useStaggerAnimation(baseDelay = 0, increment = 0.1) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.querySelectorAll('[data-animate]');
    children.forEach((child, index) => {
      const delay = baseDelay + index * increment;
      child.style.animationDelay = `${delay}s`;
    });
  }, [baseDelay, increment]);

  return containerRef;
}

/**
 * Hook to check if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = 
    useRef(() => {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      return false;
    }).current();

  return prefersReducedMotion;
}

/**
 * Hook to apply animation class with motion preference awareness
 */
export function useAnimationClass(animationName) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? '' : animationName;
}
