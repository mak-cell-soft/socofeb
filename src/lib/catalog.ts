// src/lib/catalog.ts
import { ProductCategoryGroup } from '@/types/product';
import { SupplierConfigMap } from '@/types/supplier';

export const PRODUCT_CATEGORIES: ProductCategoryGroup[] = [
  {
    id: 'bois-massifs',
    label: 'Bois Massifs',
    slug: '/produits/bois',
    icon: '🌲',
    description: 'Bois Blanc, Bois Rouge, Chêne, Hêtre, Acajou sélectionnés pour la menuiserie et charpente',
    products: [
      {
        id: 'bois-blanc',
        name: 'Bois Blanc',
        slug: 'bois-blanc',
        essence: 'Pin sylvestre / Épicéa',
        usages: ['Charpente', 'Emballage', 'Menuiserie courante'],
        sections: ['22×100', '27×150', '38×100', '50×150', '50×200'],
        finishes: ['Brut', 'Raboté', 'Raboté-Bouveté'],
        imagePath: '/images/bois/bois-blanc/',
        coverImage: 'bois-blanc-cover.webp',
        description: 'Résineux polyvalent importé du Nord et de l\'Est de l\'Europe, séché en séchoir, idéal pour tous travaux de structure et d\'agencement courant.'
      },
      {
        id: 'bois-rouge',
        name: 'Bois Rouge',
        slug: 'bois-rouge',
        essence: 'Sapin Douglas / Épicéa rouge',
        usages: ['Ossature bois', 'Construction', 'Charpente'],
        sections: ['38×140', '45×145', '45×195', '50×200'],
        finishes: ['Brut', 'Raboté'],
        imagePath: '/images/bois/bois-rouge/',
        coverImage: 'bois-rouge-cover.webp',
        description: 'Bois résistant et durable d\'une excellente stabilité mécanique, recommandé pour les structures porteuses et l\'ossature bois.'
      },
      {
        id: 'chene',
        name: 'Chêne',
        slug: 'chene',
        essence: 'Quercus robur / Quercus petraea',
        usages: ['Ameublement haut de gamme', 'Parquet massif', 'Escaliers'],
        sections: ['27×100', '27×150', '50×100', '50×200'],
        finishes: ['Brut', 'Raboté', 'Huilé'],
        imagePath: '/images/bois/chene/',
        coverImage: 'chene-cover.webp',
        description: 'Le roi des bois nobles d\'Europe. Grain serré, dureté exceptionnelle et ramage majestueux pour l\'ébénisterie et l\'agencement de prestige.'
      },
      {
        id: 'hetre',
        name: 'Hêtre',
        slug: 'hetre',
        essence: 'Fagus sylvatica',
        usages: ['Tournage', 'Mobilier', 'Menuiserie intérieure'],
        sections: ['27×100', '27×200', '50×100'],
        finishes: ['Brut', 'Raboté'],
        imagePath: '/images/bois/hetre/',
        coverImage: 'hetre-cover.webp',
        description: 'Bois dur au grain fin et homogène de teinte rosée ou étuvée, facile à usiner et idéal pour les pièces massives et l\'ameublement contemporain.'
      },
      {
        id: 'acajou',
        name: 'Acajou',
        slug: 'acajou',
        essence: 'Swietenia macrophylla',
        usages: ['Ébénisterie', 'Placage décoratif', 'Mobilier prestige'],
        sections: ['27×100', '27×200', '50×150'],
        finishes: ['Brut', 'Raboté', 'Plaqué'],
        imagePath: '/images/bois/acajou/',
        coverImage: 'acajou-cover.webp',
        description: 'Bois précieux d\'exception au reflet acajou profond, réputé pour sa tenue millimétrique et son lustre inégalable.'
      },
    ],
  },
  {
    id: 'mdf',
    label: 'MDF & Panneaux',
    slug: '/produits/mdf',
    icon: '📋',
    description: 'MDF Brut, Stratifié, High Gloss, Plaqué auprès des 4 leaders du marché',
    products: [
      {
        id: 'mdf-brut',
        name: 'MDF Brut',
        slug: 'mdf-brut',
        specs: { densite: '760 kg/m³', classe: 'E1', norme: 'EN 622-5' },
        epaisseurs: [3, 6, 9, 12, 15, 16, 18, 19, 22, 25, 30],
        formats: ['2440×1220', '2800×2070'],
        suppliers: ['stibois', 'mpbs', 'propann'],
        imagePath: '/images/stibois/mdf-brut/',
        coverImage: 'mdf-brut-cover.webp',
        description: 'Panneau de fibres à densité moyenne haute performance, surface calibrée et faces poncées permettant l\'usinage direct, le laquage ou le placage.'
      },
      {
        id: 'mdf-stratifie',
        name: 'MDF Stratifié / Mélaminé',
        slug: 'mdf-stratifie',
        specs: { densite: '760 kg/m³', classe: 'E1', surface: 'Mélamine 0.3mm' },
        epaisseurs: [8, 12, 15, 16, 18, 22],
        formats: ['2440×1220', '2800×2070'],
        suppliers: ['stibois', 'mpbs', 'propann', 'starwood'],
        decors: true,
        imagePath: '/images/stibois/mdf-stratifie/',
        coverImage: 'mdf-stratifie-cover.webp',
        description: 'Panneaux revêtus de décors mélaminés haute résistance, imitant à la perfection les essences de bois chauds, bétons, pierres ou teintes unies.'
      },
      {
        id: 'mdf-high-gloss',
        name: 'MDF High Gloss',
        slug: 'mdf-high-gloss',
        specs: { finition: 'Laque UV ultra-brillante', densite: '760 kg/m³', classe: 'E1' },
        epaisseurs: [18],
        formats: ['2440×1220'],
        suppliers: ['stibois', 'mpbs'],
        decors: true,
        imagePath: '/images/stibois/mdf-high-gloss/',
        coverImage: 'mdf-high-gloss-cover.webp',
        description: 'Panneaux miroir dotés d\'une brillance intense supérieure à 90 gloss, résistants aux rayures et aux UV pour cuisines et agencements luxueux.'
      },
      {
        id: 'mdf-plaque',
        name: 'MDF Plaqué',
        slug: 'mdf-plaque',
        specs: { surface: 'Placage bois naturel', densite: '760 kg/m³' },
        epaisseurs: [12, 16, 18],
        formats: ['2440×1220'],
        suppliers: ['stibois'],
        decors: true,
        imagePath: '/images/stibois/mdf-plaque/',
        coverImage: 'mdf-plaque-cover.webp',
        description: 'Âme MDF recouverte sur chaque face de véritable feuille de placage bois noble (chêne, frêne, hêtre, noyer) pour allier authenticité et stabilité.'
      },
    ],
  },
  {
    id: 'contreplaque',
    label: 'Contreplaqué',
    slug: '/produits/contreplaque',
    icon: '📐',
    description: 'Contreplaqués structurels, décoratifs et marins multi-plis haute résistance',
    products: [
      {
        id: 'contreplaque-structurel',
        name: 'Contreplaqué Structurel',
        slug: 'structurel',
        specs: { essence: 'Peuplier / Eucalyptus', colle: 'WBP / Phénolique' },
        epaisseurs: [9, 12, 15, 18, 21],
        formats: ['2440×1220'],
        suppliers: ['stibois'],
        imagePath: '/images/stibois/contreplaque/',
        coverImage: 'cp-structurel-cover.webp',
        description: 'Panneaux contreplaqués de qualité industrielle collés avec résine WBP résistante aux intempéries et aux contraintes mécaniques lourdes.'
      },
    ],
  },
  {
    id: 'osb',
    label: 'OSB',
    slug: '/produits/osb',
    icon: '🏗️',
    description: 'OSB/3 certifié pour la construction bois, toitures et planchers techniques',
    products: [
      {
        id: 'osb3',
        name: 'OSB/3',
        slug: 'osb3',
        specs: { classe: 'OSB/3', norme: 'EN 300', colle: 'PMDI', bande: 'verte' },
        epaisseurs: [9, 12, 15, 18, 22, 25],
        formats: ['2500×1250'],
        suppliers: ['stibois'],
        usages: ['Toiture', 'Plancher', 'Cloisons', 'Coffrage'],
        imagePath: '/images/osb/',
        coverImage: 'osb-cover.webp',
        description: 'Panneau à lamelles minces orientées conforme à la norme EN 300 classe 3, utilisable en milieu humide sous contrainte structurelle.'
      },
    ],
  },
];

