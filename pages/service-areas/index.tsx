import React from "react";
import Head from "next/head";
import ServiceAreas from "../../src/pages/ServiceAreas";

export default function ServiceAreasListPage() {
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
      </Head>
      <ServiceAreas />
    </>
  );
}

