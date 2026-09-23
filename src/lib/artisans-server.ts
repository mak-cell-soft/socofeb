// src/lib/artisans-server.ts
/**
 * @file artisans-server.ts
 * @description Server-only operations for artisan ratings and data persistence.
 * Safe to use in Route Handlers and Server Components.
 */

import fs from 'fs';
import path from 'path';
import { VisitorRatingRecord } from '@/types/artisan';

/**
 * Reads live ratings data from src/data/ratings.json when running on the server.
 */
export function getLiveRatingsMap(): Record<string, { average: number | null; count: number; ratings: VisitorRatingRecord[] }> {
  try {
    const ratingsFile = path.join(process.cwd(), 'src', 'data', 'ratings.json');
    if (fs.existsSync(ratingsFile)) {
      const content = fs.readFileSync(ratingsFile, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('[artisans-server] Unable to read live ratings.json:', err);
  }
  return {};
}

/**
 * Records a visitor rating in the server datastore with anti-abuse verification.
 * NOTE: C# API contract assumption: When a dedicated backend rating microservice is deployed,
 * this function will forward the payload to POST /api/artisans/{id}/ratings.
 */
export async function saveArtisanRating(
  artisanId: number,
  score: number,
  visitorId: string
): Promise<{ success: boolean; average: number; count: number; message: string }> {
  if (score < 1 || score > 5) {
    throw new Error('La note doit être comprise entre 1 et 5 étoiles.');
  }

  const ratingsFilePath = path.join(process.cwd(), 'src', 'data', 'ratings.json');
  let ratingsData: Record<string, { average: number | null; count: number; ratings: VisitorRatingRecord[] }> = {};

  if (fs.existsSync(ratingsFilePath)) {
    try {
      ratingsData = JSON.parse(fs.readFileSync(ratingsFilePath, 'utf8'));
    } catch (e) {
      ratingsData = {};
    }
  }

  const key = String(artisanId);
  if (!ratingsData[key]) {
    ratingsData[key] = {
      average: null,
      count: 0,
      ratings: [],
    };
  }

  const artisanRecord = ratingsData[key];

  // Anti-abuse: Check if this visitor already rated
  const alreadyRated = artisanRecord.ratings.some((r) => r.visitorId === visitorId);
  if (alreadyRated) {
    return {
      success: false,
      average: artisanRecord.average || score,
      count: artisanRecord.count,
      message: 'Vous avez déjà évalué cet artisan.',
    };
  }

  // Append new review
  artisanRecord.ratings.push({
    visitorId,
    rating: score,
    createdAt: new Date().toISOString(),
  });

  // Calculate new mathematical average
  const totalScore = artisanRecord.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  const newCount = artisanRecord.ratings.length;
  const newAverage = Math.round((totalScore / newCount) * 10) / 10;

  artisanRecord.average = newAverage;
  artisanRecord.count = newCount;

  // Persist updated records
  try {
    fs.writeFileSync(ratingsFilePath, JSON.stringify(ratingsData, null, 2), 'utf8');
  } catch (err) {
    console.error('[artisans-server] Failed writing ratings.json:', err);
  }

  return {
    success: true,
    average: newAverage,
    count: newCount,
    message: 'Merci pour votre avis !',
  };
}
