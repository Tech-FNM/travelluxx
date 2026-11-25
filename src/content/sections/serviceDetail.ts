import type { ContentField, ContentSection } from "../types";

// Single service page (/services/<slug>).
// Every value here is a SITE-WIDE DEFAULT for all service pages. A service's own value, edited in
// the Services manager (title, content, image, badges, buttons, lists, FAQs...), always wins; these
// texts only show where a service leaves that field empty. "{service}" is replaced by the service
// name and "{phone}" by the business phone number.

const PLACEHOLDER_HELP = "{service} is replaced by the service name.";

const t = (key: string, label: string, def: string, help?: string): ContentField => ({
  key,
  label,
  type: "text",
  default: def,
  ...(help ? { help } : {}),
});
const area = (key: string, label: string, def: string, help?: string): ContentField => ({
  key,
  label,
  type: "textarea",
  default: def,
  ...(help ? { help } : {}),
});
const url = (key: string, label: string, def: string, help?: string): ContentField => ({
  key,
  label,
  type: "url",
  default: def,
  ...(help ? { help } : {}),
});
const toggle = (key: string, label: string, help?: string): ContentField => ({
  key,
  label,
  type: "toggle",
  default: "true",
  ...(help ? { help } : {}),
});

const PER_SERVICE_NOTE =
  "Shown on every service page unless that service sets its own value in the Services manager.";

const WHY_CHOOSE_DEFAULTS: [string, string][] = [
  ["Professional & Experienced Drivers", "Skilled, courteous and fully licensed."],
  ["Comfortable Vehicles", "Modern, clean and well-maintained fleet."],
  ["Fixed & Transparent Pricing", "No hidden charges, no surprises."],
  ["24/7 Booking Support", "We're always here to help you."],
  ["Airport & Nationwide Coverage", "All major airports and locations across the UK."],
  ["Punctual & Reliable Service", "On time, every time."],
];

const STEP_DEFAULTS: [string, string][] = [
  ["Book Your Journey", "Enter your pickup, destination and journey details."],
  ["Get Your Confirmation", "Receive your booking confirmation with all journey details."],
  ["Meet Your Driver", "Your professional driver arrives at the agreed pickup location."],
  ["Enjoy Your Journey", "Sit back, relax and travel comfortably to your destination."],
];

