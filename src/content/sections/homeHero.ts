import type { ContentSection } from "../types";

// Homepage: the hero (first screen), the floating WhatsApp button and the "static page as homepage" view.
// Several keys predate this registry (homepage_hero_*, homepage_indicator*, hero_image*) and are kept as-is
// because the owner's saved data uses them. The same keys are also read by the Renax theme hero.
export const sections: ContentSection[] = [
  {
    id: "home-hero",
    page: "Homepage",
    title: "Hero – first screen",
    description: "The large photo at the top of the homepage with the main headline, intro text and the two buttons.",
    fields: [
      {
        key: "homepage_hero_badge",
        label: "Hero – small label above the headline",
        type: "text",
        default: "TRAVELLUXX PRIVATE HIRE",
        help: "Leave empty to show your business name followed by \"PRIVATE HIRE\".",
      },
      {
        key: "homepage_hero_title",
        label: "Hero – main headline (H1)",
        type: "text",
        default: "Nationwide Airport | Transfers & Private Hire",
        help:
          "The headline has two parts: the first is white, the second sits on its own line in light italic. " +
          "Put a | between them, e.g. \"Nationwide Airport | Transfers & Private Hire\". " +
          "Without a |, a spaced dash (\" – \", \" — \" or \" - \") is used instead: the text after the dash becomes the italic line " +
          "(\"Private Hire Birmingham – Nationwide Airport Transfers\"). With neither, the whole headline is one plain line. " +
          "This is the page's only H1, so keep your main search phrase in it.",
      },
      {
        key: "homepage_hero_subtitle",
        label: "Hero – intro paragraph",
        type: "textarea",
        default:
          "Experience premium private hire. Beautifully styled Mercedes-Benz and Audi luxury fleets for your ultimate comfort. Secure fixed rates with absolutely no surge pricing.",
      },
      {
        key: "homepage_hero_btn_text",
        label: "Hero – main button text",
        type: "text",
        default: "Calculate & Get Quote",
      },
      {
        key: "homepage_hero_btn_link",
        label: "Hero – main button link",
        type: "url",
        default: "calculator-section",
        help: "\"calculator-section\" scrolls to the booking form. You can also use #section-id, a page like /services, or a full https:// link.",
      },
      {
        key: "homepage_hero_phone_text",
        label: "Hero – phone button text",
        type: "text",
        default: "+44 121 714 0876",
        help: "Leave empty to show the WhatsApp/phone number from Settings, formatted the UK way (e.g. +44 121 714 0876).",
      },
      {
        key: "homepage_hero_phone_link",
        label: "Hero – phone button link",
        type: "url",
        default: "tel:441217140876",
        help: "Usually tel:44… Leave empty to call the WhatsApp/phone number from Settings.",
      },
      {
        key: "hero_image",
        label: "Hero – background photo",
        type: "image",
        default: "",
        help: "Leave empty to use the built-in photo of the car on the open road.",
      },
      {
        key: "hero_image_alt",
        label: "Hero – background photo description (alt text)",
        type: "text",
        default: "Travelluxx - Executive Luxury Chauffeur Service Solihull & London UK",
        help: "Read by search engines and screen readers. Leave empty to use your business name followed by \" - Executive Luxury Chauffeur Service Solihull & London UK\".",
      },
    ],
  },
  {
    id: "home-hero-facts",
    page: "Homepage",
    title: "Hero – facts bar",
    description: "The row of four short facts along the bottom edge of the hero, and the \"Scroll\" cue at its right end (wide screens only).",
    fields: [
      {
        key: "home_hero_facts_enabled",
        label: "Show the facts bar",
        type: "toggle",
        default: "true",
      },
      {
        key: "home_hero_fact1",
        label: "Facts bar – 1st item",
        type: "text",
        default: "No surge pricing",
      },
      {
        key: "homepage_indicator1",
        label: "Facts bar – 2nd item",
        type: "text",
        default: "Licensed Professional Operators",
        help: "Also used as the first trust indicator in the Renax theme.",
      },
      {
        key: "homepage_indicator2",
        label: "Facts bar – 3rd item",
        type: "text",
        default: "Guaranteed Nationwide Coverage",
        help: "Also used as the second trust indicator in the Renax theme.",
      },
      {
        key: "home_hero_fact4",
        label: "Facts bar – 4th item",
        type: "text",
        default: "Flight monitoring",
      },
      {
        key: "home_hero_scroll_text",
        label: "\"Scroll\" cue text",
        type: "text",
        default: "Scroll",
        help: "Shown at the right end of the facts bar on wide screens; clicking it scrolls to the booking form.",
      },
    ],
  },
  {
    id: "home-whatsapp",
    page: "Homepage",
    title: "Floating WhatsApp button",
    description: "The round WhatsApp button fixed to the bottom-right corner of the homepage.",
    fields: [
      {
        key: "home_whatsapp_enabled",
        label: "Show the WhatsApp button",
        type: "toggle",
        default: "true",
      },
      {
        key: "home_whatsapp_number",
        label: "WhatsApp number",
        type: "text",
        default: "441217140876",
        help: "International format without + or spaces, e.g. 441217140876. Any spaces, + or dashes are removed automatically.",
      },
      {
        key: "home_whatsapp_message",
        label: "Pre-filled message",
        type: "textarea",
        default: "Hi, I'm on your website and would like to arrange a chauffeur.",
        help: "The text that appears in the visitor's WhatsApp chat box when they tap the button.",
      },
      {
        key: "home_whatsapp_tooltip",
        label: "Tooltip text (on hover)",
        type: "text",
        default: "WhatsApp Hotline",
      },
      {
        key: "home_whatsapp_title",
        label: "Browser hover title",
        type: "text",
        default: "Instant WhatsApp Hotline",
      },
      {
        key: "home_whatsapp_aria_label",
        label: "Screen-reader label",
        type: "text",
        default: "Chat on WhatsApp",
      },
    ],
  },
  {
    id: "home-static",
    page: "Homepage",
    title: "Static page as homepage",
    description: 'Only used when "Your homepage displays" (in Settings) is set to a static page. The page\'s own title and content are edited under Pages.',
    fields: [
      {
        key: "home_static_loading_text",
        label: "Loading message",
        type: "text",
        default: "Loading home...",
      },
    ],
  },
];
