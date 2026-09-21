import React from 'react';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ContactForm } from '@/components/ui/ContactForm';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { DepotContactCards } from '@/components/ui/DepotContactCards';
import { COMPANY_INFO } from '@/lib/catalog';
import { Phone, MapPin, Clock, MessageSquare, Mail, Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Dépôts Ariana — SOCOFEB Tunisie',
  description:
    'Contactez SOCOFEB pour vos demandes de devis bois et panneaux. Nos deux points de vente à l\'Ariana : Route de Raoued Km3 (Jâafer) et Route de Gammarth Km9 (Sidi Amor). Tél : +216 99 218 866.',
};

export default function ContactPage() {
  return (
    <div className="bg-bg-light min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Contact & Devis' }]} />

        {/* Page Header */}
        <div className="my-8 sm:my-12 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/25">
            À Votre Service
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-3 mb-4">
            Contactez SOCOFEB
          </h1>
          <p className="text-charcoal-light text-sm sm:text-base leading-relaxed">
            Une question technique sur un panneau MDF ? Une commande volumineuse de bois massif ? Notre conseiller commercial <strong>Mohamed Amine KLABI</strong> et nos équipes de comptoir vous répondent dans les plus brefs délais.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Phone */}
          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4 text-primary">
              <Phone className="w-6 h-6 text-accent-dark" />
            </div>
            <span className="text-xs font-bold uppercase text-charcoal-light mb-1">
              Téléphone Direct
            </span>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="font-bold text-base text-primary hover:text-secondary transition-colors"
            >
              {COMPANY_INFO.phoneDisplay}
            </a>
            <span className="text-xs text-gray-500 mt-1">
              Contact : {COMPANY_INFO.contactPerson}
            </span>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center mb-4 text-[#25D366]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase text-charcoal-light mb-1">
              WhatsApp Professionnel
            </span>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-base text-primary hover:text-secondary transition-colors"
            >
              +216 99 218 866
            </a>
            <span className="text-xs text-gray-500 mt-1">
              Réponse instantanée
            </span>
          </div>

          {/* Card 3: Dépôt Jâafer */}
          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Building className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase text-charcoal-light mb-1">
              Siège &amp; Dépôt Jâafer
            </span>
            <p className="font-bold text-xs text-primary">
              Route de Raoued Km 3, Jâafer – Ariana
            </p>
            <span className="text-xs text-gray-500 mt-1">
              Lun - Sam : 07h30 – 17h30
            </span>
          </div>

          {/* Card 4: Dépôt Sidi Amor */}
          <div className="bg-white p-6 rounded-2xl border border-wood-border shadow-card flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase text-charcoal-light mb-1">
              Point de Vente Sidi Amor
            </span>
            <p className="font-bold text-xs text-primary">
              Route de Gammarth Km 9, Sidi Amor – Ariana
            </p>
            <span className="text-xs text-gray-500 mt-1">
              Lun - Sam : 08h00 – 17h00
            </span>
          </div>
        </div>

        {/* Dedicated Depot & Owner Contact Cards Section */}
        <DepotContactCards />

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-6">
            <ContactForm />
          </div>

          <div className="lg:col-span-6">
            <MapEmbed />
          </div>
        </div>
      </div>
    </div>
  );
}
