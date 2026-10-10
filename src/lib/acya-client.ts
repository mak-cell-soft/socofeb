// src/lib/acya-client.ts
/**
 * @file acya-client.ts
 * @description Server-side HTTP client for communicating with ACYA's public quote-intake API.
 * Handles authentication, timeout control, sanitized error logging, and structured response parsing.
 * NEVER exposes secrets or raw upstream response bodies to client callers.
 */

import type { AcyaQuoteRequestDto } from '../types/contact';

export interface AcyaClientResult {
  success: boolean;
  statusCode: number;
  message?: string;
  retryAfter?: number;
  isRetryable?: boolean;
}

/**
 * Sends a validated quote request to ACYA public quote-intake endpoint.
 *
 * @param payload - Verified quote request DTO
 * @param clientIp - Validated visitor IP address, or null if unverified
 * @returns Result object detailing acceptance or sanitized error state
 */
export async function sendQuoteToAcya(
  payload: AcyaQuoteRequestDto,
  clientIp?: string | null
): Promise<AcyaClientResult> {
  const apiUrl = process.env.ACYA_QUOTE_API_URL;
  const integrationKey = process.env.ACYA_QUOTE_INTEGRATION_KEY;
  const tenantSlug = process.env.ACYA_TENANT_SLUG;

  // 1. Fail safely if server configuration is incomplete
  if (!apiUrl || !integrationKey || !tenantSlug) {
    console.error(
      '[acya-client] Configuration missing: ensure ACYA_QUOTE_API_URL, ACYA_QUOTE_INTEGRATION_KEY, and ACYA_TENANT_SLUG are set.'
    );
    return {
      success: false,
      statusCode: 503,
      isRetryable: false,
      message:
        'Le service de transmission de devis est temporairement indisponible. Veuillez nous contacter directement au +216 99 218 866 ou via WhatsApp.',
    };
  }

  // 2. Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Integration-Key': integrationKey,
    'X-Tenant-Slug': tenantSlug,
  };

  if (clientIp) {
    headers['X-Forwarded-Client-IP'] = clientIp;
  }

  // 3. Finite timeout (10 seconds)
  let signal: AbortSignal;
  let timeoutId: NodeJS.Timeout | null = null;
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    signal = AbortSignal.timeout(10000);
  } else {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 10000);
    signal = controller.signal;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    const statusCode = response.status;

    // HTTP 202: Durable acceptance (or duplicate acceptance)
    if (statusCode === 202) {
      return {
        success: true,
        statusCode: 202,
        message: 'Votre demande de devis a été enregistrée avec succès.',
      };
    }

    // Parse response body safely without assuming JSON
    let responseData: Record<string, unknown> | null = null;
    try {
      const text = await response.text();
      responseData = text ? JSON.parse(text) : null;
    } catch {
      // Non-JSON or empty response
      responseData = null;
    }

    // HTTP 400: Validation error from ACYA
    if (statusCode === 400) {
      const errorMessage =
        typeof responseData?.message === 'string'
          ? responseData.message
          : typeof responseData?.error === 'string'
          ? responseData.error
          : 'Les données de la demande de devis sont invalides.';

      return {
        success: false,
        statusCode: 400,
        isRetryable: false,
        message: errorMessage,
      };
    }

    // HTTP 401 / 403: Authentication or tenant configuration issue
    if (statusCode === 401 || statusCode === 403) {
      console.error(
        `[acya-client] Authentication failure (${statusCode}) when communicating with ACYA for tenant: ${tenantSlug}`
      );
      return {
        success: false,
        statusCode,
        isRetryable: false,
        message:
          'Le service de transmission de devis est momentanément indisponible. Veuillez nous contacter directement au +216 99 218 866.',
      };
    }

    // HTTP 404: Endpoint or tenant not found
    if (statusCode === 404) {
      console.error(
        `[acya-client] ACYA endpoint or tenant not found (404) at configured URL.`
      );
      return {
        success: false,
        statusCode: 404,
        isRetryable: false,
        message:
          'Le service de devis est temporairement inaccessible. Veuillez utiliser notre WhatsApp direct.',
      };
    }

    // HTTP 429: Rate limited
    if (statusCode === 429) {
      let retryAfterSeconds: number | undefined;
      const retryAfterHeader = response.headers.get('Retry-After');
      if (retryAfterHeader) {
        const parsed = parseInt(retryAfterHeader, 10);
        if (!isNaN(parsed) && parsed > 0) {
          retryAfterSeconds = parsed;
        }
      }

      return {
        success: false,
        statusCode: 429,
        isRetryable: true,
        retryAfter: retryAfterSeconds,
        message: retryAfterSeconds
          ? `Trop de requêtes. Veuillez patienter ${retryAfterSeconds} secondes avant de réessayer.`
          : 'Trop de requêtes reçues. Veuillez patienter un instant avant de réessayer.',
      };
    }

    // HTTP 503: DatabaseFailure / temporary upstream failure
    if (statusCode === 503) {
      console.warn('[acya-client] ACYA returned 503 (Database / upstream failure).');
      return {
        success: false,
        statusCode: 503,
        isRetryable: true,
        message:
          'Le serveur de traitement est momentanément surchargé. Votre demande a été conservée, veuillez cliquer à nouveau sur Envoyer.',
      };
    }

    // Any other 5xx or unexpected status
    console.error(`[acya-client] Unexpected response from ACYA (${statusCode}).`);
    return {
      success: false,
      statusCode,
      isRetryable: true,
      message:
        'Une erreur est survenue lors de la transmission. Vos informations sont intactes, veuillez réessayer.',
    };
  } catch (err: unknown) {
    if (timeoutId) clearTimeout(timeoutId);

    const isTimeout =
      err instanceof Error &&
      (err.name === 'TimeoutError' || err.name === 'AbortError');

    if (isTimeout) {
      console.error('[acya-client] Request to ACYA timed out after 10s.');
      return {
        success: false,
        statusCode: 504,
        isRetryable: true,
        message:
          'Délai de connexion dépassé. Veuillez vérifier votre connexion et cliquer sur Envoyer pour réessayer.',
      };
    }

    console.error('[acya-client] Network exception occurred while connecting to ACYA.');
    return {
      success: false,
      statusCode: 500,
      isRetryable: true,
      message:
        'Impossible de joindre le serveur de devis. Veuillez vérifier votre connexion ou nous contacter par WhatsApp.',
    };
  }
}
