import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "../../utils/routerCompat";
import { AreaLike, areaListImage, areaPlaceName, bareSlug, dedupeAreas, twoDigits } from "./areaShared";

interface OtherAreasProps {
  /** The raw list from /api/service-areas (aliases included). */
  areas: AreaLike[];
  /** The area this page is about; it is left out of the gallery. */
  current: AreaLike;
}

/**
 * "Other areas we cover": a sideways gallery of the remaining areas. On desktop the section pins
 * and the cards travel across (data-hscroll); on touch screens the row swipes.
 */
export default function OtherAreas({ areas, current }: OtherAreasProps) {
  const currentTitle = String(current?.title || "").trim().toLowerCase();
  const others = dedupeAreas(areas)
    .map((area, index) => ({ area, index }))
    .filter(
      ({ area }) =>
        bareSlug(area.slug) !== bareSlug(current?.slug) &&
        String(area.title || "").trim().toLowerCase() !== currentTitle
    );

  if (others.length === 0) return null;

  return (
    <section className="overflow-hidden bg-white py-20 lg:py-28">
      <div data-hscroll>
        <div className="tl-container">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <div>
              <span data-reveal className="tl-eyebrow">Other areas we cover</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4">
                Beyond {areaPlaceName(current)}
              </h2>
            </div>
            <Link to="/service-areas" data-reveal data-reveal-delay="0.1" className="tl-link py-2">
              <span>All service areas</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 lg:mt-12">
            <div data-hscroll-track className="-mx-5 scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:px-0">
              {others.map(({ area, index }) => (
                <Link
                  key={area.id || area.slug}
                  to={`/service-areas/${area.slug}`}
                  className="group block w-[78vw] sm:w-[420px]"
                >
                  <div className="aspect-[3/2] overflow-hidden bg-stone-100">
                    <img
                      src={areaListImage(area, index)}
                      alt={area.imageAlt || `Chauffeur service in ${areaPlaceName(area)}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 border-b border-stone-300 pt-5 pb-5">
                    <div>
                      <span className="font-display text-lg leading-none text-brand-700 lining-nums" aria-hidden="true">
                        {twoDigits(index + 1)}
                      </span>
                      <h3 className="mt-2 font-display text-3xl leading-[1.05] font-medium text-stone-900 transition-colors duration-200 group-hover:text-brand-700">
                        {areaPlaceName(area)}
                      </h3>
                    </div>
                    <ArrowUpRight
                      className="mb-1 h-5 w-5 shrink-0 text-stone-500 transition-colors duration-200 group-hover:text-brand-700"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}

              {/* Last stop of the gallery: the full directory */}
              <Link
                to="/service-areas"
                className="tl-dark group flex w-[62vw] flex-col justify-between p-7 transition-colors duration-200 hover:bg-brand-900 sm:w-[300px]"
              >
                <span className="text-xs font-medium tracking-[0.22em] text-brand-300 uppercase">The directory</span>
                <span className="flex items-end justify-between gap-4">
                  <span className="font-display text-3xl leading-[1.08] font-medium text-white">
                    See every area we cover
                  </span>
                  <ArrowUpRight className="mb-1 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
