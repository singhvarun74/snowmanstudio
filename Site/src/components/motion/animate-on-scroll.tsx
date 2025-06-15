"use client";

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animationClass?: string; // e.g., 'animate-slide-up-fade-in', 'animate-fade-in-from-bottom'
  threshold?: number;
  triggerOnce?: boolean;
  delay?: string; // e.g., 'delay-200'
  duration?: string; // e.g., 'duration-500'
  as?: React.ElementType; // Allow specifying the element type
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  className,
  animationClass = "animate-slide-up-fade-in",
  threshold = 0.1,
  triggerOnce = true,
  delay = '',
  duration = '',
  as: Component = 'div', // Default to 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current; // Capture ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && currentRef) {
            observer.unobserve(currentRef);
          }
        } else {
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      { threshold }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-opacity transform',
        isVisible ? `${animationClass} opacity-100 ${delay} ${duration}` : 'opacity-0',
        className
      )}
    >
      {children}
    </Component>
  );
};

export default AnimateOnScroll;
