import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";

export default function ServiceAreaPage() {
  const { slug } = useParams<{ slug: string }>();
  const { settings, isLoading } = useSettings();
  const [serviceArea, setServiceArea] = useState<any>(null);
  const [areaLoading, setAreaLoading] = useState(true);
  const [areaError, setAreaError] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

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
  }, [slug]);

  useEffect(() => {
    if (!serviceArea) return;
    const baseUrl = "https://travelluxx.co.uk";
    const pageUrl = `${baseUrl}/service-areas/${serviceArea.slug}`;
    const title = serviceArea.metaTitle || `${serviceArea.heroTitle || serviceArea.title} | TravelLuxx`;
    const description = serviceArea.metaDescription || serviceArea.heroDescription || "";

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", settings?.search_engine_visibility || serviceArea.noIndexNoFollow ? "noindex, nofollow" : "index, follow");
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:url"]', "content", pageUrl);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:site_name"]', "content", settings?.business_name || "TravelLuxx");
    if (serviceArea.heroImage) setMeta('meta[property="og:image"]', "content", serviceArea.heroImage);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    return () => {
      document.title = settings?.homepage_meta_title || "TravelLuxx";
    };
  }, [serviceArea, settings]);

  if (isLoading || areaLoading) {
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

        <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-lg bg-slate-100 p-6 sm:p-8 lg:p-10">
            <div
              className="service-area-content max-w-5xl text-sm leading-7 text-slate-700 sm:text-base"
              dangerouslySetInnerHTML={{ __html: serviceArea.content || "" }}
            />
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              Frequently asked questions
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              {serviceArea.faqTitle || `${serviceArea.title} chauffeur services`}
            </h2>
          </div>
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {(Array.isArray(serviceArea.faqs) ? serviceArea.faqs : []).filter((faq: any) => faq.question || faq.answer).map((faq: any, index: number) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-emerald-700 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && <p className="mt-3 pr-8 text-sm leading-6 text-slate-600">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
