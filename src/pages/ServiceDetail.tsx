import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getServiceIcon } from "../utils/serviceIcons";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";
import {
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  Car,
  ChevronRight,
  UserCheck,
  Star,
  MapPin,
  CalendarDays,
  Tag,
  ChevronDown
} from "lucide-react";

const DEFAULT_SERVICE_FAQS = [
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

interface ServiceDetailProps {
  initialService?: any;
  initialAllServices?: any[];
  initialPageSettings?: any;
  initialSettings?: any;
}

export default function ServiceDetail({
  initialService,
  initialAllServices,
  initialPageSettings,
  initialSettings
}: ServiceDetailProps = {}) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { settings: ctxSettings, services: ctxServices, servicesPageSettings: ctxPageSettings, isLoading: ctxLoading } = useSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const settings = initialSettings || ctxSettings;
  const allServices = (initialAllServices && initialAllServices.length > 0) ? initialAllServices : ctxServices;
  const pageSettings = initialPageSettings || ctxPageSettings;
  const service = initialService || allServices.find((s: any) => s.slug === slug || s.id === slug);
  const isLoading = !initialService && ctxLoading;
  const notFound = !isLoading && !service;

  useEffect(() => {
    // Scroll to top on slug change
    window.scrollTo(0, 0);
  }, [slug]);

  // Dynamic SEO Meta Tags, Open Graph & JSON-LD Schemas
  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = service ? `${baseUrl}/services/${service.slug}` : "";
  const metaTitle = service?.metaTitle || service?.ogTitle || (service ? `${service.title} | Luxury Chauffeur & Travel Services | TravelLuxx` : "Service | TravelLuxx");
  const metaDesc = service?.metaDescription || service?.ogDescription || service?.excerpt || (service ? `Premium ${service.title} with TravelLuxx. Fixed rates, professional chauffeurs, and luxury vehicles across the UK.` : "");
  const serviceFaqs = (Array.isArray(service?.faqs) && service.faqs.length > 0)
    ? service.faqs
    : (Array.isArray(pageSettings?.faqs) && pageSettings.faqs.length > 0)
    ? pageSettings.faqs
    : DEFAULT_SERVICE_FAQS;

  const serviceSchemas: any[] = [];
  if (service) {
    serviceSchemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      "name": service.title,
      "description": metaDesc,
      "provider": {
        "@type": "LocalBusiness",
        "name": settings?.business_name || "TravelLuxx",
        "url": baseUrl,
        "telephone": settings?.whatsapp_number ? `+${settings.whatsapp_number}` : "+441217140876"
      },
      "areaServed": "United Kingdom"
    });

    if (serviceFaqs.length > 0) {
      serviceSchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": serviceFaqs.filter((f: any) => f && (f.question || f.answer)).map((f: any) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }
  }

  usePageSeo({
    title: metaTitle,
    description: metaDesc,
    canonicalUrl: pageUrl,
    ogTitle: service?.ogTitle || metaTitle,
    ogDescription: service?.ogDescription || metaDesc,
    ogImage: service?.ogImage || service?.image || "",
    ogUrl: pageUrl,
    ogType: service?.ogType || "website",
    noIndex: Boolean(settings?.search_engine_visibility || service?.noIndexNoFollow),
    siteName: settings?.business_name || "TravelLuxx",
    schemas: serviceSchemas,
    customSchemaJson: service?.customSchema || ""
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-sm tracking-wide">Loading service details...</p>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col">
        <Navbar onScrollTo={() => {}} />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-24 text-center">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] mb-3 block">
            404 NOT FOUND
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Service Not Found</h1>
          <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base">
            The service you are looking for may have been moved, renamed, or is currently unavailable.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3 rounded-full text-sm transition"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer onScrollTo={() => {}} />
      </div>
    );
  }

  const IconComponent = getServiceIcon(service.icon);
  const heroBg =
    service.heroImage ||
    service.image ||
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=85";

  const features = Array.isArray(service.features) && service.features.length > 0
    ? service.features
    : [
        "Reliable & punctual service",
        "Professional licensed chauffeurs",
        "Immaculate luxury vehicles",
        "Fixed & transparent pricing",
        "24/7 dedicated support"
      ];

  const whatsappNumber = settings?.whatsapp_number || "441217140876";
  const formattedPhone = settings?.whatsapp_number
    ? `+${settings.whatsapp_number}`
    : "+44 121 714 0876";

  const defaultPerks = [
    "24/7 Availability & Instant Confirmation",
    "Fixed Price Guarantee — No Hidden Fees",
    "Licensed, DBS-Checked Executive Chauffeurs",
    "Immaculate Mercedes Fleet with Free Wi-Fi"
  ];
  const sidebarPerks = Array.isArray(service.sidebarPerks) && service.sidebarPerks.length > 0
    ? service.sidebarPerks
    : defaultPerks;

  const defaultWhyChoose = [
    {
      icon: "UserCheck",
      title: "Professional & Experienced Drivers",
      desc: "Skilled, courteous and fully licensed.",
    },
    {
      icon: "Car",
      title: "Comfortable Vehicles",
      desc: "Modern, clean and well-maintained fleet.",
    },
    {
      icon: "Tag",
      title: "Fixed & Transparent Pricing",
      desc: "No hidden charges, no surprises.",
    },
    {
      icon: "Clock",
      title: "24/7 Booking Support",
      desc: "We're always here to help you.",
    },
    {
      icon: "MapPin",
      title: "Airport & Nationwide Coverage",
      desc: "All major airports and locations across the UK.",
    },
    {
      icon: "ShieldCheck",
      title: "Punctual & Reliable Service",
      desc: "On time, every time.",
    },
  ];

  const whyChooseList = Array.isArray(service.whyChooseItems) && service.whyChooseItems.length > 0
    ? service.whyChooseItems
    : defaultWhyChoose;

  const defaultSteps = [
    {
      num: "01",
      icon: "CalendarDays",
      title: "Book Your Journey",
      desc: "Enter your pickup, destination and journey details.",
    },
    {
      num: "02",
      icon: "CheckCircle2",
      title: "Get Your Confirmation",
      desc: "Receive your booking confirmation with all journey details.",
    },
    {
      num: "03",
      icon: "UserCheck",
      title: "Meet Your Driver",
      desc: "Your professional driver arrives at the agreed pickup location.",
    },
    {
      num: "04",
      icon: "Car",
      title: "Enjoy Your Journey",
      desc: "Sit back, relax and travel comfortably to your destination.",
    },
  ];

  const stepsList = Array.isArray(service.howItWorksSteps) && service.howItWorksSteps.length > 0
    ? service.howItWorksSteps
    : defaultSteps;

  const faqsList = serviceFaqs;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar onScrollTo={() => {}} />

      <main className="flex-grow">
        {/* ========================================================= */}
        {/* 1. LUXURY HERO BANNER                                     */}
        {/* ========================================================= */}
        <section className="relative min-h-[440px] lg:min-h-[500px] flex items-center bg-[#070b14] overflow-hidden">
          {/* Background image with high luxury gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url('${heroBg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/85 to-[#070b14]/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-[#070b14]/60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <Link to="/services" className="hover:text-white transition">
                Services
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-emerald-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                {service.title}
              </span>
            </nav>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-emerald-400 text-xs font-extrabold uppercase tracking-[0.18em]">
                <IconComponent className="w-3.5 h-3.5 text-emerald-400" />
                <span>{service.heroBadge || "EXECUTIVE CHAUFFEUR SERVICE"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                {service.title}
              </h1>

              {service.excerpt && (
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-light">
                  {service.excerpt}
                </p>
              )}

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={service.heroBtn1Url || "/#calculator"}
                  className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{service.heroBtn1Text || "Book This Service"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={
                    service.heroBtn2Url ||
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello TravelLuxx, I would like to inquire about your ${service.title} service.`
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-full text-sm backdrop-blur-sm transition duration-300"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{service.heroBtn2Text || "WhatsApp Inquiry"}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. MAIN CONTENT & SIDEBAR SECTION                         */}
        {/* ========================================================= */}
        <section className="py-16 lg:py-24 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Main Column */}
              <div className="lg:col-span-8 space-y-10 min-w-0">
                {/* Featured Service Image */}
                {service.image && (
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 max-h-[460px] bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.imageAlt || `${service.title} - Executive Chauffeur Services UK`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Key Highlights / Features Box */}
                {service.highlightsEnabled !== false && features.length > 0 && (
                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                      {service.highlightsBadge || "KEY HIGHLIGHTS"}
                    </h3>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                      {service.highlightsTitle || "What Sets This Service Apart"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {features.map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-slate-700 text-sm font-medium leading-snug">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rich Text Body Content with Enhanced Hierarchy */}
                <div className="service-rich-content page-rich-content ql-snow break-words overflow-hidden w-full min-w-0">
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: service.content }} className="ql-editor w-full break-words !p-0" />
                  ) : (
                    <p className="text-slate-600 leading-relaxed break-words">
                      {service.excerpt}
                    </p>
                  )}
                </div>

                {/* Trust & Guarantee Banner */}
                {service.guaranteeEnabled !== false && (
                  <div className="bg-gradient-to-br from-[#0c101d] to-[#161d31] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-[0.15em]">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{service.guaranteeBadge || "THE TRAVELLUXX STANDARD"}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold">
                        {service.guaranteeTitle || `Ready to Book Your ${service.title}?`}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                        {service.guaranteeSubtitle || "Get an instant fixed fare in seconds with our online journey calculator."}
                      </p>
                    </div>
                    <a
                      href={service.guaranteeBtnUrl || "/#calculator"}
                      className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm transition shadow-lg hover:scale-105 active:scale-95"
                    >
                      {service.guaranteeBtnText || "Instant Quote"}
                    </a>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                {/* Sticky Booking Card */}
                <div className="bg-[#0c101d] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 sticky top-24 space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-emerald-400 text-[11px] font-extrabold uppercase tracking-[0.2em] block mb-1">
                      {service.sidebarBadge || "RESERVE YOUR RIDE"}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {service.sidebarTitle || "Book Online Instantly"}
                    </h3>
                    {service.priceText && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xs text-slate-400">Rates:</span>
                        <span className="text-2xl font-black text-emerald-400">
                          {service.priceText}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Perks */}
                  <div className="space-y-3 text-xs text-slate-300">
                    {sidebarPerks.map((perk: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={service.sidebarBtn1Url || "/#calculator"}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
                    >
                      <span>{service.sidebarBtn1Text || "Calculate Fare & Book"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <a
                      href={service.sidebarBtn2Url || `tel:${formattedPhone}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl text-xs border border-white/10 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{service.sidebarBtn2Text || `Call ${formattedPhone}`}</span>
                    </a>
                  </div>

                  {/* Other Services Navigation List */}
                  {service.showSidebarServices !== false && allServices.length > 0 && (
                    <div className="border-t border-white/10 pt-6 mt-6">
                      <h4 className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-400 mb-4">
                        ALL OUR SERVICES
                      </h4>
                      <div className="space-y-2">
                        {allServices.map((s) => {
                          const isCurrent = s.slug === service.slug;
                          const SvcIcon = getServiceIcon(s.icon);
                          return (
                            <Link
                              key={s.id}
                              to={`/services/${s.slug}`}
                              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition ${
                                isCurrent
                                  ? "bg-emerald-500 text-slate-950 font-bold"
                                  : "text-slate-300 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <SvcIcon className="w-4 h-4 shrink-0 opacity-80" />
                                <span className="truncate">{s.title}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. WHY CHOOSE SECTION                                     */}
        {/* ========================================================= */}
        {service.whyChooseEnabled !== false && (
          <section className="relative py-20 lg:py-24 bg-[#0c101d] text-white overflow-hidden">
            <div
              className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 bg-cover bg-right bg-no-repeat opacity-20 lg:opacity-40 pointer-events-none z-0"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c101d] via-[#0c101d]/60 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-3 mb-16">
                <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-[0.2em] block">
                  {service.whyChooseBadge || "WHY CHOOSE TRAVELLUXX"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {service.whyChooseTitle || "Your Trusted Travel Partner"}
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                  {service.whyChooseSubtitle || "We go the extra mile to ensure every journey is comfortable, safe and hassle-free."}
                </p>
              </div>

              {/* Grid of features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {whyChooseList.map((item: any, idx: number) => {
                  const ItemIcon = getServiceIcon(item.icon);
                  return (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-300">
                        <ItemIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {item.desc || item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4. HOW IT WORKS                                           */}
        {/* ========================================================= */}
        {service.howItWorksEnabled !== false && (
          <section className="py-20 lg:py-24 bg-[#fafbfc]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                  {service.howItWorksBadge || "HOW IT WORKS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {service.howItWorksTitle || "Simple Steps to Your Destination"}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {service.howItWorksSubtitle || "Booking your journey with TravelLuxx is quick and easy. Follow these simple steps and get on your way in no time."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {stepsList.map((step: any, idx: number) => {
                  const StepIcon = getServiceIcon(step.icon);
                  return (
                    <div
                      key={step.num || step.number || idx}
                      className="relative flex flex-col items-center text-center space-y-3 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md">
                        {step.num || step.number || `0${idx + 1}`}
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 transition-transform group-hover:scale-105">
                        <StepIcon className="w-6 h-6 text-slate-800" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 pt-1">
                        {step.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                        {step.desc || step.description}
                      </p>
                      {idx < stepsList.length - 1 && (
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
        )}

        {/* ========================================================= */}
        {/* 5. SERVICE FAQs ACCORDION                                 */}
        {/* ========================================================= */}
        {service.faqsEnabled !== false && faqsList.length > 0 && (
          <section className="py-20 lg:py-24 bg-white border-t border-slate-200/70">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 mb-14">
                <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                  {service.faqBadge || "FREQUENTLY ASKED QUESTIONS"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {service.faqTitle || `Questions About Our ${service?.title || "Chauffeur Service"}`}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  {service.faqSubtitle || "Find fast answers to common questions about booking, vehicle capacity, and airport meet & greet."}
                </p>
              </div>

              <div className="space-y-3.5">
                {faqsList.map((faq: any, idx: number) => {
                  const isOpen = openFaqIndex === idx;
                  const questionId = `service-detail-faq-q-${idx}`;
                  const answerId = `service-detail-faq-a-${idx}`;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "border-emerald-500/60 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <h3
                        id={questionId}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpenFaqIndex(isOpen ? null : idx);
                          }
                        }}
                        className={`cursor-pointer w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-sm sm:text-base font-bold transition-colors select-none ${
                          isOpen ? "text-slate-950" : "text-slate-800"
                        }`}
                      >
                        {faq.question}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen
                              ? "bg-emerald-500 text-slate-950 rotate-180 shadow-sm"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </h3>
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className={`px-5 sm:px-6 pb-5 pt-1 border-t border-emerald-500/15 text-slate-600 text-xs sm:text-sm leading-relaxed ${
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
          </section>
        )}
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}

