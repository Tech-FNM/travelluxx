import React, { useState, useEffect } from "react";
import { Phone, ArrowRight, ArrowDown } from "lucide-react";
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
  // A title written without "|" but with a spaced dash ("Private Hire Birmingham – Nationwide
  // Airport Transfers") breaks after the dash, so its second half still gets a line of its own.
  // The words and their order are untouched.
  const dashSplit = !titlePart2 ? titlePart1.match(/^(.+?\s[–—-])\s+(.+)$/) : null;
  const titleLine1 = dashSplit ? dashSplit[1] : titlePart1;
  const titleLine2 = dashSplit ? dashSplit[2] : titlePart2;

  const badgeText = settings?.homepage_hero_badge || `${brandName.toUpperCase()} PRIVATE HIRE`;
  const heroDesc = settings?.homepage_hero_subtitle || "Experience premium private hire. Beautifully styled Mercedes-Benz and Audi luxury fleets for your ultimate comfort. Secure fixed rates with absolutely no surge pricing.";
  const ind1 = settings?.homepage_indicator1 || "Licensed Professional Operators";
  const ind2 = settings?.homepage_indicator2 || "Guaranteed Nationwide Coverage";
  // The bar along the bottom of the hero: the two indicators from the dashboard between two fixed facts.
  const facts = ["No surge pricing", ind1, ind2, "Flight monitoring"];

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
    // Fills the first screen under the sticky navbar (73px on mobile, 81px on desktop).
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-73px)] flex-col overflow-hidden bg-brand-950 lg:min-h-[calc(100svh-81px)]"
    >

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
        {/* Legibility scrims. The headline sits on the dark tree line at the top and the copy on
            the road at the bottom, so the middle of the photograph (the car) stays clear. */}
        <div className="absolute inset-0 bg-brand-950/50 lg:bg-brand-950/10"></div>
        <div className="absolute inset-x-0 top-0 h-3/5 bg-linear-to-b from-brand-950/90 via-brand-950/45 to-transparent lg:h-1/2"></div>
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-brand-950 via-brand-950/70 to-transparent lg:h-[55%] lg:via-brand-950/65"></div>
      </div>

      {/* Headline: top of the frame */}
      <div className="tl-container relative z-10 flex flex-1 flex-col pt-10 sm:pt-14 lg:pt-16">
        <span data-reveal className="tl-eyebrow tl-eyebrow-light self-start">{badgeText}</span>

        <h1
          data-reveal="lines"
          className="tl-h1 mt-6 max-w-6xl text-white lg:leading-none min-[87.5rem]:text-8xl"
        >
          {titleLine1}{" "}
          {titleLine2 && (
            <span className="block italic text-brand-200">
              {titleLine2}
            </span>
          )}
        </h1>

        {/* Lead and actions: bottom of the frame, on one baseline */}
        <div className="mt-auto grid grid-cols-1 gap-7 pt-10 pb-7 sm:gap-8 sm:pt-16 sm:pb-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pt-24 lg:pb-10">
          <p
            data-reveal
            data-reveal-delay="0.15"
            className="max-w-xl text-base leading-relaxed text-stone-200 sm:text-lg lg:col-span-6"
          >
            {heroDesc}
          </p>

          <div
            data-reveal
            data-reveal-delay="0.3"
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 lg:col-span-6 lg:justify-end"
          >
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
        </div>
      </div>

      {/* Facts bar across the foot of the hero.
          The revealed wrapper reaches 14vh above the bar (transparent, click-through): scroll reveals
          fire when an element's top passes 88% of the screen, and the bar itself sits below that line
          when the hero fills the first screen, so on its own it would stay hidden until the first scroll.
          Below 1400px the right end is kept clear for the floating WhatsApp button.
          (The custom breakpoints are written in rem: Tailwind can only order them against sm/lg/xl,
          which are rem values, when the units match.) */}
      <div data-reveal data-reveal-delay="0.45" className="pointer-events-none relative z-10 -mt-[14vh] pt-[14vh]">
        <div className="pointer-events-auto border-t border-white/15">
          <div className="tl-container flex items-center justify-between gap-14 py-5 max-[87.4375rem]:pr-28 max-[39.9375rem]:pr-20 lg:py-6">
            <ul className="flex flex-1 flex-col gap-y-2.5 text-xs font-medium uppercase tracking-[0.12em] text-stone-300 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 sm:tracking-[0.16em] lg:grid-cols-4 min-[87.5rem]:flex min-[87.5rem]:flex-row min-[87.5rem]:flex-wrap min-[87.5rem]:justify-between">
              {facts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3 leading-5">
                  <span className="mt-2 h-1 w-1 shrink-0 bg-brand-300" aria-hidden="true"></span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={onScrollToCalculator}
              className="hidden h-11 shrink-0 cursor-pointer items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-stone-300 transition-colors duration-200 hover:text-white min-[87.5rem]:inline-flex"
            >
              <span>Scroll</span>
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}
