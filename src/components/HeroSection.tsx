import React, { useState, useEffect } from "react";
import { Phone, ArrowRight, ArrowDown } from "lucide-react";
import heroImg from "../assets/images/hero_background_1786403449488.jpg";
import { imageSrc, settingImage } from "../utils/customImages";
import { formatUkPhone, phoneHref } from "../utils/phone";
import { useContent } from "../content/useContent";

interface HeroSectionProps {
  onScrollToCalculator: () => void;
  settings?: any;
}

const FALLBACK_HERO_URL = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=80";

export default function HeroSection({ onScrollToCalculator, settings }: HeroSectionProps) {
  const brandName = settings?.business_name || settings?.businessName || "Travelluxx";
  const whatsappNum = settings?.whatsapp_number || "441217140876";

  // Background: the dashboard hero image, else the bundled photo. If a URL fails to load, fall back
  // to the bundled photo, then to a stock photo.
  const heroSetting = settings?.hero_image || settings?.heroImage;
  const configuredBg = settingImage(heroSetting, heroImg);
  const [failedBg, setFailedBg] = useState<string | null>(null);
  useEffect(() => setFailedBg(null), [configuredBg]);
  const bundledBg = imageSrc(heroImg);
  const bgImage = failedBg === null ? configuredBg : failedBg === configuredBg && configuredBg !== bundledBg ? bundledBg : FALLBACK_HERO_URL;

  // WhatsApp / phone number written the UK way (+44 121 714 0876)
  const formattedPhone = formatUkPhone(whatsappNum);

  const c = useContent(settings);
  // Fields whose fallback is built from other settings (brand name, phone number): an empty value keeps
  // that computed fallback; anything the admin typed is used as written.
  const textOr = (key: string, computed: string) => {
    const v = c.settings?.[key];
    return typeof v === "string" && v.trim() !== "" ? c.t(key) : computed;
  };

  const rawTitle = c.t("homepage_hero_title");
  const titleParts = rawTitle.split("|");
  const titlePart1 = titleParts[0]?.trim() || "Nationwide Airport";
  const titlePart2 = titleParts[1]?.trim();
  // A title written without "|" but with a spaced dash ("Private Hire Birmingham – Nationwide
  // Airport Transfers") breaks after the dash, so its second half still gets a line of its own.
  // The words and their order are untouched.
  const dashSplit = !titlePart2 ? titlePart1.match(/^(.+?\s[–—-])\s+(.+)$/) : null;
  const titleLine1 = dashSplit ? dashSplit[1] : titlePart1;
  const titleLine2 = dashSplit ? dashSplit[2] : titlePart2;

  const badgeText = textOr("homepage_hero_badge", `${brandName.toUpperCase()} PRIVATE HIRE`);
  const heroDesc = c.t("homepage_hero_subtitle");
  // The bar along the bottom of the hero: two facts with the two dashboard indicators between them.
  const showFacts = c.on("home_hero_facts_enabled");
  const facts = [c.t("home_hero_fact1"), c.t("homepage_indicator1"), c.t("homepage_indicator2"), c.t("home_hero_fact4")];

  const btn1Text = c.t("homepage_hero_btn_text");
  const btn1Link = c.t("homepage_hero_btn_link");
  const btn2Text = textOr("homepage_hero_phone_text", formattedPhone);
  const btn2Link = textOr("homepage_hero_phone_link", phoneHref(whatsappNum));

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
          alt={textOr("hero_image_alt", `${brandName} - Executive Luxury Chauffeur Service Solihull & London UK`)}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (bgImage !== FALLBACK_HERO_URL) setFailedBg(bgImage);
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
      {showFacts && (
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
              <span>{c.t("home_hero_scroll_text")}</span>
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      )}

    </section>
  );
}
