// src/app/realisations/page.tsx
/**
 * @file page.tsx
 * @description Main Artisans & Réalisations hub for Socofeb Décor.
 *
 * Page Architecture:
 * - Server component fetching pre-compiled and synchronized artisan and project manifests.
 * - Dual-journey exploration:
 *   Option A: Discover craftspeople ("Nos artisans") with name search & specialty filters.
 *   Option B: Discover project decors ("Nos réalisations") with dynamic category tabs & fullscreen lightbox.
 * - Semantic SEO hierarchy (H1, H2) and descriptive meta tags.
 */

import React from 'react';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ArtisanHero } from '@/components/artisans/ArtisanHero';
import { ArtisanGrid } from '@/components/artisans/ArtisanGrid';
import { RealisationsGallery } from '@/components/artisans/RealisationsGallery';
import { getArtisans, getAllProjectImages, getAllGlobalCategories } from '@/lib/artisans';

export const metadata: Metadata = {
  title: 'Artisans & Réalisations | Socofeb Décor',
  description:
    "Découvrez les réalisations de nos artisans en cuisine, dressing, portes et meubles sur mesure. Explorez leurs travaux et choisissez l'artisan adapté à votre projet.",
  openGraph: {
    title: 'Artisans & Réalisations | Socofeb Décor',
    description:
      "Explorez les réalisations de nos artisans partenaires : dressings, meubles contemporains, cuisines et portes d'intérieur sur-mesure.",
    type: 'website',
  },
};

export default function RealisationsPage() {
  // Load artisans, all project photos, and dynamically discovered categories
  const artisans = getArtisans();
  const allImages = getAllProjectImages();
  const globalCategories = getAllGlobalCategories();

  return (
    <div className="bg-bg-light min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-wood-dark border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Réalisations' }]} />
        </div>
      </div>

      {/* 1. Hero Section */}
      <ArtisanHero
        totalProjects={allImages.length}
        totalArtisans={artisans.length}
      />

      {/* Anchor Target for Hero Exploration CTA */}
      <div id="exploration-section" />

      {/* 2. Option A: Discover by Artisan */}
      <ArtisanGrid
        artisans={artisans}
        availableCategories={globalCategories}
      />

      {/* 3. Option B: Discover by Project / Category */}
      <RealisationsGallery
        images={allImages}
        categories={globalCategories}
        title="Nos réalisations"
        subtitle="Explorez les styles et matières : dressings épurés, mobilier architectural et menuiseries d'exception réalisés avec les panneaux SOCOFEB."
        showArtisanBadge={true}
        id="realisations-gallery"
      />
    </div>
  );
}
