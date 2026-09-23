// src/lib/artisans.ts
/**
 * @file artisans.ts
 * @description Central service and data provider for Socofeb artisans and portfolio réalisations.
 *
 * Consumes pre-compiled and synchronized `artisans-manifest.json` for high-speed SSG
 * and client/server rendering without bundling Node 'fs' in client components.
 */

import manifestData from './artisans-manifest.json';
import {
  Artisan,
  ArtisanProjectImage,
  ArtisanCategory,
  ArtisanRating,
} from '@/types/artisan';
import { normalizePublicUrl, formatArtisanRating } from './artisans-utils';

export { normalizePublicUrl, formatArtisanRating };

interface ArtisansManifest {
  updatedAt: string;
  totalArtisans: number;
  totalProjects: number;
  artisans: Artisan[];
  allImages: ArtisanProjectImage[];
}

const STATIC_MANIFEST = manifestData as unknown as ArtisansManifest;

/**
 * Retrieves all registered artisans with updated ratings and discovered portfolios.
 */
export function getArtisans(): Artisan[] {
  return STATIC_MANIFEST.artisans;
}

/**
 * Retrieves a single artisan by numeric ID.
 */
export function getArtisanById(id: number | string): Artisan | null {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) return null;

  const artisans = getArtisans();
  return artisans.find((a) => a.id === numericId) || null;
}

/**
 * Aggregates all project images across all artisans for the global portfolio discovery mode.
 */
export function getAllProjectImages(): ArtisanProjectImage[] {
  return STATIC_MANIFEST.allImages || [];
}

/**
 * Aggregates distinct categories across all artisans with photo counts.
 * Filters out categories with zero active photos.
 */
export function getAllGlobalCategories(): ArtisanCategory[] {
  const allImages = getAllProjectImages();
  const categoryMap = new Map<string, { label: string; count: number }>();

  for (const img of allImages) {
    const existing = categoryMap.get(img.category);
    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(img.category, {
        label: img.categoryLabel,
        count: 1,
      });
    }
  }

  const result: ArtisanCategory[] = [];
  categoryMap.forEach((val, key) => {
    result.push({
      id: key,
      label: val.label,
      count: val.count,
    });
  });

  // Sort descending by project count for prominence
  return result.sort((a, b) => b.count - a.count);
}
