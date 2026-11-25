import React from "react";
import { getAirports, placeName } from "./airports";
import { useContent } from "../../content/useContent";

interface PlacesMarqueeProps {
  settings?: any;
}

/**
 * One quiet line of the places we drive to, moving slowly across a dark band.
 * The names are the airports from the dashboard settings followed by the towns
 * from Site Content (home_marquee_places).
 */
export default function PlacesMarquee({ settings }: PlacesMarqueeProps) {
  const c = useContent(settings);
  if (!c.on("home_marquee_enabled")) return null;

  const airports = c.on("home_marquee_show_airports")
    ? getAirports(c.settings).map((airport) => placeName(airport.name))
    : [];
  const seen = new Set<string>();
  const places = [...airports, ...c.lines("home_marquee_places")].filter((place) => {
    const key = place.toLowerCase();
    if (!place || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (places.length === 0) return null;

  return (
    <div className="tl-dark border-y border-white/10 py-7 sm:py-10">
      <div className="tl-marquee">
        <div className="tl-marquee-track">
          {/* Two identical copies make the loop seamless; the second is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? c.t("home_marquee_aria_label") : undefined}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center"
            >
              {places.map((place, index) => (
                <li key={place} className="flex shrink-0 items-center">
                  <span
                    className={`font-display text-4xl leading-none font-medium sm:text-6xl ${
                      index % 2 === 1 ? "text-brand-300 italic" : "text-stone-200"
                    }`}
                  >
                    {place}
                  </span>
                  <span className="mx-7 block h-px w-10 bg-white/25 sm:mx-12 sm:w-16" aria-hidden="true"></span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
