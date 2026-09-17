import { create } from 'zustand';
import { Supplier } from '@/types/image';

interface FilterState {
  selectedSupplier: Supplier | 'all';
  selectedColorFamily: 'all' | 'bois' | 'uni' | 'matiere' | 'brillant';
  selectedCollection: string | 'all';
  searchQuery: string;
  selectedThickness: string | 'all';

  // Lightbox global state
  lightboxOpen: boolean;
  lightboxIndex: number;
  lightboxImages: { src: string; label: string; ref?: string; thicknesses?: string[]; supplier?: string }[];
  lightboxSupplierName?: string;

  // Actions
  setSelectedSupplier: (supplier: Supplier | 'all') => void;
  setSelectedColorFamily: (family: 'all' | 'bois' | 'uni' | 'matiere' | 'brillant') => void;
  setSelectedCollection: (collection: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSelectedThickness: (thickness: string | 'all') => void;
  resetFilters: () => void;

  openLightbox: (
    images: { src: string; label: string; ref?: string; thicknesses?: string[]; supplier?: string }[],
    index: number,
    supplierName?: string
  ) => void;
  closeLightbox: () => void;
  setLightboxIndex: (index: number) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedSupplier: 'all',
  selectedColorFamily: 'all',
  selectedCollection: 'all',
  searchQuery: '',
  selectedThickness: 'all',

  lightboxOpen: false,
  lightboxIndex: 0,
  lightboxImages: [],
  lightboxSupplierName: undefined,

  setSelectedSupplier: (supplier) => set({ selectedSupplier: supplier }),
  setSelectedColorFamily: (family) => set({ selectedColorFamily: family }),
  setSelectedCollection: (collection) => set({ selectedCollection: collection }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedThickness: (thickness) => set({ selectedThickness: thickness }),
  resetFilters: () =>
    set({
      selectedSupplier: 'all',
      selectedColorFamily: 'all',
      selectedCollection: 'all',
      searchQuery: '',
      selectedThickness: 'all',
    }),

  openLightbox: (images, index, supplierName) =>
    set({
      lightboxOpen: true,
      lightboxIndex: index,
      lightboxImages: images,
      lightboxSupplierName: supplierName,
    }),
  closeLightbox: () => set({ lightboxOpen: false }),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),
}));