export const SUPPLIER_CONFIG: SupplierConfigMap = {
  stibois: {
    name: 'STIBOIS',
    fullName: 'Stibois Tunisie',
    website: 'https://stibois.com',
    logo: '/images/stibois/logo/logo_stibois.png',
    color: '#2E7D32',
    description: 'Leader des panneaux MDF, mélaminés et contreplaqués en Tunisie depuis plus de 30 ans.',
    collections: ['Stipan Earth Line', 'Stipan Color Line', 'Stipan Inspire Line', 'Stipan Spark Line'],
    promoFolder: '/images/stibois/promo/',
    badgeText: 'Partenaire Officiel'
  },
  mpbs: {
    name: 'MPBS',
    fullName: 'MPBS – Leader des Panneaux en Bois',
    website: 'https://mpbs.com.tn',
    logo: '/images/ui/logo-mpbs.png',
    color: '#1565C0',
    description: 'Co-fondateur du Groupe MPBS, spécialiste des panneaux mélaminés, acryliques et High Gloss.',
    collections: ['Mélaminé', 'Acrylique', 'High Gloss', 'Plaqué'],
    promoFolder: '/images/mpbs/promo/',
    badgeText: 'Partenaire Majeur'
  },
  propann: {
    name: 'PROPANN',
    fullName: 'PROPANN Tunisie',
    website: 'https://propann.com',
    logo: '/images/propann/logo/logo_propann.png',
    color: '#E65100',
    description: 'Fabricant tunisien de panneaux MDF et dérivés, référence nationale pour les professionnels.',
    collections: ['MDF Brut', 'MDF Stratifié', 'Panneaux spéciaux'],
    promoFolder: '/images/propann/promo/',
    badgeText: 'Fabricant Tunisien'
  },
  starwood: {
    name: 'STARWOOD',
    fullName: 'Starwood Turquie',
    website: 'https://www.starwood.com.tr',
    logo: '/images/starwood/logo/logo_starwood.png',
    color: '#6A1B9A',
    description: 'Fabricant turc de panneaux décoratifs haut de gamme, exportateur de premier plan vers la Tunisie.',
    collections: ['Décors Import', 'Stratifiés Premium'],
    promoFolder: '/images/starwood/promo/',
    badgeText: 'Importation Directe'
  },
};

