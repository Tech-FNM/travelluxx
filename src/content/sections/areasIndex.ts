import type { ContentField, ContentSection } from "../types";

// Service Areas index page (/service-areas).
// The hero's tag, headline, description, main button, image and the SEO title/description are edited in
// Service Areas > Page settings (service_areas_page_settings); only the remaining hero texts live here.

const PAGE = "Service Areas";

const COVERAGE_POINTS = [
  ["Fixed fares", "Your fare is agreed when you book. No surge pricing and no meter running."],
  [
    "Licensed drivers",
    "Every journey is driven by a licensed private hire chauffeur in a Mercedes-Benz or Audi.",
  ],
  [
    "Flight monitoring",
    "On airport pickups we follow your flight, so an early or late arrival is allowed for.",
  ],
  ["24/7 booking", "Book online at any hour, then pay online or pay later."],
];

const FAQS: [string, string][] = [
  [
    "Which areas and regions across the UK does TravelLuxx cover?",
    "TravelLuxx provides executive chauffeur hire and airport transfers across Solihull, Birmingham, Coventry, Warwickshire, and connects passengers to all UK airports and major cities nationwide.",
  ],
  [
    "Can I book a transfer starting or ending outside your listed service areas?",
    "Yes, our private hire license covers nationwide pre-booked journeys. Whether you need an intercity transfer to London, Manchester, or Southampton cruise ports, we provide door-to-door service.",
  ],
  [
    "Are your fares fixed regardless of the service area?",
    "Yes, every journey is calculated on a 100% fixed-rate basis at the time of booking. There are no surprise meter charges, surge pricing, or hidden fees.",
  ],
  [
    "How do I book an executive transfer in my area?",
    "You can book instantly online using our instant Fare Calculator, or get in touch with our 24/7 team via WhatsApp or phone for bespoke itineraries and multi-stop journeys.",
  ],
  ["", ""],
  ["", ""],
];

/** Number of question slots on the page. */
export const AREAS_INDEX_FAQ_SLOTS = FAQS.length;

const coverageFields: ContentField[] = COVERAGE_POINTS.flatMap(([title, text], i) => [
  {
    key: `areas_index_coverage_${i + 1}_title`,
    label: `Point ${i + 1} – title`,
    type: "text" as const,
    default: title,
  },
  {
    key: `areas_index_coverage_${i + 1}_text`,
    label: `Point ${i + 1} – text`,
    type: "textarea" as const,
    default: text,
  },
]);

const faqFields: ContentField[] = FAQS.flatMap(([q, a], i) => [
  {
    key: `areas_index_faq_${i + 1}_enabled`,
    label: `Question ${i + 1} – show`,
    type: "toggle" as const,
    default: "true",
  },
  {
    key: `areas_index_faq_${i + 1}_question`,
    label: `Question ${i + 1} – question`,
    type: "text" as const,
    default: q,
    help: q ? undefined : "Spare slot: type a question (and answer) to add it to the page.",
  },
  {
    key: `areas_index_faq_${i + 1}_answer`,
    label: `Question ${i + 1} – answer`,
    type: "textarea" as const,
    default: a,
  },
]);

