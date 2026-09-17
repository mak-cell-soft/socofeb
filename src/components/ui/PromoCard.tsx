'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { PromoImage, Supplier } from '@/types/image';
import { getPromoPath } from '@/lib/images';
import { SUPPLIER_CONFIG, COMPANY_INFO } from '@/lib/catalog';
import { SupplierBadge } from './SupplierBadge';
import { cn } from '@/lib/utils';

interface PromoCardProps {
  promo: PromoImage;
  supplier: Supplier;
  className?: string;
}

export function PromoCard({ promo, supplier, className }: PromoCardProps) {
  const config = SUPPLIER_CONFIG[supplier];
  const imageSrc = getPromoPath(supplier, promo.file);

  const whatsappText = encodeURIComponent(
    `Bonjour SOCOFEB, je suis intéressé par l'offre promotionnelle : ${promo.label} (${promo.discount}) de la marque ${config?.name || supplier}.`
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Banner / Image with diagonal discount badge */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-wood-dark">
        <Image
          src={imageSrc}
          alt={promo.label}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Diagonal Discount Ribbon */}
        <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
          <div className="absolute top-4 -right-8 bg-accent text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider py-1 w-32 text-center rotate-45 shadow-lg border-y border-wood-dark/20">
            {promo.discount}
          </div>
        </div>

        {/* Supplier Badge overlay bottom left */}
        <div className="absolute bottom-3 left-3 z-10">
          <SupplierBadge supplier={supplier} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
            Offre spéciale {config?.name}
          </span>
          <h3 className="font-heading text-xl font-bold text-primary mt-1 mb-2 group-hover:text-secondary transition-colors">
            {promo.label}
          </h3>
          <p className="text-charcoal-light text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {promo.description ||
              `Bénéficiez d'une remise exceptionnelle sur une sélection de panneaux et décors ${config?.name} en stock à nos dépôts d'Ariana.`}
          </p>
        </div>

        {/* CTA WhatsApp / Devis */}
        <div className="pt-4 border-t border-wood-border flex items-center justify-between">
          <a
            href={`${COMPANY_INFO.whatsappUrl}?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Réserver l&apos;offre
          </a>

          <a
            href={`/marques/${supplier}`}
            className="text-xs font-semibold text-charcoal hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Voir la marque
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
