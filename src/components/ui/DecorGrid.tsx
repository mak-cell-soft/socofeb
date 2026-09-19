'use client';

/**
 * DecorGrid Component — SOCOFEB
 * 
 * Dynamic Decor Image Gallery with Enterprise Logos:
 * - Scans and renders decor images directly from each enterprise's `decors/` folder
 * - Extracts decor references dynamically from the image filename (last numeric segment after '-')
 * - Displays only the decor reference as an elegant badge on the image bottom-right [111]
 * - Associates each decor with its enterprise logo from the `logo/` folder
 * - Supports all 7 providers (Starwood, Stibois, Propann, MPBS, Panelia, Venni, AGT)
 * - Compact, horizontally scrollable provider navigation
 * - Showroom-grade cards with subtle zoom, consistent aspect ratio, and full-screen HD Lightbox
 */

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Eye, Sparkles, Layers, X, ArrowUpRight, MessageSquare } from 'lucide-react';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import {
  MDF_CATALOG,
  DYNAMIC_DECORS_MANIFEST,
  getEnterpriseLogo,
  DynamicDecorItem,
  EnterpriseDecorsData,
} from '@/lib/images';
import { extractDecorReference, extractDecorName, getDecorUrl, getDecorAltText } from '@/lib/decors';
import { Supplier, SUPPLIERS, MDFCategory } from '@/types/image';
import { ImageLightbox, LightboxImageItem } from './ImageLightbox';
import { cn } from '@/lib/utils';

// Unified Decor Card Item
export interface UnifiedDecorItem {
  id: string;
  name: string;          // Clean decor title (e.g. "AFRIQUE", "Chêne Français")
  filename: string;      // Full filename (e.g. "AFRIQUE-327.jpg")
  src: string;           // Browser-ready image path
  supplier: Supplier;    // Enterprise ID ('starwood', 'panelia', 'agt', etc.)
  supplierName: string;  // Human-readable enterprise name
  supplierLogo: string;  // Path to enterprise logo
  supplierColor: string; // Brand accent color
  collection?: string;   // Optional category/collection name
  ref?: string | null;   // Dynamically extracted reference code (e.g. "327", "111", "SL10")
}

