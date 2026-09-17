'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, Layers } from 'lucide-react';
import { ImageLightbox, LightboxImageItem } from '@/components/ui/ImageLightbox';

const realisations = [
  {
    title: 'Agencement Villa Gammarth',
    category: 'MDF High Gloss & Chêne Massif',
    src: '/images/realisations/realisation-1.webp',
    ref: 'REAL-01',
    description: 'Façades en laque brillante et claustras en chêne noble massif de premier choix.',
  },
  {
    title: 'Cuisine Contemporaine Ariana',
    category: 'MPBS Acrylique Blanc & Noyer',
    src: '/images/realisations/realisation-2.webp',
    ref: 'REAL-02',
    description: 'Compositions de façades épurées résistantes aux rayures et à l’humidité.',
  },
  {
    title: 'Dressing Sur-Mesure La Marsa',
    category: 'MDF Stratifié Stipan Earth Line',
    src: '/images/realisations/realisation-3.webp',
    ref: 'REAL-03',
    description: 'Décors chaleureux ton chêne naturel et bouleau blanc pour rangements sur-mesure.',
  },
  {
    title: 'Escalier & Parquet Carthage',
    category: 'Chêne Massif Premier Choix',
    src: '/images/realisations/realisation-4.webp',
    ref: 'REAL-04',
    description: 'Marches et contremarches en chêne séché sous contrôle rigoureux d’hygrométrie.',
  },
  {
    title: 'Charpente Traditionnelle Raoued',
    category: 'Bois Rouge Massif C24',
    src: '/images/realisations/realisation-5.webp',
    ref: 'REAL-05',
    description: 'Poutres maîtresses et pannes en résineux scandinave classe de résistance C24.',
  },
  {
    title: 'Bureaux Direction Les Berges du Lac',
    category: 'STARWOOD Calacatta & Béton Ciré',
    src: '/images/realisations/realisation-6.webp',
    ref: 'REAL-06',
    description: 'Tables de réunion monumentales et panneaux muraux habillés en décors minéraux importés.',
  },
];

export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const lightboxItems: LightboxImageItem[] = realisations.map((r) => ({
    src: r.src,
    label: r.title,
    ref: r.category,
    supplier: 'SOCOFEB Réalisation',
  }));

  const openItem = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Savoir-Faire &amp; Projets
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">
            Mises en Situation &amp; Réalisations
          </h2>
          <p className="text-charcoal-light text-sm sm:text-base">
            Découvrez nos bois massifs et panneaux décoratifs mis en œuvre par les meilleurs menuisiers, agenceurs et architectes de Tunisie.
          </p>
        </div>

        {/* 6 Realisations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {realisations.map((item, idx) => (
            <motion.div
              key={item.ref}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => openItem(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-card-hover border border-wood-border bg-wood-dark"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-wood-dark via-wood-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Category chip top left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent text-wood-dark shadow-sm flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {item.category}
                </span>
              </div>

              {/* Zoom eye top right */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                <Eye className="w-4 h-4" />
              </div>

              {/* Text content bottom */}
              <div className="absolute inset-x-0 bottom-0 p-5 z-10 text-white">
                <h3 className="font-heading text-lg sm:text-xl font-bold group-hover:text-accent transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <ImageLightbox
        images={lightboxItems}
        initialIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        supplierName="SOCOFEB Réalisations"
      />
    </section>
  );
}
