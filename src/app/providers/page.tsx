import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { Supplier } from '@/types/image';
import { ExternalLink, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { constructMetadata, getBreadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Fournisseurs de Panneaux Décoratifs en Tunisie — Starwood, Panelia, AGT, Stibois | SOCOFEB',
  description:
    'Découvrez les fabricants et fournisseurs officiels de panneaux décoratifs partenaires de SOCOFEB en Tunisie : Starwood, Panelia, AGT, Stibois, MPBS, Propann et Venni.',
  path: '/providers',
});

export default function ProvidersIndexPage() {
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Fournisseurs', path: '/providers' },
  ]);

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Fournisseurs' }]} />

        {/* Page Header */}
        <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Réseau Industriel &amp; Importations Directes
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-2 mb-4">
            Nos Fournisseurs de Panneaux Décoratifs
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Pour répondre aux exigences des chantiers et des agencements intérieurs les plus prestigieux en Tunisie, SOCOFEB collabore avec les industriels et fabricants de référence : Starwood, Panelia, AGT, Stibois, MPBS, Propann et Venni.
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {(Object.entries(SUPPLIER_CONFIG) as [Supplier, typeof SUPPLIER_CONFIG[Supplier]][]).map(
            ([slug, sup]) => (
              <div
                key={slug}
                className="bg-white rounded-3xl p-8 border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-xs font-extrabold uppercase px-3 py-1 rounded-full text-white shadow-sm"
                      style={{ backgroundColor: sup.color }}
                    >
                      {sup.badgeText || 'Partenaire Industriel'}
                    </span>
                    {sup.website && (
                      <a
                        href={sup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-500 hover:text-primary flex items-center gap-1"
                      >
                        Site officiel <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-wood-cream border border-wood-border p-2 flex items-center justify-center shrink-0">
                      <Image
                        src={sup.logo}
                        alt={`Logo ${sup.name}`}
                        width={70}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-primary">
                        {sup.name}
                      </h2>
                      <p className="text-xs text-secondary font-medium">
                        {sup.fullName}
                      </p>
                    </div>
                  </div>

                  <p className="text-charcoal-light text-sm leading-relaxed mb-6">
                    {sup.description}
                  </p>

                  {sup.collections && sup.collections.length > 0 && (
                    <div className="space-y-2 mb-8 bg-wood-cream/50 p-4 rounded-xl border border-wood-border">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                        Collections phares disponibles :
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {sup.collections.map((col) => (
                          <div
                            key={col}
                            className="flex items-center gap-1.5 text-xs text-charcoal"
                          >
                            <CheckCircle
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: sup.color }}
                            />
                            <span className="truncate">{col}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-wood-border flex items-center justify-between">
                  <Link
                    href={`/providers/${slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Voir le catalogue {sup.name}
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
