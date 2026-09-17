'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Tag } from 'lucide-react';
import { Supplier } from '@/types/image';
import { SupplierBadge } from './SupplierBadge';
import { ImageLightbox, LightboxImageItem } from './ImageLightbox';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  src: string;
  label: string;
  ref?: string;
  isPromo?: boolean;
}

interface ProductImageGalleryProps {
  images: GalleryImage[];
  supplier?: Supplier;
  productName: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  supplier,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const activeImage = images[selectedIndex] || images[0];

  const lightboxItems: LightboxImageItem[] = images.map((img) => ({
    src: img.src,
    label: img.label || productName,
    ref: img.ref,
    supplier: supplier?.toUpperCase(),
  }));

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Main Big Image Preview (60% width on desktop) */}
        <div className="w-full lg:w-[65%]">
          <div
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-wood-cream border border-wood-border shadow-card cursor-zoom-in group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.label || productName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className={cn(
                    'object-cover transition-transform duration-700 ease-out',
                    isHovered ? 'scale-125' : 'scale-100'
                  )}
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges Overlays: Supplier top-left */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex flex-col gap-2">
              {supplier && <SupplierBadge supplier={supplier} size="md" />}
              {activeImage.isPromo && (
                <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
                  <Tag className="w-3 h-3" /> PROMO
                </span>
              )}
            </div>

            {/* Button "Voir en grand" */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-dark/80 hover:bg-wood-dark text-white text-xs font-semibold backdrop-blur-md border border-accent/40 transition-all shadow-md hover:scale-105"
            >
              <Maximize2 className="w-3.5 h-3.5 text-accent" />
              Voir en grand
            </button>

            {/* Subtle caption bottom left */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md text-white text-xs font-medium max-w-[60%] truncate">
              {activeImage.label}
              {activeImage.ref && (
                <span className="text-accent ml-2 font-mono">
                  ({activeImage.ref})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip (right side on desktop, bottom on mobile) */}
        <div className="w-full lg:w-[35%] flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[460px] pb-2 lg:pb-0 scrollbar-none">
          {images.slice(0, 6).map((img, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={`${img.src}-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  'relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-full lg:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 text-left flex items-center gap-3 p-1.5 group',
                  isActive
                    ? 'border-accent shadow-md ring-2 ring-accent/30 bg-wood-cream'
                    : 'border-wood-border bg-white hover:border-secondary'
                )}
              >
                <div className="relative w-16 h-full lg:w-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {img.isPromo && (
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded">
                      %
                    </span>
                  )}
                </div>

                <div className="hidden lg:flex flex-col justify-center overflow-hidden pr-2">
                  <span
                    className={cn(
                      'text-xs font-bold truncate',
                      isActive ? 'text-primary' : 'text-charcoal'
                    )}
                  >
                    {img.label}
                  </span>
                  {img.ref && (
                    <span className="text-[10px] font-mono text-charcoal-light">
                      Réf: {img.ref}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox for full screen viewing */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName={supplier?.toUpperCase()}
      />
    </div>
  );
}
