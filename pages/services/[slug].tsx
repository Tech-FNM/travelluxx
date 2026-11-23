import React from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import ServiceDetail from "../../src/pages/ServiceDetail";
import {
  getServices,
  getServiceBySlug,
  getServicesPageSettings,
  getWebsiteSettings,
} from "../../lib/mongodb";

interface ServiceDetailPageProps {
  service: any;
  allServices: any[];
  pageSettings: any;
  settings: any;
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

  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = `${baseUrl}/services/${service.slug || service.id}`;
  const metaTitle =
    service.metaTitle ||
    service.ogTitle ||
    `${service.title} | Luxury Chauffeur & Travel Services | TravelLuxx`;
  const metaDesc =
    service.metaDescription ||
    service.ogDescription ||
    service.excerpt ||
    `Premium ${service.title} with TravelLuxx. Fixed rates, professional chauffeurs, and luxury vehicles across the UK.`;
  const faqs =
    Array.isArray(service.faqs) && service.faqs.length > 0
      ? service.faqs
      : pageSettings?.faqs || [];

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          mainEntity: faqs
            .filter((f: any) => f && (f.question || f.answer))
            .map((f: any) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer,
              },
            })),
        }
      : null;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta
          name="robots"
          content={service.noIndexNoFollow ? "noindex, nofollow" : "index, follow"}
        />
        <link rel="canonical" href={pageUrl} />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </Head>
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
    const [service, allServices, pageSettings, settings] = await Promise.all([
      getServiceBySlug(slug),
      getServices(),
      getServicesPageSettings(),
      getWebsiteSettings(),
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
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service:", e);
    return { notFound: true, revalidate: 60 };
  }
};
