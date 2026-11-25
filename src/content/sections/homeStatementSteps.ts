import type { ContentSection } from "../types";

// Homepage: "The service" statement with three figures (ServiceStatement.tsx),
// then "How it works" (HowItWorks.tsx).
export const sections: ContentSection[] = [
  {
    id: "home-statement",
    page: "Homepage",
    title: "The service – statement and figures",
    description:
      "The large paragraph under the hero whose words light up on scroll, followed by three figures. In the texts, {brand} is replaced by the business name, {airport_count} by the number of airports and {airport_codes} by their codes (both from the Airports settings).",
    fields: [
      { key: "home_statement_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "home_statement_label", label: "Section label (small text on the left)", type: "text", default: "The service" },
      {
        key: "home_statement_text",
        label: "Statement paragraph",
        type: "textarea",
        default:
          "{brand} is a private hire and chauffeur service based in Shirley, Solihull, driving clients from Birmingham to anywhere in the UK. Your fare is fixed and agreed before you travel, and your chauffeur tracks your flight so the car is waiting when you land.",
        help: "One plain paragraph (line breaks are ignored). {brand} shows the business name.",
      },
      { key: "home_statement_figures_label", label: "Figures – label (small text on the left)", type: "text", default: "In figures" },
      {
        key: "home_statement_fig1_value",
        label: "Figure 1 – big number",
        type: "text",
        default: "24/7",
        help: "A number counts up when scrolled into view (e.g. 6, 120+, £45, 24/7). Plain text is shown as is.",
      },
      { key: "home_statement_fig1_title", label: "Figure 1 – title", type: "text", default: "Online booking" },
      { key: "home_statement_fig1_text", label: "Figure 1 – description", type: "text", default: "Get a quote and book at any hour, on any day." },
      {
        key: "home_statement_fig2_value",
        label: "Figure 2 – big number",
        type: "text",
        default: "{airport_count}",
        help: "{airport_count} shows the number of airports automatically.",
      },
      { key: "home_statement_fig2_title", label: "Figure 2 – title", type: "text", default: "Airports served" },
      {
        key: "home_statement_fig2_text",
        label: "Figure 2 – description",
        type: "text",
        default: "{airport_codes}",
        help: "{airport_codes} shows the airport codes, e.g. LHR · LGW · LTN.",
      },
      { key: "home_statement_fig3_value", label: "Figure 3 – big number", type: "text", default: "3" },
      { key: "home_statement_fig3_title", label: "Figure 3 – title", type: "text", default: "Vehicle classes" },
      { key: "home_statement_fig3_text", label: "Figure 3 – description", type: "text", default: "Economy, Luxury and Family MPV." },
    ],
  },
  {
    id: "home-steps",
    page: "Homepage",
    title: "How it works",
    description: "The four numbered booking steps.",
    fields: [
      { key: "home_steps_enabled", label: "Show this section", type: "toggle", default: "true" },
      { key: "home_steps_label", label: "Section label (small text above the heading)", type: "text", default: "How it works" },
      { key: "home_steps_heading", label: "Heading", type: "text", default: "From fixed quote to your door, in four steps" },
      {
        key: "home_steps_button_text",
        label: "Button text",
        type: "text",
        default: "Start with a quote",
        help: "The button scrolls to the quote form.",
      },
      { key: "home_steps_1_number", label: "Step 1 – number", type: "text", default: "01" },
      { key: "home_steps_1_title", label: "Step 1 – title", type: "text", default: "Get a fixed quote" },
      {
        key: "home_steps_1_text",
        label: "Step 1 – text",
        type: "textarea",
        default: "Enter your pickup and destination to see a fixed fare for each vehicle class. No surge pricing.",
      },
      { key: "home_steps_2_number", label: "Step 2 – number", type: "text", default: "02" },
      { key: "home_steps_2_title", label: "Step 2 – title", type: "text", default: "Tell us your journey details" },
      {
        key: "home_steps_2_text",
        label: "Step 2 – text",
        type: "textarea",
        default: "Add your date, time, passengers and luggage, and your flight number if we are meeting you at an airport.",
      },
      { key: "home_steps_3_number", label: "Step 3 – number", type: "text", default: "03" },
      { key: "home_steps_3_title", label: "Step 3 – title", type: "text", default: "Pay online or pay your driver" },
      {
        key: "home_steps_3_text",
        label: "Step 3 – text",
        type: "textarea",
        default: "Pay securely online when you book, or choose pay later and settle with your chauffeur on the day.",
      },
      { key: "home_steps_4_number", label: "Step 4 – number", type: "text", default: "04" },
      { key: "home_steps_4_title", label: "Step 4 – title", type: "text", default: "Your chauffeur arrives" },
      {
        key: "home_steps_4_text",
        label: "Step 4 – text",
        type: "textarea",
        default:
          "A licensed chauffeur meets you on time. On airport pickups we monitor your flight and adjust if it lands early or late.",
      },
    ],
  },
];
