import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Catalogue des Produits Bois & Panneaux',
  description:
    'Consultez l\'intégralité du catalogue SOCOFEB : Bois massifs, MDF brut et stratifié, contreplaqué WBP, panneaux OSB/3. Stock permanent à Ariana.',
};

export default function ProduitsGeneralPage() {
  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Produits' }]} />

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto my-8 sm:my-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Stock &amp; Distribution
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            Catalogue Général SOCOFEB
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Découvrez nos 4 grandes familles de matériaux destinées aux menuisiers, architectes et professionnels du bâtiment : essences de bois nobles et résineuses, panneaux MDF bruts et décoratifs, contreplaqués techniques et panneaux OSB/3.
          </p>
        </div>

        {/* Category Blocks */}
        <div className="space-y-16">
          {PRODUCT_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-wood-border mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-wood-cream border border-wood-border">
                    {category.icon}
                  </span>
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                      {category.label}
                    </h2>
                    <p className="text-charcoal-light text-xs sm:text-sm mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={category.slug}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-wood-cream hover:bg-accent hover:text-wood-dark text-primary text-xs font-bold uppercase tracking-wider transition-all border border-wood-border self-start sm:self-center"
                >
                  Voir la catégorie
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sub-products grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.products.map((prod) => {
                  const detailUrl = `${category.slug}/${prod.slug}`;
                  const imageSrc = `${prod.imagePath}${prod.coverImage}`;

                  return (
                    <Link
                      key={prod.id}
                      href={detailUrl}
                      className="group bg-wood-cream/40 rounded-2xl overflow-hidden border border-wood-border hover:border-secondary transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-wood-dark">
                        <Image
                          src={imageSrc}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {'decors' in prod && prod.decors && (
                          <div className="absolute top-2 right-2 bg-accent text-wood-dark font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Décors
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-primary group-hover:text-secondary transition-colors mb-1">
                            {prod.name}
                          </h3>
                          <p className="text-charcoal-light text-xs line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-wood-border flex items-center justify-between text-xs font-bold text-primary group-hover:text-secondary">
                          <span>Fiche produit</span>
                          <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
