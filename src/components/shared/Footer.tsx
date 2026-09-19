'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ExternalLink,
  TreePine,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { COMPANY_INFO, PRODUCT_CATEGORIES, SUPPLIER_CONFIG } from '@/lib/catalog';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood-dark text-white border-t-2 border-accent/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                <TreePine className="w-6 h-6 text-wood-dark" />
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-white tracking-wider block leading-none">
                  SOCOFEB
                </span>
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest">
                  FER &amp; BOIS TUNISIE
                </span>
              </div>
            </Link>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Société Commerciale du Fer et du Bois. Négoce, distribution et
              stock permanent de bois massifs et panneaux dérivés (MDF,
              Contreplaqué, OSB) pour menuisiers, architectes et professionnels du
              bâtiment.
            </p>

            <div className="pt-2">
              <span className="text-xs text-accent font-semibold block mb-1">
                Direction commerciale :
              </span>
              <p className="text-sm font-bold text-white">
                {COMPANY_INFO.contactPerson}
              </p>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-bold mt-1"
              >
                <Phone className="w-3.5 h-3.5" />
                {COMPANY_INFO.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Col 2: Produits & Dérivés */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Nos Produits
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.slug}
                    className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-accent/70 group-hover:translate-x-1 transition-transform" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/produits/mdf"
                  className="text-gray-300 hover:text-accent transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-accent/70 group-hover:translate-x-1 transition-transform" />
                  <span>Nuancier Décors MDF</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="text-accent hover:underline flex items-center gap-2 font-bold"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  <span>Promotions &amp; Déstockage</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Partenaires Fabricants */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Partenaires Industriels
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              {Object.entries(SUPPLIER_CONFIG).map(([slug, sup]) => (
                <li key={slug}>
                  <Link
                    href={`/providers/${slug}`}
                    className="group flex items-center justify-between text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: sup.color }}
                      />
                      <span className="font-bold group-hover:text-accent transition-colors">
                        {sup.name}
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-200">
                      Gamme &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>Normes européennes EN 622-5 &amp; EN 300 certifiées</span>
              </div>
            </div>
          </div>

          {/* Col 4: Deux dépôts Ariana */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              2 Dépôts à l&apos;Ariana
            </h4>

            {/* Dépôt 1 */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    Siège Principal (Jâafer)
                  </span>
                  <span className="text-gray-300 text-[11px] leading-relaxed block">
                    Route de Raoued Km 3, Jâafer – Ariana
                  </span>
                  <span className="text-gray-400 text-[10px] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-accent" /> 07h30 – 17h30 (Lun-Sam)
                  </span>
                </div>
              </div>
            </div>

            {/* Dépôt 2 */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    Point de Vente 2 (Sidi Amor)
                  </span>
                  <span className="text-gray-300 text-[11px] leading-relaxed block">
                    Route de Gammarth Km 9, Sidi Amor – Ariana
                  </span>
                  <span className="text-gray-400 text-[10px] flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-accent" /> 08h00 – 17h00 (Lun-Sam)
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`${COMPANY_INFO.whatsappUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; {currentYear} SOCOFEB — Société Commerciale du Fer et du Bois.
            Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>www.socofeb-decor.com</span>
            <span>Ariana, Tunisie</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
