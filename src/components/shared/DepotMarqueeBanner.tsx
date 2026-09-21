'use client';

import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import { DEPOT_CONTACTS, DepotContact } from '@/lib/catalog';

/**
 * DepotMarqueeBanner
 * 
 * Aesthetic Direction & Intent:
 * Refined editorial luxury ticker adhering strictly to the SOCOFEB design tokens
 * (#241402 wood-dark background, #C8922A rich gold accents, Inter body font).
 * 
 * Key Features:
 * - Continuous, GPU-accelerated horizontal scrolling marquee.
 * - Mathematically seamless loop (dual identical segments shifted by -50%).
 * - Interactive hover & focus-within pause to allow effortless clicking of tel: links.
 * - Accessible aria-labels and semantic tel: links for mobile & desktop dialers.
 * - Fallback for prefers-reduced-motion allowing static, accessible browsing.
 * - Soft edge vignettes for smooth entrance/exit without visual pop-in.
 */
export function DepotMarqueeBanner() {
  // We duplicate the 3 depot contacts multiple times per segment to ensure
  // seamless visual density across ultra-wide desktop monitors (1440p, 4K) as well as mobile.
  const segmentItems: DepotContact[] = [
    ...DEPOT_CONTACTS,
    ...DEPOT_CONTACTS,
    ...DEPOT_CONTACTS,
  ];

  return (
    <aside
      aria-label="Contacts directs des dépôts SOCOFEB"
      className="relative w-full bg-wood-dark text-white/90 border-b border-accent/25 overflow-hidden z-30 select-none"
    >
      <div className="relative flex items-center h-9 sm:h-10">
        {/* Pinned Left Badge: Identifies the purpose of the ticker on medium+ screens */}
        <div className="hidden lg:flex items-center gap-1.5 pl-4 pr-3 py-1 bg-wood-dark/95 z-20 shrink-0 border-r border-accent/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-[11px] font-bold text-accent tracking-wider uppercase">
            Contacts Dépôts
          </span>
        </div>

        {/* Soft edge gradients for a luxurious cinematic fade on the edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 lg:left-[140px] top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-wood-dark to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-wood-dark to-transparent z-10"
        />

        {/* Scrolling Track: Contains two identical halves moving continuously */}
        <div
          className="animate-depot-marquee flex items-center"
          role="region"
          aria-live="off"
        >
          {/* Half 1 */}
          <div className="flex items-center shrink-0">
            {segmentItems.map((contact, index) => (
              <MarqueeItem
                key={`segment-1-${contact.id}-${index}`}
                contact={contact}
              />
            ))}
          </div>

          {/* Half 2 (Exact duplicate for seamless looping without jumps) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {segmentItems.map((contact, index) => (
              <MarqueeItem
                key={`segment-2-${contact.id}-${index}`}
                contact={contact}
                isAriaHidden={true}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

interface MarqueeItemProps {
  contact: DepotContact;
  isAriaHidden?: boolean;
}

/**
 * Single Depot Contact item inside the scrolling track.
 * Visual structure: Name  •  Phone  •  Location  •  Separator
 */
function MarqueeItem({ contact, isAriaHidden = false }: MarqueeItemProps) {
  return (
    <div className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 shrink-0 text-[11px] sm:text-xs">
      {/* Contact Person Name */}
      <span className="font-semibold text-white/95 whitespace-nowrap tracking-wide">
        {contact.name}
      </span>

      {/* Bullet separator */}
      <span className="text-accent/60 text-[10px]" aria-hidden="true">
        •
      </span>

      {/* Clickable Phone Link */}
      <a
        href={`tel:${contact.phoneRaw}`}
        tabIndex={isAriaHidden ? -1 : 0}
        aria-label={
          isAriaHidden
            ? undefined
            : `Appeler ${contact.name} (${contact.location}) au ${contact.phone}`
        }
        className="inline-flex items-center gap-1.5 font-bold text-accent hover:text-accent-light hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1 py-0.5"
      >
        <Phone className="w-3 h-3 text-accent shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap tracking-wider">{contact.phone}</span>
      </a>

      {/* Bullet separator */}
      <span className="text-accent/60 text-[10px]" aria-hidden="true">
        •
      </span>

      {/* Depot Location */}
      <span className="inline-flex items-center gap-1 text-gray-300 font-medium whitespace-nowrap">
        <MapPin className="w-3 h-3 text-accent/80 shrink-0" aria-hidden="true" />
        <span>{contact.location}</span>
      </span>

      {/* Trailing item divider */}
      <span className="text-white/20 ml-3 sm:ml-4" aria-hidden="true">
        |
      </span>
    </div>
  );
}
