import { useEffect } from "react";

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

const DEFAULT_BASE_URL = "https://travelluxx.co.uk";
const DEFAULT_SITE_NAME = "TravelLuxx";
const DEFAULT_OG_IMAGE = "https://travelluxx.co.uk/assets/images/travelluxx_logo_1784064660967.webp";

export function usePageSeo(props: SeoProps) {
  useEffect(() => {
    const title = (props.title || DEFAULT_SITE_NAME).trim();
    const description = (props.description || "").trim();
    const siteName = props.siteName || DEFAULT_SITE_NAME;
    const pageUrl = props.canonicalUrl || (typeof window !== "undefined" ? window.location.href : DEFAULT_BASE_URL);

    // 1. Title
    if (title) {
      document.title = title;
    }

    // Helper to set or create <meta>
    const setMeta = (attributeName: string, attributeValue: string, contentValue: string) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attributeName, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", contentValue);
    };

    // Helper to remove <meta>
    const removeMeta = (attributeName: string, attributeValue: string) => {
      const el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (el) el.remove();
    };

    // 2. Standard Meta
    if (description) {
      setMeta("name", "description", description);
    }
    setMeta("name", "robots", props.noIndex ? "noindex, nofollow" : "index, follow");

    // 3. Open Graph (OG) Tags
    const ogTitle = (props.ogTitle || title).trim();
    const ogDesc = (props.ogDescription || description).trim();
    const ogUrl = props.ogUrl || pageUrl;
    const ogType = props.ogType || "website";
    const ogImage = props.ogImage || DEFAULT_OG_IMAGE;

    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", ogUrl);
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDesc);
    if (ogImage) setMeta("property", "og:image", ogImage);

    // 4. Twitter Card Tags
    setMeta("name", "twitter:card", props.twitterCard || "summary_large_image");
    setMeta("name", "twitter:title", props.twitterTitle || ogTitle);
    setMeta("name", "twitter:description", props.twitterDescription || ogDesc);
    if (props.twitterImage || ogImage) {
      setMeta("name", "twitter:image", props.twitterImage || ogImage);
    }

    // 5. Canonical Link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = ogUrl;

    // 6. Schema Markup (JSON-LD)
    const scriptId = "dynamic-page-schema-jsonld";
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }

    // Combine structured schemas + custom schema if provided
    const combinedSchemas: any[] = [];

    if (props.schemas) {
      if (Array.isArray(props.schemas)) {
        combinedSchemas.push(...props.schemas.filter(Boolean));
      } else if (typeof props.schemas === "object") {
        combinedSchemas.push(props.schemas);
      }
    }

    if (props.customSchemaJson && typeof props.customSchemaJson === "string") {
      try {
        const parsed = JSON.parse(props.customSchemaJson.trim());
        if (Array.isArray(parsed)) {
          combinedSchemas.push(...parsed);
        } else if (parsed && typeof parsed === "object") {
          combinedSchemas.push(parsed);
        }
      } catch (err) {
        console.warn("Invalid customSchemaJson provided to usePageSeo:", err);
      }
    }

    if (combinedSchemas.length > 0) {
      scriptEl.text = JSON.stringify(combinedSchemas.length === 1 ? combinedSchemas[0] : combinedSchemas, null, 2);
    } else {
      scriptEl.text = "";
    }

    return () => {
      // Optional cleanup on unmount
    };
  }, [
    props.title,
    props.description,
    props.canonicalUrl,
    props.ogType,
    props.ogTitle,
    props.ogDescription,
    props.ogImage,
    props.ogUrl,
    props.noIndex,
    props.schemas,
    props.customSchemaJson
  ]);
}

