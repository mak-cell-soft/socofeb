import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const baseDir = path.resolve('public/images');

// Folders to ensure
const folders = [
  'stibois/mdf-brut',
  'stibois/mdf-stratifie',
  'stibois/mdf-high-gloss',
  'stibois/mdf-plaque',
  'stibois/contreplaque',
  'stibois/promo',
  'mpbs/melamine',
  'mpbs/acrylic',
  'mpbs/high-gloss',
  'mpbs/plaque',
  'mpbs/promo',
  'propann/mdf',
  'propann/panneaux',
  'propann/promo',
  'starwood/decors',
  'starwood/stratifie',
  'starwood/promo',
  'bois/bois-blanc',
  'bois/bois-rouge',
  'bois/chene',
  'bois/hetre',
  'bois/acajou',
  'osb',
  'hero',
  'ui',
  'realisations',
];

folders.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Color palettes and gradients for wood and textures
const textures = {
  woodWarm: { bg1: '#6E4720', bg2: '#3B200A', line: '#8A5826', grain: '#271203' },
  woodOak: { bg1: '#A67B48', bg2: '#684522', line: '#B88E5B', grain: '#4A3014' },
  woodLight: { bg1: '#D9C19D', bg2: '#A8895E', line: '#ECD9BD', grain: '#735733' },
  woodRed: { bg1: '#9B4127', bg2: '#571D0F', line: '#BD593D', grain: '#3E1005' },
  woodMahogany: { bg1: '#5A1E15', bg2: '#2F0B06', line: '#7D3024', grain: '#200502' },
  concreteLight: { bg1: '#C5C6C6', bg2: '#8E9091', line: '#E2E3E3', grain: '#6C6E70' },
  concreteDark: { bg1: '#5A5E61', bg2: '#333739', line: '#72767A', grain: '#212325' },
  marble: { bg1: '#F4F4F4', bg2: '#D6D8D9', line: '#C0C2C4', grain: '#9A9C9E' },
  highGlossWhite: { bg1: '#FFFFFF', bg2: '#D9DFE4', line: '#F1F4F7', grain: '#B5BDC4' },
  highGlossRed: { bg1: '#B31412', bg2: '#610605', line: '#E62421', grain: '#450201' },
  highGlossBlack: { bg1: '#262626', bg2: '#0D0D0D', line: '#444444', grain: '#000000' },
  blueNight: { bg1: '#162846', bg2: '#0B1527', line: '#25406C', grain: '#060B15' },
  osbGold: { bg1: '#CBA052', bg2: '#8B6522', line: '#E4BF72', grain: '#63440F' },
  mdfNatural: { bg1: '#B78C56', bg2: '#775224', line: '#CA9F68', grain: '#543612' },
};

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createSvgTexture(width, height, rawTitle, rawSubtitle, rawRef, styleKey = 'woodOak') {
  const title = escapeXml(rawTitle);
  const subtitle = escapeXml(rawSubtitle);
  const ref = escapeXml(rawRef);
  const t = textures[styleKey] || textures.woodOak;
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${t.bg1}" />
        <stop offset="50%" stop-color="${t.bg2}" />
        <stop offset="100%" stop-color="${t.grain}" />
      </linearGradient>
      <pattern id="grain" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 0 10 Q 30 20 60 10 M 0 30 Q 30 40 60 30 M 0 50 Q 30 60 60 50" stroke="${t.line}" stroke-width="0.75" fill="none" opacity="0.35"/>
        <circle cx="20" cy="25" r="1.5" fill="${t.grain}" opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)" />
    <rect width="${width}" height="${height}" fill="url(#grain)" />
    <rect x="0" y="0" width="${width}" height="${height}" fill="black" opacity="0.15" />
    
    <!-- Subtle luxury frame -->
    <rect x="12" y="12" width="${width - 24}" height="${height - 24}" stroke="#C8922A" stroke-width="1" fill="none" opacity="0.4" rx="6" />
    
    <!-- Title & Ref Badge -->
    <g transform="translate(${width / 2}, ${height / 2})">
      <rect x="-110" y="-32" width="220" height="64" rx="8" fill="rgba(18, 10, 3, 0.75)" stroke="#C8922A" stroke-width="1" />
      <text x="0" y="-8" font-family="'Playfair Display', Georgia, serif" font-size="15" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
      <text x="0" y="12" font-family="Inter, sans-serif" font-size="11" fill="#C8922A" text-anchor="middle" font-weight="600">${subtitle}</text>
      ${ref ? `<text x="0" y="24" font-family="monospace" font-size="9" fill="#E4D5B8" text-anchor="middle">${ref}</text>` : ''}
    </g>
  </svg>`;
}

function createPromoBanner(width, height, rawTitle, discount, supplier) {
  const title = escapeXml(rawTitle);
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="promoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4A2C0A" />
        <stop offset="100%" stop-color="#241402" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#promoGrad)" />
    <!-- Diagonal stripes -->
    <pattern id="stripes" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#7B4F1E" stroke-width="3" opacity="0.3"/>
    </pattern>
    <rect width="${width}" height="${height}" fill="url(#stripes)" />
    
    <!-- Discount Ribbon -->
    <path d="M 0 0 L 140 0 L 0 140 Z" fill="#C8922A" />
    <text x="35" y="45" font-family="Inter, sans-serif" font-size="22" font-weight="900" fill="#241402" transform="rotate(-45 35 45)" text-anchor="middle">${discount}</text>
    
    <g transform="translate(${width / 2}, ${height / 2})">
      <text x="0" y="-10" font-family="'Playfair Display', serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
      <text x="0" y="25" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#C8922A" text-anchor="middle">OFFRE SPÉCIALE — ${supplier.toUpperCase()}</text>
      <rect x="-80" y="45" width="160" height="32" rx="16" fill="#C8922A" />
      <text x="0" y="66" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#241402" text-anchor="middle">PROFITER DE L&apos;OFFRE</text>
    </g>
  </svg>`;
}

