import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductImageGallery, GalleryImage } from '@/components/ui/ProductImageGallery';
import { ContactForm } from '@/components/ui/ContactForm';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { SolidWoodProduct } from '@/types/product';
import { TreePine, CheckCircle2, Ruler, Shield, Phone, FileText } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const woodCat = PRODUCT_CATEGORIES.find((c) => c.id === 'bois-massifs');
  return (woodCat?.products || []).map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const woodCat = PRODUCT_CATEGORIES.find((c) => c.id === 'bois-massifs');
  const wood = woodCat?.products.find((p) => p.slug === params.slug) as
    | SolidWoodProduct
    | undefined;

  if (!wood) return { title: 'Bois non trouvé' };

  return {
    title: `${wood.name} Massif (${wood.essence}) — SOCOFEB Tunisie`,
    description: `Acheter du ${wood.name} massif en Tunisie. Essence : ${wood.essence}. Usages : ${wood.usages.join(
      ', '
    )}. Stock disponible à Ariana.`,
  };
}

export default function BoisDetailPage({ params }: Props) {
  const woodCat = PRODUCT_CATEGORIES.find((c) => c.id === 'bois-massifs');
  const wood = woodCat?.products.find((p) => p.slug === params.slug) as
    | SolidWoodProduct
    | undefined;

  if (!wood) notFound();

  const galleryImages: GalleryImage[] = [
    {
      src: `${wood.imagePath}${wood.coverImage}`,
      label: `${wood.name} Brut`,
      ref: `BOIS-${wood.slug.toUpperCase()}-01`,
    },
  ];

  if (wood.slug === 'bois-blanc') {
    galleryImages.push({
      src: '/images/bois/bois-blanc/bois-blanc-rabote.webp',
      label: 'Bois Blanc Raboté 4 Faces',
      ref: 'BB-002',
    });
  } else if (wood.slug === 'bois-rouge') {
    galleryImages.push({
      src: '/images/bois/bois-rouge/bois-rouge-chevron.webp',
      label: 'Chevrons & Madriers Bois Rouge',
      ref: 'BR-002',
    });
  } else if (wood.slug === 'chene') {
    galleryImages.push({
      src: '/images/bois/chene/chene-avive.webp',
      label: 'Plots & Avivés Chêne Noble',
      ref: 'CH-002',
    });
  } else if (wood.slug === 'hetre') {
    galleryImages.push({
      src: '/images/bois/hetre/hetre-etuve.webp',
      label: 'Plateaux de Hêtre Rosé Étuve',
      ref: 'HT-002',
    });
  } else if (wood.slug === 'acajou') {
    galleryImages.push({
      src: '/images/bois/acajou/acajou-precieux.webp',
      label: 'Avivés Acajou d\'Exception',
      ref: 'AC-002',
    });
  }

  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'Bois Massifs', href: '/produits/bois' },
            { label: wood.name },
          ]}
        />

        {/* Top Product Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-wood-border shadow-card my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <ProductImageGallery
                images={galleryImages}
                productName={wood.name}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                  {wood.essence}
                </span>

                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-3">
                  {wood.name} Massif
                </h1>

                <p className="text-charcoal-light text-sm sm:text-base leading-relaxed mb-6">
                  {wood.description}
                </p>

                {/* Usages & Finitions */}
                <div className="space-y-4 mb-6 bg-wood-cream/50 p-4 rounded-2xl border border-wood-border text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-primary block mb-1">
                      Applications recommandées :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {wood.usages.map((u) => (
                        <span
                          key={u}
                          className="bg-white px-2.5 py-1 rounded-md text-charcoal border border-wood-border font-medium"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-primary block mb-1">
                      Finitions disponibles :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {wood.finishes.map((f) => (
                        <span
                          key={f}
                          className="bg-white px-2.5 py-1 rounded-md text-charcoal border border-wood-border font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-primary block mb-1">
                      Sections standards (mm) :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {wood.sections.map((s) => (
                        <span
                          key={s}
                          className="bg-accent/20 text-wood-dark px-2 py-0.5 rounded text-xs font-mono font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href="#devis"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-102 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Demander un devis en m³ ou ml
                </a>

                <a
                  href="https://wa.me/21699218866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary font-bold text-xs sm:text-sm uppercase tracking-wider border border-wood-border transition-all"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  Discuter avec Mohamed Amine KLABI
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Form pre-filled */}
        <div id="devis" className="scroll-mt-24">
          <ContactForm
            defaultCategory="bois-massifs"
            defaultProduct={`Bois Massif : ${wood.name} (${wood.essence})`}
          />
        </div>
      </div>
    </div>
  );
}
