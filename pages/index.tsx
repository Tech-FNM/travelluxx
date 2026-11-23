import React from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import { GetStaticProps } from "next";
import Home from "../src/pages/Home";

const defaultFaqs = [
  {
    question: "How do I book an executive transfer with TravelLuxx?",
    answer:
      "You can book easily online using our instant Fare Calculator above, select your desired vehicle class (Economy, Luxury, or Family MPV), specify your pickup time and date, and complete your reservation with instant confirmation.",
  },
  {
    question: "Do you provide flight monitoring for airport pickups?",
    answer:
      "Yes, our team actively monitors all inbound commercial flights in real-time. Whether your flight is delayed or lands early, your chauffeur will adjust their schedule accordingly and meet you inside the terminal with a name board.",
  },
  {
    question: "What vehicle classes are available?",
    answer:
      "We offer Mercedes-Benz E-Class & S-Class executive sedans for up to 4 passengers, and Mercedes V-Class / luxury multi-passenger vehicles (MPVs) for families and business groups carrying up to 7-8 passengers and substantial luggage.",
  },
  {
    question: "Can I apply a promo code or discount voucher?",
    answer:
      "Yes! At Step 3 (Secure Checkout) in our Booking Calculator, you can enter your promo code in the discount field and click 'Apply' to instantly receive your calculated savings before confirming your reservation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, Apple Pay, Google Pay, and Klarna through our secure Mollie payments integration, as well as pre-authorized Cash on Departure / Pay Later options.",
  },
];

export default function HomePage({ settings }: { settings: any }) {
  const faqs =
    Array.isArray(settings?.homepage_faqs) && settings.homepage_faqs.length > 0
      ? settings.homepage_faqs
      : defaultFaqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f: any) => ({
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
        <title>
          {settings?.homepage_seo_title ||
            settings?.seo_title ||
            "Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx"}
        </title>
        <meta
          name="description"
          content={
            settings?.homepage_seo_description ||
            settings?.seo_description ||
            "Book premium airport transfers and luxury chauffeur services across the UK with TravelLuxx. Reliable, comfortable and professional travel for every journey."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travelluxx.co.uk/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <Home initialSettings={settings} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const settingsFilePath = path.join(process.cwd(), "website_settings.json");
    let settings: any = {};
    if (fs.existsSync(settingsFilePath)) {
      settings = JSON.parse(fs.readFileSync(settingsFilePath, "utf8"));
    }
    return {
      props: {
        settings,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for HomePage:", e);
    return {
      props: {
        settings: {},
      },
      revalidate: 60,
    };
  }
};
