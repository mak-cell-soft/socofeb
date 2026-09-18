'use client';

/**
 * DecorGrid Component — SOCOFEB
 * 
 * Dynamic Decor Image Gallery with Enterprise Logos:
 * - Scans and renders decor images directly from each enterprise's `decors/` folder
 * - Extracts decor titles dynamically from the image filename (without extension)
 * - Associates each decor with its enterprise logo from the `logo/` folder
 * - Structures decors by enterprise with dedicated enterprise headers and grids
 * - Responsive grid (2-col mobile, 3-col sm, 4-col md, 5-col lg, 6-col xl)
 * - Supports instant client-side search, brand filtering, and fullscreen HD lightbox
 */

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Sparkles, Layers, RefreshCw, X, ArrowUpRight } from 'lucide-react';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import {
  MDF_CATALOG,
  DYNAMIC_DECORS_MANIFEST,
  getEnterpriseLogo,
  DynamicDecorItem,
  EnterpriseDecorsData,
} from '@/lib/images';
import { Supplier, MDFCategory } from '@/types/image';
import { ImageLightbox, LightboxImageItem } from './ImageLightbox';
import { cn } from '@/lib/utils';

// Unified Decor Card Item
export interface UnifiedDecorItem {
  id: string;
  name: string;          // Filename without extension (e.g. "AFRIQUE 327", "327")
  filename: string;      // Full filename (e.g. "AFRIQUE 327.jpg")
  src: string;           // Browser-ready image path
  supplier: Supplier;    // Enterprise ID ('starwood', 'stibois', etc.)
  supplierName: string;  // Human-readable enterprise name
  supplierLogo: string;  // Path to enterprise logo
  supplierColor: string; // Brand accent color
  collection?: string;   // Optional category/collection name
  ref?: string;          // Product reference code
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
  subtitle = 'Explorez notre sélection complète de décors bois, textures minérales et finitions importées',
  className,
}: DecorGridProps) {
  // Brand filter state
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'all'>(
    initialSupplier || 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Live dynamic manifest state (synced with /api/decors on mount for hot dev additions)
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
   * Build unified decor items for each enterprise:
   * 1. Prioritize images dynamically scanned from public/images/{enterprise}/decors/
   * 2. Derive the decor title directly from the filename (omitting extension)
   * 3. Attach the enterprise's logo from public/images/{enterprise}/logo/
   * 4. If an enterprise has no decors/ folder yet, include existing catalog items as fallback
   */
  const enterpriseGroups = useMemo(() => {
    const suppliers: Supplier[] = ['starwood', 'stibois', 'propann', 'mpbs'];
    const groups: {
      supplier: Supplier;
      config: (typeof SUPPLIER_CONFIG)[Supplier];
      logo: string;
      decors: UnifiedDecorItem[];
    }[] = [];

    suppliers.forEach((sup) => {
      const config = SUPPLIER_CONFIG[sup];
      const manifestEntry = liveManifest[sup];
      // Resolve enterprise logo from manifest first, then fallback to catalog config
      const enterpriseLogo = manifestEntry?.logo || getEnterpriseLogo(sup) || config?.logo;
      const decorsList: UnifiedDecorItem[] = [];

      // Check if enterprise has dynamically discovered images in decors/
      if (manifestEntry && manifestEntry.decors && manifestEntry.decors.length > 0) {
        manifestEntry.decors.forEach((item: DynamicDecorItem, idx: number) => {
          decorsList.push({
            id: `${sup}-${item.filename}`,
            name: item.name, // e.g., "AFRIQUE 327" from "AFRIQUE 327.jpg"
            filename: item.filename,
            src: item.src,
            supplier: sup,
            supplierName: config?.name || sup.toUpperCase(),
            supplierLogo: enterpriseLogo,
            supplierColor: config?.color || '#4A2C0A',
            collection: 'Collection Décors',
            ref: `${sup.toUpperCase().slice(0, 2)}-${String(idx + 1).padStart(3, '0')}`,
          });
        });
      } else {
        // Fallback: If no files in decors/ yet, preserve existing catalog decors for this brand
        const catalogCategories: MDFCategory[] = MDF_CATALOG[sup] || [];
        catalogCategories.forEach((cat) => {
          cat.images.forEach((img, idx) => {
            // Remove file extension to derive label if needed
            const derivedName = img.label || img.file.replace(/\.[^/.]+$/, '');
            decorsList.push({
              id: `${sup}-${cat.id}-${img.file}`,
              name: derivedName,
              filename: img.file,
              src: `/images/${sup}/${cat.subfolder}/${img.file}`,
              supplier: sup,
              supplierName: config?.name || sup.toUpperCase(),
              supplierLogo: enterpriseLogo,
              supplierColor: config?.color || '#4A2C0A',
              collection: cat.label,
              ref: img.ref || `${sup.toUpperCase().slice(0, 2)}-${String(idx + 1).padStart(3, '0')}`,
            });
          });
        });
      }

      // Only push groups that have decors available
      if (decorsList.length > 0) {
        groups.push({
          supplier: sup,
          config,
          logo: enterpriseLogo,
          decors: decorsList,
        });
      }
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
      .filter((group) => group.decors.length > 0);
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
      ref: d.ref,
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
    <section className={cn('py-12 bg-[#F9F6F0] relative overflow-hidden', className)}>
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

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
          <p className="text-charcoal-light text-base sm:text-lg mt-3 font-normal">
            {subtitle}
          </p>
        </div>

        {/* Filter and Search Bar */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 mb-10 border border-wood-border">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Supplier Selection Tabs */}
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedSupplier('all')}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5',
                    selectedSupplier === 'all'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-wood-cream/70 text-charcoal hover:bg-wood-border/60'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Tous les fabricants
                </button>

                {(['starwood', 'stibois', 'propann', 'mpbs'] as Supplier[]).map((sup) => {
                  const cfg = SUPPLIER_CONFIG[sup];
                  const manifestEntry = liveManifest[sup];
                  const isSelected = selectedSupplier === sup;
                  const count =
                    manifestEntry?.decorsCount ||
                    enterpriseGroups.find((g) => g.supplier === sup)?.decors.length ||
                    0;

                  return (
                    <button
                      key={sup}
                      type="button"
                      onClick={() => setSelectedSupplier(sup)}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border',
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
                        className="w-2 h-2 rounded-full ring-2 ring-white/50"
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
              <div className="relative min-w-[260px] sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom (ex: 327, chêne)..."
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

        {/* Total Decors Counter Summary */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="text-xs sm:text-sm font-semibold text-charcoal flex items-center gap-2">
            <span className="text-accent font-extrabold text-base sm:text-lg">
              {totalDecorsCount}
            </span>
            <span className="text-charcoal-light">
              décors répertoriés
              {selectedSupplier !== 'all' && (
                <>
                  {' '}
                  pour la marque{' '}
                  <strong className="text-primary font-bold">
                    {SUPPLIER_CONFIG[selectedSupplier]?.name}
                  </strong>
                </>
              )}
              {searchTerm && (
                <>
                  {' '}
                  correspondant à &ldquo;<span className="text-primary">{searchTerm}</span>&rdquo;
                </>
              )}
            </span>
          </div>

          <span className="text-xs text-charcoal-light hidden sm:inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-accent" />
            Cliquez sur un décor pour l&apos;afficher en haute définition
          </span>
        </div>

        {/* Empty State when no items match filters */}
        {filteredGroups.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm p-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-wood-cream flex items-center justify-center text-accent mb-4">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-heading text-xl font-bold text-primary mb-2">
              Aucun décor trouvé
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Aucun décor ne correspond à votre recherche. Essayez de réinitialiser vos filtres ou de modifier votre terme de recherche.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedSupplier('all');
                setSearchTerm('');
              }}
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-wood-dark text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          /* Enterprise-Grouped Layout */
          <div className="space-y-14">
            {filteredGroups.map((group) => {
              const { supplier, config, logo, decors } = group;

              return (
                <div
                  key={supplier}
                  id={`enterprise-${supplier}`}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-wood-border shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  {/* Enterprise Header with Official Logo and Description */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 mb-6 border-b border-gray-100">
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* Enterprise Logo Display */}
                      <div className="relative w-24 h-14 sm:w-32 sm:h-16 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                        <Image
                          src={logo}
                          alt={`Logo ${config?.name || supplier}`}
                          fill
                          className="object-contain p-1.5"
                          sizes="128px"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
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
                    </div>

                    {/* Enterprise Counter Pill & Website Link */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-charcoal bg-wood-cream/80 border border-wood-border px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
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
                          title={`Visiter le site officiel de ${config.name}`}
                        >
                          <span className="hidden md:inline">Site officiel</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Decor Cards Gallery Grid: 2 cols mobile, 3 cols sm, 4 cols md, 5 cols lg, 6 cols xl */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5">
                    {decors.map((decor) => (
                      <motion.div
                        key={decor.id}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        onClick={() => handleTileClick(decor)}
                        className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer bg-white border border-wood-border/70 hover:border-accent shadow-xs hover:shadow-xl transition-all duration-300"
                      >
                        {/* Decor Image Container with consistent aspect ratio */}
                        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                          <Image
                            src={decor.src}
                            alt={decor.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                          />

                          {/* Subtle Brand Logo Pill in Top Corner */}
                          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md rounded-lg px-2 py-1 shadow-sm border border-black/5 opacity-90 group-hover:opacity-100 transition-opacity">
                            <span
                              className="text-[9px] font-extrabold uppercase tracking-wider block leading-none"
                              style={{ color: decor.supplierColor }}
                            >
                              {decor.supplierName}
                            </span>
                          </div>

                          {/* Hover Overlay with Fullscreen Preview Cue */}
                          <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col justify-between p-3 text-center text-white">
                            <div className="flex justify-end">
                              <span className="p-1 rounded-lg bg-accent/20 text-accent">
                                <Eye className="w-4 h-4" />
                              </span>
                            </div>

                            <div className="py-2">
                              <p className="font-heading font-bold text-sm sm:text-base text-white line-clamp-2 leading-tight">
                                {decor.name}
                              </p>
                              {decor.ref && (
                                <p className="text-[10px] font-mono text-accent mt-1 tracking-wider">
                                  {decor.ref}
                                </p>
                              )}
                            </div>

                            <span className="text-[10px] font-bold text-wood-dark uppercase tracking-wider bg-accent/90 hover:bg-accent py-1.5 px-2 rounded-lg shadow-xs">
                              Aperçu HD
                            </span>
                          </div>
                        </div>

                        {/* Decor Info Bar (Name derived from filename without extension) */}
                        <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-gray-100">
                          <h4
                            className="font-heading font-semibold text-xs sm:text-sm text-primary group-hover:text-accent transition-colors leading-tight line-clamp-1"
                            title={decor.name}
                          >
                            {decor.name}
                          </h4>

                          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-gray-50">
                            <span className="text-[10px] font-mono text-charcoal-light/70 truncate">
                              {decor.ref || decor.supplierName}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-accent group-hover:translate-x-0.5 transition-transform">
                              HD &rarr;
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Viewer Component */}
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
