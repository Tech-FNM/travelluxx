import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Plane,
  Car,
  ChevronRight,
  ChevronDown
} from "lucide-react";

type ServiceArea = {
  id: string;
  title: string;
  slug: string;
  heroBadge?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroButtonText?: string;
  heroButtonUrl?: string;
  heroSecondaryButtonText?: string;
  heroSecondaryButtonUrl?: string;
  content?: string;
  faqTitle?: string;
  faqs?: { question: string; answer: string }[];
  published?: boolean;
};

export default function ServiceAreas() {
  const { settings } = useSettings();
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState<any>({
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

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
        if (data && !data.error) setPageSettings((prev: any) => ({ ...prev, ...data }));
      })
      .catch(err => console.error("Error loading service areas page settings:", err));
  }, []);

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

  const phone = settings?.whatsapp_number || "441217140876";
  const phoneLabel = phone.startsWith("44") ? `+44 ${phone.slice(2, 6)} ${phone.slice(6)}` : phone;

  const defaultFaqs = [
    {
      question: "Which areas do TravelLuxx chauffeur services cover?",
      answer: "We provide executive private travel across Solihull, Birmingham, the West Midlands, Warwickshire, London, and nationwide airport transfers to all major UK terminals."
    },
    {
      question: "Can I book long-distance transfers between cities and airports?",
      answer: "Yes, our door-to-door private hire service operates 24/7 across the UK with fixed pricing and no surge fees, including Heathrow, Gatwick, Manchester, and Birmingham Airport."
    },
    {
      question: "Do you monitor flights for airport pickups in these areas?",
      answer: "Every airport booking includes live flight tracking and 60 minutes complimentary waiting time after landing."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />

      <main className="flex-grow">
        {/* HERO SECTION */}
        {pageSettings.hero_enabled !== false && (
          <section className="relative min-h-[500px] lg:min-h-[560px] flex items-center bg-[#070b14] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-1000 opacity-35"
              style={{ backgroundImage: `url('${pageSettings.hero_image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent z-10" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{pageSettings.hero_tag || "SERVICE AREAS"}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
                  {pageSettings.hero_title}
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                  {pageSettings.hero_description}
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={pageSettings.hero_button_url || "/#calculator-section"}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition duration-200 shadow-lg shadow-emerald-500/20"
                  >
                    <span>{pageSettings.hero_button_text || "Plan Your Journey"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3.5 rounded-xl text-sm border border-white/20 transition duration-200"
                  >
                    <span>Call {phoneLabel}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SERVICE AREAS CATALOG GRID */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">
                Locations &amp; Regions
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                All Covered Service Areas
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Click on any area below to view local chauffeur transfer information, route details, and local FAQs.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              </div>
            ) : areas.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No service areas found</h3>
                <p className="text-xs text-slate-500 mt-1">Check back soon or contact us to arrange private travel to your destination.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {areas.map(area => (
                  <Link
                    key={area.id}
                    to={`/service-areas/${area.slug}`}
                    className="group flex flex-col bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Card Cover */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                      <img
                        src={area.heroImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"}
                        alt={area.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase">
                          <MapPin className="w-3 h-3" />
                          {area.heroBadge || area.title}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                          {area.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {area.heroDescription || "Private chauffeur travel and airport transfers covering all destinations in and around " + area.title + "."}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-600">
                        <span>View Area Chauffeur Services</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* TRUST FEATURES / WHY CHOOSE */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Licensed &amp; Insured Chauffeurs</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    DBS-checked drivers operating premium Mercedes-Benz and Audi vehicles for maximum passenger safety.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Fixed Rates &amp; No Surge</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Pre-booked fixed fares with zero hidden surcharges or peak pricing regardless of traffic delays.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Flight Tracking &amp; Wait Time</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Every airport journey features real-time flight monitoring and 60 minutes free waiting time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2">
                Questions &amp; Answers
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Frequently Asked Questions About Service Areas
              </h2>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {defaultFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 text-left font-semibold text-slate-900 text-sm sm:text-base"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-emerald-700 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && <p className="mt-3 pr-8 text-xs sm:text-sm leading-relaxed text-slate-600">{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />
    </div>
  );
}
