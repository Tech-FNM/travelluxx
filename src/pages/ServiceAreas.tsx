import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { MapPin, ChevronRight } from "lucide-react";

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

        </div>
      </main>

      <Footer onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />
    </div>
  );
}
