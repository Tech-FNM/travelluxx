/**
 * Editable website content.
 *
 * Every piece of text, link, image and on/off switch shown on the public site is declared once,
 * in a section file under src/content/sections/. The dashboard's "Site Content" tab is generated
 * from those declarations, and the site reads the same keys through useContent(). Values are
 * stored in the website settings (MongoDB "website" document), so a key that the admin has never
 * edited shows its `default`.
 */
export type ContentFieldType =
  | "text" // one line
  | "textarea" // several lines of plain text
  | "lines" // a list, one item per line
  | "url" // a link: "/services", "#calculator-section", "https://…", "tel:…", "mailto:…"
  | "image" // an image URL, picked from the media library
  | "toggle"; // show / hide

export interface ContentField {
  /** Settings key. Reuse an existing key when the site already reads one (e.g. homepage_hero_title). */
  key: string;
  label: string;
  type: ContentFieldType;
  /** What the site shows until the admin changes it. For toggles: "true" or "false". */
  default: string;
  help?: string;
}

export interface ContentSection {
  /** Unique id, e.g. "home-hero". */
  id: string;
  /** Group shown in the dashboard, e.g. "Homepage", "Header & Footer", "Service Areas". */
  page: string;
  title: string;
  description?: string;
  fields: ContentField[];
}
