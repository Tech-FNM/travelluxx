import React, { useState, useEffect } from "react";
import { 
  Users, 
  Briefcase, 
  Compass, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Car, 
  Wifi, 
  Wind, 
  BatteryCharging, 
  Droplet, 
  Tv, 
  Volume2, 
  Shield, 
  Layers,
  Armchair,
  Smartphone,
  BookOpen,
  ArrowRight
} from "lucide-react";

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

  // Map amenity text to relevant icons (bare, thin stroke, brand green)
  const getAmenityIcon = (feature: string) => {
    const f = feature.toLowerCase();
    const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-brand-700";
    if (f.includes("wi-fi") || f.includes("wifi")) return <Wifi className={iconClass} strokeWidth={1.5} />;
    if (f.includes("climate") || f.includes("air-con") || f.includes("air conditioning")) return <Wind className={iconClass} strokeWidth={1.5} />;
    if (f.includes("charging") || f.includes("usb")) return <Smartphone className={iconClass} strokeWidth={1.5} />;
    if (f.includes("water") || f.includes("bottle")) return <Droplet className={iconClass} strokeWidth={1.5} />;
    if (f.includes("entertainment") || f.includes("tv")) return <Tv className={iconClass} strokeWidth={1.5} />;
    if (f.includes("quiet") || f.includes("acoustic")) return <Volume2 className={iconClass} strokeWidth={1.5} />;
    if (f.includes("leather") || f.includes("seat") || f.includes("reclining")) return <Armchair className={iconClass} strokeWidth={1.5} />;
    if (f.includes("newspaper") || f.includes("book")) return <BookOpen className={iconClass} strokeWidth={1.5} />;
    if (f.includes("privacy") || f.includes("glass")) return <Shield className={iconClass} strokeWidth={1.5} />;
    if (f.includes("boot") || f.includes("capacity")) return <Briefcase className={iconClass} strokeWidth={1.5} />;
    if (f.includes("door")) return <Layers className={iconClass} strokeWidth={1.5} />;
    return <CheckCircle2 className={iconClass} strokeWidth={1.5} />;
  };

  return (
    <section id="fleet" className="tl-section bg-white">
      <div className="tl-container">

        {/* Header */}
        <div>
          <span data-reveal className="tl-eyebrow">
            {settings?.homepage_fleet_subtitle || "Our Premium Fleet"}
          </span>
          <h2 data-reveal="lines" className="tl-h2 mt-4">
            {settings?.homepage_fleet_title || "Travel in Premium Comfort"}
          </h2>
          <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
            {settings?.homepage_fleet_description || "Our curated fleet features state-of-the-art Mercedes-Benz and Audi luxury models, rigorously maintained to the highest safety and cosmetic standards for nationwide transfers."}
          </p>
        </div>

        {/* Class tabs */}
        <div
          data-reveal
          role="tablist"
          aria-label="Vehicle class"
          className="mt-10 flex gap-8 border-b border-stone-200 sm:gap-10 lg:mt-12"
        >
          {(Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">).map((tab) => (
            <button
              key={tab}
              id={`fleet-tab-${tab}`}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="fleet-panel"
              onClick={() => setActiveTab(tab)}
              className={`-mb-px cursor-pointer border-b-2 pt-3 pb-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "border-brand-700 text-brand-800"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              {tab === "Family" ? "Family / MPV" : tab}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div
          id="fleet-panel"
          role="tabpanel"
          aria-labelledby={`fleet-tab-${activeTab}`}
          className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12 xl:grid-cols-12 xl:gap-16"
        >

          {/* Left Block - Image. 3:2 rather than 4:3: the fleet photos are 16:9 studio shots with the
              car filling the frame, and a 4:3 crop cuts the nose and tail off the Economy car. */}
          <div data-reveal="image" className="aspect-[3/2] overflow-hidden bg-stone-100 xl:col-span-7">
            {(Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">).map((key) => (
              <img
                key={key}
                src={fleet[key].image}
                alt={fleet[key].alt || `${fleet[key].name} - Executive Chauffeur Car`}
                loading="eager"
                decoding="async"
                className={`h-full w-full object-cover ${activeTab === key ? "block" : "hidden"}`}
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

          {/* Right Block - Features & Specifications */}
          <div data-reveal data-reveal-delay="0.15" className="xl:col-span-5">
            <h3 className="font-display text-3xl sm:text-4xl font-medium text-stone-900">
              {selectedClass.name}
            </h3>
            <p className="mt-3 text-brand-700 text-sm font-medium">{selectedClass.tagline}</p>

            <p className="mt-6 text-base leading-relaxed text-stone-600">
              {selectedClass.description}
            </p>

            {/* Key Luxury Amenities Grid */}
            <div className="mt-8 border-t border-stone-200 pt-8">
              <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Included On-Board Amenities:</h4>
              <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {selectedClass.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-5 text-stone-700 sm:only:col-span-2">
                    {getAmenityIcon(feat)}
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Select class and scroll to calculator button */}
            <div className="mt-10">
              <button
                onClick={() => onSelectClass(activeTab)}
                className="tl-btn tl-btn-primary w-full sm:w-auto"
              >
                <span>Book This Class Now</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
