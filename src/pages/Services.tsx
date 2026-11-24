import React, { useEffect, useState } from "react";
import { Link } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { ArrowRight, Minus, Plus } from "lucide-react";

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

interface ServicesProps {
  initialServices?: any[];
  initialPageSettings?: any;
  initialSettings?: any;
}

export default function Services({
  initialServices,
  initialPageSettings,
  initialSettings,
}: ServicesProps = {}) {
  const { settings: ctxSettings, services: ctxServices, servicesPageSettings: ctxPageSettings } = useSettings();
  const settings = initialSettings || ctxSettings;
  const services = (initialServices && initialServices.length > 0)
    ? initialServices
    : (ctxServices.length > 0 ? ctxServices : DEFAULT_SERVICES);
  const pageSettings = initialPageSettings || ctxPageSettings;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // SEO Meta Tags & Document Title
  useEffect(() => {
    const baseUrl = "https://travelluxx.co.uk";
    const pageUrl = `${baseUrl}/services`;

    const metaTitle =
      pageSettings?.meta_title?.trim() ||
      "Premium Chauffeur & Airport Travel Services | TravelLuxx UK";
    const metaDesc =
      pageSettings?.meta_description?.trim() ||
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
  }, [pageSettings]);

  // Section visibility flags
  const heroEnabled = pageSettings?.hero_enabled !== false;
  const catalogEnabled = pageSettings?.catalog_enabled !== false;
  const whyChooseEnabled = pageSettings?.why_choose_enabled !== false;
  const howItWorksEnabled = pageSettings?.how_it_works_enabled !== false;
  const faqEnabled = pageSettings?.faq_enabled !== false;

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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Global Navbar */}
      <Navbar onScrollTo={(id) => { if (id === "hero" || !id) { window.location.href = "/"; } }} />

      <main className="flex-grow">
        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        {heroEnabled && (
          <section className="relative overflow-hidden bg-brand-950">
            {/* Hero background image under a flat dark overlay for legibility */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${heroImage}')`,
              }}
              aria-hidden="true"
            ></div>
            <div className="absolute inset-0 bg-brand-950/75" aria-hidden="true"></div>

            <div className="tl-container relative pt-32 pb-20 lg:pt-40 lg:pb-28">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">{heroTag}</span>

              <h1
                data-reveal="lines"
                className="tl-h1 mt-5 max-w-4xl text-4xl text-white sm:text-5xl lg:text-6xl"
              >
                {heroTitle}
              </h1>

              <p
                data-reveal
                data-reveal-delay="0.15"
                className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg"
              >
                {heroDescription}
              </p>

              <div
                data-reveal
                data-reveal-delay="0.3"
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <a href={heroButtonUrl} className="tl-btn tl-btn-light">
                  <span>{heroButtonText}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 2. TRAVEL SOLUTIONS FOR EVERY JOURNEY (DYNAMIC CARDS GRID)*/}
        {/* ========================================================= */}
        {catalogEnabled && (
          <section className="tl-section bg-white">
            <div className="tl-container">
              {/* Section Header */}
              <div className="max-w-3xl">
                <span data-reveal className="tl-eyebrow">{catalogTag}</span>
                <h2 data-reveal="lines" className="tl-h2 mt-4">{catalogTitle}</h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                  {catalogDescription}
                </p>
              </div>

              {/* Dynamic Services Grid */}
              <div
                data-reveal-group
                className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
              >
                {services.map((svc) => {
                  const detailUrl = `/services/${svc.slug}`;
                  const desc = svc.excerpt || svc.description || "";

                  return (
                    <div
                      key={svc.id || svc.slug}
                      className="tl-card tl-card-hover group relative flex flex-col"
                    >
                      {/* Card Image */}
                      <Link
                        to={detailUrl}
                        className="block aspect-[4/3] w-full overflow-hidden bg-stone-100"
                      >
                        <img
                          src={
                            svc.image ||
                            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
                          }
                          alt={svc.imageAlt || `${svc.title} - Executive Chauffeur Services UK`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-grow flex-col p-6">
                        {/* The title link is stretched over the whole card so the card itself is the link. */}
                        <Link to={detailUrl} className="block after:absolute after:inset-0">
                          <h3 className="tl-h3">{svc.title}</h3>
                        </Link>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
                          {desc}
                        </p>

                        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                          <Link to={detailUrl} className="tl-link relative z-10 min-h-11">
                            <span>View service</span>
                            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                          </Link>

                          <a
                            href="/#calculator"
                            className="relative z-10 inline-flex min-h-11 items-center text-sm text-stone-500 underline-offset-4 transition-colors duration-200 hover:text-stone-900 hover:underline"
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
        )}

        {/* 4. Frequently Asked Questions (FAQ) Section */}
        {faqEnabled && faqs.length > 0 && (
          <section className="tl-section bg-ivory">
            <div className="tl-container">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <span data-reveal className="tl-eyebrow">{faqTag}</span>
                  <h2 data-reveal="lines" className="tl-h2 mt-4">{faqTitle}</h2>
                  <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                    {faqDescription}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div
                    data-reveal-group
                    className="divide-y divide-stone-200 border-y border-stone-200"
                  >
                    {faqs.map((faq: any, idx: number) => {
                      const isOpen = openFaqIndex === idx;
                      const questionId = `services-faq-q-${idx}`;
                      const answerId = `services-faq-a-${idx}`;
                      return (
                        <div key={idx}>
                          {/* The question is a plain <h3> (text only). The toggle lives on the row + icon button. */}
                          <div
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="flex cursor-pointer items-start justify-between gap-6 py-6"
                          >
                            <h3
                              id={questionId}
                              className="text-base leading-snug font-medium text-stone-900 sm:text-lg"
                            >
                              {faq.question}
                            </h3>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              aria-controls={answerId}
                              aria-labelledby={questionId}
                              className="-my-2.5 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-stone-500 transition-colors duration-200 hover:text-stone-900"
                            >
                              {isOpen ? (
                                <Minus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                              ) : (
                                <Plus className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={questionId}
                            className={`pr-10 pb-6 leading-relaxed text-stone-600 ${
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
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Global Footer */}
      <Footer onScrollTo={() => {}} />
    </div>
  );
}

