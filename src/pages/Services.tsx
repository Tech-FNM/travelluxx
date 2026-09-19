import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getServiceIcon } from "../utils/serviceIcons";
import {
  Plane,
  Car,
  Route,
  Briefcase,
  Users,
  Crown,
  UserCheck,
  Tag,
  Clock,
  MapPin,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

// Default fallback services if API not yet populated
const DEFAULT_SERVICES = [
  {
    id: "service-airport-transfers",
    title: "Airport Transfers",
    slug: "airport-transfers",
    excerpt:
      "Reliable airport transportation with punctual pickup and drop-off services to major airports across the UK.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    icon: "Plane",
  },
  {
    id: "service-private-transfers",
    title: "Private Transfers",
    slug: "private-transfers",
    excerpt:
      "Comfortable door-to-door transportation for individuals, couples, families and groups.",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    icon: "Car",
  },
  {
    id: "service-long-distance-travel",
    title: "Long Distance Travel",
    slug: "long-distance-travel",
    excerpt:
      "Travel anywhere across the UK with a comfortable and professional private transfer service.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    icon: "Route",
  },
  {
    id: "service-business-travel",
    title: "Business Travel",
    slug: "business-travel",
    excerpt:
      "Professional transportation for meetings, corporate events, business trips and executive travel.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    icon: "Briefcase",
  },
  {
    id: "service-family-transfers",
    title: "Family Transfers",
    slug: "family-transfers",
    excerpt:
      "Spacious and comfortable travel solutions designed for families and passengers travelling with extra luggage.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    icon: "Users",
  },
  {
    id: "service-luxury-travel",
    title: "Luxury Travel",
    slug: "luxury-travel",
    excerpt:
      "Travel in comfort and style with our premium vehicle options and professional service.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    icon: "Crown",
  },
];

const DEFAULT_FEATURES = [
  {
    icon: "UserCheck",
    title: "Professional & Experienced Drivers",
    description: "Skilled, courteous and fully licensed.",
  },
  {
    icon: "Car",
    title: "Comfortable Vehicles",
    description: "Modern, clean and well-maintained fleet.",
  },
  {
    icon: "Tag",
    title: "Fixed & Transparent Pricing",
    description: "No hidden charges, no surprises.",
  },
  {
    icon: "Clock",
    title: "24/7 Booking Support",
    description: "We're always here to help you.",
  },
  {
    icon: "MapPin",
    title: "Airport & Nationwide Coverage",
    description: "All major airports and locations across the UK.",
  },
  {
    icon: "ShieldCheck",
    title: "Punctual & Reliable Service",
    description: "On time, every time.",
  },
];

const DEFAULT_STEPS = [
  {
    number: "01",
    icon: "CalendarDays",
    title: "Book Your Journey",
    description: "Enter your pickup, destination and journey details.",
  },
  {
    number: "02",
    icon: "CheckCircle2",
    title: "Get Your Confirmation",
    description: "Receive your booking confirmation with all journey details.",
  },
  {
    number: "03",
    icon: "UserCheck",
    title: "Meet Your Driver",
    description: "Your professional driver arrives at the agreed pickup location.",
  },
  {
    number: "04",
    icon: "Car",
    title: "Enjoy Your Journey",
    description: "Sit back, relax and travel comfortably to your destination.",
  },
];

const DEFAULT_FAQS = [
  {
    question: "How far in advance should I book my chauffeur service?",
    answer:
      "We recommend booking at least 24 hours in advance to guarantee your preferred luxury vehicle and schedule. However, we also accommodate last-minute bookings subject to vehicle availability.",
  },
  {
    question: "What happens if my flight is delayed?",
    answer:
      "We actively track all flights in real-time. Your chauffeur will automatically adjust your pickup time according to your actual flight arrival, and our airport service includes complimentary 60 minutes waiting time from touchdown.",
  },
  {
    question: "Are your prices fixed and all-inclusive?",
    answer:
      "Yes. All our rates are 100% fixed and transparent with zero hidden fees. Fuel, taxes, standard wait time, and flight tracking are all included in your quote.",
  },
  {
    question: "What is your cancellation and amendment policy?",
    answer:
      "You can modify or cancel your booking free of charge up to 12 hours prior to your scheduled pickup time. Cancellations made within 12 hours may be subject to a cancellation fee.",
  },
  {
    question: "Can I request child seats or additional luggage capacity?",
    answer:
      "Absolutely. We offer infant, child, and booster safety seats upon request at no extra charge. For larger parties with excess luggage, our Mercedes V-Class luxury MPVs comfortably accommodate up to 7-8 passengers and 8 large suitcases.",
  },
  {
    question: "What vehicles are in the TravelLuxx fleet?",
    answer:
      "Our immaculate executive fleet consists of Mercedes-Benz E-Class, Mercedes-Benz S-Class luxury saloons, and Mercedes-Benz V-Class MPVs, all equipped with climate control, bottled water, and charging ports.",
  },
];

export default function Services() {
  const [settings, setSettings] = useState<any>(null);
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    // Global website settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to load settings:", err));

    // Dynamic services list
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Failed to load services:", err));

    // Services page settings
    fetch("/api/services-page-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === "object") {
          setPageSettings(data);
        }
      })
      .catch((err) => console.error("Failed to load services page settings:", err));
  }, []);

  // SEO Meta Tags & Document Title
  useEffect(() => {
    const baseUrl = "https://travelluxx.co.uk";
    const pageUrl = `${baseUrl}/services`;

    const metaTitle = "Premium Chauffeur & Airport Travel Services | TravelLuxx UK";
    const metaDesc =
      "Explore TravelLuxx's premier private travel solutions. From luxury airport transfers and executive business travel to long-distance journeys across the UK.";

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
    setMeta("name", "robots", "index, follow");

    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:title", metaTitle);
    setMeta("property", "og:description", metaDesc);
    setMeta("property", "og:site_name", "TravelLuxx");

    setMeta("property", "twitter:card", "summary_large_image");
    setMeta("property", "twitter:url", pageUrl);
    setMeta("property", "twitter:title", metaTitle);
    setMeta("property", "twitter:description", metaDesc);
  }, []);

  // Section contents from pageSettings or defaults
  const heroTag = pageSettings?.hero_tag || "OUR SERVICES";
  const heroTitle =
    pageSettings?.hero_title || "Premium, Reliable & Comfortable Travel Services";
  const heroDescription =
    pageSettings?.hero_description ||
    "From airport transfers to long-distance journeys, TravelLuxx provides professional private transportation tailored around your needs.";
  const heroButtonText = pageSettings?.hero_button_text || "Book Your Journey";
  const heroButtonUrl = pageSettings?.hero_button_url || "/#calculator";
  const heroImage =
    pageSettings?.hero_image ||
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=85";

  const catalogTag = pageSettings?.catalog_tag || "OUR SERVICES";
  const catalogTitle =
    pageSettings?.catalog_title || "Travel Solutions for Every Journey";
  const catalogDescription =
    pageSettings?.catalog_description ||
    "Whether it's a quick airport transfer or a long-distance trip, we offer a range of services designed to make your journey smooth, safe and stress-free.";

  const whyChooseTag = pageSettings?.why_choose_tag || "WHY CHOOSE TRAVELLUXX";
  const whyChooseTitle =
    pageSettings?.why_choose_title || "Your Trusted Travel Partner";
  const whyChooseDescription =
    pageSettings?.why_choose_description ||
    "We go the extra mile to ensure your journey is comfortable, safe and hassle-free.";
  const whyChooseBgImage =
    pageSettings?.why_choose_bg_image ||
    "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80";

  const whyChooseItems =
    Array.isArray(pageSettings?.why_choose_items) &&
    pageSettings.why_choose_items.length > 0
      ? pageSettings.why_choose_items
      : DEFAULT_FEATURES;

  const howItWorksTag = pageSettings?.how_it_works_tag || "HOW IT WORKS";
  const howItWorksTitle =
    pageSettings?.how_it_works_title || "Simple Steps to Your Destination";
  const howItWorksDescription =
    pageSettings?.how_it_works_description ||
    "Booking your journey with TravelLuxx is quick and easy. Follow these simple steps and get on your way in no time.";

  const howItWorksSteps =
    Array.isArray(pageSettings?.how_it_works_steps) &&
    pageSettings.how_it_works_steps.length > 0
      ? pageSettings.how_it_works_steps
      : DEFAULT_STEPS;

  const faqTag = pageSettings?.faq_tag || "FREQUENTLY ASKED QUESTIONS";
  const faqTitle = pageSettings?.faq_title || "Got Questions? We Have Answers";
  const faqDescription =
    pageSettings?.faq_description ||
    "Everything you need to know about our luxury chauffeur services, airport transfers, vehicle fleet, and booking policies.";
  const faqs =
    Array.isArray(pageSettings?.faqs) && pageSettings.faqs.length > 0
      ? pageSettings.faqs
      : DEFAULT_FAQS;

  // Add FAQ JSON-LD schema for rich SEO results
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    let script = document.getElementById("services-faq-schema") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "services-faq-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    });
  }, [faqs]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Global Navbar */}
      <Navbar onScrollTo={() => {}} settings={settings} />

      <main className="flex-grow">
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center bg-[#070b14] overflow-hidden">
          {/* Hero Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url('${heroImage}')`,
            }}
          >
            {/* Dark gradient to ensure high readability and match luxury mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-[#070b14]/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="max-w-2xl space-y-5">
              <span className="inline-block text-emerald-400 text-xs font-extrabold uppercase tracking-[0.2em]">
                {heroTag}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                {heroTitle}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {heroDescription}
              </p>

              <div className="pt-3">
                <a
                  href={heroButtonUrl}
                  className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{heroButtonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. TRAVEL SOLUTIONS FOR EVERY JOURNEY (DYNAMIC CARDS GRID)*/}
        {/* ========================================================= */}
        <section className="py-20 lg:py-24 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                {catalogTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {catalogTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {catalogDescription}
              </p>
            </div>

            {/* Dynamic Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc) => {
                const IconComponent = getServiceIcon(svc.icon);
                const detailUrl = `/services/${svc.slug}`;
                const desc = svc.excerpt || svc.description || "";

                return (
                  <div
                    key={svc.id || svc.slug}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    {/* Card Image Container */}
                    <Link to={detailUrl} className="relative h-52 w-full overflow-hidden bg-slate-100 block">
                      <img
                        src={
                          svc.image ||
                          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={svc.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Floating Dark Icon Badge overlapping image */}
                    <div className="px-6 -mt-6 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-[#0c1322] border-2 border-white shadow-md flex items-center justify-center text-white">
                        <IconComponent className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 pt-3 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <Link to={detailUrl} className="block">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {svc.title}
                          </h3>
                        </Link>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {desc}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                        <Link
                          to={detailUrl}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <a
                          href="/#calculator"
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. WHY CHOOSE TRAVELLUXX (DARK LUXURY SECTION)           */}
        {/* ========================================================= */}
        <section className="relative py-20 lg:py-24 bg-[#0c101d] text-white overflow-hidden">
          {/* Subtle Leather Interior Overlay on Right Side */}
          <div
            className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 bg-cover bg-right bg-no-repeat opacity-20 lg:opacity-40 pointer-events-none z-0"
            style={{
              backgroundImage: `url('${whyChooseBgImage}')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c101d] via-[#0c101d]/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3 mb-16">
              <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-[0.2em] block">
                {whyChooseTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {whyChooseTitle}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {whyChooseDescription}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {whyChooseItems.map((item: any, idx: number) => {
                const IconComponent = getServiceIcon(item.icon);
                return (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-300">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. HOW IT WORKS (SIMPLE STEPS TO YOUR DESTINATION)       */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-24 bg-[#fafbfc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                {howItWorksTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {howItWorksTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {howItWorksDescription}
              </p>
            </div>

            {/* Steps Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {howItWorksSteps.map((step: any, idx: number) => {
                const IconComp = getServiceIcon(step.icon);
                const isLast = idx === howItWorksSteps.length - 1;

                return (
                  <div
                    key={step.number || idx}
                    className="relative flex flex-col items-center text-center space-y-3 group"
                  >
                    {/* Number Badge */}
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md">
                      {step.number || `0${idx + 1}`}
                    </div>

                    {/* Circular Icon Holder */}
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 transition-transform group-hover:scale-105">
                      <IconComp className="w-6 h-6 text-slate-800" />
                    </div>

                    {/* Step Title & Copy */}
                    <h4 className="text-sm font-bold text-slate-900 pt-1">
                      {step.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                      {step.description}
                    </p>

                    {/* Connecting Chevron Arrow for Desktop */}
                    {!isLast && (
                      <div className="hidden lg:flex absolute top-10 -right-4 transform -translate-y-1/2 text-slate-300">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)            */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-24 bg-white border-t border-slate-200/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center space-y-3 mb-14">
              <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                {faqTag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {faqTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                {faqDescription}
              </p>
            </div>

            {/* Accordion Cards */}
            <div className="space-y-3.5">
              {faqs.map((faq: any, idx: number) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-emerald-500/60 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 transition-colors focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen ? "text-slate-950" : "text-slate-800"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "bg-emerald-500 text-slate-950 rotate-180 shadow-sm"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-emerald-500/15 text-slate-600 text-xs sm:text-sm leading-relaxed">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer onScrollTo={() => {}} settings={settings} />
    </div>
  );
}
