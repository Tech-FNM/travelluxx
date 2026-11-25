import type { ContentField, ContentSection } from "../types";

// Homepage: the services gallery ("What we do", the sideways-scrolling cards) and the dark airports
// band (#airports). The card and airport keys (service_*_N, airport_*_N, homepage_airports_title)
// predate this registry and are kept as-is because the owner's saved data uses them. Defaults are the
// values the site shows today.

const SERVICE_CARDS: Array<{ title: string; desc: string; pickup: string; dropoff: string }> = [
  {
    title: "Airport Transfers",
    desc: "Reliable fixed-price transfers to Birmingham, Heathrow, Gatwick and all major UK airports.",
    pickup: "Shirley, Solihull B90",
    dropoff: "London Heathrow Airport (LHR)",
  },
  {
    title: "Port Transfers",
    desc: "Dependable transfers to and from Southampton, Dover and other UK cruise terminals.",
    pickup: "Shirley, Solihull B90",
    dropoff: "Southampton Cruise Port",
  },
  {
    title: "Station Transfers",
    desc: "Seamless private hire Birmingham pickups for rail stations, including New Street, and onward journeys to London and across the UK.",
    pickup: "Shirley, Solihull B90",
    dropoff: "London Euston Station",
  },
  {
    title: "Popular Cities",
    desc: "Travel to Solihull, Worcester, Cheltenham, Warwick, Leamington Spa, Coventry and cities across the UK in comfort and style.",
    pickup: "Shirley, Solihull B90",
    dropoff: "London Central, UK",
  },
  {
    title: "Business Travel",
    desc: "Our chauffeur service Birmingham gives executives and corporate teams punctual, professional and discreet travel.",
    pickup: "Shirley, Solihull B90",
    dropoff: "Birmingham Airport (BHX)",
  },
];

const BUILT_IN_PHOTO = [
  "the built-in airport photo",
  "the built-in port photo",
  "the built-in station photo",
  "the built-in photo of the car on the open road",
  "the built-in business travel photo",
];

const AIRPORTS: Array<[string, string]> = [
  ["Birmingham (BHX)", "BHX"],
  ["Heathrow", "LHR"],
  ["Gatwick", "LGW"],
  ["Luton", "LTN"],
  ["Stansted", "STN"],
  ["London City", "LCY"],
];

const cardFields: ContentField[] = SERVICE_CARDS.flatMap((card, i) => {
  const n = i + 1;
  return [
    { key: `service_title_${n}`, label: `Card ${n} – title`, type: "text", default: card.title },
    { key: `service_desc_${n}`, label: `Card ${n} – description`, type: "textarea", default: card.desc },
    {
      key: `service_image_${n}`,
      label: `Card ${n} – photo`,
      type: "image",
      default: "",
      help: `Leave empty to use ${BUILT_IN_PHOTO[i]}.`,
    },
    {
      key: `service_pickup_${n}`,
      label: `Card ${n} – calculator pickup (not shown on the site)`,
      type: "text",
      default: card.pickup,
      help: "Reserved for a pickup address that would be filled into the booking form when the card is clicked. The cards are not clickable at the moment, so this value is not shown or used anywhere.",
    },
    {
      key: `service_dropoff_${n}`,
      label: `Card ${n} – calculator drop-off (not shown on the site)`,
      type: "text",
      default: card.dropoff,
      help: "Reserved for a drop-off address that would be filled into the booking form when the card is clicked. The cards are not clickable at the moment, so this value is not shown or used anywhere.",
    },
  ] as ContentField[];
});

const airportFields: ContentField[] = AIRPORTS.flatMap(([name, code], i) => {
  const n = i + 1;
  return [
    {
      key: `airport_name_${n}`,
      label: `Airport ${n} – name`,
      type: "text",
      default: name,
      help: "Shown small above the code. Also used in the scrolling places strip and the service statement on the homepage.",
    },
    {
      key: `airport_code_${n}`,
      label: `Airport ${n} – code (large)`,
      type: "text",
      default: code,
    },
  ] as ContentField[];
});

export const sections: ContentSection[] = [
  {
    id: "home-services-gallery",
    page: "Homepage",
    title: "Services gallery (\"What we do\")",
    description:
      "The white section after the fleet: a heading on the left and five photo cards that slide sideways as you scroll (swipe on phones).",
    fields: [
      { key: "home_services_enabled", label: "Show the services gallery", type: "toggle", default: "true" },
      { key: "home_services_eyebrow", label: "Small label above the heading", type: "text", default: "What we do" },
      {
        key: "home_services_title",
        label: "Heading",
        type: "text",
        default: "Private hire for every kind of journey",
      },
      {
        key: "home_services_lead",
        label: "Intro paragraph",
        type: "textarea",
        default:
          "Airports, ports, stations, cities and business travel. One standard of car and chauffeur, at a fare fixed before you travel.",
      },
      { key: "home_services_link_text", label: "Link text", type: "text", default: "View all services" },
      { key: "home_services_link_url", label: "Link address", type: "url", default: "/services" },
      {
        key: "home_services_counter_enabled",
        label: "Show the card counter (\"01 — 05\")",
        type: "toggle",
        default: "true",
        help: "The numbers are counted automatically from the cards.",
      },
      {
        key: "home_services_image_alt_suffix",
        label: "Card photo description (alt text) – added after each card title",
        type: "text",
        default: "Luxury Airport Transfer Solihull & London UK",
        help: "Read by search engines and screen readers as \"<card title> - <this text>\". Leave empty to use only the card title.",
      },
    ],
  },
  {
    id: "home-services-cards",
    page: "Homepage",
    title: "Services gallery – the five cards",
    description: "Title, description and photo of each card, in order from left to right.",
    fields: cardFields,
  },
  {
    id: "home-airports",
    page: "Homepage",
    title: "Airports band (\"Coverage\")",
    description: "The dark section with the six airport codes set very large (#airports).",
    fields: [
      { key: "home_airports_enabled", label: "Show the airports band", type: "toggle", default: "true" },
      { key: "home_airports_eyebrow", label: "Small label above the heading", type: "text", default: "Coverage" },
      {
        key: "homepage_airports_title",
        label: "Heading",
        type: "text",
        default: "Airport Transfers from Birmingham and Across the UK",
      },
      {
        key: "home_airports_lead",
        label: "Paragraph beside the heading",
        type: "textarea",
        default: "Fixed-fare transfers to and from each of these airports, with flight monitoring on every airport pickup.",
      },
      {
        key: "home_airports_item_label",
        label: "Small label under each code",
        type: "text",
        default: "Airport Taxi",
        help: "The same label is shown under all six airports.",
      },
    ],
  },
  {
    id: "home-airports-list",
    page: "Homepage",
    title: "Airports band – the six airports",
    description: "Name and code of each airport, in order (left to right, top to bottom).",
    fields: airportFields,
  },
];
