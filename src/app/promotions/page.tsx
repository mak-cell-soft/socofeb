'use client';

import React, { useState } from 'react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { PromoCard } from '@/components/ui/PromoCard';
import { PROMO_IMAGES } from '@/lib/images';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { Supplier, PromoImage } from '@/types/image';
import { Tag, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PromotionsPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'all'>('all');

  const allPromos: { supplier: Supplier; promo: PromoImage }[] = [];
  (['stibois', 'mpbs', 'propann', 'starwood'] as Supplier[]).forEach((sup) => {
    (PROMO_IMAGES[sup] || []).forEach((promo) => {
      allPromos.push({ supplier: sup, promo });
    });
  });

  const filteredPromos = allPromos.filter(
    (item) => selectedSupplier === 'all' || item.supplier === selectedSupplier
  );

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Promotions' }]} />

        {/* Page Header */}
        <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200">
            <Tag className="w-3.5 h-3.5" />
            Bons Plans &amp; Déstockage Direct Usine
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            Offres &amp; Promotions Fournisseurs
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Consultez les remises en cours sur nos arrivages de panneaux MDF, décors mélaminés, surfaces High Gloss et contreplaqués. Offres valables dans la limite des stocks disponibles à nos dépôts de Jâafer et Sidi Amor.
          </p>
        </div>

        {/* Supplier Filter Buttons */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedSupplier('all')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all',
              selectedSupplier === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-charcoal border border-wood-border hover:bg-wood-cream'
            )}
          >
            Toutes les marques ({allPromos.length})
          </button>
          {(['stibois', 'mpbs', 'propann', 'starwood'] as Supplier[]).map((sup) => {
            const config = SUPPLIER_CONFIG[sup];
            const isSelected = selectedSupplier === sup;
            const count = (PROMO_IMAGES[sup] || []).length;
            return (
              <button
                key={sup}
                onClick={() => setSelectedSupplier(sup)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5',
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-white text-charcoal border-wood-border hover:bg-wood-cream'
                )}
                style={{
                  backgroundColor: isSelected ? config.color : undefined,
                  borderColor: isSelected ? config.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#FFFFFF' : config.color }}
                />
                {config.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredPromos.map(({ supplier, promo }) => (
            <PromoCard
              key={`${supplier}-${promo.file}`}
              promo={promo}
              supplier={supplier}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
