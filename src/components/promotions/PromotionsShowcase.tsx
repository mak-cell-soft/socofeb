'use client';

/**
 * PromotionsShowcase Component — SOCOFEB
 *
 * Interactive, high-end commercial showcase for factory promotional panel products.
 * Features:
 * - Dynamic statistics bar
 * - Interactive supplier pills with brand accents
 * - Conditional discount filtering (only appears if >= 2 distinct discount tiers exist)
 * - Real-time decor name and factory reference search
 * - Clearly demarcated supplier sections
 * - Integrated ImageLightbox HD preview
 * - Contextual WhatsApp quotation request
 * - Graceful fallback to 'Restez Connecté' experience if inventory is empty
 */

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Search,
  X,
  Sparkles,
  Layers,
  Phone,
  MessageSquare,
  Warehouse,
  CheckCircle2,
  BellRing,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Building,
} from 'lucide-react';
import { PromoProduct, PromoSupplierSummary, PromosManifest } from '@/types/promo';
import { PromoProductCard } from '@/components/ui/PromoProductCard';
import { ImageLightbox, LightboxImageItem } from '@/components/ui/ImageLightbox';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { COMPANY_INFO } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface PromotionsShowcaseProps {
  initialManifest: PromosManifest;
}

export function PromotionsShowcase({ initialManifest }: PromotionsShowcaseProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<string | 'all'>('all');
  const [selectedDiscount, setSelectedDiscount] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allPromotions = useMemo(() => initialManifest.promotions || [], [initialManifest]);
  const activeSuppliers = useMemo(() => initialManifest.suppliers || [], [initialManifest]);
  const availableDiscounts = useMemo(() => initialManifest.availableDiscounts || [], [initialManifest]);

  // Conditional Discount Filter rule: only show discount filter if there are >= 2 distinct discounts
  const hasMultipleDiscounts = availableDiscounts.length >= 2;

  // Filtered promotions
  const filteredPromotions = useMemo(() => {
    return allPromotions.filter((item) => {
      // 1. Supplier filter
      if (selectedSupplier !== 'all' && item.supplier.toLowerCase() !== selectedSupplier.toLowerCase()) {
        return false;
      }

      // 2. Discount filter
      if (selectedDiscount !== 'all' && item.discountPercentage !== selectedDiscount) {
        return false;
      }

      // 3. Search query: checks decor name, reference code, or supplier name
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchRef = item.ref ? item.ref.toLowerCase().includes(query) : false;
        const matchSupplier = item.supplierName.toLowerCase().includes(query);
        if (!matchName && !matchRef && !matchSupplier) {
          return false;
        }
      }

      return true;
    });
  }, [allPromotions, selectedSupplier, selectedDiscount, searchQuery]);

  // Group filtered promotions by supplier for clear visual demarcation
  const promotionsBySupplier = useMemo(() => {
    const map = new Map<string, { supplier: PromoSupplierSummary; items: PromoProduct[] }>();

    filteredPromotions.forEach((item) => {
      const supKey = item.supplier;
      if (!map.has(supKey)) {
        const summary = activeSuppliers.find((s) => s.supplier === supKey) || {
          supplier: supKey,
          name: item.supplierName,
          logo: item.supplierLogo,
          color: item.supplierColor,
          badgeText: item.supplierBadge,
          website: item.supplierWebsite,
          count: 0,
        };
        map.set(supKey, { supplier: summary, items: [] });
      }
      map.get(supKey)!.items.push(item);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.supplier.name.localeCompare(b.supplier.name, undefined, { sensitivity: 'base' })
    );
  }, [filteredPromotions, activeSuppliers]);

  // Map promotions to Lightbox items
  const lightboxItems: LightboxImageItem[] = useMemo(() => {
    return filteredPromotions.map((p) => ({
      src: p.encodedSrc,
      label: `${p.name} (${p.discountLabel})`,
      ref: p.ref || undefined,
      supplier: p.supplierName,
      collection: `Arrivage direct usine ${p.supplierName}`,
    }));
  }, [filteredPromotions]);

  const handleOpenLightbox = (promoId: string) => {
    const idx = filteredPromotions.findIndex((p) => p.id === promoId);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedSupplier('all');
    setSelectedDiscount('all');
    setSearchQuery('');
  };

  return (
    <div className="bg-bg-light min-h-screen pt-4 pb-12 sm:pt-6 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Promotions' }]} />

        {/* 1. Page Header (Refined compact layout) */}
        <header className="mt-2 mb-6 sm:mt-3 sm:mb-8 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary bg-accent/20 px-3 py-0.5 rounded-full border border-accent/40 shadow-2xs mb-2 sm:mb-2.5">
            <Tag className="w-3 h-3 text-accent" />
            Bons Plans &amp; Déstockage Usine
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-2.5 tracking-tight">
            Offres &amp; Promotions Fournisseurs
          </h1>
          <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Consultez les remises immédiates sur nos arrivages de panneaux MDF, décors mélaminés, surfaces High Gloss et contreplaqués à nos dépôts d&apos;Ariana (Jâafer Km 3 et Sidi Amor Km 9).
          </p>
        </header>

        {/* 2. Global Empty State: When no promotions exist anywhere */}
        {allPromotions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card max-w-4xl mx-auto text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-wood-cream border border-wood-border flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
                <BellRing className="w-8 h-8 animate-pulse text-accent" />
              </div>

              <span className="inline-block text-xs font-bold uppercase tracking-widest text-secondary bg-wood-cream px-3 py-1 rounded-full border border-wood-border mb-3">
                Information Déstockage
              </span>

              <h2 className="font-heading text-2xl sm:text-4xl font-bold text-primary mb-3">
                Pas de promotions disponibles pour le moment
              </h2>

              <p className="text-sm sm:text-base text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-8">
                Toutes nos offres promotionnelles récentes ont été clôturées suite à l&apos;épuisement des stocks dédiés. De nouveaux arrivages et déstockages directs usine sont en cours de préparation.
              </p>

              {/* Priority Alert Banner */}
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
            </div>
          </motion.div>
        ) : (
          <>
            {/* 3. Promotional Statistics Banner (Compact refined layout) */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 border border-wood-border shadow-card mb-5 sm:mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-wood-border">
                <div className="pt-2 md:pt-0">
                  <span className="block font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary">
                    {allPromotions.length}
                  </span>
                  <span className="text-[11px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">
                    Décors en Promotion
                  </span>
                </div>

                <div className="pt-2 md:pt-0">
                  <span className="block font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-secondary">
                    {activeSuppliers.length}
                  </span>
                  <span className="text-[11px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">
                    Marques Partenaires
                  </span>
                </div>

                <div className="pt-2 md:pt-0">
                  <span className="block font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-accent">
                    {availableDiscounts.length > 0 ? `-${Math.max(...availableDiscounts)}%` : 'Direct Usine'}
                  </span>
                  <span className="text-[11px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">
                    Remise Immédiate
                  </span>
                </div>

                <div className="pt-2 md:pt-0">
                  <span className="block font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary">
                    2 Dépôts
                  </span>
                  <span className="text-[11px] sm:text-xs text-charcoal-light uppercase tracking-wider font-semibold">
                    Jâafer &amp; Sidi Amor
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Controls: Brand Navigation, Search, and Conditional Discount Filter */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-wood-border shadow-card mb-6 sm:mb-8 space-y-3 sm:space-y-4">
              {/* Top Row: Search Input + Active Summary */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom de décor, référence (ex: 729, AH03)..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-wood-border text-xs sm:text-sm text-charcoal bg-wood-cream/30 focus:bg-white focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-charcoal transition-colors"
                      aria-label="Effacer la recherche"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Conditional Discount Filter: Only rendered if >= 2 distinct discount tiers exist */}
                {hasMultipleDiscounts && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal-light mr-1 shrink-0">
                      Taux :
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDiscount('all')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                        selectedDiscount === 'all'
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-wood-cream/50 text-charcoal hover:bg-wood-cream border border-wood-border'
                      )}
                    >
                      Tous
                    </button>
                    {availableDiscounts.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDiscount(d)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                          selectedDiscount === d
                            ? 'bg-accent text-primary shadow-xs font-black'
                            : 'bg-wood-cream/50 text-charcoal hover:bg-wood-cream border border-wood-border'
                        )}
                      >
                        -{d}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Row: Supplier Pills Navigation */}
              <div className="pt-3 border-t border-wood-border/60">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {/* All Suppliers Pill */}
                  <button
                    type="button"
                    onClick={() => setSelectedSupplier('all')}
                    className={cn(
                      'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
                      selectedSupplier === 'all'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-wood-cream/40 text-charcoal border border-wood-border hover:bg-wood-cream'
                    )}
                  >
                    <span>Toutes les marques</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                        selectedSupplier === 'all' ? 'bg-white/20 text-white' : 'bg-charcoal/10 text-charcoal'
                      )}
                    >
                      {allPromotions.length}
                    </span>
                  </button>

                  {/* Individual Active Supplier Pills */}
                  {activeSuppliers.map((sup) => {
                    const isSelected = selectedSupplier === sup.supplier;
                    return (
                      <button
                        key={sup.supplier}
                        type="button"
                        onClick={() => setSelectedSupplier(sup.supplier)}
                        className={cn(
                          'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2',
                          isSelected
                            ? 'text-white shadow-sm'
                            : 'bg-white text-charcoal border-wood-border hover:bg-wood-cream'
                        )}
                        style={{
                          backgroundColor: isSelected ? sup.color : undefined,
                          borderColor: isSelected ? sup.color : undefined,
                        }}
                      >
                        {/* Supplier Color Indicator */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: isSelected ? '#FFFFFF' : sup.color }}
                        />
                        <span>{sup.name}</span>
                        <span
                          className={cn(
                            'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                            isSelected ? 'bg-white/25 text-white' : 'bg-charcoal/10 text-charcoal'
                          )}
                        >
                          {sup.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Filter Results Summary / Reset Link */}
            {(selectedSupplier !== 'all' || selectedDiscount !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between text-xs text-charcoal-light mb-6 px-1">
                <span>
                  Affichage de <strong>{filteredPromotions.length}</strong> produit(s) en promotion
                  {selectedSupplier !== 'all' && (
                    <span>
                      {' '}
                      pour la marque <strong>{activeSuppliers.find((s) => s.supplier === selectedSupplier)?.name}</strong>
                    </span>
                  )}
                  {searchQuery && (
                    <span>
                      {' '}
                      correspondant à &laquo; <strong>{searchQuery}</strong> &raquo;
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-primary hover:text-accent font-semibold underline underline-offset-2 transition-colors ml-4"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* 6. Main Promotions Showcase: Grouped by Supplier */}
            {filteredPromotions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-wood-border shadow-card text-center max-w-xl mx-auto my-12">
                <Search className="w-10 h-10 text-charcoal-light/60 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-primary mb-1">
                  Aucun produit ne correspond à vos critères
                </h3>
                <p className="text-xs text-charcoal-light mb-6">
                  Modifiez vos filtres ou effectuez une recherche avec une référence usine différente.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold transition-all shadow-sm"
                >
                  Voir tous les arrivages ({allPromotions.length})
                </button>
              </div>
            ) : (
              <div className="space-y-10 sm:space-y-12 mb-14">
                {promotionsBySupplier.map(({ supplier, items }) => (
                  <section
                    key={supplier.supplier}
                    className="relative bg-white/70 rounded-3xl p-5 sm:p-7 border border-wood-border shadow-card backdrop-blur-xs"
                  >
                    {/* Supplier Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-wood-border/70">
                      <div className="flex items-center gap-4">
                        {/* Supplier Logo Container */}
                        <div className="w-20 h-12 rounded-xl bg-white border border-wood-border p-2 flex items-center justify-center shrink-0 shadow-2xs">
                          {supplier.logo ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={supplier.logo}
                                alt={`Logo ${supplier.name}`}
                                fill
                                sizes="80px"
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <span className="font-heading font-bold text-sm text-primary">
                              {supplier.name}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-heading text-xl sm:text-2xl font-bold text-primary">
                              {supplier.name}
                            </h2>
                            {supplier.badgeText && (
                              <span
                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white shadow-2xs"
                                style={{ backgroundColor: supplier.color }}
                              >
                                {supplier.badgeText}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-charcoal-light mt-0.5">
                            {items.length} {items.length > 1 ? 'décors remisés' : 'décor remisé'} en arrivage d&apos;usine direct
                          </p>
                        </div>
                      </div>

                      {/* Official Website / Brand Link if available */}
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-charcoal-light hover:text-primary transition-colors font-medium self-start sm:self-auto"
                        >
                          <span>Site officiel</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Promotional Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {items.map((promo) => (
                        <PromoProductCard
                          key={promo.id}
                          promo={promo}
                          onOpenLightbox={() => handleOpenLightbox(promo.id)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* 7. Reassurance & Depot Information */}
            <div className="bg-wood-dark text-white rounded-3xl p-8 sm:p-10 border border-accent/20 shadow-xl mb-16 relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                <div className="max-w-2xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/30 inline-block mb-3">
                    Disponibilité &amp; Approvisionnement
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-3 text-white">
                    Retrait Immédiat &amp; Découpe Industrielle Sur-Mesure
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    Tous nos lots en promotion sont stockés sur nos plateformes d&apos;Ariana et disponibles sous réserve des stocks restants. Nos équipes assurent la découpe numérique millimétrique et la livraison sur chantier partout en Tunisie.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>Dépôt Jâafer (Km 3, Ariana) : +216 99 218 866</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>Dépôt Sidi Amor (Km 9, Ariana) : 08h00 – 17h00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>Sciage numérique &amp; placage de chants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      <span>Facturation directe &amp; enlèvement immédiat</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://wa.me/21699218866?text=Bonjour%20SOCOFEB,%20je%20souhaite%20verifier%20la%20disponibilite%20generale%20des%20panneaux%20en%20promotion."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Commercial
                  </a>
                  <a
                    href="tel:+21699218866"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20"
                  >
                    <Phone className="w-4 h-4 text-accent" />
                    Appeler Mohamed Amine
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 8. Fullscreen ImageLightbox Viewer */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName={
          lightboxItems[lightboxIndex]?.supplier || 'SOCOFEB Promotion'
        }
      />
    </div>
  );
}
