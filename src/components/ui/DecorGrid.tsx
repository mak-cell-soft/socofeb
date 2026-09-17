'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Eye, Check } from 'lucide-react';
import { MDF_CATALOG, getImagePath } from '@/lib/images';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { Supplier, MDFCategory, MDFDecorImage } from '@/types/image';
import { ImageLightbox, LightboxImageItem } from './ImageLightbox';
import { cn } from '@/lib/utils';

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
  subtitle = 'Explorez notre sélection de décors bois, teintes unies et matières',
  className,
}: DecorGridProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | 'all'>(
    initialSupplier || 'all'
  );
  const [selectedCollection, setSelectedCollection] = useState<string>(
    initialCategory || 'all'
  );
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Flatten and build all decor items with full paths
  const allDecors = useMemo(() => {
    const list: (MDFDecorImage & {
      supplier: Supplier;
      categoryLabel: string;
      categoryId: string;
      src: string;
      supplierName: string;
    })[] = [];

    const suppliersToSearch: Supplier[] =
      selectedSupplier === 'all'
        ? ['stibois', 'mpbs', 'propann', 'starwood']
        : [selectedSupplier];

    suppliersToSearch.forEach((sup) => {
      const categories: MDFCategory[] = MDF_CATALOG[sup] || [];
      categories.forEach((cat) => {
        cat.images.forEach((img) => {
          list.push({
            ...img,
            supplier: sup,
            categoryLabel: cat.label,
            categoryId: cat.id,
            src: getImagePath(sup, cat.subfolder, img.file),
            supplierName: SUPPLIER_CONFIG[sup]?.name || sup.toUpperCase(),
          });
        });
      });
    });

    return list;
  }, [selectedSupplier]);

  // Available collections based on current supplier
  const availableCollections = useMemo(() => {
    if (selectedSupplier === 'all') {
      const set = new Map<string, string>();
      (['stibois', 'mpbs', 'propann', 'starwood'] as Supplier[]).forEach((s) => {
        (MDF_CATALOG[s] || []).forEach((c) => set.set(c.id, c.label));
      });
      return Array.from(set.entries()).map(([id, label]) => ({ id, label }));
    }
    return (MDF_CATALOG[selectedSupplier] || []).map((c) => ({
      id: c.id,
      label: c.label,
    }));
  }, [selectedSupplier]);

  // Filter items
  const filteredDecors = useMemo(() => {
    return allDecors.filter((d) => {
      if (selectedCollection !== 'all' && d.categoryId !== selectedCollection) {
        return false;
      }
      if (selectedFamily !== 'all' && d.colorFamily !== selectedFamily) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          d.label.toLowerCase().includes(query) ||
          d.ref.toLowerCase().includes(query) ||
          d.categoryLabel.toLowerCase().includes(query) ||
          d.supplierName.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allDecors, selectedCollection, selectedFamily, searchTerm]);

  // Transform for Lightbox
  const lightboxItems: LightboxImageItem[] = useMemo(() => {
    return filteredDecors.map((d) => ({
      src: d.src,
      label: d.label,
      ref: d.ref,
      thicknesses: d.thicknesses,
      supplier: d.supplierName,
      collection: d.categoryLabel,
    }));
  }, [filteredDecors]);

  const handleTileClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const activeSupplierName =
    selectedSupplier === 'all'
      ? 'Toutes les marques'
      : SUPPLIER_CONFIG[selectedSupplier]?.name;

  return (
    <section className={cn('py-12 bg-wood-cream/50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            Nuancier Haute Précision
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary mt-3 mb-4">
            {title}
          </h2>
          <p className="text-charcoal-light text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Filters Bar */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-card p-6 mb-8 border border-wood-border">
            {/* Row 1: Brand selector & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              {/* Supplier Tabs */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => {
                    setSelectedSupplier('all');
                    setSelectedCollection('all');
                  }}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0',
                    selectedSupplier === 'all'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-wood-cream text-charcoal hover:bg-wood-border'
                  )}
                >
                  Tous les fabricants
                </button>
                {(['stibois', 'mpbs', 'propann', 'starwood'] as Supplier[]).map(
                  (sup) => {
                    const cfg = SUPPLIER_CONFIG[sup];
                    const isSelected = selectedSupplier === sup;
                    return (
                      <button
                        key={sup}
                        onClick={() => {
                          setSelectedSupplier(sup);
                          setSelectedCollection('all');
                        }}
                        className={cn(
                          'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border',
                          isSelected
                            ? 'text-white shadow-sm'
                            : 'bg-wood-cream text-charcoal hover:bg-wood-border border-transparent'
                        )}
                        style={{
                          backgroundColor: isSelected ? cfg.color : undefined,
                          borderColor: isSelected ? cfg.color : undefined,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isSelected ? '#FFFFFF' : cfg.color,
                          }}
                        />
                        {cfg.name}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher nom, réf, style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-gray-50/50"
                />
              </div>
            </div>

            {/* Row 2: Collections & Color families */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              {/* Collection Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-charcoal-light mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
                  Collection :
                </span>
                <button
                  onClick={() => setSelectedCollection('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                    selectedCollection === 'all'
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                  )}
                >
                  Toutes
                </button>
                {availableCollections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                      selectedCollection === col.id
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                    )}
                  >
                    {col.label}
                  </button>
                ))}
              </div>

              {/* Color Family filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-charcoal-light mr-1">
                  Famille :
                </span>
                {[
                  { id: 'all', label: 'Toutes' },
                  { id: 'bois', label: 'Bois' },
                  { id: 'uni', label: 'Unis' },
                  { id: 'matiere', label: 'Matières' },
                  { id: 'brillant', label: 'Brillants' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFamily(f.id)}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs transition-all',
                      selectedFamily === f.id
                        ? 'bg-accent text-wood-dark font-bold'
                        : 'text-gray-500 hover:text-charcoal'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Status Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="text-xs sm:text-sm font-semibold text-charcoal">
            <span className="text-accent font-bold text-base">
              {filteredDecors.length}
            </span>{' '}
            décors disponibles —{' '}
            <span className="text-primary font-bold">
              {activeSupplierName}
            </span>
            {selectedCollection !== 'all' && (
              <span className="text-charcoal-light">
                {' '}
                ·{' '}
                {availableCollections.find((c) => c.id === selectedCollection)
                  ?.label}
              </span>
            )}
          </div>
          <span className="text-xs text-charcoal-light hidden sm:inline">
            Cliquez sur un décor pour l&apos;afficher en haute définition
          </span>
        </div>

        {/* 150x150 Decor Grid (6 columns desktop, 3 columns mobile) */}
        {filteredDecors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">
              Aucun décor ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSelectedSupplier('all');
                setSelectedCollection('all');
                setSelectedFamily('all');
                setSearchTerm('');
              }}
              className="mt-3 px-4 py-2 bg-accent text-wood-dark text-xs font-bold rounded-lg uppercase tracking-wider"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredDecors.map((decor, idx) => (
              <motion.div
                key={`${decor.supplier}-${decor.ref}-${idx}`}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTileClick(idx)}
                className="group relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-card-hover border border-wood-border bg-white transition-all duration-300"
              >
                {/* Decor Texture Image */}
                <Image
                  src={decor.src}
                  alt={decor.label}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />

                {/* Always-visible subtle bottom gradient bar with ref */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wood-dark/85 via-wood-dark/40 to-transparent p-2 text-left pointer-events-none">
                  <p className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate">
                    {decor.label}
                  </p>
                  <p className="text-[9px] font-mono text-accent truncate">
                    {decor.ref}
                  </p>
                </div>

                {/* Hover overlay with full information */}
                <div className="absolute inset-0 bg-primary/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5 text-center text-white">
                  <div className="flex justify-between items-center">
                    <span
                      className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded text-white"
                      style={{
                        backgroundColor:
                          SUPPLIER_CONFIG[decor.supplier]?.color || '#4A2C0A',
                      }}
                    >
                      {decor.supplierName}
                    </span>
                    <Eye className="w-3.5 h-3.5 text-accent" />
                  </div>

                  <div>
                    <p className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-2">
                      {decor.label}
                    </p>
                    <p className="text-[10px] font-mono text-accent mt-0.5">
                      {decor.ref}
                    </p>
                  </div>

                  <span className="text-[9px] font-semibold text-gray-200 uppercase tracking-wider bg-black/40 py-1 rounded">
                    Aperçu HD
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Viewer */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName={activeSupplierName}
      />
    </section>
  );
}
