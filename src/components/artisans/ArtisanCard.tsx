// src/components/artisans/ArtisanCard.tsx
'use client';

/**
 * @file ArtisanCard.tsx
 * @description Premium artisan preview card for the discovery grid.
 *
 * Implements:
 * - Professional fallback monogram avatar if profile image is missing.
 * - Star rating visualization with "Pas encore d'avis" fallback (never 0.0).
 * - Specialty chips for discovered categories.
 * - Project photo count badge.
 * - Direct link to artisan detail page (/realisations/artisan/[id]).
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Image as ImageIcon, Hammer, CheckCircle2 } from 'lucide-react';
import { Artisan } from '@/types/artisan';
import { formatArtisanRating } from '@/lib/artisans';

interface ArtisanCardProps {
  artisan: Artisan;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const ratingInfo = formatArtisanRating(artisan.rating);

  // Compute monogram initials for professional fallback
  const initials = [artisan.prenom?.[0], artisan.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'AR';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-3xl overflow-hidden border border-wood-border shadow-card hover:shadow-card-hover flex flex-col justify-between transition-all duration-300"
    >
      <div>
        {/* Card Header with Profile Image / Avatar & Verified Badge */}
        <div className="relative aspect-[16/11] bg-wood-cream overflow-hidden border-b border-wood-border/60">
          {artisan.profile ? (
            <Image
              src={artisan.profile}
              alt={`Artisan ${artisan.fullName}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            // Professional craftsman monogram fallback when no photo exists
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-wood-cream via-bg-light to-wood-border text-primary/70 p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-accent/40 shadow-md flex items-center justify-center font-heading font-black text-2xl text-primary mb-2">
                {initials}
              </div>
              <span className="text-xs font-semibold text-charcoal-light flex items-center gap-1">
                <Hammer className="w-3.5 h-3.5 text-accent" />
                Artisan Partenaire
              </span>
            </div>
          )}

          {/* Top Left Project Count Pill */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wood-dark/80 backdrop-blur-md text-white border border-white/15 shadow-sm">
              <ImageIcon className="w-3.5 h-3.5 text-accent" />
              {artisan.totalProjects > 0
                ? `${artisan.totalProjects} réalisation${artisan.totalProjects > 1 ? 's' : ''}`
                : 'Aucun projet'}
            </span>
          </div>

          {/* Top Right Verified Partner Pill */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent text-wood-dark shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-wood-dark" />
              SOCOFEB
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Artisan Name */}
          <h3 className="font-heading text-xl font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
            {artisan.fullName}
          </h3>

          {/* Rating Section (Guarantees NO "0.0 ★" when unrated) */}
          <div className="flex items-center gap-2 mt-2">
            {ratingInfo.hasReviews ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(ratingInfo.score)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-primary">{ratingInfo.displayText}</span>
                <span className="text-xs text-charcoal-light font-medium">{ratingInfo.countText}</span>
              </div>
            ) : (
              <span className="text-xs font-medium text-charcoal-light/80 italic bg-wood-cream px-2.5 py-0.5 rounded-full border border-wood-border/60">
                Pas encore d&apos;avis
              </span>
            )}
          </div>

          {/* Short Bio / Description */}
          {artisan.bio && (
            <p className="mt-3 text-xs text-charcoal-light line-clamp-2 leading-relaxed">
              {artisan.bio}
            </p>
          )}

          {/* Specialties / Discovered Categories */}
          <div className="mt-4 pt-4 border-t border-wood-border/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light mb-2">
              Spécialités :
            </p>
            {artisan.categories.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {artisan.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-wood-cream text-primary border border-wood-border/80"
                  >
                    {cat.label} ({cat.count})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-light/70 italic">
                Aucune réalisation disponible pour le moment.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer CTA */}
      <div className="px-6 pb-6 pt-2">
        <Link
          href={`/realisations/artisan/${artisan.id}`}
          className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-wood-cream hover:bg-accent text-primary hover:text-wood-dark font-bold text-xs uppercase tracking-wider transition-all duration-200 border border-wood-border group/btn"
        >
          <span>Voir son travail</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