interface DecorGridProps {
  initialSupplier?: Supplier;
  initialCategory?: string;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function DecorGrid({
  initialSupplier,
  initialCategory,
  showFilters = true,
  title = 'Nuancier & Galerie des Décors MDF',
  subtitle = 'Explorez notre sélection complète de décors bois, textures minérales et finitions contemporaines certifiées',
  className,
}: DecorGridProps) {
  // Brand filter state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'all'>(
    initialSupplier || 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Live dynamic manifest state (synced with /api/decors on mount for hot additions)
  const [liveManifest, setLiveManifest] = useState<Record<string, EnterpriseDecorsData>>(
    DYNAMIC_DECORS_MANIFEST
  );

  // Fullscreen Lightbox viewer state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch /api/decors on mount to capture any live filesystem changes without page refresh
  useEffect(() => {
    let isMounted = true;
    fetch('/api/decors')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch decors');
      })
      .then((data) => {
        if (isMounted && data?.enterprises) {
          setLiveManifest(data.enterprises);
        }
      })
      .catch(() => {
        // Fallback silently to pre-compiled manifest
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update selection if initialSupplier changes externally
  useEffect(() => {
    if (initialSupplier) {
      setSelectedSupplier(initialSupplier);
    }
  }, [initialSupplier]);

  /**
   * Build unified decor items for each enterprise across all 7 suppliers:
   * 1. Prioritize images dynamically scanned from public/images/{enterprise}/decors/
   * 2. Derive reference and clean name dynamically using extractDecorReference / extractDecorName
   * 3. Attach the enterprise's logo from public/images/{enterprise}/logo/
   * 4. Fallback to catalog config if decors folder is pending
   */
  const enterpriseGroups = useMemo(() => {
    const groups: {
      supplier: Supplier;
      config: (typeof SUPPLIER_CONFIG)[Supplier];
      logo: string;
      decors: UnifiedDecorItem[];
    }[] = [];

    SUPPLIERS.forEach((sup) => {
      const config = SUPPLIER_CONFIG[sup];
      const manifestEntry = liveManifest[sup];
      const enterpriseLogo = manifestEntry?.logo || getEnterpriseLogo(sup) || config?.logo;
      const decorsList: UnifiedDecorItem[] = [];

      // Check if enterprise has dynamically discovered images in decors/
      if (manifestEntry && manifestEntry.decors && manifestEntry.decors.length > 0) {
        manifestEntry.decors.forEach((item: DynamicDecorItem) => {
          const ref = item.ref !== undefined ? item.ref : extractDecorReference(item.filename);
          const name = item.name ? extractDecorName(item.name) : extractDecorName(item.filename);

          decorsList.push({
            id: `${sup}-${item.filename}`,
            name: name || item.filename.replace(/\.[^/.]+$/, ''),
            filename: item.filename,
            src: item.src,
            supplier: sup,
            supplierName: config?.name || sup.toUpperCase(),
            supplierLogo: enterpriseLogo,
            supplierColor: config?.color || '#4A2C0A',
            collection: 'Collection Décors',
            ref: ref,
          });
        });
      } else {
        // Fallback: If no files in decors/ yet, preserve existing catalog decors for this brand
        const catalogCategories: MDFCategory[] = MDF_CATALOG[sup] || [];
        catalogCategories.forEach((cat) => {
          cat.images.forEach((img) => {
            const ref = img.ref || extractDecorReference(img.file);
            const name = img.label || extractDecorName(img.file);

            decorsList.push({
              id: `${sup}-${cat.id}-${img.file}`,
              name: name,
              filename: img.file,
              src: `/images/${sup}/${cat.subfolder}/${img.file}`,
              supplier: sup,
              supplierName: config?.name || sup.toUpperCase(),
              supplierLogo: enterpriseLogo,
              supplierColor: config?.color || '#4A2C0A',
              collection: cat.label,
              ref: ref,
            });
          });
        });
      }

      groups.push({
        supplier: sup,
        config,
        logo: enterpriseLogo,
        decors: decorsList,
      });
    });

    return groups;
  }, [liveManifest]);

  /**
   * Filter decors based on active supplier tab and search term
   */
  const filteredGroups = useMemo(() => {
    return enterpriseGroups
      .filter((group) => {
        if (selectedSupplier === 'all') return true;
        return group.supplier === selectedSupplier;
      })
      .map((group) => {
        if (!searchTerm.trim()) {
          return group;
        }
        const query = searchTerm.toLowerCase().trim();
        const matchingDecors = group.decors.filter((item) => {
          return (
            item.name.toLowerCase().includes(query) ||
            item.filename.toLowerCase().includes(query) ||
            (item.ref && item.ref.toLowerCase().includes(query)) ||
            (item.collection && item.collection.toLowerCase().includes(query)) ||
            item.supplierName.toLowerCase().includes(query)
          );
        });
        return {
          ...group,
          decors: matchingDecors,
        };
      })
      .filter((group) => {
        // If "all" is selected, only show groups with decors matching the search
        // If a specific supplier is selected, always keep the group so we can render an empty state if needed
        if (selectedSupplier !== 'all') return true;
        return group.decors.length > 0;
      });
  }, [enterpriseGroups, selectedSupplier, searchTerm]);

  // Flatten all displayed decors for the Lightbox sequence
  const allFilteredDecors = useMemo(() => {
    return filteredGroups.flatMap((g) => g.decors);
  }, [filteredGroups]);

  // Transform for Lightbox component
  const lightboxItems: LightboxImageItem[] = useMemo(() => {
    return allFilteredDecors.map((d) => ({
      src: d.src,
      label: d.name,
      ref: d.ref ? `Réf. ${d.ref}` : undefined,
      supplier: d.supplierName,
      collection: d.collection,
    }));
  }, [allFilteredDecors]);

  // Handle tile click to open Lightbox at specific global index
  const handleTileClick = (item: UnifiedDecorItem) => {
    const globalIdx = allFilteredDecors.findIndex((d) => d.id === item.id);
    if (globalIdx !== -1) {
      setLightboxIndex(globalIdx);
      setLightboxOpen(true);
    }
  };

  const totalDecorsCount = allFilteredDecors.length;

  return (
    <section id="nuancier" className={cn('py-16 bg-[#FAF6EE] relative overflow-hidden', className)}>
      {/* Subtle architectural ambient background blur */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Nuancier &amp; Galerie Officielle
            </span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-charcoal-light text-base sm:text-lg mt-3 font-normal max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Compact, Streamlined Filter and Search Bar */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-card p-3 sm:p-5 mb-8 border border-wood-border">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Supplier Selection Tabs — Horizontally Scrollable & Compact */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none snap-x">
                <button
                  type="button"
                  onClick={() => setSelectedSupplier('all')}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 snap-start',
                    selectedSupplier === 'all'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-wood-cream/70 text-charcoal hover:bg-wood-border/60'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tous</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none',
                      selectedSupplier === 'all'
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-200/80 text-gray-700'
                    )}
                  >
                    {enterpriseGroups.reduce((acc, g) => acc + g.decors.length, 0)}
                  </span>
                </button>

                {SUPPLIERS.map((sup) => {
                  const cfg = SUPPLIER_CONFIG[sup];
                  const manifestEntry = liveManifest[sup];
                  const isSelected = selectedSupplier === sup;
                  const count =
                    manifestEntry?.decorsCount !== undefined
                      ? manifestEntry.decorsCount
                      : enterpriseGroups.find((g) => g.supplier === sup)?.decors.length || 0;

                  return (
                    <button
                      key={sup}
                      type="button"
                      onClick={() => setSelectedSupplier(sup)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border snap-start',
                        isSelected
                          ? 'text-white shadow-md'
                          : 'bg-wood-cream/70 text-charcoal hover:bg-wood-border/60 border-transparent'
                      )}
                      style={{
                        backgroundColor: isSelected ? cfg?.color || '#4A2C0A' : undefined,
                        borderColor: isSelected ? cfg?.color || '#4A2C0A' : undefined,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: isSelected ? '#FFFFFF' : cfg?.color || '#4A2C0A',
                        }}
                      />
                      <span>{cfg?.name || sup.toUpperCase()}</span>
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none',
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-gray-200/80 text-gray-700'
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Real-time Search Input */}
              <div className="relative min-w-[240px] sm:w-72 shrink-0">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher (ex: 327, chêne, 6022)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-gray-50/70 text-charcoal placeholder:text-gray-400 font-medium transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal p-0.5"
                    title="Effacer la recherche"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Counter Summary */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="text-xs sm:text-sm font-semibold text-charcoal flex items-center gap-2">
            <span className="text-accent font-extrabold text-base sm:text-lg">
              {totalDecorsCount}
            </span>
            <span className="text-charcoal-light">
              décors répertoriés
              {selectedSupplier !== 'all' && (
                <>
                  {' '}pour{' '}
                  <strong className="text-primary font-bold">
                    {SUPPLIER_CONFIG[selectedSupplier]?.name}
                  </strong>
                </>
              )}
              {searchTerm && (
                <>
                  {' '}correspondant à &ldquo;<span className="text-primary">{searchTerm}</span>&rdquo;
                </>
              )}
            </span>
          </div>

          <span className="text-xs text-charcoal-light hidden sm:inline-flex items-center gap-1.5 font-medium">
            <Eye className="w-3.5 h-3.5 text-accent" />
            Cliquez sur un panneau pour zoomer en haute définition
          </span>
        </div>

        {/* Empty State when no items match filters */}
        {filteredGroups.length === 0 || totalDecorsCount === 0 ? (
          selectedSupplier !== 'all' && enterpriseGroups.find(g => g.supplier === selectedSupplier)?.decors.length === 0 ? (
            /* Graceful notice when a provider has no images uploaded yet (e.g. Venni) */
            <div className="text-center py-16 bg-white rounded-3xl border border-wood-border p-8 max-w-xl mx-auto shadow-card">
              <div className="relative w-28 h-14 mx-auto mb-4 bg-wood-cream/50 rounded-2xl p-2 border border-wood-border flex items-center justify-center overflow-hidden">
                <Image
                  src={SUPPLIER_CONFIG[selectedSupplier]?.logo || getEnterpriseLogo(selectedSupplier)}
                  alt={SUPPLIER_CONFIG[selectedSupplier]?.name || selectedSupplier}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                Collection {SUPPLIER_CONFIG[selectedSupplier]?.name}
              </h3>
              <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed mb-6">
                Le nuancier numérique des décors <strong>{SUPPLIER_CONFIG[selectedSupplier]?.name}</strong> est en cours d&apos;actualisation photographique. Nos panneaux et dérivés de cette marque sont d&apos;ores et déjà disponibles en stock direct dans nos dépôts d&apos;Ariana.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-wood-dark text-xs font-bold rounded-xl uppercase tracking-wider transition-all shadow-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Demander le catalogue {SUPPLIER_CONFIG[selectedSupplier]?.name}
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedSupplier('all')}
                  className="px-4 py-2.5 bg-wood-cream hover:bg-wood-border text-primary text-xs font-bold rounded-xl transition-all"
                >
                  Voir tous les fabricants
                </button>
              </div>
            </div>
          ) : (
            /* Standard search empty state */
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm p-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-wood-cream flex items-center justify-center text-accent mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2">
                Aucun décor trouvé
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Aucun décor ne correspond à votre recherche. Essayez de réinitialiser vos filtres ou de chercher un numéro de référence (ex: 327, 111, 6022).
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSupplier('all');
                  setSearchTerm('');
                }}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-wood-dark text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )
        ) : (
          /* Enterprise-Grouped Showcase Layout */
          <div className="space-y-12">
            {filteredGroups.map((group) => {
              const { supplier, config, logo, decors } = group;
              if (decors.length === 0) return null;

              return (
                <div
                  key={supplier}
                  id={`enterprise-${supplier}`}
                  className="bg-white rounded-3xl p-5 sm:p-8 border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Enterprise Header with Logo, Name, and Quick Link */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 mb-6 border-b border-gray-100">
                    <Link
                      href={`/providers/${supplier}`}
                      className="group/brand flex items-center gap-4 sm:gap-5 transition-opacity hover:opacity-95"
                      title={`Découvrir tous les panneaux et décors ${config?.name || supplier}`}
                    >
                      {/* Brand Logo Box */}
                      <div className="relative w-24 h-14 sm:w-28 sm:h-16 shrink-0 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                        <Image
                          src={logo}
                          alt={`Logo ${config?.name || supplier}`}
                          fill
                          className="object-contain p-1.5"
                          sizes="112px"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary group-hover/brand:text-accent transition-colors">
                            {config?.name || supplier.toUpperCase()}
                          </h3>
                          {config?.badgeText && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white shadow-xs"
                              style={{ backgroundColor: config.color }}
                            >
                              {config.badgeText}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-charcoal-light mt-1 max-w-xl line-clamp-2 sm:line-clamp-none">
                          {config?.description}
                        </p>
                      </div>
                    </Link>

                    {/* Counter Pill & Links */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto flex-wrap">
                      <Link
                        href={`/providers/${supplier}`}
                        className="text-xs font-bold text-accent hover:underline flex items-center gap-1 bg-wood-cream/60 px-3 py-1.5 rounded-xl border border-wood-border"
                      >
                        Catalogue {config?.name || supplier} &rarr;
                      </Link>

                      <span className="text-xs font-bold text-charcoal bg-wood-cream/80 border border-wood-border px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: config?.color || '#4A2C0A' }}
                        />
                        {decors.length} {decors.length > 1 ? 'décors' : 'décor'}
                      </span>

                      {config?.website && (
                        <a
                          href={config.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-charcoal-light hover:text-accent font-medium inline-flex items-center gap-1 transition-colors p-1"
                          title={`Site officiel de ${config.name}`}
                        >
                          <span className="hidden md:inline">Site officiel</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 
                    Showroom Decor Cards Grid
                    2 cols on mobile, 3 cols sm, 4 cols md, 5 cols lg, 6 cols xl
                  */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
                    {decors.map((decor) => {
                      const decorUrl = getDecorUrl(decor.supplier, decor.ref);
                      const altText = getDecorAltText(decor.supplierName, decor.name, decor.ref);

                      const cardInner = (
                        <>
                          {/* Decor Image Container with consistent aspect ratio */}
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                            <Image
                              src={decor.src}
                              alt={altText}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              loading="lazy"
                              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />

                            {/* 
                              RULE: ONLY the decor reference should be displayed as a badge.
                              Positioned bottom-right of the image container [111].
                              Small, elegant, readable, visually integrated.
                            */}
                            {decor.ref && (
                              <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold tracking-wider text-white shadow-sm">
                                  {decor.ref}
                                </span>
                              </div>
                            )}

                            {/* Subtle Restrained Hover Overlay with Preview Cue */}
                            <div className="absolute inset-0 bg-[#241508]/75 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5 text-center text-white">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTileClick(decor);
                                  }}
                                  aria-label="Aperçu grand écran"
                                  className="p-1 rounded-md bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-colors"
                                  title="Agrandir en plein écran"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="py-1">
                                <p className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-2 leading-tight">
                                  {decor.name}
                                </p>
                                {decor.ref && (
                                  <p className="text-[10px] font-mono text-accent mt-0.5 tracking-wider font-semibold">
                                    Réf. {decor.ref}
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleTileClick(decor);
                                  }}
                                  className="text-[9px] font-bold text-wood-dark uppercase tracking-wider bg-accent hover:bg-accent-hover py-1 px-2 rounded-md shadow-xs transition-colors"
                                >
                                  Aperçu HD
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Minimalist Decor Info Bar */}
                          <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-gray-100">
                            <h4
                              className="font-heading font-semibold text-xs sm:text-sm text-primary group-hover:text-accent transition-colors leading-tight line-clamp-1"
                              title={decor.name}
                            >
                              {decor.name}
                            </h4>

                            <div className="flex items-center justify-between mt-1 pt-1">
                              <span className="text-[10px] text-charcoal-light/70 truncate font-medium">
                                {decor.supplierName}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-accent group-hover:translate-x-0.5 transition-transform">
                                {decorUrl ? 'Fiche →' : 'HD →'}
                              </span>
                            </div>
                          </div>
                        </>
                      );

                      if (decorUrl) {
                        return (
                          <Link
                            key={decor.id}
                            href={decorUrl}
                            title={`Consulter la fiche détaillée du panneau ${decor.name} ${decor.ref ? `(Réf. ${decor.ref})` : ''}`}
                            className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-wood-border/80 hover:border-accent/60 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            {cardInner}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={decor.id}
                          onClick={() => handleTileClick(decor)}
                          className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-white border border-wood-border/80 hover:border-accent/60 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          {cardInner}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Viewer Component */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName={
          selectedSupplier === 'all'
            ? 'Tous les fabricants'
            : SUPPLIER_CONFIG[selectedSupplier]?.name
        }
      />
    </section>
  );
}
