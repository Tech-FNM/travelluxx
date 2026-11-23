import React from "react";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import BlogPostDetail from "../../src/pages/BlogPostDetail";
import { getPosts, getPostBySlug, getWebsiteSettings } from "../../lib/mongodb";

interface BlogPostDetailPageProps {
  post: any;
  settings: any;
}

const DEFAULT_BLOG_FAQS = [
  {
    question: "What makes executive chauffeur travel different from a standard taxi?",
    answer:
      "Our executive chauffeur services feature premium Mercedes-Benz vehicles, impeccably presented DBS-checked chauffeurs, complimentary in-cabin amenities, and fixed pricing without metered rates or surge fees.",
  },
  {
    question: "How far in advance should I book my airport chauffeur?",
    answer:
      "We recommend booking at least 12 to 24 hours in advance to guarantee vehicle allocation, though same-day urgent bookings can also be arranged.",
  },
];

export default function BlogPostDetailPage({
  post,
  settings,
}: BlogPostDetailPageProps) {
  if (!post) {
    return <BlogPostDetail />;
  }

  const baseUrl = "https://travelluxx.co.uk";
  const postUrl = `${baseUrl}/blog/${post.slug || post.id}`;
  const metaTitle = post.metaTitle || post.title || "Blog | TravelLuxx";
  const metaDesc = post.metaDescription || post.excerpt || "";
  const postFaqs =
    Array.isArray(post.faqs) && post.faqs.length > 0
      ? post.faqs
      : DEFAULT_BLOG_FAQS;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${postUrl}#faq`,
    mainEntity: postFaqs.map((f: any) => ({
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
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta
          name="robots"
          content={post.noIndexNoFollow ? "noindex, nofollow" : "index, follow"}
        />
        <link rel="canonical" href={postUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>
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
    const [post, settings] = await Promise.all([
      getPostBySlug(slug),
      getWebsiteSettings(),
    ]);

    if (!post) {
      return { notFound: true, revalidate: 60 };
    }

    return {
      props: {
        post,
        settings: settings || {},
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for blog post:", e);
    return { notFound: true, revalidate: 60 };
  }
};
