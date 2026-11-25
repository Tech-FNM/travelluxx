import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import DynamicPage from "../src/pages/DynamicPage";
import SeoHead from "../src/components/SeoHead";
import { getMenu, getPages, getPageBySlug, getWebsiteSettings } from "../lib/mongodb";
import { contentText } from "../src/content/useContent";
import { absoluteUrl, businessName, cmsPageFaqs, faqPageSchema, siteBaseUrl } from "../src/lib/seoSchemas";

interface GenericCmsPageProps {
  page: any;
  settings: any;
  menu: any[] | null;
}

export default function GenericCmsPage({ page, settings }: GenericCmsPageProps) {
  if (!page) {
    return <DynamicPage />;
  }

  const s = settings || {};
  const base = siteBaseUrl(s);
  const path = `/${page.slug || ""}`;
  const pageUrl = `${base}${path}`;
  const metaTitle =
    page.metaTitle ||
    page.ogTitle ||
    contentText(s, "page_meta_title_pattern").replace(/\{title\}/g, page.title || "");
  const metaDesc = page.metaDescription || page.ogDescription || "";
  const pageImage = absoluteUrl(base, page.socialImage || page.image);

  const webPage = {
    "@context": "https://schema.org",
    "@type": page.template === "About Page" ? "AboutPage" : page.template === "Contact Page" ? "ContactPage" : "WebPage",
    "@id": pageUrl,
    name: page.title,
    description: metaDesc || undefined,
    url: pageUrl,
    inLanguage: "en-GB",
    datePublished: page.date || undefined,
    dateModified: page.updatedAt || page.date || undefined,
    image: pageImage || undefined,
    isPartOf: { "@id": `${base}/#website` },
    publisher: { "@type": "Organization", "@id": `${base}/#organization`, name: businessName(s), url: `${base}/` },
  };

  return (
    <>
      <SeoHead
        settings={s}
        path={path}
        title={metaTitle}
        description={metaDesc}
        ogType={page.ogType}
        ogTitle={page.ogTitle}
        ogDescription={page.ogDescription}
        image={page.socialImage || page.image}
        xTitle={page.xTitle}
        xDescription={page.xDescription}
        xImage={page.xImage}
        noIndex={page.noIndexNoFollow}
        schemas={[webPage, faqPageSchema(pageUrl, cmsPageFaqs(page))]}
        customSchema={page.customSchema}
      />
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
    const [page, settings, menu] = await Promise.all([
      getPageBySlug(slug),
      getWebsiteSettings(),
      getMenu().catch(() => null),
    ]);

    if (!page) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        page,
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for page:", e);
    return { notFound: true, revalidate: 60 };
  }
};
