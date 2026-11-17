import React, { useEffect, useState } from "react";
import { Star, ExternalLink, ShieldCheck } from "lucide-react";

export interface GoogleReviewItem {
  author_name: string;
  rating: number;
  relative_time_description?: string;
  time?: number;
  text: string;
  profile_photo_url?: string;
}

interface GoogleReviewsSectionProps {
  isRenax?: boolean;
}

export default function GoogleReviewsSection({ isRenax = false }: GoogleReviewsSectionProps) {
  const [reviewsData, setReviewsData] = useState<{
    businessName: string;
    overallRating: number;
    totalReviews: number;
    googleMapsUrl?: string;
    reviews: GoogleReviewItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/google-reviews")
      .then(res => res.json())
      .then(data => {
        if (active && data && Array.isArray(data.reviews)) {
          setReviewsData(data);
        }
      })
      .catch(err => {
        console.warn("Could not load Google reviews:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading && !reviewsData) {
    return null;
  }

  const reviews = reviewsData?.reviews || [];
  if (reviews.length === 0) return null;

  const rating = reviewsData?.overallRating || 5.0;
  const totalCount = reviewsData?.totalReviews || 48;

  return (
    <section className={`py-20 sm:py-24 relative overflow-hidden transition-colors ${
      isRenax ? "bg-[#08090d] border-t border-slate-900/80 text-white" : "bg-white border-t border-slate-200/80 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Google Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Client Testimonials</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${isRenax ? "text-white" : "text-slate-900"}`}>
              Trusted by Discerning Travelers
            </h2>
            <p className={`mt-3 text-base sm:text-lg ${isRenax ? "text-slate-400" : "text-slate-600"}`}>
              Real experiences from clients who rely on TravelLuxx for punctual airport transfers and executive chauffeur travel.
            </p>
          </div>

          {/* Google Rating Overview Badge */}
          <div className={`p-5 rounded-2xl border shrink-0 flex items-center gap-4 ${
            isRenax ? "bg-[#10121a] border-slate-800" : "bg-slate-50 border-slate-200 shadow-sm"
          }`}>
            {/* Google G Logo SVG */}
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2.5 shrink-0 border border-slate-100">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-xl font-extrabold ${isRenax ? "text-white" : "text-slate-900"}`}>{rating.toFixed(1)}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className={`text-xs ${isRenax ? "text-slate-400" : "text-slate-500"}`}>
                Based on <span className="font-semibold">{totalCount}+ reviews</span> on Google
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.slice(0, 4).map((rev, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                isRenax
                  ? "bg-[#0d0e14] border-slate-800/80 hover:border-slate-700 shadow-lg shadow-black/40"
                  : "bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-600/5 shadow-sm"
              }`}
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className={`text-sm leading-relaxed mb-6 ${isRenax ? "text-slate-300" : "text-slate-600"}`}>
                  "{rev.text}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.profile_photo_url ? (
                    <img
                      src={rev.profile_photo_url}
                      alt={rev.author_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                      {rev.author_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${isRenax ? "text-white" : "text-slate-900"}`}>{rev.author_name}</h4>
                    <span className={`text-[10px] ${isRenax ? "text-slate-500" : "text-slate-400"}`}>
                      {rev.relative_time_description || "Verified Google Review"}
                    </span>
                  </div>
                </div>

                {/* Small Google icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 opacity-70">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* View on Google link */}
        <div className="mt-10 text-center">
          <a
            href={reviewsData?.googleMapsUrl || "https://maps.google.com"}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-xs font-bold transition ${
              isRenax ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-700 hover:text-emerald-800"
            }`}
          >
            <span>Read all reviews on Google Business Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

