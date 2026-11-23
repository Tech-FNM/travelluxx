import React from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import { GetStaticProps } from "next";
import Services from "../../src/pages/Services";

interface ServicesPageProps {
  services: any[];
  pageSettings: any;
  settings: any;
}

export default function ServicesPage({
  services,
  pageSettings,
  settings,
}: ServicesPageProps) {
  const faqs =
    Array.isArray(pageSettings?.faqs) && pageSettings.faqs.length > 0
      ? pageSettings.faqs
      : [];

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": "https://travelluxx.co.uk/services#faq",
          mainEntity: faqs.map((f: any) => ({
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
        <title>Our Executive Chauffeur Services | TravelLuxx UK</title>
        <meta
          name="description"
          content="Explore luxury chauffeur services across the UK. Airport transfers, executive business hire, VIP wedding cars, and private long-distance journeys."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travelluxx.co.uk/services" />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </Head>
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
    const servicesFilePath = path.join(process.cwd(), "services.json");
    const settingsFilePath = path.join(process.cwd(), "website_settings.json");
    const servicesSettingsPath = path.join(process.cwd(), "services_settings.json");

    let services: any[] = [];
    let settings: any = {};
    let pageSettings: any = {};

    if (fs.existsSync(servicesFilePath)) {
      services = JSON.parse(fs.readFileSync(servicesFilePath, "utf8"));
    }
    if (fs.existsSync(settingsFilePath)) {
      settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
    }
    if (fs.existsSync(servicesSettingsPath)) {
      pageSettings = JSON.parse(fs.readFileSync(servicesSettingsPath, "utf8"));
    }

    return {
      props: {
        services,
        pageSettings,
        settings,
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
      },
      revalidate: 60,
    };
  }
};
