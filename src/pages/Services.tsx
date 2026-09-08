import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
} from "lucide-react";

export default function Services() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to load settings on Services page:", err));
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

  // Services Card Data
  const SERVICES_LIST = [
    {
      id: "airport-transfers",
      title: "Airport Transfers",
      description:
        "Reliable airport transportation with punctual pickup and drop-off services to major airports across the UK.",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      icon: Plane,
      link: "/#calculator",
    },
    {
      id: "private-transfers",
      title: "Private Transfers",
      description:
        "Comfortable door-to-door transportation for individuals, couples, families and groups.",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      icon: Car,
      link: "/#calculator",
    },
    {
      id: "long-distance-travel",
      title: "Long Distance Travel",
      description:
        "Travel anywhere across the UK with a comfortable and professional private transfer service.",
      image:
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
      icon: Route,
      link: "/#calculator",
    },
    {
      id: "business-travel",
      title: "Business Travel",
      description:
        "Professional transportation for meetings, corporate events, business trips and executive travel.",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      icon: Briefcase,
      link: "/#calculator",
    },
    {
      id: "family-transfers",
      title: "Family Transfers",
      description:
        "Spacious and comfortable travel solutions designed for families and passengers travelling with extra luggage.",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      icon: Users,
      link: "/#calculator",
    },
    {
      id: "luxury-travel",
      title: "Luxury Travel",
      description:
        "Travel in comfort and style with our premium vehicle options and professional service.",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      icon: Crown,
      link: "/#calculator",
    },
  ];

  // Why Choose Features Data
  const FEATURES = [
    {
      icon: UserCheck,
      title: "Professional & Experienced Drivers",
      description: "Skilled, courteous and fully licensed.",
    },
    {
      icon: Car,
      title: "Comfortable Vehicles",
      description: "Modern, clean and well-maintained fleet.",
    },
    {
      icon: Tag,
      title: "Fixed & Transparent Pricing",
      description: "No hidden charges, no surprises.",
    },
    {
      icon: Clock,
      title: "24/7 Booking Support",
      description: "We're always here to help you.",
    },
    {
      icon: MapPin,
      title: "Airport & Nationwide Coverage",
      description: "All major airports and locations across the UK.",
    },
    {
      icon: ShieldCheck,
      title: "Punctual & Reliable Service",
      description: "On time, every time.",
    },
  ];

  // How It Works Steps
  const STEPS = [
    {
      number: "01",
      icon: CalendarDays,
      title: "Book Your Journey",
      description: "Enter your pickup, destination and journey details.",
    },
    {
      number: "02",
      icon: CheckCircle2,
      title: "Get Your Confirmation",
      description: "Receive your booking confirmation with all journey details.",
    },
    {
      number: "03",
      icon: UserCheck,
      title: "Meet Your Driver",
      description: "Your professional driver arrives at the agreed pickup location.",
    },
    {
      number: "04",
      icon: Car,
      title: "Enjoy Your Journey",
      description: "Sit back, relax and travel comfortably to your destination.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-[#d4a359] selection:text-slate-950">
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
              backgroundImage:
                "url('https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=85')",
            }}
          >
            {/* Dark gradient to ensure high readability and match mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-[#070b14]/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
            <div className="max-w-2xl space-y-5">
              <span className="inline-block text-[#d4a359] text-xs font-extrabold uppercase tracking-[0.2em]">
                OUR SERVICES
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                Premium, Reliable &amp; Comfortable Travel Services
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                From airport transfers to long-distance journeys, TravelLuxx provides professional
                private transportation tailored around your needs.
              </p>

              <div className="pt-3">
                <a
                  href="/#calculator"
                  className="inline-flex items-center gap-2.5 bg-[#d4a359] hover:bg-[#c39248] text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-xl shadow-[#d4a359]/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Book Your Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. TRAVEL SOLUTIONS FOR EVERY JOURNEY (6 CARDS GRID)      */}
        {/* ========================================================= */}
        <section className="py-20 lg:py-24 bg-[#ffffff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[#cda66e] text-xs font-extrabold uppercase tracking-[0.2em] block">
                OUR SERVICES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Travel Solutions for Every Journey
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether it&apos;s a quick airport transfer or a long-distance trip, we offer a range of
                services designed to make your journey smooth, safe and stress-free.
              </p>
            </div>

            {/* 6 Cards 3x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES_LIST.map((svc) => {
                const IconComponent = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    {/* Card Image Container */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Floating Dark Icon Badge overlapping image */}
                    <div className="px-6 -mt-6 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-[#0c1322] border-2 border-white shadow-md flex items-center justify-center text-white">
                        <IconComponent className="w-5 h-5 text-emerald-400" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 pt-3 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {svc.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {svc.description}
                        </p>
                      </div>

                      <div className="pt-2">
                        <a
                          href={svc.link}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#cda66e] hover:text-[#b38a50] transition-colors"
                        >
                          <span>Learn More</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
              backgroundImage:
                "url('https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c101d] via-[#0c101d]/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3 mb-16">
              <span className="text-[#d4a359] text-xs font-extrabold uppercase tracking-[0.2em] block">
                WHY CHOOSE TRAVELLUXX
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Your Trusted Travel Partner
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We go the extra mile to ensure your journey is comfortable, safe and hassle-free.
              </p>
            </div>

            {/* 6 Features in 3x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {FEATURES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-slate-300">
                      <IconComponent className="w-5 h-5 text-[#d4a359]" />
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
              <span className="text-[#cda66e] text-xs font-extrabold uppercase tracking-[0.2em] block">
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Simple Steps to Your Destination
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Booking your journey with TravelLuxx is quick and easy. Follow these simple steps and
                get on your way in no time.
              </p>
            </div>

            {/* 4 Steps Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {STEPS.map((step, idx) => {
                const IconComp = step.icon;
                const isLast = idx === STEPS.length - 1;

                return (
                  <div key={step.number} className="relative flex flex-col items-center text-center space-y-3 group">
                    {/* Number Badge */}
                    <div className="w-7 h-7 rounded-full bg-[#cda66e] text-white text-[11px] font-extrabold flex items-center justify-center shadow-md">
                      {step.number}
                    </div>

                    {/* Circular Icon Holder */}
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-800 transition-transform group-hover:scale-105">
                      <IconComp className="w-6 h-6 text-slate-800" />
                    </div>

                    {/* Step Title & Copy */}
                    <h4 className="text-sm font-bold text-slate-900 pt-1">{step.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs">{step.description}</p>

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


      </main>

      {/* Global Footer */}
      <Footer onScrollTo={() => {}} settings={settings} />
    </div>
  );
}
