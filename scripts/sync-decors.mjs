// scripts/sync-decors.mjs
// Synchronizes decor images and enterprise logos from public/images/* to src/lib/decors-manifest.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.jfif']);
const LOGO_EXTENSIONS = new Set(['.png', '.svg', '.webp', '.jpg', '.jpeg']);
const SUPPLIERS = ['starwood', 'stibois', 'propann', 'mpbs', 'panelia', 'venni', 'agt'];

/**
 * Dynamically extracts product reference code from filename
 */
function extractDecorReference(filename) {
  if (!filename || typeof filename !== 'string') return null;
  const base = path.basename(filename);
  const withoutExt = base.replace(/\.[^/.]+$/, '').trim();

  const lastDashIndex = withoutExt.lastIndexOf('-');
  if (lastDashIndex !== -1) {
    let segment = withoutExt.slice(lastDashIndex + 1).trim();
    segment = segment.replace(/(jpg|jpeg|png|webp|avif|jfif)$/i, '').trim();
    if (/^\d+$/.test(segment)) return segment;
    if (/^[A-Za-z0-9]+$/.test(segment) && /\d/.test(segment)) return segment;
  }

  const spaceMatch = withoutExt.match(/\s+(\d+)$/);
  if (spaceMatch) return spaceMatch[1];

  return null;
}

/**
 * Dynamically extracts clean title from filename
 */
function extractDecorName(filename) {
  if (!filename || typeof filename !== 'string') return '';
  const base = path.basename(filename);
  let name = base.replace(/\.[^/.]+$/, '').trim();

  const ref = extractDecorReference(filename);
  if (ref) {
    const trailingPattern = new RegExp(`[-_\\s]+${ref}(jpg|jpeg|png|webp|avif|jfif)?$`, 'i');
    if (trailingPattern.test(name)) {
      name = name.replace(trailingPattern, '').trim();
    }
  }

  if (name.includes('-') && !name.includes(' ')) {
    name = name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } else {
    name = name.replace(/[-_]+/g, ' ').trim();
  }

  return name;
}

export function scanDecorsAndLogos() {
  const publicDir = path.join(projectRoot, 'public', 'images');
  const manifest = {
    updatedAt: new Date().toISOString(),
    enterprises: {},
  };

  for (const supplier of SUPPLIERS) {
    const supplierDir = path.join(publicDir, supplier);
    const decorsDir = path.join(supplierDir, 'decors');
    const logoDir = path.join(supplierDir, 'logo');

    // 1. Resolve Logo
    let logoPath = null;
    if (fs.existsSync(logoDir)) {
      try {
        const logoFiles = fs.readdirSync(logoDir);
        // Find first valid image file
        const foundLogo = logoFiles.find((f) =>
          LOGO_EXTENSIONS.has(path.extname(f).toLowerCase())
        );
        if (foundLogo) {
          logoPath = `/images/${supplier}/logo/${foundLogo}`;
        }
      } catch (err) {
        console.warn(`[sync-decors] Warning reading logo dir for ${supplier}:`, err);
      }
    }

    // Fallback logo if none in supplier/logo folder
    if (!logoPath) {
      const fallbackUiLogo = `/images/ui/logo-${supplier}.png`;
      const uiLogoPath = path.join(publicDir, 'ui', `logo-${supplier}.png`);
      if (fs.existsSync(uiLogoPath)) {
        logoPath = fallbackUiLogo;
      }
    }

    // 2. Resolve Decors
    const decors = [];
    if (fs.existsSync(decorsDir)) {
      try {
        const files = fs.readdirSync(decorsDir);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (IMAGE_EXTENSIONS.has(ext)) {
            const cleanName = extractDecorName(file);
            const ref = extractDecorReference(file);

            decors.push({
              filename: file,
              name: cleanName || path.basename(file, ext),
              ref: ref,
              src: `/images/${supplier}/decors/${file}`,
              ext: ext.slice(1),
              supplier: supplier,
            });
          }
        }
      } catch (err) {
        console.warn(`[sync-decors] Warning reading decors dir for ${supplier}:`, err);
      }
    }

    // Sort decors alphabetically by name for clean presentation
    decors.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    manifest.enterprises[supplier] = {
      id: supplier,
      logo: logoPath,
      decorsCount: decors.length,
      decors: decors,
    };
  }

  const outputPath = path.join(projectRoot, 'src', 'lib', 'decors-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[sync-decors] Successfully generated decors manifest: ${outputPath}`);
  for (const s of SUPPLIERS) {
    const e = manifest.enterprises[s];
    console.log(` - ${s.toUpperCase()}: ${e.decorsCount} decors, logo: ${e.logo}`);
  }

  return manifest;
}

// Execute if run directly from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  scanDecorsAndLogos();
}
