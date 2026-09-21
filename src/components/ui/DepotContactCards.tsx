'use client';

import React from 'react';
import { Phone, MapPin, Building2, User, Crown, Clock, ArrowUpRight } from 'lucide-react';
import { DEPOT_CONTACTS, DepotContact, COMPANY_INFO } from '@/lib/catalog';
import { cn } from '@/lib/utils';

/**
 * DepotContactCards Component
 * 
 * Aesthetic Direction:
 * Editorial luxury card showcase specifically designed for the SOCOFEB Contact page.
 * Strictly adheres to the SOCOFEB palette:
 * - Primary: #4A2C0A
 * - Secondary: #7B4F1E
 * - Accent: #C8922A
 * - Background: #FAF6EE / #F5ECD7
 * 
 * Features:
 * - Grouped logically by Depot (Dépôt Jâafer vs. Dépôt Sidi Amor).
 * - Clear distinction for Owners (Mohamed Amine KLABI, Hassen KLABI) with dedicated Propriétaire badges.
 * - Semantic, high-contrast, accessible `tel:` links with generous mobile touch targets.
 * - Depot metadata (address, business hours, and location indicator).
 * - Fully responsive grid (1 col mobile, 2 col tablet, 3 col desktop for Jâafer, 2 col for Sidi Amor).
 */
export function DepotContactCards() {
  // Separate contacts by depot group
  const jaaferContacts = DEPOT_CONTACTS.filter(
    (c) => c.depotGroup === 'Dépôt Jâafer'
  );
  const sidiAmorContacts = DEPOT_CONTACTS.filter(
    (c) => c.depotGroup === 'Dépôt Sidi Amor'
  );

  // Retrieve depot metadata from COMPANY_INFO
  const jaaferInfo = COMPANY_INFO.locations.find((l) => l.id === 'siege-jaafer');
  const sidiAmorInfo = COMPANY_INFO.locations.find((l) => l.id === 'point-sidi-amor');

  return (
    <section
      aria-labelledby="depot-contacts-heading"
      className="my-12 sm:my-16"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/15 px-3.5 py-1 rounded-full border border-accent/25">
          Interlocuteurs Directs
        </span>
        <h2
          id="depot-contacts-heading"
          className="font-heading text-2xl sm:text-4xl font-bold text-primary mt-3 mb-3"
        >
          Nos Équipes &amp; Responsables par Dépôt
        </h2>
        <p className="text-charcoal-light text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Pour vos demandes de prix, consultations techniques, réservations de lots ou suivis de livraison, contactez directement l&apos;un de nos responsables sur votre dépôt de référence.
        </p>
      </div>

      {/* Main Depots Container */}
      <div className="space-y-12 sm:space-y-16">
        {/* ========================================================= */}
        {/* GROUP 1: DÉPÔT JÂAFER (Siège & Dépôt Principal)           */}
        {/* ========================================================= */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-wood-border shadow-card">
          {/* Depot Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-wood-border gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary text-accent flex items-center justify-center shadow-md shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">
                    Dépôt Jâafer
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-accent/20 text-wood-dark px-2.5 py-0.5 rounded-full border border-accent/30">
                    Siège Principal
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-light mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                    {jaaferInfo?.address || 'Route de Raoued Km 3, Jâafer – Ariana'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                    {jaaferInfo?.hours || '07h30 – 17h30'}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold text-charcoal-light bg-wood-cream px-3 py-1.5 rounded-xl border border-wood-border shrink-0 self-start sm:self-auto">
              3 Interlocuteurs disponibles
            </span>
          </div>

          {/* Cards Grid: 3 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jaaferContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* GROUP 2: DÉPÔT SIDI AMOR (Point de Vente 2)               */}
        {/* ========================================================= */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 border border-wood-border shadow-card">
          {/* Depot Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-wood-border gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-md shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">
                    Dépôt Sidi Amor
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full border border-secondary/25">
                    Point de Vente 2
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-light mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                    {sidiAmorInfo?.address || 'Route de Gammarth Km 9, Sidi Amor – Ariana'}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-accent/70 shrink-0" />
                    {sidiAmorInfo?.hours || '08h00 – 17h00'}
                  </span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold text-charcoal-light bg-wood-cream px-3 py-1.5 rounded-xl border border-wood-border shrink-0 self-start sm:self-auto">
              2 Interlocuteurs disponibles
            </span>
          </div>

          {/* Cards Grid: 2 columns on tablet & desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {sidiAmorContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Contact Card
 * Visual hierarchy: Name -> Propriétaire Badge (if owner) -> Phone Action Button -> Location
 */
function ContactCard({ contact }: { contact: DepotContact }) {
  const isOwner = contact.isOwner;

  return (
    <div
      className={cn(
        'group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between',
        isOwner
          ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border-2 border-accent/40 shadow-card hover:shadow-card-hover hover:border-accent hover:-translate-y-1'
          : 'bg-white border border-wood-border shadow-card hover:shadow-card-hover hover:border-accent/40 hover:-translate-y-1'
      )}
    >
      {/* Top Header: Avatar + Propriétaire Badge */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Avatar Icon */}
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
              isOwner
                ? 'bg-accent/20 text-accent-dark ring-2 ring-accent/30'
                : 'bg-wood-cream text-primary border border-wood-border'
            )}
          >
            {isOwner ? (
              <Crown className="w-5 h-5 text-accent" />
            ) : (
              <User className="w-5 h-5 text-charcoal" />
            )}
          </div>

          {/* Propriétaire / Role Badge */}
          {isOwner && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-accent/25 to-amber-500/20 text-primary border border-accent/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Propriétaire
            </span>
          )}
        </div>

        {/* Contact Name */}
        <h4 className="font-heading text-lg sm:text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-1">
          {contact.name}
        </h4>

        {/* Location Subtitle */}
        <div className="flex items-center gap-1.5 text-xs text-charcoal-light mb-6">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="font-medium">{contact.location}</span>
        </div>
      </div>

      {/* Interactive Phone Link (Call Action CTA) */}
      <div className="pt-4 border-t border-wood-border/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light/80 block mb-1.5">
          {isOwner ? 'Ligne Directe Propriétaire :' : 'Ligne Commerciale Directe :'}
        </span>

        <a
          href={`tel:${contact.phoneRaw}`}
          aria-label={`Appeler ${contact.name}${isOwner ? ' (Propriétaire)' : ''} au ${contact.phone}`}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 group/btn',
            isOwner
              ? 'bg-primary hover:bg-wood-dark text-white shadow-md hover:shadow-lg'
              : 'bg-wood-cream hover:bg-accent hover:text-wood-dark text-primary border border-wood-border hover:border-accent shadow-sm'
          )}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isOwner
                  ? 'bg-accent/25 text-accent'
                  : 'bg-white text-accent group-hover/btn:bg-wood-dark group-hover/btn:text-accent'
              )}
            >
              <Phone className="w-3.5 h-3.5" />
            </div>
            <span className="tracking-wide font-mono text-xs sm:text-sm">
              {contact.phone}
            </span>
          </div>

          <ArrowUpRight
            className={cn(
              'w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5',
              isOwner ? 'text-accent' : 'text-primary group-hover/btn:text-wood-dark'
            )}
          />
        </a>
      </div>
    </div>
  );
}
