/**
 * Server-side SEO helpers: the site address, absolute URLs, the business (LocalBusiness/WebSite)
 * JSON-LD and the FAQ lists each page visibly renders, so the FAQPage JSON-LD always matches what
 * the visitor sees (same list, same show/hide switch).
 *
 * Pure functions (no React, no Node APIs): safe on the server and in the browser.
 */
import { contentText, contentOn, contentLines } from "../content/useContent";
import { defaultBlogFaqs } from "../content/sections/blog";

export interface Faq {
  question: string;
  answer: string;
}

export const DEFAULT_BASE_URL = "https://travelluxx.co.uk";

/** The site's own address, without a trailing slash (Site Content → Pages → Site-wide SEO). */
export function siteBaseUrl(settings: any): string {
  const raw = String(contentText(settings, "site_base_url") || DEFAULT_BASE_URL).trim();
  const clean = raw.replace(/\/+$/, "");
  return /^https?:\/\//i.test(clean) ? clean : DEFAULT_BASE_URL;
}

/** Absolute URL for a path or URL; "" for empty values and inline data: images. */
export function absoluteUrl(base: string, url: any): string {
  const v = typeof url === "string" ? url.trim() : "";
  if (!v || v.startsWith("data:") || v.startsWith("blob:")) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("//")) return `https:${v}`;
  return `${base}${v.startsWith("/") ? "" : "/"}${v}`;
}

/** true / "true" (dashboard checkboxes are saved either way). */
export function isOn(v: any): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

export function businessName(settings: any): string {
  return String(settings?.business_name || settings?.businessName || "TravelLuxx").trim() || "TravelLuxx";
}

/** "+441217140876" from the WhatsApp number (or the explicit business phone). */
export function businessTelephone(settings: any): string {
  const explicit = contentText(settings, "business_phone").trim();
  if (explicit) return explicit;
  let digits = String(settings?.whatsapp_number || "441217140876").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `44${digits.slice(1)}`;
  return digits ? `+${digits}` : "";
}

export function logoUrl(settings: any, base: string): string {
  return (
    absoluteUrl(base, settings?.logo_url || settings?.logo_image || settings?.logoImage) ||
    absoluteUrl(base, contentText(settings, "seo_default_share_image"))
  );
}

/** Default social share image for pages without their own. */
export function defaultShareImage(settings: any, base: string): string {
  return absoluteUrl(base, contentText(settings, "seo_default_share_image")) || logoUrl(settings, base);
}

const clean = (o: any): any => JSON.parse(JSON.stringify(o)); // drops undefined values

/** LocalBusiness/TaxiService (#organization) + WebSite (#website), built from the dashboard settings. */
export function organizationSchemas(settings: any): any[] {
  const base = siteBaseUrl(settings);
  const name = businessName(settings);
  const lat = parseFloat(contentText(settings, "business_latitude"));
  const lng = parseFloat(contentText(settings, "business_longitude"));
  const sameAs = contentLines(settings, "business_same_as").filter((u) => /^https?:\/\//i.test(u));
  const areas = contentLines(settings, "business_area_served");
  const hours = contentLines(settings, "business_opening_hours");
  const street = contentText(settings, "business_street").trim();
  const locality = contentText(settings, "business_locality").trim();
  const region = contentText(settings, "business_region").trim();
  const postcode = contentText(settings, "business_postcode").trim();
  const country = contentText(settings, "business_country").trim();
  const office = String(settings?.office_address || "").trim();
  const hasParts = street || locality || region || postcode;
  const logo = logoUrl(settings, base);

  const business = clean({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": `${base}/#organization`,
    name,
    legalName: contentText(settings, "business_legal_name").trim() || undefined,
    url: `${base}/`,
    logo: logo || undefined,
    image: logo || undefined,
    telephone: businessTelephone(settings) || undefined,
    email: String(settings?.business_email || "").trim() || undefined,
    description: contentText(settings, "business_description").trim() || undefined,
    address:
      hasParts || office
        ? {
            "@type": "PostalAddress",
            streetAddress: street || (hasParts ? undefined : office),
            addressLocality: locality || undefined,
            addressRegion: region || undefined,
            postalCode: postcode || undefined,
            addressCountry: country || undefined,
          }
        : undefined,
    geo: Number.isFinite(lat) && Number.isFinite(lng) ? { "@type": "GeoCoordinates", latitude: lat, longitude: lng } : undefined,
    openingHours: hours.length > 0 ? hours : undefined,
    priceRange: contentText(settings, "business_price_range").trim() || undefined,
    paymentAccepted: contentText(settings, "business_payment_accepted").trim() || undefined,
    currenciesAccepted: "GBP",
    areaServed: areas.length > 0 ? areas.map((a) => ({ "@type": "Place", name: a })) : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  });

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: `${base}/`,
    name,
    inLanguage: "en-GB",
    publisher: { "@id": `${base}/#organization` },
  };

  return [business, website];
}

/** FAQPage JSON-LD for a list, or null when the list is empty. */
export function faqPageSchema(pageUrl: string, faqs: Faq[]): any | null {
  const list = (Array.isArray(faqs) ? faqs : []).filter((f) => f && (f.question || f.answer));
  if (list.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: String(f.question || ""),
      acceptedAnswer: { "@type": "Answer", text: String(f.answer || "") },
    })),
  };
}

