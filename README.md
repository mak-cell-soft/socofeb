# 🪵 SOCOFEB — Site Web Institutionnel & Catalogue
> **Société Commerciale du Fer et du Bois** · [www.socofeb.tn](https://www.socofeb.tn)  
> *L'excellence du bois, à votre portée.*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat)]()

---

## 🎯 Contexte du Projet

**SOCOFEB** est une entreprise tunisienne de référence spécialisée dans le négoce, la vente et le stockage permanent de **bois massifs** (Chêne, Hêtre, Bois Rouge, Bois Blanc, Acajou) et de **panneaux dérivés** (MDF Brut, MDF Stratifié, High Gloss, Contreplaqué WBP, OSB/3).

### 📍 Coordonnées & Points de Vente
- **Contact Direction Commerciale** : Mohamed Amine KLABI — **+216 99 218 866**
- **WhatsApp** : [wa.me/21699218866](https://wa.me/21699218866)
- **Siège Principal & Dépôt 1** : Route de Raoued Km 3, Jâafer – Ariana, Tunisie
- **Point de Vente 2** : Route de Gammarth Km 9, Sidi Amor – Ariana, Tunisie
- **Site Officiel** : [www.socofeb.tn](https://www.socofeb.tn)

### 🤝 Partenaires Industriels Officiels
- **STIBOIS** ([stibois.com](https://stibois.com)) — Leader MDF & dérivés en Tunisie
- **MPBS** ([mpbs.com.tn](https://mpbs.com.tn)) — Spécialiste mélaminé, acrylique et High Gloss
- **PROPANN** ([propann.com](https://propann.com)) — Fabricant national de panneaux MDF
- **STARWOOD** ([starwood.com.tr](https://www.starwood.com.tr)) — Panneaux haut de gamme importés de Turquie

---

## 🚀 Dépôt Git

```bash
git remote -v
# origin  git@github.com:mak-cell-soft/socofeb.git (fetch)
# origin  git@github.com:mak-cell-soft/socofeb.git (push)
```

Pour cloner le projet :
```bash
git clone git@github.com:mak-cell-soft/socofeb.git
cd socofeb
```

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, Server Components + Client Components optimisés)
- **Langage** : [TypeScript](https://www.typescriptlang.org/) (Mode strict)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) avec `@tailwindcss/typography`
- **State Management** : [Zustand](https://github.com/pmndrs/zustand) (`filterStore.ts`)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Formulaires & Validation** : [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Traitement d'Images** : [Sharp](https://sharp.pixelplumbing.com/) pour la génération d'actifs locaux WebP/SVG

---

## 🎨 Charte Graphique (Design Tokens)

Le design suit une direction artistique **Editorial Luxury Woodcraft** :

```css
:root {
  --color-primary:    #4A2C0A;   /* Brun foncé noyer — hero, headers, fonds sombres */
  --color-secondary:  #7B4F1E;   /* Acajou chaleureux — sous-titres, survols */
  --color-accent:     #C8922A;   /* Or chaud — boutons CTAs, badges, liserés */
  --color-bg-light:   #F5ECD7;   /* Beige bois / parchemin — fonds alternés */
  --color-text:       #333333;   /* Gris anthracite — corps de texte lisible */
  --color-white:      #FFFFFF;
  
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  
  --radius-card:  12px;
  --shadow-card:  0 4px 24px rgba(74, 44, 10, 0.12);
}
```

---

## 📦 Gestion des Images Statiques

Les images sont **100% locales** dans `public/images/` (aucun domaine externe requis) et référencées dans [src/lib/images.ts](src/lib/images.ts) :

```
public/images/
├── stibois/        # MDF Brut, Stratifié, High Gloss, Plaqué, Contreplaqué, Promos
├── mpbs/           # Mélaminé, Acrylique, High Gloss, Promos
├── propann/        # MDF Brut, Panneaux, Promos
├── starwood/       # Décors Import Turquie, Stratifiés, Promos
├── bois/           # Bois Blanc, Bois Rouge, Chêne, Hêtre, Acajou
├── osb/            # Panneaux OSB/3
├── hero/           # Fonds ateliers & dépôts haute définition
├── ui/             # Logos SOCOFEB (SVG), logos partenaires, favicon
└── realisations/   # Photothèque des projets architecturaux
```

---

## 🧩 Composants Clés

| Composant | Rôle & Fonctionnalités |
|---|---|
| **`ImageLightbox.tsx`** | Visionneuse plein écran avec fond flouté, navigation clavier ($\leftarrow$, $\rightarrow$, Échap), swipe tactile mobile, compteur (`3 / 12`) et bouton direct WhatsApp. |
| **`DecorGrid.tsx`** | Grille de vignettes 150×150px (6 cols desktop / 3 mobile) filtrable par marque, collection et famille de couleurs avec ouverture de la Lightbox au clic. |
| **`ProductImageGallery.tsx`** | Fiche produit avec aperçu 60% largeur, zoom au survol (`scale-125`), ruban de miniatures, badges fournisseur et bouton « Voir en grand ». |
| **`FilterBar.tsx`** | Barre de filtres horizontaux multi-critères avec chips de marques et sélecteur d'épaisseur. |
| **`ContactForm.tsx`** | Formulaire de demande de devis avec validation Zod et pré-remplissage dynamique selon le produit sélectionné. |
| **`MapEmbed.tsx`** | Double intégration cartographique des deux dépôts SOCOFEB d'Ariana (Jâafer et Sidi Amor). |
| **`WhatsAppButton.tsx`** | Bouton flottant animé avec pulsation et lien direct vers `wa.me/21699218866`. |

---

## 🗺️ Plan des Pages du Site

- `/` : **Page d'accueil** (Hero éditorial, Stats animées, 4 grandes familles, Partenaires, Promos, Réalisations, Devis + Carte).
- `/produits` : **Catalogue général** de l'offre bois et dérivés.
- `/produits/mdf` : **Catalogue MDF** avec filtres et nuancier complet interactif.
- `/produits/mdf/[slug]` : **Fiche technique MDF** (`mdf-brut`, `mdf-stratifie`, `mdf-high-gloss`, `mdf-plaque`).
- `/produits/bois` & `/produits/bois/[slug]` : **Bois massifs** (Bois Blanc, Bois Rouge, Chêne, Hêtre, Acajou).
- `/produits/contreplaque` : **Panneaux contreplaqués** (Structurel WBP, CTBX marine).
- `/produits/osb` : **Panneaux OSB/3** (Norme NF EN 300).
- `/marques` & `/marques/[slug]` : **Pages dédiées fabricants** (STIBOIS, MPBS, PROPANN, STARWOOD).
- `/promotions` : **Hub des promotions** et déstockages fournisseurs.
- `/realisations` : **Galerie de projets** d'agencement et de menuiserie.
- `/a-propos` : **Histoire & Valeurs** de SOCOFEB (25+ ans d'expertise).
- `/contact` : **Devis & localisation** des dépôts d'Ariana.
- `/sitemap.xml` & `/robots.txt` : **SEO technique** complet et balisage Schema.org `LocalBusiness`.

---

## ⚙️ Installation & Démarrage

### Prérequis
- [Node.js](https://nodejs.org/) v18+ (recommandé v20 ou v24)
- npm v9+

### 1. Installation des dépendances
```bash
npm install
```

### 2. Génération / Rafraîchissement des visuels locaux
```bash
node scripts/generate-assets.mjs
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Accédez au site sur [http://localhost:3000](http://localhost:3000).

### 4. Build de production
```bash
npm run build
npm run start
```

---

## 📄 Licence
Tous droits réservés © **SOCOFEB** — Société Commerciale du Fer et du Bois.
Toute reproduction partielle ou totale sans accord préalable est strictement interdite.
