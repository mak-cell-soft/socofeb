# AGENTS.md — SOCOFEB Architecture & Guidelines

## 🪵 Project Overview
Institution & Catalogue website for **SOCOFEB** (Société Commerciale du Fer et du Bois) — www.socofeb-decor.com.
Specialist in solid wood (Chêne, Hêtre, Bois Rouge, Bois Blanc, Acajou) and wood-derived panels (MDF, Contreplaqué, OSB).

## 📍 Locations & Contact
- **Manager**: Mohamed Amine KLABI — +216 99 218 866
- **Headquarters**: Route de Raoued Km3, Jâafer – Ariana, Tunisie
- **Branch 2**: Route de Gammarth Km9, Sidi Amor – Ariana, Tunisie
- **WhatsApp**: wa.me/21699218866

## 🏛️ Partners
- STIBOIS (stibois.com) — Leader MDF Tunisie
- MPBS (mpbs.com.tn) — Leader MDF Tunisie
- PROPANN (propann.com) — Leader MDF Tunisie
- STARWOOD (starwood.com.tr) — Import Turquie

## 🎨 Design Tokens (NEVER OVERRIDE)
- Primary: `#4A2C0A` (Dark wood brown)
- Secondary: `#7B4F1E` (Warm mahogany)
- Accent: `#C8922A` (Rich gold)
- BgLight: `#F5ECD7` (Warm wood parchment)
- Text: `#333333` (Charcoal)
- Heading Font: `Playfair Display`
- Body Font: `Inter`

## 📁 Key Files & Directories
- `src/lib/images.ts`: Single source of truth for all local image paths, `MDF_CATALOG`, and `PROMO_IMAGES`.
- `src/lib/catalog.ts`: Complete product categories and supplier configurations.
- `src/store/filterStore.ts`: Zustand store for catalog and decor filtering and lightbox state.
- `src/components/ui/DecorGrid.tsx`: Interactive 6-col / 3-col decor grid with multi-level filtering and lightbox.
- `src/components/ui/ProductImageGallery.tsx`: 60% main view, thumbnail strip, zoom on hover, lightbox trigger.
- `src/components/ui/ImageLightbox.tsx`: Fullscreen viewer with keyboard, touch gestures, and quote direct links.
- `public/images/`: 100% local, static WebP and SVG assets.
