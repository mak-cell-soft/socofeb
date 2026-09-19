'use client';

import React from 'react';
import { Supplier, SUPPLIERS } from '@/types/image';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';

interface FilterBarProps {
  selectedSuppliers: Supplier[];
  onToggleSupplier: (supplier: Supplier) => void;
  selectedThickness?: number | 'all';
  onSelectThickness?: (th: number | 'all') => void;
  availableThicknesses?: number[];
  selectedFinish?: string;
  onSelectFinish?: (finish: string) => void;
  finishes?: string[];
  onReset: () => void;
  className?: string;
}

export function FilterBar({
  selectedSuppliers,
  onToggleSupplier,
  selectedThickness = 'all',
  onSelectThickness,
  availableThicknesses = [8, 12, 16, 18, 22, 25],
  selectedFinish = 'all',
  onSelectFinish,
  finishes,
  onReset,
  className,
}: FilterBarProps) {
  const hasActiveFilters =
    selectedSuppliers.length > 0 ||
    selectedThickness !== 'all' ||
    selectedFinish !== 'all';

  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-card p-4 sm:p-5 border border-wood-border flex flex-col md:flex-row md:items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        {/* Suppliers selection */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Fabricants :
          </span>
          {SUPPLIERS.map((sup) => {
            const config = SUPPLIER_CONFIG[sup];
            const isActive = selectedSuppliers.includes(sup);
            return (
              <button
                key={sup}
                onClick={() => onToggleSupplier(sup)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5',
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-wood-cream text-charcoal border-transparent hover:border-gray-300'
                )}
                style={{
                  backgroundColor: isActive ? config.color : undefined,
                  borderColor: isActive ? config.color : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isActive ? '#FFFFFF' : config.color }}
                />
                {config.name}
              </button>
            );
          })}
        </div>

        {/* Thicknesses */}
        {onSelectThickness && (
          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
              Épaisseur :
            </span>
            <button
              onClick={() => onSelectThickness('all')}
              className={cn(
                'px-2 py-0.5 rounded text-xs transition-all',
                selectedThickness === 'all'
                  ? 'bg-secondary text-white font-bold'
                  : 'text-charcoal hover:bg-gray-100'
              )}
            >
              Toutes
            </button>
            {availableThicknesses.map((th) => (
              <button
                key={th}
                onClick={() => onSelectThickness(th)}
                className={cn(
                  'px-2 py-0.5 rounded text-xs transition-all',
                  selectedThickness === th
                    ? 'bg-secondary text-white font-bold'
                    : 'text-charcoal hover:bg-gray-100'
                )}
              >
                {th}mm
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-accent transition-colors self-end md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>
      )}
    </div>
  );
}