function createHeroImage(width, height, rawTitle) {
  const title = escapeXml(rawTitle);
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3B200A" />
        <stop offset="50%" stop-color="#241402" />
        <stop offset="100%" stop-color="#120801" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#heroGrad)" />
    <!-- Architectural lines -->
    <g stroke="#C8922A" stroke-width="0.75" opacity="0.15">
      <line x1="0" y1="100" x2="${width}" y2="100" />
      <line x1="0" y1="300" x2="${width}" y2="300" />
      <line x1="0" y1="500" x2="${width}" y2="500" />
      <line x1="0" y1="700" x2="${width}" y2="700" />
      <line x1="200" y1="0" x2="200" y2="${height}" />
      <line x1="600" y1="0" x2="600" y2="${height}" />
      <line x1="1000" y1="0" x2="1000" y2="${height}" />
      <line x1="1400" y1="0" x2="1400" y2="${height}" />
    </g>
    <!-- Warm golden ambient glow -->
    <radialGradient id="glow" cx="65%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#C8922A" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#C8922A" stop-opacity="0"/>
    </radialGradient>
    <rect width="${width}" height="${height}" fill="url(#glow)" />
    <g transform="translate(${width/2}, ${height/2})">
      <circle cx="0" cy="0" r="180" stroke="#C8922A" stroke-width="1.5" fill="none" opacity="0.25" stroke-dasharray="8 6"/>
      <text x="0" y="0" font-family="'Playfair Display', serif" font-size="36" font-weight="bold" fill="#FAF6EE" opacity="0.9" text-anchor="middle">${title}</text>
      <text x="0" y="40" font-family="Inter, sans-serif" font-size="16" letter-spacing="4" fill="#C8922A" text-anchor="middle">SOCOFEB • BOIS ET DÉRIVÉS</text>
    </g>
  </svg>`;
}

function createLogoSvg(isWhite = false) {
  const gold = '#C8922A';
  const textCol = isWhite ? '#FFFFFF' : '#4A2C0A';
  return `
  <svg width="240" height="60" viewBox="0 0 240 60" xmlns="http://www.w3.org/2000/svg">
    <!-- Stylized Wood Log / Diamond Icon -->
    <g transform="translate(10, 8)">
      <polygon points="22,2 42,14 42,34 22,46 2,34 2,14" fill="${gold}" opacity="0.2" stroke="${gold}" stroke-width="2"/>
      <path d="M 2 14 L 22 26 L 42 14" stroke="${gold}" stroke-width="2" fill="none"/>
      <line x1="22" y1="26" x2="22" y2="46" stroke="${gold}" stroke-width="2"/>
      <circle cx="22" cy="18" r="4" fill="${gold}"/>
    </g>
    <text x="64" y="32" font-family="'Playfair Display', Georgia, serif" font-size="24" font-weight="bold" fill="${textCol}" letter-spacing="1">SOCOFEB</text>
    <text x="65" y="46" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="${gold}" letter-spacing="2">BOIS &amp; PANNEAUX DÉRIVÉS</text>
  </svg>`;
}

function createPartnerLogo(name, color) {
  return `
  <svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="80" rx="8" fill="#FAF6EE" stroke="#E4D5B8" stroke-width="1.5"/>
    <rect x="8" y="8" width="184" height="64" rx="6" fill="#FFFFFF" />
    <circle cx="36" cy="40" r="16" fill="${color}" opacity="0.15"/>
    <text x="36" y="46" font-family="Inter, sans-serif" font-size="14" font-weight="900" fill="${color}" text-anchor="middle">${name.charAt(0)}</text>
    <text x="64" y="46" font-family="Inter, sans-serif" font-size="18" font-weight="900" fill="#241402" letter-spacing="1">${name}</text>
  </svg>`;
}

// Items list to generate
const items = [
  // STIBOIS Earth Line
  { path: 'stibois/mdf-stratifie/chene-naturel.webp', title: 'Chêne Naturel', sub: 'STIBOIS Earth Line', ref: 'STI-EL-001', style: 'woodOak' },
  { path: 'stibois/mdf-stratifie/noyer-brun.webp', title: 'Noyer Brun', sub: 'STIBOIS Earth Line', ref: 'STI-EL-002', style: 'woodWarm' },
  { path: 'stibois/mdf-stratifie/acacia-miel.webp', title: 'Acacia Miel', sub: 'STIBOIS Earth Line', ref: 'STI-EL-003', style: 'woodWarm' },
  { path: 'stibois/mdf-stratifie/bouleau-blanche.webp', title: 'Bouleau Blanc', sub: 'STIBOIS Earth Line', ref: 'STI-EL-004', style: 'woodLight' },

  // STIBOIS Color Line
  { path: 'stibois/mdf-stratifie/blanc-arctic.webp', title: 'Blanc Arctic', sub: 'STIBOIS Color Line', ref: 'STI-CL-001', style: 'highGlossWhite' },
  { path: 'stibois/mdf-stratifie/gris-perle.webp', title: 'Gris Perle', sub: 'STIBOIS Color Line', ref: 'STI-CL-002', style: 'concreteLight' },
  { path: 'stibois/mdf-stratifie/noir-mat.webp', title: 'Noir Mat', sub: 'STIBOIS Color Line', ref: 'STI-CL-003', style: 'highGlossBlack' },
  { path: 'stibois/mdf-stratifie/anthracite.webp', title: 'Anthracite', sub: 'STIBOIS Color Line', ref: 'STI-CL-004', style: 'concreteDark' },
  { path: 'stibois/mdf-stratifie/bleu-nuit.webp', title: 'Bleu Nuit', sub: 'STIBOIS Color Line', ref: 'STI-CL-005', style: 'blueNight' },

  // STIBOIS Inspire Line
  { path: 'stibois/mdf-stratifie/beton-clair.webp', title: 'Béton Clair', sub: 'STIBOIS Inspire Line', ref: 'STI-IL-001', style: 'concreteLight' },
  { path: 'stibois/mdf-stratifie/beton-fonce.webp', title: 'Béton Foncé', sub: 'STIBOIS Inspire Line', ref: 'STI-IL-002', style: 'concreteDark' },
  { path: 'stibois/mdf-stratifie/ardoise.webp', title: 'Ardoise', sub: 'STIBOIS Inspire Line', ref: 'STI-IL-003', style: 'concreteDark' },
  { path: 'stibois/mdf-stratifie/marbre-blanc.webp', title: 'Marbre Blanc', sub: 'STIBOIS Inspire Line', ref: 'STI-IL-004', style: 'marble' },

  // STIBOIS Spark Line
  { path: 'stibois/mdf-stratifie/diamant-silver.webp', title: 'Diamant Silver', sub: 'STIBOIS Spark Line', ref: 'STI-SL-001', style: 'concreteLight' },
  { path: 'stibois/mdf-stratifie/nacre-blanc.webp', title: 'Nacre Blanc', sub: 'STIBOIS Spark Line', ref: 'STI-SL-002', style: 'marble' },

  // Covers MDF & Products
  { path: 'stibois/mdf-brut/mdf-brut-cover.webp', title: 'MDF Brut Haute Densité', sub: 'Standard EN 622-5', ref: 'STI-MDF-RAW', style: 'mdfNatural' },
  { path: 'stibois/mdf-brut/mdf-brut-18mm.webp', title: 'MDF Brut 18mm', sub: 'Panneau calibré poncé', ref: 'STI-RAW-18', style: 'mdfNatural' },
  { path: 'stibois/mdf-stratifie/mdf-stratifie-cover.webp', title: 'MDF Stratifié & Mélaminé', sub: 'Nuancier Haute Définition', ref: 'STI-MDF-STR', style: 'woodOak' },
  { path: 'stibois/mdf-high-gloss/mdf-high-gloss-cover.webp', title: 'MDF High Gloss Miroir', sub: 'Finition Laque UV >90 Gloss', ref: 'STI-MDF-HG', style: 'highGlossWhite' },
  { path: 'stibois/mdf-high-gloss/blanc-brillant.webp', title: 'Blanc Brillant Miroir', sub: 'STIBOIS High Gloss', ref: 'STI-HG-001', style: 'highGlossWhite' },
  { path: 'stibois/mdf-plaque/mdf-plaque-cover.webp', title: 'MDF Plaqué Bois Noble', sub: 'Placage Chêne / Frêne', ref: 'STI-MDF-PLQ', style: 'woodOak' },
  { path: 'stibois/mdf-plaque/chene-plaque.webp', title: 'Chêne Américain Plaqué', sub: 'STIBOIS Placage Noble', ref: 'STI-PLQ-001', style: 'woodOak' },
  { path: 'stibois/contreplaque/cp-structurel-cover.webp', title: 'Contreplaqué Structurel WBP', sub: 'Peuplier / Eucalyptus', ref: 'STI-CP-001', style: 'woodLight' },
  { path: 'stibois/contreplaque/contreplaque-marine.webp', title: 'Contreplaqué CTBX Marine', sub: 'Qualité Marine Imputrescible', ref: 'STI-CP-MAR', style: 'woodWarm' },

  // MPBS
  { path: 'mpbs/melamine/chene-clair.webp', title: 'Chêne Clair MPBS', sub: 'Mélaminé Décoratif', ref: 'MP-ML-001', style: 'woodLight' },
  { path: 'mpbs/melamine/noyer-fonce.webp', title: 'Noyer Foncé MPBS', sub: 'Mélaminé Décoratif', ref: 'MP-ML-002', style: 'woodWarm' },
  { path: 'mpbs/melamine/blanc-pur.webp', title: 'Blanc Pur MPBS', sub: 'Mélaminé Décoratif', ref: 'MP-ML-003', style: 'highGlossWhite' },
  { path: 'mpbs/acrylic/blanc-acrylique.webp', title: 'Blanc Acrylique', sub: 'MPBS Acrylique Ultra-lisse', ref: 'MP-AC-001', style: 'highGlossWhite' },
  { path: 'mpbs/acrylic/noir-acrylique.webp', title: 'Noir Acrylique', sub: 'MPBS Acrylique Profond', ref: 'MP-AC-002', style: 'highGlossBlack' },
  { path: 'mpbs/acrylic/gris-acier.webp', title: 'Gris Acier', sub: 'MPBS Acrylique Satin', ref: 'MP-AC-003', style: 'concreteLight' },
  { path: 'mpbs/high-gloss/blanc-gloss.webp', title: 'Blanc Gloss MPBS', sub: 'Surfaces Miroir UV', ref: 'MP-HG-001', style: 'highGlossWhite' },
  { path: 'mpbs/high-gloss/rouge-gloss.webp', title: 'Rouge Gloss MPBS', sub: 'Surfaces Miroir UV', ref: 'MP-HG-002', style: 'highGlossRed' },

  // PROPANN
  { path: 'propann/mdf/mdf-brut-16mm.webp', title: 'MDF Brut 16mm PROPANN', sub: 'Panneau Industrie Tunisienne', ref: 'PR-MDF-001', style: 'mdfNatural' },
  { path: 'propann/mdf/mdf-brut-18mm.webp', title: 'MDF Brut 18mm PROPANN', sub: 'Standard Menuiserie & Agencement', ref: 'PR-MDF-002', style: 'mdfNatural' },
  { path: 'propann/mdf/mdf-stratifie.webp', title: 'MDF Stratifié PROPANN', sub: 'Gamme Décor PROPANN', ref: 'PR-STR-001', style: 'woodOak' },

  // STARWOOD
  { path: 'starwood/decors/beton-cire-anthracite.webp', title: 'Béton Ciré Anthracite', sub: 'STARWOOD Décors Import', ref: 'SW-DC-001', style: 'concreteDark' },
  { path: 'starwood/decors/parquet-chene.webp', title: 'Parquet Chêne', sub: 'STARWOOD Décors Import', ref: 'SW-DC-002', style: 'woodOak' },
  { path: 'starwood/decors/marbre-calacatta.webp', title: 'Calacatta Marbre', sub: 'STARWOOD Décors Import', ref: 'SW-DC-003', style: 'marble' },
  { path: 'starwood/stratifie/noyer-turc.webp', title: 'Noyer Turc', sub: 'STARWOOD Stratifiés Premium', ref: 'SW-ST-001', style: 'woodWarm' },
  { path: 'starwood/stratifie/orme-gris.webp', title: 'Orme Gris', sub: 'STARWOOD Stratifiés Premium', ref: 'SW-ST-002', style: 'woodLight' },

  // BOIS MASSIFS
  { path: 'bois/bois-blanc/bois-blanc-cover.webp', title: 'Bois Blanc Massif', sub: 'Pin Sylvestre / Épicéa Nord', ref: 'BB-001', style: 'woodLight' },
  { path: 'bois/bois-blanc/bois-blanc-rabote.webp', title: 'Bois Blanc Raboté 4 Faces', sub: 'Séché séchoir KD 12-14%', ref: 'BB-002', style: 'woodLight' },
  { path: 'bois/bois-rouge/bois-rouge-cover.webp', title: 'Bois Rouge Massif', sub: 'Sapin Douglas / Épicéa Rouge', ref: 'BR-001', style: 'woodRed' },
  { path: 'bois/bois-rouge/bois-rouge-chevron.webp', title: 'Bois Rouge Poutres & Chevrons', sub: 'Qualité Charpente C24', ref: 'BR-002', style: 'woodRed' },
  { path: 'bois/chene/chene-cover.webp', title: 'Chêne Noble Massif', sub: 'Quercus Robur Sélection Prestige', ref: 'CH-001', style: 'woodOak' },
  { path: 'bois/chene/chene-avive.webp', title: 'Plots & Avivés de Chêne', sub: 'Ébénisterie & Escaliers', ref: 'CH-002', style: 'woodOak' },
  { path: 'bois/hetre/hetre-cover.webp', title: 'Hêtre Étuve Massif', sub: 'Fagus Sylvatica Grain Fin', ref: 'HT-001', style: 'woodLight' },
  { path: 'bois/hetre/hetre-etuve.webp', title: 'Plateaux de Hêtre Rosé', sub: 'Menuiserie Intérieure', ref: 'HT-002', style: 'woodWarm' },
  { path: 'bois/acajou/acajou-cover.webp', title: 'Acajou Précieux Massif', sub: 'Swietenia Macrophylla', ref: 'AC-001', style: 'woodMahogany' },
  { path: 'bois/acajou/acajou-precieux.webp', title: 'Avivés Acajou d\'Exception', sub: 'Lustre & Ébénisterie d\'Art', ref: 'AC-002', style: 'woodMahogany' },

  // OSB
  { path: 'osb/osb-cover.webp', title: 'OSB/3 Norme EN 300', sub: 'Panneau Structurel Résistant Milieu Humide', ref: 'OSB-001', style: 'osbGold' },
  { path: 'osb/osb3-panneau.webp', title: 'OSB/3 18mm Bande Verte', sub: 'Colle PMDI sans formaldéhyde', ref: 'OSB-002', style: 'osbGold' },

  // Réalisations
  { path: 'realisations/realisation-1.webp', title: 'Agencement Villa Gammarth', sub: 'MDF High Gloss & Chêne Massif', ref: 'REAL-01', style: 'woodOak' },
  { path: 'realisations/realisation-2.webp', title: 'Cuisine Contemporaine Ariana', sub: 'Façades MPBS Acrylique Blanc & Noyer', ref: 'REAL-02', style: 'highGlossWhite' },
  { path: 'realisations/realisation-3.webp', title: 'Dressing Sur-Mesure La Marsa', sub: 'MDF Stratifié Stipan Earth Line', ref: 'REAL-03', style: 'woodWarm' },
  { path: 'realisations/realisation-4.webp', title: 'Escalier & Parquet Carthage', sub: 'Chêne Massif Premier Choix', ref: 'REAL-04', style: 'woodOak' },
  { path: 'realisations/realisation-5.webp', title: 'Charpente Traditionnelle Raoued', sub: 'Bois Rouge Massif C24', ref: 'REAL-05', style: 'woodRed' },
  { path: 'realisations/realisation-6.webp', title: 'Bureaux Direction Les Berges du Lac', sub: 'STARWOOD Calacatta & Béton Ciré', ref: 'REAL-06', style: 'concreteDark' },
];

async function generateAll() {
  console.log('Generating realistic texture webp images...');

  for (const item of items) {
    const fullPath = path.join(baseDir, item.path);
    const svg = createSvgTexture(600, 600, item.title, item.sub, item.ref, item.style);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(fullPath);
  }

  // Generate Promos
  const promoItems = [
    { path: 'stibois/promo/promo-mdf-juillet.webp', title: 'Offre MDF Juillet', discount: '-15%', supplier: 'stibois' },
    { path: 'stibois/promo/promo-high-gloss.webp', title: 'High Gloss en Promo', discount: '-20%', supplier: 'stibois' },
    { path: 'mpbs/promo/promo-melamine-ete.webp', title: 'Mélaminés Été', discount: '-10%', supplier: 'mpbs' },
    { path: 'propann/promo/promo-mdf-brut.webp', title: 'MDF Brut Déstockage', discount: '-25%', supplier: 'propann' },
    { path: 'starwood/promo/promo-decors-import.webp', title: 'Décors Import en Promo', discount: '-12%', supplier: 'starwood' },
  ];

  for (const p of promoItems) {
    const fullPath = path.join(baseDir, p.path);
    const svg = createPromoBanner(700, 450, p.title, p.discount, p.supplier);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(fullPath);
  }

  // Generate Heroes
  const heroItems = [
    { path: 'hero/hero-wood-workshop.webp', title: 'L\'Excellence du Bois' },
    { path: 'hero/hero-warehouse.webp', title: 'Stock Permanent & Négoce' },
    { path: 'hero/hero-texture.webp', title: 'Sélection Bois Nobles' },
  ];
  for (const h of heroItems) {
    const fullPath = path.join(baseDir, h.path);
    const svg = createHeroImage(1920, 1080, h.title);
    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(fullPath);
  }

  // Generate UI Partner Logos
  const partners = [
    { name: 'STIBOIS', color: '#2E7D32', file: 'ui/logo-stibois.png' },
    { name: 'MPBS', color: '#1565C0', file: 'ui/logo-mpbs.png' },
    { name: 'PROPANN', color: '#E65100', file: 'ui/logo-propann.png' },
    { name: 'STARWOOD', color: '#6A1B9A', file: 'ui/logo-starwood.png' },
  ];

  for (const pr of partners) {
    const fullPath = path.join(baseDir, pr.file);
    const svg = createPartnerLogo(pr.name, pr.color);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(fullPath);
  }

  // Generate UI SOCOFEB Logos
  fs.writeFileSync(path.join(baseDir, 'ui/logo.svg'), createLogoSvg(false));
  fs.writeFileSync(path.join(baseDir, 'ui/logo-white.svg'), createLogoSvg(true));

  // Generate favicon
  const favSvg = `
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#4A2C0A"/>
    <polygon points="16,4 28,11 28,21 16,28 4,21 4,11" fill="#C8922A" opacity="0.4"/>
    <path d="M 4 11 L 16 18 L 28 11" stroke="#C8922A" stroke-width="1.5" fill="none"/>
    <line x1="16" y1="18" x2="16" y2="28" stroke="#C8922A" stroke-width="1.5"/>
  </svg>`;
  await sharp(Buffer.from(favSvg))
    .png()
    .toFile(path.join(baseDir, 'ui/favicon.ico'));

  console.log('All static image assets generated successfully!');
}

generateAll().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
