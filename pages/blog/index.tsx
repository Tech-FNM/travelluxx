import React from "react";
import Head from "next/head";
import BlogList from "../../src/pages/BlogList";

export default function BlogListPage() {
  return (
    <>
      <Head>
        <title>Latest Articles & Travel Guides | TravelLuxx Chauffeur Blog</title>
        <meta
          name="description"
          content="Insights, airport transfer tips, and executive chauffeur guides across the UK by TravelLuxx."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://travelluxx.co.uk/blog" />
      </Head>
      <BlogList />
    </>
  );
}

