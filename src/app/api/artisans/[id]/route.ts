// src/app/api/artisans/[id]/route.ts
/**
 * @file route.ts
 * @description API endpoint returning detailed artisan data by ID, including their project portfolio.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArtisanById } from '@/lib/artisans';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const artisan = getArtisanById(params.id);

    if (!artisan) {
      return NextResponse.json(
        { success: false, error: `Artisan avec l'ID ${params.id} introuvable.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: artisan,
    });
  } catch (error) {
    console.error(`[api/artisans/${params.id}] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération de l'artisan." },
      { status: 500 }
    );
  }
}
