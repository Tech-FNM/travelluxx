import React, { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useContent } from "../content/useContent";

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
  const { settings } = useSettings();
  const c = useContent();
  const [apiReviewsData, setApiReviewsData] = useState<{
    businessName: string;
    overallRating: number;
    totalReviews: number;
    googleMapsUrl?: string;
    reviews: GoogleReviewItem[];
  } | null>(null);

  // Directly fetch from /api/google-reviews (which always returns current dashboard reviews)
  useEffect(() => {
    let active = true;
    fetch(`/api/google-reviews?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (active && data && Array.isArray(data.reviews)) {
          setApiReviewsData(data);
        }
      })
      .catch(err => {
        console.warn("Could not load Google reviews from backend:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Section visibility check
  if (!c.on("homepage_reviews_enabled")) {
    return null;
  }

  // Dashboard reviews: first priority is settings.google_reviews_list from SettingsContext, fallback is /api/google-reviews
  // Real reviews fetched from Google come first; otherwise the reviews typed into the dashboard.
  const fromGoogle = (apiReviewsData as any)?.source === "google_places_api" && (apiReviewsData?.reviews || []).length > 0;
  const dashboardReviews: GoogleReviewItem[] = fromGoogle
    ? apiReviewsData!.reviews
    : Array.isArray(settings?.google_reviews_list) && settings.google_reviews_list.length > 0
      ? settings.google_reviews_list
      : (apiReviewsData?.reviews || []);

  // With no reviews loaded yet the section still shows, inviting visitors to the real Google listing.
  // No rating or count is shown then, because there is nothing real to show.
  const hasReviews = dashboardReviews.length > 0;

  // Live rating, total count and maps link from dashboard settings
  const rating = fromGoogle
    ? apiReviewsData!.overallRating
    : Number(settings?.google_reviews_rating) || apiReviewsData?.overallRating || 5.0;
  const totalCount = fromGoogle
    ? apiReviewsData!.totalReviews
    : settings?.google_reviews_count || apiReviewsData?.totalReviews || dashboardReviews.length;
  const mapsUrl = (fromGoogle && apiReviewsData?.googleMapsUrl) || settings?.google_business_profile_url || apiReviewsData?.googleMapsUrl || "https://maps.app.goo.gl/5r5jwaFUCM7YMzWdA";

  // Live custom section headers from dashboard settings
  const badgeText = c.t("homepage_reviews_badge");
  const mainTitle = c.t("homepage_reviews_title");
  const subtitle = c.t("homepage_reviews_subtitle");
  const verifiedLabel = c.t("homepage_reviews_verified_label");

  return (
    <section className={`tl-section ${
      isRenax ? "bg-brand-950 border-t border-white/10 text-stone-300" : "bg-white text-stone-700"
    }`}>
      <div className="tl-container">
        {/* Section Header with Google rating summary */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <span data-reveal className={`tl-eyebrow ${isRenax ? "tl-eyebrow-light" : ""}`}>{badgeText}</span>
            <h2 data-reveal="lines" className={`tl-h2 mt-4 ${isRenax ? "text-white" : ""}`}>
              {mainTitle}
            </h2>
            <p data-reveal data-reveal-delay="0.1" className={`tl-lead mt-5 ${isRenax ? "text-stone-300" : ""}`}>
              {subtitle}
            </p>
          </div>

          {/* Google Rating Overview */}
          {hasReviews && (
          <div data-reveal data-reveal-delay="0.2" className="shrink-0">
            <div className="flex items-center gap-4">
              <span className={`font-display text-6xl leading-none font-medium lining-nums sm:text-7xl ${isRenax ? "text-white" : "text-stone-900"}`}>
                {Number(rating).toFixed(1)}
              </span>
              <div className="flex gap-1 text-amber-400" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className={`inline-flex items-center gap-2 text-sm ${isRenax ? "text-stone-400" : "text-stone-500"}`}>
                {/* Google G Logo SVG */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
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
                <span>
                  {c.t("homepage_reviews_based_on_text")} <strong className={`font-medium ${isRenax ? "text-stone-200" : "text-stone-700"}`}>{totalCount} {c.t("homepage_reviews_count_suffix")}</strong>
                </span>
              </span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={`tl-link -my-3 py-3 ${isRenax ? "text-brand-300 hover:text-white" : ""}`}
              >
                <span>{c.t("homepage_reviews_view_all_text")}</span>
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          )}
        </div>

        {!hasReviews && (
          <div
            data-reveal
            className={`mt-12 flex flex-col gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between lg:mt-16 ${
              isRenax ? "border-white/15" : "border-stone-300"
            }`}
          >
            <p className={`max-w-xl text-base leading-relaxed ${isRenax ? "text-stone-300" : "text-stone-600"}`}>
              {c.t("homepage_reviews_empty_text")}
            </p>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="tl-btn tl-btn-primary inline-flex items-center justify-center gap-2">
                <span>{c.t("homepage_reviews_read_button")}</span>
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="tl-btn tl-btn-outline inline-flex items-center justify-center">
                {c.t("homepage_reviews_write_button")}
              </a>
            </div>
          </div>
        )}

        {/* Reviews: open columns under a hairline rather than boxed cards, wide enough that a quote
            keeps a comfortable line length. Two per row; three per row when the count divides evenly by three. */}
        <div
          data-reveal-group
          className={`mt-12 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:mt-20 lg:gap-x-16 ${
            dashboardReviews.length % 3 === 0 ? "lg:grid-cols-3" : ""
          }`}
        >
          {dashboardReviews.map((review, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between border-t pt-8 ${
                isRenax ? "border-white/15" : "border-stone-300"
              }`}
            >
              <div>
                {/* Star Rating */}
                <div
                  className="flex items-center gap-1 text-amber-400"
                  role="img"
                  aria-label={`${Number(review.rating) || 5} out of 5 stars`}
                >
                  {[...Array(Number(review.rating) || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                  ))}
                </div>

                {/* Review Text */}
                <p className={`mt-6 text-base leading-relaxed sm:text-lg ${
                  isRenax ? "text-stone-300" : "text-stone-700"
                }`}>
                  “{review.text}”
                </p>
              </div>

              {/* Author Info & Google Icon */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {review.profile_photo_url ? (
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className={`h-10 w-10 shrink-0 rounded-full border object-cover ${
                        isRenax ? "border-white/10" : "border-stone-200"
                      }`}
                    />
                  ) : (
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      isRenax ? "bg-white/10 text-white" : "bg-stone-100 text-stone-700"
                    }`}>
                      {review.author_name ? review.author_name.charAt(0) : "G"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold ${isRenax ? "text-white" : "text-stone-900"}`}>
                      {review.author_name || c.t("homepage_reviews_fallback_author")}
                    </h4>
                    {review.relative_time_description && (
                      <span className={`block text-xs ${isRenax ? "text-stone-400" : "text-stone-500"}`}>
                        {review.relative_time_description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Small Google Icon (44px tap target, 16px bare mark) */}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={verifiedLabel}
                  aria-label={verifiedLabel}
                  className="-m-3.5 flex h-11 w-11 shrink-0 items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
