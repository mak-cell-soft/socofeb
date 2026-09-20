import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { COMPANY_INFO } from '@/lib/catalog';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

import {
  SITE_ORIGIN,
  SEO_DEFAULTS,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
  getLocalBusinessJsonLd,
} from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SEO_DEFAULTS.defaultTitle,
    template: SEO_DEFAULTS.titleTemplate,
  },
  description: SEO_DEFAULTS.defaultDescription,
  keywords: SEO_DEFAULTS.keywords,
  authors: [{ name: 'SOCOFEB — Mohamed Amine KLABI' }],
  openGraph: {
    type: 'website',
    locale: SEO_DEFAULTS.locale,
    url: SITE_ORIGIN,
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.defaultDescription,
    siteName: SEO_DEFAULTS.siteName,
    images: [
      {
        url: `${SITE_ORIGIN}/images/hero/hero-wood-workshop.webp`,
        width: 1200,
        height: 630,
        alt: 'SOCOFEB — Panneaux Décoratifs & Bois Massifs en Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_DEFAULTS.defaultTitle,
    description: SEO_DEFAULTS.defaultDescription,
    images: [`${SITE_ORIGIN}/images/hero/hero-wood-workshop.webp`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = getOrganizationJsonLd();
  const webSiteJsonLd = getWebSiteJsonLd();
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-charcoal bg-[#FAF6EE]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
