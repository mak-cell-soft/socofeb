// src/lib/seo.ts
// Production SEO Architecture & Metadata Source of Truth for SOCOFEB

import type { Metadata } from 'next';
import { COMPANY_INFO } from './catalog';

/**
 * Confirmed Canonical Production Domain
 * NEVER use socofeb.vercel.app or temporary domains for canonical/OG/Sitemap URLs.
 */
export const SITE_ORIGIN = 'https://www.socofeb-decor.com';

export const SEO_DEFAULTS = {
  siteName: 'SOCOFEB Tunisie',
  defaultTitle: 'SOCOFEB | Panneaux décoratifs et matériaux de décoration en Tunisie',
  titleTemplate: '%s | SOCOFEB Tunisie',
  defaultDescription:
    'SOCOFEB, spécialiste des panneaux décoratifs, bois massifs et matériaux de décoration en Tunisie. Nuanciers et collections officielles : Starwood, Panelia, AGT, Stibois, MPBS, Propann et Venni. Dépôts à Jâafer & Sidi Amor – Ariana.',
  locale: 'fr_TN',
  defaultOgImage: '/images/hero/hero-wood-workshop.webp',
  keywords: [
    'SOCOFEB',
    'panneaux décoratifs Tunisie',
    'panneaux bois Tunisie',
    'panneaux muraux Tunisie',
    'décoration intérieure Tunisie',
    'matériaux de décoration Tunisie',
    'décors bois',
    'panneaux décoratifs',
    'revêtements muraux',
    'matériaux pour décoration intérieure',
    'fournisseurs de panneaux décoratifs en Tunisie',
    'MDF stratifié',
    'MDF high gloss',
    'Starwood Tunisie',
    'Panelia Tunisie',
    'AGT Tunisie',
    'Stibois',
    'MPBS',
    'Propann',
    'Venni',
    'Ariana bois',
  ],
};

/**
 * Resolves a full canonical production URL
 */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Builds standard Open Graph, Twitter, and Alternate Canonical metadata
 */
export function constructMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const canonical = getCanonicalUrl(path);
  const metaTitle = title || SEO_DEFAULTS.defaultTitle;
  const metaDesc = description || SEO_DEFAULTS.defaultDescription;
  const ogImgUrl = image
    ? (image.startsWith('http') ? image : `${SITE_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`)
    : `${SITE_ORIGIN}${SEO_DEFAULTS.defaultOgImage}`;

  return {
    title: metaTitle,
    description: metaDesc,
    metadataBase: new URL(SITE_ORIGIN),
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonical,
      siteName: SEO_DEFAULTS.siteName,
      locale: SEO_DEFAULTS.locale,
      type: 'website',
      images: [
        {
          url: ogImgUrl,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: [ogImgUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Organization Schema.org Structured Data
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'SOCOFEB (Société Commerciale du Fer et du Bois)',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/images/ui/logo-socofeb.png`,
    description:
      'Spécialiste tunisien en bois massifs et panneaux dérivés MDF, panneaux décoratifs et matériaux pour agencement intérieur.',
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Route de Raoued Km 3, Jâafer',
      addressLocality: 'Ariana',
      addressCountry: 'TN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phone,
      contactType: 'sales',
      areaServed: 'TN',
      availableLanguage: ['French', 'Arabic'],
    },
  };
}

/**
 * WebSite Schema.org Structured Data with Site Search potential
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: 'SOCOFEB',
    description: SEO_DEFAULTS.defaultDescription,
    publisher: {
      '@id': `${SITE_ORIGIN}/#organization`,
    },
    inLanguage: 'fr-TN',
  };
}

/**
 * LocalBusiness Schema.org Structured Data with both Ariana locations
 */
export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': `${SITE_ORIGIN}/#localbusiness`,
    name: 'SOCOFEB — Vente de Panneaux Décoratifs & Bois Massifs',
    image: `${SITE_ORIGIN}/images/hero/hero-wood-workshop.webp`,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    url: SITE_ORIGIN,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Route de Raoued Km 3, Jâafer',
      addressLocality: 'Ariana',
      addressCountry: 'TN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.8833,
      longitude: 10.165,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:30',
        closes: '17:30',
      },
    ],
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'SOCOFEB Siège & Dépôt Principal Jâafer',
        telephone: COMPANY_INFO.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Route de Raoued Km 3, Jâafer',
          addressLocality: 'Ariana',
          addressCountry: 'TN',
        },
      },
      {
        '@type': 'LocalBusiness',
        name: 'SOCOFEB Point de Vente 2 Sidi Amor',
        telephone: COMPANY_INFO.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Route de Gammarth Km 9, Sidi Amor',
          addressLocality: 'Ariana',
          addressCountry: 'TN',
        },
      },
    ],
  };
}

/**
 * BreadcrumbList Schema.org Structured Data
 */
export function getBreadcrumbJsonLd(
  items: { name: string; path?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: getCanonicalUrl(item.path) } : {}),
    })),
  };
}

/**
 * Product Schema.org Structured Data for individual decors (only real data)
 */
export function getDecorProductJsonLd({
  name,
  description,
  image,
  brand,
  ref,
  path,
}: {
  name: string;
  description: string;
  image: string;
  brand: string;
  ref?: string | null;
  path: string;
}) {
  const fullImageUrl = image.startsWith('http')
    ? image
    : `${SITE_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: [fullImageUrl],
    url: getCanonicalUrl(path),
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    category: 'Panneaux décoratifs & matériaux de décoration',
    ...(ref ? { mpn: ref } : {}),
    offers: {
      '@type': 'Offer',
      url: getCanonicalUrl(path),
      priceCurrency: 'TND',
      price: '0.00',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'TND',
        valueAddedTaxIncluded: true,
      },
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': `${SITE_ORIGIN}/#organization`,
      },
    },
  };
}
