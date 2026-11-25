import type { ContentSection } from "../types";

// Texts used only by the alternative "Renax" homepage (active when Theme = Renax).
// The Renax hero, fleet classes, reviews, airport cards and FAQs read the same settings as the
// default homepage (homepage_hero_*, homepage_indicator*, hero_image, hero_image_alt, fleet_*,
// homepage_faq_*), so those are edited in their usual place and are not repeated here.
const PAGE = "Alternative theme (Renax)";

export const sections: ContentSection[] = [
  {
    id: "renax-booking",
    page: PAGE,
    title: "Booking form heading",
    description:
      "The heading above the quote form, right under the hero. The hero itself uses the same texts as the default homepage hero.",
    fields: [
      { key: "renax_booking_eyebrow", label: "Small label above the heading", type: "text", default: "Luxury Ride" },
      { key: "renax_booking_title", label: "Heading", type: "text", default: "Book Your Chauffeur Transfer" },
    ],
  },
  {
    id: "renax-about",
    page: PAGE,
    title: "About the company",
    description: "Text on the left, photograph with a caption on the right.",
    fields: [
      { key: "renax_about_enabled", label: "Show the about section", type: "toggle", default: "true" },
      { key: "renax_about_eyebrow", label: "Small label above the heading", type: "text", default: "About Travelluxx" },
      { key: "renax_about_title_line1", label: "Heading – first line", type: "text", default: "We Are More Than" },
      {
        key: "renax_about_title_line2",
        label: "Heading – second line (italic, lighter colour)",
        type: "text",
        default: "A Private Hire Company",
      },
      {
        key: "renax_about_text",
        label: "Paragraph",
        type: "textarea",
        default:
          "At {business_name}, we provide a first-class private hire and airport chauffeur service across the United Kingdom. With absolute luxury and punctuality, our services are customized for executive corporate transfers, weddings, and premium airport pickups.",
        help: "{business_name} is replaced by the business name from the general settings.",
      },
      {
        key: "renax_about_features",
        label: "Checklist (one item per line)",
        type: "lines",
        default: "Sports & Luxury Cars\nExecutive Economy Cars\nHigh Capacity MPVs\n24/7 Flight Monitoring",
      },
      { key: "renax_about_btn_text", label: "Button – text", type: "text", default: "Read More" },
      {
        key: "renax_about_btn_link",
        label: "Button – link",
        type: "url",
        default: "#contact",
        help: "\"#contact\" scrolls to the contact section on this page. Any other link (e.g. /services) opens that page.",
      },
      {
        key: "renax_about_image",
        label: "Photograph",
        type: "image",
        default: "",
        help: "Leave empty to use the built-in photograph.",
      },
      {
        key: "renax_about_image_alt",
        label: "Photograph – description (alt text)",
        type: "text",
        default: "Travelluxx Luxury Chauffeur Driver Service - Solihull & London",
      },
      { key: "renax_about_caption_label", label: "Caption under the photo – small label", type: "text", default: "Chauffeur Certified" },
      { key: "renax_about_caption_text", label: "Caption under the photo – text", type: "text", default: "Safe & Professional Travels" },
    ],
  },
  {
    id: "renax-fleet",
    page: PAGE,
    title: "Fleet",
    description:
      "The vehicle tabs. Each class's name, short line, description, amenities, photo and alt text come from the fleet settings of the default homepage (fleet_economy_*, fleet_luxury_*, fleet_family_*); the price per mile comes from Pricing. Edit the Renax-only texts below.",
    fields: [
      { key: "renax_fleet_enabled", label: "Show the fleet section", type: "toggle", default: "true" },
      { key: "renax_fleet_eyebrow", label: "Small label above the heading", type: "text", default: "Our Premium Fleet" },
      { key: "renax_fleet_title", label: "Heading", type: "text", default: "Explore Our Luxury Vehicles" },
      {
        key: "renax_fleet_text",
        label: "Text under the heading",
        type: "textarea",
        default:
          "Curated luxury fleets of state-of-the-art Mercedes-Benz and Audi models. Meticulously clean, safe, and chauffeured to your location.",
      },
      { key: "renax_fleet_tab_economy", label: "Tab label – Economy", type: "text", default: "Economy" },
      { key: "renax_fleet_tab_luxury", label: "Tab label – Luxury", type: "text", default: "Luxury" },
      { key: "renax_fleet_tab_family", label: "Tab label – Family", type: "text", default: "Family / MPV" },
      {
        key: "renax_fleet_luxury_name",
        label: "Luxury class name (Renax only)",
        type: "text",
        default: "First Chauffeur Class",
        help: "Used only when the fleet setting \"fleet_luxury_name\" is empty.",
      },
      { key: "renax_fleet_price_prefix", label: "Price – word before the price", type: "text", default: "From" },
      { key: "renax_fleet_price_suffix", label: "Price – text after the price", type: "text", default: "/ mile" },
      { key: "renax_fleet_passengers_label", label: "Label – passengers", type: "text", default: "PASSENGERS" },
      { key: "renax_fleet_luggage_label", label: "Label – luggage", type: "text", default: "LUGGAGE" },
      { key: "renax_fleet_luggage_suffix", label: "Word after the luggage number", type: "text", default: "Slots" },
      { key: "renax_fleet_transmission_label", label: "Label – transmission", type: "text", default: "TRANSMISSION" },
      { key: "renax_fleet_amenities_title", label: "Amenities heading", type: "text", default: "Included Amenities:" },
      { key: "renax_fleet_btn_text", label: "Button – text", type: "text", default: "Select vehicle class" },
      { key: "renax_fleet_economy_passengers", label: "Economy – passengers", type: "text", default: "4" },
      { key: "renax_fleet_economy_luggage", label: "Economy – luggage", type: "text", default: "2" },
      { key: "renax_fleet_economy_transmission", label: "Economy – transmission", type: "text", default: "Auto" },
      { key: "renax_fleet_luxury_passengers", label: "Luxury – passengers", type: "text", default: "4" },
      { key: "renax_fleet_luxury_luggage", label: "Luxury – luggage", type: "text", default: "3" },
      { key: "renax_fleet_luxury_transmission", label: "Luxury – transmission", type: "text", default: "Auto" },
      { key: "renax_fleet_family_passengers", label: "Family – passengers", type: "text", default: "7" },
      { key: "renax_fleet_family_luggage", label: "Family – luggage", type: "text", default: "6" },
      { key: "renax_fleet_family_transmission", label: "Family – transmission", type: "text", default: "Auto" },
    ],
  },
  {
    id: "renax-steps",
    page: PAGE,
    title: "How it works (3 steps)",
    fields: [
      { key: "renax_steps_enabled", label: "Show the steps section", type: "toggle", default: "true" },
      { key: "renax_steps_eyebrow", label: "Small label above the heading", type: "text", default: "How It Works" },
      { key: "renax_steps_title", label: "Heading", type: "text", default: "3 Easy Steps to Rent" },
      { key: "renax_step1_number", label: "Step 1 – large number", type: "text", default: "01" },
      { key: "renax_step1_title", label: "Step 1 – title", type: "text", default: "1. Choose A Class" },
      {
        key: "renax_step1_text",
        label: "Step 1 – text",
        type: "textarea",
        default:
          "Select your preferred luxury class—Economy, Chauffeur First Class, or high capacity Family MPVs according to requirements.",
      },
      { key: "renax_step2_number", label: "Step 2 – large number", type: "text", default: "02" },
      { key: "renax_step2_title", label: "Step 2 – title", type: "text", default: "2. Book Chauffeur" },
      {
        key: "renax_step2_text",
        label: "Step 2 – text",
        type: "textarea",
        default:
          "Enter your locations, date, and pickup times in our fixed rates calculator. Confirm pricing and chauffeur details.",
      },
      { key: "renax_step3_number", label: "Step 3 – large number", type: "text", default: "03" },
      { key: "renax_step3_title", label: "Step 3 – title", type: "text", default: "3. Enjoy Journey" },
      {
        key: "renax_step3_text",
        label: "Step 3 – text",
        type: "textarea",
        default:
          "Our professionally dressed licensed chauffeur arrives on-time in a pristine vehicle to complete your nationwide transfer.",
      },
    ],
  },
  {
    id: "renax-reviews",
    page: PAGE,
    title: "Google reviews",
    description: "The reviews block uses the same texts and reviews as the default homepage.",
    fields: [{ key: "renax_reviews_enabled", label: "Show the reviews section", type: "toggle", default: "true" }],
  },
  {
    id: "renax-routes",
    page: PAGE,
    title: "Popular transfer routes",
    description: "The heading above the transfer cards. The cards themselves are the same as on the default homepage.",
    fields: [
      { key: "renax_routes_enabled", label: "Show the transfer routes section", type: "toggle", default: "true" },
      { key: "renax_routes_eyebrow", label: "Small label above the heading", type: "text", default: "Fixed Presets" },
      { key: "renax_routes_title", label: "Heading", type: "text", default: "Popular Transfer Routes" },
    ],
  },
  {
    id: "renax-faq",
    page: PAGE,
    title: "FAQs",
    description: "The questions, heading and label are the homepage FAQ settings.",
    fields: [{ key: "renax_faq_enabled", label: "Show the FAQ section", type: "toggle", default: "true" }],
  },
  {
    id: "renax-contact",
    page: PAGE,
    title: "Contact",
    description:
      "The phone number, email and office (first part of the address, before the first comma) come from the business details in Settings.",
    fields: [
      { key: "renax_contact_enabled", label: "Show the contact section", type: "toggle", default: "true" },
      { key: "renax_contact_eyebrow", label: "Small label above the heading", type: "text", default: "Get In Touch" },
      { key: "renax_contact_title", label: "Heading", type: "text", default: "Contact Our Desk" },
      {
        key: "renax_contact_text",
        label: "Text under the heading",
        type: "textarea",
        default:
          "Have unique requirements or need a dedicated luxury chauffeur contract? Fill out our contact form below.",
      },
      { key: "renax_contact_phone_label", label: "Label – phone", type: "text", default: "Call / WhatsApp" },
      { key: "renax_contact_email_label", label: "Label – email", type: "text", default: "Email Address" },
      { key: "renax_contact_office_label", label: "Label – office", type: "text", default: "Head Office" },
      {
        key: "renax_contact_note",
        label: "Small print at the bottom",
        type: "textarea",
        default: "Please use the contact form details below to query custom routes.",
      },
    ],
  },
];
