'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

export function ProductsSection() {
  // Category banner images mapping
  const categoryImages: Record<string, string> = {
    'bois-massifs': '/images/bois/chene/chene-cover.webp',
    'mdf': '/images/stibois/mdf-stratifie/mdf-stratifie-cover.webp',
    'contreplaque': '/images/stibois/contreplaque/cp-structurel-cover.webp',
    'osb': '/images/osb/osb-cover.webp',
  };

  return (
    <section className="py-20 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
              Gamme Complète
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3">
              Nos Familles de Produits
            </h2>
          </div>

          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group self-start md:self-auto"
          >
            Découvrir l&apos;intégralité du catalogue
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_CATEGORIES.map((cat, idx) => {
            const imgSrc =
              categoryImages[cat.id] ||
              `${cat.products[0]?.imagePath}${cat.products[0]?.coverImage}`;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover border border-wood-border flex flex-col justify-between transition-all duration-300"
              >
                {/* Image Cover */}
                <Link href={cat.slug} className="relative aspect-[4/3] w-full overflow-hidden bg-wood-cream block">
                  <Image
                    src={imgSrc}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md border border-wood-border">
                    {cat.icon}
                  </div>

                  {cat.id === 'mdf' && (
                    <div className="absolute top-3 right-3 bg-accent text-wood-dark font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Nuancier
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                      <Link href={cat.slug}>{cat.label}</Link>
                    </h3>
                    <p className="text-charcoal-light text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer Link */}
                  <div className="pt-4 border-t border-wood-border">
                    <Link
                      href={cat.slug}
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                    >
                      <span>Voir les produits</span>
                      <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
