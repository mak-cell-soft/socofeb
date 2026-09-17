import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductCard } from '@/components/ui/ProductCard';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { SolidWoodProduct } from '@/types/product';
import { TreePine, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bois Massifs — Chêne, Hêtre, Bois Rouge, Bois Blanc, Acajou en Tunisie',
  description:
    'Vente de bois massifs nobles et résineux en plots, avivés et chevrons. Chêne, Hêtre étuvé, Bois Blanc scandinave, Bois Rouge C24, Acajou. Dépôts SOCOFEB Ariana.',
};

export default function BoisMassifsListingPage() {
  const woodCategory = PRODUCT_CATEGORIES.find((c) => c.id === 'bois-massifs');
  const woodProducts = (woodCategory?.products || []) as SolidWoodProduct[];

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'Bois Massifs' },
          ]}
        />

        {/* Page Header */}
        <div className="my-8 sm:my-12 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5">
            <TreePine className="w-3.5 h-3.5" />
            Essences Nobles &amp; Résineux
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            Bois Massifs d&apos;Importation
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            SOCOFEB sélectionne les meilleures grumes et avivés issus des forêts gérées durablement d&apos;Europe du Nord, d&apos;Europe Centrale et d&apos;Afrique. Séchés sous vide ou en séchoirs traditionnels (KD), nos bois garantissent stabilité dimensionnelle et usinabilité irréprochable.
          </p>
        </div>

        {/* Wood Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {woodProducts.map((wood) => (
            <ProductCard
              key={wood.id}
              product={wood}
              categorySlug="/produits/bois"
            />
          ))}
        </div>

        {/* Technical Guidance Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-accent font-heading font-bold text-xl block mb-2">
              Séchage en Séchoir (KD)
            </span>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Taux d&apos;humidité contrôlé entre 10% et 14% évitant tout risque de fentes, voilage ou retraits lors de la pose en intérieur.
            </p>
          </div>
          <div>
            <span className="text-accent font-heading font-bold text-xl block mb-2">
              Sections &amp; Débitages
            </span>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Disponible en plots non délignés, avivés 4 faces, madriers, chevrons et planches rabotées selon vos cahiers des charges.
            </p>
          </div>
          <div>
            <span className="text-accent font-heading font-bold text-xl block mb-2">
              Disponibilité Immédiate
            </span>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Stock permanent approvisionné en direct par semi-remorques à nos dépôts de la Route de Raoued et de Sidi Amor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
