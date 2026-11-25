import React from "react";
import { ArrowRight, Phone } from "lucide-react";

interface ClosingCtaProps {
  onScrollToCalculator: () => void;
  settings?: any;
}

/** Last band before the footer: one large line and the two ways to book. */
export default function ClosingCta({ onScrollToCalculator, settings }: ClosingCtaProps) {
  const whatsappNum = settings?.whatsapp_number || "441217140876";
  const formattedPhone = whatsappNum.startsWith("44")
    ? `+44 ${whatsappNum.substring(2, 6)} ${whatsappNum.substring(6)}`
    : whatsappNum;
  // Same phone label and link as the hero, so the dashboard fields drive both.
  const phoneText = settings?.homepage_hero_phone_text || formattedPhone;
  const phoneLink = settings?.homepage_hero_phone_link || `tel:${whatsappNum}`;

  return (
    // One step lighter than the footer below it, with a hairline between the two.
    <section className="tl-dark border-b border-white/10 bg-brand-900 py-24 lg:py-36">
      <div className="tl-container">
        <span data-reveal className="tl-eyebrow tl-eyebrow-light">Book your chauffeur</span>

        <h2
          data-reveal="lines"
          className="mt-8 font-display text-5xl leading-none font-medium tracking-[-0.01em] text-white sm:text-7xl lg:text-8xl xl:text-9xl"
        >
          Know your fare{" "}
          <span className="block text-brand-200 italic">before you travel.</span>
        </h2>

        <div data-reveal="rule" className="mt-12 h-px w-full bg-white/20 lg:mt-20"></div>

        <div className="flex flex-col gap-8 pt-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <p data-reveal className="max-w-md text-base leading-relaxed text-stone-300 sm:text-lg">
            An instant fixed quote with no surge pricing. Pay online or pay later. Booking is open 24/7.
          </p>

          <div data-reveal data-reveal-delay="0.1" className="flex shrink-0 flex-col gap-3 sm:flex-row sm:gap-4">
            <button type="button" onClick={onScrollToCalculator} className="tl-btn tl-btn-light w-full sm:w-auto">
              <span>Get a fixed quote</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
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
