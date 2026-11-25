import type { ContentSection } from "../types";

// Services index page (/services).
// The hero, catalog, "How it works", "Why choose" and FAQ sections (headings, items, show/hide
// switches) are edited in
// Pages > Services (servicesPageSettings). Each card's title, excerpt and image come from the
// Services manager. Only the remaining fixed texts of the service cards live here.
export const sections: ContentSection[] = [
  {
    id: "services_index_cards",
    page: "Services",
    title: "Services page – service cards",
    description:
      "Texts shared by every card in the services grid on /services. Each card's title, short description and image are edited per service in the Services manager; headings of this section are edited in Pages > Services.",
    fields: [
      {
        key: "services_index_card_view_text",
        label: "Card – 'view service' link text",
        type: "text",
        default: "View service",
      },
      {
        key: "services_index_card_book_text",
        label: "Card – booking link text",
        type: "text",
        default: "Book Now",
      },
      {
        key: "services_index_card_book_url",
        label: "Card – booking link",
        type: "url",
        default: "/#calculator",
      },
      {
        key: "services_index_card_fallback_image",
        label: "Card – image used when a service has no image",
        type: "image",
        default:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      },
      {
        key: "services_index_card_alt_suffix",
        label: "Card – image description added after the service name",
        type: "text",
        default: "Executive Chauffeur Services UK",
        help: "Used for the image alt text when a service has no alt text of its own: \"<service name> - <this text>\".",
      },
    ],
  },
];
