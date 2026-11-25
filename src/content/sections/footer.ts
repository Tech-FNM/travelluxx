import type { ContentSection } from "../types";

// Footer (src/components/Footer.tsx). The business name, phone (WhatsApp number), email and office
// address are shared with the rest of the site and stay under Settings → General.
export const sections: ContentSection[] = [
  {
    id: "footer-brand",
    page: "Header & Footer",
    title: "Footer – brand & social links",
    description:
      "First footer column. The business name and the address under it come from Settings → General (Business Name, Office Address).",
    fields: [
      { key: "footer_follow_label", label: "\"Follow us\" label", type: "text", default: "Follow us:" },
      { key: "footer_social_instagram_enabled", label: "Show Instagram icon", type: "toggle", default: "true" },
      { key: "social_instagram", label: "Instagram link", type: "url", default: "https://www.instagram.com/trave_lluxx/" },
      { key: "footer_social_tiktok_enabled", label: "Show TikTok icon", type: "toggle", default: "true" },
      { key: "social_tiktok", label: "TikTok link", type: "url", default: "https://www.tiktok.com/@traveluxx" },
      { key: "footer_social_pinterest_enabled", label: "Show Pinterest icon", type: "toggle", default: "true" },
      { key: "social_pinterest", label: "Pinterest link", type: "url", default: "https://uk.pinterest.com/travelluxx01/" },
    ],
  },
  {
    id: "footer-columns",
    page: "Header & Footer",
    title: "Footer – link columns & contact",
    description:
      "The links in the Services and Service areas columns are the sub-items of the \"Services\" and \"Service Areas\" entries in the Menus tab, so the header dropdowns and the footer always match. Edit, add or reorder them there. The Contact column shows the WhatsApp number, email and office address from Settings → General.",
    fields: [
      { key: "footer_services_enabled", label: "Show the Services column", type: "toggle", default: "true" },
      {
        key: "footer_services_heading",
        label: "Services column – heading",
        type: "text",
        default: "Services",
        help: "Links come from the sub-items of the menu entry that links to /services in the Menus tab (or, failing that, the entry labelled \"Services\").",
      },
      { key: "footer_areas_enabled", label: "Show the Service areas column", type: "toggle", default: "true" },
      {
        key: "footer_areas_heading",
        label: "Service areas column – heading",
        type: "text",
        default: "Service areas",
        help: "Links come from the sub-items of the menu entry that links to /service-areas in the Menus tab (or, failing that, the entry labelled \"Service Areas\").",
      },
      { key: "footer_contact_heading", label: "Contact column – heading", type: "text", default: "Contact" },
    ],
  },
  {
    id: "footer-driver-banner",
    page: "Header & Footer",
    title: "Footer – driver recruitment banner",
    fields: [
      { key: "footer_driver_enabled", label: "Show the driver recruitment banner", type: "toggle", default: "true" },
      {
        key: "footer_driver_heading",
        label: "Heading",
        type: "text",
        default: "Join {business_name}",
        help: "{business_name} is replaced by the Business Name from Settings → General.",
      },
      {
        key: "footer_driver_text",
        label: "Text",
        type: "textarea",
        default: "Looking for professional driver jobs? We are recruiting premium chauffeurs in Birmingham.",
      },
      { key: "footer_driver_button_text", label: "Button text", type: "text", default: "Apply Now" },
      {
        key: "footer_driver_button_url",
        label: "Button link",
        type: "url",
        default: "https://wa.me/{whatsapp_number}",
        help: "{whatsapp_number} is replaced by the WhatsApp number from Settings → General. For a wa.me link without its own ?text=, the WhatsApp message below is added.",
      },
      {
        key: "footer_driver_whatsapp_message",
        label: "WhatsApp message (pre-filled)",
        type: "textarea",
        default: "Hi, I'm a licensed private hire driver and would like to apply to partner with {business_name}.",
        help: "{business_name} is replaced by the Business Name from Settings → General.",
      },
    ],
  },
  {
    id: "footer-bottom",
    page: "Header & Footer",
    title: "Footer – copyright & credit",
    fields: [
      {
        key: "footer_info",
        label: "Copyright line",
        type: "text",
        default: "© {year} {business_name}. All rights reserved.",
        help: "Same field as \"Footer Copyright Line\" in Settings → General. {business_name} and {year} are filled in automatically.",
      },
      { key: "footer_credit_enabled", label: "Show the developer credit", type: "toggle", default: "true" },
      { key: "footer_credit_prefix", label: "Developer credit – text before the link", type: "text", default: "- Develop & Managed By" },
      { key: "footer_credit_name", label: "Developer credit – link text", type: "text", default: "Tech FNM" },
      { key: "footer_credit_url", label: "Developer credit – link", type: "url", default: "https://techfnm.com/" },
    ],
  },
  {
    id: "footer-renax-highlights",
    page: "Header & Footer",
    title: "Footer – highlight bar (Renax theme only)",
    description:
      "Three boxes above the footer columns, shown only when the Renax theme is active. Values (phone, email, address) come from Settings → General.",
    fields: [
      { key: "footer_renax_call_label", label: "Phone box – label", type: "text", default: "Call Us" },
      { key: "footer_renax_email_label", label: "Email box – label", type: "text", default: "Write to Us" },
      { key: "footer_renax_office_label", label: "Address box – label", type: "text", default: "Head Office" },
    ],
  },
];
