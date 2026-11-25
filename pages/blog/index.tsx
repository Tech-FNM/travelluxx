import React from "react";
import { GetStaticProps } from "next";
import BlogList from "../../src/pages/BlogList";
import SeoHead from "../../src/components/SeoHead";
import { getMenu, getPosts, getWebsiteSettings } from "../../lib/mongodb";
import { contentText } from "../../src/content/useContent";
import { siteBaseUrl } from "../../src/lib/seoSchemas";

interface BlogListPageProps {
  posts: any[];
  settings: any;
  menu: any[] | null;
}

export default function BlogListPage({ posts, settings }: BlogListPageProps) {
  const s = settings || {};
  const base = siteBaseUrl(s);
  const title = contentText(s, "blog_seo_title");
  const description = contentText(s, "blog_seo_description");
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${base}/blog`,
    name: title,
    description,
    url: `${base}/blog`,
    inLanguage: "en-GB",
    isPartOf: { "@id": `${base}/#website` },
  };
  return (
    <>
      <SeoHead settings={s} path="/blog" title={title} description={description} schemas={[collection]} />
      <BlogList initialPosts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [posts, settings, menu] = await Promise.all([
      getPosts(),
      getWebsiteSettings().catch((e: any) => {
        console.error("Error loading settings for BlogList:", e);
        return {};
      }),
      getMenu().catch(() => null),
    ]);
    return {
      props: {
        posts: Array.isArray(posts) ? posts : [],
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for BlogList:", e);
    return {
      props: {
        posts: [],
        settings: {},
        menu: null,
      },
      revalidate: 60,
    };
  }
};
