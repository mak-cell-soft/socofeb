// src/components/artisans/ArtisanHero.tsx
'use client';

/**
 * @file ArtisanHero.tsx
 * @description Editorial luxury hero section for the Artisans & Réalisations experience.
 *
 * Design decisions:
 * - Uses Playfair Display for editorial gravitas and high craftsmanship aesthetic.
 * - Deep wood background with subtle ambient golden glow.
 * - Showcases an architectural project mosaic highlighting noble wood, modern dressings, and custom furniture.
 * - Interactive CTA smoothly scrolls down to the dual-journey exploration section.
 */

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

interface ArtisanHeroProps {
  totalProjects: number;
  totalArtisans: number;
}

export function ArtisanHero({ totalProjects, totalArtisans }: ArtisanHeroProps) {
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
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs sm:text-sm font-semibold tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Savoir-Faire &amp; Menuiserie d&apos;Art</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]"
            >
              Nos artisans &amp; <br />
              <span className="text-accent italic font-normal">réalisations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Découvrez nos réalisations, explorez les styles et trouvez l&apos;artisan qui donnera vie à votre projet sur-mesure.
            </motion.p>

            {/* Credibility micro-badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-gray-300"
            >
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Bois &amp; MDF certifiés SOCOFEB</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Artisans qualifiés &amp; évalués</span>
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

          {/* Right Column: Visual Collage with Real Wood & Craft Projects */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main Prominent Image */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-accent/30 shadow-2xl bg-black/40">
                <Image
                  src="/images/realisations/images/1/dressing/dress1.jpeg"
                  alt="Réalisation d'agencement intérieur et dressing haut de gamme"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/20 to-transparent opacity-70" />

                {/* Floating Badge Bottom */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-wood-dark/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Projet Vedette</p>
                    <p className="font-heading font-bold text-base">Dressing Architectural &amp; Panneaux Décors</p>
                  </div>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg border border-white/15 text-gray-200">
                    Artisan SIFFI
                  </span>
                </div>
              </div>

              {/* Overlapping Floating Secondary Thumbnail */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="hidden sm:block absolute -bottom-6 -left-6 w-44 h-44 rounded-2xl overflow-hidden border-2 border-accent/40 shadow-2xl bg-black/50"
              >
                <Image
                  src="/images/realisations/images/1/meubles/meub3.jpeg"
                  alt="Mobilier sur-mesure contemporain"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/90 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium">
                  Meubles sur-mesure
                </div>
              </motion.div>

              {/* Floating Metric Counter Top Right */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-accent text-wood-dark p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/30 flex items-center gap-3"
              >
                <div className="font-heading font-black text-2xl sm:text-3xl leading-none">
                  {totalProjects > 0 ? `${totalProjects}+` : '25+'}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-tight leading-tight">
                  Projets réels<br />documentés
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
