// src/app/api/quote/route.ts
/**
 * @file route.ts
 * @description Dedicated API route for customer quote requests on SOCOFEB.
 * Performs server-side Zod validation, UUID v4 verification, honeypot anti-spam,
 * client IP validation, and proxies the submission to the ACYA backend intake endpoint.
 * Enforces server-controlled source identifier: "socofeb-decor.com".
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendQuoteToAcya } from '@/lib/acya-client';
import { AcyaQuoteRequestDto, QuoteApiResponse } from '@/types/contact';

export const dynamic = 'force-dynamic';

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const serverQuoteSchema = z.object({
  product: z
    .string({ required_error: 'Le produit est obligatoire.' })
    .trim()
    .min(1, 'Le produit est obligatoire.')
    .max(255, 'Le nom du produit ne peut pas dépasser 255 caractères.'),
  quantity: z
    .string({ required_error: 'La quantité souhaitée est obligatoire.' })
    .trim()
    .min(1, 'La quantité souhaitée est obligatoire.')
    .max(100, 'La quantité ne peut pas dépasser 100 caractères.'),
  customerName: z
    .string({ required_error: 'Le nom complet est obligatoire.' })
    .trim()
    .min(2, 'Le nom doit comporter au moins 2 caractères.')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères.'),
  customerEmail: z
    .string({ required_error: "L'adresse email est obligatoire." })
    .trim()
    .email('Adresse email invalide.')
    .max(150, "L'adresse email ne peut pas dépasser 150 caractères."),
  customerPhone: z
    .string()
    .trim()
    .max(50, 'Le numéro de téléphone ne peut pas dépasser 50 caractères.')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .max(2000, 'Votre message ne peut pas dépasser 2000 caractères.')
    .optional()
    .or(z.literal('')),
  idempotencyKey: z
    .string({ required_error: "Clé d'idempotence obligatoire." })
    .regex(UUID_V4_REGEX, "Format d'identifiant d'idempotence invalide (UUID v4 requis)."),
  botField: z.string().optional(),
});

/**
 * Validates whether a string is a well-formed IPv4 or IPv6 address.
 * Prevents header injection when forwarding client addresses to ACYA rate limiter.
 */
function isValidIpAddress(ip: string): boolean {
  if (!ip || ip.length > 45) return false;
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex =
    /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^:((:[0-9a-fA-F]{1,4}){1,7})$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Extracts and validates visitor client IP address.
 * Prioritizes trusted reverse proxy headers (e.g. x-real-ip on Vercel/Nginx)
 * and falls back to first IP in x-forwarded-for.
 */
function getValidatedClientIp(request: NextRequest): string | null {
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp && isValidIpAddress(xRealIp.trim())) {
    return xRealIp.trim();
  }

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstCandidate = xForwardedFor.split(',')[0]?.trim();
    if (firstCandidate && isValidIpAddress(firstCandidate)) {
      return firstCandidate;
    }
  }

  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse<QuoteApiResponse>> {
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

    const parseResult = serverQuoteSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError =
        parseResult.error.errors[0]?.message || 'Données du formulaire invalides.';
      return NextResponse.json({ success: false, message: firstError }, { status: 400 });
    }

    const data = parseResult.data;

    // Honeypot anti-spam check: if botField is filled, silently reject without calling ACYA
    if (data.botField && data.botField.trim().length > 0) {
      return NextResponse.json(
        { success: false, message: 'Requête rejetée.' },
        { status: 400 }
      );
    }

    // Prepare strictly controlled ACYA payload (source is ALWAYS server-controlled)
    const payload: AcyaQuoteRequestDto = {
      product: data.product,
      quantity: data.quantity,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone ? data.customerPhone : undefined,
      message: data.message ? data.message : undefined,
      source: 'socofeb-decor.com',
      idempotencyKey: data.idempotencyKey,
    };

    const clientIp = getValidatedClientIp(request);

    // Dispatch to ACYA client
    const result = await sendQuoteToAcya(payload, clientIp);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message:
            result.message ||
            'Votre demande de devis a été enregistrée avec succès. Notre équipe commerciale traitera votre demande sous 24h.',
        },
        { status: 202 }
      );
    }

    // Failure mapping
    const responseInit: { status: number; headers?: Record<string, string> } = {
      status: result.statusCode || 500,
    };

    if (result.retryAfter) {
      responseInit.headers = { 'Retry-After': String(result.retryAfter) };
    }

    return NextResponse.json(
      {
        success: false,
        message:
          result.message ||
          'Une erreur est survenue lors de la transmission de votre demande.',
        retryAfter: result.retryAfter,
      },
      responseInit
    );
  } catch (error) {
    console.error('[api/quote] Unexpected server exception:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Une erreur serveur inattendue est survenue. Veuillez réessayer plus tard.',
      },
      { status: 500 }
    );
  }
}
