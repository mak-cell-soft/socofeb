'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';
import { SupplierBadge } from '@/components/ui/SupplierBadge';
import { ProductImageGallery, GalleryImage } from '@/components/ui/ProductImageGallery';
import { ImageLightbox, LightboxImageItem } from '@/components/ui/ImageLightbox';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  HardHat,
  Truck,
  Sparkles,
  Maximize2,
  Phone,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';
import { motion } from 'framer-motion';

// Complete OSB image gallery from public/images/osb/
const OSB_GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/osb/osb2.jpg',
    label: 'Panneau OSB/3 Structurel Haute Résistance',
    ref: 'OSB-3-PANNEAU',
  },
  {
    src: '/images/osb/osb1.jpg',
    label: 'Texture Lamelles Orientées Croisées (Classe 3)',
    ref: 'OSB-3-TEXTURE',
  },
  {
    src: '/images/osb/osb4.jpg',
    label: 'Épaisseurs Calibrées (9 à 25 mm) & Rives Usinées',
    ref: 'OSB-3-EPAISSEURS',
  },
  {
    src: '/images/osb/osb5.jpg',
    label: 'Panneau Plein Format Industriel 2500×1250 mm',
    ref: 'OSB-3-FORMAT',
  },
  {
    src: '/images/osb/osb3.jpg',
    label: 'Aménagement Intérieur & Mobilier Design Industriel',
    ref: 'OSB-3-DESIGN',
  },
];

// Contextual Applications & Use Cases
const OSB_APPLICATIONS = [
  {
    title: 'Toitures & Sous-Toitures',
    category: 'Couverture & Étanchéité',
    src: '/images/osb/osb2.jpg',
    description:
      'Support rigide continu pour étanchéité bitumineuse, bac acier ou tuiles. Excellente tenue sous charge climatique et résistance à l’humidité.',
  },
  {
    title: 'Planchers & Dalles Techniques',
    category: 'Structure Horizontale',
    src: '/images/osb/osb4.jpg',
    description:
      'Planchers porteurs légers, dalles sèches et mezzanines. Forte résistance à la flexion sans grincement ni déformation.',
  },
  {
    title: 'Contreventement Ossature Bois',
    category: 'Murs Porteurs',
    src: '/images/osb/osb1.jpg',
    description:
      'Rigidification parasismique des façades et cloisons en construction bois. Stabilité dimensionnelle et étanchéité à l’air éprouvée.',
  },
  {
    title: 'Panneau Plein Format Industriel',
    category: 'Industrie & Chantier',
    src: '/images/osb/osb5.jpg',
    description:
      'Panneaux bruts en palettes complètes pour coffrages béton soignés, emballages lourds et cloisons de chantier robustes.',
  },
  {
    title: 'Aménagement & Mobilier Design',
    category: 'Architecture Intérieure',
    src: '/images/osb/osb3.jpg',
    description:
      'Plans de travail, comptoirs d’accueil, habillages muraux et agencements contemporains au cachet industriel chaleureux.',
  },
];

