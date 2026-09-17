import React from 'react';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { GallerySection } from '@/components/sections/GallerySection';

export const metadata: Metadata = {
  title: 'Réalisations & Mises en Situation — Projets SOCOFEB',
  description:
    'Découvrez les réalisations en bois massifs et panneaux MDF SOCOFEB : agencements sur-mesure, cuisines modernes, dressings et charpentes en Tunisie.',
};

export default function RealisationsPage() {
  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Réalisations' }]} />
      </div>
      <GallerySection />
    </div>
  );
}
