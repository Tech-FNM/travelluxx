import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "../utils/routerCompat";
import { ArrowLeft, ArrowRight, Phone, Plus, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";
import { normalizeRichHtml } from "../utils/richText";
import AreaCta from "../components/areas/AreaCta";
import OtherAreas from "../components/areas/OtherAreas";
import {
  areaArticleImage,
  areaHeroImage,
  areaPlaceName,
  heroFrameClass,
  phoneFromSettings,
} from "../components/areas/areaShared";

// Presentation copy: facts that hold for every area.
const HERO_FACTS = [
  { title: "Fixed fares", text: "Agreed when you book" },
  { title: "Licensed drivers", text: "Private hire chauffeurs" },
  { title: "Flight monitoring", text: "On airport pickups" },
  { title: "24/7 booking", text: "Online or by phone" },
];

const BOOKING_FACTS = [
  { label: "Fare", value: "Fixed when you book" },
  { label: "Vehicles", value: "Mercedes-Benz and Audi" },
  { label: "Airport pickups", value: "Flight monitored" },
  { label: "Payment", value: "Online or pay later" },
];

const DEFAULT_AREA_FAQS = [
  {
    question: "How do I book an airport transfer in this area?",
    answer:
      "You can book easily online using our instant Fare Calculator above. Enter your pickup address and desired airport, select your luxury vehicle, and receive instant confirmation.",
  },
  {
    question: "Do you monitor flights for airport pickups?",
    answer:
      "Yes, our team monitors all inbound commercial flights in real-time. Whether your flight is early or delayed, your chauffeur will be waiting inside arrivals with a name board.",
  },
  {
    question: "Are your prices fixed and all-inclusive?",
    answer:
      "Yes. All TravelLuxx fares are fixed upfront with zero hidden fees. Fuel, taxes, airport flight tracking, and standard waiting time are all included.",
  },
  {
    question: "Can I book a private chauffeur for business travel or private events?",
    answer:
      "Yes, we provide flexible one-way, return, and full-day as-directed chauffeur hire for corporate meetings, private events, weddings, and long-distance UK journeys.",
  },
];

interface ServiceAreaPageProps {
  initialArea?: any;
  initialSettings?: any;
}

export default function ServiceAreaPage({
  initialArea,
  initialSettings,
}: ServiceAreaPageProps = {}) {
  const { slug } = useParams<{ slug: string }>();
  const { settings: ctxSettings, isLoading } = useSettings();
  const settings = initialSettings || ctxSettings;
  const [serviceArea, setServiceArea] = useState<any>(initialArea || null);
  const [areaLoading, setAreaLoading] = useState(!initialArea);
  const [areaError, setAreaError] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (initialArea && (initialArea.slug === slug || initialArea.id === slug)) {
      setServiceArea(initialArea);
      setAreaLoading(false);
      return;
    }

    let active = true;
    setAreaLoading(true);
    setAreaError("");
    fetch(`/api/service-areas/${encodeURIComponent(slug || "")}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Service area not found.");
        if (active) setServiceArea(data);
      })
      .catch(error => {
        if (active) {
          setServiceArea(null);
          setAreaError(error instanceof Error ? error.message : "Service area not found.");
        }
      })
      .finally(() => {
        if (active) setAreaLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, initialArea]);

  // The full list of areas, for the "Other areas we cover" gallery (this page only receives its own area).
  const [allAreas, setAllAreas] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    fetch("/api/service-areas")
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) setAllAreas(data);
      })
      .catch(err => console.error("Error loading service areas:", err));
    return () => {
      active = false;
    };
  }, []);

  // Compute schemas & SEO metadata
  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = serviceArea ? `${baseUrl}/service-areas/${serviceArea.slug}` : "";
  const title = serviceArea?.metaTitle || serviceArea?.ogTitle || (serviceArea ? `${serviceArea.heroTitle || serviceArea.title} | TravelLuxx` : "Service Area | TravelLuxx");
  const description = serviceArea?.metaDescription || serviceArea?.ogDescription || serviceArea?.heroDescription || "Private chauffeur travel and airport transfers tailored around your location and schedule.";
  const ogImage = serviceArea?.ogImage || serviceArea?.heroImage || "";
  const validFaqs = useMemo(() => {
    const list = (Array.isArray(serviceArea?.faqs) ? serviceArea.faqs : []).filter((f: any) => f && (f.question || f.answer));
    return list.length > 0 ? list : DEFAULT_AREA_FAQS;
  }, [serviceArea]);

  const pageSchemas = useMemo(() => {
    if (!serviceArea) return [];
    const list: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "TaxiService",
        "@id": `${pageUrl}#service`,
        "name": `TravelLuxx - ${serviceArea.title} Chauffeur & Airport Transfers`,
        "url": pageUrl,
        "areaServed": serviceArea.title,
        "description": description,
        "provider": {
          "@type": "LocalBusiness",
          "name": settings?.business_name || "TravelLuxx",
          "telephone": settings?.whatsapp_number ? `+${settings.whatsapp_number}` : "+441217140876",
          "url": baseUrl
        }
      }
    ];

    if (validFaqs.length > 0) {
      list.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": validFaqs.map((f: any) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    return list;
  }, [serviceArea, validFaqs, pageUrl, description, settings, baseUrl]);

  usePageSeo({
    title,
    description,
    canonicalUrl: pageUrl,
    ogTitle: serviceArea?.ogTitle || title,
    ogDescription: serviceArea?.ogDescription || description,
    ogImage,
    ogUrl: pageUrl,
    ogType: serviceArea?.ogType || "website",
    noIndex: Boolean(settings?.search_engine_visibility || serviceArea?.noIndexNoFollow),
    siteName: settings?.business_name || "TravelLuxx",
    schemas: pageSchemas,
    customSchemaJson: serviceArea?.customSchema || ""
  });

  if ((isLoading || areaLoading) && !serviceArea) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-300 border-t-transparent" />
      </div>
    );
  }

  if (!serviceArea) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar onScrollTo={() => {}} />
        <main className="flex flex-grow flex-col items-center justify-center px-5 py-32 text-center sm:px-8">
          <h1 className="tl-h2">Service area not found</h1>
          <p className="tl-lead mt-5 max-w-md">{areaError || "This area page is not available."}</p>
          <Link to="/service-areas" className="tl-btn tl-btn-primary mt-8">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <span>Back to service areas</span>
          </Link>
        </main>
        <Footer onScrollTo={() => {}} />
      </div>
    );
  }

  const phone = settings?.whatsapp_number || "441217140876";
  const phoneLabel = phone.startsWith("44") ? `+44 ${phone.slice(2, 6)} ${phone.slice(6)}` : phone;
  const contact = phoneFromSettings(settings);
  // "Chauffeur Coventry" -> "Coventry": the place itself, for the breadcrumb and the new sections.
  const place = areaPlaceName(serviceArea);
  const heroImage = areaHeroImage(serviceArea);

  // Presentational only: the CMS often sets the FAQ title to the same words as the label above it,
  // so the label is shown only when it says something different from the heading.
  const faqEyebrow = "Frequently Asked Questions";
  const faqTitle = serviceArea.faqTitle || `${serviceArea.title} Chauffeur & Transfers FAQ`;
  const showFaqEyebrow = faqEyebrow.trim().toLowerCase() !== String(faqTitle).trim().toLowerCase();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onScrollTo={() => {}} />

      <main className="flex-grow">
        {/* HERO: full-bleed photograph, copy bottom-left, facts along the fold */}
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
            <div className="absolute inset-0 bg-brand-950/40 lg:bg-brand-950/15" />
            <div className="absolute inset-0 bg-linear-to-t from-brand-950 via-brand-950/60 to-brand-950/20 lg:via-brand-950/25" />
            <div className="absolute inset-0 hidden bg-linear-to-r from-brand-950/90 via-brand-950/55 to-transparent lg:block" />
          </div>

          <div className="tl-container flex flex-col lg:min-h-[calc(100vh-5rem)]">
            <nav aria-label="Breadcrumb" data-reveal="fade" className="pt-5 lg:pt-8">
              <ol className="flex flex-wrap items-center gap-x-3 text-xs font-medium tracking-[0.18em] text-stone-300 uppercase">
                <li>
                  <Link to="/" className="inline-block py-3 transition-colors duration-200 hover:text-white">Home</Link>
                </li>
                <li aria-hidden="true" className="text-stone-400">/</li>
                <li>
                  <Link to="/service-areas" className="inline-block py-3 transition-colors duration-200 hover:text-white">Service areas</Link>
                </li>
                <li aria-hidden="true" className="text-stone-400">/</li>
                <li aria-current="page" className="py-3 text-white">{place}</li>
              </ol>
            </nav>

            <div className="mt-auto pt-14 pb-10 lg:pt-24 lg:pb-14">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">
                {serviceArea.heroBadge || serviceArea.title}
              </span>
              <h1
                data-reveal="lines"
                className="tl-h1 mt-6 max-w-4xl text-[2.6rem] text-balance text-white sm:text-6xl lg:text-7xl"
              >
                {serviceArea.heroTitle || serviceArea.title}
              </h1>
              <p
                data-reveal
                data-reveal-delay="0.15"
                className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg"
              >
                {serviceArea.heroDescription}
              </p>
              <div data-reveal data-reveal-delay="0.3" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={serviceArea.heroButtonUrl || "/#calculator-section"}
                  className="tl-btn tl-btn-light"
                >
                  <span>{serviceArea.heroButtonText || "Plan your journey"}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
                <a
                  href={serviceArea.heroSecondaryButtonUrl || `tel:${phone}`}
                  className="tl-btn tl-btn-outline-light"
                >
                  {serviceArea.heroSecondaryButtonText || `Call ${phoneLabel}`}
                </a>
              </div>
            </div>

            {/* What every journey includes, under a hairline that draws itself */}
            <div data-reveal="rule" data-reveal-delay="0.4" className="h-px w-full bg-white/20" />
            <ul
              data-reveal="fade"
              data-reveal-delay="0.55"
              className="grid grid-cols-2 lg:grid-cols-4"
            >
              {HERO_FACTS.map(fact => (
                <li
                  key={fact.title}
                  className="py-5 pr-4 lg:border-l lg:border-white/15 lg:py-6 lg:pl-8 lg:first:border-l-0 lg:first:pl-0 [&:nth-child(n+3)]:border-t [&:nth-child(n+3)]:border-white/10 lg:[&:nth-child(n+3)]:border-t-0"
                >
                  <span className="block text-sm font-medium text-white">{fact.title}</span>
                  <span className="mt-1 block text-xs text-stone-400">{fact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BODY: the CMS article with a booking card that stays in view beside it */}
        <section className="tl-section bg-white">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
              {serviceArea.content && (
                <div className="min-w-0 lg:col-span-7">
                  <div data-reveal="image" className="aspect-[3/2] w-full overflow-hidden bg-stone-100 sm:aspect-[16/9]">
                    <img
                      src={areaArticleImage(serviceArea)}
                      alt={`TravelLuxx chauffeur service in ${place}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div data-reveal className="ql-snow mt-10 lg:mt-14">
                    <div
                      className="ql-editor page-rich-content service-area-content"
                      dangerouslySetInnerHTML={{ __html: normalizeRichHtml(serviceArea.content) }}
                    />
                  </div>
                </div>
              )}

              <aside className={serviceArea.content ? "lg:col-span-5 xl:col-span-4 xl:col-start-9" : "lg:col-span-5"}>
                {/* Sticky on desktop, so it carries no reveal attribute */}
                <div className="tl-dark p-7 sm:p-9 lg:sticky lg:top-28 lg:p-7 xl:p-9">
                  <span className="tl-eyebrow tl-eyebrow-light">Book in {place}</span>
                  <h2 className="mt-5 font-display text-3xl leading-[1.1] font-medium text-white">
                    A fixed fare for your {place} journey
                  </h2>
                  <dl className="mt-7 divide-y divide-white/10 border-y border-white/10">
                    {BOOKING_FACTS.map(fact => (
                      <div key={fact.label} className="flex items-baseline justify-between gap-6 py-3.5">
                        <dt className="text-sm text-stone-400">{fact.label}</dt>
                        <dd className="text-right text-sm font-medium text-white">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href="/#calculator-section" className="tl-btn tl-btn-light mt-8 w-full">
                    <span>Get a fixed quote</span>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  </a>
                  <a
                    href={contact.href}
                    className="mt-2 flex h-12 items-center justify-center gap-2 text-sm font-medium text-white underline-offset-4 transition-colors duration-200 hover:text-brand-300 hover:underline"
                  >
                    <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    <span>{contact.label}</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* STATEMENT */}
        <section className="tl-section bg-ivory">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-3">
                <span data-reveal className="tl-eyebrow">Every journey</span>
              </div>
              <div className="lg:col-span-9">
                <p data-reveal="words" className="tl-statement">
                  Wherever you are heading from {place}, a licensed chauffeur arrives in a Mercedes-Benz or Audi, and the fare is the one you agreed when you booked.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OTHER AREAS: rendered once the list has loaded */}
        <OtherAreas areas={allAreas} current={serviceArea} />

        {/* FAQs Section */}
        {validFaqs.length > 0 && (
          <section className="tl-section bg-ivory">
            <div className="tl-container">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  {showFaqEyebrow && (
                    <span data-reveal className="tl-eyebrow">{faqEyebrow}</span>
                  )}
                  <h2 data-reveal="lines" className={showFaqEyebrow ? "tl-h2 mt-4" : "tl-h2"}>
                    {faqTitle}
                  </h2>
                  <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-md">
                    Got questions about traveling in or around {serviceArea.title}? Here are quick answers to the most common questions.
                  </p>
                  <div data-reveal data-reveal-delay="0.2" className="mt-8">
                    <a href={contact.href} className="tl-link py-2">
                      <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      <span>Ask us on {contact.label}</span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-7">
                <div data-reveal-group className="divide-y divide-stone-200 border-y border-stone-200">
                  {validFaqs.map((faq: any, index: number) => {
                    const isOpen = openFaqIndex === index;
                    const questionId = `area-faq-q-${index}`;
                    const answerId = `area-faq-a-${index}`;
                    return (
                      <div key={faq.question || index}>
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
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <AreaCta settings={settings} place={place} />
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
