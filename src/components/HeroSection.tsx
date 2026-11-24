import React, { useState, useEffect } from "react";
import { Compass, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import heroImg from "../assets/images/hero_background_1786403449488.jpg";
import { getCustomImage } from "../utils/customImages";

interface HeroSectionProps {
  onScrollToCalculator: () => void;
  settings?: any;
}

const FALLBACK_HERO_URL = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80";

export default function HeroSection({ onScrollToCalculator, settings }: HeroSectionProps) {
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  const getInitialBg = () => {
    const customSetting = settings?.hero_image || settings?.heroImage;
    const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : heroImg;
    return getCustomImage("hero_bg", defaultImg);
  };

  const [bgImage, setBgImage] = useState<string>(getInitialBg);

  useEffect(() => {
    const handleUpdate = () => {
      const customSetting = settings?.hero_image || settings?.heroImage;
      const defaultImg = (customSetting && typeof customSetting === "string" && customSetting.trim() !== "") ? customSetting : heroImg;
      setBgImage(getCustomImage("hero_bg", defaultImg));
    };

    handleUpdate();
    window.addEventListener("custom_images_updated", handleUpdate);
    return () => window.removeEventListener("custom_images_updated", handleUpdate);
  }, [settings]);

  // Format WhatsApp / Phone number for presentation
  const formattedPhone = whatsappNum.startsWith("44")
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}`
    : whatsappNum;

  const rawTitle = settings?.homepage_hero_title || "Nationwide Airport | Transfers & Private Hire";
  const titleParts = rawTitle.split("|");
  const titlePart1 = titleParts[0]?.trim() || "Nationwide Airport";
  const titlePart2 = titleParts[1]?.trim();

  const badgeText = settings?.homepage_hero_badge || `${brandName.toUpperCase()} PRIVATE HIRE`;
  const heroDesc = settings?.homepage_hero_subtitle || "Experience premium private hire. Beautifully styled Mercedes-Benz and Audi luxury fleets for your ultimate comfort. Secure fixed rates with absolutely no surge pricing.";
  const ind1 = settings?.homepage_indicator1 || "Licensed Professional Operators";
  const ind2 = settings?.homepage_indicator2 || "Guaranteed Nationwide Coverage";

  const btn1Text = settings?.homepage_hero_btn_text || "Calculate & Get Quote";
  const btn1Link = settings?.homepage_hero_btn_link || "calculator-section";
  const btn2Text = settings?.homepage_hero_phone_text || formattedPhone;
  const btn2Link = settings?.homepage_hero_phone_link || `tel:${whatsappNum}`;

  const handleBtn1Click = () => {
    if (btn1Link === "calculator-section") {
      onScrollToCalculator();
    } else if (btn1Link.startsWith("#")) {
      const element = document.getElementById(btn1Link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.href = btn1Link;
    }
  };

  return (
    <section id="hero" className="relative flex min-h-[88vh] items-end overflow-hidden bg-brand-950">

      {/* Background image of luxury car cruising along scenic route */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
        <img
          src={bgImage}
          alt={settings?.hero_image_alt || `${brandName} - Executive Luxury Chauffeur Service Solihull & London UK`}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (bgImage !== heroImg) {
              setBgImage(heroImg);
            } else if (bgImage !== FALLBACK_HERO_URL) {
              setBgImage(FALLBACK_HERO_URL);
            }
          }}
          data-parallax
          className="h-full w-full object-cover"
        />
        {/* Legibility gradients: the copy sits bottom-left on the photograph */}
        <div className="absolute inset-0 bg-brand-950/45 lg:bg-brand-950/15"></div>
        <div className="absolute inset-0 bg-linear-to-t from-brand-950 via-brand-950/70 to-transparent lg:via-brand-950/50"></div>
        <div className="absolute inset-0 hidden bg-linear-to-r from-brand-950/80 via-brand-950/35 to-transparent lg:block"></div>
      </div>

      {/* Main Content (left-aligned, anchored to the bottom) */}
      <div className="tl-container relative z-10 pt-28 pb-14 sm:pb-16 lg:pb-20">
        <div className="max-w-4xl">

          {/* Eyebrow */}
          <span data-reveal className="tl-eyebrow tl-eyebrow-light">{badgeText}</span>

          {/* Heading */}
          <h1 data-reveal="lines" className="tl-h1 mt-6 text-pretty text-white">
            {titlePart1}{" "}
            {titlePart2 && (
              <span className="block italic text-brand-200">
                {titlePart2}
              </span>
            )}
          </h1>

          {/* Description */}
          <p data-reveal data-reveal-delay="0.15" className="mt-6 max-w-2xl text-base leading-relaxed text-stone-200 sm:text-lg">
            {heroDesc}
          </p>

          {/* CTA Buttons */}
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

          {/* Micro value tags */}
          <div data-reveal data-reveal-delay="0.45" className="mt-10 flex max-w-2xl flex-col gap-3 border-t border-white/15 pt-6 text-sm text-stone-300 sm:flex-row sm:gap-10">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <span>{ind1}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Compass className="h-4 w-4 shrink-0 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
              <span>{ind2}</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
