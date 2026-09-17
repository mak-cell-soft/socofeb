'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { FilterBar } from '@/components/ui/FilterBar';
import { ProductCard } from '@/components/ui/ProductCard';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { MDFProduct } from '@/types/product';
import { Supplier } from '@/types/image';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

export default function MDFCataloguePage() {
  const mdfCategory = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  const allMdfProducts = (mdfCategory?.products || []) as MDFProduct[];

  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
  const [selectedThickness, setSelectedThickness] = useState<number | 'all'>('all');

  const handleToggleSupplier = (supplier: Supplier) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplier)
        ? prev.filter((s) => s !== supplier)
        : [...prev, supplier]
    );
  };

  const handleReset = () => {
    setSelectedSuppliers([]);
    setSelectedThickness('all');
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return allMdfProducts.filter((product) => {
      // Filter by supplier
      if (selectedSuppliers.length > 0) {
        const matchesSupplier = product.suppliers.some((s) =>
          selectedSuppliers.includes(s)
        );
        if (!matchesSupplier) return false;
      }
      // Filter by thickness
      if (selectedThickness !== 'all') {
        if (!product.epaisseurs.includes(selectedThickness)) {
          return false;
        }
      }
      return true;
    });
  }, [allMdfProducts, selectedSuppliers, selectedThickness]);

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'MDF & Panneaux' },
          ]}
        />

        {/* Page Header */}
        <div className="my-8 sm:my-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Panneaux de Fibres &amp; Décors
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
              MDF &amp; Panneaux Décoratifs
            </h1>
            <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
              SOCOFEB vous propose le plus vaste choix de panneaux MDF en Tunisie : <strong>MDF Brut</strong> de haute densité (calibré, poncé deux faces), <strong>MDF Stratifié &amp; Mélaminé</strong> aux finitions bois et béton ultra-réalistes, <strong>High Gloss</strong> miroir haute brillance et <strong>MDF Plaqué</strong> bois véritable, approvisionnés auprès de STIBOIS, MPBS, PROPANN et STARWOOD.
            </p>
          </div>
        </div>

        {/* FilterBar for MDF Products */}
        <div className="mb-10">
          <FilterBar
            selectedSuppliers={selectedSuppliers}
            onToggleSupplier={handleToggleSupplier}
            selectedThickness={selectedThickness}
            onSelectThickness={setSelectedThickness}
            availableThicknesses={[8, 12, 16, 18, 19, 22, 25, 30]}
            onReset={handleReset}
          />
        </div>

        {/* MDF Products Grid (4 columns desktop) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-primary flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              Gamme des Panneaux MDF ({filteredProducts.length})
            </h2>
            <a
              href="#nuancier"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-accent"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Aller directement au nuancier décors &darr;
            </a>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-wood-border">
              <p className="text-gray-500 text-sm">
                Aucun panneau MDF ne correspond aux critères sélectionnés.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-accent text-wood-dark text-xs font-bold rounded-lg uppercase"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  categorySlug="/produits/mdf"
                />
              ))}
            </div>
          )}
        </div>

        {/* Global DecorGrid Section */}
        <div id="nuancier" className="pt-4 scroll-mt-24">
          <DecorGrid
            title="Nuancier Complet des Décors MDF"
            subtitle="Sélectionnez un fabricant ou une collection pour explorer en détail les nuances bois, unis et matières"
          />
        </div>
      </div>
    </div>
  );
}
