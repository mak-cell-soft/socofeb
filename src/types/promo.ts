// src/types/promo.ts
/**
 * TypeScript types for SOCOFEB Promotional Architecture
 */

export interface PromoProduct {
  id: string;
  supplier: string;
  supplierName: string;
  supplierLogo: string;
  supplierColor: string;
  supplierBadge?: string;
  supplierWebsite?: string;
  filename: string;
  name: string;
  ref: string | null;
  discountPercentage: number;
  discountLabel: string;
  src: string;
  encodedSrc: string;
  width?: number | null;
  height?: number | null;
  format?: string;
}

export interface PromoSupplierSummary {
  supplier: string;
  name: string;
  logo: string;
  color: string;
  badgeText?: string;
  website?: string;
  count: number;
}

export interface PromosManifest {
  updatedAt: string;
  totalPromotions: number;
  availableDiscounts: number[];
  suppliers: PromoSupplierSummary[];
  promotions: PromoProduct[];
}
