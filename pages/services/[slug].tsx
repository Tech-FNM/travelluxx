import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ServiceDetail from "../../src/pages/ServiceDetail";
import SeoHead from "../../src/components/SeoHead";
import {
  getMenu,
  getServices,
  getServiceBySlug,
  getServicesPageSettings,
  getWebsiteSettings,
} from "../../lib/mongodb";
import {
  businessName,
  businessTelephone,
  faqPageSchema,
  serviceDetailFaqs,
  siteBaseUrl,
} from "../../src/lib/seoSchemas";

interface ServiceDetailPageProps {
  service: any;
  allServices: any[];
  pageSettings: any;
  settings: any;
  menu: any[] | null;
}

export default function ServiceDetailPage({
  service,
  allServices,
  pageSettings,
  settings,
}: ServiceDetailPageProps) {
  if (!service) {
    return <ServiceDetail />;
  }

  const s = settings || {};
  const base = siteBaseUrl(s);
  const path = `/services/${service.slug || service.id}`;
  const pageUrl = `${base}${path}`;
  const metaTitle =
    service.metaTitle ||
    service.ogTitle ||
    `${service.title} | Luxury Chauffeur & Travel Services | TravelLuxx`;
  const metaDesc =
    service.metaDescription ||
    service.ogDescription ||
    service.excerpt ||
    `Premium ${service.title} with TravelLuxx. Fixed rates, professional chauffeurs, and luxury vehicles across the UK.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name: service.title,
    description: metaDesc,
    url: pageUrl,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${base}/#organization`,
      name: businessName(s),
      url: `${base}/`,
      telephone: businessTelephone(s) || undefined,
    },
    areaServed: "United Kingdom",
  };

  return (
    <>
      <SeoHead
        settings={s}
        path={path}
        title={metaTitle}
        description={metaDesc}
        ogType={service.ogType}
        ogTitle={service.ogTitle}
        ogDescription={service.ogDescription}
        image={service.socialImage || service.ogImage || service.image}
        xTitle={service.xTitle}
        xDescription={service.xDescription}
        xImage={service.xImage}
        noIndex={service.noIndexNoFollow}
        schemas={[serviceSchema, faqPageSchema(pageUrl, serviceDetailFaqs(service, pageSettings, s))]}
        customSchema={service.customSchema}
      />
      <ServiceDetail
        initialService={service}
        initialAllServices={allServices}
        initialPageSettings={pageSettings}
        initialSettings={settings}
      />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const services = await getServices();
    const paths = (Array.isArray(services) ? services : [])
      .filter((s: any) => s && (s.slug || s.id))
      .map((s: any) => ({
        params: { slug: String(s.slug || s.id) },
      }));
    return { paths, fallback: "blocking" };
  } catch (e) {
    console.error("Error reading services from MongoDB for getStaticPaths:", e);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const [service, allServices, pageSettings, settings, menu] = await Promise.all([
      getServiceBySlug(slug),
      getServices(),
      getServicesPageSettings(),
      getWebsiteSettings(),
      getMenu().catch(() => null),
    ]);

    if (!service) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        service,
        allServices: Array.isArray(allServices) ? allServices : [],
        pageSettings: pageSettings || {},
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service:", e);
    return { notFound: true, revalidate: 60 };
  }
};
