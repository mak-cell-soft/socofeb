import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { DecorGrid } from '@/components/ui/DecorGrid';
import { PromoCard } from '@/components/ui/PromoCard';
import { SUPPLIER_CONFIG, COMPANY_INFO } from '@/lib/catalog';
import { PROMO_IMAGES, getDynamicDecors } from '@/lib/images';
import { Supplier, SUPPLIERS } from '@/types/image';
import {
  ExternalLink,
  CheckCircle,
  Tag,
  Layers,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Ruler,
  Scissors,
  Warehouse,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { constructMetadata, getBreadcrumbJsonLd, SITE_ORIGIN } from '@/lib/seo';
import { extractDecorReference, extractDecorName, getDecorUrl, getDecorAltText } from '@/lib/decors';

interface Props {
  params: {
    provider: string;
  };
}

export function generateStaticParams() {
  return SUPPLIERS.map((provider) => ({
    provider,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const supplierKey = params.provider.toLowerCase() as Supplier;
  const supplier = SUPPLIER_CONFIG[supplierKey];
  if (!supplier) {
    return { title: 'Fournisseur non trouvé' };
  }

  const title = `${supplier.name} Tunisie — Panneaux Décoratifs & Décors`;
  const description = `Découvrez les panneaux décoratifs et finitions ${supplier.fullName} disponibles chez SOCOFEB en Tunisie. Nuancier officiel, références complètes et stock direct à Ariana.`;

  return constructMetadata({
    title,
    description,
    path: `/providers/${params.provider}`,
    image: supplier.logo,
  });
}

export default function ProviderDetailPage({ params }: Props) {
  const slug = params.provider.toLowerCase() as Supplier;
  const supplier = SUPPLIER_CONFIG[slug];

  if (!supplier) notFound();

  const promos = PROMO_IMAGES[slug] || [];
  const decors = getDynamicDecors(slug);

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Accueil', path: '/' },
    { name: 'Fournisseurs', path: '/providers' },
    { name: supplier.name, path: `/providers/${slug}` },
  ]);

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Fournisseurs', href: '/providers' },
            { label: supplier.name },
          ]}
        />

        {/* Brand Hero Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-wood-border shadow-card my-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-wood-border">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-2xl bg-wood-cream border border-wood-border p-3 flex items-center justify-center shrink-0">
                <Image
                  src={supplier.logo}
                  alt={`Logo ${supplier.name}`}
                  width={90}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm inline-block mb-2"
                  style={{ backgroundColor: supplier.color }}
                >
                  {supplier.badgeText || 'Partenaire Industriel'}
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary">
                  {supplier.fullName}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/#nuancier"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-wood-cream hover:bg-wood-border text-primary text-xs font-bold uppercase tracking-wider transition-all border border-wood-border"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour au catalogue
              </Link>
              {supplier.website && (
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  Site Officiel {supplier.name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <p className="md:col-span-8 text-charcoal-light text-sm sm:text-base leading-relaxed">
              {supplier.description}
            </p>

            {supplier.collections && supplier.collections.length > 0 && (
              <div className="md:col-span-4 bg-wood-cream/60 p-4 rounded-2xl border border-wood-border">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
                  Collections phares :
                </span>
                <div className="space-y-1 text-xs text-charcoal">
                  {supplier.collections.map((col) => (
                    <div key={col} className="flex items-center gap-1.5 font-medium">
                      <CheckCircle
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: supplier.color }}
                      />
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Crawlable Direct Decors Listing for Crawlers and Users */}
        {decors.length > 0 && (
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-wood-border shadow-card">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-heading text-2xl font-bold text-primary">
                  Panneaux &amp; Décors {supplier.name} Répertoriés ({decors.length})
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-light mt-1">
                  Accédez directement aux fiches détaillées et références de la collection {supplier.name}.
                </p>
              </div>
              <span className="text-xs font-bold text-charcoal bg-wood-cream px-3 py-1.5 rounded-xl border border-wood-border hidden sm:inline-block">
                Index Crawlable
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {decors.map((decor) => {
                const ref = decor.ref || extractDecorReference(decor.filename);
                const name = decor.name ? extractDecorName(decor.name) : extractDecorName(decor.filename);
                const decorUrl = getDecorUrl(slug, ref);
                const altText = getDecorAltText(supplier.name, name, ref);

                const cardContent = (
                  <div className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-wood-border/80 hover:border-accent/60 shadow-xs hover:shadow-md transition-all">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                      <Image
                        src={decor.src}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {ref && (
                        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold tracking-wider text-white shadow-sm">
                            {ref}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 bg-white border-t border-gray-100 flex flex-col justify-between flex-1">
                      <p className="font-heading font-semibold text-xs text-primary group-hover:text-accent transition-colors truncate">
                        {name}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-charcoal-light">
                        <span>{supplier.name}</span>
                        <span className="font-bold text-accent group-hover:translate-x-0.5 transition-transform">
                          Voir &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );

                if (decorUrl) {
                  return (
                    <Link
                      key={decor.filename}
                      href={decorUrl}
                      title={`Voir la fiche détaillée du décor ${name} ${ref ? `(Réf. ${ref})` : ''}`}
                    >
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <div key={decor.filename}>
                    {cardContent}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOCOFEB Services, Formats & Stock Reassurance for this Supplier */}
        <div className="mb-16 bg-white rounded-3xl p-8 sm:p-10 border border-wood-border shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-wood-cream text-secondary border border-wood-border mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Distribution &amp; Stock Officiel SOCOFEB
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                Disponibilité &amp; Services Sur-Mesure {supplier.name}
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-light mt-1.5 max-w-2xl leading-relaxed">
                Retrouvez l&apos;intégralité des panneaux {supplier.name} disponibles directement à nos dépôts de Jâafer et Sidi Amor (Ariana), avec services de découpe et plaquage de chants coordonnés.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/21699218866?text=${encodeURIComponent(`Bonjour SOCOFEB, je souhaite obtenir un devis pour les panneaux ${supplier.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Devis WhatsApp
              </a>
              <a
                href="tel:+21699218866"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Appel Direct
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {/* Feature 1: Formats & Dimensions */}
            <div className="p-6 rounded-2xl bg-wood-cream/50 border border-wood-border/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-wood-border flex items-center justify-center text-accent mb-4 shadow-2xs">
                  <Ruler className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-primary mb-2">
                  Formats &amp; Épaisseurs
                </h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-4">
                  Panneaux calibrés haute performance pour agencements résidentiels et chantiers professionnels.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-charcoal font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Dimensions :</strong> 2800×2070 mm &amp; 2440×1220 mm</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Épaisseurs :</strong> 8, 12, 16, 18, 22 et 28 mm</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Support MDF haute densité certifié E1</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Atelier Découpe & Chants */}
            <div className="p-6 rounded-2xl bg-wood-cream/50 border border-wood-border/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-wood-border flex items-center justify-center text-accent mb-4 shadow-2xs">
                  <Scissors className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-primary mb-2">
                  Découpe &amp; Chants Assortis
                </h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-4">
                  Précision numérique et finition irréprochable dans nos ateliers pour vos projets sur-mesure.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-charcoal font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Découpe numérique avec calepinage optimisé</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Plaquage de chants ABS coordonnés 100% au décor</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Perçage et préparation sur demande</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Stock Direct & Dépôts */}
            <div className="p-6 rounded-2xl bg-wood-cream/50 border border-wood-border/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-wood-border flex items-center justify-center text-accent mb-4 shadow-2xs">
                  <Warehouse className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-primary mb-2">
                  Stock Permanent à Ariana
                </h3>
                <p className="text-xs text-charcoal-light leading-relaxed mb-4">
                  Deux dépôts stratégiques pour un enlèvement immédiat ou livraison rapide sur toute la Tunisie.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-charcoal font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Dépôt 1 :</strong> Route de Raoued Km 3, Jâafer</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span><strong>Dépôt 2 :</strong> Route de Gammarth Km 9, Sidi Amor</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Enlèvement palette ou panneau au détail</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Nuancier Grid for this Supplier */}
        <div className="mb-16">
          <DecorGrid
            initialSupplier={slug}
            showFilters={false}
            title={`Nuancier Interactif ${supplier.name}`}
            subtitle={`Explorez l'intégralité des teintes et finitions certifiées ${supplier.name} avec zoom HD instantané`}
          />
        </div>

        {/* Supplier Promos */}
        {promos.length > 0 && (
          <div className="mb-16 bg-white rounded-3xl p-8 border border-wood-border shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-red-600" />
              <h2 className="font-heading text-2xl font-bold text-primary">
                Promotions {supplier.name} en Cours
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((p) => (
                <PromoCard key={p.file} promo={p} supplier={slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
