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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.socofeb.tn'),
  title: {
    default: 'SOCOFEB — Vente de Bois Massifs & Panneaux Dérivés (MDF, Contreplaqué, OSB) en Tunisie',
    template: '%s | SOCOFEB Tunisie',
  },
  description:
    'Société Commerciale du Fer et du Bois (SOCOFEB). Spécialiste tunisien en bois massifs (chêne, hêtre, bois rouge, blanc, acajou) et panneaux dérivés MDF, contreplaqué, OSB. Dépôts à Jâafer & Sidi Amor – Ariana.',
  keywords: [
    'SOCOFEB',
    'bois Tunisie',
    'MDF Tunisie',
    'bois massif Ariana',
    'STIBOIS',
    'MPBS',
    'PROPANN',
    'STARWOOD',
    'contreplaqué',
    'OSB',
    'chêne',
    'hêtre',
    'bois rouge',
    'bois blanc',
    'MDF stratifié',
    'MDF high gloss',
    'menuiserie Tunisie',
  ],
  authors: [{ name: 'SOCOFEB — Mohamed Amine KLABI' }],
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://www.socofeb.tn',
    title: 'SOCOFEB — L\'excellence du bois, à votre portée',
    description:
      'Vente et négoce de bois massifs et panneaux dérivés en Tunisie. Partenaire officiel STIBOIS, MPBS, PROPANN, STARWOOD. 2 dépôts à l\'Ariana.',
    siteName: 'SOCOFEB Tunisie',
    images: [
      {
        url: '/images/hero/hero-wood-workshop.webp',
        width: 1200,
        height: 630,
        alt: 'SOCOFEB Bois et Dérivés Tunisie',
      },
    ],
  },
  icons: {
    icon: '/images/ui/favicon.ico',
    shortcut: '/images/ui/favicon.ico',
    apple: '/images/ui/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org LocalBusiness with 2 branches
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SOCOFEB (Société Commerciale du Fer et du Bois)',
    image: 'https://www.socofeb.tn/images/hero/hero-wood-workshop.webp',
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    url: 'https://www.socofeb.tn',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Route de Raoued Km 3, Jâafer',
      addressLocality: 'Ariana',
      addressCountry: 'TN',
    },
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'SOCOFEB Siège & Dépôt Jâafer',
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
        name: 'SOCOFEB Point de Vente Sidi Amor',
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

  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
