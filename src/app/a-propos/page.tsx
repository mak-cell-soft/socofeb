import React from 'react';
import Image from 'next/image';
import Link from 'next/image';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { StatsSection } from '@/components/sections/StatsSection';
import { TreePine, ShieldCheck, CheckCircle2, Award, Truck, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'À Propos de SOCOFEB — Société Commerciale du Fer et du Bois',
  description:
    'Découvrez l\'histoire, les engagements et l\'expertise de SOCOFEB dans le négoce et la distribution de bois et panneaux en Tunisie.',
};

export default function AProposPage() {
  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'À Propos' }]} />

        {/* Page Header */}
        <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Historique &amp; Valeurs
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            L&apos;Histoire de SOCOFEB
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Fondée avec la passion du bois et l&apos;exigence de la qualité industrielle, la <strong>Société Commerciale du Fer et du Bois</strong> est aujourd&apos;hui un acteur incontournable de l&apos;approvisionnement en matériaux bois dans le Grand Tunis et toute la Tunisie.
          </p>
        </div>

        {/* Two-column Story Block */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4 text-charcoal text-sm leading-relaxed">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-4">
                Une Expertise Bâtie au Cœur des Métiers du Bois
              </h2>
              <p>
                Depuis plus de 25 ans, SOCOFEB accompagne les artisans menuisiers, ébénistes, décorateurs, cuisinistes et grandes entreprises de construction en mettant à leur disposition des matériaux de premier ordre rigoureusement sélectionnés.
              </p>
              <p>
                Sous la direction de <strong>Mohamed Amine KLABI</strong>, l&apos;entreprise a consolidé des partenariats exclusifs avec les plus grands noms de l&apos;industrie du panneau tels que <strong>STIBOIS</strong>, <strong>MPBS</strong>, <strong>PROPANN</strong> et la marque d&apos;importation turque <strong>STARWOOD</strong>.
              </p>
              <p>
                Grâce à nos deux dépôts stratégiquement implantés à l&apos;Ariana (Jâafer et Sidi Amor), nous garantissons à nos clients un stock tampon permanent, une réactivité immédiate et des délais d&apos;enlèvement réduits au strict minimum.
              </p>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-wood-dark border border-wood-border shadow-md">
              <Image
                src="/images/hero/hero-warehouse.webp"
                alt="Dépôt SOCOFEB Ariana"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                  Dépôt Jâafer &amp; Sidi Amor
                </span>
                <p className="text-sm font-semibold">
                  Plus de 150 références de panneaux et bois en stock permanent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <Award className="w-6 h-6 text-accent-dark" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary mb-2">
              Qualité Certifiée
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Normes européennes EN 622-5 pour le MDF et EN 300 pour l&apos;OSB, garantissant faibles émissions et résistance mécanique.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <Truck className="w-6 h-6 text-accent-dark" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary mb-2">
              Stock Permanent
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Approvisionnements continus par semi-remorques direct usine assurant zéro rupture sur les références courantes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <Building className="w-6 h-6 text-accent-dark" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary mb-2">
              2 Dépôts Ariana
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Dépôts faciles d&apos;accès avec quais de chargement rapide à la Route de Raoued et la Route de Gammarth.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 text-primary">
              <TreePine className="w-6 h-6 text-accent-dark" />
            </div>
            <h3 className="font-heading text-lg font-bold text-primary mb-2">
              Conseil Spécialisé
            </h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Une équipe d&apos;experts du bois capable d&apos;orienter le choix des essences et finitions selon l&apos;hygrométrie et l&apos;usage.
            </p>
          </div>
        </div>
      </div>

      <StatsSection />
    </div>
  );
}
