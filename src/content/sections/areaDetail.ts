import type { ContentSection } from "../types";

// Shared texts for every individual service-area page (/service-areas/<slug>).
// Per-area values edited under "Service Areas" in the dashboard (badge, title, description,
// buttons, article, FAQs) take priority; these are what an area shows when it has none.
// Placeholders: {area} = the place ("Solihull"), {title} = the area's full title
// ("Chauffeur Solihull"), {phone} = the business phone number.
const PLACEHOLDER_HELP = "{area} is replaced with the place name (e.g. Solihull).";

export const sections: ContentSection[] = [
  {
    id: "area-detail-breadcrumb",
    page: "Service Areas",
    title: "Area page – breadcrumb",
    description: "The small path at the top of every area page: Home / Service areas / <place>.",
    fields: [
      { key: "area_detail_breadcrumb_home", label: "Breadcrumb – first item", type: "text", default: "Home" },
      { key: "area_detail_breadcrumb_areas", label: "Breadcrumb – second item", type: "text", default: "Service areas" },
    ],
  },
  {
    id: "area-detail-hero",
    page: "Service Areas",
    title: "Area page – hero buttons and facts strip",
    description:
      "Used on every area page. An area's own button texts/links (set in Service Areas) take priority over these.",
    fields: [
      { key: "area_detail_hero_button_text", label: "Main button – text (when the area has none)", type: "text", default: "Plan your journey" },
      { key: "area_detail_hero_button_url", label: "Main button – link (when the area has none)", type: "url", default: "/#calculator-section" },
      {
        key: "area_detail_hero_call_text",
        label: "Second button – text (when the area has none)",
        type: "text",
        default: "Call {phone}",
        help: "{phone} is replaced with the business phone number. The button dials that number.",
      },
      { key: "area_detail_facts_enabled", label: "Show the facts strip along the bottom of the hero", type: "toggle", default: "true" },
      { key: "area_detail_fact1_title", label: "Fact 1 – title", type: "text", default: "Fixed fares" },
      { key: "area_detail_fact1_text", label: "Fact 1 – text", type: "text", default: "Agreed when you book" },
      { key: "area_detail_fact2_title", label: "Fact 2 – title", type: "text", default: "Licensed drivers" },
      { key: "area_detail_fact2_text", label: "Fact 2 – text", type: "text", default: "Private hire chauffeurs" },
      { key: "area_detail_fact3_title", label: "Fact 3 – title", type: "text", default: "Flight monitoring" },
      { key: "area_detail_fact3_text", label: "Fact 3 – text", type: "text", default: "On airport pickups" },
      { key: "area_detail_fact4_title", label: "Fact 4 – title", type: "text", default: "24/7 booking" },
      { key: "area_detail_fact4_text", label: "Fact 4 – text", type: "text", default: "Online or by phone" },
    ],
  },
  {
    id: "area-detail-booking",
    page: "Service Areas",
    title: "Area page – article picture and booking card",
    description: "The picture above the area's article, and the dark booking card beside it.",
    fields: [
      {
        key: "area_detail_article_image_alt",
        label: "Article picture – alt text",
        type: "text",
        default: "TravelLuxx chauffeur service in {area}",
        help: PLACEHOLDER_HELP,
      },
      { key: "area_detail_booking_eyebrow", label: "Booking card – small label", type: "text", default: "Book in {area}", help: PLACEHOLDER_HELP },
      {
        key: "area_detail_booking_title",
        label: "Booking card – heading",
        type: "text",
        default: "A fixed fare for your {area} journey",
        help: PLACEHOLDER_HELP,
      },
      { key: "area_detail_booking_row1_label", label: "Row 1 – label", type: "text", default: "Fare" },
      { key: "area_detail_booking_row1_value", label: "Row 1 – value", type: "text", default: "Fixed when you book" },
      { key: "area_detail_booking_row2_label", label: "Row 2 – label", type: "text", default: "Vehicles" },
      { key: "area_detail_booking_row2_value", label: "Row 2 – value", type: "text", default: "Mercedes-Benz and Audi" },
      { key: "area_detail_booking_row3_label", label: "Row 3 – label", type: "text", default: "Airport pickups" },
      { key: "area_detail_booking_row3_value", label: "Row 3 – value", type: "text", default: "Flight monitored" },
      { key: "area_detail_booking_row4_label", label: "Row 4 – label", type: "text", default: "Payment" },
      { key: "area_detail_booking_row4_value", label: "Row 4 – value", type: "text", default: "Online or pay later" },
      { key: "area_detail_booking_button_text", label: "Booking card – button text", type: "text", default: "Get a fixed quote" },
      { key: "area_detail_booking_button_url", label: "Booking card – button link", type: "url", default: "/#calculator-section" },
    ],
  },
  {
    id: "area-detail-statement",
    page: "Service Areas",
    title: "Area page – statement",
    description: "The large sentence on the ivory band below the article.",
    fields: [
      { key: "area_detail_statement_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "area_detail_statement_eyebrow", label: "Small label", type: "text", default: "Every journey" },
      {
        key: "area_detail_statement_text",
        label: "Statement",
        type: "textarea",
        default:
          "Wherever you are heading from {area}, a licensed chauffeur arrives in a Mercedes-Benz or Audi, and the fare is the one you agreed when you booked.",
        help: PLACEHOLDER_HELP,
      },
    ],
  },
  {
    id: "area-detail-others",
    page: "Service Areas",
    title: "Area page – other areas gallery",
    description: "The sideways gallery of the other areas. The cards themselves come from the Service Areas list.",
    fields: [
      { key: "area_detail_others_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "area_detail_others_eyebrow", label: "Small label", type: "text", default: "Other areas we cover" },
      { key: "area_detail_others_title", label: "Heading", type: "text", default: "Beyond {area}", help: PLACEHOLDER_HELP },
      { key: "area_detail_others_link_text", label: "Link beside the heading – text", type: "text", default: "All service areas" },
      {
        key: "area_detail_others_card_alt",
        label: "Card picture – alt text (when the area has none)",
        type: "text",
        default: "Chauffeur service in {area}",
        help: "{area} is replaced with the place on that card.",
      },
      { key: "area_detail_others_last_label", label: "Last card – small label", type: "text", default: "The directory" },
      { key: "area_detail_others_last_title", label: "Last card – heading", type: "text", default: "See every area we cover" },
    ],
  },
  {
    id: "area-detail-faq",
    page: "Service Areas",
    title: "Area page – FAQ",
    description:
      "An area's own FAQ title and questions (set in Service Areas) take priority. The fallback questions below are shown only for an area that has no FAQs of its own.",
    fields: [
      { key: "area_detail_faq_enabled", label: "Show this section", type: "toggle", default: "true" },
      {
        key: "area_detail_faq_eyebrow",
        label: "Small label",
        type: "text",
        default: "Frequently Asked Questions",
        help: "Hidden automatically when it reads the same as the heading.",
      },
      {
        key: "area_detail_faq_title",
        label: "Heading (when the area has no FAQ title)",
        type: "text",
        default: "{title} Chauffeur & Transfers FAQ",
        help: "{title} is replaced with the area's full title (e.g. Chauffeur Solihull); {area} with the place name.",
      },
      {
        key: "area_detail_faq_intro",
        label: "Introduction",
        type: "textarea",
        default: "Got questions about traveling in or around {title}? Here are quick answers to the most common questions.",
        help: "{title} is replaced with the area's full title; {area} with the place name.",
      },
      {
        key: "area_detail_faq_ask_text",
        label: "Phone link – text",
        type: "text",
        default: "Ask us on {phone}",
        help: "{phone} is replaced with the business phone number.",
      },
      { key: "area_detail_faq1_question", label: "Fallback question 1", type: "text", default: "How do I book an airport transfer in this area?" },
      {
        key: "area_detail_faq1_answer",
        label: "Fallback answer 1",
        type: "textarea",
        default:
          "You can book easily online using our instant Fare Calculator above. Enter your pickup address and desired airport, select your luxury vehicle, and receive instant confirmation.",
      },
      { key: "area_detail_faq2_question", label: "Fallback question 2", type: "text", default: "Do you monitor flights for airport pickups?" },
      {
        key: "area_detail_faq2_answer",
        label: "Fallback answer 2",
        type: "textarea",
        default:
          "Yes, our team monitors all inbound commercial flights in real-time. Whether your flight is early or delayed, your chauffeur will be waiting inside arrivals with a name board.",
      },
      { key: "area_detail_faq3_question", label: "Fallback question 3", type: "text", default: "Are your prices fixed and all-inclusive?" },
      {
        key: "area_detail_faq3_answer",
        label: "Fallback answer 3",
        type: "textarea",
        default:
          "Yes. All TravelLuxx fares are fixed upfront with zero hidden fees. Fuel, taxes, airport flight tracking, and standard waiting time are all included.",
      },
      {
        key: "area_detail_faq4_question",
        label: "Fallback question 4",
        type: "text",
        default: "Can I book a private chauffeur for business travel or private events?",
      },
      {
        key: "area_detail_faq4_answer",
        label: "Fallback answer 4",
        type: "textarea",
        default:
          "Yes, we provide flexible one-way, return, and full-day as-directed chauffeur hire for corporate meetings, private events, weddings, and long-distance UK journeys.",
      },
    ],
  },
  {
    id: "area-detail-cta",
    page: "Service Areas",
    title: "Closing call-to-action band (area pages and Service Areas index)",
    description:
      "The dark band with the car photograph at the bottom of every area page and of the Service Areas index page.",
    fields: [
      { key: "area_detail_cta_enabled", label: "Show on area pages", type: "toggle", default: "true" },
      { key: "area_detail_cta_eyebrow", label: "Small label – on area pages", type: "text", default: "Book in {area}", help: PLACEHOLDER_HELP },
      {
        key: "area_detail_cta_title",
        label: "Heading – on area pages",
        type: "text",
        default: "Your {area} chauffeur, at a fare fixed before you travel.",
        help: PLACEHOLDER_HELP,
      },
      { key: "area_detail_cta_index_eyebrow", label: "Small label – on the Service Areas index", type: "text", default: "Book your journey" },
      {
        key: "area_detail_cta_index_title",
        label: "Heading – on the Service Areas index",
        type: "text",
        default: "Wherever you are, the fare is fixed before you travel.",
      },
      {
        key: "area_detail_cta_text",
        label: "Paragraph",
        type: "textarea",
        default: "Get a price online or call us at any hour. Pay online, or pay later.",
      },
      { key: "area_detail_cta_button_text", label: "Main button – text", type: "text", default: "Get a fixed quote" },
      { key: "area_detail_cta_button_url", label: "Main button – link", type: "url", default: "/#calculator-section" },
      {
        key: "area_detail_cta_image",
        label: "Photograph",
        type: "image",
        default: "",
        help: "Leave empty to use the Mercedes-Benz saloon from the fleet photographs.",
      },
      {
        key: "area_detail_cta_image_alt",
        label: "Photograph – alt text",
        type: "text",
        default: "Mercedes-Benz executive saloon from the TravelLuxx fleet",
      },
    ],
  },
  {
    id: "area-detail-not-found",
    page: "Service Areas",
    title: "Area page – not found message",
    description: "Shown when someone opens an area address that does not exist.",
    fields: [
      { key: "area_detail_notfound_title", label: "Heading", type: "text", default: "Service area not found" },
      { key: "area_detail_notfound_text", label: "Message", type: "text", default: "This area page is not available." },
      { key: "area_detail_notfound_button", label: "Button text", type: "text", default: "Back to service areas" },
    ],
  },
];