export const COMPANY_INFO = {
  name: 'SOCOFEB',
  tagline: 'L\'excellence du bois, à votre portée',
  subtitle: 'Société Commerciale du Fer et du Bois',
  phone: '+216 99 218 866',
  phoneDisplay: '+216 99 218 866',
  contactPerson: 'Mohamed Amine KLABI',
  whatsappNumber: '21699218866',
  whatsappUrl: 'https://wa.me/21699218866',
  email: 'contact@socofeb.tn',
  locations: [
    {
      id: 'siege-jaafer',
      name: 'Siège & Dépôt Principal',
      address: 'Route de Raoued Km 3, Jâafer – Ariana, Tunisie',
      city: 'Ariana',
      phone: '+216 99 218 866',
      hours: 'Lundi – Samedi : 07h30 – 17h30',
      coordinates: { lat: 36.8833, lng: 10.1650 },
      isHeadquarters: true,
      mapsUrl: 'https://maps.google.com/?q=Route+de+Raoued+Km+3+Jaafer+Ariana'
    },
    {
      id: 'point-sidi-amor',
      name: 'Point de Vente 2',
      address: 'Route de Gammarth Km 9, Sidi Amor – Ariana, Tunisie',
      city: 'Ariana',
      phone: '+216 99 218 866',
      hours: 'Lundi – Samedi : 08h00 – 17h00',
      coordinates: { lat: 36.9140, lng: 10.2230 },
      isHeadquarters: false,
      mapsUrl: 'https://maps.google.com/?q=Route+de+Gammarth+Km+9+Sidi+Amor+Ariana'
    }
  ],
  stats: [
    { value: '25+', label: 'Années d\'expertise', sub: 'dans le négoce de bois' },
    { value: '150+', label: 'Décors & Références', sub: 'MDF & Essences nobles' },
    { value: '4', label: 'Marques Leaders', sub: 'Partenaires industriels' },
    { value: '2', label: 'Dépôts à l\'Ariana', sub: 'Pour vous servir au quotidien' }
  ]
};
