// scripts/sync-promos.mjs
/**
 * Synchronizes promotional product images from public/images/{supplier}/promo/{discount}/*
 * to src/lib/promos-manifest.json for high-speed SSG builds, Next.js image optimization,
 * and client-side reactive filtering.
 *
 * Excludes legacy marketing banners in root promo folders (e.g. mpbs/promo/*.webp).
 * Only discovers offers from numeric discount subdirectories (e.g. "10", "15", "20").
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.jfif']);
const LOGO_EXTENSIONS = new Set(['.svg', '.png', '.webp', '.jpg', '.jpeg', '.jfif']);
const NON_SUPPLIER_DIRS = new Set(['hero', 'osb', 'produits', 'realisations', 'ui']);

// Known supplier configurations (Core + Extended) for accurate metadata
const SUPPLIER_METADATA = {
  stibois: {
    name: 'STIBOIS',
    color: '#2E7D32',
    badgeText: 'Partenaire Officiel',
    website: 'https://stibois.com',
  },
  mpbs: {
    name: 'MPBS',
    color: '#1565C0',
    badgeText: 'Partenaire Majeur',
    website: 'https://mpbs.com.tn',
  },
  propann: {
    name: 'PROPANN',
    color: '#E65100',
    badgeText: 'Fabricant Tunisien',
    website: 'https://propann.com',
  },
  starwood: {
    name: 'STARWOOD',
    color: '#6A1B9A',
    badgeText: 'Importation Directe',
    website: 'https://www.starwood.com.tr',
  },
  panelia: {
    name: 'Panelia',
    color: '#0284C7',
    badgeText: 'Partenaire Décoration',
    website: 'https://panelia.tn',
  },
  venni: {
    name: 'Venni',
    color: '#D97706',
    badgeText: 'Partenaire Design',
    website: 'https://venni.tn',
  },
  agt: {
    name: 'AGT',
    color: '#DC2626',
    badgeText: 'Importation Directe',
    website: 'https://www.agt.com.tr',
  },
  alfa: {
    name: 'Alfa',
    color: '#0D9488',
    badgeText: 'Partenaire Import',
    website: 'https://alfawood.gr',
  },
  egypanel: {
    name: 'Egypanel',
    color: '#B45309',
    badgeText: 'Partenaire Import',
    website: 'https://egypanel.com',
  },
  evo: {
    name: 'EVO',
    color: '#4338CA',
    badgeText: 'Surfaces Contemporaines',
    website: 'https://evopanel.com',
  },
  stillay: {
    name: 'Stillay',
    color: '#7C3AED',
    badgeText: 'Partenaire Import',
    website: 'https://stillay.com',
  },
};

/**
 * Extracts product reference code from filename (e.g. "Cachemir-729.png" -> "729", "Milani Ceviz-AH03.png" -> "AH03")
 */
function extractReference(filename) {
  if (!filename || typeof filename !== 'string') return null;
  const base = path.basename(filename);
  const withoutExt = base.replace(/\.[^/.]+$/, '').trim();

  const lastDashIndex = withoutExt.lastIndexOf('-');
  if (lastDashIndex !== -1) {
    let segment = withoutExt.slice(lastDashIndex + 1).trim();
    segment = segment.replace(/(jpg|jpeg|png|webp|avif|jfif)$/i, '').trim();

    // Pure numeric code (e.g. 729, 6006, 1298)
    if (/^\d+$/.test(segment)) {
      return segment;
    }

    // Alphanumeric provider code containing digits (e.g. P100, P012, AH03)
    if (/^[A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)*$/.test(segment) && /\d/.test(segment)) {
      return segment.replace(/\s+/g, ' ');
    }
  }

  // Fallback: check trailing whitespace + code
  const spaceMatch = withoutExt.match(/\s+([A-Za-z0-9]+(?:\s+\d+)?)$/);
  if (spaceMatch && /\d/.test(spaceMatch[1])) {
    return spaceMatch[1].replace(/\s+/g, ' ').trim();
  }

  return null;
}

/**
 * Extracts clean, human-readable decor title from filename
 */
function extractTitle(filename) {
  if (!filename || typeof filename !== 'string') return '';
  const base = path.basename(filename);
  let name = base.replace(/\.[^/.]+$/, '').trim();

  const ref = extractReference(filename);
  if (ref) {
    const escapedRef = ref
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '[\\s-_]+');
    const trailingPattern = new RegExp(`[-_\\s]+${escapedRef}(jpg|jpeg|png|webp|avif|jfif)?$`, 'i');
    if (trailingPattern.test(name)) {
      name = name.replace(trailingPattern, '').trim();
    }
  }

  // Remove redundant punctuation / extra dashes
  name = name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return name;
}

/**
 * Resolves the logo for a supplier directory
 */
function resolveSupplierLogo(publicDir, supplier) {
  const logoDir = path.join(publicDir, supplier, 'logo');
  if (fs.existsSync(logoDir)) {
    try {
      const files = fs.readdirSync(logoDir);
      // Prioritize SVG, then PNG, then WebP, then others
      const validFiles = files.filter((f) => LOGO_EXTENSIONS.has(path.extname(f).toLowerCase()));
      const svgLogo = validFiles.find((f) => path.extname(f).toLowerCase() === '.svg');
      if (svgLogo) {
        return `/images/${supplier}/logo/${svgLogo}`;
      }
      const pngLogo = validFiles.find((f) => path.extname(f).toLowerCase() === '.png');
      if (pngLogo) {
        return `/images/${supplier}/logo/${pngLogo}`;
      }
      const webpLogo = validFiles.find((f) => path.extname(f).toLowerCase() === '.webp');
      if (webpLogo) {
        return `/images/${supplier}/logo/${webpLogo}`;
      }
      if (validFiles.length > 0) {
        return `/images/${supplier}/logo/${validFiles[0]}`;
      }
    } catch (e) {
      // Fallback
    }
  }

  // UI logo fallback
  const uiLogo = `/images/ui/logo-${supplier}.png`;
  if (fs.existsSync(path.join(publicDir, 'ui', `logo-${supplier}.png`))) {
    return uiLogo;
  }

  return `/images/${supplier}/logo/${supplier}-logo.png`;
}

