import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getServiceIcon } from "../utils/serviceIcons";
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

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<any>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [websiteSettings, setWebsiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    // Scroll to top on slug change
    window.scrollTo(0, 0);

    // Fetch service by slug
    setLoading(true);
    setNotFound(false);

    fetch(`/api/services/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!data || data.error) {
          setNotFound(true);
        } else {
          setService(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    // Fetch all services for sidebar
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllServices(data);
      })
      .catch(() => {});

    // Fetch page settings
    fetch("/api/services-page-settings")
      .then((res) => res.json())
      .then((data) => setPageSettings(data))
      .catch(() => {});

    // Fetch website global settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setWebsiteSettings(data))
      .catch(() => {});
  }, [slug]);

  // Dynamic SEO Meta Tags
  useEffect(() => {
    if (!service) return;

    const baseUrl = "https://travelluxx.co.uk";
    const pageUrl = `${baseUrl}/services/${service.slug}`;
    const metaTitle =
      service.metaTitle || `${service.title} | Luxury Chauffeur & Travel Services | TravelLuxx`;
    const metaDesc =
      service.metaDescription ||
      service.excerpt ||
      `Premium ${service.title} with TravelLuxx. Fixed rates, professional chauffeurs, and luxury vehicles across the UK.`;

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
    setMeta(
      "name",
      "robots",
      service.noIndexNoFollow ? "noindex, nofollow" : "index, follow"
    );

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
    if (service.image) {
      setMeta("property", "og:image", service.image);
    }

    setMeta("property", "twitter:card", "summary_large_image");
    setMeta("property", "twitter:url", pageUrl);
    setMeta("property", "twitter:title", metaTitle);
    setMeta("property", "twitter:description", metaDesc);
    if (service.image) {
      setMeta("property", "twitter:image", service.image);
    }
  }, [service]);

  if (loading) {
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
        <Navbar onScrollTo={() => {}} settings={websiteSettings} />
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
        <Footer onScrollTo={() => {}} settings={websiteSettings} />
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

  const whatsappNumber = websiteSettings?.whatsapp_number || "441217140876";
  const formattedPhone = websiteSettings?.whatsapp_number
    ? `+${websiteSettings.whatsapp_number}`
    : "+44 121 714 0876";

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar onScrollTo={() => {}} settings={websiteSettings} />

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
                <span>EXECUTIVE CHAUFFEUR SERVICE</span>
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
                  href="/#calculator"
                  className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello TravelLuxx, I would like to inquire about your ${service.title} service.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-full text-sm backdrop-blur-sm transition duration-300"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Inquiry</span>
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
              <div className="lg:col-span-8 space-y-10">
                {/* Featured Service Image */}
                {service.image && (
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 max-h-[460px] bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Key Highlights / Features Box */}
                {features.length > 0 && (
                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-600 mb-2">
                      KEY HIGHLIGHTS
                    </h3>
                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                      What Sets This Service Apart
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

                {/* Rich Text Body Content */}
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: service.content }} />
                  ) : (
                    <p className="text-slate-600 leading-relaxed">
                      {service.excerpt}
                    </p>
                  )}
                </div>

                {/* Trust & Guarantee Banner */}
                <div className="bg-gradient-to-br from-[#0c101d] to-[#161d31] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-[0.15em]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>THE TRAVELLUXX STANDARD</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Ready to Book Your {service.title}?
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                      Get an instant fixed fare in seconds with our online journey calculator.
                    </p>
                  </div>
                  <a
                    href="/#calculator"
                    className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm transition shadow-lg hover:scale-105 active:scale-95"
                  >
                    Instant Quote
                  </a>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                {/* Sticky Booking Card */}
                <div className="bg-[#0c101d] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 sticky top-24 space-y-6">
                  <div className="border-b border-white/10 pb-6">
                    <span className="text-emerald-400 text-[11px] font-extrabold uppercase tracking-[0.2em] block mb-1">
                      RESERVE YOUR RIDE
                    </span>
                    <h3 className="text-xl font-bold text-white">Book Online Instantly</h3>
                    {service.priceText && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-xs text-slate-400">Rates:</span>
                        <span className="text-2xl font-black text-emerald-400">
                          {service.priceText}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>24/7 Availability &amp; Instant Confirmation</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Fixed Price Guarantee — No Hidden Fees</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Licensed, DBS-Checked Executive Chauffeurs</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Car className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Immaculate Mercedes Fleet with Free Wi-Fi</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href="/#calculator"
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
                    >
                      <span>Calculate Fare &amp; Book</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <a
                      href={`tel:${formattedPhone}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl text-xs border border-white/10 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Call {formattedPhone}</span>
                    </a>
                  </div>

                  {/* Other Services Navigation List */}
                  {allServices.length > 0 && (
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
        {/* 3. WHY CHOOSE TRAVELLUXX (SHARED LUXURY SECTION)          */}
        {/* ========================================================= */}
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
                WHY CHOOSE TRAVELLUXX
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Your Trusted Travel Partner
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We go the extra mile to ensure every journey is comfortable, safe and hassle-free.
              </p>
            </div>

            {/* 6 Features in 3x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {[
                {
                  icon: UserCheck,
                  title: "Professional & Experienced Drivers",
                  desc: "Skilled, courteous and fully licensed.",
                },
                {
                  icon: Car,
                  title: "Comfortable Vehicles",
                  desc: "Modern, clean and well-maintained fleet.",
                },
                {
                  icon: Tag,
                  title: "Fixed & Transparent Pricing",
                  desc: "No hidden charges, no surprises.",
                },
                {
                  icon: Clock,
                  title: "24/7 Booking Support",
                  desc: "We're always here to help you.",
                },
                {
                  icon: MapPin,
                  title: "Airport & Nationwide Coverage",
                  desc: "All major airports and locations across the UK.",
                },
                {
                  icon: ShieldCheck,
                  title: "Punctual & Reliable Service",
                  desc: "On time, every time.",
                },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
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
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. HOW IT WORKS                                           */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-24 bg-[#fafbfc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Simple Steps to Your Destination
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Booking your journey with TravelLuxx is quick and easy. Follow these simple steps and get on your way in no time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  num: "01",
                  icon: CalendarDays,
                  title: "Book Your Journey",
                  desc: "Enter your pickup, destination and journey details.",
                },
                {
                  num: "02",
                  icon: CheckCircle2,
                  title: "Get Your Confirmation",
                  desc: "Receive your booking confirmation with all journey details.",
                },
                {
                  num: "03",
                  icon: UserCheck,
                  title: "Meet Your Driver",
                  desc: "Your professional driver arrives at the agreed pickup location.",
                },
                {
                  num: "04",
                  icon: Car,
                  title: "Enjoy Your Journey",
                  desc: "Sit back, relax and travel comfortably to your destination.",
                },
              ].map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="relative flex flex-col items-center text-center space-y-3 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-md">
                      {step.num}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 transition-transform group-hover:scale-105">
                      <StepIcon className="w-6 h-6 text-slate-800" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 pt-1">
                      {step.title}
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                      {step.desc}
                    </p>
                    {idx < 3 && (
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
        {/* 5. SERVICE FAQs ACCORDION                                 */}
        {/* ========================================================= */}
        {((service?.faqs && service.faqs.length > 0) || (pageSettings?.faqs && pageSettings.faqs.length > 0)) && (
          <section className="py-20 lg:py-24 bg-white border-t border-slate-200/70">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-3 mb-14">
                <span className="text-emerald-600 text-xs font-extrabold uppercase tracking-[0.2em] block">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Questions About Our {service?.title || "Chauffeur Service"}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                  Find fast answers to common questions about booking, vehicle capacity, and airport meet & greet.
                </p>
              </div>

              <div className="space-y-3.5">
                {((service?.faqs && service.faqs.length > 0) ? service.faqs : pageSettings.faqs).map((faq: any, idx: number) => {
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

              {/* Concierge Box */}
              <div className="mt-14 rounded-2xl bg-[#0c101d] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="text-emerald-400 text-[11px] font-extrabold uppercase tracking-widest block">
                    NEED ASSISTANCE?
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Have additional questions about {service?.title || "this service"}?
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Speak directly with our concierge team or request an instant bespoke quotation.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="/#calculator"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-md hover:scale-105 transform"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer onScrollTo={() => {}} settings={websiteSettings} />
    </div>
  );
}
