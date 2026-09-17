'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';

export function WhatsAppButton() {
  const defaultMessage = encodeURIComponent(
    'Bonjour SOCOFEB, je souhaite avoir des renseignements sur vos produits bois et panneaux MDF.'
  );

  return (
    <aside aria-label="Contact rapide WhatsApp" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-xl bg-wood-dark/95 text-white text-xs font-semibold shadow-xl border border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Besoin d&apos;un devis ? Contactez-nous
      </span>

      {/* Floating Action Button */}
      <a
        href={`${COMPANY_INFO.whatsappUrl}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter SOCOFEB sur WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulse ripple rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full border-2 border-[#25D366]/30 pointer-events-none" />

        <MessageCircle className="w-7 h-7 fill-white text-[#25D366] relative z-10" />
      </a>
    </aside>
  );
}
