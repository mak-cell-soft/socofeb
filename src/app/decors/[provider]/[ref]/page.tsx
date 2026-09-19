import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { SUPPLIER_CONFIG, COMPANY_INFO } from '@/lib/catalog';
import { Supplier, SUPPLIERS } from '@/types/image';
import {
  findDecorByRef,
  getAllIndexableDecors,
  extractDecorName,
  extractDecorReference,
  getDecorUrl,
  getDecorAltText,
} from '@/lib/decors';
import { getDynamicDecors } from '@/lib/images';
import {
  constructMetadata,
  getBreadcrumbJsonLd,
  getDecorProductJsonLd,
  SITE_ORIGIN,
} from '@/lib/seo';
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Phone,
  Layers,
  Sparkles,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface Props {
  params: {
    provider: string;
    ref: string;
  };
}

/**
 * Pre-renders all valid decor pages at build time
 */
export function generateStaticParams() {
  const indexable = getAllIndexableDecors();
  return indexable.map((item) => ({
    provider: item.supplier,
    ref: item.ref,
  }));
}

/**
 * Generates dynamic SEO metadata for each decor
 */
export function generateMetadata({ params }: Props): Metadata {
  const providerKey = params.provider.toLowerCase() as Supplier;
  const supplier = SUPPLIER_CONFIG[providerKey];
  const decor = findDecorByRef(params.provider, params.ref);

  if (!supplier || !decor) {
    return { title: 'Décor non trouvé | SOCOFEB' };
  }

  const decorName = decor.name ? extractDecorName(decor.name) : extractDecorName(decor.filename);
  const decorRef = decor.ref || params.ref;

  const title = `${supplier.name} Décor ${decorName ? `${decorName} ` : ''}(Réf. ${decorRef}) | Panneau décoratif`;
  const description = `Découvrez le décor ${supplier.name} référence ${decorRef}${decorName ? ` (${decorName})` : ''} chez SOCOFEB, spécialiste des panneaux décoratifs et matériaux de décoration en Tunisie. Disponible en stock à Ariana.`;

  return constructMetadata({
    title,
    description,
    path: `/decors/${params.provider}/${encodeURIComponent(params.ref)}`,
    image: decor.src,
  });
}

