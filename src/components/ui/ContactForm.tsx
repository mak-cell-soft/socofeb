'use client';

/**
 * @file ContactForm.tsx
 * @description Production quote and contact form for SOCOFEB.
 * Handles both:
 * 1. Specific product quote requests: Dispatches to POST /api/quote (ACYA intake backend)
 *    with a dedicated quantity field, required customer email, and UUID v4 idempotency.
 * 2. General inquiries: Dispatches to POST /api/contact (existing email/webhook engine).
 * Preserves luxury wood design tokens, accessible validation, and retry state.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, CheckCircle2, AlertCircle, MessageSquare, Loader2, PackageCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';
import { cn } from '@/lib/utils';
import {
  ContactFormData,
  ContactApiResponse,
  QuoteRequestBody,
  QuoteApiResponse,
  PRODUCT_CATEGORY_LABELS,
} from '@/types/contact';

/**
 * Generates an RFC 4122 compliant UUID v4 string across browser and test runtimes.
 */
function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 1. Schema for Product Quote Requests (ACYA Intake)
const quoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Veuillez saisir votre nom complet')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères'),
  email: z
    .string({ required_error: 'Veuillez renseigner votre adresse email' })
    .trim()
    .email('Adresse email invalide')
    .max(150, "L'adresse email ne peut pas dépasser 150 caractères"),
  phone: z
    .string()
    .trim()
    .max(50, 'Numéro de téléphone trop long')
    .optional()
    .or(z.literal('')),
  quantity: z
    .string({ required_error: 'Veuillez préciser la quantité souhaitée' })
    .trim()
    .min(1, 'Veuillez préciser la quantité souhaitée (ex: 50 panneaux, 2 m³)')
    .max(100, 'La quantité ne peut pas dépasser 100 caractères'),
  category: z.string().default('mdf'),
  location: z.string().default('both'),
  message: z
    .string()
    .trim()
    .max(2000, 'Votre message est trop long')
    .optional()
    .or(z.literal('')),
  botField: z.string().optional(),
});

// 2. Schema for General Inquiries (/api/contact backward compatibility)
const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Veuillez saisir votre nom complet')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  phone: z
    .string()
    .trim()
    .min(8, 'Veuillez indiquer un numéro de téléphone valide (au moins 8 chiffres)')
    .max(30, 'Numéro de téléphone trop long'),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide')
    .optional()
    .or(z.literal('')),
  quantity: z.string().optional(),
  category: z.string().min(1, 'Sélectionnez une catégorie de produit'),
  location: z.string().default('both'),
  message: z
    .string()
    .trim()
    .min(5, 'Précisez votre demande ou vos dimensions (au moins 5 caractères)')
    .max(3000, 'Votre message est trop long'),
  botField: z.string().optional(),
});

export type FormSchemaType = z.infer<typeof quoteSchema>;

interface ContactFormProps {
  defaultCategory?: string;
  defaultProduct?: string;
  className?: string;
  mode?: 'auto' | 'quote' | 'contact';
}

