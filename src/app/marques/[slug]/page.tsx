import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { ProductCard } from '@/components/ui/ProductCard';
import { PromoCard } from '@/components/ui/PromoCard';
import { SUPPLIER_CONFIG, PRODUCT_CATEGORIES } from '@/lib/catalog';
import { PROMO_IMAGES } from '@/lib/images';
import { Supplier, SUPPLIERS } from '@/types/image';
import { MDFProduct } from '@/types/product';
import { ExternalLink, CheckCircle, Tag, Layers, ArrowRight } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return SUPPLIERS.map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const supplier = SUPPLIER_CONFIG[params.slug as Supplier];
  if (!supplier) return { title: 'Marque non trouvée' };

  return {
    title: `${supplier.name} — Panneaux & Décors en Tunisie`,
    description: `Découvrez tous les produits et décors de la marque ${supplier.fullName} disponibles chez SOCOFEB à Ariana.`,
  };
}

export default function SupplierDetailPage({ params }: Props) {
  const slug = params.slug as Supplier;
  const supplier = SUPPLIER_CONFIG[slug];

  if (!supplier) notFound();

  // Find all products from this supplier
  const mdfCat = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  const supplierProducts = (mdfCat?.products || []).filter((p) =>
    (p as MDFProduct).suppliers?.includes(slug)
  );

  const promos = PROMO_IMAGES[slug] || [];

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Marques', href: '/marques' },
            { label: supplier.name },
          ]}
        />

        {/* Brand Hero Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card my-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-wood-border">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-wood-cream border border-wood-border p-3 flex items-center justify-center shrink-0">
                <Image
                  src={supplier.logo}
                  alt={`Logo ${supplier.name}`}
                  width={90}
                  height={50}
                  className="object-contain"
                />
              </div>

              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm inline-block mb-2"
                  style={{ backgroundColor: supplier.color }}
                >
                  {supplier.badgeText || 'Partenaire Industriel'}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
                  {supplier.fullName}
                </h1>
              </div>
            </div>

            <a
              href={supplier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary text-xs font-bold uppercase tracking-wider transition-all border border-wood-border self-start md:self-auto"
            >
              Site Officiel {supplier.name}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <p className="md:col-span-8 text-charcoal-light text-sm sm:text-base leading-relaxed">
              {supplier.description}
            </p>

            <div className="md:col-span-4 bg-wood-cream/60 p-4 rounded-2xl border border-wood-border">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
                Collections phares :
              </span>
              <div className="space-y-1 text-xs text-charcoal">
                {supplier.collections.map((col) => (
                  <div key={col} className="flex items-center gap-1.5 font-medium">
                    <CheckCircle
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: supplier.color }}
                    />
                    <span>{col}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Products */}
        {supplierProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-primary">
                Produits {supplier.name} en Stock ({supplierProducts.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplierProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categorySlug="/produits/mdf"
                />
              ))}
            </div>
          </div>
        )}

        {/* Supplier Decors Grid */}
        <div className="mb-16">
          <DecorGrid
            initialSupplier={slug}
            showFilters={false}
            title={`Nuancier Décors ${supplier.name}`}
            subtitle={`Explorez la totalité des teintes et finitions de ${supplier.name} disponibles immédiatement en entrepôt`}
          />
        </div>

        {/* Supplier Promos */}
        {promos.length > 0 && (
          <div className="mb-16 bg-white rounded-3xl p-8 border border-wood-border shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-red-600" />
              <h2 className="font-heading text-2xl font-bold text-primary">
                Promotions {supplier.name} en Cours
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((p) => (
                <PromoCard key={p.file} promo={p} supplier={slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
