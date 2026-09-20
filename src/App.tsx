import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BookingCalculator from "./components/BookingCalculator";
import FleetCatalog from "./components/FleetCatalog";
import AirportsGrid from "./components/AirportsGrid";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import BlogList from "./pages/BlogList";
import BlogPostDetail from "./pages/BlogPostDetail";
import DynamicPage from "./pages/DynamicPage";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import RenaxLayout from "./components/RenaxLayout";
import { trackVisit, trackClick } from "./utils/analytics";



// PUBLIC LANDING PAGE WRAPPER
function PublicLandingPage() {
  // Shared state to allow prefilling the booking calculator
  const [calculatorPickup, setCalculatorPickup] = useState("");
  const [calculatorDropoff, setCalculatorDropoff] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [homepageContent, setHomepageContent] = useState<any>(null);

  useEffect(() => {
    trackVisit();
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  useEffect(() => {
    if (settings && settings.homepage_displays === "page" && settings.homepage_page_id) {
      fetch(`/api/pages/${settings.homepage_page_id}`)
        .then(res => res.json())
        .then(data => { if (!data.error) setHomepageContent(data); })
        .catch(err => console.error("Failed to load static homepage:", err));
    }
  }, [settings]);

  useEffect(() => {
    if (settings) {
      const baseUrl = "https://travelluxx.co.uk";
      const pageUrl = `${baseUrl}/`;

      // Helper to set/create meta tags
      const setMeta = (attr: string, attrVal: string, content: string) => {
        let el = document.querySelector(`meta[${attr}='${attrVal}']`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, attrVal);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      // Set Title and Description
      const homepageTitle = settings.homepage_meta_title || "Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx";
      const homepageDesc = settings.homepage_meta_description || "Book premium airport transfers and luxury chauffeur services across the UK with TravelLuxx. Reliable, comfortable and professional travel for every journey.";
      
      document.title = homepageTitle;
      setMeta("name", "description", homepageDesc);

      // Robots
      let robotsMeta = document.querySelector("meta[name='robots']");
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", settings.search_engine_visibility ? "noindex, nofollow" : "index, follow");

      // Canonical URL for Homepage
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", pageUrl);

      // Open Graph
      setMeta("property", "og:type", "website");
      setMeta("property", "og:url", pageUrl);
      setMeta("property", "og:title", homepageTitle);
      setMeta("property", "og:description", homepageDesc);
      setMeta("property", "og:site_name", settings.business_name || "TravelLuxx");
      if (settings.logo_image) {
        const logoUrl = settings.logo_image.startsWith("http") ? settings.logo_image : baseUrl + settings.logo_image;
        setMeta("property", "og:image", logoUrl);
      }

      // Twitter Card
      setMeta("property", "twitter:card", "summary_large_image");
      setMeta("property", "twitter:url", pageUrl);
      setMeta("property", "twitter:title", homepageTitle);
      setMeta("property", "twitter:description", homepageDesc);
      if (settings.logo_image) {
        const logoUrl = settings.logo_image.startsWith("http") ? settings.logo_image : baseUrl + settings.logo_image;
        setMeta("property", "twitter:image", logoUrl);
      }
    }
  }, [settings]);

  // Smooth scroll handler
  const handleScrollTo = (elementId: string) => {
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

  const handleUpdateSettings = (newSettings: any) => {
    setSettings(newSettings);
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#047857] text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Loading Travelluxx...</p>
      </div>
    );
  }

  // 1. STATIC HOMEPAGE VIEW
  if (settings.homepage_displays === "page") {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-emerald-600 selection:text-white font-sans">
        <Navbar
          onScrollTo={() => {}}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
        <main className="flex-grow max-w-4xl mx-auto px-6 py-28 w-full">
          {!homepageContent ? (
            <div className="text-center py-20 text-slate-400">Loading home...</div>
          ) : (
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{homepageContent.title}</h1>
              <div
                className="prose prose-slate max-w-none text-slate-700 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: homepageContent.content }}
              />
            </div>
          )}
        </main>
        <Footer
          onScrollTo={() => {}}
          settings={settings}
        />
      </div>
    );
  }

  // 2. RENAX LUXURY THEME VIEW
  if (settings.active_theme === "renax") {
    return (
      <div className="min-h-screen bg-[#0c0d12] text-slate-100 flex flex-col selection:bg-emerald-600 selection:text-white font-sans">
        <Navbar
          onScrollTo={handleScrollTo}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
        />
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
        <Footer
          onScrollTo={handleScrollTo}
          settings={settings}
        />
      </div>
    );
  }

  // 3. CLASSIC EMERALD THEME VIEW
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-emerald-600 selection:text-white font-sans">
      <Navbar
        onScrollTo={handleScrollTo}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

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

        <FleetCatalog onSelectClass={handleSelectClassPreset} settings={settings} />

        <AirportsGrid onSelectTransfer={handleSelectTransferPreset} settings={settings} />

        <ContactForm settings={settings} />

        <Footer
          onScrollTo={handleScrollTo}
          settings={settings}
        />
      </main>

      {/* Floating WhatsApp Widget */}
      <a
        href="https://wa.me/441217140876?text=Hi,%20I'm%20on%20your%20website%20and%20would%20like%20to%20arrange%20a%20chauffeur."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick("whatsapp_hotline")}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group border border-emerald-500/20 flex items-center justify-center"
        title="Instant WhatsApp Hotline"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
        <span className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-white border border-slate-200 text-emerald-700 text-[10px] font-sans font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 shadow-md transition duration-300 pointer-events-none whitespace-nowrap">
          WhatsApp Hotline
        </span>
      </a>
    </div>
  );
}

