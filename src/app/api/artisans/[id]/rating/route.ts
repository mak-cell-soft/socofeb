// src/app/api/artisans/[id]/rating/route.ts
/**
 * @file route.ts
 * @description API endpoint for querying and submitting artisan ratings with server-side validation
 * and anonymous visitor rate-limiting / anti-abuse token handling.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getArtisanById } from '@/lib/artisans';
import { saveArtisanRating } from '@/lib/artisans-server';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * Helper to retrieve or generate a persistent visitor fingerprint token.
 */
function getOrCreateVisitorId(request: NextRequest): { visitorId: string; isNew: boolean } {
  const existingCookie = request.cookies.get('socofeb_vid')?.value;
  if (existingCookie && existingCookie.length > 8) {
    return { visitorId: existingCookie, isNew: false };
  }

  // Generate a random cryptographic identifier
  const newId = crypto.randomBytes(16).toString('hex');
  return { visitorId: newId, isNew: true };
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const artisan = getArtisanById(params.id);
    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan introuvable' },
        { status: 404 }
      );
    }

    const ratedCookie = request.cookies.get(`socofeb_rated_${params.id}`)?.value;
    const hasRated = ratedCookie === 'true';

    return NextResponse.json({
      success: true,
      data: {
        artisanId: artisan.id,
        rating: artisan.rating,
        hasRated,
      },
    });
  } catch (error) {
    console.error(`[api/artisans/${params.id}/rating] GET Error:`, error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la lecture des avis' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const artisanId = parseInt(params.id, 10);
    if (isNaN(artisanId)) {
      return NextResponse.json(
        { success: false, error: 'ID artisan invalide' },
        { status: 400 }
      );
    }

    const artisan = getArtisanById(artisanId);
    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan introuvable' },
        { status: 404 }
      );
    }

    // Check if visitor has already rated this artisan via cookie
    const alreadyRatedCookie = request.cookies.get(`socofeb_rated_${artisanId}`)?.value;
    if (alreadyRatedCookie === 'true') {
      return NextResponse.json(
        {
          success: false,
          error: 'Vous avez déjà donné votre note pour cet artisan.',
          rating: artisan.rating,
        },
        { status: 429 }
      );
    }

    // Parse and validate rating
    const body = await request.json();
    const ratingValue = Number(body.rating);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5 || !Number.isInteger(ratingValue)) {
      return NextResponse.json(
        { success: false, error: 'La note doit être un nombre entier entre 1 et 5.' },
        { status: 400 }
      );
    }

    const { visitorId, isNew } = getOrCreateVisitorId(request);

    // Save mathematically to server data store
    const result = await saveArtisanRating(artisanId, ratingValue, visitorId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message, rating: { average: result.average, count: result.count } },
        { status: 429 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      data: {
        average: result.average,
        count: result.count,
        userRating: ratingValue,
      },
    });

    // Set visitor identifier cookie (lasts 1 year)
    if (isNew) {
      response.cookies.set('socofeb_vid', visitorId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    // Set cookie remembering that this artisan was rated
    response.cookies.set(`socofeb_rated_${artisanId}`, 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error(`[api/artisans/${params.id}/rating] POST Error:`, error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'enregistrement de l'avis" },
      { status: 500 }
    );
  }
}
