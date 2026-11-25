import type { ContentSection } from "../types";

// Blog index (/blog) and single article pages (/blog/<slug>).
// Each article's own title, excerpt, text, image, date, FAQs and SEO are edited in Posts, not here.
export const sections: ContentSection[] = [
  {
    id: "blog_index_header",
    page: "Blog",
    title: "Blog page – header",
    description: "The top of the blog page (/blog), above the list of articles.",
    fields: [
      { key: "blog_index_eyebrow", label: "Small label above the title", type: "text", default: "Travelluxx Journal" },
      { key: "blog_index_title", label: "Main title", type: "text", default: "Luxury Travel & News" },
      {
        key: "blog_index_intro",
        label: "Intro paragraph",
        type: "textarea",
        default: "Insights, airport guides, and executive travel articles from our chauffeur team.",
      },
    ],
  },
  {
    id: "blog_index_list",
    page: "Blog",
    title: "Blog page – article list",
    description: "Texts used on each article card and when there are no articles.",
    fields: [
      { key: "blog_index_read_more", label: "Card link text", type: "text", default: "Read Article" },
      {
        key: "blog_index_image_alt_suffix",
        label: "Card image description – added after the article title",
        type: "text",
        default: " - Travelluxx Chauffeur Blog",
        help: "Used only when the article has no image alt text of its own.",
      },
      { key: "blog_index_loading", label: "Loading message", type: "text", default: "Loading articles..." },
      { key: "blog_index_empty", label: "Message when there are no articles", type: "text", default: "No blog articles available yet." },
    ],
  },
  {
    id: "blog_index_seo",
    page: "Blog",
    title: "Blog page – SEO",
    description: "What search engines and social networks show for the blog page (/blog).",
    fields: [
      {
        key: "blog_seo_title",
        label: "SEO title (browser tab / Google)",
        type: "text",
        default: "Latest Articles & Travel Guides | TravelLuxx Chauffeur Blog",
      },
      {
        key: "blog_seo_description",
        label: "SEO meta description",
        type: "textarea",
        default: "Insights, airport transfer tips, and executive chauffeur guides across the UK by TravelLuxx.",
      },
    ],
  },
  {
    id: "blog_post_labels",
    page: "Blog",
    title: "Article page – labels",
    description: "Fixed texts shown on every single article page.",
    fields: [
      { key: "blog_post_by_prefix", label: "Word before the author name", type: "text", default: "By" },
      {
        key: "blog_post_author_fallback",
        label: "Author name when the article has none",
        type: "text",
        default: "Travelluxx Editorial",
      },
      { key: "blog_post_category_label", label: "Label next to the author", type: "text", default: "Chauffeur & Travel Guides" },
      {
        key: "blog_post_image_alt_suffix",
        label: "Main image description – added after the article title",
        type: "text",
        default: " - Travelluxx Executive Chauffeur Blog",
        help: "Used only when the article has no image alt text of its own.",
      },
      { key: "blog_post_faq_heading", label: "FAQ section heading", type: "text", default: "Frequently Asked Questions" },
      { key: "blog_post_back_text", label: "Back link text (below the article)", type: "text", default: "Back to Articles" },
      { key: "blog_post_loading", label: "Loading message", type: "text", default: "Loading article..." },
      { key: "blog_post_not_found", label: "Article not found – message", type: "text", default: "Article Not Found" },
      { key: "blog_post_not_found_back", label: "Article not found – back link text", type: "text", default: "Back to Blog" },
    ],
  },
  {
    id: "blog_default_faqs",
    page: "Blog",
    title: "Article page – default FAQs",
    description:
      "Shown on any article that has no FAQs of its own (an article's own FAQs, added in Posts, always replace these). Leave a question empty to skip it.",
    fields: [
      {
        key: "blog_default_faqs_enabled",
        label: "Show default FAQs on articles without their own",
        type: "toggle",
        default: "true",
      },
      {
        key: "blog_default_faq_1_q",
        label: "FAQ 1 – question",
        type: "text",
        default: "What makes executive chauffeur travel different from a standard taxi?",
      },
      {
        key: "blog_default_faq_1_a",
        label: "FAQ 1 – answer",
        type: "textarea",
        default:
          "Our executive chauffeur services feature premium Mercedes-Benz vehicles, impeccably presented DBS-checked chauffeurs, complimentary in-cabin amenities, and fixed pricing without metered rates or surge fees.",
      },
      {
        key: "blog_default_faq_2_q",
        label: "FAQ 2 – question",
        type: "text",
        default: "How far in advance should I book my airport chauffeur?",
      },
      {
        key: "blog_default_faq_2_a",
        label: "FAQ 2 – answer",
        type: "textarea",
        default:
          "We recommend booking at least 12 to 24 hours in advance to guarantee vehicle allocation, though same-day urgent bookings can also be arranged.",
      },
      { key: "blog_default_faq_3_q", label: "FAQ 3 – question (optional)", type: "text", default: "" },
      { key: "blog_default_faq_3_a", label: "FAQ 3 – answer", type: "textarea", default: "" },
      { key: "blog_default_faq_4_q", label: "FAQ 4 – question (optional)", type: "text", default: "" },
      { key: "blog_default_faq_4_a", label: "FAQ 4 – answer", type: "textarea", default: "" },
    ],
  },
];

/** The fallback FAQs for articles without their own, as saved in Site Content. */
export function defaultBlogFaqs(text: (key: string) => string, on: (key: string) => boolean) {
  if (!on("blog_default_faqs_enabled")) return [];
  return [1, 2, 3, 4]
    .map((n) => ({ question: text(`blog_default_faq_${n}_q`).trim(), answer: text(`blog_default_faq_${n}_a`).trim() }))
    .filter((f) => f.question);
}