export function ContactForm({
  defaultCategory = 'mdf',
  defaultProduct = '',
  className,
  mode = 'auto',
}: ContactFormProps) {
  // When a specific product is provided, lock to quote mode.
  // When mode is explicitly 'quote' or 'contact', lock to that mode.
  // When mode is 'auto' without a fixed product (e.g. /contact page), provide tab switching,
  // defaulting to 'quote' mode so quotation requests are immediately accessible.
  const hasFixedMode =
    mode === 'quote' ||
    mode === 'contact' ||
    Boolean(defaultProduct && defaultProduct.trim().length > 0);

  const [activeTab, setActiveTab] = useState<'quote' | 'contact'>(
    mode === 'contact' ? 'contact' : 'quote'
  );

  const isQuoteMode = hasFixedMode
    ? mode === 'contact'
      ? false
      : true
    : activeTab === 'quote';

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Single idempotency key maintained in state throughout retries
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => generateUuidV4());

  const activeSchema = isQuoteMode ? quoteSchema : contactSchema;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(activeSchema),
    defaultValues: {
      category: defaultCategory,
      location: 'both',
      quantity: '',
      message: isQuoteMode ? '' : defaultProduct ? `Demande de devis pour : ${defaultProduct}` : '',
      botField: '',
      fullName: '',
      email: '',
      phone: '',
    },
  });

  const formValues = watch();

  const onSubmit = async (data: FormSchemaType) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isQuoteMode) {
        // --- 1. PRODUCT QUOTE INTAKE (ACYA ENDPOINT) ---
        const resolvedProduct =
          defaultProduct ||
          `${PRODUCT_CATEGORY_LABELS[data.category] || data.category}`;

        const quotePayload: QuoteRequestBody = {
          product: resolvedProduct,
          quantity: data.quantity || 'Non précisé',
          customerName: data.fullName,
          customerEmail: data.email,
          customerPhone: data.phone && data.phone.trim().length > 0 ? data.phone.trim() : undefined,
          message: data.message && data.message.trim().length > 0 ? data.message.trim() : undefined,
          idempotencyKey,
          botField: data.botField,
        };

        const response = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quotePayload),
        });

        const result: QuoteApiResponse = await response.json().catch(() => ({
          success: false,
          message: 'Réponse serveur inattendue.',
        }));

        // HTTP 202 or 200: Durable acceptance
        if (response.ok && result.success) {
          setIsSubmitted(true);
          setSubmitError(null);
          reset();
        } else {
          // Failure retains inputs and same idempotency key
          const errorMsg =
            result.message ||
            "Une erreur est survenue lors de l'enregistrement de votre demande de devis. Vos informations sont conservées ci-dessous.";
          setSubmitError(errorMsg);
        }
      } else {
        // --- 2. GENERAL INQUIRIES (EXISTING /api/contact ENDPOINT) ---
        const contactPayload: ContactFormData = {
          fullName: data.fullName,
          phone: data.phone || '',
          email: data.email,
          category: data.category,
          location: data.location,
          message: data.message || '',
          botField: data.botField,
        };

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload),
        });

        const result: ContactApiResponse = await response.json().catch(() => ({
          success: false,
          message: 'Réponse serveur inattendue.',
        }));

        if (response.ok && result.success) {
          setIsSubmitted(true);
          setSubmitError(null);
          reset();
        } else {
          const errorMsg =
            result.message ||
            "Une erreur est survenue lors de l'enregistrement de votre message. Vos informations sont conservées ci-dessous.";
          setSubmitError(errorMsg);
        }
      }
    } catch {
      setSubmitError(
        'Impossible de joindre le serveur. Veuillez vérifier votre connexion internet ou nous contacter directement via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewRequest = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    reset();
    // Fresh UUID generated only upon starting a genuinely new submission
    setIdempotencyKey(generateUuidV4());
  };

  const whatsappDirectUrl = () => {
    const text = encodeURIComponent(
      `Bonjour SOCOFEB, je souhaite un devis :
- Nom : ${formValues.fullName || 'Client'}
- Téléphone : ${formValues.phone || ''}
- Email : ${formValues.email || ''}
- Produit : ${defaultProduct || PRODUCT_CATEGORY_LABELS[formValues.category] || formValues.category || defaultCategory}
${isQuoteMode && formValues.quantity ? `- Quantité : ${formValues.quantity}\n` : ''}- Détails : ${formValues.message || 'Demande générale'}`
    );
    return `${COMPANY_INFO.whatsappUrl}?text=${text}`;
  };

  return (
    <div
      className={cn(
        'bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card border border-wood-border',
        className
      )}
    >
      {/* Mode Switcher Tabs (Only shown when not locked to a specific product) */}
      {!hasFixedMode && (
        <div className="flex items-center p-1 bg-wood-cream/60 rounded-2xl border border-wood-border mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('quote');
              clearErrors();
              setSubmitError(null);
            }}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer',
              isQuoteMode
                ? 'bg-primary text-white shadow-sm'
                : 'text-charcoal hover:text-primary'
            )}
          >
            Demande de Devis
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('contact');
              clearErrors();
              setSubmitError(null);
            }}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer',
              !isQuoteMode
                ? 'bg-primary text-white shadow-sm'
                : 'text-charcoal hover:text-primary'
            )}
          >
            Message &amp; Contact
          </button>
        </div>
      )}

      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          {isQuoteMode ? 'Devis Personnalisé' : 'Renseignement Rapide'}
        </span>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary mt-3">
          {isQuoteMode ? 'Demandez Votre Devis Gratuit' : 'Contactez Notre Équipe'}
        </h3>
        <p className="text-charcoal-light text-sm mt-1">
          {isQuoteMode
            ? 'Prise en compte immédiate de votre demande et réponse sous 24h par notre équipe commerciale à Jâafer.'
            : "Réponse rapide sous 24h par notre équipe commerciale à l'Ariana."}
        </p>
      </div>

      {/* Quote Product Context Banner */}
      {isQuoteMode && defaultProduct && (
        <div className="mb-6 p-4 rounded-2xl bg-wood-cream/60 border border-accent/30 flex items-start gap-3">
          <PackageCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block">
              Produit sélectionné
            </span>
            <p className="font-bold text-sm text-primary">{defaultProduct}</p>
          </div>
        </div>
      )}

      {isSubmitted ? (
        <div className="text-center py-10 bg-wood-cream/50 rounded-2xl border border-accent/30 p-6 animate-in fade-in duration-300">
          <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
          <h4 className="font-heading text-2xl font-bold text-primary mb-2">
            Demande reçue avec succès !
          </h4>
          <p className="text-charcoal-light text-sm max-w-md mx-auto mb-6">
            {isQuoteMode
              ? 'Merci ! Votre demande de devis a été enregistrée avec succès. Notre équipe commerciale à Jâafer vous répondra sous 24h.'
              : 'Merci. Notre conseiller Mohamed Amine KLABI ou un membre de notre équipe vous recontactera très rapidement.'}
          </p>
          <button
            type="button"
            onClick={handleResetForNewRequest}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            Nouvelle demande
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Honeypot anti-bot field */}
          <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
            <label htmlFor="botField">Champ de sécurité anti-spam (laisser vide)</label>
            <input
              id="botField"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('botField')}
            />
          </div>

          {/* Submission Error Banner */}
          {submitError && (
            <div
              role="alert"
              className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1.5">
                <p className="font-bold text-red-950">{submitError}</p>
                <p className="text-red-700 text-xs">
                  Vos informations saisies sont intactes ci-dessous. Vous pouvez cliquer à nouveau sur Envoyer ou finaliser directement via WhatsApp.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Nom &amp; Prénom *
              </label>
              <input
                type="text"
                placeholder="Ex: Mohamed Ben Salah"
                disabled={isSubmitting}
                {...register('fullName')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-wood-border focus:border-accent focus:ring-accent/20',
                  isSubmitting && 'opacity-60 cursor-not-allowed'
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email (Obligatoire en mode devis ACYA, optionnel en contact général) */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Adresse Email {isQuoteMode ? '*' : '(Optionnel)'}
              </label>
              <input
                type="email"
                placeholder="votre-email@exemple.com"
                disabled={isSubmitting}
                {...register('email')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                  errors.email
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-wood-border focus:border-accent focus:ring-accent/20',
                  isSubmitting && 'opacity-60 cursor-not-allowed'
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* If in quote mode without defaultProduct, show category select + quantity */}
            {isQuoteMode && !defaultProduct ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Catégorie de Produit *
                  </label>
                  <select
                    disabled={isSubmitting}
                    {...register('category')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <option value="mdf">MDF &amp; Panneaux décoratifs</option>
                    <option value="bois-massifs">Bois Massifs (Chêne, Hêtre, etc.)</option>
                    <option value="contreplaque">Contreplaqué Structurel / Marine</option>
                    <option value="osb">OSB/3 Norme EN 300</option>
                    <option value="autre">Autre demande spécifique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Quantité Souhaitée *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50 panneaux, 2 m³, 1 palette..."
                    disabled={isSubmitting}
                    {...register('quantity')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                      errors.quantity
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-wood-border focus:border-accent focus:ring-accent/20',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </>
            ) : isQuoteMode ? (
              /* Quote mode with defaultProduct */
              <>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Quantité Souhaitée *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50 panneaux, 2 m³, 1 palette..."
                    disabled={isSubmitting}
                    {...register('quantity')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                      errors.quantity
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-wood-border focus:border-accent focus:ring-accent/20',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Numéro de Téléphone (Optionnel)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: +216 99 218 866"
                    disabled={isSubmitting}
                    {...register('phone')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                      errors.phone
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-wood-border focus:border-accent focus:ring-accent/20',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* General contact mode */
              <>
                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Type de Produit *
                  </label>
                  <select
                    disabled={isSubmitting}
                    {...register('category')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    <option value="mdf">MDF &amp; Panneaux décoratifs</option>
                    <option value="bois-massifs">Bois Massifs (Chêne, Hêtre, etc.)</option>
                    <option value="contreplaque">Contreplaqué Structurel / Marine</option>
                    <option value="osb">OSB/3 Norme EN 300</option>
                    <option value="autre">Autre demande spécifique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: +216 99 218 866"
                    disabled={isSubmitting}
                    {...register('phone')}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                      errors.phone
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-wood-border focus:border-accent focus:ring-accent/20',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Numéro de téléphone en mode devis sans defaultProduct */}
          {isQuoteMode && !defaultProduct && (
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Numéro de Téléphone (Optionnel)
              </label>
              <input
                type="tel"
                placeholder="Ex: +216 99 218 866"
                disabled={isSubmitting}
                {...register('phone')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                  errors.phone
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-wood-border focus:border-accent focus:ring-accent/20',
                  isSubmitting && 'opacity-60 cursor-not-allowed'
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          )}

          {!isQuoteMode && (
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Dépôt de Retrait Préféré
              </label>
              <select
                disabled={isSubmitting}
                {...register('location')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30',
                  isSubmitting && 'opacity-60 cursor-not-allowed'
                )}
              >
                <option value="both">Peu importe / Premier disponible</option>
                <option value="jaafer">Siège — Route de Raoued Km3 (Jâafer)</option>
                <option value="sidi-amor">Point de Vente — Route de Gammarth Km9 (Sidi Amor)</option>
              </select>
            </div>
          )}

          {/* Message / Détails */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              {isQuoteMode
                ? 'Précisions & Spécifications techniques (Optionnel)'
                : 'Détails de votre besoin (dimensions, quantités, références) *'}
            </label>
            <textarea
              rows={4}
              placeholder={
                isQuoteMode
                  ? 'Ex: Découpe sur mesure demandée, livraison chantier Ariana, épaisseur 18mm...'
                  : 'Ex: 50 panneaux MDF Stratifié Chêne Naturel en 18mm + 2 m³ de Bois Blanc raboté...'
              }
              disabled={isSubmitting}
              {...register('message')}
              className={cn(
                'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                errors.message
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-wood-border focus:border-accent focus:ring-accent/20',
                isSubmitting && 'opacity-60 cursor-not-allowed'
              )}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Actions Submit / WhatsApp */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transmission en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {isQuoteMode ? 'Envoyer la demande de devis' : 'Envoyer le message'}
                </>
              )}
            </button>

            <a
              href={whatsappDirectUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-black text-sm uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              Devis direct WhatsApp
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