export default function DecorDetailPage({ params }: Props) {
  const providerKey = params.provider.toLowerCase() as Supplier;
  const supplier = SUPPLIER_CONFIG[providerKey];
  const decor = findDecorByRef(params.provider, params.ref);

  if (!supplier || !decor) {
    notFound();
  }

  const decorName = decor.name ? extractDecorName(decor.name) : extractDecorName(decor.filename);
  const decorRef = decor.ref || params.ref;
  const altText = getDecorAltText(supplier.name, decorName, decorRef);

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: 'Fournisseurs', href: '/providers' },
    { label: supplier.name, href: `/providers/${providerKey}` },
    { label: `Réf. ${decorRef}` },
  ];

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Fournisseurs', path: '/providers' },
    { name: supplier.name, path: `/providers/${providerKey}` },
    { name: `Décor Réf. ${decorRef}`, path: `/decors/${providerKey}/${encodeURIComponent(params.ref)}` },
  ]);

  const productJsonLd = getDecorProductJsonLd({
    name: `${supplier.name} ${decorName} (Réf. ${decorRef})`,
    description: `Panneau décoratif ${supplier.name} référence ${decorRef} distribué par SOCOFEB en Tunisie.`,
    image: decor.src,
    brand: supplier.name,
    ref: decorRef,
    path: `/decors/${providerKey}/${encodeURIComponent(params.ref)}`,
  });

  // Get related decors from the same provider (excluding current one)
  const allProviderDecors = getDynamicDecors(providerKey);
  const relatedDecors = allProviderDecors
    .filter((d) => {
      const dRef = d.ref || extractDecorReference(d.filename);
      return dRef && dRef.toLowerCase() !== decorRef.toLowerCase();
    })
    .slice(0, 6);

  // Pre-filled WhatsApp inquiry message
  const whatsappMessage = encodeURIComponent(
    `Bonjour SOCOFEB, je souhaite obtenir des informations et un devis pour le décor ${supplier.name} référence ${decorRef}${decorName ? ` (${decorName})` : ''}.`
  );
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-8 sm:py-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Decor Detail Main Showcase Card */}
        <div className="bg-white rounded-3xl border border-wood-border shadow-card overflow-hidden my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* High-Resolution Photographic Display */}
            <div className="lg:col-span-7 bg-[#1A1107] relative min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] flex items-center justify-center p-6 sm:p-10 overflow-hidden">
              <div className="relative w-full h-full min-h-[340px] sm:min-h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image
                  src={decor.src}
                  alt={altText}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>

              {/* Reference Badge on visual */}
              {decorRef && (
                <div className="absolute bottom-10 right-10 z-10">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/25 text-sm sm:text-base font-mono font-bold tracking-wider text-white shadow-lg">
                    Réf. {decorRef}
                  </span>
                </div>
              )}
            </div>

            {/* Structured Specifications & Information */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Brand pill and verified partner badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <Link
                    href={`/providers/${providerKey}`}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-xs"
                    style={{ backgroundColor: supplier.color }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    {supplier.name}
                  </Link>

                  <span className="text-[11px] font-semibold text-charcoal-light bg-wood-cream/80 border border-wood-border px-2.5 py-1 rounded-lg">
                    {supplier.badgeText || 'Importation Directe'}
                  </span>
                </div>

                {/* Main Decor Heading */}
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                  {decorName || `Décor ${decorRef}`}
                </h1>

                <div className="flex items-center gap-2 mt-2 font-mono text-sm text-accent font-semibold">
                  <span>Référence catalogue :</span>
                  <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-wood-dark font-bold">
                    {decorRef}
                  </span>
                </div>

                {/* Real Verified Information Box */}
                <div className="mt-6 space-y-3 bg-[#FAF6EE] p-4 sm:p-5 rounded-2xl border border-wood-border">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div className="text-xs text-charcoal leading-relaxed">
                      <strong className="text-primary font-bold">Fournisseur Officiel : </strong>
                      {supplier.fullName}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div className="text-xs text-charcoal leading-relaxed">
                      <strong className="text-primary font-bold">Usage Recommandé : </strong>
                      Revêtement mural décoratif, agencement intérieur, mobilier, façades de cuisine et placards.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div className="text-xs text-charcoal leading-relaxed">
                      <strong className="text-primary font-bold">Disponibilité : </strong>
                      Stock permanent disponible dans nos dépôts d&apos;Ariana (Jâafer &amp; Sidi Amor).
                    </div>
                  </div>
                </div>

                {/* Provider short context */}
                <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed mt-5">
                  {supplier.description}
                </p>
              </div>

              {/* Inquiry & Action CTA Section */}
              <div className="pt-8 border-t border-gray-100 mt-8 space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.02]"
                >
                  <MessageSquare className="w-4 h-4" />
                  Demander un devis sur WhatsApp
                </a>

                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-wood-cream hover:bg-wood-border text-primary font-bold text-xs uppercase tracking-wider border border-wood-border transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-accent" />
                  Appeler ({COMPANY_INFO.phoneDisplay})
                </a>

                <div className="flex items-center justify-between pt-3 text-[11px] text-charcoal-light">
                  <Link
                    href={`/providers/${providerKey}`}
                    className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Tous les décors {supplier.name}
                  </Link>
                  <Link
                    href="/#nuancier"
                    className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
                  >
                    Nuancier complet
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Decors from the same Provider */}
        {relatedDecors.length > 0 && (
          <div className="my-16 bg-white rounded-3xl p-6 sm:p-8 border border-wood-border shadow-card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">
                  Autres Décors de la Collection {supplier.name}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-1">
                  Explorez les autres références complémentaires certifiées {supplier.name}.
                </p>
              </div>

              <Link
                href={`/providers/${providerKey}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
              >
                Voir tout ({allProviderDecors.length}) &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {relatedDecors.map((rel) => {
                const relRef = rel.ref || extractDecorReference(rel.filename);
                const relName = rel.name ? extractDecorName(rel.name) : extractDecorName(rel.filename);
                const relUrl = getDecorUrl(providerKey, relRef);
                const relAlt = getDecorAltText(supplier.name, relName, relRef);

                if (!relUrl) return null;

                return (
                  <Link
                    key={rel.filename}
                    href={relUrl}
                    className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-wood-border/80 hover:border-accent/60 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                      <Image
                        src={rel.src}
                        alt={relAlt}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {relRef && (
                        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold tracking-wider text-white shadow-sm">
                            {relRef}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white border-t border-gray-100 flex flex-col justify-between flex-1">
                      <p className="font-heading font-semibold text-xs text-primary group-hover:text-accent transition-colors truncate">
                        {relName}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-charcoal-light">
                        <span>{supplier.name}</span>
                        <span className="font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                          Fiche &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
