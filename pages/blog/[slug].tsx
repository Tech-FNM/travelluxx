import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import BlogPostDetail from "../../src/pages/BlogPostDetail";
import SeoHead from "../../src/components/SeoHead";
import { getMenu, getPosts, getPostBySlug, getWebsiteSettings } from "../../lib/mongodb";
import { contentText } from "../../src/content/useContent";
import { absoluteUrl, blogPostFaqs, businessName, faqPageSchema, logoUrl, siteBaseUrl } from "../../src/lib/seoSchemas";

interface BlogPostDetailPageProps {
  post: any;
  settings: any;
  menu: any[] | null;
}

export default function BlogPostDetailPage({ post, settings }: BlogPostDetailPageProps) {
  if (!post) {
    return <BlogPostDetail />;
  }

  const s = settings || {};
  const base = siteBaseUrl(s);
  const path = `/blog/${post.slug || post.id}`;
  const postUrl = `${base}${path}`;
  const metaTitle = post.metaTitle || post.title || "Blog | TravelLuxx";
  const metaDesc = post.metaDescription || post.excerpt || "";
  const image = absoluteUrl(base, post.socialImage || post.image);
  const logo = logoUrl(s, base);

  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": postUrl,
    headline: post.title,
    description: metaDesc || undefined,
    image: image || undefined,
    datePublished: post.date || post.createdAt || undefined,
    dateModified: post.updatedAt || post.date || undefined,
    url: postUrl,
    inLanguage: "en-GB",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    author: { "@type": "Person", name: post.author || contentText(s, "blog_post_author_fallback") },
    publisher: {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: businessName(s),
      logo: logo ? { "@type": "ImageObject", url: logo } : undefined,
    },
  };

  return (
    <>
      <SeoHead
        settings={s}
        path={path}
        title={metaTitle}
        description={metaDesc}
        ogType="article"
        ogTitle={post.ogTitle}
        ogDescription={post.ogDescription}
        image={post.socialImage || post.image}
        xTitle={post.xTitle}
        xDescription={post.xDescription}
        xImage={post.xImage}
        noIndex={post.noIndexNoFollow}
        publishedTime={post.date || post.createdAt}
        modifiedTime={post.updatedAt}
        schemas={[article, faqPageSchema(postUrl, blogPostFaqs(post, s))]}
        customSchema={post.customSchema}
      />
      <BlogPostDetail initialPost={post} initialSettings={settings} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await getPosts();
    const paths = (Array.isArray(posts) ? posts : [])
      .filter((p: any) => p && (p.slug || p.id))
      .map((p: any) => ({
        params: { slug: String(p.slug || p.id) },
      }));
    return { paths, fallback: "blocking" };
  } catch (e) {
    console.error("Error reading posts from MongoDB for getStaticPaths:", e);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const [post, settings, menu] = await Promise.all([
      getPostBySlug(slug),
      getWebsiteSettings(),
      getMenu().catch(() => null),
    ]);

    if (!post) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        post,
        settings: settings || {},
        menu: menu ?? null,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for blog post:", e);
    return { notFound: true, revalidate: 60 };
  }
};
