/**
 * Dynamic Decor Reference & Metadata Detection
 * 
 * Centralized logic for parsing decor filenames across all wood & panel providers:
 * - Dynamic reference extraction: takes the final numeric segment after the last dash ('-')
 * - Graceful handling: returns null if no valid reference (never undefined, NaN, or broken strings)
 * - Support for common extensions (.jpg, .jpeg, .png, .webp, .avif, .jfif)
 * - Clean decor name derivation
 */

/**
 * Extracts the product reference code from an image filename.
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

    // Alphanumeric provider code containing digits (e.g. 'SL10', 'SL02', 'DC01')
    if (/^[A-Za-z0-9]+$/.test(segment) && /\d/.test(segment)) {
      return segment;
    }
  }

  // 4. Graceful fallback: check if name ends with whitespace and numeric code (e.g., "Marbre Blanc 6007")
  const spaceMatch = withoutExt.match(/\s+(\d+)$/);
  if (spaceMatch) {
    return spaceMatch[1];
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
 * - "beton-cire-anthracite.webp" -> "Béton Ciré Anthracite"
 */
export function extractDecorName(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';

  const base = filename.split(/[/\\]/).pop() || filename;
  let name = base.replace(/\.[^/.]+$/, '').trim();

  // If there's an extracted reference, remove that reference from the end of the name
  const ref = extractDecorReference(filename);
  if (ref) {
    const trailingPattern = new RegExp(`[-_\\s]+${ref}(jpg|jpeg|png|webp|avif|jfif)?$`, 'i');
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
