import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { PlywoodProduct } from '@/types/product';
import { Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contreplaqué Structurel & CTBX Marine en Tunisie — SOCOFEB',
  description:
    'Contreplaqué WBP peuplier et eucalyptus résistant à l\'eau et contraintes mécaniques lourdes. Épaisseurs 9 à 21mm. Dépôts SOCOFEB Ariana.',
};

export default function ContreplaquePage() {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === 'contreplaque');
  const product = cat?.products[0] as PlywoodProduct;

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'Contreplaqué' },
          ]}
        />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-wood-dark border border-wood-border">
              <Image
                src="/images/produits/contreplaque/contreplaque.jpg"
                alt="Contreplaqué Structurel SOCOFEB"
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
                Multi-plis WBP &amp; CTBX
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">
                Contreplaqué Structurel &amp; Marine
              </h1>
              <p className="text-charcoal-light text-sm sm:text-base leading-relaxed mb-6">
                Nos panneaux de contreplaqué sont fabriqués par empilement croisé de plis de placage déroulé (peuplier ou eucalyptus), encollés sous haute pression avec de la résine phénolique WBP (Water and Boil Proof). Ils assurent une résistance optimale au cisaillement et à l&apos;humidité.
              </p>

              <div className="bg-wood-cream/60 p-4 rounded-2xl border border-wood-border space-y-2.5 text-xs sm:text-sm mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Épaisseurs en stock :</span>
                  <span className="font-bold text-primary">9, 12, 15, 18, 21 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Format standard :</span>
                  <span className="font-bold text-primary">2440 × 1220 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Type de colle :</span>
                  <span className="font-bold text-primary">Résine WBP Phénolique Imputrescible</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-charcoal">Applications :</span>
                  <span className="font-bold text-primary">Coffrage, planchers techniques, carrosserie, agencement</span>
                </div>
              </div>

              <a
                href="#devis"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all"
              >
                Demander un devis palettes / panneaux
              </a>
            </div>
          </div>
        </div>

        <div id="devis" className="scroll-mt-24">
          <ContactForm
            defaultCategory="contreplaque"
            defaultProduct="Contreplaqué Structurel WBP"
          />
        </div>
      </div>
    </div>
  );
}
