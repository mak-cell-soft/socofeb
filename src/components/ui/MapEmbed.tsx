'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export function MapEmbed({ className }: { className?: string }) {
  const [activeLocation, setActiveLocation] = useState<string>('siege-jaafer');

  const loc =
    COMPANY_INFO.locations.find((l) => l.id === activeLocation) ||
    COMPANY_INFO.locations[0];

  return (
    <div className={cn('bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-wood-border', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            Points de Vente SOCOFEB
          </span>
          <h3 className="font-heading text-2xl font-bold text-primary mt-2">
            2 Dépôts à l&apos;Ariana
          </h3>
        </div>

        {/* Location selector tabs */}
        <div className="flex gap-2">
          {COMPANY_INFO.locations.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLocation(l.id)}
              className={cn(
                'px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
                activeLocation === l.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-wood-cream text-charcoal border-wood-border hover:bg-wood-border'
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected location summary card */}
      <div className="bg-wood-cream/60 rounded-2xl p-5 mb-6 border border-wood-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block text-sm mb-0.5">
              {loc.name}
            </span>
            <span className="text-charcoal-light leading-relaxed">
              {loc.address}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block text-sm mb-0.5">
              Horaires d&apos;ouverture
            </span>
            <span className="text-charcoal-light leading-relaxed">
              {loc.hours}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-primary block text-sm mb-0.5">
              Téléphone Direct
            </span>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              {COMPANY_INFO.phoneDisplay}
            </a>
            <span className="block text-[11px] text-charcoal-light">
              Contact : {COMPANY_INFO.contactPerson}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual */}
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-wood-border bg-wood-dark shadow-inner">
        {/* Map stylized background */}
        <iframe
          title={`Carte ${loc.name}`}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            loc.address
          )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
        />

        <div className="absolute bottom-4 right-4">
          <a
            href={loc.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/95 text-primary hover:text-accent font-bold text-xs uppercase tracking-wider shadow-lg border border-wood-border transition-all hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5 text-accent" />
            Itinéraire Google Maps
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
