import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { PromoSection } from '@/components/sections/PromoSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductsSection />
      <PartnersSection />
      <PromoSection />
      <GallerySection />
      <ContactSection />
    </>
  );
}
