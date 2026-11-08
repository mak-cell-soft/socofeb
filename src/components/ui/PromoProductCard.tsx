'use client';

/**
 * PromoProductCard Component — SOCOFEB
 *
 * Showroom-grade promotional card for discounted decorative wood and panel products.
 * The product image is the sole visual focal point without overlay clutter.
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquare, Maximize2, Tag } from 'lucide-react';
import { PromoProduct } from '@/types/promo';
import { buildPromoWhatsAppUrl } from '@/lib/promos';
import { cn } from '@/lib/utils';

interface PromoProductCardProps {
  promo: PromoProduct;
  onOpenLightbox?: () => void;
  className?: string;
  priority?: boolean;
}

export function PromoProductCard({
  promo,
  onOpenLightbox,
  className,
  priority = false,
}: PromoProductCardProps) {
  const whatsappUrl = buildPromoWhatsAppUrl(promo);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* 1. Visual Dominance: Unobstructed Image Container with Lightbox Trigger */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden bg-wood-cream/40 cursor-pointer select-none"
        onClick={onOpenLightbox}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenLightbox?.();
          }
        }}
        aria-label={`Agrandir le visuel de ${promo.name}`}
      >
        <Image
          src={promo.encodedSrc}
          alt={`Panneau décoratif en promotion ${promo.name} par ${promo.supplierName} (Réf. ${promo.ref || 'SOCOFEB'})`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges: ONLY Discount Ribbon in Top-Left and Lightbox Icon in Top-Right */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Discount Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-primary font-black text-xs uppercase tracking-wider shadow-md border border-accent/40 backdrop-blur-xs">
            <Tag className="w-3 h-3 text-primary" />
            {promo.discountLabel}
          </span>

          {/* Quick Lightbox Inspection Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox?.();
            }}
            aria-label="Agrandir en haute définition"
            className="pointer-events-auto p-1.5 rounded-lg bg-black/60 hover:bg-accent text-white hover:text-primary transition-all duration-200 border border-white/20 backdrop-blur-xs hover:scale-110 shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Content & Product Specifications */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
              {promo.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {promo.ref ? (
              <span className="inline-flex items-center text-xs font-mono font-medium text-charcoal bg-wood-cream/80 px-2 py-0.5 rounded border border-wood-border">
                Réf : <strong className="ml-1 text-primary">{promo.ref}</strong>
              </span>
            ) : (
              <span className="text-xs text-charcoal-light">Référence usine direct</span>
            )}
            <span className="text-[11px] text-charcoal-light flex items-center gap-1">
              • Stock Ariana (Jâafer &amp; Sidi Amor)
            </span>
          </div>
        </div>

        {/* 3. Action Bar: Contextual WhatsApp Quotation Action */}
        <div className="pt-3 border-t border-wood-border/70 flex items-center justify-between gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            title={`Demander un devis pour ${promo.name}`}
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Demander un devis</span>
          </a>

          <button
            type="button"
            onClick={onOpenLightbox}
            className="px-3 py-2.5 rounded-xl bg-wood-cream/60 hover:bg-wood-cream text-charcoal hover:text-primary transition-colors text-xs font-semibold border border-wood-border shrink-0"
            title="Agrandir en haute définition"
          >
            Aperçu HD
          </button>
        </div>
      </div>
    </motion.article>
  );
}
