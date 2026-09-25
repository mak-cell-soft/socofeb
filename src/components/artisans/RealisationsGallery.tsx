// src/components/artisans/RealisationsGallery.tsx
'use client';

/**
 * @file RealisationsGallery.tsx
 * @description Highly visual, interactive portfolio gallery with dynamic category filtering
 * and integrated fullscreen lightbox.
 *
 * Implements:
 * - Dynamic category chips (only rendering non-empty categories).
 * - Aspect-ratio containers preventing layout shift.
 * - Subtle hover zoom & zoom eye icon indicator.
 * - Seamless integration with ArtisanLightbox.
 * - Handles both Global portfolio mode and Single-artisan portfolio mode.
 */

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Layers, User, Sparkles } from 'lucide-react';
import { ArtisanCategory, ArtisanProjectImage } from '@/types/artisan';
import { ArtisanLightbox } from './ArtisanLightbox';

interface RealisationsGalleryProps {
  images: ArtisanProjectImage[];
  categories: ArtisanCategory[];
  title?: string;
  subtitle?: string;
  showArtisanBadge?: boolean;
  artisanName?: string;
  artisanPhone?: string | null;
  id?: string;
}

export function RealisationsGallery({
  images,
  categories,
  title = 'Nos réalisations',
  subtitle = 'Explorez nos projets récents par catégorie : mobilier contemporain, dressings sur-mesure et portes d’intérieur.',
  showArtisanBadge = true,
  artisanName,
  artisanPhone,
  id = 'realisations-gallery',
}: RealisationsGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter images by selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const openLightboxAt = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-wood-cream/40 border-b border-wood-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Galerie Portfolio
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-3">
            {title}
          </h2>
          <p className="text-charcoal-light text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-primary border-wood-border hover:bg-wood-cream'
              }`}
            >
              <span>Toutes</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-wood-cream text-charcoal-light'
              }`}>
                {images.length}
              </span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-white text-primary border-wood-border hover:bg-wood-cream'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-wood-cream text-charcoal-light'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
          >
            <AnimatePresence>
              {filteredImages.map((image, idx) => (
                <motion.div
                  layout
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  whileHover={{ y: -6 }}
                  onClick={() => openLightboxAt(idx)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover border border-wood-border bg-wood-dark"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/90 via-wood-dark/25 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-wood-dark shadow-sm flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {image.categoryLabel}
                    </span>
                  </div>

                  {/* Top-Right Quick Zoom Icon */}
                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Eye className="w-4 h-4" />
                  </div>

                  {/* Bottom Info: Project Title & Artisan Attribution */}
                  <div className="absolute inset-x-0 bottom-0 p-4 z-10 text-white">
                    {image.title ? (
                      <h3 className="font-heading font-semibold text-sm text-white line-clamp-1 group-hover:text-accent transition-colors">
                        {image.title}
                      </h3>
                    ) : (
                      <h3 className="font-heading font-semibold text-sm text-white line-clamp-1">
                        {image.categoryLabel} sur mesure
                      </h3>
                    )}
                    {showArtisanBadge && image.artisanName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-300 font-normal mt-0.5">
                        <User className="w-3 h-3 text-accent shrink-0" />
                        <span className="truncate">
                          {image.artisanName}
                          {image.artisanSociety ? ` · ${image.artisanSociety}` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty State Handling
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-wood-border max-w-md mx-auto my-8">
            <p className="text-base font-bold text-primary mb-2">
              Aucune réalisation disponible pour le moment.
            </p>
            <p className="text-xs text-charcoal-light">
              De nouvelles réalisations sont ajoutées régulièrement par nos artisans partenaires.
            </p>
          </div>
        )}

      </div>

      {/* Integrated Lightbox */}
      <ArtisanLightbox
        images={filteredImages}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        artisanName={artisanName}
        artisanPhone={artisanPhone}
      />
    </section>
  );
}
