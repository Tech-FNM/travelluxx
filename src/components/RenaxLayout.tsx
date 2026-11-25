import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Compass,
  CheckCircle2,
  Check,
  Armchair,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Wifi,
  Wind,
  Smartphone,
  Droplet,
  Tv,
  Volume2,
  BookOpen,
  Shield,
  Layers
} from "lucide-react";
import BookingCalculator from "./BookingCalculator";
import AirportsGrid from "./AirportsGrid";
import HomepageFaq from "./HomepageFaq";
import GoogleReviewsSection from "./GoogleReviewsSection";

import mercedesEconomyImg from "../assets/images/fleet_economy_1786403470397.jpg";
import mercedesLuxuryImg from "../assets/images/fleet_luxury_1786403483244.jpg";
import mercedesFamilyImg from "../assets/images/fleet_family_1786403496325.jpg";
import heroImg from "../assets/images/hero_background_1786403449488.jpg";
import transferPortImg from "../assets/images/transfer_port_1786403532912.jpg";
import { settingImage } from "../utils/customImages";
import { formatUkPhone, phoneHref } from "../utils/phone";
import { useContent } from "../content/useContent";

interface RenaxLayoutProps {
  settings: any;
  calculatorPickup: string;
  calculatorDropoff: string;
  setCalculatorPickup: (v: string) => void;
  setCalculatorDropoff: (v: string) => void;
  handleScrollTo: (elementId: string) => void;
  handleSelectTransferPreset: (pickup: string, dropoff: string) => void;
  handleSelectClassPreset: (carClass: "Economy" | "Luxury" | "Family") => void;
}

