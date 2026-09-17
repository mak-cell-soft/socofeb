import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn('flex items-center space-x-2 text-xs text-charcoal-light py-3', className)}
    >
      <Link
        href="/"
        className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
      >
        <Home className="w-3.5 h-3.5 text-accent" />
        <span className="sr-only">Accueil</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-bold truncate">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