export const sections: ContentSection[] = [
  {
    id: "areas-index-hero",
    page: PAGE,
    title: "Service areas page – top banner (extra texts)",
    description:
      "The tag, headline, description, main button and photo of this banner are edited in Service Areas > Page settings. These are the remaining texts.",
    fields: [
      {
        key: "areas_index_hero_secondary_button_text",
        label: "Second button – text",
        type: "text",
        default: "Browse the areas",
      },
      {
        key: "areas_index_hero_secondary_button_url",
        label: "Second button – link",
        type: "url",
        default: "#areas",
        help: "#areas scrolls down to the list of areas.",
      },
      {
        key: "areas_index_jump_label_one",
        label: "Area count label – one area",
        type: "text",
        default: "area",
        help: "Shown after the number, e.g. \"1 area\".",
      },
      {
        key: "areas_index_jump_label_many",
        label: "Area count label – several areas",
        type: "text",
        default: "areas",
        help: "Shown after the number, e.g. \"6 areas\".",
      },
      {
        key: "areas_index_jump_aria_label",
        label: "Area links – name read by screen readers",
        type: "text",
        default: "Jump to an area",
      },
    ],
  },
  {
    id: "areas-index-directory",
    page: PAGE,
    title: "Service areas page – list of areas",
    description: "Each area's own name, badge, photo and description are edited in Service Areas.",
    fields: [
      { key: "areas_index_directory_eyebrow", label: "Small label above the heading", type: "text", default: "The directory" },
      {
        key: "areas_index_directory_title",
        label: "Heading",
        type: "text",
        default: "Chauffeur service, area by area",
      },
      {
        key: "areas_index_directory_lead",
        label: "Text beside the heading",
        type: "textarea",
        default:
          "Each area has its own guide to local journeys, airport transfers and the questions we are asked most often.",
      },
      { key: "areas_index_row_link_text", label: "Link text on each area", type: "text", default: "View area" },
      {
        key: "areas_index_row_description_fallback",
        label: "Area description when the area has none",
        type: "textarea",
        default:
          "Private chauffeur travel and airport transfers covering all destinations in and around {area}.",
        help: "{area} is replaced by the area's name.",
      },
      {
        key: "areas_index_row_image_alt_fallback",
        label: "Photo description (alt text) when the area has none",
        type: "text",
        default: "{area} - Executive Chauffeur Service Area",
        help: "{area} is replaced by the area's name.",
      },
      { key: "areas_index_empty_title", label: "No areas yet – heading", type: "text", default: "No service areas found" },
      {
        key: "areas_index_empty_text",
        label: "No areas yet – text",
        type: "text",
        default: "Please check back soon or add areas from the admin dashboard.",
      },
    ],
  },
  {
    id: "areas-index-statement",
    page: PAGE,
    title: "Service areas page – \"Not on the list\" statement",
    fields: [
      { key: "areas_index_statement_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "areas_index_statement_eyebrow", label: "Small label", type: "text", default: "Not on the list" },
      {
        key: "areas_index_statement_text",
        label: "Statement",
        type: "textarea",
        default:
          "Our private hire licence covers pre-booked journeys nationwide. If your town is not listed here, we can still plan your door-to-door transfer.",
      },
      {
        key: "areas_index_statement_link_text",
        label: "Link text",
        type: "text",
        default: "Price a journey from your address",
      },
      { key: "areas_index_statement_link_url", label: "Link", type: "url", default: "/#calculator-section" },
    ],
  },
  {
    id: "areas-index-coverage",
    page: PAGE,
    title: "Service areas page – how we cover the region",
    description: "Dark section with four numbered points.",
    fields: [
      { key: "areas_index_coverage_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "areas_index_coverage_eyebrow", label: "Small label above the heading", type: "text", default: "How we cover the region" },
      {
        key: "areas_index_coverage_title",
        label: "Heading",
        type: "text",
        default: "The same standard at every address",
      },
      {
        key: "areas_index_coverage_lead",
        label: "Text beside the heading",
        type: "textarea",
        default:
          "Based in Shirley, Solihull, we drive across Birmingham and the Midlands, and on to airports and cities nationwide.",
      },
      ...coverageFields,
    ],
  },
  {
    id: "areas-index-marquee",
    page: PAGE,
    title: "Service areas page – moving band of airports",
    fields: [
      { key: "areas_index_marquee_enabled", label: "Show the moving band", type: "toggle", default: "true" },
      {
        key: "areas_index_marquee_items",
        label: "Airports",
        type: "lines",
        default: [
          "Birmingham | BHX",
          "Heathrow | LHR",
          "Gatwick | LGW",
          "Luton | LTN",
          "Stansted | STN",
          "London City | LCY",
        ].join("\n"),
        help: "One per line: name | short code. The code is optional.",
      },
    ],
  },
  {
    id: "areas-index-faq",
    page: PAGE,
    title: "Service areas page – frequently asked questions",
    description:
      "Also used for the FAQ data Google reads on this page. A question shows only when it has text and its switch is on.",
    fields: [
      { key: "areas_index_faq_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "areas_index_faq_eyebrow", label: "Small label above the heading", type: "text", default: "Service Coverage FAQs" },
      { key: "areas_index_faq_title", label: "Heading", type: "text", default: "Frequently Asked Questions" },
      {
        key: "areas_index_faq_intro",
        label: "Text under the heading",
        type: "textarea",
        default:
          "Common questions about our executive chauffeur coverage, airport transfers, and private hire service areas.",
      },
      {
        key: "areas_index_faq_phone_prefix",
        label: "Phone link – text before the number",
        type: "text",
        default: "Ask us on",
        help: "The number itself comes from the site's contact settings.",
      },
      ...faqFields,
    ],
  },
];
