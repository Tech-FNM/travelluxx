import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import ServiceAreaPage from "../../src/pages/ServiceAreaPage";
import SeoHead from "../../src/components/SeoHead";
import {
  getMenu,
  getServiceAreas,
  getServiceAreaBySlug,
  getWebsiteSettings,
} from "../../lib/mongodb";
import {
  areaDetailFaqs,
  businessName,
  businessTelephone,
  faqPageSchema,
  siteBaseUrl,
} from "../../src/lib/seoSchemas";

interface ServiceAreaDetailPageProps {
  serviceArea: any;
  settings: any;
  menu: any[] | null;
}

// The stock photo used as a placeholder hero; never a useful share image.
const STOCK_HERO = "photo-1549317661-bd32c8ce0db2";
const ownImage = (v: any) => (typeof v === "string" && v.trim() && !v.includes(STOCK_HERO) ? v.trim() : "");

export default function ServiceAreaDetailPage({ serviceArea, settings }: ServiceAreaDetailPageProps) {
  if (!serviceArea) {
    return <ServiceAreaPage />;
  }

  const s = settings || {};
  const base = siteBaseUrl(s);
  const path = `/service-areas/${serviceArea.slug || serviceArea.id}`;
  const pageUrl = `${base}${path}`;
  const title =
    serviceArea.metaTitle ||
    serviceArea.ogTitle ||
    `${serviceArea.heroTitle || serviceArea.title} | TravelLuxx`;
  const description =
    serviceArea.metaDescription ||
    serviceArea.ogDescription ||
    serviceArea.heroDescription ||
    "Private chauffeur travel and airport transfers tailored around your location and schedule.";

  const areaService = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "@id": `${pageUrl}#service`,
    name: `${businessName(s)} - ${serviceArea.title} Chauffeur & Airport Transfers`,
    url: pageUrl,
    areaServed: serviceArea.title,
    description,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${base}/#organization`,
      name: businessName(s),
      telephone: businessTelephone(s) || undefined,
      url: `${base}/`,
    },
  };

  return (
    <>
      <SeoHead
        settings={s}
        path={path}
        title={title}
        description={description}
        ogType={serviceArea.ogType}
        ogTitle={serviceArea.ogTitle}
        ogDescription={serviceArea.ogDescription}
        image={ownImage(serviceArea.ogImage) || ownImage(serviceArea.socialImage) || ownImage(serviceArea.heroImage)}
        xTitle={serviceArea.xTitle}
        xDescription={serviceArea.xDescription}
        xImage={serviceArea.xImage}
        noIndex={serviceArea.noIndexNoFollow}
        schemas={[areaService, faqPageSchema(pageUrl, areaDetailFaqs(serviceArea, s))]}
        customSchema={serviceArea.customSchema}
      />
      <ServiceAreaPage initialArea={serviceArea} initialSettings={settings} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const areas = await getServiceAreas();
    const paths = (Array.isArray(areas) ? areas : [])
      .filter((a: any) => a && (a.slug || a.id))
      .map((a: any) => ({
        params: { slug: String(a.slug || a.id) },
      }));
    return { paths, fallback: "blocking" };
  } catch (e) {
    console.error("Error reading service areas from MongoDB for getStaticPaths:", e);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const [serviceArea, settings, menu] = await Promise.all([
      getServiceAreaBySlug(slug),
      getWebsiteSettings(),
      getMenu().catch(() => null),
    ]);

    if (!serviceArea) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        serviceArea,
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service area:", e);
    return { notFound: true, revalidate: 60 };
  }
};
