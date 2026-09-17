'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';
import { PROMO_IMAGES } from '@/lib/images';
import { Supplier } from '@/types/image';
import { PromoCard } from '@/components/ui/PromoCard';

export function PromoSection() {
  // Take 1 highlight promo per supplier
  const highlightedPromos: { supplier: Supplier; promo: typeof PROMO_IMAGES[Supplier][0] }[] = [
    { supplier: 'stibois', promo: PROMO_IMAGES.stibois[0] },
    { supplier: 'mpbs', promo: PROMO_IMAGES.mpbs[0] },
    { supplier: 'propann', promo: PROMO_IMAGES.propann[0] },
    { supplier: 'starwood', promo: PROMO_IMAGES.starwood[0] },
  ];

  return (
    <section className="py-20 bg-bg-light border-y border-wood-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100 px-3 py-1 rounded-full border border-red-200">
              <Tag className="w-3.5 h-3.5" />
              Offres Spéciales &amp; Déstockage
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3">
              Promotions Fournisseurs en Cours
            </h2>
            <p className="text-charcoal-light text-sm sm:text-base mt-2 max-w-2xl">
              Profitez de tarifs négociés et de remises immédiates sur nos arrivages de panneaux et décors aux dépôts de Jâafer et Sidi Amor.
            </p>
          </div>

          <Link
            href="/promotions"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group self-start md:self-auto"
          >
            Toutes les promotions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent" />
          </Link>
        </div>

        {/* 4 Promo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlightedPromos.map(({ supplier, promo }) => (
            <PromoCard key={`${supplier}-${promo.file}`} promo={promo} supplier={supplier} />
          ))}
        </div>
      </div>
    </section>
  );
}