export default function OSBPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openApplicationLightbox = (index: number) => {
    // Find index in main gallery or open application
    const app = OSB_APPLICATIONS[index];
    const matchIdx = OSB_GALLERY_IMAGES.findIndex((img) => img.src === app.src);
    setLightboxIndex(matchIdx !== -1 ? matchIdx : 0);
    setLightboxOpen(true);
  };

  const lightboxItems: LightboxImageItem[] = OSB_GALLERY_IMAGES.map((img) => ({
    src: img.src,
    label: img.label,
    ref: img.ref,
    supplier: 'STIBOIS / SOCOFEB',
  }));

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Produits', href: '/produits' },
            { label: 'OSB/3 Structurel' },
          ]}
        />

        {/* Main Product Hero Showcase Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-wood-border shadow-card my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Interactive Product Multi-Photo Gallery */}
            <div className="lg:col-span-7">
              <ProductImageGallery
                images={OSB_GALLERY_IMAGES}
                supplier="stibois"
                productName="Panneaux OSB/3 Norme EN 300"
              />
              <p className="text-[11px] text-charcoal-light/70 text-center mt-2 font-medium">
                Survolez pour zoomer &bull; Cliquez sur une photo pour afficher en grand
              </p>
            </div>

            {/* Right Column: Key Commercial & Technical Specifications */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Norme NF EN 300
                  </span>
                  <SupplierBadge supplier="stibois" size="sm" />
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-3">
                  Panneaux OSB/3 Structurels
                </h1>
                <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Le panneau <strong>OSB/3</strong> (Oriented Strand Board) est constitué de lamelles de bois résineux orientées en 3 couches croisées, pressées à chaud avec une résine polyuréthane PMDI <strong>100% sans formaldéhyde ajouté</strong>. Spécifiquement conçu pour les environnements humides et les structures sous fortes contraintes mécaniques.
                </p>

                {/* Technical specs table */}
                <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-wood-border space-y-2.5 text-xs mb-6">
                  <div className="flex justify-between pb-2 border-b border-wood-border/60">
                    <span className="font-semibold text-charcoal">Classe &amp; Norme :</span>
                    <span className="font-bold text-primary">OSB/3 &bull; NF EN 300</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-wood-border/60">
                    <span className="font-semibold text-charcoal">Épaisseurs en stock :</span>
                    <span className="font-bold text-primary">9, 12, 15, 18, 22, 25 mm</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-wood-border/60">
                    <span className="font-semibold text-charcoal">Format panneau :</span>
                    <span className="font-bold text-primary">2500 &times; 1250 mm</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-wood-border/60">
                    <span className="font-semibold text-charcoal">Liant &amp; Résine :</span>
                    <span className="font-bold text-primary">PMDI hydrofuge sans formaldéhyde</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-charcoal">Densité nominale :</span>
                    <span className="font-bold text-primary">~600 à 650 kg/m³</span>
                  </div>
                </div>

                {/* Stock notice */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 animate-pulse" />
                  <span>En stock permanent disponible en palettes complètes ou au détail (Jâafer &amp; Sidi Amor)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="#devis"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-gold-glow transition-all flex-1 text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  Demander un Devis OSB
                </a>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20des%20panneaux%20OSB%2F3.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Technical Highlights Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-5 border border-wood-border shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-primary">Hydrofuge Classe 3</h4>
              <p className="text-[11px] text-charcoal-light mt-0.5">
                Résistance supérieure au gonflement en milieu humide permanent.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-wood-border shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-primary">Stabilité Structurelle</h4>
              <p className="text-[11px] text-charcoal-light mt-0.5">
                Homogène sans nœuds, poches de résine ni risques de délamination.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-wood-border shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-primary">Facilité de Pose</h4>
              <p className="text-[11px] text-charcoal-light mt-0.5">
                Vissage rapide, clouage sans éclats et découpes nettes sur chantier.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-wood-border shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-primary">Livraison Chantiers</h4>
              <p className="text-[11px] text-charcoal-light mt-0.5">
                Livraison rapide par camion avec déchargement sur le Grand Tunis.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Applications Gallery Grid */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25 inline-flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Mises en Situation
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                Applications &amp; Usages Professionnels de l&apos;OSB/3
              </h2>
            </div>
            <p className="text-xs text-charcoal-light font-medium">
              Cliquez sur une mise en situation pour agrandir en HD
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OSB_APPLICATIONS.map((app, idx) => (
              <motion.div
                key={app.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                onClick={() => openApplicationLightbox(idx)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-wood-border shadow-card hover:shadow-card-hover cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-wood-dark">
                  <Image
                    src={app.src}
                    alt={app.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-dark/75 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge top-left */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/15 shadow-sm">
                      {app.category}
                    </span>
                  </div>

                  {/* Zoom indicator top-right */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Card body text */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-primary group-hover:text-accent transition-colors mb-1.5">
                      {app.title}
                    </h3>
                    <p className="text-xs text-charcoal-light leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-accent">
                    <span>Aperçu photographique</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form Devis Section */}
        <div id="devis" className="scroll-mt-24">
          <ContactForm
            defaultCategory="osb"
            defaultProduct="Panneau OSB/3 Norme NF EN 300"
          />
        </div>
      </div>

      {/* Lightbox for HD viewing */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName="SOCOFEB &bull; Panneaux OSB/3"
      />
    </div>
  );
}
