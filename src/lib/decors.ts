/**
 * Dynamic Decor Reference & Metadata Detection
 * 
 * Centralized logic for parsing decor filenames across all wood & panel providers:
 * - Dynamic reference extraction: takes the final numeric segment after the last dash ('-')
 * - Graceful handling: returns null if no valid reference (never undefined, NaN, or broken strings)
 * - Support for common extensions (.jpg, .jpeg, .png, .webp, .avif, .jfif)
 * - Clean decor name derivation
 * - Canonical decor URL and Alt-text generation
 * - Provider & Reference search/lookup utilities
 */

import { Supplier, SUPPLIERS } from '@/types/image';
import { SUPPLIER_CONFIG } from '@/lib/catalog';
import { DYNAMIC_DECORS_MANIFEST, DynamicDecorItem, getDynamicDecors } from '@/lib/images';

/**
 * Extracts the product reference code from an image filename.
 * 
 * Rule: Reference = final numeric segment after the final '-' before the file extension.
 * Also accommodates alphanumeric codes containing digits (e.g. SL10 for Panelia).
 * 
 * Examples:
 * - "some-decor-name-111.jpg" -> "111"
 * - "modern-oak-panel-245.jpg" -> "245"
 * - "wood-effect-natural-1024.jpg" -> "1024"
 * - "AFRIQUE-327.jpg" -> "327"
 * - "Chêne-Lugano-307jpg.jpg" -> "307"
 * - "Anthracite-SL10.png" -> "SL10"
 * - "Marbre Blanc 6007.webp" -> "6007"
 * - "beton-cire-anthracite.webp" -> null
 */
