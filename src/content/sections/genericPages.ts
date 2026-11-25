import type { ContentSection } from "../types";

// Shared texts for the CMS pages at /<slug> (About Us, Privacy Policy, Terms…).
// Each page's own title, content and FAQs are edited in Pages → Edit page, not here.
export const sections: ContentSection[] = [
  {
    id: "page-shared",
    page: "Pages",
    title: "All pages – shared texts",
    description:
      "Texts used on every page created under Pages (About Us, Privacy Policy, Terms…). The page title and content are edited on each page.",
    fields: [
      {
        key: "page_faq_eyebrow",
        label: "FAQ section – small label above the heading",
        type: "text",
        default: "Frequently Asked Questions",
      },
      {
        key: "page_faq_heading_fallback",
        label: "FAQ section – heading when the page has no FAQ title",
        type: "text",
        default: "{title} FAQ",
        help: "{title} is replaced with the page title.",
      },
      {
        key: "page_meta_title_pattern",
        label: "Browser tab / Google title when the page has no SEO title",
        type: "text",
        default: "{title} | TravelLuxx",
        help: "{title} is replaced with the page title. A page's own SEO title always wins.",
      },
      {
        key: "page_loading_label",
        label: "Loading spinner – text read out by screen readers",
        type: "text",
        default: "Loading",
      },
    ],
  },
  {
    id: "page-not-found",
    page: "Pages",
    title: "Page not found",
    description: "Shown when a visitor opens a page address that does not exist.",
    fields: [
      {
        key: "page_not_found_title",
        label: "Heading",
        type: "text",
        default: "Page Not Found",
      },
      {
        key: "page_not_found_text",
        label: "Text under the heading",
        type: "textarea",
        default: "The page you are looking for does not exist or may have been moved.",
      },
      {
        key: "page_not_found_button_text",
        label: "Button text",
        type: "text",
        default: "Back to Home",
      },
      {
        key: "page_not_found_button_link",
        label: "Button link",
        type: "url",
        default: "/",
      },
      {
        key: "page_not_found_meta_title",
        label: "Browser tab title",
        type: "text",
        default: "Page not found | TravelLuxx",
      },
      {
        key: "page_not_found_eyebrow",
        label: "Small label above the heading",
        type: "text",
        default: "Error 404",
      },
      {
        key: "page_not_found_links_enabled",
        label: "Show the extra links under the button",
        type: "toggle",
        default: "true",
      },
      {
        key: "page_not_found_link1_text",
        label: "Extra link 1 – text",
        type: "text",
        default: "View services",
      },
      {
        key: "page_not_found_link1_href",
        label: "Extra link 1 – link",
        type: "url",
        default: "/services",
      },
      {
        key: "page_not_found_link2_text",
        label: "Extra link 2 – text",
        type: "text",
        default: "Get a quote",
      },
      {
        key: "page_not_found_link2_href",
        label: "Extra link 2 – link",
        type: "url",
        default: "/#calculator",
      },
    ],
  },
  {
    id: "site-seo-business",
    page: "Pages",
    title: "Site-wide SEO & business details",
    description:
      "Used in the hidden search-engine data of every page (Google business details, link previews on Facebook/WhatsApp/X). Business name, email, WhatsApp number, office address and logo come from Settings → General.",
    fields: [
      {
        key: "site_base_url",
        label: "Website address (used for canonical and share links)",
        type: "url",
        default: "https://travelluxx.co.uk",
        help: "Full address without a trailing slash, e.g. https://travelluxx.co.uk",
      },
      {
        key: "seo_default_share_image",
        label: "Default share image (when a page has no image of its own)",
        type: "image",
        default: "/assets/images/travelluxx_logo_1784064660967.webp",
      },
      {
        key: "business_legal_name",
        label: "Business – legal name",
        type: "text",
        default: "TravelLuxx Private Hire",
      },
      {
        key: "business_description",
        label: "Business – short description for Google",
        type: "textarea",
        default:
          "Book premium airport transfers and luxury chauffeur services across the UK with TravelLuxx. Reliable, comfortable and professional travel for every journey.",
      },
      {
        key: "business_phone",
        label: "Business – phone number for Google (leave empty to use the WhatsApp number)",
        type: "text",
        default: "",
        help: "International format, e.g. +441217140876",
      },
      {
        key: "business_street",
        label: "Address – street",
        type: "text",
        default: "Shirley B90",
      },
      {
        key: "business_locality",
        label: "Address – town / city",
        type: "text",
        default: "Solihull",
      },
      {
        key: "business_region",
        label: "Address – county / region",
        type: "text",
        default: "West Midlands",
      },
      {
        key: "business_postcode",
        label: "Address – postcode",
        type: "text",
        default: "",
      },
      {
        key: "business_country",
        label: "Address – country code",
        type: "text",
        default: "GB",
      },
      {
        key: "business_latitude",
        label: "Map position – latitude",
        type: "text",
        default: "52.4140",
      },
      {
        key: "business_longitude",
        label: "Map position – longitude",
        type: "text",
        default: "-1.8150",
      },
      {
        key: "business_opening_hours",
        label: "Opening hours (one per line, e.g. Mo-Su 00:00-23:59)",
        type: "lines",
        default: "Mo-Su 00:00-23:59",
      },
      {
        key: "business_price_range",
        label: "Price range",
        type: "text",
        default: "££",
      },
      {
        key: "business_payment_accepted",
        label: "Payment methods accepted",
        type: "text",
        default: "Cash, Credit Card, Debit Card",
      },
      {
        key: "business_area_served",
        label: "Areas served (one per line)",
        type: "lines",
        default: "United Kingdom\nWest Midlands\nBirmingham\nSolihull\nLondon",
      },
      {
        key: "business_same_as",
        label: "Social profile links (one per line: Google Business, Facebook, Instagram…)",
        type: "lines",
        default: "",
      },
    ],
  },
];