function normalizeSnippet(code: string | undefined): string {
  if (!code || typeof code !== "string") return "";
  const trimmed = code.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("<") || /<\w+/i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.includes("{") && trimmed.includes("}") && !trimmed.includes("function") && !trimmed.includes("var ") && !trimmed.includes("const ") && !trimmed.includes("let ")) {
    return `<style>\n${trimmed}\n</style>`;
  }
  return `<script>\n${trimmed}\n</script>`;
}

function injectCustomCode(htmlString: string | undefined, target: HTMLElement, identifierClass: string) {
  // Remove previously client-injected elements
  const existing = target.querySelectorAll(`.${identifierClass}`);
  existing.forEach(el => el.remove());

  const normalized = normalizeSnippet(htmlString);
  if (!normalized) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = normalized;

  Array.from(tempDiv.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Avoid duplicate tags if server-side HTML already rendered an identical element
      if (el.tagName === "META") {
        const name = el.getAttribute("name");
        const property = el.getAttribute("property");
        const content = el.getAttribute("content");
        if (name && document.querySelector(`meta[name="${name}"][content="${content}"]`)) return;
        if (property && document.querySelector(`meta[property="${property}"][content="${content}"]`)) return;
      }
      if (el.tagName === "SCRIPT" && el.getAttribute("src")) {
        const src = el.getAttribute("src");
        if (src && document.querySelector(`script[src="${src}"]`)) return;
      }

      let newEl: HTMLElement;
      if (el.tagName === "SCRIPT") {
        newEl = document.createElement("script");
        Array.from(el.attributes).forEach(attr => {
          newEl.setAttribute(attr.name, attr.value);
        });
        const codeText = el.textContent || el.innerText || (el as any).text || "";
        if (codeText.trim()) {
          newEl.textContent = codeText;
        }
      } else {
        newEl = el.cloneNode(true) as HTMLElement;
      }
      newEl.classList.add(identifierClass);
      target.appendChild(newEl);
    }
  });
}

// MAIN APP ROUTER ENTRY POINT
export default function App() {
  useEffect(() => {
    const applySettings = (data: any) => {
      if (!data) return;
      // Dynamic Favicon Injection
      if (data.favicon_url) {
        let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!faviconLink) {
          faviconLink = document.createElement("link");
          faviconLink.rel = "icon";
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = data.favicon_url;
      }

      injectCustomCode(data.custom_header_code, document.head, "custom-header-snippet");
      injectCustomCode(data.custom_footer_code, document.body, "custom-footer-snippet");
    };

    fetch("/api/settings")
      .then(res => res.json())
      .then(applySettings)
      .catch(err => console.error("Failed to load settings in App:", err));

    const handleSettingsUpdated = (e: any) => {
      if (e.detail) {
        applySettings(e.detail);
      }
    };
    window.addEventListener("settingsUpdated", handleSettingsUpdated);
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdated);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* PUBLIC HOMEPAGE */}
        <Route path="/" element={<PublicLandingPage />} />
        
        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:tab" element={<AdminDashboard />} />
        <Route path="/admin/:tab/:subtab" element={<AdminDashboard />} />
        <Route path="/admin/:tab/:subtab/:id" element={<AdminDashboard />} />

        {/* BLOG PAGES */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPostDetail />} />

        {/* SERVICES PAGES */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />

        {/* DYNAMIC CMS PAGES */}
        <Route path="/:slug" element={<DynamicPage />} />

        {/* FALLBACK REDIRECTS TO PUBLIC WEBSITE */}
        {/* Managed dynamically by path matching, we keep this fallback or let dynamic page handle it */}

      </Routes>
    </Router>
  );
}

