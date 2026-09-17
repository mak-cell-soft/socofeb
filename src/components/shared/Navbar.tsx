'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  MessageSquare,
  Sparkles,
  TreePine,
  Layers,
  Building2,
  Tag,
} from 'lucide-react';
import { COMPANY_INFO, PRODUCT_CATEGORIES, SUPPLIER_CONFIG } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
    setBrandsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top micro announcement bar */}
      <div className="bg-wood-dark text-white/90 text-[11px] sm:text-xs py-1.5 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Ariana : Route de Raoued Km3 (Jâafer) &amp; Route de Gammarth Km9 (Sidi Amor)
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-300">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              Spécialiste Bois Massifs &amp; Panneaux Dérivés
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-1.5 text-accent hover:underline font-bold"
            >
              <Phone className="w-3 h-3 text-accent" />
              {COMPANY_INFO.phoneDisplay} — {COMPANY_INFO.contactPerson}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={cn(
          'w-full transition-all duration-300',
          scrolled
            ? 'bg-primary/95 backdrop-blur-md shadow-xl py-3 border-b border-accent/20'
            : 'bg-primary py-4 border-b border-white/10'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-dark shadow-md group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5 sm:w-6 sm:h-6 text-wood-dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl sm:text-2xl text-white tracking-wider leading-none">
                SOCOFEB
              </span>
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest mt-0.5">
                BOIS &amp; PANNEAUX DÉRIVÉS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                pathname === '/'
                  ? 'text-accent bg-white/10'
                  : 'text-white/90 hover:text-accent hover:bg-white/5'
              )}
            >
              Accueil
            </Link>

            {/* Produits Mega / Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                  pathname.startsWith('/produits')
                    ? 'text-accent bg-white/10'
                    : 'text-white/90 hover:text-accent hover:bg-white/5'
                )}
              >
                Produits
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 w-80 bg-wood-dark/95 backdrop-blur-lg rounded-2xl shadow-2xl p-3 border border-accent/30 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.slug}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group/item"
                      >
                        <span className="text-xl p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/item:border-accent">
                          {cat.icon}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white group-hover/item:text-accent transition-colors">
                            {cat.label}
                          </p>
                          <p className="text-[11px] text-gray-300 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <Link
                      href="/produits"
                      className="block text-center text-xs font-bold text-accent hover:underline py-1"
                    >
                      Voir tout le catalogue &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Marques Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBrandsOpen(true)}
              onMouseLeave={() => setBrandsOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                  pathname.startsWith('/marques')
                    ? 'text-accent bg-white/10'
                    : 'text-white/90 hover:text-accent hover:bg-white/5'
                )}
              >
                Marques
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {brandsOpen && (
                <div className="absolute top-full left-0 w-72 bg-wood-dark/95 backdrop-blur-lg rounded-2xl shadow-2xl p-3 border border-accent/30 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    {Object.entries(SUPPLIER_CONFIG).map(([slug, sup]) => (
                      <Link
                        key={slug}
                        href={`/marques/${slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors group/item"
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: sup.color }}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-white group-hover/item:text-accent transition-colors">
                            {sup.name}
                          </p>
                          <p className="text-[10px] text-gray-300 line-clamp-1">
                            {sup.fullName}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <Link
                      href="/marques"
                      className="block text-center text-xs font-bold text-accent hover:underline py-1"
                    >
                      Tous nos partenaires industriels &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Promotions with badge */}
            <Link
              href="/promotions"
              className={cn(
                'relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                pathname === '/promotions'
                  ? 'text-accent bg-white/10'
                  : 'text-white/90 hover:text-accent hover:bg-white/5'
              )}
            >
              <Tag className="w-3.5 h-3.5 text-accent" />
              Promotions
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full ml-0.5">
                PROMO
              </span>
            </Link>

            <Link
              href="/realisations"
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                pathname === '/realisations'
                  ? 'text-accent bg-white/10'
                  : 'text-white/90 hover:text-accent hover:bg-white/5'
              )}
            >
              Réalisations
            </Link>

            <Link
              href="/a-propos"
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                pathname === '/a-propos'
                  ? 'text-accent bg-white/10'
                  : 'text-white/90 hover:text-accent hover:bg-white/5'
              )}
            >
              À Propos
            </Link>

            <Link
              href="/contact"
              className={cn(
                'px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors',
                pathname === '/contact'
                  ? 'text-accent bg-white/10'
                  : 'text-white/90 hover:text-accent hover:bg-white/5'
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Button (Gold CTA) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-xs uppercase tracking-wider shadow-md hover:shadow-gold-glow transition-all hover:scale-105"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Demander un devis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Ouvrir le menu"
              className="p-2 rounded-xl bg-white/10 text-white hover:text-accent focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden bg-wood-dark border-b border-accent/20 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in duration-200">
          <Link
            href="/"
            className="block py-2 text-sm font-bold text-white hover:text-accent border-b border-white/5"
          >
            Accueil
          </Link>

          <div className="py-2 border-b border-white/5">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-2">
              Produits
            </span>
            <div className="grid grid-cols-2 gap-2 pl-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.slug}
                  className="text-xs text-gray-200 hover:text-accent py-1 block"
                >
                  {cat.icon} {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-2 border-b border-white/5">
            <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-2">
              Marques Partenaires
            </span>
            <div className="grid grid-cols-2 gap-2 pl-2">
              {Object.entries(SUPPLIER_CONFIG).map(([slug, sup]) => (
                <Link
                  key={slug}
                  href={`/marques/${slug}`}
                  className="text-xs text-gray-200 hover:text-accent py-1 block"
                >
                  {sup.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/promotions"
            className="flex items-center justify-between py-2 text-sm font-bold text-white hover:text-accent border-b border-white/5"
          >
            <span>Promotions Fournisseurs</span>
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              PROMO
            </span>
          </Link>

          <Link
            href="/realisations"
            className="block py-2 text-sm font-bold text-white hover:text-accent border-b border-white/5"
          >
            Réalisations
          </Link>

          <Link
            href="/a-propos"
            className="block py-2 text-sm font-bold text-white hover:text-accent border-b border-white/5"
          >
            À Propos
          </Link>

          <Link
            href="/contact"
            className="block py-2 text-sm font-bold text-white hover:text-accent border-b border-white/5"
          >
            Contact &amp; Dépôts
          </Link>

          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-wood-dark font-black text-xs uppercase tracking-wider shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              Demander un devis gratuit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
