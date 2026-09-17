'use client';

import React from 'react';
import { ContactForm } from '@/components/ui/ContactForm';
import { MapEmbed } from '@/components/ui/MapEmbed';

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-bg-light border-t border-wood-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            Contact &amp; Approvisionnement
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">
            Parlons de Votre Prochain Projet
          </h2>
          <p className="text-charcoal-light text-sm sm:text-base">
            Que vous soyez artisan menuisier, promoteur immobilier ou particulier exigeant, nos équipes vous accueillent à Jâafer et Sidi Amor pour vous conseiller et chiffrer vos besoins.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form col */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>

          {/* Map & Depots col */}
          <div className="lg:col-span-6">
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