export function extractDecorReference(filename: string): string | null {
  if (!filename || typeof filename !== 'string') return null;

  // 1. Get base filename without folder path
  const base = filename.split(/[/\\]/).pop() || filename;

  // 2. Remove file extension (e.g. .jpg, .jpeg, .png, .webp, .avif, .jfif)
  const withoutExt = base.replace(/\.[^/.]+$/, '').trim();

  // 3. Find the last dash segment
  const lastDashIndex = withoutExt.lastIndexOf('-');
  if (lastDashIndex !== -1) {
    let segment = withoutExt.slice(lastDashIndex + 1).trim();

    // Clean any accidental extension remnants (e.g., '307jpg' -> '307')
    segment = segment.replace(/(jpg|jpeg|png|webp|avif|jfif)$/i, '').trim();

    // Pure numeric reference (e.g. '111', '245', '1024', '327', '6022')
    if (/^\d+$/.test(segment)) {
      return segment;
    }

    // Alphanumeric provider code containing digits with optional internal spaces
    // (e.g. 'SL10', 'SL02', 'DC01', 'VHG 13', 'VHG 02')
    if (/^[A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*$/.test(segment) && /\d/.test(segment)) {
      return segment.replace(/\s+/g, ' ');
    }
  }

  // 4. Graceful fallback: check if name ends with whitespace and code (e.g., "Marbre Blanc 6007", "Marbre Blanc VHG 12")
  const spaceAlphaMatch = withoutExt.match(/\s+([A-Za-z0-9]+(?:\s+\d+)?)$/);
  if (spaceAlphaMatch && /\d/.test(spaceAlphaMatch[1])) {
    return spaceAlphaMatch[1].replace(/\s+/g, ' ').trim();
  }

  return null;
}

/**
 * Extracts a clean, human-readable decor name from the filename.
 * Removes the trailing reference segment to avoid redundant badges.
 * 
 * Examples:
 * - "AFRIQUE-327.jpg" -> "AFRIQUE"
 * - "Chêne-Français-903.jpg" -> "Chêne Français"
 * - "CHENE NATUREL-396.jpg" -> "CHENE NATUREL"
 * - "Anthracite-6022.webp" -> "Anthracite"
 * - "Marbre Blanc 6007.webp" -> "Marbre Blanc"
 * - "Galaxy Honey-VHG 13.jpg" -> "Galaxy Honey"
 * - "Noir-VHG 02.jpg" -> "Noir"
 * - "beton-cire-anthracite.webp" -> "Béton Ciré Anthracite"
 */
export function extractDecorName(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';

  const base = filename.split(/[/\\]/).pop() || filename;
  let name = base.replace(/\.[^/.]+$/, '').trim();

  // If there's an extracted reference, remove that reference from the end of the name
  const ref = extractDecorReference(filename);
  if (ref) {
    const escapedRef = ref
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '[\\s-_]+');
    const trailingPattern = new RegExp(`[-_\\s]+${escapedRef}(jpg|jpeg|png|webp|avif|jfif)?$`, 'i');
    if (trailingPattern.test(name)) {
      name = name.replace(trailingPattern, '').trim();
    }
  }

  // Replace internal dashes with spaces for clean display if name is kebab-case
  if (name.includes('-') && !name.includes(' ')) {
    name = name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else {
    // Replace any remaining hyphens/underscores with clean space
    name = name.replace(/[-_]+/g, ' ').trim();
  }

  return name;
}

/**
 * Generates the crawlable relative URL for an individual decor page.
 * Returns null if no valid reference code exists to prevent broken links.
 */
export function getDecorUrl(supplier: string, ref?: string | null): string | null {
  if (!ref || typeof ref !== 'string' || !ref.trim()) {
    return null;
  }
  return `/decors/${supplier.toLowerCase().trim()}/${encodeURIComponent(ref.trim())}`;
}

/**
 * Generates descriptive, SEO-optimized image alt text.
 * Rule: Provider + decor name + reference (without keyword stuffing).
 */
export function getDecorAltText(
  supplierName: string,
  decorName?: string,
  ref?: string | null
): string {
  const parts = ['Panneau décoratif', supplierName];
  if (decorName && decorName.trim()) {
    parts.push(decorName.trim());
  }
  if (ref && ref.trim()) {
    parts.push(`référence ${ref.trim()}`);
  }
  return parts.join(' ');
}

/**
 * Finds a specific decor from the dynamic manifest matching provider and reference.
 * Supports exact match, case-insensitive match, normalized match (ignoring spaces/dashes), and numeric code variations.
 */
export function findDecorByRef(
  supplier: string,
  ref: string
): DynamicDecorItem | null {
  const normalizedSupplier = supplier.toLowerCase().trim() as Supplier;
  const decors = getDynamicDecors(normalizedSupplier);
  if (!decors || decors.length === 0) return null;

  const targetRef = ref.toLowerCase().trim();

  // 1. Try exact ref match
  let found = decors.find(
    (d) => d.ref && d.ref.toLowerCase() === targetRef
  );
  if (found) return found;

  // 2. Try matching reference directly from filename
  found = decors.find((d) => {
    const extracted = extractDecorReference(d.filename);
    return extracted && extracted.toLowerCase() === targetRef;
  });
  if (found) return found;

  // 3. Try matching normalized (ignoring spaces, hyphens, and underscores, e.g. 'VHG 13' == 'VHG-13' == 'vhg13')
  const normalizeRef = (r: string) => r.replace(/[\s\-_]+/g, '').toLowerCase();
  const normalizedTarget = normalizeRef(targetRef);
  found = decors.find((d) => {
    const dRef = d.ref || extractDecorReference(d.filename);
    if (!dRef) return false;
    return normalizeRef(dRef) === normalizedTarget;
  });
  if (found) return found;

  // 4. Try matching digits-only if target is pure digits (e.g. '10' for 'SL10')
  const digitsOnly = targetRef.replace(/\D+/g, '');
  if (digitsOnly) {
    found = decors.find((d) => {
      const dRef = d.ref || extractDecorReference(d.filename);
      if (!dRef) return false;
      return dRef.replace(/\D+/g, '') === digitsOnly;
    });
    if (found) return found;
  }

  return null;
}

/**
 * Returns all indexable decors across all suppliers that have a valid reference code.
 * Used by generateStaticParams and dynamic sitemap.
 */
export function getAllIndexableDecors(): {
  supplier: Supplier;
  ref: string;
  decor: DynamicDecorItem;
}[] {
  const results: { supplier: Supplier; ref: string; decor: DynamicDecorItem }[] = [];
  const seen = new Set<string>();

  for (const s of SUPPLIERS) {
    const list = getDynamicDecors(s);
    for (const item of list) {
      const ref = item.ref || extractDecorReference(item.filename);
      if (ref && !seen.has(`${s}-${ref.toLowerCase()}`)) {
        seen.add(`${s}-${ref.toLowerCase()}`);
        results.push({
          supplier: s,
          ref: ref,
          decor: item,
        });
      }
    }
  }

  return results;
}
