import React from "react";
import { GetStaticProps } from "next";
import ServiceAreas, { areasIndexFaqs } from "../../src/pages/ServiceAreas";
import SeoHead from "../../src/components/SeoHead";
import { getMenu, getServiceAreas, getServiceAreasPageSettings, getWebsiteSettings } from "../../lib/mongodb";
import { contentOn } from "../../src/content/useContent";
import { faqPageSchema, siteBaseUrl } from "../../src/lib/seoSchemas";

interface ServiceAreasListPageProps {
  areas: any[];
  settings: any;
  pageSettings: any;
  menu: any[] | null;
}

export default function ServiceAreasListPage({ areas, settings, pageSettings }: ServiceAreasListPageProps) {
  const s = settings || {};
  const ps = pageSettings || {};
  const base = siteBaseUrl(s);
  // FAQ list edited in Site Content > Service Areas (same list and show/hide switch as the page).
  const faqs = contentOn(s, "areas_index_faq_enabled") ? areasIndexFaqs(s) : [];

  // SEO title and description are edited in Service Areas > Page settings.
  const metaTitle =
    ps.meta_title || "Chauffeur Service Areas UK | Solihull, Birmingham & London | TravelLuxx";
  const metaDescription =
    ps.meta_description ||
    "Executive chauffeur coverage across Solihull, Birmingham, Coventry, Warwickshire, and London airports.";

  return (
    <>
      <SeoHead
        settings={s}
        path="/service-areas"
        title={metaTitle}
        description={metaDescription}
        ogTitle={ps.og_title}
        ogDescription={ps.og_description}
        image={ps.social_image || ps.og_image}
        xTitle={ps.x_title}
        xDescription={ps.x_description}
        xImage={ps.x_image}
        schemas={[faqPageSchema(`${base}/service-areas`, faqs)]}
        customSchema={ps.custom_schema}
      />
      <ServiceAreas initialAreas={areas} initialSettings={settings} initialPageSettings={pageSettings} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [areas, settings, pageSettings, menu] = await Promise.all([
      getServiceAreas(),
      getWebsiteSettings(),
      getServiceAreasPageSettings(),
      getMenu().catch(() => null),
    ]);

    return {
      props: {
        areas: Array.isArray(areas) ? areas : [],
        settings: settings || {},
        pageSettings: pageSettings && typeof pageSettings === "object" ? pageSettings : {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service-areas:", e);
    return {
      props: {
        areas: [],
        settings: {},
        pageSettings: {},
        menu: null,
      },
      revalidate: 60,
    };
  }
};
