export interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article" | "profile" | string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  siteName?: string;
  schemas?: any[] | any; // JSON-LD objects or array of objects
  customSchemaJson?: string; // Raw JSON-LD string entered by user
}

/**
 * Kept for compatibility. SEO (title, meta, Open Graph, canonical, JSON-LD) is now rendered on the
 * server by src/components/SeoHead.tsx in each pages/* file, so crawlers and link previews see it
 * and the browser never adds a second copy. This hook intentionally does nothing.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function usePageSeo(_props: SeoProps): void {}
