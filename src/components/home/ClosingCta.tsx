import React from "react";
import { formatUkPhone, phoneHref } from "../../utils/phone";
import { ArrowRight, Phone } from "lucide-react";
import { useContent } from "../../content/useContent";

interface ClosingCtaProps {
  onScrollToCalculator: () => void;
  settings?: any;
}

/** Last band before the footer: one large line and the two ways to book. */
export default function ClosingCta({ onScrollToCalculator, settings }: ClosingCtaProps) {
  const c = useContent(settings);
  if (!c.on("home_cta_enabled")) return null;

  const whatsappNum = String(c.settings?.whatsapp_number || "441217140876");
  const formattedPhone = formatUkPhone(whatsappNum);
  // Own fields first; when empty, the same phone label and link as the hero.
  const phoneText = c.t("home_cta_phone_text") || c.settings?.homepage_hero_phone_text || formattedPhone;
  const phoneLink = c.t("home_cta_phone_link") || c.settings?.homepage_hero_phone_link || phoneHref(whatsappNum);

  // "#calculator-section" (the default) keeps the smooth scroll to the quote form; any other link navigates.
  const buttonLink = c.t("home_cta_button_link").trim();
  const scrollsToCalculator = !buttonLink || buttonLink === "#calculator-section";
  const buttonInner = (
    <>
      <span>{c.t("home_cta_button_text")}</span>
      <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
    </>
  );

  return (
    // One step lighter than the footer below it, with a hairline between the two.
    <section className="tl-dark border-b border-white/10 bg-brand-900 py-24 lg:py-36">
      <div className="tl-container">
        <span data-reveal className="tl-eyebrow tl-eyebrow-light">{c.t("home_cta_eyebrow")}</span>

        <h2
          data-reveal="lines"
          className="mt-8 font-display text-5xl leading-none font-medium tracking-[-0.01em] text-white sm:text-7xl lg:text-8xl xl:text-9xl"
        >
          {c.t("home_cta_title_line1")}{" "}
          <span className="block text-brand-200 italic">{c.t("home_cta_title_line2")}</span>
        </h2>

        <div data-reveal="rule" className="mt-12 h-px w-full bg-white/20 lg:mt-20"></div>

        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <p data-reveal className="max-w-md text-base leading-relaxed text-stone-300 sm:text-lg">
            {c.t("home_cta_text")}
          </p>

          <div data-reveal data-reveal-delay="0.1" className="flex shrink-0 flex-col gap-3 sm:flex-row sm:gap-4">
            {scrollsToCalculator ? (
              <button type="button" onClick={onScrollToCalculator} className="tl-btn tl-btn-light w-full sm:w-auto">
                {buttonInner}
              </button>
            ) : (
              <a href={buttonLink} className="tl-btn tl-btn-light w-full sm:w-auto">
                {buttonInner}
              </a>
            )}
            <a href={phoneLink} className="tl-btn tl-btn-outline-light w-full sm:w-auto">
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              <span>{phoneText}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
