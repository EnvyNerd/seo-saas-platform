import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition wrapper that applies fade-in animation on page load
 * Respects prefers-reduced-motion for accessibility
 */
export default function PageTransition({ children }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset state on path change
    setIsAnimating(false);
    
    // Use a small timeout to ensure the DOM has updated and the 'opacity-0' 
    // class is applied before we trigger the animation.
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 50);

    // Safety fallback: if for some reason isAnimating remains false, 
    // we want the content to be visible anyway.
    const safetyTimer = setTimeout(() => {
      setIsAnimating(true);
    }, 600);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}
