'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { PromoCard } from '@/components/ui/PromoCard';
import { PROMO_IMAGES } from '@/lib/images';
import { SUPPLIER_CONFIG, COMPANY_INFO } from '@/lib/catalog';
import { Supplier, SUPPLIERS, PromoImage } from '@/types/image';
import {
  Tag,
  Sparkles,
  BellRing,
  Phone,
  MessageSquare,
  Layers,
  ArrowRight,
  Warehouse,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PromotionsPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'all'>('all');

  const allPromos: { supplier: Supplier; promo: PromoImage }[] = [];
  SUPPLIERS.forEach((sup) => {
    (PROMO_IMAGES[sup] || []).forEach((promo) => {
      allPromos.push({ supplier: sup, promo });
    });
  });

  const filteredPromos = allPromos.filter(
    (item) => selectedSupplier === 'all' || item.supplier === selectedSupplier
  );

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Promotions' }]} />

        {/* Page Header */}
        <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-accent/20 px-3.5 py-1 rounded-full border border-accent/40">
            <Tag className="w-3.5 h-3.5 text-accent" />
            Bons Plans &amp; Déstockage Usine
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            Offres &amp; Promotions Fournisseurs
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Consultez les remises en cours sur nos arrivages de panneaux MDF, décors mélaminés, surfaces High Gloss et contreplaqués à nos dépôts de Jâafer et Sidi Amor.
          </p>
        </div>

        {/* If no promos are currently active: Display the 'Restez Connecté' Experience */}
        {allPromos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16"
          >
            {/* Main Restez Connecté Box */}
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card max-w-4xl mx-auto text-center relative overflow-hidden">
              {/* Subtle decorative background gradient */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              {/* Glowing notification icon */}
              <div className="w-16 h-16 rounded-2xl bg-wood-cream border border-wood-border flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
                <BellRing className="w-8 h-8 animate-pulse text-accent" />
              </div>

              <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary bg-wood-cream px-3 py-1 rounded-full border border-wood-border mb-3">
                Information Promotions
              </span>

              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-primary mb-3">
                Pas de promotions disponibles pour le moment
              </h2>

              <p className="text-sm sm:text-base text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-8">
                Toutes nos offres promotionnelles récentes ont été clôturées suite à l&apos;épuisement des stocks dédiés. De nouveaux arrivages et déstockages directs usine sont en cours de préparation.
              </p>

              {/* Restez Connecté Highlight Banner */}
              <div className="bg-wood-cream/80 border border-wood-border rounded-2xl p-6 sm:p-8 mb-8 text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-wood-border">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-primary">
                        Restez Connecté pour les Prochains Arrivages !
                      </h3>
                      <p className="text-xs text-charcoal-light">
                        Les lots à prix usine partent rapidement. Soyez notifié(e) dès leur mise en rayon.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-white px-2.5 py-1 rounded-md border border-wood-border shrink-0">
                    Alerte Prioritaire
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  {/* Option 1: WhatsApp Alert */}
                  <a
                    href="https://wa.me/21699218866?text=Bonjour%20SOCOFEB,%20je%20souhaite%20etre%20informe(e)%20des%20prochaines%20promotions%20et%20arrivages."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white p-4 rounded-xl border border-wood-border hover:border-[#25D366] transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-2.5">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-primary group-hover:text-[#25D366] transition-colors">
                        Alerte WhatsApp
                      </h4>
                      <p className="text-[11px] text-charcoal-light mt-1 leading-normal">
                        Recevez nos arrivages en direct sur votre smartphone.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-xs font-bold text-[#25D366]">
                      S&apos;inscrire &rarr;
                    </div>
                  </a>

                  {/* Option 2: Direct Phone Call */}
                  <a
                    href="tel:+21699218866"
                    className="group bg-white p-4 rounded-xl border border-wood-border hover:border-primary transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                        Contact Commercial
                      </h4>
                      <p className="text-[11px] text-charcoal-light mt-1 leading-normal">
                        Vérifiez en temps réel nos tarifs par palette ou panneau.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-xs font-bold text-primary">
                      +216 99 218 866 &rarr;
                    </div>
                  </a>

                  {/* Option 3: Explore Catalog */}
                  <Link
                    href="/#nuancier"
                    className="group bg-white p-4 rounded-xl border border-wood-border hover:border-accent transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-2.5">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-primary group-hover:text-accent transition-colors">
                        Nuancier Permanent
                      </h4>
                      <p className="text-[11px] text-charcoal-light mt-1 leading-normal">
                        Plus de 80 décors et finitions en stock garanti.
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-xs font-bold text-accent">
                      Voir la galerie &rarr;
                    </div>
                  </Link>
                </div>
              </div>

              {/* Warehouse Reassurance Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-charcoal-light border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Dépôt Jâafer (Km 3, Ariana)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Dépôt Sidi Amor (Km 9, Ariana)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Stock Permanent &amp; Découpe Sur-Mesure</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Supplier Filter Buttons (when promos exist) */}
            <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedSupplier('all')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all',
                  selectedSupplier === 'all'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-charcoal border border-wood-border hover:bg-wood-cream'
                )}
              >
                Toutes les marques ({allPromos.length})
              </button>
              {SUPPLIERS.filter((sup) => (PROMO_IMAGES[sup] || []).length > 0).map((sup) => {
                const config = SUPPLIER_CONFIG[sup];
                const isSelected = selectedSupplier === sup;
                const count = (PROMO_IMAGES[sup] || []).length;
                return (
                  <button
                    key={sup}
                    onClick={() => setSelectedSupplier(sup)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5',
                      isSelected
                        ? 'text-white shadow-sm'
                        : 'bg-white text-charcoal border-wood-border hover:bg-wood-cream'
                    )}
                    style={{
                      backgroundColor: isSelected ? config.color : undefined,
                      borderColor: isSelected ? config.color : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? '#FFFFFF' : config.color }}
                    />
                    {config.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Promos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {filteredPromos.map(({ supplier, promo }) => (
                <PromoCard
                  key={`${supplier}-${promo.file}`}
                  promo={promo}
                  supplier={supplier}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