/**
 * Main discovery scanner
 */
export async function syncPromotions() {
  const publicDir = path.join(projectRoot, 'public', 'images');
  if (!fs.existsSync(publicDir)) {
    console.error(`[sync-promos] Directory not found: ${publicDir}`);
    return;
  }

  const allEntries = fs.readdirSync(publicDir, { withFileTypes: true });
  const supplierDirs = allEntries
    .filter((entry) => entry.isDirectory() && !NON_SUPPLIER_DIRS.has(entry.name.toLowerCase()))
    .map((entry) => entry.name.toLowerCase())
    .sort();

  const promotions = [];
  const discountSet = new Set();
  const suppliersMap = new Map();

  for (const supplier of supplierDirs) {
    const promoDir = path.join(publicDir, supplier, 'promo');
    if (!fs.existsSync(promoDir)) continue;

    // Scan for numeric discount directories ONLY (e.g. "10", "15", "20")
    let subDirs = [];
    try {
      subDirs = fs.readdirSync(promoDir, { withFileTypes: true });
    } catch (err) {
      console.warn(`[sync-promos] Cannot read promo directory for ${supplier}:`, err);
      continue;
    }

    const discountDirs = subDirs.filter(
      (d) => d.isDirectory() && /^\d+$/.test(d.name)
    );

    // Resolve supplier identity
    const meta = SUPPLIER_METADATA[supplier] || {
      name: supplier.charAt(0).toUpperCase() + supplier.slice(1),
      color: '#555555',
      badgeText: 'Fournisseur Agréé',
      website: '',
    };
    const logoUrl = resolveSupplierLogo(publicDir, supplier);

    let supplierPromoCount = 0;

    for (const discountDir of discountDirs) {
      const discountPercentage = parseInt(discountDir.name, 10);
      discountSet.add(discountPercentage);
      const discountLabel = `-${discountPercentage}%`;

      const targetPath = path.join(promoDir, discountDir.name);
      let files = [];
      try {
        files = fs.readdirSync(targetPath);
      } catch (err) {
        continue;
      }

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!IMAGE_EXTENSIONS.has(ext)) continue;

        const filePath = path.join(targetPath, file);
        let width = null;
        let height = null;
        let format = ext.slice(1);

        try {
          const imageMeta = await sharp(filePath).metadata();
          width = imageMeta.width || null;
          height = imageMeta.height || null;
          format = imageMeta.format || format;
        } catch (e) {
          // Sharp metadata inspection failed, continue with fallback
        }

        const name = extractTitle(file) || path.basename(file, ext).trim();
        const ref = extractReference(file);

        // Safe relative URL for Next.js image rendering
        // Handles trailing spaces and special characters with URI encoding
        const encodedFilename = encodeURIComponent(file);
        const src = `/images/${supplier}/promo/${discountDir.name}/${file}`;
        const encodedSrc = `/images/${supplier}/promo/${discountDir.name}/${encodedFilename}`;

        const id = `${supplier}-${discountPercentage}-${ref || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        promotions.push({
          id,
          supplier,
          supplierName: meta.name,
          supplierLogo: logoUrl,
          supplierColor: meta.color,
          supplierBadge: meta.badgeText,
          supplierWebsite: meta.website,
          filename: file,
          name,
          ref,
          discountPercentage,
          discountLabel,
          src,
          encodedSrc,
          width,
          height,
          format,
        });

        supplierPromoCount++;
      }
    }

    if (supplierPromoCount > 0) {
      suppliersMap.set(supplier, {
        supplier,
        name: meta.name,
        logo: logoUrl,
        color: meta.color,
        badgeText: meta.badgeText,
        website: meta.website,
        count: supplierPromoCount,
      });
    }
  }

  // Sort promotions: by supplier name, then by product name
  promotions.sort((a, b) => {
    const compSupplier = a.supplierName.localeCompare(b.supplierName, undefined, { sensitivity: 'base' });
    if (compSupplier !== 0) return compSupplier;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  const availableDiscounts = Array.from(discountSet).sort((a, b) => a - b);
  const activeSuppliers = Array.from(suppliersMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  );

  const manifest = {
    updatedAt: new Date().toISOString(),
    totalPromotions: promotions.length,
    availableDiscounts,
    suppliers: activeSuppliers,
    promotions,
  };

  const outputPath = path.join(projectRoot, 'src', 'lib', 'promos-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`[sync-promos] Successfully discovered ${promotions.length} promotional products across ${activeSuppliers.length} suppliers.`);
  console.log(`[sync-promos] Discounts found: ${availableDiscounts.map((d) => `-${d}%`).join(', ')}.`);
  console.log(`[sync-promos] Manifest written to: ${outputPath}`);
}

// Auto-run when executed directly via node scripts/sync-promos.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncPromotions().catch((err) => {
    console.error('[sync-promos] Error running promotional synchronization:', err);
    process.exit(1);
  });
}
