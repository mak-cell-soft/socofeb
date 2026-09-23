// src/app/realisations/artisan/[id]/page.tsx
/**
 * @file page.tsx
 * @description Dedicated artisan portfolio and contact profile page.
 *
 * Implements:
 * - High-craftsmanship header with profile photo, contact CTAs, and verified partner badges.
 * - Dynamic category filter tabs rendering ONLY existing, populated categories.
 * - Integrated RealisationsGallery with fullscreen lightbox viewer.
 * - Interactive RatingWidget for visitor feedback.
 * - Static Site Generation (SSG) via generateStaticParams.
 * - SEO-optimized metadata and OpenGraph tags.
 */

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Facebook,
  Instagram,
  Star,
  CheckCircle2,
  Hammer,
  ArrowLeft,
  Calendar,
  Layers,
} from 'lucide-react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { RealisationsGallery } from '@/components/artisans/RealisationsGallery';
import { RatingWidget } from '@/components/artisans/RatingWidget';
import { getArtisans, getArtisanById, formatArtisanRating } from '@/lib/artisans';

interface ArtisanPageProps {
  params: {
    id: string;
  };
}

// Generate static routes for all registered artisans at build time
export async function generateStaticParams() {
  const artisans = getArtisans();
  return artisans.map((artisan) => ({
    id: String(artisan.id),
  }));
}

// Generate contextual SEO metadata
export async function generateMetadata({ params }: ArtisanPageProps): Promise<Metadata> {
  const artisan = getArtisanById(params.id);
  if (!artisan) {
    return {
      title: 'Artisan Introuvable | Socofeb Décor',
    };
  }

  const title = `${artisan.fullName} — Artisan Socofeb Décor`;
  const description = `Découvrez le portfolio et les réalisations de ${artisan.fullName}, artisan ébéniste et menuisier partenaire SOCOFEB Décor. Agencements sur-mesure et mobilier contemporain.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: artisan.profile ? [{ url: artisan.profile }] : undefined,
    },
  };
}

export default function ArtisanDetailPage({ params }: ArtisanPageProps) {
  const artisan = getArtisanById(params.id);

  if (!artisan) {
    notFound();
  }

  const ratingInfo = formatArtisanRating(artisan.rating);
  const initials = [artisan.prenom?.[0], artisan.nom?.[0]].filter(Boolean).join('').toUpperCase() || 'AR';

  // Format WhatsApp message for direct artisan contact
  const artisanWhatsappUrl = artisan.phones.primary
    ? `https://wa.me/${artisan.phones.primary.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour ${artisan.fullName}, je vous contacte suite à la consultation de vos réalisations sur le site SOCOFEB Décor pour un projet d'agencement sur-mesure.`
      )}`
    : null;

  return (
    <div className="bg-bg-light min-h-screen">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-wood-dark border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Réalisations', href: '/realisations' },
              { label: artisan.fullName },
            ]}
          />
        </div>
      </div>

      {/* Back Link Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Link
          href="/realisations"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-light hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à tous les artisans &amp; réalisations
        </Link>
      </div>

      {/* Main Artisan Header Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-wood-border shadow-card relative overflow-hidden">
          
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 relative z-10">
            
            {/* Profile Avatar / Photograph */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-wood-border shadow-lg bg-wood-cream shrink-0">
              {artisan.profile ? (
                <Image
                  src={artisan.profile}
                  alt={artisan.fullName}
                  fill
                  priority
                  sizes="180px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-wood-cream to-wood-border/60 text-primary">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-heading font-black text-2xl shadow-sm text-primary mb-1">
                    {initials}
                  </div>
                  <span className="text-[11px] font-semibold text-charcoal-light flex items-center gap-1">
                    <Hammer className="w-3 h-3 text-accent" />
                    Artisan Partenaire
                  </span>
                </div>
              )}

              {/* Verified Badge */}
              <div className="absolute bottom-2 right-2 bg-accent text-wood-dark p-1.5 rounded-full shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Details & Contacts */}
            <div className="flex-1 text-center md:text-left space-y-4">
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
                  Artisan Agréé SOCOFEB
                </span>
                <span className="text-xs font-medium text-charcoal-light bg-wood-cream px-3 py-1 rounded-full border border-wood-border flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  {artisan.totalProjects} réalisation{artisan.totalProjects > 1 ? 's' : ''}
                </span>
              </div>

              {/* H1 Title */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                {artisan.fullName}
              </h1>

              {/* Rating Section (Guarantees NO "0.0 ★" when unrated) */}
              <div className="flex items-center justify-center md:justify-start gap-2">
                {ratingInfo.hasReviews ? (
                  <div className="flex items-center gap-2 bg-wood-cream px-3 py-1 rounded-xl border border-wood-border">
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
                  <span className="text-xs font-medium text-charcoal-light italic bg-wood-cream px-3 py-1 rounded-xl border border-wood-border">
                    Pas encore d&apos;avis
                  </span>
                )}
              </div>

              {/* Artisan Bio / Overview */}
              {artisan.bio && (
                <p className="text-charcoal-light text-sm sm:text-base max-w-2xl leading-relaxed">
                  {artisan.bio}
                </p>
              )}

              {/* Contact Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* Primary Phone */}
                {artisan.phones.primary && (
                  <a
                    href={`tel:${artisan.phones.primary}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    <span>{artisan.phones.primary}</span>
                  </a>
                )}

                {/* Secondary Phone if present */}
                {artisan.phones.secondary && (
                  <a
                    href={`tel:${artisan.phones.secondary}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary font-semibold text-xs transition-colors border border-wood-border"
                  >
                    <Phone className="w-3.5 h-3.5 text-charcoal-light" />
                    <span>{artisan.phones.secondary}</span>
                  </a>
                )}

                {/* Direct WhatsApp Quote Button */}
                {artisanWhatsappUrl && (
                  <a
                    href={artisanWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4 text-wood-dark" />
                    <span>WhatsApp direct</span>
                  </a>
                )}

                {/* Social Links */}
                {artisan.socials.facebook && (
                  <a
                    href={artisan.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook de l'artisan"
                    className="p-2.5 rounded-xl bg-wood-cream hover:bg-accent hover:text-wood-dark text-primary border border-wood-border transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}

                {artisan.socials.instagram && (
                  <a
                    href={artisan.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de l'artisan"
                    className="p-2.5 rounded-xl bg-wood-cream hover:bg-accent hover:text-wood-dark text-primary border border-wood-border transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <RealisationsGallery
        images={artisan.images}
        categories={artisan.categories}
        title={`Portfolio de réalisations — ${artisan.fullName}`}
        subtitle={`Découvrez les créations de ${artisan.fullName}. Filtrez par type de projet pour apprécier la précision des finitions.`}
        showArtisanBadge={false}
        artisanName={artisan.fullName}
        artisanPhone={artisan.phones.primary}
        id="artisan-portfolio-gallery"
      />

      {/* Visitor Rating Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <RatingWidget
          artisanId={artisan.id}
          initialRating={artisan.rating}
          artisanName={artisan.fullName}
        />
      </section>
    </div>
  );
}
