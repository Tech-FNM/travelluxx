import React from "react";
import { ArrowRight } from "lucide-react";

import airportTransfersImg from "../assets/images/transfer_airport_1786403518712.jpg";
import portTransfersImg from "../assets/images/transfer_port_1786403532912.jpg";
import stationTransfersImg from "../assets/images/transfer_station_1786403548164.jpg";
// The bundled "city" photo is a Tokyo street, wrong for a card about UK cities. Until a UK city
// photo is uploaded in the admin (service image 4), the card uses the site's own road photo.
import popularCitiesImg from "../assets/images/hero_background_1786403449488.jpg";
import businessTravelImg from "../assets/images/transfer_business_1786403576291.jpg";
import { settingImage } from "../utils/customImages";
import { getAirports } from "./home/airports";
import { useContent } from "../content/useContent";

interface AirportsGridProps {
  onSelectTransfer: (pickup: string, dropoff: string) => void;
  settings?: any;
}

export default function AirportsGrid({ onSelectTransfer, settings }: AirportsGridProps) {
  // Every text, link and photo below is edited in the dashboard: Site Content → Homepage
  // (declared in src/content/sections/homeCoverage.ts). The Renax theme passes no settings prop,
  // so useContent falls back to the site-wide settings.
  const c = useContent(settings);

  // Names and codes come from the dashboard settings (airport_name_N / airport_code_N).
  const airports = getAirports(c.settings);

  // Built-in photos, used while a card's photo field (service_image_N) is empty.
  const builtInImages = [
    { id: "airport", image: airportTransfersImg },
    { id: "port", image: portTransfersImg },
    { id: "station", image: stationTransfersImg },
    { id: "city", image: popularCitiesImg },
    { id: "business", image: businessTravelImg },
  ];

  // service_pickup_N / service_dropoff_N are kept for the calculator preset, but the cards do not
  // call onSelectTransfer at the moment, so those values are not shown anywhere.
  const services = builtInImages.map((card, index) => {
    const n = index + 1;
    return {
      id: card.id,
      title: c.t(`service_title_${n}`),
      description: c.t(`service_desc_${n}`),
      image: settingImage(c.t(`service_image_${n}`), card.image),
      pickup: c.t(`service_pickup_${n}`),
      dropoff: c.t(`service_dropoff_${n}`),
    };
  });

  const altSuffix = c.t("home_services_image_alt_suffix");
  const showServices = c.on("home_services_enabled");
  const showAirports = c.on("home_airports_enabled");

  return (
    <>
      {/* SERVICES: the page's one horizontal gallery. On desktop the block pins and the cards travel
          sideways as the page scrolls (data-hscroll); on touch screens the row swipes.
          Rules of the engine: the data-hscroll wrapper is the only child of the section, and nothing
          inside the track carries a reveal attribute. */}
      {showServices && (
      <section className="bg-white lg:py-12">
        <div data-hscroll className="py-20 lg:py-16">
          {/* The left edge lines up with tl-container; the right edge runs off the screen. */}
          <div className="lg:grid lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pl-[max(2rem,calc((100%_-_80rem)_/_2_+_2rem))] xl:grid-cols-[24rem_minmax(0,1fr)] xl:gap-20">

            {/* Header: stays put while the cards move */}
            <div className="px-5 sm:px-8 lg:px-0">
              <span data-reveal className="tl-eyebrow">{c.t("home_services_eyebrow")}</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4">
                {c.t("home_services_title")}
              </h2>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-md">
                {c.t("home_services_lead")}
              </p>
              <div data-reveal data-reveal-delay="0.2" className="mt-8 flex items-center justify-between gap-6 lg:mt-10 lg:block">
                <a href={c.t("home_services_link_url")} className="tl-link -my-3 py-3">
                  <span>{c.t("home_services_link_text")}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                {c.on("home_services_counter_enabled") && (
                  <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-stone-500 lining-nums lg:mt-14">
                    <span>01</span>
                    <span className="block h-px w-10 bg-stone-300" aria-hidden="true"></span>
                    <span>{String(services.length).padStart(2, "0")}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Gallery window */}
            <div className="mt-12 overflow-hidden lg:mt-0">
              <div data-hscroll-track className="scroll-pl-5 pl-5 sm:scroll-pl-8 sm:pl-8 lg:pl-0">
                {services.map((service, idx) => (
                  <article key={service.title} className="w-[78vw] sm:w-[420px]">
                    {/* Image box */}
                    <div className="aspect-[4/5] overflow-hidden bg-stone-100 lg:aspect-auto lg:h-[min(50vh,520px)]">
                      <img
                        src={service.image}
                        alt={altSuffix ? `${service.title} - ${altSuffix}` : service.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80";
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                    </div>

                    {/* Caption */}
                    <div className="mt-5 flex gap-5 border-t border-stone-200 pt-5">
                      <span className="pt-1 font-display text-xl leading-none font-medium text-brand-700 lining-nums" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-2xl leading-tight font-medium text-stone-900 sm:text-3xl">
                          {service.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
                {/* End spacer: the last card stops on the container's right edge instead of the screen's. */}
                <div className="w-px lg:w-[max(0.5rem,calc((100vw_-_80rem)_/_2_+_0.5rem))]" aria-hidden="true"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* AIRPORTS: dark band, the six codes set very large on hairlines */}
      {showAirports && (
      <section id="airports" className="tl-section tl-dark">
        <div className="tl-container">

          {/* Section Heading */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("home_airports_eyebrow")}</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4 max-w-3xl text-white">
                {c.t("homepage_airports_title")}
              </h2>
            </div>
            <p data-reveal data-reveal-delay="0.1" className="text-base leading-relaxed text-stone-300 sm:text-lg lg:col-span-4">
              {c.t("home_airports_lead")}
            </p>
          </div>

          {/* Airport codes */}
          <ul data-reveal-group className="mt-14 grid grid-cols-2 gap-x-6 sm:gap-x-10 lg:mt-20 lg:grid-cols-3 lg:gap-x-16">
            {airports.map((airport) => (
              <li key={airport.code} className="border-t border-white/15 pt-5 pb-10 lg:pt-6 lg:pb-16">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-stone-300">
                  {airport.name}
                </div>
                <div className="mt-5 font-display text-6xl leading-none font-medium text-white sm:text-8xl lg:mt-8 xl:text-9xl">
                  {airport.code}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-stone-400 lg:mt-6">
                  {c.t("home_airports_item_label")}
                </div>
              </li>
            ))}
          </ul>

        </div>
      </section>
      )}
    </>
  );
}
