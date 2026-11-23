import React from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import ServiceAreaPage from "../../src/pages/ServiceAreaPage";
import {
  getServiceAreas,
  getServiceAreaBySlug,
  getWebsiteSettings,
} from "../../lib/mongodb";

interface ServiceAreaDetailPageProps {
  serviceArea: any;
  settings: any;
}

const DEFAULT_AREA_FAQS = [
  {
    question: "How do I book an airport transfer in this area?",
    answer:
      "You can book easily online using our instant Fare Calculator above. Enter your pickup address and desired airport, select your luxury vehicle, and receive instant confirmation.",
  },
  {
    question: "Do you monitor flights for airport pickups?",
    answer:
      "Yes, our team monitors all inbound commercial flights in real-time. Whether your flight is early or delayed, your chauffeur will be waiting inside arrivals with a name board.",
  },
  {
    question: "Are your prices fixed and all-inclusive?",
    answer:
      "Yes. All TravelLuxx fares are fixed upfront with zero hidden fees. Fuel, taxes, airport flight tracking, and standard waiting time are all included.",
  },
  {
    question: "Can I book a private chauffeur for business travel or private events?",
    answer:
      "Yes, we provide flexible one-way, return, and full-day as-directed chauffeur hire for corporate meetings, private events, weddings, and long-distance UK journeys.",
  },
];

export default function ServiceAreaDetailPage({
  serviceArea,
  settings,
}: ServiceAreaDetailPageProps) {
  if (!serviceArea) {
    return <ServiceAreaPage />;
  }

  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = `${baseUrl}/service-areas/${serviceArea.slug || serviceArea.id}`;
  const title =
    serviceArea.metaTitle ||
    serviceArea.ogTitle ||
    `${serviceArea.heroTitle || serviceArea.title} | TravelLuxx`;
  const description =
    serviceArea.metaDescription ||
    serviceArea.ogDescription ||
    serviceArea.heroDescription ||
    "Private chauffeur travel and airport transfers tailored around your location and schedule.";
  const validFaqs =
    Array.isArray(serviceArea.faqs) && serviceArea.faqs.length > 0
      ? serviceArea.faqs
      : DEFAULT_AREA_FAQS;

  const faqSchema =
    validFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          mainEntity: validFaqs
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
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="robots"
          content={serviceArea.noIndexNoFollow ? "noindex, nofollow" : "index, follow"}
        />
        <link rel="canonical" href={pageUrl} />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </Head>
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
    const [serviceArea, settings] = await Promise.all([
      getServiceAreaBySlug(slug),
      getWebsiteSettings(),
    ]);

    if (!serviceArea) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        serviceArea,
        settings: settings || {},
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service area:", e);
    return { notFound: true, revalidate: 60 };
  }
};
