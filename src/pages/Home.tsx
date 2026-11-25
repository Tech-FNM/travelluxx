import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import BookingCalculator from "../components/BookingCalculator";
import FleetCatalog from "../components/FleetCatalog";
import AirportsGrid from "../components/AirportsGrid";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import RenaxLayout from "../components/RenaxLayout";
import HomepageFaq from "../components/HomepageFaq";
import GoogleReviewsSection from "../components/GoogleReviewsSection";
import PlacesMarquee from "../components/home/PlacesMarquee";
import ServiceStatement from "../components/home/ServiceStatement";
import HowItWorks from "../components/home/HowItWorks";
import ClosingCta from "../components/home/ClosingCta";
import { trackVisit, trackClick } from "../utils/analytics";
import { useSettings } from "../context/SettingsContext";
import { normalizeRichHtml } from "../utils/richText";
import { useContent } from "../content/useContent";

export default function Home({ initialSettings, initialPage }: { initialSettings?: any; initialPage?: any } = {}) {
  const [calculatorPickup, setCalculatorPickup] = useState("");
  const [calculatorDropoff, setCalculatorDropoff] = useState("");
  const { settings: ctxSettings, isLoading, updateSettingsLocally } = useSettings();
  const settings = initialSettings || ctxSettings;
  const [homepageContent, setHomepageContent] = useState<any>(initialPage || null);
  const c = useContent(settings);
  const whatsappDigits = c.t("home_whatsapp_number").replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(c.t("home_whatsapp_message"))}`;

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    // The server already rendered the chosen page; fetch only when it did not (e.g. older cache).
    if (settings && settings.homepage_displays === "page" && settings.homepage_page_id && !initialPage) {
      fetch(`/api/pages/${settings.homepage_page_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setHomepageContent(data);
        })
        .catch((err) => console.error("Failed to load static homepage:", err));
    }
  }, [settings, initialPage]);

  // Smooth scroll handler
  const handleScrollTo = (elementId: string) => {
    if (typeof document === "undefined") return;
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Prefill handler triggered when booking short-cuts are selected
  const handleSelectTransferPreset = (pickup: string, dropoff: string) => {
    setCalculatorPickup(pickup);
    setCalculatorDropoff(dropoff);
    handleScrollTo("calculator-section");
  };

  // Prefill class handler
  const handleSelectClassPreset = (carClass: "Economy" | "Luxury" | "Family") => {
    setCalculatorPickup("Shirley, Solihull B90");
    setCalculatorDropoff("London Heathrow Airport (LHR)");
    handleScrollTo("calculator-section");
  };

  // 1. STATIC HOMEPAGE VIEW
  if (settings.homepage_displays === "page") {
    return (
      <div className="flex min-h-screen flex-col bg-white text-stone-700">
        <Navbar onScrollTo={() => { }} />
        <main className="tl-container flex-grow py-16 lg:py-24">
          {!homepageContent ? (
            <div className="py-20 text-center text-stone-500">{c.t("home_static_loading_text")}</div>
          ) : (
            <div className="mx-auto max-w-3xl">
              <h1 className="tl-h1 mb-10 border-b border-stone-200 pb-8 text-4xl text-stone-900 sm:text-5xl">
                {homepageContent.title}
              </h1>
              <div className="ql-snow">
                <div
                  className="ql-editor page-rich-content text-base leading-relaxed text-stone-700"
                  dangerouslySetInnerHTML={{ __html: normalizeRichHtml(homepageContent.content) }}
                />
              </div>
            </div>
          )}
        </main>
        <Footer onScrollTo={() => { }} />
      </div>
    );
  }

  // 2. RENAX LUXURY THEME VIEW
  if (settings.active_theme === "renax") {
    return (
      <div className="flex min-h-screen flex-col bg-brand-950 text-stone-200">
        <Navbar onScrollTo={handleScrollTo} />
        <RenaxLayout
          settings={settings}
          calculatorPickup={calculatorPickup}
          calculatorDropoff={calculatorDropoff}
          setCalculatorPickup={setCalculatorPickup}
          setCalculatorDropoff={setCalculatorDropoff}
          handleScrollTo={handleScrollTo}
          handleSelectTransferPreset={handleSelectTransferPreset}
          handleSelectClassPreset={handleSelectClassPreset}
        />
        <Footer onScrollTo={handleScrollTo} />
      </div>
    );
  }

  // 3. DEFAULT THEME VIEW
  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-700">
      <Navbar onScrollTo={handleScrollTo} />

      <main className="flex-grow">
        <HeroSection
          onScrollToCalculator={() => handleScrollTo("calculator-section")}
          settings={settings}
        />

        <div id="calculator-section">
          <BookingCalculator
            initialPickup={calculatorPickup}
            initialDropoff={calculatorDropoff}
            settings={settings}
          />
        </div>

        {/* The story of the page. Backgrounds alternate so no two neighbours match:
            dark band, white, ivory, white, dark, (white), ivory, white, ivory, dark. */}
        <PlacesMarquee settings={settings} />

        <ServiceStatement settings={settings} />

        <FleetCatalog onSelectClass={handleSelectClassPreset} settings={settings} />

        {/* Renders two sections: the services gallery, then the airports band (#airports). */}
        <AirportsGrid onSelectTransfer={handleSelectTransferPreset} settings={settings} />

        {/* Only renders when there are reviews; it sits between a dark and an ivory section either way. */}
        <GoogleReviewsSection isRenax={false} />

        <HowItWorks onScrollToCalculator={() => handleScrollTo("calculator-section")} />

        <HomepageFaq
          faqs={settings?.homepage_faqs}
          title={settings?.homepage_faq_title}
          subtitle={settings?.homepage_faq_subtitle}
          badge={settings?.homepage_faq_badge}
          isRenax={false}
        />

        <ContactForm settings={settings} />

        <ClosingCta onScrollToCalculator={() => handleScrollTo("calculator-section")} settings={settings} />

        <Footer onScrollTo={handleScrollTo} />
      </main>

      {/* Floating WhatsApp Widget */}
      {c.on("home_whatsapp_enabled") && (
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick("whatsapp_hotline")}
        aria-label={c.t("home_whatsapp_aria_label")}
        className="group fixed right-5 bottom-5 z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-800 text-white shadow-md transition-colors duration-200 hover:bg-brand-700 sm:right-6 sm:bottom-6"
        title={c.t("home_whatsapp_title")}
      >
        <svg className="h-6 w-6 fill-current" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
        <span className="pointer-events-none invisible absolute inset-y-0 right-full my-auto mr-3 h-fit rounded-sm bg-stone-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white group-hover:visible group-focus-visible:visible">
          {c.t("home_whatsapp_tooltip")}
        </span>
      </a>
      )}
    </div>
  );
}