export const sections: ContentSection[] = [
  {
    id: "service_detail_hero",
    page: "Services",
    title: "Service page – top banner",
    description: PER_SERVICE_NOTE,
    fields: [
      t("service_detail_breadcrumb_home", "Breadcrumb – 'Home' link text", "Home"),
      t("service_detail_breadcrumb_services", "Breadcrumb – 'Services' link text", "Services"),
      t("service_detail_hero_badge", "Small label above the service name", "EXECUTIVE CHAUFFEUR SERVICE"),
      {
        key: "service_detail_hero_image",
        label: "Background image (when the service has no hero or featured image)",
        type: "image",
        default:
          "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=85",
      },
      t("service_detail_hero_btn1_text", "First button – text", "Book This Service"),
      url("service_detail_hero_btn1_url", "First button – link", "/#calculator"),
      t("service_detail_hero_btn2_text", "WhatsApp button – text", "WhatsApp Inquiry"),
      area(
        "service_detail_hero_whatsapp_message",
        "WhatsApp button – pre-filled message",
        "Hello TravelLuxx, I would like to inquire about your {service} service.",
        `Used when the service has no own link for this button. ${PLACEHOLDER_HELP}`
      ),
    ],
  },
  {
    id: "service_detail_highlights",
    page: "Services",
    title: "Service page – image and key highlights box",
    description: PER_SERVICE_NOTE,
    fields: [
      t(
        "service_detail_image_alt",
        "Featured image – alt text (for Google and screen readers)",
        "{service} - Executive Chauffeur Services UK",
        PLACEHOLDER_HELP
      ),
      toggle("service_detail_highlights_enabled", "Show the key highlights box on all service pages"),
      t("service_detail_highlights_badge", "Highlights – small label", "KEY HIGHLIGHTS"),
      t("service_detail_highlights_title", "Highlights – heading", "What Sets This Service Apart"),
      {
        key: "service_detail_features",
        label: "Highlights – list (when the service has no own list)",
        type: "lines",
        default: [
          "Reliable & punctual service",
          "Professional licensed chauffeurs",
          "Immaculate luxury vehicles",
          "Fixed & transparent pricing",
          "24/7 dedicated support",
        ].join("\n"),
        help: "One item per line.",
      },
    ],
  },
  {
    id: "service_detail_guarantee",
    page: "Services",
    title: "Service page – dark booking banner under the article",
    description: PER_SERVICE_NOTE,
    fields: [
      toggle("service_detail_guarantee_enabled", "Show the booking banner on all service pages"),
      t("service_detail_guarantee_badge", "Small label", "THE TRAVELLUXX STANDARD"),
      t("service_detail_guarantee_title", "Heading", "Ready to Book Your {service}?", PLACEHOLDER_HELP),
      area(
        "service_detail_guarantee_subtitle",
        "Text",
        "Get an instant fixed fare in seconds with our online journey calculator."
      ),
      t("service_detail_guarantee_btn_text", "Button – text", "Instant Quote"),
      url("service_detail_guarantee_btn_url", "Button – link", "/#calculator"),
    ],
  },
  {
    id: "service_detail_sidebar",
    page: "Services",
    title: "Service page – booking card (right column)",
    description: PER_SERVICE_NOTE,
    fields: [
      t("service_detail_sidebar_badge", "Small label", "RESERVE YOUR RIDE"),
      t("service_detail_sidebar_title", "Heading", "Book Online Instantly"),
      t(
        "service_detail_rates_label",
        "Label before the price",
        "Rates:",
        "The price itself is the 'Price text' of each service."
      ),
      {
        key: "service_detail_sidebar_perks",
        label: "Ticked list (when the service has no own list)",
        type: "lines",
        default: [
          "24/7 Availability & Instant Confirmation",
          "Fixed Price Guarantee — No Hidden Fees",
          "Licensed, DBS-Checked Executive Chauffeurs",
          "Immaculate Mercedes Fleet with Free Wi-Fi",
        ].join("\n"),
        help: "One item per line.",
      },
      t("service_detail_sidebar_btn1_text", "First button – text", "Calculate Fare & Book"),
      url("service_detail_sidebar_btn1_url", "First button – link", "/#calculator"),
      t(
        "service_detail_sidebar_btn2_text",
        "Call button – text",
        "Call {phone}",
        "{phone} is replaced by the business phone number."
      ),
      url(
        "service_detail_sidebar_btn2_url",
        "Call button – link",
        "tel:{phone}",
        "{phone} is replaced by the business phone number."
      ),
      toggle("service_detail_all_services_enabled", "Show the 'All our services' list on all service pages"),
      t("service_detail_all_services_title", "'All our services' list – heading", "ALL OUR SERVICES"),
    ],
  },
  {
    id: "service_detail_why_choose",
    page: "Services",
    title: "Service page – why choose us",
    description: `${PER_SERVICE_NOTE} The six reasons below are used only for services that have no own 'Why choose' items.`,
    fields: [
      toggle("service_detail_why_choose_enabled", "Show this section on all service pages"),
      t("service_detail_why_choose_badge", "Small label", "WHY CHOOSE TRAVELLUXX"),
      t("service_detail_why_choose_title", "Heading", "Your Trusted Travel Partner"),
      area(
        "service_detail_why_choose_subtitle",
        "Text under the heading",
        "We go the extra mile to ensure every journey is comfortable, safe and hassle-free."
      ),
      ...WHY_CHOOSE_DEFAULTS.flatMap(([title, desc], i) => [
        t(`service_detail_why_choose_${i + 1}_title`, `Reason ${i + 1} – title`, title),
        area(`service_detail_why_choose_${i + 1}_text`, `Reason ${i + 1} – text`, desc),
      ]),
    ],
  },
  {
    id: "service_detail_how_it_works",
    page: "Services",
    title: "Service page – how it works",
    description: `${PER_SERVICE_NOTE} The four steps below are used only for services that have no own steps.`,
    fields: [
      toggle("service_detail_how_it_works_enabled", "Show this section on all service pages"),
      t("service_detail_how_it_works_badge", "Small label", "HOW IT WORKS"),
      t("service_detail_how_it_works_title", "Heading", "Simple Steps to Your Destination"),
      area(
        "service_detail_how_it_works_subtitle",
        "Text under the heading",
        "Booking your journey with TravelLuxx is quick and easy. Follow these simple steps and get on your way in no time."
      ),
      ...STEP_DEFAULTS.flatMap(([title, desc], i) => [
        t(`service_detail_step_${i + 1}_title`, `Step ${i + 1} – title`, title),
        area(`service_detail_step_${i + 1}_text`, `Step ${i + 1} – text`, desc),
      ]),
    ],
  },
  {
    id: "service_detail_faq",
    page: "Services",
    title: "Service page – FAQ section",
    description: `${PER_SERVICE_NOTE} The questions themselves are edited per service, or for all services in Pages > Services (FAQ items).`,
    fields: [
      toggle("service_detail_faq_enabled", "Show the FAQ section on all service pages"),
      t("service_detail_faq_badge", "Small label", "FREQUENTLY ASKED QUESTIONS"),
      t("service_detail_faq_title", "Heading", "Questions About Our {service}", PLACEHOLDER_HELP),
      area(
        "service_detail_faq_subtitle",
        "Text under the heading",
        "Find fast answers to common questions about booking, vehicle capacity, and airport meet & greet."
      ),
    ],
  },
  {
    id: "service_detail_not_found",
    page: "Services",
    title: "Service page – loading and 'not found' messages",
    description: "Shown while a service page loads, or when the address does not match any service.",
    fields: [
      t("service_detail_loading_text", "Loading message", "Loading service details..."),
      t("service_detail_404_badge", "Not found – small label", "404 NOT FOUND"),
      t("service_detail_404_title", "Not found – heading", "Service Not Found"),
      area(
        "service_detail_404_text",
        "Not found – text",
        "The service you are looking for may have been moved, renamed, or is currently unavailable."
      ),
      t("service_detail_404_btn_text", "Not found – button text", "Browse All Services"),
      url("service_detail_404_btn_url", "Not found – button link", "/services"),
    ],
  },
];
