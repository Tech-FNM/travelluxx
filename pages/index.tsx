import React from "react";
import Head from "next/head";
import Home from "../src/pages/Home";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I book an executive transfer with TravelLuxx?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can book easily online using our instant Fare Calculator above, select your desired vehicle class (Economy, Luxury, or Family MPV), specify your pickup time and date, and complete your reservation with instant confirmation."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide flight monitoring for airport pickups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our team actively monitors all inbound commercial flights in real-time. Whether your flight is delayed or lands early, your chauffeur will adjust their schedule accordingly and meet you inside the terminal with a name board."
      }
    },
    {
      "@type": "Question",
      "name": "What vehicle classes are available?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer Mercedes-Benz E-Class & S-Class executive sedans for up to 4 passengers, and Mercedes V-Class / luxury multi-passenger vehicles (MPVs) for families and business groups carrying up to 7-8 passengers and substantial luggage."
      }
    },
    {
      "@type": "Question",
      "name": "Can I apply a promo code or discount voucher?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! At Step 3 (Secure Checkout) in our Booking Calculator, you can enter your promo code in the discount field and click 'Apply' to instantly receive your calculated savings before confirming your reservation."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit and debit cards, Apple Pay, Google Pay, and Klarna through our secure Mollie payments integration, as well as pre-authorized Cash on Departure / Pay Later options."
      }
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Luxury Airport Transfers & Chauffeur Service UK | TravelLuxx</title>
        <meta
          name="description"
          content="Book premium airport transfers and luxury chauffeur services across the UK with TravelLuxx. Reliable, comfortable and professional travel for every journey."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travelluxx.co.uk/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
      <Home />
    </>
  );
}

