# CLAUDE.md — SOCOFEB Project Instructions

## Project
Site web institutionnel SOCOFEB (www.socofeb-decor.com)
Stack : Next.js 14, TypeScript, Tailwind CSS, Zustand, Framer Motion

## Critical Rules

### Images
- ALL images are STATIC in /public/images/{supplier}/{category}/
- NEVER use external image URLs — all must be local
- Use next/image component with local paths only
- Promo images are in /public/images/{supplier}/promo/
- Source of truth for image paths: src/lib/images.ts

### Colors (NEVER override)
- Primary:   #4A2C0A
- Secondary: #7B4F1E
- Accent:    #C8922A
- BgLight:   #F5ECD7

### Fonts
- Headings: Playfair Display (serif)
- Body:     Inter (sans-serif)

### Component priorities
1. ProductImageGallery — keyboard nav + swipe mobile
2. DecorGrid — filter by supplier/collection/color
3. ImageLightbox — full screen with arrows + counter

### MCP 21st.dev
- Use MCP to generate base UI components
- Always adapt colors to SOCOFEB palette after generation
- Always replace placeholder content with real SOCOFEB data

### File structure
- One component = one file
- Sections → src/components/sections/
- Reusable UI → src/components/ui/
- Business logic → src/lib/
- Data/catalog → src/lib/catalog.ts + src/lib/images.ts

## Contact Info (use everywhere)
- Phone: +216 99 218 866
- WhatsApp: wa.me/21699218866
- Address 1: Route de Raoued Km3, Jâafer – Ariana
- Address 2: Route de Guammart Km9, Sidi Amor – Ariana
- Website: www.socofeb.tn
