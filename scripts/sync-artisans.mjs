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

const CANONICAL_CATEGORY_IDS = {
  cuisine: 'cuisines',
  cuisines: 'cuisines',
  dressing: 'dressing',
  dressings: 'dressing',
  meuble: 'meubles',
  meubles: 'meubles',
  porte: 'portes',
  portes: 'portes',
  claustra: 'claustras',
  claustras: 'claustras',
  bureau: 'bureaux',
  bureaux: 'bureaux',
  salon: 'salon',
  chambre: 'chambre',
};

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

          const rawCat = subDir.toLowerCase();
          const catId = CANONICAL_CATEGORY_IDS[rawCat] || rawCat;
          const catLabel = formatCategoryLabel(catId);

          categories.push({
            id: catId,
            label: catLabel,
            count: files.length,
          });

          let fileIndex = 0;
          for (const file of files) {
            fileIndex += 1;
            const ext = path.extname(file).toLowerCase();
            const baseName = path.basename(file, ext);
            const societySuffix = raw.society_name ? ` (${raw.society_name})` : '';

            // Generate contextual, high-relevance SEO titles, descriptions and bilingual ALTs
            let projectTitle = `${catLabel} sur mesure`;
            let projectDescription = `Projet d'agencement intérieur et menuiserie sur mesure réalisé par ${fullName}${societySuffix} avec les panneaux et bois nobles SOCOFEB.`;
            let projectAlt = `Réalisation ${catLabel.toLowerCase()} sur mesure par artisan menuisier ${fullName}${societySuffix} — SOCOFEB Tunisie`;

            if (catId === 'cuisines') {
              projectTitle = fileIndex % 2 === 0
                ? `Aménagement de cuisine équipée sur mesure`
                : `Cuisine moderne contemporaine sur mesure`;
              projectDescription = `Conception et fabrication de cuisine sur mesure en panneaux MDF nobles et plan de travail résistant par ${raw.society_name || fullName} en Tunisie.`;
              projectAlt = `Cuisine sur mesure moderne et aménagement de cuisine par ${fullName}${societySuffix} — SOCOFEB Tunisie (مطبخ عصري وتأثيث حسب الطلب)`;
            } else if (catId === 'dressing') {
              projectTitle = fileIndex % 2 === 0
                ? `Dressing architectural et placards intégrés sur mesure`
                : `Dressing sur mesure et optimisation de rangement`;
              projectDescription = `Agencement de dressing sur mesure, penderies modulaires et placards intégrés en bois noble pour chambre et suite parentale.`;
              projectAlt = `Dressing sur mesure et placard de rangement par ${fullName}${societySuffix} — SOCOFEB Tunisie (دريسينغ وخزائن على المقاس)`;
            } else if (catId === 'meubles') {
              projectTitle = fileIndex % 3 === 0
                ? `Meuble TV contemporain et claustra décoratif`
                : fileIndex % 2 === 0
                ? `Mobilier design et ameublement sur mesure`
                : `Bibliothèque et meuble de rangement sur mesure`;
              projectDescription = `Création de mobilier sur mesure pour salon, bureau et séjour en panneaux décoratifs et finitions bois soignées.`;
              projectAlt = `Meuble et ameublement sur mesure en bois par ${fullName}${societySuffix} — SOCOFEB Tunisie (أثاث خشبي حسب الطلب)`;
            } else if (catId === 'portes') {
              projectTitle = fileIndex % 2 === 0
                ? `Portes intérieures contemporaines en bois sur mesure`
                : `Porte d'intérieur design en bois noble`;
              projectDescription = `Menuiserie de portes intérieures sur mesure, huisseries et finitions contemporaines en bois massif et dérivés.`;
              projectAlt = `Porte intérieure en bois sur mesure par ${fullName}${societySuffix} — SOCOFEB Tunisie (أبواب خشبية حسب الطلب)`;
            }

            const imageItem = {
              id: `artisan-${raw.id}-${catId}-${baseName}`,
              src: `/images/realisations/images/${raw.id}/${subDir}/${file}`,
              category: catId,
              categoryLabel: catLabel,
              artisanId: raw.id,
              artisanName: fullName,
              artisanSociety: raw.society_name || null,
              title: projectTitle,
              description: projectDescription,
              alt: projectAlt,
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
      societyName: raw.society_name || null,
      activities: raw.activities || null,
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
        : raw.id === 2
        ? "Fondateur de Racine Cuisine, artisan menuisier d'excellence spécialisé dans la conception et l'agencement sur-mesure de cuisines contemporaines, dressings, portes intérieures et salles de bain."
        : (raw.activities ? `Artisan qualifié partenaire SOCOFEB spécialisé en ${raw.activities}.` : undefined),
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
