// src/app/promotions/page.tsx
/**
 * Promotions & Déstockage Usine — SOCOFEB
 *
 * Server-rendered page providing rich SEO metadata, Canonical tags, Open Graph,
 * and JSON-LD ItemList structured data. Delegates interactive filtering and
 * modal state to client-side PromotionsShowcase.
 */

import React from 'react';
import type { Metadata } from 'next';
import { PromotionsShowcase } from '@/components/promotions/PromotionsShowcase';
import { PROMOS_MANIFEST } from '@/lib/promos';
import { constructMetadata, SITE_ORIGIN } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Promotions & Déstockage Panneaux Bois | SOCOFEB Ariana',
  description:
    'Consultez nos remises exclusives sur les panneaux MDF, décors mélaminés, surfaces High Gloss et contreplaqués à nos dépôts de Jâafer et Sidi Amor à Ariana.',
  path: '/promotions',
});

export default function PromotionsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Promotions et Déstockage Panneaux Bois — SOCOFEB',
    description:
      'Offres promotionnelles et déstockage direct usine sur panneaux décoratifs MDF chez SOCOFEB Tunisie.',
    url: `${SITE_ORIGIN}/promotions`,
    numberOfItems: PROMOS_MANIFEST.totalPromotions,
    itemListElement: PROMOS_MANIFEST.promotions.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${item.name} (${item.discountLabel})`,
        image: `${SITE_ORIGIN}${item.encodedSrc}`,
        description: `Panneau décoratif ${item.name} en promotion de ${item.discountLabel} par ${item.supplierName}. Réf: ${item.ref || 'SOCOFEB'}.`,
        brand: {
          '@type': 'Brand',
          name: item.supplierName,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'TND',
          availability: 'https://schema.org/InStock',
          url: `${SITE_ORIGIN}/promotions`,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PromotionsShowcase initialManifest={PROMOS_MANIFEST} />
    </>
  );
}
