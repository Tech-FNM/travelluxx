import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "../utils/routerCompat";
import { ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";
import { normalizeRichHtml } from "../utils/richText";

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

  // Presentational only: the CMS often sets the FAQ title to the same words as the label above it,
  // so the label is shown only when it says something different from the heading.
  const faqEyebrow = "Frequently Asked Questions";
  const faqTitle = serviceArea.faqTitle || `${serviceArea.title} Chauffeur & Transfers FAQ`;
  const showFaqEyebrow = faqEyebrow.trim().toLowerCase() !== String(faqTitle).trim().toLowerCase();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onScrollTo={() => {}} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-brand-950">
          {/* Decorative background photo under a flat dark overlay for legibility */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img
              src={serviceArea.heroImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85"}
              alt=""
              loading="eager"
              decoding="async"
              data-parallax
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-950/80" />
          </div>

          <div className="tl-container relative pt-32 pb-20 lg:pt-40 lg:pb-24">
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">
              {serviceArea.heroBadge || serviceArea.title}
            </span>
            <h1
              data-reveal="lines"
              className="tl-h1 mt-5 max-w-4xl text-4xl text-balance text-white sm:text-5xl lg:text-6xl"
            >
              {serviceArea.heroTitle || serviceArea.title}
            </h1>
            <p
              data-reveal
              data-reveal-delay="0.15"
              className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300"
            >
              {serviceArea.heroDescription}
            </p>
            <div data-reveal data-reveal-delay="0.3" className="mt-9 flex flex-wrap items-center gap-3">
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
        </section>

        {/* Content Body */}
        {serviceArea.content && (
          <section className="tl-section bg-white">
            <div className="tl-container">
              <div data-reveal className="ql-snow mx-auto max-w-3xl">
                <div
                  className="ql-editor page-rich-content service-area-content"
                  dangerouslySetInnerHTML={{ __html: normalizeRichHtml(serviceArea.content) }}
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {validFaqs.length > 0 && (
          <section className="tl-section bg-ivory">
            <div className="tl-container">
              <div className="mx-auto max-w-3xl">
                {showFaqEyebrow && (
                  <span data-reveal className="tl-eyebrow">{faqEyebrow}</span>
                )}
                <h2 data-reveal="lines" className={showFaqEyebrow ? "tl-h2 mt-4" : "tl-h2"}>
                  {faqTitle}
                </h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                  Got questions about traveling in or around {serviceArea.title}? Here are quick answers to the most common questions.
                </p>

                <div data-reveal-group className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
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
          </section>
        )}
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
