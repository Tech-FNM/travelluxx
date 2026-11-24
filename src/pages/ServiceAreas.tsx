import React, { useEffect, useState } from "react";
import { Link } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { ArrowRight, Plus, Minus } from "lucide-react";

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
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />

      <main className="flex-grow">
        {/* MAIN PAGE HEADING (dark hero) */}
        <section className="bg-brand-950">
          <div className="tl-container pt-32 pb-20 lg:pt-40 lg:pb-24">
            <span data-reveal className="tl-eyebrow tl-eyebrow-light">{pageSettings.hero_tag || "SERVICE AREAS"}</span>

            <h1
              data-reveal="lines"
              className="tl-h1 mt-5 max-w-4xl text-4xl text-balance text-white sm:text-5xl lg:text-6xl"
            >
              {pageSettings.hero_title || "Our Service Areas"}
            </h1>

            {pageSettings.hero_description && (
              <p
                data-reveal
                data-reveal-delay="0.15"
                className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-300"
              >
                {pageSettings.hero_description}
              </p>
            )}
          </div>
        </section>

        {/* SERVICE AREA BOXES */}
        <section className="tl-section bg-white">
          <div className="tl-container">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
              </div>
            ) : areas.length === 0 ? (
              <div data-reveal className="border border-stone-200 px-6 py-16 text-center sm:py-20">
                <h3 className="tl-h3">No service areas found</h3>
                <p className="mt-2 text-sm text-stone-600">Please check back soon or add areas from the admin dashboard.</p>
              </div>
            ) : (
              <div data-reveal-group className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {areas.map(area => (
                  <Link
                    key={area.id}
                    to={`/service-areas/${area.slug}`}
                    className="tl-card tl-card-hover group flex flex-col"
                  >
                    {/* Card Image */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <img
                        src={area.heroImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"}
                        alt={area.imageAlt || `${area.title} - Executive Chauffeur Service Area`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-grow flex-col p-6">
                      <span className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
                        {area.heroBadge || area.title}
                      </span>
                      <h3 className="tl-h3 mt-3">
                        {area.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
                        {area.heroDescription || `Private chauffeur travel and airport transfers covering all destinations in and around ${area.title}.`}
                      </p>

                      <div className="mt-auto pt-6">
                        <span className="tl-link group-hover:text-brand-900 group-hover:underline">
                          <span>Explore Area</span>
                          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Service Areas FAQs */}
        <section className="tl-section bg-ivory">
          <div className="tl-container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <span data-reveal className="tl-eyebrow">Service Coverage FAQs</span>
                <h2 data-reveal="lines" className="tl-h2 mt-4">
                  Frequently Asked Questions
                </h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                  Common questions about our executive chauffeur coverage, airport transfers, and private hire service areas.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div data-reveal-group className="divide-y divide-stone-200 border-y border-stone-200">
                  {SERVICE_AREAS_FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    const questionId = `service-areas-faq-q-${index}`;
                    const answerId = `service-areas-faq-a-${index}`;
                    return (
                      <div key={faq.question}>
                        {/* The question is a plain <h3> (text only). The toggle lives on the row + icon button. */}
                        <div
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
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
      </main>

      <Footer onScrollTo={id => { if (id === "hero" || !id) window.location.href = "/"; }} />
    </div>
  );
}
