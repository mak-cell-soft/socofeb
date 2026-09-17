import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { OSBProduct } from '@/types/product';
import { Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Panneaux OSB/3 Norme EN 300 en Tunisie — SOCOFEB',
  description:
    'Panneaux de particules orientées OSB/3 conformes EN 300 pour toitures, cloisons, planchers et ossature bois. Stock immédiat à l\'Ariana.',
};

export default function OSBPage() {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === 'osb');
  const product = cat?.products[0] as OSBProduct;

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'OSB/3' },
          ]}
        />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-wood-dark border border-wood-border">
              <Image
                src="/images/osb/osb-cover.webp"
                alt="Panneau OSB/3 SOCOFEB"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <SupplierBadge supplier="stibois" size="md" />
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5 mb-3">
                <Layers className="w-3.5 h-3.5" />
                Norme Européenne EN 300
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">
                Panneaux OSB/3 Structurels
              </h1>
              <p className="text-charcoal-light text-sm sm:text-base leading-relaxed mb-6">
                Le panneau OSB/3 (Oriented Strand Board) est constitué de lamelles de bois orientées et liées par une résine synthétique sans formaldéhyde ajouté (colle PMDI). Conçu spécifiquement pour les environnements humides et les structures sous contrainte.
              </p>

              <div className="bg-wood-cream/60 p-4 rounded-2xl border border-wood-border space-y-2.5 text-xs sm:text-sm mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Classe &amp; Norme :</span>
                  <span className="font-bold text-primary">OSB/3 — Conforme NF EN 300</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Épaisseurs en stock :</span>
                  <span className="font-bold text-primary">9, 12, 15, 18, 22, 25 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Format standard :</span>
                  <span className="font-bold text-primary">2500 × 1250 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Domaines d&apos;emploi :</span>
                  <span className="font-bold text-primary">Toitures, planchers, cloisons, emballages industriels</span>
                </div>
              </div>

              <a
                href="#devis"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all"
              >
                Demander un devis palettes OSB/3
              </a>
            </div>
          </div>
        </div>

        <div id="devis" className="scroll-mt-24">
          <ContactForm
            defaultCategory="osb"
            defaultProduct="Panneau OSB/3 Norme EN 300"
          />
        </div>
      </div>
    </div>
  );
}
