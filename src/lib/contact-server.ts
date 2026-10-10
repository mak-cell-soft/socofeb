// src/lib/contact-server.ts
/**
 * @file contact-server.ts
 * @description Server-side dispatch engine for SOCOFEB contact and quote leads.
 * Handles HTML escaping, rich transactional email templating, Resend API integration,
 * webhook dispatch, and delivery confirmation.
 */

import { ContactFormData, PRODUCT_CATEGORY_LABELS, DEPOT_LOCATION_LABELS } from '@/types/contact';

/**
 * Escapes untrusted user input to protect HTML email clients against injection.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface DeliveryResult {
  success: boolean;
  message?: string;
  deliveredBy?: 'resend' | 'webhook' | 'dev-console';
}

/**
 * Generates editorial luxury HTML email adhering to SOCOFEB visual tokens.
 */
function buildLeadEmailHtml(data: ContactFormData): string {
  const categoryLabel = PRODUCT_CATEGORY_LABELS[data.category] || data.category;
  const locationLabel = DEPOT_LOCATION_LABELS[data.location] || data.location;
  const safeName = escapeHtml(data.fullName);
  const safePhone = escapeHtml(data.phone);
  const safeEmail = data.email ? escapeHtml(data.email) : 'Non renseigné';
  const safeCategory = escapeHtml(categoryLabel);
  const safeLocation = escapeHtml(locationLabel);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');
  const now = new Date().toLocaleString('fr-FR', {
    timeZone: 'Africa/Tunis',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Nouvelle demande de devis SOCOFEB</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF6EE; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E4D5B8; box-shadow: 0 4px 24px rgba(74, 44, 10, 0.08);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #4A2C0A; padding: 28px 32px; border-bottom: 3px solid #C8922A;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #C8922A; text-transform: uppercase;">SOCOFEB DÉCOR — DEMANDE DE DEVIS</span>
                    <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">Nouveau contact client web</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Summary Pill -->
          <tr>
            <td style="padding: 24px 32px 10px 32px;">
              <div style="background-color: #FAF6EE; border: 1px solid #E4D5B8; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #7B4F1E;">
                <strong>Horodatage (Tunis) :</strong> ${now}
              </div>
            </td>
          </tr>

          <!-- Lead Details Table -->
          <tr>
            <td style="padding: 10px 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #7B4F1E; font-weight: 600; width: 35%;">Client :</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #333333; font-weight: 700;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #7B4F1E; font-weight: 600;">Téléphone :</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #4A2C0A; font-weight: 700;">
                    <a href="tel:${safePhone}" style="color: #4A2C0A; text-decoration: underline;">${safePhone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #7B4F1E; font-weight: 600;">Email :</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #333333;">
                    ${data.email ? `<a href="mailto:${safeEmail}" style="color: #7B4F1E; text-decoration: underline;">${safeEmail}</a>` : 'Non renseigné'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #7B4F1E; font-weight: 600;">Famille Produit :</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #333333; font-weight: 600;">
                    <span style="background-color: #FAF6EE; border: 1px solid #E4D5B8; padding: 2px 8px; border-radius: 6px; color: #4A2C0A;">${safeCategory}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #7B4F1E; font-weight: 600;">Dépôt Souhaité :</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #F0E6D2; color: #333333;">${safeLocation}</td>
                </tr>
              </table>

              <!-- Message Block -->
              <div style="margin-top: 20px;">
                <span style="display: block; font-size: 13px; font-weight: 700; color: #4A2C0A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Détails &amp; Spécifications :</span>
                <div style="background-color: #FAF6EE; border-left: 4px solid #C8922A; border-radius: 6px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #333333;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Action Callout -->
              <div style="margin-top: 24px; text-align: center;">
                <a href="https://wa.me/${safePhone.replace(/[^0-9]/g, '')}" style="display: inline-block; background-color: #25D366; color: #FFFFFF; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-right: 8px;">
                  Répondre sur WhatsApp
                </a>
                <a href="tel:${safePhone}" style="display: inline-block; background-color: #4A2C0A; color: #FFFFFF; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
                  Appeler le client
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6EE; padding: 18px 32px; border-top: 1px solid #E4D5B8; text-align: center; font-size: 12px; color: #7B4F1E;">
              Ce message a été généré automatiquement par le formulaire de contact de <a href="https://www.socofeb-decor.com" style="color: #4A2C0A; font-weight: 700; text-decoration: none;">SOCOFEB DÉCOR</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds plain-text fallback for email clients without HTML support.
 */
function buildLeadEmailText(data: ContactFormData): string {
  const categoryLabel = PRODUCT_CATEGORY_LABELS[data.category] || data.category;
  const locationLabel = DEPOT_LOCATION_LABELS[data.location] || data.location;
  const now = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Tunis' });

  return [
    `=== NOUVELLE DEMANDE DE DEVIS — SOCOFEB ===`,
    `Horodatage : ${now}`,
    ``,
    `Client : ${data.fullName}`,
    `Téléphone : ${data.phone}`,
    `Email : ${data.email || 'Non renseigné'}`,
    `Catégorie : ${categoryLabel}`,
    `Dépôt : ${locationLabel}`,
    ``,
    `Message & Dimensions :`,
    `${data.message}`,
    ``,
    `Source : https://www.socofeb-decor.com/contact`,
  ].join('\n');
}

/**
 * Dispatches a lead to the configured production provider (Resend, Webhook, or local dev logger).
 */
export async function dispatchContactLead(data: ContactFormData): Promise<DeliveryResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const isDevMode =
    process.env.NODE_ENV === 'development' && process.env.CONTACT_DEV_MODE === 'true';

  const categoryLabel = PRODUCT_CATEGORY_LABELS[data.category] || data.category;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'contact@socofeb.tn';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'SOCOFEB Devis <onboarding@resend.dev>';
  const subject = `Nouvelle demande de devis (${categoryLabel}) — ${data.fullName}`;
  const html = buildLeadEmailHtml(data);
  const text = buildLeadEmailText(data);

  // 1. Primary: Resend REST API integration (Zero external library dependencies)
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: data.email ? data.email : undefined,
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        return { success: true, deliveredBy: 'resend' };
      }

      const errorPayload = await res.json().catch(() => ({}));
      console.error('[contact-server] Resend API error response:', res.status, errorPayload);
      return {
        success: false,
        message:
          "Erreur lors de la transmission via le service d'email. Veuillez utiliser notre WhatsApp direct.",
      };
    } catch (err) {
      console.error('[contact-server] Resend fetch exception:', err);
      return {
        success: false,
        message: 'Erreur réseau lors de la transmission du message.',
      };
    }
  }

  // 2. Secondary: Webhook URL dispatch (Slack / Discord / CRM forwarding)
  if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'socofeb-decor.com',
          data,
          categoryLabel,
          timestamp: new Date().toISOString(),
        }),
      });

      if (webhookRes.ok) {
        return { success: true, deliveredBy: 'webhook' };
      }

      console.error('[contact-server] Webhook error response:', webhookRes.status);
      return {
        success: false,
        message: "Échec de transmission vers le serveur d'alerte.",
      };
    } catch (err) {
      console.error('[contact-server] Webhook exception:', err);
      return {
        success: false,
        message: 'Erreur réseau lors de la transmission vers le webhook.',
      };
    }
  }

  // 3. Local Development Simulation (strictly disabled in production)
  if (isDevMode) {
    console.log('\n[DEV CONTACT LOG] New quote request received:');
    console.log(text);
    console.log('[DEV CONTACT LOG] (CONTACT_DEV_MODE=true simulated successful acceptance)\n');
    return { success: true, deliveredBy: 'dev-console' };
  }

  // 4. No delivery provider configured: fail safely with explicit error
  console.error(
    '[contact-server] No email provider configured: Neither RESEND_API_KEY nor CONTACT_WEBHOOK_URL is defined.'
  );
  return {
    success: false,
    message:
      "Le service de transmission de devis en ligne n'est pas configuré. Veuillez contacter directement notre responsable par WhatsApp ou téléphone au +216 99 218 866.",
  };
}
