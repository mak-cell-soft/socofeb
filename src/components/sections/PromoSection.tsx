'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, BellRing, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { PROMO_IMAGES } from '@/lib/images';
import { Supplier, PromoImage } from '@/types/image';
import { PromoCard } from '@/components/ui/PromoCard';

export function PromoSection() {
  // Collect 1 highlight promo per supplier that has active promos
  const highlightedPromos: { supplier: Supplier; promo: PromoImage }[] = [];
  (Object.keys(PROMO_IMAGES) as Supplier[]).forEach((sup) => {
    const list = PROMO_IMAGES[sup];
    if (list && list.length > 0) {
      highlightedPromos.push({ supplier: sup, promo: list[0] });
    }
  });

  return (
    <section className="py-16 sm:py-20 bg-bg-light border-y border-wood-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {highlightedPromos.length > 0 ? (
          <>
            {/* Header with active promos */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-accent/20 px-3 py-1 rounded-full border border-accent/40">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  Offres Spéciales &amp; Déstockage
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3">
                  Promotions Fournisseurs en Cours
                </h2>
                <p className="text-charcoal-light text-sm sm:text-base mt-2 max-w-2xl">
                  Profitez de tarifs négociés et de remises immédiates sur nos arrivages de panneaux et décors aux dépôts de Jâafer et Sidi Amor.
                </p>
              </div>

              <Link
                href="/promotions"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors group self-start md:self-auto"
              >
                Toutes les promotions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent" />
              </Link>
            </div>

            {/* Promo Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlightedPromos.map(({ supplier, promo }) => (
                <PromoCard key={`${supplier}-${promo.file}`} promo={promo} supplier={supplier} />
              ))}
            </div>
          </>
        ) : (
          /* Editorial 'Restez Connecté' Banner when no promos are active */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary bg-wood-cream px-3 py-1 rounded-full border border-wood-border mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Bons Plans &amp; Déstockage Usine
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-3">
                  Offres &amp; Promotions : Restez Connecté !
                </h2>
                <p className="text-sm sm:text-base text-charcoal-light leading-relaxed mb-6">
                  Nos derniers lots promotionnels ont été épuisés. De nouveaux arrivages et déstockages exclusifs d&apos;usine arrivent régulièrement dans nos dépôts d&apos;Ariana. Contactez-nous pour être informé(e) en priorité dès les prochaines disponibilités.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-charcoal">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Arrivages directs usine
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Dépôts Jâafer &amp; Sidi Amor
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Tarifs négociés professionnels
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <a
                  href="https://wa.me/21699218866?text=Bonjour%20SOCOFEB,%20je%20souhaite%20etre%20informe(e)%20des%20prochaines%20promotions%20et%20arrivages."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Alerte Promotions WhatsApp
                </a>
                <Link
                  href="/promotions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary text-xs font-bold uppercase tracking-wider transition-all border border-wood-border"
                >
                  <BellRing className="w-4 h-4 text-accent" />
                  En savoir plus
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
