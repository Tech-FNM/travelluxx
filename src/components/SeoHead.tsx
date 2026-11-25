import React from "react";
import Head from "next/head";
import { absoluteUrl, businessName, defaultShareImage, isOn, parseCustomSchema, siteBaseUrl } from "../lib/seoSchemas";

export interface SeoHeadProps {
  settings: any;
  /** Path of the page, e.g. "/" or "/services/airport-transfers". */
  path: string;
  title: string;
  description?: string;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Path or URL; made absolute. Falls back to the site's default share image. */
  image?: string;
  xTitle?: string;
  xDescription?: string;
  xImage?: string;
  /** The item's own "no index / no follow" switch. */
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  /** Built-in JSON-LD objects (null entries are skipped). */
  schemas?: any[];
  /** Admin-entered JSON-LD (string); invalid JSON is ignored. */
  customSchema?: any;
}

const str = (v: any) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());

/**
 * Everything search engines and link previews read, rendered on the server through next/head.
 * Every tag has a `key`, so a page's tags replace any earlier copy instead of being duplicated.
 */
export default function SeoHead(props: SeoHeadProps) {
  const { settings } = props;
  const base = siteBaseUrl(settings);
  const path = props.path.startsWith("/") ? props.path : `/${props.path}`;
  const url = path === "/" ? `${base}/` : `${base}${path}`;
  const title = str(props.title) || businessName(settings);
  const description = str(props.description);
  const ogTitle = str(props.ogTitle) || title;
  const ogDescription = str(props.ogDescription) || description;
  const image = absoluteUrl(base, props.image) || defaultShareImage(settings, base);
  const xTitle = str(props.xTitle) || ogTitle;
  const xDescription = str(props.xDescription) || ogDescription;
  const xImage = absoluteUrl(base, props.xImage) || image;
  const noIndex = isOn(settings?.search_engine_visibility) || isOn(props.noIndex);
  const ogType = str(props.ogType) || "website";

  const schemas = [...(props.schemas || []).filter(Boolean), ...parseCustomSchema(props.customSchema)];
  const jsonLd =
    schemas.length > 0
      ? JSON.stringify(schemas.length === 1 ? schemas[0] : schemas).replace(/</g, "\\u003c")
      : "";

  return (
    <Head>
      <title key="title">{title}</title>
      {description ? <meta key="description" name="description" content={description} /> : null}
      <meta key="robots" name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link key="canonical" rel="canonical" href={url} />
      <meta key="og:site_name" property="og:site_name" content={businessName(settings)} />
      <meta key="og:locale" property="og:locale" content="en_GB" />
      <meta key="og:type" property="og:type" content={ogType} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:title" property="og:title" content={ogTitle} />
      {ogDescription ? <meta key="og:description" property="og:description" content={ogDescription} /> : null}
      {image ? <meta key="og:image" property="og:image" content={image} /> : null}
      {props.publishedTime ? (
        <meta key="article:published_time" property="article:published_time" content={str(props.publishedTime)} />
      ) : null}
      {props.modifiedTime ? (
        <meta key="article:modified_time" property="article:modified_time" content={str(props.modifiedTime)} />
      ) : null}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={xTitle} />
      {xDescription ? <meta key="twitter:description" name="twitter:description" content={xDescription} /> : null}
      {xImage ? <meta key="twitter:image" name="twitter:image" content={xImage} /> : null}
      {jsonLd ? (
        <script key="jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      ) : null}
    </Head>
  );
}
