import React, { useEffect } from "react";
import { useParams, Link } from "../utils/routerCompat";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { normalizeRichHtml } from "../utils/richText";

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
  const postFaqs = (Array.isArray(post?.faqs) && post.faqs.length > 0) ? post.faqs : DEFAULT_BLOG_FAQS;

  // Set SEO meta tags and Schema
  useEffect(() => {
    if (post) {
      const baseUrl = "https://travelluxx.co.uk";
      const postUrl = `${baseUrl}/blog/${post.slug || slug}`;

      document.title = post.metaTitle || post.title || "Blog | Travelluxx";

      // Helper to set/create meta tags
      const setMeta = (attr: string, attrVal: string, content: string) => {
        let el = document.querySelector(`meta[${attr}='${attrVal}']`);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, attrVal);
          document.head.appendChild(el);
        }
        el.setAttribute("content", content);
      };

      const desc = post.metaDescription || post.excerpt || "";
      setMeta("name", "description", desc);

      // Robots
      const isNoIndex = !!settings?.search_engine_visibility || !!post.noIndexNoFollow;
      setMeta("name", "robots", isNoIndex ? "noindex, nofollow" : "index, follow");

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", postUrl);

      // Open Graph
      setMeta("property", "og:type", "article");
      setMeta("property", "og:url", postUrl);
      setMeta("property", "og:title", post.metaTitle || post.title || "");
      setMeta("property", "og:description", desc);
      setMeta("property", "og:site_name", settings?.business_name || "TravelLuxx");
      if (post.socialImage || post.image) {
        const img = post.socialImage || post.image;
        setMeta("property", "og:image", img.startsWith("http") ? img : baseUrl + img);
      }
      if (post.date) setMeta("property", "article:published_time", post.date);

      // Twitter Card
      setMeta("property", "twitter:card", "summary_large_image");
      setMeta("property", "twitter:url", postUrl);
      setMeta("property", "twitter:title", post.metaTitle || post.title || "");
      setMeta("property", "twitter:description", desc);
      if (post.xImage || post.socialImage || post.image) {
        const img = post.xImage || post.socialImage || post.image;
        setMeta("property", "twitter:image", img.startsWith("http") ? img : baseUrl + img);
      }

      // Inject JSON-LD Schema
      const existingScript = document.getElementById("jsonld-post-schema");
      if (existingScript) existingScript.remove();

      const postImage = post.image ? (post.image.startsWith("http") ? post.image : baseUrl + post.image) : "";

      const schemas: any[] = [
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": postUrl,
          "headline": post.title,
          "image": postImage,
          "datePublished": post.date || "",
          "dateModified": post.updatedAt || post.date || "",
          "url": postUrl,
          "inLanguage": "en-GB",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl
          },
          "author": {
            "@type": "Person",
            "name": post.author || "Travelluxx Editorial"
          },
          "publisher": {
            "@type": "Organization",
            "name": settings?.business_name || "Travelluxx",
            "logo": settings?.logo_image ? {
              "@type": "ImageObject",
              "url": settings.logo_image.startsWith("http") ? settings.logo_image : baseUrl + settings.logo_image
            } : undefined
          },
          "description": desc
        }
      ];

      if (postFaqs && postFaqs.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": postFaqs.map((f: any) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        });
      }

      const script = document.createElement("script");
      script.id = "jsonld-post-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById("jsonld-post-schema");
      if (existingScript) existingScript.remove();
    };
  }, [post]);

  return (
    <div className="min-h-screen bg-white text-stone-700 flex flex-col">
      <Navbar onScrollTo={(id) => {
        if (id === "hero" || !id) {
          window.location.href = "/";
        }
      }} />

      <main className="flex-1 w-full">
        {loading ? (
          <div className="tl-container py-40 text-center text-base text-stone-500">Loading article...</div>
        ) : !post ? (
          <div className="tl-container py-40 text-center">
            <p className="text-2xl font-medium text-stone-900">Article Not Found</p>
            <Link to="/blog" className="tl-link mt-4 min-h-11">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Back to Blog
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
                  <span>By {post.author || "Travelluxx Editorial"}</span>
                  <span aria-hidden="true" className="hidden h-px w-8 bg-stone-300 sm:block" />
                  <span>Chauffeur &amp; Travel Guides</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="tl-container mt-12 lg:mt-16">
                <div data-reveal="image" className="mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden bg-stone-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt || `${post.title} - Travelluxx Executive Chauffeur Blog`}
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
                    <h2 data-reveal="lines" className="tl-h2 text-3xl sm:text-4xl">Frequently Asked Questions</h2>
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
                    Back to Articles
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
