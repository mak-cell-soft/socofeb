// src/app/api/artisans/route.ts
/**
 * @file route.ts
 * @description API endpoint returning all registered artisans with dynamic categories and ratings.
 */

import { NextResponse } from 'next/server';
import { getArtisans } from '@/lib/artisans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const artisans = getArtisans();
    return NextResponse.json({
      success: true,
      data: {
        artisans,
      },
      meta: {
        total: artisans.length,
      },
    });
  } catch (error) {
    console.error('[api/artisans] Error fetching artisans:', error);
    return NextResponse.json(
      { success: false, error: 'Impossible de récupérer la liste des artisans' },
      { status: 500 }
    );
  }
}
