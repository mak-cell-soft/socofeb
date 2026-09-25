// src/app/realisations/page.tsx
/**
 * @file page.tsx
 * @description Main Artisans Menuisiers & Réalisations hub for Socofeb Décor.
 *
 * SEO Architecture:
 * - Canonical: https://www.socofeb-decor.com/realisations
 * - Optimized Title & Meta Description targeting menuiserie, agencement, ameublement sur-mesure.
 * - Semantic HTML5 hierarchy: exactly one H1 in Hero, followed by logical H2 & H3 sections.
 * - BreadcrumbList and CollectionPage Schema.org JSON-LD structured data.
 * - Natural French & Arabic semantic keywords (نجار, نجارة حسب الطلب, أثاث على المقاس).
 * - Contextual internal links to product categories (MDF, Bois massif, Fournisseurs, Contact).
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Layers,
  DoorClosed,
  Bath,
  Armchair,
  CheckCircle2,
  PhoneCall,
  Compass,
} from 'lucide-react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ArtisanHero } from '@/components/artisans/ArtisanHero';
import { ArtisanGrid } from '@/components/artisans/ArtisanGrid';
import { RealisationsGallery } from '@/components/artisans/RealisationsGallery';
import { getArtisans, getAllProjectImages, getAllGlobalCategories } from '@/lib/artisans';
import { SITE_ORIGIN } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Réalisations de Menuiserie & Ameublement sur Mesure | Socofeb Décor',
  description:
    "Découvrez nos réalisations de menuiserie sur mesure en Tunisie : cuisines modernes, dressings d'angle, portes intérieures et mobilier personnalisé par nos artisans menuisiers partenaires SOCOFEB.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: `${SITE_ORIGIN}/realisations`,
  },
  openGraph: {
    title: 'Réalisations de Menuiserie & Ameublement sur Mesure | Socofeb Décor',
    description:
      "Explorez le portfolio de nos artisans menuisiers en Tunisie : cuisines équipées, dressings architecturaux, portes et mobilier d'art façonnés avec les panneaux et bois nobles SOCOFEB.",
    url: `${SITE_ORIGIN}/realisations`,
    siteName: 'SOCOFEB Tunisie',
    locale: 'fr_TN',
    type: 'website',
    images: [
      {
        url: `${SITE_ORIGIN}/images/realisations/images/2/cuisines/cuis5.jpeg`,
        width: 1200,
        height: 800,
        alt: 'Réalisations de menuiserie et ameublement sur mesure — SOCOFEB Décor Tunisie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Réalisations de Menuiserie & Ameublement sur Mesure | Socofeb Décor',
    description:
      'Cuisines, dressings, mobilier et portes sur mesure réalisés en Tunisie avec les matériaux SOCOFEB.',
    images: [`${SITE_ORIGIN}/images/realisations/images/2/cuisines/cuis5.jpeg`],
  },
};

export default function RealisationsPage() {
  // Load artisans, all project photos, and dynamically discovered categories
  const artisans = getArtisans();
  const allImages = getAllProjectImages();
  const globalCategories = getAllGlobalCategories();

  // 1. Breadcrumb Structured Data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Réalisations de Menuiserie',
        item: `${SITE_ORIGIN}/realisations`,
      },
    ],
  };

  // 2. CollectionPage Structured Data
  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_ORIGIN}/realisations/#webpage`,
    url: `${SITE_ORIGIN}/realisations`,
    name: 'Réalisations de Menuiserie & Ameublement sur Mesure | Socofeb Décor',
    description:
      'Découvrez nos réalisations de menuiserie sur mesure en Tunisie : cuisines équipées contemporaines, dressings architecturaux, portes intérieures et mobilier sur mesure par nos artisans menuisiers partenaires SOCOFEB.',
    inLanguage: ['fr-TN', 'ar-TN'],
    about: [
      {
        '@type': 'Thing',
        name: 'Menuiserie sur mesure',
      },
      {
        '@type': 'Thing',
        name: 'Aménagement intérieur',
      },
      {
        '@type': 'Thing',
        name: 'Ameublement sur mesure',
      },
      {
        '@type': 'Thing',
        name: 'نجارة حسب الطلب',
      },
      {
        '@type': 'Thing',
        name: 'أثاث على المقاس',
      },
    ],
    provider: {
      '@type': 'HomeGoodsStore',
      name: 'SOCOFEB Décor',
      telephone: '+216 99 218 866',
      url: SITE_ORIGIN,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Route de Raoued Km 3, Jâafer',
        addressLocality: 'Ariana',
        addressCountry: 'TN',
      },
    },
  };

  return (
    <div className="bg-bg-light min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-wood-dark border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Réalisations de Menuiserie' }]} />
        </div>
      </div>

      {/* 1. Hero Section (Contains H1) */}
      <ArtisanHero
        totalProjects={allImages.length}
        totalArtisans={artisans.length}
      />

      {/* 2. Natural Contextual SEO Introduction */}
      <section className="py-12 sm:py-16 bg-white border-b border-wood-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>L&apos;excellence du bois en Tunisie · إبداع النجارة والتأثيث حسب الطلب</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-snug">
                Savoir-faire artisanal &amp; matériaux nobles : la menuiserie sur mesure par SOCOFEB
              </h2>

              <p className="text-sm sm:text-base text-charcoal leading-relaxed">
                Spécialiste de la distribution de <Link href="/produits/bois" className="font-semibold text-primary underline decoration-accent hover:text-accent transition-colors">bois massifs</Link> et de <Link href="/produits/mdf" className="font-semibold text-primary underline decoration-accent hover:text-accent transition-colors">panneaux dérivés MDF &amp; stratifiés</Link> en Tunisie, <strong>SOCOFEB Décor</strong> accompagne les particuliers, architectes et décorateurs dans tous leurs projets d&apos;<strong>aménagement intérieur</strong> et d&apos;<strong>ameublement sur mesure</strong>.
              </p>

              <p className="text-sm sm:text-base text-charcoal-light leading-relaxed">
                Cette galerie met en lumière le travail d&apos;exception de nos <strong>artisans menuisiers partenaires</strong> (comme <strong className="text-primary">Racine Cuisine</strong> et <strong className="text-primary">l&apos;Atelier SIFFI</strong>). De la <strong>cuisine contemporaine</strong> au <strong>dressing architectural</strong>, en passant par les <strong>portes d&apos;intérieur</strong> et le <strong>mobilier design</strong>, chaque projet est façonné avec précision pour répondre aux exigences esthétiques et fonctionnelles les plus strictes (<em>نجار محترف وتأثيث عصري حسب الطلب</em>).
              </p>
            </div>

            <div className="lg:col-span-4 bg-wood-cream rounded-3xl p-6 sm:p-8 border border-wood-border/80 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>Nos engagements qualité</span>
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm text-charcoal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>Matériaux certifiés :</strong> Bois nobles séchés et panneaux MDF de grandes marques (<Link href="/providers" className="text-accent hover:underline">Starwood, Panelia, AGT</Link>).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>Maîtrise technique :</strong> Artisans qualifiés maîtrisant les finitions d&apos;ébénisterie et l&apos;agencement complexe.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span><strong>Accompagnement local :</strong> Dépôts à Jâafer &amp; Sidi Amor (Ariana), livraison et mise en relation directe.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-accent" />
                  <span>Contacter nos conseillers</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Anchor Target for Hero Exploration CTA */}
      <div id="exploration-section" />

      {/* 3. Section A: Discover by Artisan Menuisier */}
      <ArtisanGrid
        artisans={artisans}
        availableCategories={globalCategories}
      />

      {/* 4. Section B: Discover by Project / Category */}
      <RealisationsGallery
        images={allImages}
        categories={globalCategories}
        title="Galerie des réalisations de menuiserie"
        subtitle="Explorez nos projets sur mesure par catégorie : cuisines modernes, dressings épurés, mobilier architectural et portes d'exception réalisés avec les panneaux SOCOFEB."
        showArtisanBadge={true}
        id="realisations-gallery"
      />

      {/* 5. Semantic Domains of Expertise & Internal Linking Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-wood-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
              Domaines d&apos;Intervention · اختصاصات النجارة
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mt-3 mb-3">
              Nos domaines d&apos;expertise en aménagement et menuiserie sur mesure
            </h2>
            <p className="text-charcoal-light text-base sm:text-lg">
              De l&apos;étude de vos plans jusqu&apos;à la pose finale, nos artisans partenaires conçoivent des solutions adaptées à chaque pièce de votre intérieur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Domain 1: Cuisines sur mesure */}
            <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-8 border border-wood-border hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-wood-border flex items-center justify-center text-accent mb-5 shadow-sm">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Cuisines sur mesure contemporaines
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  مطابخ على المقاس وتصميم عصري
                </p>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  Conception d&apos;îlots centraux, meubles de cuisine ergonomiques, rétro-éclairage intégré et plans de travail résistants. Finitions soignées en <Link href="/produits/mdf" className="text-primary font-medium underline decoration-accent hover:text-accent">panneaux MDF stratifiés</Link> pour un style contemporain et durable.
                </p>
              </div>
              <div className="pt-6 border-t border-wood-border/60 mt-6">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>Projets documentés :</span>
                  <span className="text-accent font-mono font-bold">16+ cuisines réelles</span>
                </span>
              </div>
            </div>

            {/* Domain 2: Dressings & Rangements */}
            <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-8 border border-wood-border hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-wood-border flex items-center justify-center text-accent mb-5 shadow-sm">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Dressings architecturaux &amp; rangements
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  غرف ملابس وخزائن حسب الطلب
                </p>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  Optimisation complète de l&apos;espace : dressings d&apos;angle, placards intégrés, penderies modulaires et tiroirs à fermeture amortie. Alliance de bois chaleureux et d&apos;agencements sur mesure pour suites parentales et chambres.
                </p>
              </div>
              <div className="pt-6 border-t border-wood-border/60 mt-6">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>Projets documentés :</span>
                  <span className="text-accent font-mono font-bold">35+ dressings installés</span>
                </span>
              </div>
            </div>

            {/* Domain 3: Mobilier sur mesure */}
            <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-8 border border-wood-border hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-wood-border flex items-center justify-center text-accent mb-5 shadow-sm">
                  <Armchair className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Mobilier &amp; ameublement sur mesure
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  أثاث مخصص وصناعة الأثاث الخشبي
                </p>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  Fabrication de meubles TV suspendus, claustras de séparation, bibliothèques murales, tables et bureaux de direction. Sélection des panneaux de nos <Link href="/providers" className="text-primary font-medium underline decoration-accent hover:text-accent">marques partenaires officielles</Link>.
                </p>
              </div>
              <div className="pt-6 border-t border-wood-border/60 mt-6">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>Projets documentés :</span>
                  <span className="text-accent font-mono font-bold">39+ meubles d&apos;exception</span>
                </span>
              </div>
            </div>

            {/* Domain 4: Portes intérieures */}
            <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-8 border border-wood-border hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-wood-border flex items-center justify-center text-accent mb-5 shadow-sm">
                  <DoorClosed className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Menuiserie de portes intérieures
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  أبواب خشبية داخلية على المقاس
                </p>
                <p className="text-sm text-charcoal-light leading-relaxed">
                  Fabrication et pose de portes battantes ou coulissantes sur mesure. Utilisation de <Link href="/produits/bois" className="text-primary font-medium underline decoration-accent hover:text-accent">bois massifs nobles</Link> (chêne, hêtre, bois rouge) et panneaux placage pour une isolation phonique et une esthétique raffinée.
                </p>
              </div>
              <div className="pt-6 border-t border-wood-border/60 mt-6">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>Projets documentés :</span>
                  <span className="text-accent font-mono font-bold">16+ portes posées</span>
                </span>
              </div>
            </div>

            {/* Domain 5: Salles de bain & Projets pro */}
            <div className="bg-wood-cream/50 rounded-3xl p-6 sm:p-8 border border-wood-border hover:border-accent/40 transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-wood-border flex items-center justify-center text-accent mb-5 shadow-sm">
                  <Bath className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary mb-2">
                  Salles de bain &amp; agencements professionnels
                </h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                  تهيئة غرف الاستحمام والمحلات والمكاتب
                </p>
                <p className="text-sm text-charcoal-light leading-relaxed max-w-2xl">
                  Meubles sous-vasques hydrofuges, rangements sur mesure pour pièces humides, banques d&apos;accueil et aménagements de commerces ou bureaux en Tunisie. Nos menuisiers calculent et exécutent vos agencements avec un sens aiguisé du détail.
                </p>
              </div>
              <div className="pt-6 border-t border-wood-border/60 mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-bold text-primary">
                  Étude de faisabilité &amp; choix des panneaux adaptés
                </span>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-primary transition-colors"
                >
                  <span>Demander un conseil technique</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Closing Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-wood-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Donnez vie à vos projets sur mesure</span>
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Vous recherchez un artisan menuisier qualifié en Tunisie ?
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Venez découvrir nos collections de panneaux et essences de bois dans nos dépôts de Jâafer et Sidi Amor (Ariana), ou contactez directement nos partenaires pour un devis personnalisé.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-glow transition-all duration-300 hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-wood-dark" />
              <span>Demander un devis &amp; mise en relation</span>
            </Link>

            <Link
              href="/produits/mdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/20 transition-all duration-300"
            >
              <span>Découvrir nos panneaux MDF &amp; décors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
