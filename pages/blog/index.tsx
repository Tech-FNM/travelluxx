import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import BlogList from "../../src/pages/BlogList";
import { getPosts } from "../../lib/mongodb";

interface BlogListPageProps {
  posts: any[];
}

export default function BlogListPage({ posts }: BlogListPageProps) {
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
      <BlogList initialPosts={posts} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getPosts();
    return {
      props: {
        posts: Array.isArray(posts) ? posts : [],
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error("Error in getStaticProps for BlogList:", e);
    return {
      props: {
        posts: [],
      },
      revalidate: 60,
    };
  }
};
