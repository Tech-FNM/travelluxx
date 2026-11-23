import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "../utils/routerCompat";
import { ArrowRight, ChevronDown, MapPin, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!serviceArea) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar onScrollTo={() => {}} />
        <main className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Service area not found</h1>
          <p className="mt-3 text-slate-600">{areaError || "This area page is not available."}</p>
        </main>
        <Footer onScrollTo={() => {}} />
      </div>
    );
  }

  const phone = settings?.whatsapp_number || "441217140876";
  const phoneLabel = phone.startsWith("44") ? `+44 ${phone.slice(2, 6)} ${phone.slice(6)}` : phone;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar onScrollTo={() => {}} />

      <main>
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden bg-slate-950 text-white">
          <div
            className="absolute inset-0 -z-20 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${serviceArea.heroImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85"}')` }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/45" />

          <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24 lg:px-8 lg:py-36">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                <MapPin className="h-4 w-4" />
                {serviceArea.heroBadge || serviceArea.title}
              </div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {serviceArea.heroTitle || serviceArea.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                {serviceArea.heroDescription}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={serviceArea.heroButtonUrl || "/#calculator-section"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  {serviceArea.heroButtonText || "Plan your journey"} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={serviceArea.heroSecondaryButtonUrl || `tel:${phone}`}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {serviceArea.heroSecondaryButtonText || `Call ${phoneLabel}`}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        {serviceArea.content && (
          <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl rounded-lg bg-slate-100 p-6 sm:p-8 lg:p-10">
              <div className="ql-snow">
                <div
                  className="ql-editor page-rich-content service-area-content max-w-5xl text-sm leading-7 text-slate-700 sm:text-base !p-0"
                  dangerouslySetInnerHTML={{ __html: serviceArea.content || "" }}
                />
              </div>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {validFaqs.length > 0 && (
          <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {serviceArea.faqTitle || `${serviceArea.title} Chauffeur & Transfers FAQ`}
              </h2>
              <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto">
                Got questions about traveling in or around {serviceArea.title}? Here are quick answers to the most common questions.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {validFaqs.map((faq: any, index: number) => {
                const isOpen = openFaqIndex === index;
                const questionId = `area-faq-q-${index}`;
                const answerId = `area-faq-a-${index}`;
                return (
                  <div
                    key={faq.question || index}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <h3
                      id={questionId}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpenFaqIndex(isOpen ? null : index);
                        }
                      }}
                      className="cursor-pointer flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-slate-900 text-base sm:text-lg transition select-none"
                    >
                      {faq.question}
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
                    </h3>
                    <div
                      id={answerId}
                      role="region"
                      aria-labelledby={questionId}
                      className={`px-5 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-emerald-100/60 ${
                        isOpen ? "block" : "hidden"
                      }`}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
