import React from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import DynamicPage from "../src/pages/DynamicPage";
import { getPages, getPageBySlug, getWebsiteSettings } from "../lib/mongodb";

interface GenericCmsPageProps {
  page: any;
  settings: any;
}

export default function GenericCmsPage({ page, settings }: GenericCmsPageProps) {
  if (!page) {
    return <DynamicPage />;
  }

  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = `${baseUrl}/${page.slug || ""}`;
  const metaTitle =
    page.metaTitle || page.ogTitle || `${page.title} | TravelLuxx`;
  const metaDesc = page.metaDescription || page.ogDescription || "";
  const pageFaqs =
    Array.isArray(page.faqs) && page.faqs.length > 0 ? page.faqs : [];

  const faqSchema =
    pageFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${pageUrl}#faq`,
          mainEntity: pageFaqs
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
          content={page.noIndexNoFollow ? "noindex, nofollow" : "index, follow"}
        />
        <link rel="canonical" href={pageUrl} />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
      </Head>
      <DynamicPage initialPage={page} initialSettings={settings} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const pages = await getPages();
    const paths = (Array.isArray(pages) ? pages : [])
      .filter((p: any) => p && p.slug)
      .map((p: any) => ({
        params: { slug: String(p.slug) },
      }));
    return { paths, fallback: "blocking" };
  } catch (e) {
    console.error("Error reading pages from MongoDB for getStaticPaths:", e);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const [page, settings] = await Promise.all([
      getPageBySlug(slug),
      getWebsiteSettings(),
    ]);

    if (!page) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        page,
        settings: settings || {},
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for page:", e);
    return { notFound: true, revalidate: 60 };
  }
};
