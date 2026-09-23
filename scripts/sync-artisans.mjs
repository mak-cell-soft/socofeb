// scripts/sync-artisans.mjs
/**
 * Synchronizes artisans and project realization images from public/images/realisations/
 * to src/lib/artisans-manifest.json for high-speed SSG builds and client hydration.
 *
 * Scans directories dynamically and filters out empty categories.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.jfif']);

// Category name mapping for consistent French typography
const CATEGORY_LABELS = {
  cuisine: 'Cuisine',
  cuisines: 'Cuisine',
  dressing: 'Dressing',
  dressings: 'Dressing',
  meuble: 'Meubles',
  meubles: 'Meubles',
  porte: 'Portes',
  portes: 'Portes',
  claustra: 'Claustras',
  claustras: 'Claustras',
  bureau: 'Bureaux',
  bureaux: 'Bureaux',
  salon: 'Salon',
  chambre: 'Chambre',
};

/**
 * Normalizes Windows file paths from JSON to clean browser-facing URLs.
 * Example: "socofeb\\public\\images\\realisations\\profile\\walid-siffi.jpeg"
 *       -> "/images/realisations/profile/walid-siffi.jpeg"
 */
function normalizePublicUrl(rawPath) {
  if (!rawPath || typeof rawPath !== 'string') return null;
  let normalized = rawPath.replace(/\\/g, '/');
  // Strip 'socofeb/public' or 'public'
  normalized = normalized.replace(/^(?:\.\/)?(?:socofeb\/)?public\/?/i, '');
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  return normalized;
}

/**
 * Capitalizes category keys nicely if not found in dictionary
 */
function formatCategoryLabel(key) {
  const lower = key.toLowerCase().trim();
  if (CATEGORY_LABELS[lower]) {
    return CATEGORY_LABELS[lower];
  }
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function syncArtisans() {
  const artisansJsonPath = path.join(projectRoot, 'public', 'images', 'realisations', 'artisans.json');
  const ratingsJsonPath = path.join(projectRoot, 'src', 'data', 'ratings.json');
  const manifestOutputPath = path.join(projectRoot, 'src', 'lib', 'artisans-manifest.json');

  if (!fs.existsSync(artisansJsonPath)) {
    console.error(`[sync-artisans] Warning: artisans.json not found at ${artisansJsonPath}`);
    return;
  }

  const rawArtisansFile = JSON.parse(fs.readFileSync(artisansJsonPath, 'utf8'));
  const rawList = rawArtisansFile.data?.artisans || [];

  // Read ratings if available
  let ratingsMap = {};
  if (fs.existsSync(ratingsJsonPath)) {
    try {
      ratingsMap = JSON.parse(fs.readFileSync(ratingsJsonPath, 'utf8'));
    } catch (err) {
      console.warn('[sync-artisans] Could not parse ratings.json, using defaults.');
    }
  }

  const artisans = [];
  const allImages = [];

  for (const raw of rawList) {
    const prenom = (raw.prenom || '').trim();
    const nom = (raw.nom || '').trim();
    const fullName = [prenom, nom].filter(Boolean).join(' ') || `Artisan #${raw.id}`;

    // Normalize profile photo URL
    const profileUrl = normalizePublicUrl(raw.profile);

    // Identify images directory on filesystem
    const artisanImagesDir = path.join(projectRoot, 'public', 'images', 'realisations', 'images', String(raw.id));

    const categories = [];
    const artisanImages = [];

    if (fs.existsSync(artisanImagesDir)) {
      try {
        const subDirs = fs.readdirSync(artisanImagesDir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        for (const subDir of subDirs) {
          const catDirPath = path.join(artisanImagesDir, subDir);
          const files = fs.readdirSync(catDirPath)
            .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

          // RULE: Do not display empty categories!
          if (files.length === 0) {
            continue;
          }

          const catId = subDir.toLowerCase();
          const catLabel = formatCategoryLabel(catId);

          categories.push({
            id: catId,
            label: catLabel,
            count: files.length,
          });

          for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            const baseName = path.basename(file, ext);
            const imageItem = {
              id: `artisan-${raw.id}-${catId}-${baseName}`,
              src: `/images/realisations/images/${raw.id}/${subDir}/${file}`,
              category: catId,
              categoryLabel: catLabel,
              artisanId: raw.id,
              artisanName: fullName,
              alt: `Réalisation ${catLabel.toLowerCase()} sur mesure par ${fullName} — Socofeb Décor`,
              filename: file,
            };

            artisanImages.push(imageItem);
            allImages.push(imageItem);
          }
        }
      } catch (err) {
        console.warn(`[sync-artisans] Error reading directory for artisan ${raw.id}:`, err);
      }
    }

    // Sort categories: Cuisine, Dressing, Meubles, Portes etc.
    categories.sort((a, b) => b.count - a.count);

    // Ratings resolution
    const artisanRatingData = ratingsMap[String(raw.id)] || { average: null, count: 0 };
    const rating = {
      average: typeof artisanRatingData.average === 'number' ? artisanRatingData.average : null,
      count: typeof artisanRatingData.count === 'number' ? artisanRatingData.count : 0,
    };

    artisans.push({
      id: raw.id,
      nom: raw.nom,
      prenom: raw.prenom,
      fullName,
      profile: profileUrl,
      phones: {
        primary: raw.phones?.primary || null,
        secondary: raw.phones?.secondary || null,
      },
      socials: {
        facebook: raw.socials?.facebook || null,
        instagram: raw.socials?.instagram || null,
      },
      imagesDir: raw.images ? normalizePublicUrl(raw.images) : null,
      categories,
      images: artisanImages,
      totalProjects: artisanImages.length,
      rating,
      bio: raw.id === 1
        ? "Maître menuisier et agenceur d'intérieur spécialisé dans les dressings haut de gamme, cuisines sur mesure et mobilier architectural en panneaux bois nobles."
        : undefined,
    });
  }

  // Compile final manifest
  const manifest = {
    updatedAt: new Date().toISOString(),
    totalArtisans: artisans.length,
    totalProjects: allImages.length,
    artisans,
    allImages,
  };

  fs.writeFileSync(manifestOutputPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`[sync-artisans] Successfully generated artisans manifest: ${manifestOutputPath}`);
  for (const art of artisans) {
    const catsStr = art.categories.map((c) => `${c.label} (${c.count})`).join(', ') || 'Aucune catégorie';
    console.log(` - Artisan #${art.id} (${art.fullName}): ${art.totalProjects} photos [${catsStr}]`);
  }
}

syncArtisans();
