import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import ServiceAreas from "../../src/pages/ServiceAreas";
import { getServiceAreas, getWebsiteSettings } from "../../lib/mongodb";

interface ServiceAreasListPageProps {
  areas: any[];
  settings: any;
}

const SERVICE_AREAS_FAQS = [
  {
    question: "Which areas and regions across the UK does TravelLuxx cover?",
    answer:
      "TravelLuxx provides executive chauffeur hire and airport transfers across Solihull, Birmingham, Coventry, Warwickshire, and connects passengers to all UK airports and major cities nationwide.",
  },
  {
    question: "Can I book a transfer starting or ending outside your listed service areas?",
    answer:
      "Yes, our private hire license covers nationwide pre-booked journeys. Whether you need an intercity transfer to London, Manchester, or Southampton cruise ports, we provide door-to-door service.",
  },
  {
    question: "Are your fares fixed regardless of the service area?",
    answer:
      "Yes, every journey is calculated on a 100% fixed-rate basis at the time of booking. There are no surprise meter charges, surge pricing, or hidden fees.",
  },
  {
    question: "How do I book an executive transfer in my area?",
    answer:
      "You can book instantly online using our instant Fare Calculator, or get in touch with our 24/7 team via WhatsApp or phone for bespoke itineraries and multi-stop journeys.",
  },
];

export default function ServiceAreasListPage({
  areas,
  settings,
}: ServiceAreasListPageProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://travelluxx.co.uk/service-areas#faq",
    mainEntity: SERVICE_AREAS_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Chauffeur Service Areas UK | Solihull, Birmingham & London | TravelLuxx</title>
        <meta
          name="description"
          content="Executive chauffeur coverage across Solihull, Birmingham, Coventry, Warwickshire, and London airports."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travelluxx.co.uk/service-areas" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <ServiceAreas initialAreas={areas} initialSettings={settings} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [areas, settings] = await Promise.all([
      getServiceAreas(),
      getWebsiteSettings(),
    ]);

    return {
      props: {
        areas: Array.isArray(areas) ? areas : [],
        settings: settings || {},
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for service-areas:", e);
    return {
      props: {
        areas: [],
        settings: {},
      },
      revalidate: 60,
    };
  }
};
