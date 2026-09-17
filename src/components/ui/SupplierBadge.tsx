'use client';

import React from 'react';
import { Supplier } from '@/types/image';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface SupplierBadgeProps {
  supplier: Supplier;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SupplierBadge({ supplier, className, size = 'sm' }: SupplierBadgeProps) {
  const config = SUPPLIER_CONFIG[supplier];
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 tracking-wider',
    md: 'text-xs px-3 py-1 tracking-wider',
    lg: 'text-sm px-4 py-1.5 tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold uppercase rounded-full border transition-all duration-200 shadow-sm',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${config.color}15`,
        borderColor: `${config.color}40`,
        color: config.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.name}
    </span>
  );
}
