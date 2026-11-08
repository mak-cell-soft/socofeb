// src/lib/promos.ts
/**
 * Promotional Architecture Helpers and Data Access
 *
 * Consumes the build-time generated promos-manifest.json.
 * Provides type-safe filtering, supplier grouping, and WhatsApp quote message generation.
 */

import { COMPANY_INFO } from '@/lib/catalog';
import { PromoProduct, PromoSupplierSummary, PromosManifest } from '@/types/promo';
import promosManifestData from './promos-manifest.json';

export const PROMOS_MANIFEST: PromosManifest = promosManifestData as PromosManifest;

/**
 * Returns all active promotional products discovered from public/images/*\/promo\/{discount}\/*
 */
export function getAllPromotions(): PromoProduct[] {
  return PROMOS_MANIFEST.promotions || [];
}

/**
 * Returns all suppliers that have at least one active promotional product
 */
export function getActivePromoSuppliers(): PromoSupplierSummary[] {
  return PROMOS_MANIFEST.suppliers || [];
}

/**
 * Returns the list of discovered discount percentages (e.g. [10])
 */
export function getAvailableDiscounts(): number[] {
  return PROMOS_MANIFEST.availableDiscounts || [];
}

/**
 * Builds a contextual, courteous WhatsApp quote & availability request URL
 * Meets Requirement 5: requests availability and quotation without implying guaranteed reservation
 */
export function buildPromoWhatsAppUrl(promo: PromoProduct): string {
  const refText = promo.ref ? ` (Réf. ${promo.ref})` : '';
  const message = `Bonjour SOCOFEB, je souhaite vérifier la disponibilité et obtenir un devis pour le panneau en promotion : ${promo.name}${refText} avec la remise de ${promo.discountLabel} (Marque : ${promo.supplierName}).`;

  return `${COMPANY_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Search and filter utility for promotions
 */
export function filterPromotions(
  promos: PromoProduct[],
  filters: {
    supplier?: string | 'all';
    discount?: number | 'all';
    search?: string;
  }
): PromoProduct[] {
  const { supplier = 'all', discount = 'all', search = '' } = filters;
  const cleanSearch = search.trim().toLowerCase();

  return promos.filter((item) => {
    // Supplier filter
    if (supplier !== 'all' && item.supplier.toLowerCase() !== supplier.toLowerCase()) {
      return false;
    }

    // Discount filter
    if (discount !== 'all' && item.discountPercentage !== discount) {
      return false;
    }

    // Search query: matches product name, reference, or supplier name
    if (cleanSearch) {
      const matchName = item.name.toLowerCase().includes(cleanSearch);
      const matchRef = item.ref ? item.ref.toLowerCase().includes(cleanSearch) : false;
      const matchSupplier = item.supplierName.toLowerCase().includes(cleanSearch);
      if (!matchName && !matchRef && !matchSupplier) {
        return false;
      }
    }

    return true;
  });
}
