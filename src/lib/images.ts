// src/lib/images.ts
// Source unique de vérité pour tous les chemins d'images

import { Supplier, MDFCategory, PromoImage } from '@/types/image';

export const IMG_BASE = '/images';

export const SUPPLIERS = ['stibois', 'mpbs', 'propann', 'starwood'] as const;

// Builder de chemin image
export function getImagePath(
  supplier: Supplier | 'bois' | 'osb' | 'hero' | 'ui',
  category: string,
  filename: string
): string {
  return `${IMG_BASE}/${supplier}/${category}/${filename}`;
}

// Chemin promo d'un fournisseur
export function getPromoPath(supplier: Supplier, filename: string): string {
  return `${IMG_BASE}/${supplier}/promo/${filename}`;
}

// Catalogue complet des décors MDF par fournisseur
export const MDF_CATALOG: Record<Supplier, MDFCategory[]> = {
  stibois: [
    {
      id: 'earth-line',
      label: 'Earth Line',
      description: 'Décors naturels, bois et matières organiques',
      images: [
        { file: 'chene-naturel.webp',     label: 'Chêne Naturel',      ref: 'STI-EL-001', colorFamily: 'bois', thicknesses: ['18mm', '19mm'] },
        { file: 'noyer-brun.webp',        label: 'Noyer Brun',         ref: 'STI-EL-002', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'acacia-miel.webp',       label: 'Acacia Miel',        ref: 'STI-EL-003', colorFamily: 'bois', thicknesses: ['16mm', '18mm'] },
        { file: 'bouleau-blanche.webp',   label: 'Bouleau Blanc',      ref: 'STI-EL-004', colorFamily: 'bois', thicknesses: ['18mm'] },
      ],
      supplier: 'stibois',
      subfolder: 'mdf-stratifie',
    },
    {
      id: 'color-line',
      label: 'Color Line',
      description: 'Teintes unies et laquées contemporaines',
      images: [
        { file: 'blanc-arctic.webp',      label: 'Blanc Arctic',       ref: 'STI-CL-001', colorFamily: 'uni', thicknesses: ['8mm', '18mm'] },
        { file: 'gris-perle.webp',        label: 'Gris Perle',         ref: 'STI-CL-002', colorFamily: 'uni', thicknesses: ['18mm'] },
        { file: 'noir-mat.webp',          label: 'Noir Mat',           ref: 'STI-CL-003', colorFamily: 'uni', thicknesses: ['18mm'] },
        { file: 'anthracite.webp',        label: 'Anthracite',         ref: 'STI-CL-004', colorFamily: 'uni', thicknesses: ['18mm', '22mm'] },
        { file: 'bleu-nuit.webp',         label: 'Bleu Nuit',          ref: 'STI-CL-005', colorFamily: 'uni', thicknesses: ['18mm'] },
      ],
      supplier: 'stibois',
      subfolder: 'mdf-stratifie',
    },
    {
      id: 'inspire-line',
      label: 'Inspire Line',
      description: 'Matières industrielles — béton, métal, pierre',
      images: [
        { file: 'beton-clair.webp',       label: 'Béton Clair',        ref: 'STI-IL-001', colorFamily: 'matiere', thicknesses: ['18mm'] },
        { file: 'beton-fonce.webp',       label: 'Béton Foncé',        ref: 'STI-IL-002', colorFamily: 'matiere', thicknesses: ['18mm'] },
        { file: 'ardoise.webp',           label: 'Ardoise',            ref: 'STI-IL-003', colorFamily: 'matiere', thicknesses: ['18mm'] },
        { file: 'marbre-blanc.webp',      label: 'Marbre Blanc',       ref: 'STI-IL-004', colorFamily: 'matiere', thicknesses: ['18mm'] },
      ],
      supplier: 'stibois',
      subfolder: 'mdf-stratifie',
    },
    {
      id: 'spark-line',
      label: 'Spark Line',
      description: 'Effets scintillants et pailletés premium',
      images: [
        { file: 'diamant-silver.webp',    label: 'Diamant Silver',     ref: 'STI-SL-001', colorFamily: 'brillant', thicknesses: ['18mm'] },
        { file: 'nacre-blanc.webp',       label: 'Nacre Blanc',        ref: 'STI-SL-002', colorFamily: 'brillant', thicknesses: ['18mm'] },
      ],
      supplier: 'stibois',
      subfolder: 'mdf-stratifie',
    },
  ],
  mpbs: [
    {
      id: 'melamine',
      label: 'Panneaux Mélaminés',
      description: 'Large gamme de décors MPBS',
      images: [
        { file: 'chene-clair.webp',       label: 'Chêne Clair',        ref: 'MP-ML-001', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'noyer-fonce.webp',       label: 'Noyer Foncé',        ref: 'MP-ML-002', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'blanc-pur.webp',         label: 'Blanc Pur',          ref: 'MP-ML-003', colorFamily: 'uni', thicknesses: ['8mm', '16mm', '18mm'] },
      ],
      supplier: 'mpbs',
      subfolder: 'melamine',
    },
    {
      id: 'acrylic',
      label: 'Panneaux Acryliques',
      description: 'Finition ultra-lisse et brillante',
      images: [
        { file: 'blanc-acrylique.webp',   label: 'Blanc Acrylique',    ref: 'MP-AC-001', colorFamily: 'brillant', thicknesses: ['18mm'] },
        { file: 'noir-acrylique.webp',    label: 'Noir Acrylique',     ref: 'MP-AC-002', colorFamily: 'brillant', thicknesses: ['18mm'] },
        { file: 'gris-acier.webp',        label: 'Gris Acier',         ref: 'MP-AC-003', colorFamily: 'matiere', thicknesses: ['18mm'] },
      ],
      supplier: 'mpbs',
      subfolder: 'acrylic',
    },
    {
      id: 'high-gloss-mpbs',
      label: 'High Gloss MPBS',
      description: 'Surfaces miroir haute brillance',
      images: [
        { file: 'blanc-gloss.webp',       label: 'Blanc Gloss',        ref: 'MP-HG-001', colorFamily: 'brillant', thicknesses: ['18mm'] },
        { file: 'rouge-gloss.webp',       label: 'Rouge Gloss',        ref: 'MP-HG-002', colorFamily: 'brillant', thicknesses: ['18mm'] },
      ],
      supplier: 'mpbs',
      subfolder: 'high-gloss',
    },
  ],
  propann: [
    {
      id: 'mdf-propann',
      label: 'Gamme PROPANN',
      description: 'Panneaux MDF et dérivés PROPANN',
      images: [
        { file: 'mdf-brut-16mm.webp',     label: 'MDF Brut 16mm',      ref: 'PR-MDF-001', colorFamily: 'bois', thicknesses: ['16mm'] },
        { file: 'mdf-brut-18mm.webp',     label: 'MDF Brut 18mm',      ref: 'PR-MDF-002', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'mdf-stratifie.webp',     label: 'MDF Stratifié',      ref: 'PR-STR-001', colorFamily: 'uni', thicknesses: ['18mm'] },
      ],
      supplier: 'propann',
      subfolder: 'mdf',
    },
  ],
  starwood: [
    {
      id: 'decors-import',
      label: 'Décors Import',
      description: 'Décors haut de gamme importés de Turquie',
      images: [
        { file: 'beton-cire-anthracite.webp', label: 'Béton Ciré',     ref: 'SW-DC-001', colorFamily: 'matiere', thicknesses: ['18mm'] },
        { file: 'parquet-chene.webp',         label: 'Parquet Chêne',  ref: 'SW-DC-002', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'marbre-calacatta.webp',      label: 'Calacatta',      ref: 'SW-DC-003', colorFamily: 'matiere', thicknesses: ['18mm'] },
      ],
      supplier: 'starwood',
      subfolder: 'decors',
    },
    {
      id: 'stratifie-starwood',
      label: 'Stratifiés STARWOOD',
      description: 'Panneaux stratifiés premium',
      images: [
        { file: 'noyer-turc.webp',        label: 'Noyer Turc',         ref: 'SW-ST-001', colorFamily: 'bois', thicknesses: ['18mm'] },
        { file: 'orme-gris.webp',         label: 'Orme Gris',          ref: 'SW-ST-002', colorFamily: 'bois', thicknesses: ['18mm'] },
      ],
      supplier: 'starwood',
      subfolder: 'stratifie',
    },
  ],
};

// Promotions par fournisseur
export const PROMO_IMAGES: Record<Supplier, PromoImage[]> = {
  stibois: [
    { file: 'promo-mdf-juillet.webp',     label: 'Offre MDF Juillet',       discount: '-15%', supplier: 'stibois', description: 'Remise exceptionnelle sur toute la gamme Stipan Earth Line' },
    { file: 'promo-high-gloss.webp',      label: 'High Gloss en Promo',     discount: '-20%', supplier: 'stibois', description: 'Surfaces brillantes laquées blanc et coloris exclusifs' },
  ],
  mpbs: [
    { file: 'promo-melamine-ete.webp',    label: 'Mélaminés été',           discount: '-10%', supplier: 'mpbs', description: 'Sur stock disponible en épaisseurs 16mm et 18mm' },
  ],
  propann: [
    { file: 'promo-mdf-brut.webp',        label: 'MDF Brut déstockage',     discount: '-25%', supplier: 'propann', description: 'Tarif direct usine pour les commandes de palettes complètes' },
  ],
  starwood: [
    { file: 'promo-decors-import.webp',   label: 'Décors Import en Promo',  discount: '-12%', supplier: 'starwood', description: 'Collection exclusive importée de Turquie' },
  ],
};
