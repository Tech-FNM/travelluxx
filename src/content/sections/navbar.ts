import type { ContentSection } from "../types";

// Website header (src/components/Navbar.tsx). The menu links themselves are edited in the Menus tab.
export const sections: ContentSection[] = [
  {
    id: "nav-logo",
    page: "Header & Footer",
    title: "Header – logo",
    description: "The logo at the top left of every page. Clicking it opens the homepage (on the homepage it scrolls back to the top).",
    fields: [
      {
        key: "logo_url",
        label: "Logo image",
        type: "image",
        default: "",
        help: "Leave empty to use the built-in logo. Same setting as Settings → General → Site Logo.",
      },
      {
        key: "nav_logo_alt",
        label: "Logo alt text (for screen readers and Google)",
        type: "text",
        default: "",
        help: "Leave empty to use \"<Business name> Logo\" (Business Name from Settings → General).",
      },
    ],
  },
  {
    id: "nav-contact",
    page: "Header & Footer",
    title: "Header – phone and quote button",
    description:
      "Shown at the top right on desktop and at the bottom of the mobile menu. The menu links are edited in the Menus tab.",
    fields: [
      {
        key: "nav_phone_display",
        label: "Phone number as shown",
        type: "text",
        default: "",
        help:
          "Leave empty to show the WhatsApp number from Settings → General, written the UK way, e.g. +44 121 714 0876. The phone link always dials that number unless you set the link below.",
      },
      {
        key: "nav_phone_link",
        label: "Phone link",
        type: "url",
        default: "",
        help: "Leave empty to call the WhatsApp number from Settings → General (tel:+441217140876). Example: tel:+441217140876",
      },
      { key: "nav_quote_text", label: "Quote button – text", type: "text", default: "Get a quote" },
      {
        key: "nav_quote_link",
        label: "Quote button – link",
        type: "url",
        default: "/#calculator-section",
        help: "A homepage section link like /#calculator-section scrolls there on the homepage and opens the homepage at that section from other pages.",
      },
    ],
  },
];
