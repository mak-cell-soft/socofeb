import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductImageGallery, GalleryImage } from '@/components/ui/ProductImageGallery';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { ContactForm } from '@/components/ui/ContactForm';
import { PRODUCT_CATEGORIES, SUPPLIER_CONFIG } from '@/lib/catalog';
import { MDFProduct } from '@/types/product';
import { Supplier } from '@/types/image';
import {
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  Maximize,
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const mdfCat = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  return (mdfCat?.products || []).map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const mdfCat = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  const product = mdfCat?.products.find((p) => p.slug === params.slug) as
    | MDFProduct
    | undefined;

  if (!product) {
    return { title: 'Produit MDF non trouvé' };
  }

  return {
    title: `${product.name} — Panneaux MDF Tunisie`,
    description: `Fiche technique et décors du ${product.name}. Épaisseurs disponibles : ${product.epaisseurs.join(
      ', '
    )}mm. Distribué par SOCOFEB à Jâafer et Sidi Amor (Ariana).`,
  };
}

export default function MDFProductDetailPage({ params }: Props) {
  const mdfCat = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  const product = mdfCat?.products.find((p) => p.slug === params.slug) as
    | MDFProduct
    | undefined;

  if (!product) {
    notFound();
  }

  // Related MDF products
  const relatedProducts = (mdfCat?.products || []).filter(
    (p) => p.slug !== product.slug
  ) as MDFProduct[];

  // Build specific image gallery list based on product slug
  const galleryImages: GalleryImage[] = [
    {
      src: `${product.imagePath}${product.coverImage}`,
      label: product.name,
      ref: `STI-${product.slug.toUpperCase()}-01`,
    },
  ];

  if (product.slug === 'mdf-brut') {
    galleryImages.push(
      { src: '/images/stibois/mdf-brut/mdf-brut-18mm.webp', label: 'MDF Brut 18mm Calibré', ref: 'STI-RAW-18' },
      { src: '/images/propann/mdf/mdf-brut-16mm.webp', label: 'MDF Brut 16mm PROPANN', ref: 'PR-MDF-16' },
      { src: '/images/propann/mdf/mdf-brut-18mm.webp', label: 'MDF Brut 18mm PROPANN', ref: 'PR-MDF-18' },
      { src: '/images/propann/promo/promo-mdf-brut.webp', label: 'Déstockage Brut Palette', isPromo: true }
    );
  } else if (product.slug === 'mdf-stratifie') {
    galleryImages.push(
      { src: '/images/stibois/mdf-stratifie/chene-naturel.webp', label: 'Chêne Naturel Earth Line', ref: 'STI-EL-001' },
      { src: '/images/stibois/mdf-stratifie/blanc-arctic.webp', label: 'Blanc Arctic Color Line', ref: 'STI-CL-001' },
      { src: '/images/stibois/mdf-stratifie/beton-clair.webp', label: 'Béton Clair Inspire Line', ref: 'STI-IL-001' },
      { src: '/images/mpbs/melamine/chene-clair.webp', label: 'Chêne Clair MPBS', ref: 'MP-ML-001' },
      { src: '/images/stibois/promo/promo-mdf-juillet.webp', label: 'Offre Promo MDF Juillet', isPromo: true }
    );
  } else if (product.slug === 'mdf-high-gloss') {
    galleryImages.push(
      { src: '/images/stibois/mdf-high-gloss/blanc-brillant.webp', label: 'Blanc Brillant Miroir', ref: 'STI-HG-001' },
      { src: '/images/mpbs/high-gloss/blanc-gloss.webp', label: 'Blanc Gloss MPBS', ref: 'MP-HG-001' },
      { src: '/images/mpbs/high-gloss/rouge-gloss.webp', label: 'Rouge Gloss MPBS', ref: 'MP-HG-002' },
      { src: '/images/stibois/promo/promo-high-gloss.webp', label: 'High Gloss en Promo -20%', isPromo: true }
    );
  } else if (product.slug === 'mdf-plaque') {
    galleryImages.push(
      { src: '/images/stibois/mdf-plaque/chene-plaque.webp', label: 'Chêne Américain Plaqué', ref: 'STI-PLQ-001' },
      { src: '/images/stibois/mdf-stratifie/chene-naturel.webp', label: 'Chêne Naturel 2 Faces', ref: 'STI-EL-001' },
      { src: '/images/stibois/mdf-stratifie/noyer-brun.webp', label: 'Noyer Brun Sélection', ref: 'STI-EL-002' }
    );
  }

  const primarySupplier: Supplier = product.suppliers[0] || 'stibois';

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'MDF & Panneaux', href: '/produits/mdf' },
            { label: product.name },
          ]}
        />

        {/* Top Product Showcase: Gallery (60%) + Summary & Quick Buy (40%) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Column (60% width) */}
            <div className="lg:col-span-7">
              <ProductImageGallery
                images={galleryImages}
                supplier={primarySupplier}
                productName={product.name}
              />
            </div>

            {/* Product Summary Column (40% width) */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.suppliers.map((sup) => (
                    <SupplierBadge key={sup} supplier={sup} size="sm" />
                  ))}
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-3">
                  {product.name}
                </h1>

                <p className="text-charcoal-light text-sm sm:text-base leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Key Spec highlights */}
                <div className="space-y-3 mb-6 bg-wood-cream/50 p-4 rounded-2xl border border-wood-border">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-charcoal">
                      Épaisseurs en stock :
                    </span>
                    <span className="font-bold text-primary">
                      {product.epaisseurs.join(', ')} mm
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-charcoal">
                      Formats standards :
                    </span>
                    <span className="font-bold text-primary">
                      {product.formats.join(' / ')} mm
                    </span>
                  </div>

                  {product.specs.densite && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-charcoal">
                        Densité moyenne :
                      </span>
                      <span className="font-bold text-primary">
                        {product.specs.densite}
                      </span>
                    </div>
                  )}

                  {product.specs.classe && (
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-charcoal">
                        Émission formaldéhyde :
                      </span>
                      <span className="font-bold text-primary">
                        Classe {product.specs.classe}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-charcoal-light mb-8">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Disponible immédiatement aux dépôts de Jâafer et Sidi Amor</span>
                </div>
              </div>

              {/* Call to actions */}
              <div className="space-y-3">
                <a
                  href="#devis"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-102 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Demander un devis pour ce produit
                </a>

                <a
                  href="https://wa.me/21699218866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary font-bold text-xs sm:text-sm uppercase tracking-wider border border-wood-border transition-all"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  Discuter avec un conseiller (+216 99 218 866)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent-dark" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">
                Caractéristiques &amp; Spécifications Techniques
              </h2>
              <p className="text-charcoal-light text-xs sm:text-sm">
                Données certifiées constructeurs (EN 622-5)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-wood-border bg-wood-cream/50 text-primary">
                  <th className="py-3.5 px-4 font-bold">Propriété</th>
                  <th className="py-3.5 px-4 font-bold">Spécification</th>
                  <th className="py-3.5 px-4 font-bold">Norme / Certification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wood-border/60">
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Nom commercial</td>
                  <td className="py-3 px-4 text-primary font-bold">{product.name}</td>
                  <td className="py-3 px-4 text-charcoal-light">SOCOFEB Distribution</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Densité nominale</td>
                  <td className="py-3 px-4 text-primary font-bold">{product.specs.densite || '760 kg/m³'}</td>
                  <td className="py-3 px-4 text-charcoal-light">EN 323</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Classe d&apos;émission</td>
                  <td className="py-3 px-4 text-primary font-bold">Classe {product.specs.classe || 'E1'} (&lt; 0.1 ppm)</td>
                  <td className="py-3 px-4 text-charcoal-light">EN 717-1</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Épaisseurs disponibles</td>
                  <td className="py-3 px-4 text-primary font-bold">{product.epaisseurs.join(' mm, ')} mm</td>
                  <td className="py-3 px-4 text-charcoal-light">Tolérance &plusmn;0.2mm</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Dimensions panneaux</td>
                  <td className="py-3 px-4 text-primary font-bold">{product.formats.join(' mm / ')} mm</td>
                  <td className="py-3 px-4 text-charcoal-light">EN 324</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-charcoal">Fabricants partenaires</td>
                  <td className="py-3 px-4 text-primary font-bold">
                    {product.suppliers.map((s) => SUPPLIER_CONFIG[s]?.name || s).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-charcoal-light">Usines agréées Tunisie &amp; Turquie</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Decors Section for products with decors */}
        {product.decors && (
          <div className="mb-16">
            <DecorGrid
              title={`Nuancier Décors Associés au ${product.name}`}
              subtitle="Parcourez les textures et finitions disponibles en stock pour ce type de panneau"
            />
          </div>
        )}

        {/* Related MDF Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-primary">
                Autres Types de Panneaux MDF
              </h2>
              <Link
                href="/produits/mdf"
                className="text-xs font-bold text-secondary hover:text-accent flex items-center gap-1"
              >
                Voir tout le MDF &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/produits/mdf/${rel.slug}`}
                  className="group bg-white rounded-2xl p-5 border border-wood-border hover:border-secondary transition-all shadow-card hover:shadow-card-hover flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-wood-cream shrink-0 relative border border-wood-border">
                    <img
                      src={`${rel.imagePath}${rel.coverImage}`}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-bold text-primary group-hover:text-secondary transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-charcoal-light line-clamp-1">
                      {rel.epaisseurs.join(', ')} mm
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quote Form pre-filled for this product */}
        <div id="devis" className="scroll-mt-24">
          <ContactForm
            defaultCategory="mdf"
            defaultProduct={`MDF : ${product.name}`}
          />
        </div>
      </div>
    </div>
  );
}
