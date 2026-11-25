import type { ContentSection } from "../types";

export const sections: ContentSection[] = [
  {
    id: "home-marquee",
    page: "Homepage",
    title: "Moving band of places",
    description:
      "The dark band with place names sliding slowly across the page. The airport names are added automatically from the six airport names in the dashboard settings; the towns below are added after them.",
    fields: [
      { key: "home_marquee_enabled", label: "Show the moving band of places", type: "toggle", default: "true" },
      {
        key: "home_marquee_show_airports",
        label: "Start the band with the six airport names",
        type: "toggle",
        default: "true",
        help: "The airport names come from the airport settings (airport_name_1 to airport_name_6), so they stay in step with the airports section.",
      },
      {
        key: "home_marquee_places",
        label: "Towns and cities shown after the airports",
        type: "lines",
        default: "Solihull\nCoventry\nWarwick\nLeamington Spa\nWorcester\nCheltenham",
        help: "One place per line. Names repeated from the airport list are shown only once.",
      },
      {
        key: "home_marquee_aria_label",
        label: "Description for screen readers",
        type: "text",
        default: "Places we drive to",
      },
    ],
  },
  {
    id: "home-closing-cta",
    page: "Homepage",
    title: "Closing call to action (above the footer)",
    description: "The last band before the footer: a large heading and the two ways to book.",
    fields: [
      { key: "home_cta_enabled", label: "Show the closing call to action", type: "toggle", default: "true" },
      { key: "home_cta_eyebrow", label: "Small label above the heading", type: "text", default: "Book your chauffeur" },
      { key: "home_cta_title_line1", label: "Heading – first line", type: "text", default: "Know your fare" },
      {
        key: "home_cta_title_line2",
        label: "Heading – second line (italic, lighter colour)",
        type: "text",
        default: "before you travel.",
      },
      {
        key: "home_cta_text",
        label: "Text under the heading",
        type: "textarea",
        default: "An instant fixed quote with no surge pricing. Pay online or pay later. Booking is open 24/7.",
      },
      { key: "home_cta_button_text", label: "Main button – text", type: "text", default: "Get a fixed quote" },
      {
        key: "home_cta_button_link",
        label: "Main button – link",
        type: "url",
        default: "#calculator-section",
        help: "\"#calculator-section\" scrolls smoothly to the quote form on the homepage. Any other link (e.g. /services) opens that page.",
      },
      {
        key: "home_cta_phone_text",
        label: "Phone button – text",
        type: "text",
        default: "",
        help: "Leave empty to use the hero phone text (or the WhatsApp number, formatted).",
      },
      {
        key: "home_cta_phone_link",
        label: "Phone button – link",
        type: "url",
        default: "",
        help: "Leave empty to use the hero phone link (or tel: plus the WhatsApp number).",
      },
    ],
  },
];
