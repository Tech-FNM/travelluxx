import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { AREA_IMG, fillPlaceholders, phoneFromSettings } from "./areaShared";
import { useContent } from "../../content/useContent";

interface AreaCtaProps {
  settings?: any;
  /** Place name on a detail page ("Solihull"). Left out on the index. */
  place?: string;
}

/** Closing call-to-action band shared by the service-area index and detail pages. */
export default function AreaCta({ settings, place }: AreaCtaProps) {
  const phone = phoneFromSettings(settings);
  const c = useContent(settings);
  const fill = (key: string) => fillPlaceholders(c.t(key), { area: place, phone: phone.label });

  // The switch applies to the area pages; the index page always closes with this band.
  if (place && !c.on("area_detail_cta_enabled")) return null;

  return (
    <section className="tl-dark relative flex flex-col overflow-hidden border-b border-white/10 lg:block">
      {/* Photograph: bleeds to the right edge on desktop, closes the band on mobile */}
      <div
        data-reveal="image"
        className="order-last aspect-[16/10] w-full overflow-hidden sm:aspect-[2/1] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[46%]"
      >
        <img
          src={c.t("area_detail_cta_image") || AREA_IMG.luxury}
          alt={fill("area_detail_cta_image_alt")}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="tl-container relative">
        <div className="py-20 lg:w-[48%] lg:py-36">
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">
            {place ? fill("area_detail_cta_eyebrow") : fill("area_detail_cta_index_eyebrow")}
          </span>
          <h2 data-reveal="lines" className="tl-h2 mt-5 text-white lg:text-6xl">
            {place ? fill("area_detail_cta_title") : fill("area_detail_cta_index_title")}
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-6 max-w-md text-stone-300">
            {fill("area_detail_cta_text")}
          </p>
          <div data-reveal data-reveal-delay="0.2" className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={c.t("area_detail_cta_button_url")} className="tl-btn tl-btn-light">
              <span>{fill("area_detail_cta_button_text")}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a href={phone.href} className="tl-btn tl-btn-outline-light">
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span>{phone.label}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
