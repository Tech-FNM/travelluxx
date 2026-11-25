import React, { useEffect, useState } from "react";
import { hasOwnImage } from "../components/areas/areaShared";
import { useParams, Link, useNavigate } from "../utils/routerCompat";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageSquare,
  Minus,
  Phone,
  Plus
} from "lucide-react";
import { normalizeRichHtml } from "../utils/richText";
import { useContent } from "../content/useContent";

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
  // Site-wide defaults for every service page (Site Content tab). A service's own value wins.
  const c = useContent(settings);

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-950 text-white">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-brand-300 border-t-transparent"></div>
        <p className="text-sm text-stone-400">{c.t("service_detail_loading_text")}</p>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar onScrollTo={() => {}} />
        <main className="flex flex-grow flex-col items-center justify-center px-5 py-24 text-center sm:px-8 lg:py-32">
          <span className="tl-eyebrow">{c.t("service_detail_404_badge")}</span>
          <h1 className="tl-h2 mt-4">{c.t("service_detail_404_title")}</h1>
          <p className="tl-lead mt-5 max-w-md">
            {c.t("service_detail_404_text")}
          </p>
          <Link to={c.t("service_detail_404_btn_url")} className="tl-btn tl-btn-primary mt-8">
            <span>{c.t("service_detail_404_btn_text")}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </main>
        <Footer onScrollTo={() => {}} />
      </div>
    );
  }

  // The CMS's stock placeholder photo (a small blue hatchback) counts as "no image".
  const heroBg = hasOwnImage(service.heroImage)
    ? service.heroImage
    : hasOwnImage(service.image)
      ? service.image
      : c.t("service_detail_hero_image");

  const features = Array.isArray(service.features) && service.features.length > 0
    ? service.features
    : c.lines("service_detail_features");

  const whatsappNumber = settings?.whatsapp_number || "441217140876";
  const formattedPhone = settings?.whatsapp_number
    ? `+${settings.whatsapp_number}`
    : "+44 121 714 0876";

  // Fills the placeholders of the site-wide default texts.
  const fill = (text: string) =>
    text.split("{service}").join(service.title || "").split("{phone}").join(formattedPhone);

  const defaultPerks = c.lines("service_detail_sidebar_perks");
  const sidebarPerks = Array.isArray(service.sidebarPerks) && service.sidebarPerks.length > 0
    ? service.sidebarPerks
    : defaultPerks;

  const defaultWhyChoose = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: c.t(`service_detail_why_choose_${n}_title`),
    desc: c.t(`service_detail_why_choose_${n}_text`),
  }));

  const whyChooseList = Array.isArray(service.whyChooseItems) && service.whyChooseItems.length > 0
    ? service.whyChooseItems
    : defaultWhyChoose;

  const defaultSteps = [1, 2, 3, 4].map((n) => ({
    num: `0${n}`,
    title: c.t(`service_detail_step_${n}_title`),
    desc: c.t(`service_detail_step_${n}_text`),
  }));

  const stepsList = Array.isArray(service.howItWorksSteps) && service.howItWorksSteps.length > 0
    ? service.howItWorksSteps
    : defaultSteps;

  const faqsList = serviceFaqs;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar onScrollTo={() => {}} />

      <main className="flex-grow">
        {/* ========================================================= */}
        {/* 1. HERO BANNER                                            */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden bg-brand-950">
          {/* Background image under a flat dark overlay for legibility */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${heroBg}')` }}
            aria-hidden="true"
          ></div>
          <div className="absolute inset-0 bg-brand-950/75" aria-hidden="true"></div>

          <div className="tl-container relative pt-32 pb-20 lg:pt-40 lg:pb-28">
            {/* Breadcrumbs */}
            <nav
              data-reveal
              aria-label="Breadcrumb"
              className="-my-3 flex items-center gap-x-2.5 text-sm text-stone-400"
            >
              <Link to="/" className="shrink-0 py-3 transition-colors duration-200 hover:text-white">
                {c.t("service_detail_breadcrumb_home")}
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                to="/services"
                className="shrink-0 py-3 transition-colors duration-200 hover:text-white"
              >
                {c.t("service_detail_breadcrumb_services")}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="min-w-0 truncate text-stone-300">
                {service.title}
              </span>
            </nav>

            <div className="mt-10 max-w-3xl">
              <span data-reveal className="tl-eyebrow tl-eyebrow-light">
                {service.heroBadge || c.t("service_detail_hero_badge")}
              </span>

              <h1
                data-reveal="lines"
                className="tl-h1 mt-5 text-4xl text-white sm:text-5xl lg:text-6xl"
              >
                {service.title}
              </h1>

              {service.excerpt && (
                <p
                  data-reveal
                  data-reveal-delay="0.15"
                  className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg"
                >
                  {service.excerpt}
                </p>
              )}

              <div
                data-reveal
                data-reveal-delay="0.3"
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <a href={service.heroBtn1Url || c.t("service_detail_hero_btn1_url")} className="tl-btn tl-btn-light">
                  <span>{service.heroBtn1Text || c.t("service_detail_hero_btn1_text")}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </a>

                <a
                  href={
                    service.heroBtn2Url ||
                    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      fill(c.t("service_detail_hero_whatsapp_message"))
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tl-btn tl-btn-outline-light"
                >
                  <MessageSquare className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  <span>{service.heroBtn2Text || c.t("service_detail_hero_btn2_text")}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. MAIN CONTENT & SIDEBAR SECTION                         */}
        {/* ========================================================= */}
        <section className="tl-section bg-white">
          <div className="tl-container">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-12 xl:gap-16">
              {/* Left Main Column */}
              <div className="min-w-0 space-y-12 lg:col-span-7 xl:col-span-8">
                {/* Featured Service Image */}
                {hasOwnImage(service.image) && (
                  <div
                    data-reveal="image"
                    className="aspect-[4/3] overflow-hidden bg-stone-100 sm:aspect-[16/9]"
                  >
                    <img
                      src={service.image}
                      alt={service.imageAlt || fill(c.t("service_detail_image_alt"))}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Key Highlights / Features Box */}
                {service.highlightsEnabled !== false && c.on("service_detail_highlights_enabled") && features.length > 0 && (
                  <div data-reveal className="tl-card p-6 sm:p-8">
                    <h3 className="tl-eyebrow">
                      {service.highlightsBadge || c.t("service_detail_highlights_badge")}
                    </h3>
                    <h4 className="mt-3 text-xl leading-snug font-semibold text-stone-900 sm:text-2xl">
                      {service.highlightsTitle || c.t("service_detail_highlights_title")}
                    </h4>
                    <div className="mt-6 grid grid-cols-1 gap-x-10 border-b border-stone-200 sm:grid-cols-2">
                      {features.map((feat: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 border-t border-stone-200 py-3.5">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-snug text-stone-700">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rich Text Body Content with Enhanced Hierarchy.
                    The global rich-content CSS zeroes every margin (to mirror the Quill editor), which
                    leaves headings glued to the paragraph above. The arbitrary-variant utilities below
                    restore a vertical rhythm for this page only. */}
                <div
                  data-reveal
                  className="service-rich-content page-rich-content ql-snow break-words overflow-hidden w-full max-w-3xl min-w-0 [&_h1]:mt-12! [&_h1]:mb-4! [&_h2]:mt-12! [&_h2]:mb-4! [&_h3]:mt-8! [&_h3]:mb-2! [&_h2+h3]:mt-0! [&_h4]:mt-6! [&_h4]:mb-2! [&_p+p]:mt-4! [&_ul]:my-4! [&_ol]:my-4! [&_.ql-editor>:first-child]:mt-0!"
                >
                  {service.content ? (
                    <div dangerouslySetInnerHTML={{ __html: normalizeRichHtml(service.content) }} className="ql-editor w-full break-words !p-0" />
                  ) : (
                    <p className="leading-relaxed break-words text-stone-600">
                      {service.excerpt}
                    </p>
                  )}
                </div>

                {/* Trust & Guarantee Banner */}
                {service.guaranteeEnabled !== false && c.on("service_detail_guarantee_enabled") && (
                  <div
                    data-reveal="fade"
                    className="tl-dark flex flex-col gap-8 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
                  >
                    <div>
                      <span className="tl-eyebrow tl-eyebrow-light">
                        {service.guaranteeBadge || c.t("service_detail_guarantee_badge")}
                      </span>
                      <h3 className="mt-3 text-xl leading-snug font-semibold text-white sm:text-2xl">
                        {service.guaranteeTitle || fill(c.t("service_detail_guarantee_title"))}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-300">
                        {service.guaranteeSubtitle || c.t("service_detail_guarantee_subtitle")}
                      </p>
                    </div>
                    <a
                      href={service.guaranteeBtnUrl || c.t("service_detail_guarantee_btn_url")}
                      className="tl-btn tl-btn-light shrink-0"
                    >
                      {service.guaranteeBtnText || c.t("service_detail_guarantee_btn_text")}
                    </a>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="flex flex-col gap-8 lg:col-span-5 xl:col-span-4">
                {/* Sticky Booking Card. Its wrapper fills the spare column height so the card stays
                    pinned beside the article; the services list below sits outside it, so the pinned
                    card is never taller than the viewport. No reveal attributes on sticky elements. */}
                <div className="lg:flex-1">
                  <div className="tl-card p-6 sm:p-8 lg:sticky lg:top-28">
                    <span className="tl-eyebrow">
                      {service.sidebarBadge || c.t("service_detail_sidebar_badge")}
                    </span>
                    <h3 className="mt-3 text-xl leading-snug font-semibold text-stone-900">
                      {service.sidebarTitle || c.t("service_detail_sidebar_title")}
                    </h3>
                    {service.priceText && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-sm text-stone-500">{c.t("service_detail_rates_label")}</span>
                        <span className="text-lg font-semibold text-stone-900">
                          {service.priceText}
                        </span>
                      </div>
                    )}

                    {/* Sidebar Perks */}
                    <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
                      {sidebarPerks.map((perk: string, pIdx: number) => (
                        <div key={pIdx} className="flex items-start gap-3 py-3">
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                          <span className="text-sm leading-snug text-stone-700">{perk}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-3">
                      <a
                        href={service.sidebarBtn1Url || c.t("service_detail_sidebar_btn1_url")}
                        className="tl-btn tl-btn-primary w-full"
                      >
                        <span>{service.sidebarBtn1Text || c.t("service_detail_sidebar_btn1_text")}</span>
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      </a>

                      <a
                        href={service.sidebarBtn2Url || fill(c.t("service_detail_sidebar_btn2_url"))}
                        className="tl-btn tl-btn-outline w-full"
                      >
                        <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        <span>{service.sidebarBtn2Text || fill(c.t("service_detail_sidebar_btn2_text"))}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Other Services Navigation List */}
                {service.showSidebarServices !== false && c.on("service_detail_all_services_enabled") && allServices.length > 0 && (
                  <div data-reveal className="tl-card p-6 sm:p-8">
                    <h4 className="tl-eyebrow">
                      {c.t("service_detail_all_services_title")}
                    </h4>
                    <div className="mt-3 divide-y divide-stone-200 border-b border-stone-200">
                      {allServices.map((s) => {
                        const isCurrent = s.slug === service.slug;
                        return (
                          <Link
                            key={s.id}
                            to={`/services/${s.slug}`}
                            aria-current={isCurrent ? "page" : undefined}
                            className={`flex min-h-11 items-center justify-between gap-3 py-2.5 text-sm transition-colors duration-200 ${
                              isCurrent
                                ? "font-medium text-brand-700"
                                : "text-stone-600 hover:text-stone-900"
                            }`}
                          >
                            <span className="truncate">{s.title}</span>
                            <ChevronRight
                              className="h-4 w-4 shrink-0 text-stone-400"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. WHY CHOOSE SECTION                                     */}
        {/* ========================================================= */}
        {service.whyChooseEnabled !== false && c.on("service_detail_why_choose_enabled") && (
          <section className="tl-dark tl-section">
            <div className="tl-container">
              <div className="max-w-3xl">
                <span data-reveal className="tl-eyebrow tl-eyebrow-light">
                  {service.whyChooseBadge || c.t("service_detail_why_choose_badge")}
                </span>
                <h2 data-reveal="lines" className="tl-h2 mt-4 text-white">
                  {service.whyChooseTitle || c.t("service_detail_why_choose_title")}
                </h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl text-stone-300">
                  {service.whyChooseSubtitle || c.t("service_detail_why_choose_subtitle")}
                </p>
              </div>

              {/* Numbered reasons */}
              <div
                data-reveal-group
                className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
              >
                {whyChooseList.map((item: any, idx: number) => (
                  <div key={idx} className="border-t border-white/10 pt-6">
                    <span
                      className="block font-display text-3xl leading-none text-brand-300 lining-nums"
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-3 text-base font-semibold text-white">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-stone-400">
                      {item.desc || item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 4. HOW IT WORKS                                           */}
        {/* ========================================================= */}
        {service.howItWorksEnabled !== false && c.on("service_detail_how_it_works_enabled") && (
          <section className="tl-section bg-ivory">
            <div className="tl-container">
              <div className="max-w-3xl">
                <span data-reveal className="tl-eyebrow">
                  {service.howItWorksBadge || c.t("service_detail_how_it_works_badge")}
                </span>
                <h2 data-reveal="lines" className="tl-h2 mt-4">
                  {service.howItWorksTitle || c.t("service_detail_how_it_works_title")}
                </h2>
                <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                  {service.howItWorksSubtitle || c.t("service_detail_how_it_works_subtitle")}
                </p>
              </div>

              <div
                data-reveal-group
                className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
              >
                {stepsList.map((step: any, idx: number) => (
                  <div
                    key={step.num || step.number || idx}
                    className="border-t border-stone-300 pt-6"
                  >
                    <span className="block font-display text-4xl leading-none text-brand-700 lining-nums">
                      {step.num || step.number || `0${idx + 1}`}
                    </span>
                    <h4 className="mt-4 text-base font-semibold text-stone-900">
                      {step.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {step.desc || step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================= */}
        {/* 5. SERVICE FAQs ACCORDION                                 */}
        {/* ========================================================= */}
        {service.faqsEnabled !== false && c.on("service_detail_faq_enabled") && faqsList.length > 0 && (
          <section className="tl-section bg-white">
            <div className="tl-container">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                  <span data-reveal className="tl-eyebrow">
                    {service.faqBadge || c.t("service_detail_faq_badge")}
                  </span>
                  <h2 data-reveal="lines" className="tl-h2 mt-4">
                    {service.faqTitle || fill(c.t("service_detail_faq_title"))}
                  </h2>
                  <p data-reveal data-reveal-delay="0.1" className="tl-lead mt-5 max-w-2xl">
                    {service.faqSubtitle || c.t("service_detail_faq_subtitle")}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <div
                    data-reveal-group
                    className="divide-y divide-stone-200 border-y border-stone-200"
                  >
                    {faqsList.map((faq: any, idx: number) => {
                      const isOpen = openFaqIndex === idx;
                      const questionId = `service-detail-faq-q-${idx}`;
                      const answerId = `service-detail-faq-a-${idx}`;
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

      <Footer onScrollTo={() => {}} />
    </div>
  );
}

