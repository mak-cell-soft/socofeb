'use client';

import React from 'react';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { Layers } from 'lucide-react';

export default function MDFCataloguePage() {
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
              SOCOFEB vous propose le plus vaste choix de panneaux MDF en Tunisie : <strong>MDF Brut</strong> de haute densité (calibré, poncé deux faces), <strong>MDF Stratifié &amp; Mélaminé</strong> aux finitions bois et béton ultra-réalistes, <strong>High Gloss</strong> miroir haute brillance et <strong>MDF Plaqué</strong> bois véritable, approvisionnés auprès de STIBOIS, MPBS, PROPANN, STARWOOD, PANELIA, VENNI et AGT.
            </p>
          </div>
        </div>

        {/* Global DecorGrid Section */}
        <div id="nuancier" className="pt-2 scroll-mt-24">
          <DecorGrid
            title="Nuancier Complet des Décors MDF"
            subtitle="Sélectionnez un fabricant ou une collection pour explorer en détail les nuances bois, unis et matières"
          />
        </div>
      </div>
    </div>
  );
}
