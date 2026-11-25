import React, { useEffect, useState } from "react";
import { Link } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { ArrowDown, ArrowRight, Phone, Plus, Minus } from "lucide-react";
import AreaCta from "../components/areas/AreaCta";
import {
  AREA_IMG,
  areaListImage,
  areaPlaceName,
  bareSlug,
  dedupeAreas,
  hasOwnImage,
  heroFrameClass,
  phoneFromSettings,
  twoDigits,
} from "../components/areas/areaShared";

type ServiceArea = {
  id: string;
  title: string;
  slug: string;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  imageAlt?: string;
  heroButtonText?: string;
  heroButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonUrl?: string;
  content?: string;
  faqTitle?: string;
  faqs?: { question: string; answer: string }[];
  published?: boolean;
};

const SERVICE_AREAS_FAQS = [
  {
    question: "Which areas and regions across the UK does TravelLuxx cover?",
    answer:
      "TravelLuxx provides executive chauffeur hire and airport transfers across Solihull, Birmingham, Coventry, Warwickshire, and connects passengers to all UK airports and major cities nationwide.",
  },
  {
    question: "Can I book a transfer starting or ending outside your listed service areas?",
    answer:
      "Yes, our private hire license covers nationwide pre-booked journeys. Whether you need an intercity transfer to London, Manchester, or Southampton cruise ports, we provide door-to-door service.",
  },
  {
    question: "Are your fares fixed regardless of the service area?",
    answer:
      "Yes, every journey is calculated on a 100% fixed-rate basis at the time of booking. There are no surprise meter charges, surge pricing, or hidden fees.",
  },
  {
    question: "How do I book an executive transfer in my area?",
    answer:
      "You can book instantly online using our instant Fare Calculator, or get in touch with our 24/7 team via WhatsApp or phone for bespoke itineraries and multi-stop journeys.",
  },
];

// What stays the same wherever the journey starts (presentation copy, facts from the site).
const COVERAGE_POINTS = [
  {
    title: "Fixed fares",
    text: "Your fare is agreed when you book. No surge pricing and no meter running.",
  },
  {
    title: "Licensed drivers",
    text: "Every journey is driven by a licensed private hire chauffeur in a Mercedes-Benz or Audi.",
  },
  {
    title: "Flight monitoring",
    text: "On airport pickups we follow your flight, so an early or late arrival is allowed for.",
  },
  {
    title: "24/7 booking",
    text: "Book online at any hour, then pay online or pay later.",
  },
];

const AIRPORTS = [
  { name: "Birmingham", code: "BHX" },
  { name: "Heathrow", code: "LHR" },
  { name: "Gatwick", code: "LGW" },
  { name: "Luton", code: "LTN" },
  { name: "Stansted", code: "STN" },
  { name: "London City", code: "LCY" },
];

interface ServiceAreasProps {
  initialAreas?: ServiceArea[];
  initialPageSettings?: any;
  initialSettings?: any;
}

