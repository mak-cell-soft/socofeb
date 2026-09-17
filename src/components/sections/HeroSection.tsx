'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, ShieldCheck, TreePine, Award } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-wood-dark overflow-hidden py-20 lg:py-28">
      {/* Background with texture & subtle gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-wood-workshop.webp"
          alt="SOCOFEB Atelier et Négoce de bois"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wood-dark via-primary/80 to-wood-dark/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/40 backdrop-blur-md mb-6"
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
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
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
            className="text-gray-200 text-base sm:text-xl leading-relaxed mb-8 max-w-2xl font-light"
          >
            Fournisseur de référence en Tunisie de <strong>bois massifs</strong> (Chêne, Hêtre, Bois Rouge, Bois Blanc, Acajou) et de <strong>panneaux dérivés</strong> (MDF brut, stratifié, high gloss, contreplaqué, OSB). Stock permanent à nos 2 dépôts de l&apos;Ariana.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12"
          >
            <Link
              href="/produits"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-glow transition-all hover:scale-105"
            >
              Consulter le Catalogue
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
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-300 font-medium">
                4 Fabricants leaders agréés
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-300 font-medium">
                Qualité certifiée EN 622 &amp; EN 300
              </span>
            </div>

            <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <TreePine className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs text-gray-300 font-medium">
                2 Dépôts à Jâafer &amp; Sidi Amor
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
