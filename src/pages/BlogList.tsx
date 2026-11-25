import React from "react";
import { Link } from "../utils/routerCompat";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { useContent } from "../content/useContent";

interface BlogListProps {
  initialPosts?: any[];
}

export default function BlogList({ initialPosts }: BlogListProps = {}) {
  const { posts: ctxPosts, isLoading: loading } = useSettings();
  const posts = (initialPosts && initialPosts.length > 0) ? initialPosts : ctxPosts;
  const c = useContent();
  // SEO (title, meta, Open Graph, JSON-LD) is rendered on the server by pages/blog/index.tsx.

  return (
    <div className="min-h-screen bg-white text-stone-700 flex flex-col">
      <Navbar onScrollTo={() => {}} />

      <main className="flex-1 w-full">
        {/* Header */}
        <div className="bg-ivory">
          <div className="tl-container pt-32 pb-16 lg:pt-40 lg:pb-20">
            <span data-reveal className="tl-eyebrow">
              {c.t("blog_index_eyebrow")}
            </span>
            <h1 data-reveal="lines" className="tl-h1 mt-5 text-4xl text-stone-900 sm:text-5xl lg:text-6xl">{c.t("blog_index_title")}</h1>
            <p data-reveal data-reveal-delay="0.15" className="tl-lead mt-6 max-w-2xl">
              {c.t("blog_index_intro")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white">
          <div className="tl-container tl-section">
            {loading ? (
              <div className="py-16 text-base text-stone-500">{c.t("blog_index_loading")}</div>
            ) : posts.length === 0 ? (
              <div className="border-y border-stone-200 py-16 text-base text-stone-500">{c.t("blog_index_empty")}</div>
            ) : (
              <div data-reveal-group className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  // The whole post is one link block: the title link is stretched over the article.
                  <article key={post.id} className="group relative flex flex-col">
                    {post.image && (
                      <div className="aspect-[3/2] overflow-hidden bg-stone-100">
                        <img
                          src={post.image}
                          alt={post.imageAlt || `${post.title}${c.t("blog_index_image_alt_suffix")}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="mt-5 text-xs uppercase tracking-[0.2em] tabular-nums text-stone-500 empty:hidden first:mt-0">
                      {post.date}
                    </div>
                    <h2 className="mt-2 font-display text-2xl leading-snug font-medium text-stone-900 transition-colors duration-200 group-hover:text-brand-700">
                      <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600 empty:hidden">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="tl-link relative z-10 mt-5 self-start"
                    >
                      {c.t("blog_index_read_more")}
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
