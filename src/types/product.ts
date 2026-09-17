import { Supplier } from './image';

export interface BaseProduct {
  id: string;
  name: string;
  slug: string;
  imagePath: string;
  coverImage: string;
  description?: string;
}

export interface SolidWoodProduct extends BaseProduct {
  essence: string;
  usages: string[];
  sections: string[];
  finishes: string[];
}

export interface MDFProduct extends BaseProduct {
  specs: {
    densite?: string;
    classe?: string;
    norme?: string;
    finition?: string;
    surface?: string;
  };
  epaisseurs: number[];
  formats: string[];
  suppliers: Supplier[];
  decors?: boolean;
}

export interface PlywoodProduct extends BaseProduct {
  specs: {
    essence?: string;
    colle?: string;
    norme?: string;
  };
  epaisseurs: number[];
  formats: string[];
  suppliers: Supplier[];
}

export interface OSBProduct extends BaseProduct {
  specs: {
    classe: string;
    norme: string;
    colle: string;
    bande: string;
  };
  epaisseurs: number[];
  formats: string[];
  suppliers: Supplier[];
  usages: string[];
}

export type Product = SolidWoodProduct | MDFProduct | PlywoodProduct | OSBProduct;

export interface ProductCategoryGroup {
  id: string;
  label: string;
  slug: string;
  icon: string;
  description: string;
  products: Product[];
}