export default function RenaxLayout({
  settings,
  calculatorPickup,
  calculatorDropoff,
  setCalculatorPickup,
  setCalculatorDropoff,
  handleScrollTo,
  handleSelectTransferPreset,
  handleSelectClassPreset
}: RenaxLayoutProps) {
  const c = useContent(settings);
  // Shared settings (fleet_*, hero_image_alt) that the dashboard edits for the default homepage:
  // use the saved value when there is one, otherwise the Renax wording.
  const pick = (key: string, fallback: string): string => {
    const v = settings?.[key];
    return typeof v === "string" && v.trim() !== "" ? v : fallback;
  };
  const pickList = (key: string, fallback: string[]): string[] => {
    const v = settings?.[key];
    return typeof v === "string" && v.trim() !== ""
      ? v.split(/[,•]/).map((s: string) => s.trim()).filter(Boolean)
      : fallback;
  };
  const goTo = (link: string) => {
    if (link.startsWith("#")) handleScrollTo(link.substring(1));
    else window.location.href = link;
  };

  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";
  const emailAddr = settings?.business_email || "info@travelluxx.co.uk";
  const officeAddr = settings?.office_address || "Shirley B90 Shirley, Solihull, West Midlands, UK";

  const [pricing, setPricing] = useState<any>(null);
  const [activeFleetTab, setActiveFleetTab] = useState<"Economy" | "Luxury" | "Family">("Luxury");
  // Hero photo: the dashboard hero image, else the bundled photo.
  const bgImage = settingImage(settings?.hero_image || settings?.heroImage, heroImg);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Failed to fetch fleet pricing:", err));
  }, []);

  const formattedPhone = formatUkPhone(whatsappNum);

  const rawTitle = settings?.homepage_hero_title || "Nationwide Airport | Transfers & Private Chauffeur";
  const titleParts = rawTitle.split("|");
  const titlePart1 = titleParts[0]?.trim() || "Nationwide Airport";
  const titlePart2 = titleParts[1]?.trim();

  const badgeText = settings?.homepage_hero_badge || "Premium Chauffeur Service";
  const heroDesc = settings?.homepage_hero_subtitle || "Experience the pinnacle of luxury private hire. Highly maintained Mercedes-Benz & Audi fleets for your comfort with guaranteed fixed rates.";
  const ind1 = settings?.homepage_indicator1 || "Licensed Operators";
  const ind2 = settings?.homepage_indicator2 || "Nationwide Coverage";
  const ind3 = settings?.homepage_indicator3 || "Zero Surge Pricing";

  const btn1Text = settings?.homepage_hero_btn_text || "Book Chauffeur Now";
  const btn1Link = settings?.homepage_hero_btn_link || "calculator-section";
  const btn2Text = settings?.homepage_hero_phone_text || formattedPhone;
  const btn2Link = settings?.homepage_hero_phone_link || phoneHref(whatsappNum);

  const handleBtn1Click = () => {
    if (btn1Link === "calculator-section") {
      handleScrollTo("calculator-section");
    } else if (btn1Link.startsWith("#")) {
      handleScrollTo(btn1Link.substring(1));
    } else {
      window.location.href = btn1Link;
    }
  };

  const economyName = pick("fleet_economy_name", "Business Economy Class");
  const luxuryName = pick("fleet_luxury_name", c.t("renax_fleet_luxury_name"));
  const familyName = pick("fleet_family_name", "Family & Executive MPV");

  const fleet = {
    Economy: {
      name: economyName,
      alt: pick("fleet_economy_alt", `${economyName} - Luxury Chauffeur Car Solihull & London`),
      tagline: pick("fleet_economy_tagline", "Elegant, clean, and highly efficient travel."),
      image: settingImage(settings?.fleet_economy_image, mercedesEconomyImg),
      rate: pricing?.Economy?.perMile !== undefined ? `£${Number(pricing.Economy.perMile).toFixed(2)}` : "£1.50",
      description: pick("fleet_economy_description", "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency."),
      cars: ["Tesla Model 3", "Audi A4 Executive", "Mercedes C-Class"],
      features: pickList("fleet_economy_features", ["Complimentary 4G Wi-Fi", "Dual-zone Climate Control", "USB Charging Ports", "Bottle Holders & Newspapers"]),
      passengers: c.t("renax_fleet_economy_passengers"),
      luggage: c.t("renax_fleet_economy_luggage"),
      transmission: c.t("renax_fleet_economy_transmission")
    },
    Luxury: {
      name: luxuryName,
      alt: pick("fleet_luxury_alt", `${luxuryName} - Luxury Chauffeur Car Solihull & London`),
      tagline: pick("fleet_luxury_tagline", "The pinnacle of executive comfort and style."),
      image: settingImage(settings?.fleet_luxury_image, mercedesLuxuryImg),
      rate: pricing?.Luxury?.perMile !== undefined ? `£${Number(pricing.Luxury.perMile).toFixed(2)}` : "£2.00",
      description: pick("fleet_luxury_description", "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs."),
      cars: ["Mercedes-Benz S-Class", "Audi A8 L", "Jaguar XJ Luxury"],
      features: pickList("fleet_luxury_features", ["Premium Leather Reclining Seats", "Complimentary Bottled Water", "Ambient Lighting Controls", "Rear Seat Entertainment Systems", "Quiet Acoustic Cabins"]),
      passengers: c.t("renax_fleet_luxury_passengers"),
      luggage: c.t("renax_fleet_luxury_luggage"),
      transmission: c.t("renax_fleet_luxury_transmission")
    },
    Family: {
      name: familyName,
      alt: pick("fleet_family_alt", `${familyName} - Luxury Chauffeur Car Solihull & London`),
      tagline: pick("fleet_family_tagline", "Generous space for luggage and loved ones."),
      image: settingImage(settings?.fleet_family_image, mercedesFamilyImg),
      rate: pricing?.Family?.perMile !== undefined ? `£${Number(pricing.Family.perMile).toFixed(2)}` : "£2.50",
      description: pick("fleet_family_description", "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort."),
      cars: ["Mercedes-Benz V-Class", "Audi Q7 S-Line", "Volkswagen Caravelle Executive"],
      features: pickList("fleet_family_features", ["Conference Seating Options", "Massive Boot Capacity", "Automatic Sliding Doors", "Privacy Glass", "Individual Air-Con Units", "Child Seats Available (On Request)"]),
      passengers: c.t("renax_fleet_family_passengers"),
      luggage: c.t("renax_fleet_family_luggage"),
      transmission: c.t("renax_fleet_family_transmission")
    }
  };
  const fleetTabLabel = {
    Economy: c.t("renax_fleet_tab_economy"),
    Luxury: c.t("renax_fleet_tab_luxury"),
    Family: c.t("renax_fleet_tab_family")
  };

  // Amenity icons sit bare next to the label (no tinted tile).
  const amenityIconClass = "mt-0.5 h-5 w-5 shrink-0 text-brand-300";

  const getAmenityIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes("wi-fi") || f.includes("wifi")) return <Wifi className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("climate") || f.includes("air-con") || f.includes("air conditioning")) return <Wind className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("charging") || f.includes("usb")) return <Smartphone className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("water") || f.includes("bottle")) return <Droplet className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("entertainment") || f.includes("tv")) return <Tv className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("quiet") || f.includes("acoustic")) return <Volume2 className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("leather") || f.includes("seat") || f.includes("reclining")) return <Armchair className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("newspaper") || f.includes("book")) return <BookOpen className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("privacy") || f.includes("glass")) return <Shield className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("boot") || f.includes("capacity")) return <Briefcase className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    if (f.includes("door")) return <Layers className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
    return <CheckCircle2 className={amenityIconClass} strokeWidth={1.5} aria-hidden="true" />;
  };

  const selectedFleet = fleet[activeFleetTab];

  return (
    <div className="bg-brand-950 text-stone-300 antialiased">

      {/* 1. RENAX LUXURY HERO */}
      <section id="hero" className="relative flex min-h-[88vh] items-end overflow-hidden bg-brand-950">
        <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
          <img
            data-parallax
            src={bgImage}
            alt={pick("hero_image_alt", `${brandName} Executive Luxury Chauffeur Banner - Solihull & London`)}
            className="h-full w-full object-cover"
          />
          {/* Flat scrim for legibility: the copy sits on the photograph */}
          <div className="absolute inset-0 bg-brand-950/70"></div>
        </div>

        <div className="tl-container relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-4xl">
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">{badgeText}</span>

            <h1 data-reveal="lines" className="tl-h1 mt-6 text-balance text-white">
              {titlePart1}{" "}
              {titlePart2 && (
                <span className="block italic text-brand-200">
                  {titlePart2}
                </span>
              )}
            </h1>

            <p data-reveal data-reveal-delay="0.15" className="tl-lead mt-6 max-w-2xl text-stone-300">
              {heroDesc}
            </p>

            <div data-reveal data-reveal-delay="0.3" className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleBtn1Click}
                className="tl-btn tl-btn-light w-full sm:w-auto"
              >
                <span>{btn1Text}</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>

              <a
                href={btn2Link}
                className="tl-btn tl-btn-outline-light w-full sm:w-auto"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                <span>{btn2Text}</span>
              </a>
            </div>

            <div
              data-reveal
              data-reveal-delay="0.45"
              className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-stone-300 sm:flex-row sm:flex-wrap sm:gap-x-10"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                <span>{ind1}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Compass className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                <span>{ind2}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                <span>{ind3}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RENAX BOOKING CALCULATOR SEGMENT (the calculator renders its own full-width section) */}
      <section id="calculator-section" className="border-t border-white/10 bg-brand-900">
        <div className="tl-container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_booking_eyebrow")}</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">{c.t("renax_booking_title")}</h2>
        </div>
        <BookingCalculator
          initialPickup={calculatorPickup}
          initialDropoff={calculatorDropoff}
          settings={settings}
        />
      </section>

      {/* III. ABOUT COMPANY SECTION */}
      {c.on("renax_about_enabled") && (
      <section id="about" className="tl-section bg-brand-950">
        <div className="tl-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Block - Copy */}
            <div>
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_about_eyebrow")}</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">
                {c.t("renax_about_title_line1")}{" "}
                <span className="block italic text-brand-300">{c.t("renax_about_title_line2")}</span>
              </h2>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-xl text-stone-300">
                {c.t("renax_about_text").replace(/\{business_name\}/g, brandName)}
              </p>

              <div data-reveal-group className="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                {c.lines("renax_about_features").map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 border-t border-white/10 py-4">
                    <Check className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-sm font-medium text-stone-200">{item}</span>
                  </div>
                ))}
              </div>

              <div data-reveal className="mt-6">
                <button
                  onClick={() => goTo(c.t("renax_about_btn_link"))}
                  className="tl-btn tl-btn-outline-light"
                >
                  {c.t("renax_about_btn_text")}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Block - Photograph with a caption underneath */}
            <div>
              <div data-reveal="image" className="aspect-square overflow-hidden bg-brand-900 lg:aspect-[4/3]">
                <img
                  src={settingImage(c.t("renax_about_image"), transferPortImg)}
                  alt={c.t("renax_about_image_alt")}
                  className="h-full w-full object-cover"
                />
              </div>

              <div data-reveal className="mt-5 flex flex-col gap-1.5 border-b border-white/10 pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-300">{c.t("renax_about_caption_label")}</p>
                <p className="text-sm font-medium text-white">{c.t("renax_about_caption_text")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 4. RENAX FLEET SHOWCASE */}
      {c.on("renax_fleet_enabled") && (
      <section id="fleet" className="tl-section bg-brand-900">
        <div className="tl-container">
          <div>
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_fleet_eyebrow")}</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">
              {c.t("renax_fleet_title")}
            </h2>
            <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl text-stone-300">
              {c.t("renax_fleet_text")}
            </p>
          </div>

          {/* Tabs */}
          <div data-reveal className="mt-12 flex gap-8 border-b border-white/10 sm:gap-10">
            {(Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFleetTab(tab)}
                aria-pressed={activeFleetTab === tab}
                className={`-mb-px min-h-12 cursor-pointer border-b-2 pt-2 pb-3 text-sm font-medium transition-colors duration-200 sm:text-base ${
                  activeFleetTab === tab
                    ? "border-brand-300 text-white"
                    : "border-transparent text-stone-400 hover:text-white"
                }`}
              >
                {fleetTabLabel[tab]}
              </button>
            ))}
          </div>

          {/* Selected vehicle class: photograph left, specification right */}
          <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-16">
            <div data-reveal="image" className="group aspect-video overflow-hidden bg-brand-950 lg:col-span-7 lg:aspect-[4/3]">
              {(Object.keys(fleet) as Array<"Economy" | "Luxury" | "Family">).map((key) => (
                <img
                  key={key}
                  src={fleet[key].image}
                  alt={fleet[key]?.alt || `${fleet[key]?.name || key} - Luxury Chauffeur Car Solihull & London`}
                  loading="eager"
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${activeFleetTab === key ? "block" : "hidden"}`}
                />
              ))}
            </div>

            <div data-reveal className="lg:col-span-5">
              <div>
                <h3 className="text-2xl leading-snug font-semibold text-white">
                  {selectedFleet.name}
                </h3>
                <p className="mt-2 text-sm text-brand-300">{selectedFleet.tagline}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-2 text-sm text-stone-400">
                {c.t("renax_fleet_price_prefix")} <span className="font-display text-4xl leading-none font-medium text-white lining-nums">{selectedFleet.rate}</span> {c.t("renax_fleet_price_suffix")}
              </div>

              <p className="mt-6 text-base leading-relaxed text-stone-300">
                {selectedFleet.description}
              </p>

              <div className="mt-8 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:pr-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">{c.t("renax_fleet_passengers_label")}</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.passengers}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:px-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">{c.t("renax_fleet_luggage_label")}</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.luggage} {c.t("renax_fleet_luggage_suffix")}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:pl-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">{c.t("renax_fleet_transmission_label")}</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.transmission}</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">{c.t("renax_fleet_amenities_title")}</h4>
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 text-sm text-stone-300 sm:grid-cols-2">
                  {selectedFleet.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {getAmenityIcon(feat)}
                      <span className="leading-6">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-9">
                <button
                  onClick={() => handleScrollTo("calculator-section")}
                  className="tl-btn tl-btn-light w-full sm:w-auto"
                >
                  <span>{c.t("renax_fleet_btn_text")}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* VII. CAR RENTAL PROCESS / STEPS */}
      {c.on("renax_steps_enabled") && (
      <section className="tl-section bg-brand-950">
        <div className="tl-container">
          <div>
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_steps_eyebrow")}</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4 text-white lining-nums">{c.t("renax_steps_title")}</h2>
          </div>

          <div data-reveal-group className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:mt-16">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border-t border-white/10 pt-8">
                <div aria-hidden="true" className="font-display text-5xl leading-none text-brand-300 lining-nums select-none">
                  {c.t(`renax_step${n}_number`)}
                </div>
                <h3 className="tl-h3 mt-6 text-white">{c.t(`renax_step${n}_title`)}</h3>
                <p className="mt-3 text-base leading-relaxed text-stone-300">
                  {c.t(`renax_step${n}_text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* IX. VERIFIED GOOGLE CLIENT REVIEWS */}
      {c.on("renax_reviews_enabled") && <GoogleReviewsSection isRenax={true} />}

      {/* 5. AIRPORT TRANSFER CARDS (the grid renders its own full-width section) */}
      {c.on("renax_routes_enabled") && (
      <section className="border-t border-white/10 bg-brand-900">
        <div className="tl-container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_routes_eyebrow")}</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">{c.t("renax_routes_title")}</h2>
        </div>
        <AirportsGrid onSelectTransfer={handleSelectTransferPreset} />
      </section>
      )}

      {/* HOMEPAGE FAQS */}
      {c.on("renax_faq_enabled") && (
      <HomepageFaq
        faqs={settings?.homepage_faqs}
        title={settings?.homepage_faq_title}
        subtitle={settings?.homepage_faq_subtitle}
        badge={settings?.homepage_faq_badge}
        isRenax={true}
      />
      )}

      {/* 6. CONTACT SEGMENT */}
      {c.on("renax_contact_enabled") && (
      <section id="contact" className="tl-section border-t border-white/10 bg-brand-900">
        <div className="tl-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("renax_contact_eyebrow")}</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">{c.t("renax_contact_title")}</h2>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-md text-stone-300">
                {c.t("renax_contact_text")}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div data-reveal-group className="divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-start gap-5 py-6">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{c.t("renax_contact_phone_label")}</p>
                    <p className="mt-2 text-lg font-medium text-white">{formattedPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 py-6">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{c.t("renax_contact_email_label")}</p>
                    <p className="mt-2 text-lg font-medium break-words text-white">{emailAddr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 py-6">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">{c.t("renax_contact_office_label")}</p>
                    <p className="mt-2 text-lg font-medium text-white">{officeAddr.split(",")[0]}</p>
                  </div>
                </div>
              </div>

              <div data-reveal className="mt-8">
                <form className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-400">{c.t("renax_contact_note")}</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

    </div>
  );
}
