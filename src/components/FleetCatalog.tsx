import React from "react";
import { ArrowRight } from "lucide-react";

import mercedesEconomyImg from "../assets/images/fleet_economy_1786403470397.jpg";
import mercedesLuxuryImg from "../assets/images/fleet_luxury_1786403483244.jpg";
import mercedesFamilyImg from "../assets/images/fleet_family_1786403496325.jpg";
import { settingImage } from "../utils/customImages";
import { useContent } from "../content/useContent";

interface FleetCatalogProps {
  onSelectClass: (carClass: "Economy" | "Luxury" | "Family") => void;
  settings?: any;
}

export default function FleetCatalog({ onSelectClass, settings }: FleetCatalogProps) {
  const [activeTab, setActiveTab] = React.useState<"Economy" | "Luxury" | "Family">("Luxury");
  const [pricing, setPricing] = React.useState<any>(null);
  const c = useContent(settings);

  React.useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Failed to fetch fleet pricing:", err));
  }, []);

  const fleet = {
    Economy: {
      name: c.t("fleet_economy_name"),
      alt: c.t("fleet_economy_alt") || `${c.t("fleet_economy_name")} - Executive Chauffeur Car Solihull & London`,
      tagline: c.t("fleet_economy_tagline"),
      image: settingImage(c.t("fleet_economy_image"), mercedesEconomyImg),
      rate: pricing?.Economy?.perMile !== undefined ? `£${Number(pricing.Economy.perMile).toFixed(2)}` : "£1.50",
      description: c.t("fleet_economy_description"),
      cars: ["Tesla Model 3", "Audi A4 Executive", "Mercedes C-Class"],
      features: c.t("fleet_economy_features").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    },
    Luxury: {
      name: c.t("fleet_luxury_name"),
      alt: c.t("fleet_luxury_alt") || `${c.t("fleet_luxury_name")} - Executive Mercedes-Benz S-Class Solihull & London`,
      tagline: c.t("fleet_luxury_tagline"),
      image: settingImage(c.t("fleet_luxury_image"), mercedesLuxuryImg),
      rate: pricing?.Luxury?.perMile !== undefined ? `£${Number(pricing.Luxury.perMile).toFixed(2)}` : "£2.00",
      description: c.t("fleet_luxury_description"),
      cars: ["Mercedes-Benz S-Class", "Audi A8 L", "Jaguar XJ Luxury"],
      features: c.t("fleet_luxury_features").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    },
    Family: {
      name: c.t("fleet_family_name"),
      alt: c.t("fleet_family_alt") || `${c.t("fleet_family_name")} - Mercedes-Benz V-Class Chauffeur Solihull & London`,
      tagline: c.t("fleet_family_tagline"),
      image: settingImage(c.t("fleet_family_image"), mercedesFamilyImg),
      rate: pricing?.Family?.perMile !== undefined ? `£${Number(pricing.Family.perMile).toFixed(2)}` : "£2.50",
      description: c.t("fleet_family_description"),
      cars: ["Mercedes-Benz V-Class", "Audi Q7 S-Line", "Volkswagen Caravelle Executive"],
      features: c.t("fleet_family_features").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    }
  };

  const selectedClass = fleet[activeTab];

  const tabs = Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">;
  const tabLabels: Record<"Economy" | "Luxury" | "Family", string> = {
    Economy: c.t("home_fleet_tab_economy"),
    Luxury: c.t("home_fleet_tab_luxury"),
    Family: c.t("home_fleet_tab_family"),
  };

  if (!c.on("home_fleet_enabled")) return null;

  return (
    <section id="fleet" className="tl-section overflow-x-clip bg-ivory">
      <div className="tl-container">

        {/* Header: heading left, lead right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <span data-reveal className="tl-eyebrow">
              {c.t("homepage_fleet_subtitle")}
            </span>
            <h2 data-reveal="lines" className="tl-h2 mt-4">
              {c.t("homepage_fleet_title")}
            </h2>
          </div>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead lg:col-span-5">
            {c.t("homepage_fleet_description")}
          </p>
        </div>

        {/* Class tabs: the three class names, set large */}
        <div
          data-reveal
          role="tablist"
          aria-label="Vehicle class"
          className="mt-12 flex items-baseline gap-x-3 border-b border-stone-300 sm:gap-x-6 lg:mt-20 lg:gap-x-8"
        >
          {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
              {index > 0 && (
                <span className="font-display text-3xl leading-none text-stone-300 sm:text-5xl lg:text-6xl" aria-hidden="true">/</span>
              )}
              <button
                id={`fleet-tab-${tab}`}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="fleet-panel"
                onClick={() => setActiveTab(tab)}
                className={`-mb-px cursor-pointer border-b-2 pt-2 pb-4 font-display text-3xl leading-none font-medium transition-colors duration-200 sm:text-5xl lg:pb-6 lg:text-6xl ${
                  activeTab === tab
                    ? "border-brand-700 text-stone-900"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                {tabLabels[tab]}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Tab Content Display. Two columns on desktop: the text on the left, the photograph and the
            amenities on the right. On mobile the column wrappers dissolve (display: contents) and
            their blocks are ordered photo, text, amenities, button. */}
        <div
          id="fleet-panel"
          role="tabpanel"
          aria-labelledby={`fleet-tab-${activeTab}`}
          className="mt-8 flex flex-col gap-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-16"
        >

          <div className="contents lg:col-span-4 lg:block">
            {/* Name and description */}
            <div data-reveal data-reveal-delay="0.15" className="order-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500 lining-nums">
                {String(tabs.indexOf(activeTab) + 1).padStart(2, "0")} / {String(tabs.length).padStart(2, "0")}
              </p>
              <h3 className="mt-5 font-display text-3xl leading-tight font-medium text-stone-900 sm:text-4xl">
                {selectedClass.name}
              </h3>
              <p className="mt-3 text-sm font-medium text-brand-700">{selectedClass.tagline}</p>

              <p className="mt-6 text-base leading-relaxed text-stone-600">
                {selectedClass.description}
              </p>
            </div>

            {/* Select class and scroll to calculator button */}
            <div data-reveal data-reveal-delay="0.25" className="order-4 lg:mt-10">
              <button
                onClick={() => onSelectClass(activeTab)}
                className="tl-btn tl-btn-primary w-full sm:w-auto"
              >
                <span>{c.t("home_fleet_book_button")}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="contents lg:col-span-8 lg:block">
            {/* The photograph: edge to edge on mobile, running off the right edge of the screen on
                desktop. Close to 16:9 because the fleet photos are 16:9 studio shots with the car
                filling the frame; a squarer crop cuts the nose and tail off the Economy car. */}
            <div
              data-reveal="image"
              className="relative order-1 -mx-5 aspect-[3/2] overflow-hidden bg-stone-200 sm:-mx-8 lg:mx-0 lg:mr-[min(-2rem,calc((80rem_-_100vw)_/_2_-_2rem))] lg:aspect-[16/9] lg:max-h-[640px]"
            >
              {tabs.map((key) => (
                <img
                  key={key}
                  src={fleet[key].image}
                  alt={fleet[key].alt || `${fleet[key].name} - Executive Chauffeur Car`}
                  aria-hidden={activeTab !== key}
                  loading="eager"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${activeTab === key ? "opacity-100" : "opacity-0"}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallbacks: Record<string, string> = {
                      Economy: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
                      Luxury: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
                      Family: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
                    };
                    const fb = fallbacks[key] || fallbacks.Luxury;
                    if (target.src !== fb) {
                      target.src = fb;
                    }
                  }}
                />
              ))}
            </div>

            {/* Key Luxury Amenities: two-column hairline list */}
            <div data-reveal className="order-3 lg:mt-10">
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">{c.t("home_fleet_amenities_heading")}</h4>
              <ul className="mt-5 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                {selectedClass.features.map((feat, idx) => (
                  <li key={idx} className="border-t border-stone-300 py-3.5 text-sm leading-5 text-stone-700">
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
