import React from "react";
import { GetStaticProps } from "next";
import Home from "../src/pages/Home";
import SeoHead from "../src/components/SeoHead";
import { getMenu, getPageBySlug, getWebsiteSettings } from "../lib/mongodb";
import { faqPageSchema, homepageFaqs, organizationSchemas, siteBaseUrl } from "../src/lib/seoSchemas";

const DEFAULT_TITLE = "Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx";
const DEFAULT_DESCRIPTION =
  "Book premium airport transfers and luxury chauffeur services across the UK with TravelLuxx. Reliable, comfortable and professional travel for every journey.";

interface HomePageProps {
  settings: any;
  menu: any[] | null;
  /** Settings → Reading → "A static page": the chosen page, loaded on the server. */
  homepagePage: any | null;
}

export default function HomePage({ settings, homepagePage }: HomePageProps) {
  const s = settings || {};
  const base = siteBaseUrl(s);
  const staticPage = s.homepage_displays === "page" ? homepagePage : null;

  // Homepage tab → SEO; a static homepage uses its page's own SEO fields first.
  const title =
    staticPage?.metaTitle || s.homepage_seo_title || s.seo_title || staticPage?.title || DEFAULT_TITLE;
  const description =
    staticPage?.metaDescription || s.homepage_seo_description || s.seo_description || DEFAULT_DESCRIPTION;

  const schemas = [...organizationSchemas(s), faqPageSchema(`${base}/`, homepageFaqs(s))];

  return (
    <>
      <SeoHead
        settings={s}
        path="/"
        title={title}
        description={description}
        ogTitle={staticPage?.ogTitle || s.homepage_og_title}
        ogDescription={staticPage?.ogDescription || s.homepage_og_description}
        image={staticPage?.socialImage || s.homepage_social_image || staticPage?.image}
        xTitle={staticPage?.xTitle || s.homepage_x_title}
        xDescription={staticPage?.xDescription || s.homepage_x_description}
        xImage={staticPage?.xImage || s.homepage_x_image}
        noIndex={staticPage?.noIndexNoFollow}
        schemas={schemas}
        customSchema={staticPage?.customSchema || s.homepage_custom_schema}
      />
      <Home initialSettings={settings} initialPage={staticPage} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [settings, menu] = await Promise.all([getWebsiteSettings(), getMenu().catch(() => null)]);
    let homepagePage: any = null;
    if (settings?.homepage_displays === "page" && settings?.homepage_page_id) {
      homepagePage = await getPageBySlug(String(settings.homepage_page_id)).catch(() => null);
    }
    return {
      props: {
        settings: settings || {},
        menu: menu ?? null,
        homepagePage: homepagePage || null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for HomePage:", e);
    return {
      props: {
        settings: {},
        menu: null,
        homepagePage: null,
      },
      revalidate: 60,
    };
  }
};
