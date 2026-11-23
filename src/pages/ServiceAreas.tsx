import React, { useEffect, useState } from "react";
import { Link } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { MapPin, ChevronRight, ChevronDown, HelpCircle } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />

      <main className="flex-grow pt-28 sm:pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MAIN PAGE HEADING */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>{pageSettings.hero_tag || "SERVICE AREAS"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {pageSettings.hero_title || "Our Service Areas"}
            </h1>

            {pageSettings.hero_description && (
              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                {pageSettings.hero_description}
              </p>
            )}
          </div>

          {/* SERVICE AREA BOXES */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : areas.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/60 rounded-2xl border border-white/10 max-w-lg mx-auto">
              <MapPin className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No service areas found</h3>
              <p className="text-xs text-slate-400 mt-1">Please check back soon or add areas from the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {areas.map(area => (
                <Link
                  key={area.id}
                  to={`/service-areas/${area.slug}`}
                  className="group flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img
                      src={area.heroImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"}
                      alt={area.imageAlt || `${area.title} - Executive Chauffeur Service Area`}
                      loading="lazy"
                      decoding="async"
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

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                        {area.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                        {area.heroDescription || `Private chauffeur travel and airport transfers covering all destinations in and around ${area.title}.`}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                      <span>Explore Area</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        {/* Service Areas FAQs */}
        <section className="mt-20 pt-16 border-t border-white/10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Service Coverage FAQs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Common questions about our executive chauffeur coverage, airport transfers, and private hire service areas.
            </p>
          </div>

          <div className="space-y-3.5">
            {SERVICE_AREAS_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const questionId = `service-areas-faq-q-${index}`;
              const answerId = `service-areas-faq-a-${index}`;
              return (
                <div
                  key={faq.question}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-emerald-500/50 bg-[#12141c] shadow-lg shadow-emerald-500/5"
                      : "border-slate-800/80 bg-[#0d0e14] hover:border-slate-700"
                  }`}
                >
                  <h3 className="m-0 p-0 text-inherit font-inherit leading-none">
                    <button
                      type="button"
                      id={questionId}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className={`w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left font-semibold transition ${
                        isOpen ? "text-emerald-400" : "text-white hover:text-slate-200"
                      }`}
                    >
                      <span className="text-base sm:text-lg leading-snug">{faq.question}</span>
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-emerald-500 text-slate-950 rotate-180 shadow-sm"
                            : "bg-slate-800/80 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>
                  </h3>
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={`px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed border-t border-slate-800/60 text-slate-300 ${
                      isOpen ? "block" : "hidden"
                    }`}
                  >
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        </div>
      </main>

      <Footer onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />
    </div>
  );
}
