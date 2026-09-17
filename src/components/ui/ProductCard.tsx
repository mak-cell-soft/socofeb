'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Product, SolidWoodProduct, MDFProduct, PlywoodProduct, OSBProduct } from '@/types/product';
import { SupplierBadge } from './SupplierBadge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  categorySlug: string;
  className?: string;
}

export function ProductCard({ product, categorySlug, className }: ProductCardProps) {
  const isMDF = 'epaisseurs' in product && 'suppliers' in product;
  const isWood = 'essence' in product;
  const hasDecors = 'decors' in product && product.decors;

  const detailUrl = `${categorySlug}/${product.slug}`;
  const fullImagePath = `${product.imagePath}${product.coverImage}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group bg-white rounded-2xl overflow-hidden border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col',
        className
      )}
    >
      {/* Image Container with Zoom */}
      <Link href={detailUrl} className="relative block aspect-[16/11] w-full overflow-hidden bg-wood-cream">
        <Image
          src={fullImagePath}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Suppliers Badges overlay top left */}
        {'suppliers' in product && product.suppliers && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.suppliers.slice(0, 3).map((sup) => (
              <SupplierBadge key={sup} supplier={sup} size="sm" />
            ))}
          </div>
        )}

        {/* Decors banner if MDF with decors */}
        {hasDecors && (
          <div className="absolute top-3 right-3 z-10 bg-accent text-wood-dark font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Nuancier disponible
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtitle / essence */}
          {isWood && (
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
              {(product as SolidWoodProduct).essence}
            </p>
          )}

          <Link href={detailUrl}>
            <h3 className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-charcoal-light text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specs preview */}
          {isMDF && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-charcoal">
              <span className="flex items-center gap-1 bg-wood-cream px-2 py-1 rounded-md text-[11px] font-medium border border-wood-border">
                <Layers className="w-3 h-3 text-secondary" />
                {(product as MDFProduct).epaisseurs?.slice(0, 5).join(', ')} mm
                {(product as MDFProduct).epaisseurs?.length > 5 ? '...' : ''}
              </span>
            </div>
          )}

          {isWood && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(product as SolidWoodProduct).usages?.slice(0, 3).map((u) => (
                <span
                  key={u}
                  className="bg-wood-cream text-charcoal-light text-[10px] px-2 py-0.5 rounded font-medium border border-wood-border"
                >
                  {u}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 border-t border-wood-border flex items-center justify-between gap-2">
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
          >
            Fiche technique
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {hasDecors && (
            <Link
              href={`${categorySlug}#nuancier`}
              className="px-2.5 py-1 rounded bg-wood-cream hover:bg-accent hover:text-wood-dark text-primary text-xs font-semibold transition-all border border-wood-border"
            >
              Voir décors
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
