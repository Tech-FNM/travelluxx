import React from "react";
import { GetStaticProps } from "next";
import Services from "../../src/pages/Services";
import SeoHead from "../../src/components/SeoHead";
import {
  getMenu,
  getServices,
  getServicesPageSettings,
  getWebsiteSettings,
} from "../../lib/mongodb";
import { faqPageSchema, servicesIndexFaqs, siteBaseUrl } from "../../src/lib/seoSchemas";

interface ServicesPageProps {
  services: any[];
  pageSettings: any;
  settings: any;
  menu: any[] | null;
}

export default function ServicesPage({ services, pageSettings, settings }: ServicesPageProps) {
  const s = settings || {};
  const ps = pageSettings || {};
  const base = siteBaseUrl(s);
  const title = ps.meta_title || "Our Executive Chauffeur Services | TravelLuxx UK";
  const description =
    ps.meta_description ||
    "Explore luxury chauffeur services across the UK. Airport transfers, executive business hire, VIP wedding cars, and private long-distance journeys.";

  return (
    <>
      <SeoHead
        settings={s}
        path="/services"
        title={title}
        description={description}
        ogTitle={ps.og_title}
        ogDescription={ps.og_description}
        image={ps.social_image || ps.hero_image}
        xTitle={ps.x_title}
        xDescription={ps.x_description}
        xImage={ps.x_image}
        schemas={[faqPageSchema(`${base}/services`, servicesIndexFaqs(ps))]}
        customSchema={ps.custom_schema}
      />
      <Services
        initialServices={services}
        initialPageSettings={pageSettings}
        initialSettings={settings}
      />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [services, pageSettings, settings, menu] = await Promise.all([
      getServices(),
      getServicesPageSettings(),
      getWebsiteSettings(),
      getMenu().catch(() => null),
    ]);

    return {
      props: {
        services: Array.isArray(services) ? services : [],
        pageSettings: pageSettings || {},
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for Services:", e);
    return {
      props: {
        services: [],
        pageSettings: {},
        settings: {},
        menu: null,
      },
      revalidate: 60,
    };
  }
};
