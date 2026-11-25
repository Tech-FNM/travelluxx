import type { ContentSection } from "../types";

// Homepage: Google reviews section and FAQ section.
// The reviews list, rating, review count and Google profile link are edited in the
// "Client Reviews" block of the Homepage tab (and in SEO > Google Business Profile);
// the FAQ questions/answers are edited in the "Homepage FAQ Section" block. Those lists
// are not duplicated here.
export const sections: ContentSection[] = [
  {
    id: "home_reviews",
    page: "Homepage",
    title: "Google reviews section",
    description:
      "Headings and labels around the customer reviews. The reviews themselves, the star rating, the review count and the Google profile link are edited in the Homepage tab under \"Client Reviews & Testimonials\".",
    fields: [
      { key: "homepage_reviews_enabled", label: "Show the reviews section", type: "toggle", default: "true" },
      { key: "homepage_reviews_badge", label: "Small label above the heading", type: "text", default: "Verified Client Testimonials" },
      { key: "homepage_reviews_title", label: "Heading", type: "text", default: "Trusted by Discerning Travelers" },
      {
        key: "homepage_reviews_subtitle",
        label: "Intro paragraph",
        type: "textarea",
        default:
          "Real experiences from clients who rely on TravelLuxx for punctual airport transfers and executive chauffeur travel.",
      },
      { key: "homepage_reviews_based_on_text", label: "Text before the review count", type: "text", default: "Based on" },
      {
        key: "homepage_reviews_count_suffix",
        label: "Text after the review count (shown in bold with the number)",
        type: "text",
        default: "Google Reviews",
      },
      { key: "homepage_reviews_view_all_text", label: "\"View all\" link text", type: "text", default: "View All", help: "The link goes to your Google Business Profile URL." },
      {
        key: "homepage_reviews_verified_label",
        label: "Tooltip on the small Google icon of each review",
        type: "text",
        default: "Verified Google Review",
      },
      {
        key: "homepage_reviews_fallback_author",
        label: "Name shown when a review has no author name",
        type: "text",
        default: "Customer",
      },
    ],
  },
  {
    id: "home_faq",
    page: "Homepage",
    title: "FAQ section",
    description:
      "Headings of the homepage FAQ. The questions and answers are edited in the Homepage tab under \"Homepage FAQ Section\".",
    fields: [
      { key: "homepage_faqs_enabled", label: "Show the FAQ section", type: "toggle", default: "true" },
      { key: "homepage_faq_badge", label: "Small label above the heading", type: "text", default: "FAQ & Information" },
      { key: "homepage_faq_title", label: "Heading", type: "text", default: "Frequently Asked Questions" },
      {
        key: "homepage_faq_subtitle",
        label: "Intro paragraph",
        type: "textarea",
        default:
          "Everything you need to know about our chauffeur services, airport transfers, vehicle fleet, and booking process.",
      },
    ],
  },
];
