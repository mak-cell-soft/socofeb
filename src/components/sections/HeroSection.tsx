'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  TreePine,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Architectural hero background images from public/images/ui (and public/images/hero)
const HERO_SLIDES = [
  {
    src: '/images/ui/hero-1.jpg',
    alt: 'Agencement contemporain en panneaux muraux cannelés et finitions laquées SOCOFEB',
    caption: 'Habillages Cannelés & Finitions Décoratives',
  },
  {
    src: '/images/ui/hero-2.jpg',
    alt: 'Plafonds et claustras architecturaux en bois et dérivés SOCOFEB',
    caption: 'Claustras & Plafonds Architecturaux',
  },
  {
    src: '/images/ui/hero-3.jpg',
    alt: 'Agencement cuisine et living en placages chêne et noyer sombre SOCOFEB',
    caption: 'Surfaces Ébénisterie & Essences Nobles',
  },
  {
    src: '/images/ui/hero-4.jpg',
    alt: 'Habillage acoustique et tasseaux de chêne naturel SOCOFEB',
    caption: 'Tasseaux Massifs & Panneaux Décoratifs',
  },
  {
    src: '/images/ui/hero-5.jpg',
    alt: 'Showroom matériaux composite bois et finitions haut de gamme SOCOFEB',
    caption: 'Matériaux Hybrides & Nuances Contemporaines',
  },
];

const SLIDE_DURATION = 6500; // 6.5s per slide for a calm, luxurious cadence

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Automatic rotating slideshow
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <section
      aria-label="Présentation SOCOFEB"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center bg-[#1F150B] overflow-hidden py-20 lg:py-28"
    >
      {/* Dynamic Architectural Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={HERO_SLIDES[currentSlide].src}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] },
              scale: { duration: 7.0, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={HERO_SLIDES[currentSlide].src}
              alt={HERO_SLIDES[currentSlide].alt}
              fill
              priority={currentSlide === 0}
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </motion.div>
        </AnimatePresence>

        {/* 
          Architectural Multi-layered Gradient Overlay:
          Preserves luminescence and rich photographic details on the right,
          while providing optimal high-contrast legibility for text on the left.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1308]/95 via-[#23170B]/75 to-[#1A1006]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F150B] via-transparent to-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,_rgba(200,146,42,0.12)_0%,_transparent_65%)]" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left">
        <div className="max-w-3xl">
          {/* Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-md mb-6"
          >
            <TreePine className="w-4 h-4 text-accent" />
            <span className="text-accent text-xs sm:text-sm font-bold uppercase tracking-widest">
              Société Commerciale du Fer et du Bois
            </span>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            L&apos;excellence du bois, <br />
            <span className="text-gold-gradient font-black">
              à votre portée.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-100 text-base sm:text-xl leading-relaxed mb-8 max-w-2xl font-light drop-shadow-sm"
          >
            Fournisseur de référence en Tunisie de <strong>bois massifs</strong> (Chêne, Hêtre, Bois Rouge, Blanc, Acajou) et de <strong>panneaux dérivés</strong> (MDF brut, mélaminé, high gloss, contreplaqué, OSB). Stock permanent à nos 2 dépôts de l&apos;Ariana.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
          >
            <Link
              href="/#nuancier"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-glow transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Explorer le Nuancier
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 hover:border-accent transition-all backdrop-blur-md"
            >
              <MessageSquare className="w-4 h-4 text-accent" />
              Demander un Devis
            </Link>
          </motion.div>

          {/* Key Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                <Award className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-200 font-medium">
                7 Fabricants leaders agréés
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-200 font-medium">
                Qualité certifiée EN 622 &amp; EN 300
              </span>
            </div>

            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                <TreePine className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-200 font-medium">
                2 Dépôts à Jâafer &amp; Sidi Amor
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant Slideshow Controls & Architectural Caption (Bottom Desktop) */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-20 hidden md:flex items-center gap-4 bg-black/45 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
        {/* Caption */}
        <div className="text-right">
          <p className="text-[11px] font-semibold text-white/90 font-heading">
            {HERO_SLIDES[currentSlide].caption}
          </p>
          <p className="text-[9px] font-mono text-accent uppercase tracking-wider">
            Inspiration Architecturale &bull; SOCOFEB
          </p>
        </div>

        {/* Slide navigation buttons */}
        <div className="flex items-center gap-1 border-l border-white/15 pl-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Image précédente"
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono font-bold text-accent px-1">
            0{currentSlide + 1} <span className="text-white/40">/ 0{HERO_SLIDES.length}</span>
          </span>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Image suivante"
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Progress Pill Indicators */}
        <div className="flex items-center gap-1.5 border-l border-white/15 pl-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Aller au visuel ${idx + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                currentSlide === idx
                  ? 'w-6 bg-accent'
                  : 'w-1.5 bg-white/30 hover:bg-white/60'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
