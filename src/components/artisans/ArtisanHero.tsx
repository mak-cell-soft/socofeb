// src/components/artisans/ArtisanHero.tsx
'use client';

/**
 * @file ArtisanHero.tsx
 * @description Editorial luxury hero section for the Artisans & Réalisations experience.
 *
 * Design decisions:
 * - Playfair Display editorial typography with gold-embossed badges.
 * - Showcases both featured artisans: Racine Cuisine (Walid BEN MOUSSA) & Atelier SIFFI (Walid SIFFI).
 * - Interactive artisan showcase with auto-rotation, smooth transitions, and direct links.
 * - Deep wood background with atmospheric radial lighting.
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowDown,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Utensils,
  Hammer,
  Layers,
} from 'lucide-react';

interface ArtisanHeroProps {
  totalProjects: number;
  totalArtisans: number;
}

// Curated showcase highlights for each partner artisan
const FEATURED_ARTISANS = [
  {
    id: 2,
    name: 'Walid BEN MOUSSA',
    society: 'Racine Cuisine',
    specialty: 'Cuisines d’exception & Agencement',
    tag: 'Cuisine Signature',
    title: 'Cuisine Haute Précision & Rétro-Éclairage',
    subtitle: 'Îlots modernes, vitrines éclairées et finitions chêne noble',
    mainImage: '/images/realisations/images/2/cuisines/cuis5.jpeg',
    mainImageAlt: 'Cuisine moderne sur mesure avec îlot et vitrine rétro-éclairée par Racine Cuisine — Menuisier agenceur en Tunisie (مطبخ عصري وتأثيث حسب الطلب)',
    secondaryImage: '/images/realisations/images/2/cuisines/cuis7.jpeg',
    secondaryLabel: 'Claustra & Séparation Chêne',
    logo: '/images/realisations/profile/racine-cuisine.png',
    isLogoSquare: true,
    projectCount: 81,
    icon: Utensils,
  },
  {
    id: 1,
    name: 'Walid SIFFI',
    society: 'Atelier SIFFI',
    specialty: 'Dressings & Mobilier contemporain',
    tag: 'Dressing Vedette',
    title: 'Dressing Architectural & Panneaux Décors',
    subtitle: 'Rangements sur-mesure et menuiserie d’intérieur de précision',
    mainImage: '/images/realisations/images/1/dressing/dress1.jpeg',
    mainImageAlt: 'Dressing sur mesure en bois noble et placards intégrés par artisan menuisier Walid SIFFI (دريسينغ وخزائن على المقاس)',
    secondaryImage: '/images/realisations/images/1/meubles/meub3.jpeg',
    secondaryLabel: 'Mobilier Design sur-mesure',
    logo: '/images/realisations/profile/walid-siffi.jpeg',
    isLogoSquare: false,
    projectCount: 25,
    icon: Hammer,
  },
];

export function ArtisanHero({ totalProjects, totalArtisans }: ArtisanHeroProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through featured artisan spotlights every 7 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FEATURED_ARTISANS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeArtisan = FEATURED_ARTISANS[activeIdx];
  const IconComponent = activeArtisan.icon;

  const scrollToExplore = () => {
    const el = document.getElementById('exploration-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-wood-dark text-white pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 border-b border-wood-border/20">
      {/* Subtle architectural background texture and golden light gradients */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#C8922A_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Menuiserie d&apos;Art &amp; Agencement Sur Mesure · نجارة وتأثيث حسب الطلب</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.15]"
            >
              Nos réalisations de <br className="hidden sm:inline" />
              <span className="text-accent italic font-normal">menuiserie &amp; ameublement</span>{' '}
              sur mesure
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Explorez les créations d&apos;exception de nos artisans menuisiers et agenceurs partenaires en Tunisie :{' '}
              cuisines contemporaines par <strong className="text-white font-medium">Racine Cuisine</strong>,{' '}
              dressings architecturaux et mobilier sur mesure par <strong className="text-white font-medium">l&apos;Atelier SIFFI</strong>,{' '}
              façonnés avec les panneaux MDF décoratifs et bois massifs certifiés SOCOFEB.
            </motion.p>

            {/* Credibility micro-badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 text-xs sm:text-sm text-gray-300"
            >
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Panneaux MDF &amp; Bois certifiés SOCOFEB</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Artisans menuisiers qualifiés &amp; évalués</span>
              </div>
            </motion.div>

            {/* Interactive Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={scrollToExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Compass className="w-4 h-4 text-wood-dark" />
                Explorer les réalisations
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <a
                href="#artisans-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-all duration-300"
              >
                Rencontrer les artisans
              </a>
            </motion.div>
          </div>

          {/* Right Column: Visual Dual-Artisan Showcase Carousel */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Interactive Artisan Switcher Tabs */}
            <div className="flex items-center justify-center lg:justify-end gap-2 mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-400 mr-1 hidden sm:inline-block">
                À la une :
              </span>
              {FEATURED_ARTISANS.map((item, idx) => {
                const isSelected = idx === activeIdx;
                const TabIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer ${
                      isSelected
                        ? 'bg-accent text-wood-dark border-accent shadow-md scale-105'
                        : 'bg-white/10 text-gray-300 border-white/15 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{item.society || item.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-wood-dark/20 text-wood-dark' : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {item.projectCount}
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Prominent Image Card with Dynamic Transition */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-accent/30 shadow-2xl bg-black/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeArtisan.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeArtisan.mainImage}
                      alt={activeArtisan.mainImageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/30 to-transparent opacity-80" />
                  </motion.div>
                </AnimatePresence>

                {/* Top Left Artisan Identification Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-wood-dark/85 backdrop-blur-md border border-white/20 text-white shadow-lg">
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white shrink-0 border border-white/30">
                      <Image
                        src={activeArtisan.logo}
                        alt={activeArtisan.name}
                        fill
                        sizes="28px"
                        className={activeArtisan.isLogoSquare ? 'object-contain p-0.5' : 'object-cover'}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white leading-none">
                        {activeArtisan.society || activeArtisan.name}
                      </p>
                      <p className="text-[9px] text-accent tracking-wide mt-0.5">
                        {activeArtisan.specialty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Project Card with Direct Link */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-wood-dark/90 backdrop-blur-md border border-white/15 text-white shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-2 py-0.5 rounded border border-accent/20">
                          {activeArtisan.tag}
                        </span>
                        <span className="text-[11px] text-gray-300 truncate">
                          par {activeArtisan.name}
                        </span>
                      </div>
                      <p className="font-heading font-bold text-base text-white truncate">
                        {activeArtisan.title}
                      </p>
                      <p className="text-[11px] text-gray-300 font-light truncate mt-0.5">
                        {activeArtisan.subtitle}
                      </p>
                    </div>

                    <Link
                      href={`/realisations/artisan/${activeArtisan.id}`}
                      className="shrink-0 p-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase transition-transform hover:scale-110 shadow-md group"
                      aria-label={`Découvrir les réalisations de ${activeArtisan.name}`}
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Overlapping Floating Secondary Thumbnail */}
              <motion.div
                key={`secondary-${activeArtisan.id}`}
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden sm:block absolute -bottom-6 -left-6 w-44 h-44 rounded-2xl overflow-hidden border-2 border-accent/40 shadow-2xl bg-black/60 z-20 group"
              >
                <Image
                  src={activeArtisan.secondaryImage}
                  alt={activeArtisan.secondaryLabel}
                  fill
                  sizes="180px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/95 via-wood-dark/30 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[10px] text-white font-medium leading-tight">
                  <span className="text-[9px] text-accent block font-bold uppercase tracking-wider">
                    Également réalisé
                  </span>
                  {activeArtisan.secondaryLabel}
                </div>
              </motion.div>

              {/* Floating Metric Counter Top Right */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-4 -right-4 bg-accent text-wood-dark p-3 sm:p-4 rounded-2xl shadow-xl border border-white/30 flex items-center gap-3 z-20"
              >
                <div className="font-heading font-black text-2xl sm:text-3xl leading-none">
                  {totalProjects > 0 ? `${totalProjects}+` : '100+'}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-tight leading-tight">
                  Projets réels<br />
                  <span className="text-[10px] font-normal opacity-90">
                    {totalArtisans} artisans agréés
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

