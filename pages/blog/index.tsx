import React from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import { GetStaticProps } from "next";
import BlogList from "../../src/pages/BlogList";

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
    const postsFilePath = path.join(process.cwd(), "posts.json");
    let posts: any[] = [];
    if (fs.existsSync(postsFilePath)) {
      posts = JSON.parse(fs.readFileSync(postsFilePath, "utf8"));
    }
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