// ---------------------------------------------------------------------------------------------
// The FAQ lists each page renders. Keep in step with the components named in each comment.
// ---------------------------------------------------------------------------------------------

/** Same as HomepageFaq's built-in list (src/components/HomepageFaq.tsx). */
export const DEFAULT_HOMEPAGE_FAQS: Faq[] = [
  {
    question: "How do I book an executive transfer with TravelLuxx?",
    answer:
      "You can book easily online using our instant Fare Calculator above, select your desired vehicle class (Economy, Luxury, or Family MPV), specify your pickup time and date, and complete your reservation with instant confirmation.",
  },
  {
    question: "Do you provide flight monitoring for airport pickups?",
    answer:
      "Yes, our team actively monitors all inbound commercial flights in real-time. Whether your flight is delayed or lands early, your chauffeur will adjust their schedule accordingly and meet you inside the terminal with a name board.",
  },
  {
    question: "What vehicle classes are available?",
    answer:
      "We offer Mercedes-Benz E-Class & S-Class executive sedans for up to 4 passengers, and Mercedes V-Class / luxury multi-passenger vehicles (MPVs) for families and business groups carrying up to 7-8 passengers and substantial luggage.",
  },
  {
    question: "Can I apply a promo code or discount voucher?",
    answer:
      "Yes! At Step 3 (Secure Checkout) in our Booking Calculator, you can enter your promo code in the discount field and click 'Apply' to instantly receive your calculated savings before confirming your reservation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, Apple Pay, Google Pay, and Klarna through our secure Mollie payments integration, as well as pre-authorized Cash on Departure / Pay Later options.",
  },
];

/** Homepage (Home.tsx → HomepageFaq): hidden in static-page mode and when the section is switched off. */
export function homepageFaqs(settings: any): Faq[] {
  if (settings?.homepage_displays === "page") return [];
  if (!contentOn(settings, "homepage_faqs_enabled")) return [];
  const own = settings?.homepage_faqs;
  return Array.isArray(own) && own.length > 0 ? own.filter((f: any) => f && f.question && f.answer) : DEFAULT_HOMEPAGE_FAQS;
}

/** Same as DEFAULT_FAQS in src/pages/Services.tsx (also the services index default). */
export const DEFAULT_SERVICES_FAQS: Faq[] = [
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

/** Services index (Services.tsx): page-settings FAQs or the defaults, gated by faq_enabled. */
export function servicesIndexFaqs(pageSettings: any): Faq[] {
  if (pageSettings?.faq_enabled === false || pageSettings?.faq_enabled === "false") return [];
  const own = pageSettings?.faqs;
  return Array.isArray(own) && own.length > 0 ? own : DEFAULT_SERVICES_FAQS;
}

/** Service detail (ServiceDetail.tsx): own FAQs, else page-settings FAQs, else defaults. */
export function serviceDetailFaqs(service: any, pageSettings: any, settings: any): Faq[] {
  if (!service || service.faqsEnabled === false || service.faqsEnabled === "false") return [];
  if (!contentOn(settings, "service_detail_faq_enabled")) return [];
  if (Array.isArray(service.faqs) && service.faqs.length > 0) return service.faqs;
  if (Array.isArray(pageSettings?.faqs) && pageSettings.faqs.length > 0) return pageSettings.faqs;
  return DEFAULT_SERVICES_FAQS;
}

/** Area detail (ServiceAreaPage.tsx): own FAQs, else the shared fallback questions from Site Content. */
export function areaDetailFaqs(area: any, settings: any): Faq[] {
  if (!contentOn(settings, "area_detail_faq_enabled")) return [];
  const own = (Array.isArray(area?.faqs) ? area.faqs : []).filter((f: any) => f && (f.question || f.answer));
  if (own.length > 0) return own;
  return [1, 2, 3, 4]
    .map((n) => ({
      question: contentText(settings, `area_detail_faq${n}_question`),
      answer: contentText(settings, `area_detail_faq${n}_answer`),
    }))
    .filter((f) => f.question || f.answer);
}

/** Blog post (BlogPostDetail.tsx): own FAQs, else the default blog FAQs (Site Content → Blog). */
export function blogPostFaqs(post: any, settings: any): Faq[] {
  if (Array.isArray(post?.faqs) && post.faqs.length > 0) return post.faqs;
  return defaultBlogFaqs((k) => contentText(settings, k), (k) => contentOn(settings, k));
}

/** CMS page (DynamicPage.tsx). */
export function cmsPageFaqs(page: any): Faq[] {
  return (Array.isArray(page?.faqs) ? page.faqs : []).filter((f: any) => f && (f.question || f.answer));
}

/** Parses an admin-entered JSON-LD string; invalid JSON is ignored. */
export function parseCustomSchema(raw: any): any[] {
  if (!raw) return [];
  if (typeof raw === "object") return Array.isArray(raw) ? raw.filter(Boolean) : [raw];
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw.trim());
    if (Array.isArray(parsed)) return parsed.filter((x) => x && typeof x === "object");
    return parsed && typeof parsed === "object" ? [parsed] : [];
  } catch {
    return [];
  }
}
