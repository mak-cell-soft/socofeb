// src/lib/artisans-utils.ts
/**
 * @file artisans-utils.ts
 * @description Client-safe utility and formatting functions for artisans and ratings.
 * Contains no Node.js filesystem imports ('fs' or 'path') so it can be safely imported
 * into Client Components ('use client').
 */

import { ArtisanRating } from '@/types/artisan';

/**
 * Normalizes any Windows or relative filesystem path into a browser-safe public URL.
 * NOTE: Required because artisans.json contains Windows backslashes and relative 'socofeb\public\...' paths.
 */
export function normalizePublicUrl(rawPath: string | null | undefined): string | null {
  if (!rawPath || typeof rawPath !== 'string') return null;
  let normalized = rawPath.replace(/\\/g, '/');
  // Strip 'socofeb/public' or 'public'
  normalized = normalized.replace(/^(?:\.\/)?(?:socofeb\/)?public\/?/i, '');
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  return normalized;
}

/**
 * Formats rating display text and empty state according to design guidelines:
 * - Never shows "0.0 ★" when there are no reviews.
 * - Displays "Pas encore d'avis" when reviews are empty.
 */
export function formatArtisanRating(rating: ArtisanRating | null | undefined): {
  displayText: string;
  countText: string;
  hasReviews: boolean;
  score: number;
} {
  if (!rating || rating.average === null || rating.count === 0) {
    return {
      displayText: "Pas encore d'avis",
      countText: '',
      hasReviews: false,
      score: 0,
    };
  }

  return {
    displayText: `${rating.average.toFixed(1)}`,
    countText: `(${rating.count} ${rating.count > 1 ? 'avis' : 'avis'})`,
    hasReviews: true,
    score: rating.average,
  };
}
