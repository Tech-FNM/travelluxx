import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

import mercedesEconomyImg from "../assets/images/fleet_economy_1786403470397.jpg";
import mercedesLuxuryImg from "../assets/images/fleet_luxury_1786403483244.jpg";
import mercedesFamilyImg from "../assets/images/fleet_family_1786403496325.jpg";
import { getCustomImage } from "../utils/customImages";

interface FleetCatalogProps {
  onSelectClass: (carClass: "Economy" | "Luxury" | "Family") => void;
  settings?: any;
}

export default function FleetCatalog({ onSelectClass, settings }: FleetCatalogProps) {
  const [activeTab, setActiveTab] = React.useState<"Economy" | "Luxury" | "Family">("Luxury");
  const [pricing, setPricing] = React.useState<any>(null);
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshKey(prev => prev + 1);
    window.addEventListener("custom_images_updated", handleUpdate);
    return () => window.removeEventListener("custom_images_updated", handleUpdate);
  }, []);

  React.useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Failed to fetch fleet pricing:", err));
  }, []);

  const fleet = {
    Economy: {
      name: settings?.fleet_economy_name || "Business Economy Class",
      alt: settings?.fleet_economy_alt || `${settings?.fleet_economy_name || "Business Economy Class"} - Executive Chauffeur Car Solihull & London`,
      tagline: settings?.fleet_economy_tagline || "Elegant, clean, and highly efficient travel.",
      image: settings?.fleet_economy_image || getCustomImage("fleet_Economy", mercedesEconomyImg),
      rate: pricing?.Economy?.perMile !== undefined ? `£${Number(pricing.Economy.perMile).toFixed(2)}` : "£1.50",
      description: settings?.fleet_economy_description || "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency.",
      cars: ["Tesla Model 3", "Audi A4 Executive", "Mercedes C-Class"],
      features: (settings?.fleet_economy_features || "Complimentary 4G Wi-Fi, Dual-zone Climate Control, USB Charging Ports, Bottle Holders & Newspapers").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    },
    Luxury: {
      name: settings?.fleet_luxury_name || "First Class Luxury Chauffeur",
      alt: settings?.fleet_luxury_alt || `${settings?.fleet_luxury_name || "First Class Luxury Chauffeur"} - Executive Mercedes-Benz S-Class Solihull & London`,
      tagline: settings?.fleet_luxury_tagline || "The pinnacle of executive comfort and style.",
      image: settings?.fleet_luxury_image || getCustomImage("fleet_Luxury", mercedesLuxuryImg),
      rate: pricing?.Luxury?.perMile !== undefined ? `£${Number(pricing.Luxury.perMile).toFixed(2)}` : "£2.00",
      description: settings?.fleet_luxury_description || "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs.",
      cars: ["Mercedes-Benz S-Class", "Audi A8 L", "Jaguar XJ Luxury"],
      features: (settings?.fleet_luxury_features || "Premium Leather Reclining Seats, Complimentary Bottled Water, Ambient Lighting Controls, Rear Seat Entertainment Systems, Quiet Acoustic Cabins").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    },
    Family: {
      name: settings?.fleet_family_name || "Family & Executive MPV",
      alt: settings?.fleet_family_alt || `${settings?.fleet_family_name || "Family & Executive MPV"} - Mercedes-Benz V-Class Chauffeur Solihull & London`,
      tagline: settings?.fleet_family_tagline || "Generous space for luggage and loved ones.",
      image: settings?.fleet_family_image || getCustomImage("fleet_Family", mercedesFamilyImg),
      rate: pricing?.Family?.perMile !== undefined ? `£${Number(pricing.Family.perMile).toFixed(2)}` : "£2.50",
      description: settings?.fleet_family_description || "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort.",
      cars: ["Mercedes-Benz V-Class", "Audi Q7 S-Line", "Volkswagen Caravelle Executive"],
      features: (settings?.fleet_family_features || "Conference Seating Options, Massive Boot Capacity, Automatic Sliding Doors, Privacy Glass, Individual Air-Con Units, Child Seats Available (On Request)").split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
    }
  };

  const selectedClass = fleet[activeTab];

  const tabs = Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">;

  return (
    <section id="fleet" className="tl-section overflow-x-clip bg-ivory">
      <div className="tl-container">

        {/* Header: heading left, lead right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <span data-reveal className="tl-eyebrow">
              {settings?.homepage_fleet_subtitle || "Our Premium Fleet"}
            </span>
            <h2 data-reveal="lines" className="tl-h2 mt-4">
              {settings?.homepage_fleet_title || "Travel in Premium Comfort"}
            </h2>
          </div>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead lg:col-span-5">
            {settings?.homepage_fleet_description || "Our curated fleet features state-of-the-art Mercedes-Benz and Audi luxury models, rigorously maintained to the highest safety and cosmetic standards for nationwide transfers."}
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
                {tab}
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
                <span>Book This Class Now</span>
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
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Included On-Board Amenities:</h4>
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
