import type { ContentSection } from "../types";

// Homepage "Get in Touch" section (src/components/ContactForm.tsx, anchor #contact).
// The address, email and phone number themselves come from Settings → General
// (office_address, business_email, whatsapp_number) and are not duplicated here.
export const sections: ContentSection[] = [
  {
    id: "home_contact_intro",
    page: "Homepage",
    title: "Contact – introduction & details",
    description:
      "Left column of the contact section. The address, email and phone number shown here are edited in Settings → General.",
    fields: [
      { key: "contact_enabled", label: "Show the contact section", type: "toggle", default: "true" },
      { key: "contact_eyebrow", label: "Small label above the heading", type: "text", default: "Get in Touch" },
      { key: "contact_heading", label: "Heading", type: "text", default: "Connect With Our Dispatch Office" },
      {
        key: "contact_intro",
        label: "Intro paragraph",
        type: "textarea",
        default:
          "Need a multi-day itinerary, corporate account or custom arrangement? For chauffeur hire Birmingham quotes, drop us a line or message us on WhatsApp. Our dispatch operators are active 24/7.",
      },
      { key: "contact_address_label", label: "Label above the office address", type: "text", default: "Office Address" },
      { key: "contact_email_label", label: "Label above the email address", type: "text", default: "Email Dispatch" },
      { key: "contact_phone_label", label: "Label above the phone number", type: "text", default: "WhatsApp & Telephone Hotline" },
    ],
  },
  {
    id: "home_contact_form",
    page: "Homepage",
    title: "Contact – enquiry form",
    description: "The enquiry form on the right of the contact section, and the messages visitors see after sending it.",
    fields: [
      { key: "contact_form_heading", label: "Form heading", type: "text", default: "Submit a Customised Inquiry" },
      { key: "contact_name_label", label: "Name field – label", type: "text", default: "Full Name" },
      { key: "contact_name_placeholder", label: "Name field – example text inside the box", type: "text", default: "e.g. Richard Sterling" },
      { key: "contact_email_field_label", label: "Email field – label", type: "text", default: "Email Address" },
      { key: "contact_email_placeholder", label: "Email field – example text inside the box", type: "text", default: "e.g. sterling@gmail.com" },
      { key: "contact_phone_field_label", label: "Phone field – label", type: "text", default: "Phone (Optional)" },
      { key: "contact_phone_placeholder", label: "Phone field – example text inside the box", type: "text", default: "e.g. 0121 714 0876" },
      { key: "contact_message_label", label: "Message field – label", type: "text", default: "Message Description" },
      {
        key: "contact_message_placeholder",
        label: "Message field – example text inside the box",
        type: "textarea",
        default:
          "Tell us your dates, route and passenger details and we will confirm your private hire Birmingham booking quickly.",
      },
      { key: "contact_submit_text", label: "Send button text", type: "text", default: "Dispatch Inquiry Sheet" },
      { key: "contact_sending_text", label: "Send button text while sending", type: "text", default: "Dispatching..." },
      { key: "contact_success_heading", label: "After sending – heading", type: "text", default: "Message Dispatched Successfully" },
      {
        key: "contact_success_text",
        label: "After sending – message",
        type: "textarea",
        default:
          "We have received your general inquiry! A Travelluxx operator will email or text back under 15 minutes.",
      },
      { key: "contact_success_button", label: "After sending – button to send another", type: "text", default: "Send another inquiry" },
      {
        key: "contact_error_text",
        label: "Error pop-up – form rejected",
        type: "text",
        default: "Submission failed. Please check inputs.",
      },
      {
        key: "contact_error_connection_text",
        label: "Error pop-up – no connection",
        type: "text",
        default: "Submission failed due to connection failure.",
      },
    ],
  },
];