export default function ServiceAreas({
  initialAreas,
  initialPageSettings,
  initialSettings,
}: ServiceAreasProps = {}) {
  const { settings: ctxSettings } = useSettings();
  const settings = initialSettings || ctxSettings;
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas || []);
  const [loading, setLoading] = useState(!initialAreas || initialAreas.length === 0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [pageSettings, setPageSettings] = useState<any>(initialPageSettings || {
    hero_enabled: true,
    hero_tag: "SERVICE AREAS",
    hero_title: "Explore TravelLuxx Service Areas Across the UK",
    hero_description:
      "Private chauffeur travel, airport transfers, and executive door-to-door transportation tailored around your location and schedule.",
    hero_button_text: "Plan Your Journey",
    hero_button_url: "/#calculator-section",
    hero_image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85",
    meta_title: "Service Areas | Executive Chauffeur & Airport Transfers | TravelLuxx",
    meta_description:
      "Discover all the areas TravelLuxx covers across the West Midlands, London, and nationwide. Book your private chauffeur and airport transfer."
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (initialAreas && initialAreas.length > 0) {
      setAreas(initialAreas);
      setLoading(false);
      return;
    }

    // Fetch Areas
    fetch("/api/service-areas")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAreas(data);
      })
      .catch(err => console.error("Error loading service areas:", err))
      .finally(() => setLoading(false));

    // Fetch Page Settings
    fetch("/api/service-areas-page-settings")
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === "object") {
          setPageSettings((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.error("Error loading service areas page settings:", err));
  }, [initialAreas]);

  // SEO Meta Tags
  useEffect(() => {
    const baseUrl = "https://travelluxx.co.uk";
    const pageUrl = `${baseUrl}/service-areas`;
    const metaTitle = pageSettings.meta_title || "Service Areas | TravelLuxx UK";
    const metaDesc = pageSettings.meta_description || pageSettings.hero_description;

    document.title = metaTitle;

    const setMeta = (attr: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attr}='${attrVal}']`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("name", "description", metaDesc);
    setMeta("property", "og:title", metaTitle);
    setMeta("property", "og:description", metaDesc);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:type", "website");

    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);
  }, [pageSettings]);

  // Presentation only: each area once (the API also returns an alias record for every area).
  const directory = dedupeAreas(areas);
  const phone = phoneFromSettings(settings);
  const heroImage = hasOwnImage(pageSettings.hero_image) ? pageSettings.hero_image : AREA_IMG.road;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />

      <main className="flex-grow">
        {/* HERO: full-bleed photograph, headline bottom-left, area names along the fold */}
        <section className="relative isolate overflow-hidden bg-brand-950">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className={heroFrameClass(heroImage)}>
              <img
                src={heroImage}
                alt=""
                loading="eager"
                decoding="async"
                data-parallax
                className="h-full w-full object-cover"
              />
            </div>
            {/* Legibility overlays: the copy sits bottom-left on the photograph */}
            <div className="absolute inset-0 bg-brand-950/30 lg:bg-brand-950/10" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950 via-brand-950/65 to-transparent lg:via-brand-950/20" />
            <div className="absolute inset-0 hidden bg-linear-to-r from-brand-950/85 via-brand-950/45 to-transparent lg:block" />
          </div>

          <div className="tl-container flex min-h-[calc(100svh-4.5rem)] flex-col lg:min-h-[calc(100vh-5rem)]">
            <div className="mt-auto pt-24 pb-10 lg:pt-32 lg:pb-14">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">{pageSettings.hero_tag || "SERVICE AREAS"}</span>

              <h1
                data-reveal="lines"
                className="tl-h1 mt-6 max-w-4xl text-[2.6rem] text-balance text-white sm:text-6xl lg:text-7xl"
              >
                {pageSettings.hero_title || "Our Service Areas"}
              </h1>

              {pageSettings.hero_description && (
                <p
                  data-reveal
                  data-reveal-delay="0.15"
                  className="mt-6 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg"
                >
                  {pageSettings.hero_description}
                </p>
              )}

              <div data-reveal data-reveal-delay="0.3" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a href={pageSettings.hero_button_url || "/#calculator-section"} className="tl-btn tl-btn-light">
                  <span>{pageSettings.hero_button_text || "Plan Your Journey"}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a href="#areas" className="tl-btn tl-btn-outline-light">
                  <span>Browse the areas</span>
                  <ArrowDown className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Area names as quiet jump links, under a hairline that draws itself */}
            {directory.length > 0 && (
              <div data-reveal="rule" data-reveal-delay="0.4" className="h-px w-full bg-white/20" />
            )}
            {directory.length > 0 && (
              <nav
                aria-label="Jump to an area"
                data-reveal="fade"
                data-reveal-delay="0.55"
                className="lg:flex lg:items-center lg:gap-12"
              >
                <span className="hidden shrink-0 text-xs font-medium tracking-[0.22em] text-stone-400 uppercase lg:block">
                  {directory.length} {directory.length === 1 ? "area" : "areas"}
                </span>
                <ul className="grid grid-cols-2 gap-x-6 py-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-10 lg:py-0">
                  {directory.map((area, index) => (
                    <li key={area.id || area.slug}>
                      <a
                        href={`#area-${bareSlug(area.slug)}`}
                        className="flex items-baseline gap-2.5 py-3 text-sm text-stone-300 transition-colors duration-200 hover:text-white lg:py-6"
                      >
                        <span className="font-display text-base leading-none text-brand-300 lining-nums" aria-hidden="true">
                          {twoDigits(index + 1)}
                        </span>
                        <span>{areaPlaceName(area)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>

        {/* DIRECTORY: one editorial row per area */}
        <section id="areas" className="scroll-mt-20 bg-white pt-20 pb-6 lg:pt-28 lg:pb-10">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-7">
                <span data-reveal className="tl-eyebrow">The directory</span>
                <h2 data-reveal="lines" className="tl-h2 mt-4 max-w-xl text-balance lg:text-6xl">
                  Chauffeur service, area by area
                </h2>
              </div>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead lg:col-span-5">
                Each area has its own guide to local journeys, airport transfers and the questions we are asked most often.
              </p>
            </div>

            <div data-reveal="rule" className="mt-12 h-px w-full bg-stone-300 lg:mt-16" />

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
              </div>
            ) : directory.length === 0 ? (
              <div data-reveal className="px-6 py-16 text-center sm:py-20">
                <h3 className="tl-h3">No service areas found</h3>
                <p className="mt-2 text-sm text-stone-600">Please check back soon or add areas from the admin dashboard.</p>
              </div>
            ) : (
              <ol>
                {directory.map((area, index) => {
                  const flip = index % 2 === 1;
                  return (
                    <li
                      key={area.id || area.slug}
                      id={`area-${bareSlug(area.slug)}`}
                      className="scroll-mt-20 border-b border-stone-200 last:border-b-0"
                    >
                      <Link
                        to={`/service-areas/${area.slug}`}
                        className="group grid grid-cols-1 gap-7 py-10 lg:grid-cols-12 lg:gap-12 lg:py-16 xl:gap-16"
                      >
                        {/* Photograph */}
                        <div
                          data-reveal="image"
                          className={`aspect-[3/2] w-full overflow-hidden bg-stone-100 lg:col-span-7 lg:aspect-[16/10] ${
                            flip ? "lg:order-2" : ""
                          }`}
                        >
                          <img
                            src={areaListImage(area, index)}
                            alt={area.imageAlt || `${area.title} - Executive Chauffeur Service Area`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>

                        {/* Number and label at the top, name and description at the foot */}
                        <div
                          data-reveal
                          data-reveal-delay="0.15"
                          className={`flex flex-col lg:col-span-5 ${flip ? "lg:order-1" : ""}`}
                        >
                          <div className="flex items-baseline justify-between gap-6">
                            <span className="tl-numeral" aria-hidden="true">{twoDigits(index + 1)}</span>
                            <span className="text-right text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                              {area.heroBadge || area.title}
                            </span>
                          </div>

                          <div className="mt-8 lg:mt-auto">
                            <h3 className="font-display text-4xl leading-[1.05] font-medium tracking-[-0.01em] text-stone-900 transition-colors duration-200 group-hover:text-brand-700 sm:text-5xl xl:text-6xl">
                              {areaPlaceName(area)}
                            </h3>
                            <p className="mt-4 line-clamp-3 max-w-md text-base leading-relaxed text-stone-600">
                              {area.heroDescription || `Private chauffeur travel and airport transfers covering all destinations in and around ${area.title}.`}
                            </p>
                            <span className="tl-link mt-7 group-hover:text-brand-900 group-hover:underline">
                              <span>View area</span>
                              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </section>

        {/* STATEMENT: journeys outside the listed areas */}
        <section className="tl-section bg-ivory">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-3">
                <span data-reveal className="tl-eyebrow">Not on the list</span>
              </div>
              <div className="lg:col-span-9">
                <p data-reveal="words" className="tl-statement">
                  Our private hire licence covers pre-booked journeys nationwide. If your town is not listed here, we can still plan your door-to-door transfer.
                </p>
                <a href="/#calculator-section" data-reveal className="tl-link mt-10 py-2">
                  <span>Price a journey from your address</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE COVER THE REGION */}
        <section className="tl-dark">
          <div className="tl-container tl-section">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
              <div className="lg:col-span-7">
                <span data-reveal className="tl-eyebrow tl-eyebrow-light">How we cover the region</span>
                <h2 data-reveal="lines" className="tl-h2 mt-4 max-w-xl text-balance text-white lg:text-6xl">
                  The same standard at every address
                </h2>
              </div>
              <p data-reveal data-reveal-delay="0.1" className="tl-lead text-stone-300 lg:col-span-5">
                Based in Shirley, Solihull, we drive across Birmingham and the Midlands, and on to airports and cities nationwide.
              </p>
            </div>

            <div data-reveal="rule" className="mt-12 h-px w-full bg-white/20 lg:mt-16" />

            <ol data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {COVERAGE_POINTS.map((point, index) => (
                <li
                  key={point.title}
                  className="border-b border-white/10 py-8 last:border-b-0 sm:pr-8 sm:[&:nth-last-child(2)]:border-b-0 lg:border-b-0 lg:border-l lg:px-8 lg:pt-10 lg:pb-2 lg:first:border-l-0 lg:first:pl-0"
                >
                  {/* Not tl-numeral: that class fixes the colour for light backgrounds */}
                  <span className="block font-display text-5xl leading-none font-medium text-brand-300 lining-nums sm:text-6xl" aria-hidden="true">
                    {twoDigits(index + 1)}
                  </span>
                  <h3 className="mt-6 text-lg leading-snug font-medium text-white">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300">{point.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Airports we drive to */}
          <div className="tl-marquee border-t border-white/10 py-8 sm:py-10">
            <div className="tl-marquee-track">
              {[0, 1].map(copy => (
                <ul key={copy} aria-hidden={copy === 1 ? "true" : undefined} className="flex shrink-0 items-center">
                  {AIRPORTS.map(airport => (
                    <li key={airport.code} className="flex items-center">
                      <span className="font-display text-4xl leading-none text-white sm:text-6xl">{airport.name}</span>
                      <span className="ml-3 self-start text-xs font-medium tracking-[0.22em] text-brand-300">{airport.code}</span>
                      <span className="mx-8 block h-px w-10 bg-white/25 sm:mx-12 sm:w-16" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas FAQs */}
        <section className="tl-section bg-white">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span data-reveal className="tl-eyebrow">Service Coverage FAQs</span>
                <h2 data-reveal="lines" className="tl-h2 mt-4">
                  Frequently Asked Questions
                </h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-md">
                  Common questions about our executive chauffeur coverage, airport transfers, and private hire service areas.
                </p>
                <div data-reveal data-reveal-delay="0.2" className="mt-8">
                  <a href={phone.href} className="tl-link py-2">
                    <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    <span>Ask us on {phone.label}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div data-reveal-group className="divide-y divide-stone-200 border-y border-stone-200">
                  {SERVICE_AREAS_FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    const questionId = `service-areas-faq-q-${index}`;
                    const answerId = `service-areas-faq-a-${index}`;
                    return (
                      <div key={faq.question}>
                        {/* The question is a plain <h3> (text only). The toggle lives on the row + icon button. */}
                        <div
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="flex cursor-pointer items-start justify-between gap-6 py-6"
                        >
                          <h3
                            id={questionId}
                            className="text-base leading-snug font-medium text-stone-900 sm:text-lg"
                          >
                            {faq.question}
                          </h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            aria-labelledby={questionId}
                            className="-my-2.5 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-stone-500 transition-colors duration-200 hover:text-stone-900"
                          >
                            {isOpen ? (
                              <Minus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                            ) : (
                              <Plus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <div
                          id={answerId}
                          role="region"
                          aria-labelledby={questionId}
                          className={`pr-10 pb-6 leading-relaxed text-stone-600 ${
                            isOpen ? "block" : "hidden"
                          }`}
                        >
                          <p className="whitespace-pre-line">{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <AreaCta settings={settings} />
      </main>

      <Footer onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />
    </div>
  );
}
