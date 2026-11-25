import type { ContentSection } from "./types";
import { sections as navbar } from "./sections/navbar";
import { sections as footer } from "./sections/footer";
import { sections as homeHero } from "./sections/homeHero";
import { sections as homeBooking } from "./sections/homeBooking";
import { sections as homeFleet } from "./sections/homeFleet";
import { sections as homeCoverage } from "./sections/homeCoverage";
import { sections as homeReviewsFaq } from "./sections/homeReviewsFaq";
import { sections as homeContact } from "./sections/homeContact";
import { sections as homeStatementSteps } from "./sections/homeStatementSteps";
import { sections as homeMarqueeCta } from "./sections/homeMarqueeCta";
import { sections as servicesIndex } from "./sections/servicesIndex";
import { sections as serviceDetail } from "./sections/serviceDetail";
import { sections as areasIndex } from "./sections/areasIndex";
import { sections as areaDetail } from "./sections/areaDetail";
import { sections as blog } from "./sections/blog";
import { sections as genericPages } from "./sections/genericPages";
import { sections as renax } from "./sections/renax";

/** Dashboard order. */
export const CONTENT_SECTIONS: ContentSection[] = [
  ...navbar,
  ...footer,
  ...homeHero,
  ...homeBooking,
  ...homeFleet,
  ...homeCoverage,
  ...homeReviewsFaq,
  ...homeContact,
  ...homeStatementSteps,
  ...homeMarqueeCta,
  ...servicesIndex,
  ...serviceDetail,
  ...areasIndex,
  ...areaDetail,
  ...blog,
  ...genericPages,
  ...renax,
];

export const CONTENT_DEFAULTS: Record<string, string> = {};
for (const section of CONTENT_SECTIONS) {
  for (const field of section.fields) {
    if (field.key in CONTENT_DEFAULTS && process.env.NODE_ENV !== "production") {
      console.warn(`[content] key "${field.key}" is declared twice; keep one declaration.`);
    }
    CONTENT_DEFAULTS[field.key] = field.default;
  }
}
