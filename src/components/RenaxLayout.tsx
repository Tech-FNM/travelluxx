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
import { getCustomImage } from "../utils/customImages";

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
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";
  const emailAddr = settings?.business_email || "info@travelluxx.co.uk";
  const officeAddr = settings?.office_address || "Shirley B90 Shirley, Solihull, West Midlands, UK";

  const [pricing, setPricing] = useState<any>(null);
  const [activeFleetTab, setActiveFleetTab] = useState<"Economy" | "Luxury" | "Family">("Luxury");
  const [bgImage, setBgImage] = useState<string>(() => {
    const customSetting = settings?.hero_image || settings?.heroImage;
    return (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : getCustomImage("hero_bg", heroImg);
  });

  useEffect(() => {
    const customSetting = settings?.hero_image || settings?.heroImage;
    setBgImage((customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : getCustomImage("hero_bg", heroImg));
  }, [settings]);

  useEffect(() => {
    fetch("/api/pricing")
      .then(res => res.json())
      .then(data => setPricing(data))
      .catch(err => console.error("Failed to fetch fleet pricing:", err));
  }, []);

  const formattedPhone = whatsappNum.startsWith("44")
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}`
    : whatsappNum;

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
  const btn2Link = settings?.homepage_hero_phone_link || `tel:${whatsappNum}`;

  const handleBtn1Click = () => {
    if (btn1Link === "calculator-section") {
      handleScrollTo("calculator-section");
    } else if (btn1Link.startsWith("#")) {
      handleScrollTo(btn1Link.substring(1));
    } else {
      window.location.href = btn1Link;
    }
  };

  const fleet = {
    Economy: {
      name: "Business Economy Class",
      tagline: "Elegant, clean, and highly efficient travel.",
      image: getCustomImage("fleet_Economy", mercedesEconomyImg),
      rate: pricing?.Economy?.perMile !== undefined ? `£${Number(pricing.Economy.perMile).toFixed(2)}` : "£1.50",
      description: "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency.",
      cars: ["Tesla Model 3", "Audi A4 Executive", "Mercedes C-Class"],
      features: ["Complimentary 4G Wi-Fi", "Dual-zone Climate Control", "USB Charging Ports", "Bottle Holders & Newspapers"],
      passengers: 4,
      luggage: 2,
      transmission: "Auto"
    },
    Luxury: {
      name: "First Chauffeur Class",
      tagline: "The pinnacle of executive comfort and style.",
      image: getCustomImage("fleet_Luxury", mercedesLuxuryImg),
      rate: pricing?.Luxury?.perMile !== undefined ? `£${Number(pricing.Luxury.perMile).toFixed(2)}` : "£2.00",
      description: "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs.",
      cars: ["Mercedes-Benz S-Class", "Audi A8 L", "Jaguar XJ Luxury"],
      features: ["Premium Leather Reclining Seats", "Complimentary Bottled Water", "Ambient Lighting Controls", "Rear Seat Entertainment Systems", "Quiet Acoustic Cabins"],
      passengers: 4,
      luggage: 3,
      transmission: "Auto"
    },
    Family: {
      name: "Family & Executive MPV",
      tagline: "Generous space for luggage and loved ones.",
      image: getCustomImage("fleet_Family", mercedesFamilyImg),
      rate: pricing?.Family?.perMile !== undefined ? `£${Number(pricing.Family.perMile).toFixed(2)}` : "£2.50",
      description: "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort.",
      cars: ["Mercedes-Benz V-Class", "Audi Q7 S-Line", "Volkswagen Caravelle Executive"],
      features: ["Conference Seating Options", "Massive Boot Capacity", "Automatic Sliding Doors", "Privacy Glass", "Individual Air-Con Units", "Child Seats Available (On Request)"],
      passengers: 7,
      luggage: 6,
      transmission: "Auto"
    }
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
            alt="Travelluxx Executive Luxury Chauffeur Banner - Solihull & London"
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
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">Luxury Ride</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">Book Your Chauffeur Transfer</h2>
        </div>
        <BookingCalculator
          initialPickup={calculatorPickup}
          initialDropoff={calculatorDropoff}
          settings={settings}
        />
      </section>

      {/* III. ABOUT COMPANY SECTION */}
      <section id="about" className="tl-section bg-brand-950">
        <div className="tl-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left Block - Copy */}
            <div>
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">About Travelluxx</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">
                We Are More Than{" "}
                <span className="block italic text-brand-300">A Private Hire Company</span>
              </h2>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-xl text-stone-300">
                At {brandName}, we provide a first-class private hire and airport chauffeur service across the United Kingdom. With absolute luxury and punctuality, our services are customized for executive corporate transfers, weddings, and premium airport pickups.
              </p>

              <div data-reveal-group className="mt-8 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                <div className="flex items-center gap-3 border-t border-white/10 py-4">
                  <Check className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm font-medium text-stone-200">Sports & Luxury Cars</span>
                </div>
                <div className="flex items-center gap-3 border-t border-white/10 py-4">
                  <Check className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm font-medium text-stone-200">Executive Economy Cars</span>
                </div>
                <div className="flex items-center gap-3 border-t border-white/10 py-4">
                  <Check className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm font-medium text-stone-200">High Capacity MPVs</span>
                </div>
                <div className="flex items-center gap-3 border-t border-white/10 py-4">
                  <Check className="h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-sm font-medium text-stone-200">24/7 Flight Monitoring</span>
                </div>
              </div>

              <div data-reveal className="mt-6">
                <button
                  onClick={() => handleScrollTo("contact")}
                  className="tl-btn tl-btn-outline-light"
                >
                  Read More
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Block - Photograph with a caption underneath */}
            <div>
              <div data-reveal="image" className="aspect-square overflow-hidden bg-brand-900 lg:aspect-[4/3]">
                <img
                  src={getCustomImage("about_showcase", transferPortImg)}
                  alt="Travelluxx Luxury Chauffeur Driver Service - Solihull & London"
                  className="h-full w-full object-cover"
                />
              </div>

              <div data-reveal className="mt-5 flex flex-col gap-1.5 border-b border-white/10 pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-300">Chauffeur Certified</p>
                <p className="text-sm font-medium text-white">Safe & Professional Travels</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RENAX FLEET SHOWCASE */}
      <section id="fleet" className="tl-section bg-brand-900">
        <div className="tl-container">
          <div>
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">Our Premium Fleet</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">
              Explore Our Luxury Vehicles
            </h2>
            <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl text-stone-300">
              Curated luxury fleets of state-of-the-art Mercedes-Benz and Audi models. Meticulously clean, safe, and chauffeured to your location.
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
                {tab === "Family" ? "Family / MPV" : tab}
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
                From <span className="font-display text-4xl leading-none font-medium text-white lining-nums">{selectedFleet.rate}</span> / mile
              </div>

              <p className="mt-6 text-base leading-relaxed text-stone-300">
                {selectedFleet.description}
              </p>

              <div className="mt-8 grid grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:pr-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">PASSENGERS</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.passengers}</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:px-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">LUGGAGE</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.luggage} Slots</span>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:pl-5">
                  <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">TRANSMISSION</span>
                  <span className="block text-base font-medium text-white sm:mt-2 sm:text-lg">{selectedFleet.transmission}</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">Included Amenities:</h4>
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
                  <span>Select vehicle class</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VII. CAR RENTAL PROCESS / STEPS */}
      <section className="tl-section bg-brand-950">
        <div className="tl-container">
          <div>
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">How It Works</span>
            <h2 data-reveal="lines" className="tl-h2 mt-4 text-white lining-nums">3 Easy Steps to Rent</h2>
          </div>

          <div data-reveal-group className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12 lg:mt-16">
            {/* Step 1 */}
            <div className="border-t border-white/10 pt-8">
              <div aria-hidden="true" className="font-display text-5xl leading-none text-brand-300 lining-nums select-none">
                01
              </div>
              <h3 className="tl-h3 mt-6 text-white">1. Choose A Class</h3>
              <p className="mt-3 text-base leading-relaxed text-stone-300">
                Select your preferred luxury class—Economy, Chauffeur First Class, or high capacity Family MPVs according to requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-t border-white/10 pt-8">
              <div aria-hidden="true" className="font-display text-5xl leading-none text-brand-300 lining-nums select-none">
                02
              </div>
              <h3 className="tl-h3 mt-6 text-white">2. Book Chauffeur</h3>
              <p className="mt-3 text-base leading-relaxed text-stone-300">
                Enter your locations, date, and pickup times in our fixed rates calculator. Confirm pricing and chauffeur details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-t border-white/10 pt-8">
              <div aria-hidden="true" className="font-display text-5xl leading-none text-brand-300 lining-nums select-none">
                03
              </div>
              <h3 className="tl-h3 mt-6 text-white">3. Enjoy Journey</h3>
              <p className="mt-3 text-base leading-relaxed text-stone-300">
                Our professionally dressed licensed chauffeur arrives on-time in a pristine vehicle to complete your nationwide transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IX. VERIFIED GOOGLE CLIENT REVIEWS */}
      <GoogleReviewsSection isRenax={true} />

      {/* 5. AIRPORT TRANSFER CARDS (the grid renders its own full-width section) */}
      <section className="border-t border-white/10 bg-brand-900">
        <div className="tl-container pt-20 pb-12 lg:pt-28 lg:pb-16">
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">Fixed Presets</span>
          <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">Popular Transfer Routes</h2>
        </div>
        <AirportsGrid onSelectTransfer={handleSelectTransferPreset} />
      </section>

      {/* HOMEPAGE FAQS */}
      <HomepageFaq
        faqs={settings?.homepage_faqs}
        title={settings?.homepage_faq_title}
        subtitle={settings?.homepage_faq_subtitle}
        badge={settings?.homepage_faq_badge}
        isRenax={true}
      />

      {/* 6. CONTACT SEGMENT */}
      <section id="contact" className="tl-section border-t border-white/10 bg-brand-900">
        <div className="tl-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">Get In Touch</span>
              <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">Contact Our Desk</h2>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-md text-stone-300">
                Have unique requirements or need a dedicated luxury chauffeur contract? Fill out our contact form below.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div data-reveal-group className="divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-start gap-5 py-6">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Call / WhatsApp</p>
                    <p className="mt-2 text-lg font-medium text-white">{formattedPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 py-6">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Email Address</p>
                    <p className="mt-2 text-lg font-medium break-words text-white">{emailAddr}</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 py-6">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Head Office</p>
                    <p className="mt-2 text-lg font-medium text-white">{officeAddr.split(",")[0]}</p>
                  </div>
                </div>
              </div>

              <div data-reveal className="mt-8">
                <form className="space-y-4">
                  <div>
                    <p className="text-sm text-stone-400">Please use the contact form details below to query custom routes.</p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
