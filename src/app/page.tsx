import React from 'react';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { PromoSection } from '@/components/sections/PromoSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'SOCOFEB | Panneaux décoratifs et matériaux de décoration en Tunisie',
  description:
    'SOCOFEB, spécialiste des panneaux décoratifs, bois massifs et matériaux de décoration en Tunisie. Découvrez nos collections exclusives : Starwood, Panelia, AGT, Stibois, MPBS, Propann et Venni. Stock direct à Ariana.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <DecorGrid
        title="Nuancier &amp; Galerie des Décors"
        subtitle="Sélectionnez une marque pour explorer nos teintes bois, textures minérales et finitions contemporaines en stock permanent"
      />
      <ProductsSection />
      <PartnersSection />
      <PromoSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}
