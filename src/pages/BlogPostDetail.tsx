import React from "react";
import { useParams, Link } from "../utils/routerCompat";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { normalizeRichHtml } from "../utils/richText";
import { useContent } from "../content/useContent";
import { defaultBlogFaqs } from "../content/sections/blog";

interface BlogPostDetailProps {
  initialPost?: any;
  initialSettings?: any;
}

export default function BlogPostDetail({
  initialPost,
  initialSettings,
}: BlogPostDetailProps = {}) {
  const { slug } = useParams<{ slug: string }>();
  const { settings: ctxSettings, posts, isLoading: ctxLoading } = useSettings();
  const settings = initialSettings || ctxSettings;
  const post = initialPost || posts.find((p: any) => p.slug === slug || p.id === slug);
  const loading = !initialPost && ctxLoading;
  const c = useContent(settings);
  // An article's own FAQs (Posts editor) win; otherwise the default FAQs from Site Content > Blog.
  const postFaqs = (Array.isArray(post?.faqs) && post.faqs.length > 0) ? post.faqs : defaultBlogFaqs(c.t, c.on);
  const authorName = post?.author || c.t("blog_post_author_fallback");

  // SEO (title, meta, Open Graph, BlogPosting and FAQ JSON-LD) is rendered on the server by pages/blog/[slug].tsx.

  return (
    <div className="min-h-screen bg-white text-stone-700 flex flex-col">
      <Navbar onScrollTo={(id) => {
        if (id === "hero" || !id) {
          window.location.href = "/";
        }
      }} />

      <main className="flex-1 w-full">
        {loading ? (
          <div className="tl-container py-40 text-center text-base text-stone-500">{c.t("blog_post_loading")}</div>
        ) : !post ? (
          <div className="tl-container py-40 text-center">
            <p className="text-2xl font-medium text-stone-900">{c.t("blog_post_not_found")}</p>
            <Link to="/blog" className="tl-link mt-4 min-h-11">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              {c.t("blog_post_not_found_back")}
            </Link>
          </div>
        ) : (
          <article className="w-full pt-20 pb-20 lg:pt-28 lg:pb-28">
            {/* Header Section */}
            <div className="tl-container">
              <div className="mx-auto max-w-3xl text-center">
                <div data-reveal className="text-xs uppercase tracking-[0.2em] text-stone-500 empty:hidden">
                  {post.date ? new Date(post.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : ""}
                </div>
                <h1 data-reveal="lines" className="tl-h1 mt-6 text-4xl text-balance text-stone-900 sm:text-5xl">
                  {post.title}
                </h1>
                {/* Excerpt */}
                {post.excerpt && (
                  <div data-reveal data-reveal-delay="0.15" className="tl-lead mt-6">
                    {post.excerpt}
                  </div>
                )}
                <div
                  data-reveal
                  data-reveal-delay="0.3"
                  className="mt-8 flex flex-col items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 sm:flex-row sm:gap-4"
                >
                  <span>{c.t("blog_post_by_prefix")} {authorName}</span>
                  <span aria-hidden="true" className="hidden h-px w-8 bg-stone-300 sm:block" />
                  <span>{c.t("blog_post_category_label")}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="tl-container mt-12 lg:mt-16">
                <div data-reveal="image" className="mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden bg-stone-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || `${post.title}${c.t("blog_post_image_alt_suffix")}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="tl-container mt-12 lg:mt-16">
              <div className="mx-auto max-w-3xl">
                {/* Rich Body Content */}
                {/* Lists saved as plain <ul>/<ol> lose their markers to Quill's `.ql-editor li` reset: inherit them back from the list. */}
                <div data-reveal className="ql-snow">
                  <div
                    className="ql-editor page-rich-content article-body-content [&_li:not([data-list])]:[list-style-type:inherit]!"
                    dangerouslySetInnerHTML={{ __html: normalizeRichHtml(post.content) }}
                  />
                </div>

                {/* FAQs Section */}
                {postFaqs && postFaqs.length > 0 && (
                  <div className="mt-16 lg:mt-24">
                    <h2 data-reveal="lines" className="tl-h2 text-3xl sm:text-4xl">{c.t("blog_post_faq_heading")}</h2>
                    <div data-reveal-group className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                      {postFaqs.map((faq: any, idx: number) => (
                        <div key={idx} className="py-6">
                          <h3 className="text-lg font-medium text-stone-900">{faq.question}</h3>
                          <p className="mt-2 leading-relaxed text-stone-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back to Blog */}
                <div className="mt-8">
                  <Link to="/blog" className="tl-link min-h-11">
                    <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    {c.t("blog_post_back_text")}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>

      {/* Article-only additions to the shared .page-rich-content typography (src/index.css) */}
      <style>{`
        .article-body-content,
        .article-body-content p {
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: normal !important;
        }
        .article-body-content blockquote {
          color: var(--color-stone-600);
        }
        .article-body-content img {
          border-radius: 2px;
        }
      `}</style>

      <Footer onScrollTo={() => {}} />
    </div>
  );
}
