import React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  theme?: 'dark' | 'light' | 'white';
  className?: string;
  containerClassName?: string;
}

export function SectionWrapper({
  children,
  id,
  theme = 'light',
  className,
  containerClassName,
}: SectionWrapperProps) {
  const themeClasses = {
    dark: 'bg-primary text-white',
    light: 'bg-bg-light text-charcoal',
    white: 'bg-white text-charcoal',
  };

  return (
    <section
      id={id}
      className={cn('py-16 sm:py-20 lg:py-24 relative', themeClasses[theme], className)}
    >
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10', containerClassName)}>
        {children}
      </div>
    </section>
  );
}
