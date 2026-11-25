import type { ContentSection, ContentField } from "../types";

const FEATURES_HELP = 'Separate each amenity with a comma (or "•").';

function classFields(
  id: "economy" | "luxury" | "family",
  label: string,
  d: { tab: string; name: string; tagline: string; description: string; features: string }
): ContentField[] {
  return [
    { key: `home_fleet_tab_${id}`, label: `${label} – tab label`, type: "text", default: d.tab },
    { key: `fleet_${id}_name`, label: `${label} – class name`, type: "text", default: d.name },
    { key: `fleet_${id}_tagline`, label: `${label} – tagline`, type: "text", default: d.tagline },
    { key: `fleet_${id}_description`, label: `${label} – description`, type: "textarea", default: d.description },
    { key: `fleet_${id}_features`, label: `${label} – on-board amenities`, type: "textarea", default: d.features, help: FEATURES_HELP },
    {
      key: `fleet_${id}_image`,
      label: `${label} – photo`,
      type: "image",
      default: "",
      help: "Leave empty to use the built-in photo of this class.",
    },
    {
      key: `fleet_${id}_alt`,
      label: `${label} – photo alt text`,
      type: "text",
      default: "",
      help: 'Leave empty to use "<class name> - …" automatically.',
    },
  ];
}

export const sections: ContentSection[] = [
  {
    id: "home_fleet",
    page: "Homepage",
    title: "Our Fleet",
    description: "The vehicle classes section with the Economy / Luxury / Family tabs (#fleet). Per-mile rates come from the Pricing tab.",
    fields: [
      { key: "home_fleet_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "homepage_fleet_subtitle", label: "Small label above the heading", type: "text", default: "Our Premium Fleet" },
      { key: "homepage_fleet_title", label: "Heading", type: "text", default: "Travel in Premium Comfort" },
      {
        key: "homepage_fleet_description",
        label: "Intro paragraph",
        type: "textarea",
        default: "Our curated Mercedes-Benz and Audi fleet is maintained to the highest safety and cosmetic standards.",
      },
      { key: "home_fleet_amenities_heading", label: "Amenities list heading", type: "text", default: "Included On-Board Amenities:" },
      { key: "home_fleet_book_button", label: "Book button text", type: "text", default: "Book This Class Now" },
    ],
  },
  {
    id: "home_fleet_economy",
    page: "Homepage",
    title: "Our Fleet – Economy class",
    fields: classFields("economy", "Economy", {
      tab: "Economy",
      name: "Business Economy Class",
      tagline: "Elegant, clean, and highly efficient travel.",
      description:
        "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency.",
      features: "Complimentary 4G Wi-Fi, Dual-zone Climate Control, USB Charging Ports, Bottle Holders & Newspapers",
    }),
  },
  {
    id: "home_fleet_luxury",
    page: "Homepage",
    title: "Our Fleet – Luxury class",
    fields: classFields("luxury", "Luxury", {
      tab: "Luxury",
      name: "First Class Luxury Chauffeur",
      tagline: "The pinnacle of executive comfort and style.",
      description:
        "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs.",
      features:
        "Premium Leather Reclining Seats, Complimentary Bottled Water, Ambient Lighting Controls, Rear Seat Entertainment Systems, Quiet Acoustic Cabins",
    }),
  },
  {
    id: "home_fleet_family",
    page: "Homepage",
    title: "Our Fleet – Family class",
    fields: classFields("family", "Family", {
      tab: "Family",
      name: "Family & Executive MPV",
      tagline: "Generous space for luggage and loved ones.",
      description:
        "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort.",
      features:
        "Conference Seating Options, Massive Boot Capacity, Automatic Sliding Doors, Privacy Glass, Individual Air-Con Units, Child Seats Available (On Request)",
    }),
  },
];
