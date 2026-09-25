// src/types/artisan.ts
/**
 * Type definitions for Socofeb Décor Artisans & Réalisations portfolio experience.
 * Establishes strong typing for artisan profiles, category discovery, project imagery,
 * and visitor rating metrics.
 */

// Phone contact numbers structure matching artisans.json
export interface ArtisanPhones {
  primary: string | null;
  secondary: string | null;
}

// Social media links structure matching artisans.json
export interface ArtisanSocials {
  facebook: string | null;
  instagram: string | null;
}

// Aggregated rating metric consumed by UI
export interface ArtisanRating {
  average: number | null; // e.g. 4.8 or null if unrated (never 0.0)
  count: number;          // total number of reviews
}

// Single visitor rating record stored on the server
export interface VisitorRatingRecord {
  visitorId: string;      // Anonymous hashed token or user ID
  rating: number;         // 1 to 5 stars
  createdAt: string;      // ISO timestamp
}

// Category summary dynamically discovered from the artisan's image folders
export interface ArtisanCategory {
  id: string;             // Raw folder key (e.g. 'dressing', 'meubles', 'portes')
  label: string;          // Human-readable capitalized label (e.g. 'Dressing', 'Meubles', 'Portes')
  count: number;          // Number of valid photos in this category
}

// Individual project image metadata with category and artisan associations
export interface ArtisanProjectImage {
  id: string;             // Unique identifier e.g. 'artisan-1-dressing-dress1'
  src: string;            // Clean public browser URL e.g. '/images/realisations/images/1/dressing/dress1.jpeg'
  category: string;       // Normalized category ID e.g. 'dressing'
  categoryLabel: string;  // Formatted label e.g. 'Dressing'
  artisanId: number;      // Associated artisan ID
  artisanName: string;    // Associated artisan full name
  artisanSociety?: string | null; // Associated company (e.g. 'Racine Cuisine')
  title: string;          // Human & SEO descriptive project title (e.g. 'Cuisine moderne sur mesure')
  description?: string;   // Contextual project description
  alt: string;            // Descriptive accessibility & SEO alt text
  filename: string;       // Original image filename
}

// Complete artisan entity with discovered categories and images
export interface Artisan {
  id: number;
  nom: string;
  prenom: string;
  fullName: string;
  societyName?: string | null;
  activities?: string | null;
  profile: string | null; // Clean public browser URL or null
  phones: ArtisanPhones;
  socials: ArtisanSocials;
  imagesDir: string | null;
  categories: ArtisanCategory[];
  images: ArtisanProjectImage[];
  totalProjects: number;
  rating: ArtisanRating;
  bio?: string;
}

// Raw shape of artisan entry as stored in public/images/realisations/artisans.json
export interface RawArtisanItem {
  id: number;
  nom: string;
  prenom: string;
  society_name?: string | null;
  activities?: string | null;
  profile: string | null;
  phones: ArtisanPhones;
  socials: ArtisanSocials;
  images: string | null;
}

// Raw wrapper structure in artisans.json
export interface RawArtisansData {
  data: {
    artisans: RawArtisanItem[];
  };
  meta: {
    total: number;
  };
}
