import React from "react";
import Head from "next/head";
import Services from "../../src/pages/Services";

export default function ServicesPage() {
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
      </Head>
      <Services />
    </>
  );
}

