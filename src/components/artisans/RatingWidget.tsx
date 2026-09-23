// src/components/artisans/RatingWidget.tsx
'use client';

/**
 * @file RatingWidget.tsx
 * @description Interactive 1-to-5 star rating component for artisan profiles.
 *
 * Implements:
 * - Hover text feedback ("1 étoile", "2 étoiles", ..., "5 étoiles").
 * - Sizable touch targets for comfortable mobile interaction.
 * - Server submission with anti-abuse prevention.
 * - Immediate optimistic feedback and persistent "Merci pour votre avis !" state.
 * - Handles unrated states gracefully without displaying 0.0.
 */

import React, { useState } from 'react';
import { Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ArtisanRating } from '@/types/artisan';
import { formatArtisanRating } from '@/lib/artisans';

interface RatingWidgetProps {
  artisanId: number;
  initialRating: ArtisanRating;
  artisanName: string;
}

const STAR_LABELS: Record<number, string> = {
  1: '1 étoile — Insatisfaisant',
  2: '2 étoiles — Passable',
  3: '3 étoiles — Bon travail',
  4: '4 étoiles — Très bon travail',
  5: '5 étoiles — Exceptionnel',
};

export function RatingWidget({ artisanId, initialRating, artisanName }: RatingWidgetProps) {
  const [ratingStats, setRatingStats] = useState<ArtisanRating>(initialRating);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ratingInfo = formatArtisanRating(ratingStats);

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submitted) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/artisans/${artisanId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedStar }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setRatingStats({
          average: json.data.average,
          count: json.data.count,
        });
        setSubmitted(true);
      } else {
        setErrorMessage(json.error || "Impossible d'enregistrer votre avis.");
        if (json.rating) {
          setRatingStats(json.rating);
        }
      }
    } catch (err) {
      setErrorMessage('Une erreur de connexion est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDisplayLabel = hoveredStar ? STAR_LABELS[hoveredStar] : STAR_LABELS[selectedStar];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-wood-border shadow-card max-w-xl">
      {/* Current Aggregated Rating Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-wood-border/60">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-primary">
            Avis &amp; Évaluations
          </h3>
          <p className="text-xs text-charcoal-light mt-0.5">
            Retours des clients ayant confié des travaux à {artisanName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {ratingInfo.hasReviews ? (
            <div className="flex items-center gap-2 bg-wood-cream px-3.5 py-1.5 rounded-2xl border border-wood-border">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(ratingInfo.score)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-transparent text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-heading font-black text-primary text-base">
                {ratingInfo.displayText}
              </span>
              <span className="text-xs text-charcoal-light font-medium">
                {ratingInfo.countText}
              </span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-charcoal-light bg-wood-cream px-3 py-1.5 rounded-xl border border-wood-border">
              Pas encore d&apos;avis
            </span>
          )}
        </div>
      </div>

      {/* Interactive Form Section */}
      <div className="pt-6">
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-800 flex items-start gap-3.5 animate-in fade-in duration-300">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Merci pour votre avis !</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Votre évaluation ({selectedStar} étoiles) a bien été enregistrée et contribue à valoriser le travail de nos artisans.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitRating} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-primary mb-1">
                Comment évaluez-vous cet artisan ?
              </label>
              <p className="text-xs text-charcoal-light mb-3">
                Sélectionnez une note de 1 à 5 étoiles pour partager votre expérience.
              </p>

              {/* Star Rating Buttons */}
              <div
                className="flex items-center gap-2"
                onMouseLeave={() => setHoveredStar(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoveredStar !== null ? star <= hoveredStar : star <= selectedStar;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedStar(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onFocus={() => setHoveredStar(star)}
                      onBlur={() => setHoveredStar(null)}
                      aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
                      className="p-1 sm:p-2 rounded-xl hover:bg-wood-cream focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-150 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'fill-transparent text-gray-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Hover / Active Label */}
              <p className="text-xs font-semibold text-accent mt-2 h-4">
                {currentDisplayLabel}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-wood-dark font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <span>Envoyer mon avis</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
