import React from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import ServiceDetail from "../../src/pages/ServiceDetail";

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
    const servicesFilePath = path.join(process.cwd(), "services.json");
    if (fs.existsSync(servicesFilePath)) {
      const services = JSON.parse(fs.readFileSync(servicesFilePath, "utf8"));
      const paths = (Array.isArray(services) ? services : []).map((s: any) => ({
        params: { slug: String(s.slug || s.id) },
      }));
      return { paths, fallback: "blocking" };
    }
  } catch (e) {
    console.error("Error reading services.json for getStaticPaths:", e);
  }
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const servicesFilePath = path.join(process.cwd(), "services.json");
    const settingsFilePath = path.join(process.cwd(), "website_settings.json");
    const servicesSettingsPath = path.join(process.cwd(), "services_settings.json");

    let allServices: any[] = [];
    let settings: any = {};
    let pageSettings: any = {};

    if (fs.existsSync(servicesFilePath)) {
      allServices = JSON.parse(fs.readFileSync(servicesFilePath, "utf8"));
    }
    if (fs.existsSync(settingsFilePath)) {
      settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
    }
    if (fs.existsSync(servicesSettingsPath)) {
      pageSettings = JSON.parse(fs.readFileSync(servicesSettingsPath, "utf8"));
    }

    const service = allServices.find((s: any) => s.slug === slug || s.id === slug) || null;

    if (!service) {
      return { notFound: true };
    }

    return {
      props: {
        service,
        allServices,
        pageSettings,
        settings,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service:", e);
    return { notFound: true };
  }
};
