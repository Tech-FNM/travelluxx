import React from "react";
import { getAirports, placeName } from "./airports";

interface PlacesMarqueeProps {
  settings?: any;
}

// Towns and cities already named on the site (service cards and service-area pages).
const TOWNS = ["Solihull", "Coventry", "Warwick", "Leamington Spa", "Worcester", "Cheltenham"];

/**
 * One quiet line of the places we drive to, moving slowly across a dark band.
 * The names are the airports from the dashboard settings followed by the towns above.
 */
export default function PlacesMarquee({ settings }: PlacesMarqueeProps) {
  const seen = new Set<string>();
  const places = [...getAirports(settings).map((airport) => placeName(airport.name)), ...TOWNS].filter((place) => {
    const key = place.toLowerCase();
    if (!place || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="tl-dark border-y border-white/10 py-7 sm:py-10">
      <div className="tl-marquee">
        <div className="tl-marquee-track">
          {/* Two identical copies make the loop seamless; the second is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-label={copy === 0 ? "Places we drive to" : undefined}
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
