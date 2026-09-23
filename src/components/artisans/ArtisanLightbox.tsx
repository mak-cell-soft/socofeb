// src/components/artisans/ArtisanLightbox.tsx
'use client';

/**
 * @file ArtisanLightbox.tsx
 * @description Dedicated fullscreen lightbox viewer for artisan project portfolios.
 *
 * Implements:
 * - Keyboard navigation (Esc, Left arrow, Right arrow).
 * - Mobile touch swipe gestures.
 * - Dynamic image counter (e.g. 3 / 25).
 * - Subtle category badge.
 * - WhatsApp direct inquiry linking the project and artisan.
 */

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MessageSquare, Layers, User } from 'lucide-react';
import { ArtisanProjectImage } from '@/types/artisan';
import { COMPANY_INFO } from '@/lib/catalog';

interface ArtisanLightboxProps {
  images: ArtisanProjectImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  artisanName?: string;
  artisanPhone?: string | null;
}

export function ArtisanLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  artisanName,
  artisanPhone,
}: ArtisanLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Lock body scroll when lightbox is opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Mobile swipe gestures
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex] || images[0];
  const activeArtisanName = currentImage.artisanName || artisanName || 'Artisan SOCOFEB';

  // Construct context-rich WhatsApp inquiry
  const whatsappText = encodeURIComponent(
    `Bonjour SOCOFEB, je suis très intéressé(e) par cette réalisation (${currentImage.categoryLabel}) de l'artisan ${activeArtisanName}. Pourriez-vous me renseigner sur la faisabilité et les matériaux ?`
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-3 sm:p-6 select-none"
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div
          className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/20 border border-accent/30 px-3 py-1 rounded-full">
              {currentImage.categoryLabel}
            </span>
            <span className="text-sm font-mono text-gray-300">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer la vue plein écran"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previous Button (Desktop) */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Photo précédente"
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent transition-all hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Next Button (Desktop) */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Photo suivante"
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent transition-all hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Main Stage Image & Action Bar */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Main Photo Frame */}
          <div className="relative w-full h-[55vh] sm:h-[65vh] max-h-[660px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/50">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority
              sizes="(max-width: 768px) 96vw, 85vw"
              className="object-contain"
            />
          </div>

          {/* Bottom Context & Contact Ribbon */}
          <div className="w-full mt-3 sm:mt-4 bg-wood-dark/95 border border-accent/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-2xl">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                  Réalisation {currentImage.categoryLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/25">
                  <User className="w-3 h-3" />
                  {activeArtisanName}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Mise en œuvre soignée en panneaux dérivés et bois massif SOCOFEB.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`${COMPANY_INFO.whatsappUrl}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                Contacter pour ce projet
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
