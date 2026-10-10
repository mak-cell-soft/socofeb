// src/types/contact.ts
/**
 * @file contact.ts
 * @description Type definitions for SOCOFEB contact and quote request payloads,
 * validation schemas, and server response contracts.
 */

export interface ContactFormData {
  fullName: string;
  phone: string;
  email?: string;
  category: string;
  location: string;
  message: string;
  botField?: string; // Honeypot anti-spam
}

export interface ContactApiResponse {
  success: boolean;
  message?: string;
}

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  mdf: 'MDF & Panneaux décoratifs',
  'bois-massifs': 'Bois Massifs (Chêne, Hêtre, etc.)',
  contreplaque: 'Contreplaqué Structurel / Marine',
  osb: 'OSB/3 Norme EN 300',
  autre: 'Autre demande spécifique',
};

export const DEPOT_LOCATION_LABELS: Record<string, string> = {
  both: 'Peu importe / Premier disponible',
  jaafer: 'Siège — Route de Raoued Km3 (Jâafer)',
  'sidi-amor': 'Point de Vente — Route de Gammarth Km9 (Sidi Amor)',
};
