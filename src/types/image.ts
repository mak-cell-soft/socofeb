export const SUPPLIERS = ['stibois', 'mpbs', 'propann', 'starwood'] as const;
export type Supplier = typeof SUPPLIERS[number];

export interface MDFDecorImage {
  file: string;
  label: string;
  ref: string;
  colorFamily?: 'bois' | 'uni' | 'matiere' | 'brillant' | 'autre';
  thicknesses?: string[];
}

export interface MDFCategory {
  id: string;
  label: string;
  description: string;
  images: MDFDecorImage[];
  supplier: Supplier;
  subfolder: string;
}

export interface PromoImage {
  file: string;
  label: string;
  discount: string;
  supplier?: Supplier;
  validUntil?: string;
  description?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}
