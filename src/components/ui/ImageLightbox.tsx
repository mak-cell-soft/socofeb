'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, MessageSquare, ZoomIn, Layers } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';

export interface LightboxImageItem {
  src: string;
  label: string;
  ref?: string;
  thicknesses?: string[];
  supplier?: string;
  collection?: string;
}

export interface ImageLightboxProps {
  images: LightboxImageItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  supplierName?: string;
}

export function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  supplierName,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Lock body scroll when open
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

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

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

  const quoteMessage = encodeURIComponent(
    `Bonjour SOCOFEB, je souhaite obtenir un devis pour le décor : ${currentImage.label} (Réf: ${currentImage.ref || 'N/A'})${
      supplierName ? ` - Marque: ${supplierName}` : ''
    }.`
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 select-none"
        onClick={onClose}
      >
        {/* Top Header Controls */}
        <div
          className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-white">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              {supplierName || currentImage.supplier || 'SOCOFEB Catalogue'}
            </span>
            <div className="text-sm text-gray-300 font-mono">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 border border-white/20 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Image précédente"
            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Image suivante"
            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-accent text-white hover:text-black border border-white/20 hover:border-accent transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Center Content / Image Stage */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative w-full h-[52vh] sm:h-[62vh] max-h-[620px] rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black/40">
            <Image
              src={currentImage.src}
              alt={currentImage.label}
              fill
              priority
              sizes="(max-width: 768px) 95vw, 80vw"
              className="object-contain"
            />
          </div>

          {/* Details & Action Bar */}
          <div className="w-full mt-4 bg-wood-dark/90 border border-accent/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-2xl">
            <div className="text-center sm:text-left">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
                {currentImage.label}
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-gray-300">
                {currentImage.ref && (
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-accent border border-accent/30">
                    Réf: {currentImage.ref}
                  </span>
                )}
                {currentImage.thicknesses && currentImage.thicknesses.length > 0 && (
                  <span className="flex items-center gap-1 text-gray-300 bg-black/40 px-2 py-0.5 rounded">
                    <Layers className="w-3 h-3 text-accent" />
                    Épaisseurs : {currentImage.thicknesses.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`${COMPANY_INFO.whatsappUrl}?text=${quoteMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                Demander un devis
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
