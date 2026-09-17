'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, CheckCircle } from 'lucide-react';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { Supplier } from '@/types/image';

export function PartnersSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Partenaires d&apos;Élite
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">
            Les 4 Leaders Industriels du Marché
          </h2>
          <p className="text-charcoal-light text-sm sm:text-base">
            SOCOFEB distribue en direct d&apos;usine les marques les plus fiables de Tunisie et d&apos;Europe, garantissant traçabilité, régularité des approvisionnements et conformité aux normes internationales.
          </p>
        </div>

        {/* 4 Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.entries(SUPPLIER_CONFIG) as [Supplier, typeof SUPPLIER_CONFIG[Supplier]][]).map(
            ([slug, sup], idx) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-wood-cream/40 rounded-2xl p-6 border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Brand Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-sm"
                      style={{ backgroundColor: sup.color }}
                    >
                      {sup.badgeText || 'Partenaire Agréé'}
                    </span>
                    <a
                      href={sup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary transition-colors p-1"
                      aria-label={`Site officiel de ${sup.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Partner Logo */}
                  <div className="relative h-16 w-full rounded-xl overflow-hidden bg-white border border-wood-border p-2 mb-4 flex items-center justify-center">
                    <Image
                      src={sup.logo}
                      alt={`Logo ${sup.name}`}
                      width={160}
                      height={60}
                      className="object-contain max-h-12 grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>

                  {/* Name & description */}
                  <h3 className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                    {sup.name}
                  </h3>
                  <p className="text-charcoal-light text-xs leading-relaxed mb-4">
                    {sup.description}
                  </p>

                  {/* Collections List */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                      Gamme de collections :
                    </span>
                    {sup.collections.map((col) => (
                      <div
                        key={col}
                        className="flex items-center gap-1.5 text-xs text-charcoal"
                      >
                        <CheckCircle
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: sup.color }}
                        />
                        <span className="truncate">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-wood-border flex items-center justify-between">
                  <Link
                    href={`/marques/${slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors"
                  >
                    Voir la gamme
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </Link>

                  <a
                    href={sup.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-gray-500 hover:underline"
                  >
                    Site web
                  </a>
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
