// src/app/api/contact/route.ts
/**
 * @file route.ts
 * @description API endpoint for handling incoming contact and quote requests.
 * Performs server-side Zod validation, honeypot anti-spam verification, and dispatches
 * the payload to the configured delivery channel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dispatchContactLead } from '@/lib/contact-server';
import { ContactApiResponse } from '@/types/contact';

export const dynamic = 'force-dynamic';

const serverContactSchema = z.object({
  fullName: z
    .string({ required_error: 'Le nom complet est obligatoire.' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères.')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères.'),
  phone: z
    .string({ required_error: 'Le numéro de téléphone est obligatoire.' })
    .trim()
    .min(8, 'Le numéro de téléphone doit comporter au moins 8 caractères.')
    .max(30, 'Le numéro de téléphone ne peut pas dépasser 30 caractères.'),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide.')
    .optional()
    .or(z.literal('')),
  category: z
    .string({ required_error: 'Veuillez sélectionner une catégorie de produit.' })
    .trim()
    .min(1, 'Catégorie requise.')
    .max(50),
  location: z
    .string()
    .trim()
    .max(50)
    .default('both'),
  message: z
    .string({ required_error: 'Veuillez préciser votre demande.' })
    .trim()
    .min(5, 'Votre message doit comporter au moins 5 caractères.')
    .max(3000, 'Votre message ne peut pas dépasser 3000 caractères.'),
  botField: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse<ContactApiResponse>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Format de requête invalide (JSON attendu).' },
        { status: 400 }
      );
    }

    const parseResult = serverContactSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Données du formulaire invalides.';
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Honeypot anti-spam check: If the hidden bot field is filled, silently reject
    if (data.botField && data.botField.trim().length > 0) {
      return NextResponse.json(
        { success: false, message: 'Requête rejetée.' },
        { status: 400 }
      );
    }

    // Dispatch the lead to the delivery engine
    const deliveryResult = await dispatchContactLead(data);

    if (!deliveryResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            deliveryResult.message ||
            "Une erreur est survenue lors de l'enregistrement de votre demande.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[api/contact] Unexpected server error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur serveur inattendue est survenue. Veuillez réessayer plus tard.',
      },
      { status: 500 }
    );
  }
}
