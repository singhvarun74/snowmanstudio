"use client";

import { cn } from '@/lib/utils';
import AnimateOnScroll from '@/components/motion/animate-on-scroll';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}) => {
  return (
    <AnimateOnScroll animationClass="animate-fade-in-from-bottom" className={cn("mb-8 md:mb-12", className)} delay="delay-50ms">
      <h2
        className={cn(
          "font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-foreground",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-2 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </AnimateOnScroll>
  );
};

export default PageTitle;
