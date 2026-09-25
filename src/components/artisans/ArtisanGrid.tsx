// src/components/artisans/ArtisanGrid.tsx
'use client';

/**
 * @file ArtisanGrid.tsx
 * @description Searchable and filterable grid of Socofeb artisans.
 *
 * Implements:
 * - Search by first name or last name.
 * - Dynamic category filtering based on actual active specialties.
 * - Responsive grid layout (1 col mobile, 2 cols tablet, 3-4 cols desktop).
 * - Empty state with reset button.
 */

import React, { useState, useMemo } from 'react';
import { Search, X, Users } from 'lucide-react';
import { Artisan, ArtisanCategory } from '@/types/artisan';
import { ArtisanCard } from './ArtisanCard';

interface ArtisanGridProps {
  artisans: Artisan[];
  availableCategories: ArtisanCategory[];
}

export function ArtisanGrid({ artisans, availableCategories }: ArtisanGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter artisans based on search input and selected specialty
  const filteredArtisans = useMemo(() => {
    return artisans.filter((artisan) => {
      // Name, company or activities search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        artisan.fullName.toLowerCase().includes(query) ||
        artisan.prenom.toLowerCase().includes(query) ||
        artisan.nom.toLowerCase().includes(query) ||
        Boolean(artisan.societyName?.toLowerCase().includes(query)) ||
        Boolean(artisan.activities?.toLowerCase().includes(query));

      // Specialty category match
      const matchesCategory =
        selectedCategory === 'all' ||
        artisan.categories.some((c) => c.id === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [artisans, searchQuery, selectedCategory]);

  return (
    <section id="artisans-section" className="py-16 sm:py-24 bg-white border-b border-wood-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Artisans Menuisiers &amp; Agenceurs · نجار محترف في تونس
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-3">
            Nos artisans menuisiers et agenceurs partenaires
          </h2>
          <p className="text-charcoal-light text-base sm:text-lg">
            Des maîtres artisans du bois et de l&apos;aménagement intérieur. De la conception sur mesure à la fabrication et pose de cuisines, dressings, mobilier et menuiseries, confiez votre projet à un artisan menuisier qualifié en Tunisie.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-wood-cream rounded-2xl p-4 sm:p-6 border border-wood-border mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-light absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un artisan (nom, prénom)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-wood-border text-sm text-primary placeholder-charcoal-light/70 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal-light hover:text-primary rounded-full hover:bg-wood-cream"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-primary border-wood-border hover:bg-wood-cream'
              }`}
            >
              Tous
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-primary border-wood-border hover:bg-wood-cream'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Artisans Responsive Grid */}
        {filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArtisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        ) : (
          // Empty Search Results State
          <div className="bg-wood-cream rounded-3xl p-10 sm:p-14 text-center border border-wood-border max-w-xl mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-white flex items-center justify-center border border-wood-border text-charcoal-light mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold text-primary mb-2">
              Aucun artisan trouvé
            </h3>
            <p className="text-sm text-charcoal-light mb-6">
              Aucun artisan ne correspond à vos critères de recherche &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
