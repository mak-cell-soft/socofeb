import { Supplier } from './image';

export interface SupplierInfo {
  name: string;
  fullName: string;
  website: string;
  logo: string;
  color: string;
  description: string;
  collections: string[];
  promoFolder: string;
  badgeText?: string;
}

export type SupplierConfigMap = Record<Supplier, SupplierInfo>;
