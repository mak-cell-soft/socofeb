'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/catalog';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Veuillez saisir votre nom complet'),
  phone: z.string().min(8, 'Veuillez indiquer un numéro de téléphone valide'),
  email: z.string().email('Adresse email invalide').optional().or(z.literal('')),
  category: z.string().min(1, 'Sélectionnez une catégorie de produit'),
  location: z.string().default('both'),
  message: z.string().min(5, 'Précisez votre demande ou vos dimensions'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  defaultCategory?: string;
  defaultProduct?: string;
  className?: string;
}

export function ContactForm({
  defaultCategory = 'mdf',
  defaultProduct = '',
  className,
}: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      category: defaultCategory,
      location: 'both',
      message: defaultProduct ? `Demande de devis pour : ${defaultProduct}` : '',
    },
  });

  const formValues = watch();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate short network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
  };

  const whatsappDirectUrl = () => {
    const text = encodeURIComponent(
      `Bonjour SOCOFEB, je souhaite un devis :
- Nom : ${formValues.fullName || 'Client'}
- Téléphone : ${formValues.phone || ''}
- Catégorie : ${formValues.category || defaultCategory}
- Détails : ${formValues.message || defaultProduct || 'Demande générale'}`
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
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          Devis &amp; Renseignement Rapide
        </span>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary mt-3">
          Demandez Votre Devis Gratuit
        </h3>
        <p className="text-charcoal-light text-sm mt-1">
          Réponse rapide sous 24h par notre équipe commerciale à l&apos;Ariana.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center py-10 bg-wood-cream/50 rounded-2xl border border-accent/30 p-6">
          <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
          <h4 className="font-heading text-2xl font-bold text-primary mb-2">
            Demande reçue avec succès !
          </h4>
          <p className="text-charcoal-light text-sm max-w-md mx-auto mb-6">
            Merci. Notre conseiller Mohamed Amine KLABI ou un membre de notre
            équipe vous recontactera très rapidement au numéro indiqué.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-secondary text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            Nouvelle demande
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Nom &amp; Prénom *
              </label>
              <input
                type="text"
                placeholder="Ex: Mohamed Ben Salah"
                {...register('fullName')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                  errors.fullName
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-wood-border focus:border-accent focus:ring-accent/20'
                )}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Numéro de Téléphone *
              </label>
              <input
                type="tel"
                placeholder="Ex: +216 99 218 866"
                {...register('phone')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                  errors.phone
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-wood-border focus:border-accent focus:ring-accent/20'
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Catégorie */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Type de Produit *
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30"
              >
                <option value="mdf">MDF &amp; Panneaux décoratifs</option>
                <option value="bois-massifs">Bois Massifs (Chêne, Hêtre, etc.)</option>
                <option value="contreplaque">Contreplaqué Structurel / Marine</option>
                <option value="osb">OSB/3 Norme EN 300</option>
                <option value="autre">Autre demande spécifique</option>
              </select>
            </div>

            {/* Dépôt préféré */}
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
                Dépôt de Retrait Préféré
              </label>
              <select
                {...register('location')}
                className="w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30"
              >
                <option value="both">Peu importe / Premier disponible</option>
                <option value="jaafer">Siège — Route de Raoued Km3 (Jâafer)</option>
                <option value="sidi-amor">Point de Vente — Route de Gammarth Km9 (Sidi Amor)</option>
              </select>
            </div>
          </div>

          {/* Email optionnel */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Adresse Email (Optionnel)
            </label>
            <input
              type="email"
              placeholder="votre-email@exemple.com"
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl border border-wood-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-wood-cream/30"
            />
          </div>

          {/* Message / Détails */}
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Détails de votre besoin (dimensions, quantités, références) *
            </label>
            <textarea
              rows={4}
              placeholder="Ex: 50 panneaux MDF Stratifié Chêne Naturel en 18mm + 2 m³ de Bois Blanc raboté..."
              {...register('message')}
              className={cn(
                'w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-wood-cream/30',
                errors.message
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-wood-border focus:border-accent focus:ring-accent/20'
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
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-secondary text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Transmission...' : 'Envoyer la demande de devis'}
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
