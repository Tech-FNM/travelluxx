import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "../utils/routerCompat";
import { Plus, Minus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";
import { normalizeRichHtml } from "../utils/richText";

interface DynamicPageProps {
  initialPage?: any;
  initialSettings?: any;
}

export default function DynamicPage({
  initialPage,
  initialSettings,
}: DynamicPageProps = {}) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<any>(initialPage || null);
  const [fetching, setFetching] = useState(!initialPage);
  const { settings: ctxSettings, isLoading: globalLoading } = useSettings();
  const settings = initialSettings || ctxSettings;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const cleanSlug = (slug || "").replace(/^\/+|\/+$/g, "");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (initialPage && (initialPage.slug === cleanSlug || initialPage.id === cleanSlug)) {
      setPage(initialPage);
      setFetching(false);
      return;
    }

    setFetching(true);
    fetch(`/api/pages/${encodeURIComponent(cleanSlug)}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPage(data);
      })
      .catch(() => {
        setPage(null);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [cleanSlug, initialPage]);

  const baseUrl = "https://travelluxx.co.uk";
  const pageUrl = page ? `${baseUrl}/${page.slug || cleanSlug}` : "";
  const metaTitle = page?.metaTitle || page?.ogTitle || (page ? `${page.title} | TravelLuxx` : "Page | TravelLuxx");
  const metaDesc = page?.metaDescription || page?.ogDescription || "";
  const pageImage = page?.socialImage || page?.image || "";
  const pageFaqs = useMemo(() => {
    return (Array.isArray(page?.faqs) ? page.faqs : []).filter((f: any) => f && (f.question || f.answer));
  }, [page]);

  const pageSchemas = useMemo(() => {
    if (!page) return [];
    const list: any[] = [
      {
        "@context": "https://schema.org",
        "@type": page.template === "About Page" ? "AboutPage" : page.template === "Contact Page" ? "ContactPage" : "WebPage",
        "@id": pageUrl,
        "name": page.title,
        "description": metaDesc,
        "url": pageUrl,
        "inLanguage": "en-GB",
        "datePublished": page.date || undefined,
        "dateModified": page.updatedAt || page.date || undefined,
        "image": pageImage ? (pageImage.startsWith("http") ? pageImage : baseUrl + pageImage) : undefined,
        "publisher": {
          "@type": "Organization",
          "name": settings?.business_name || "TravelLuxx",
          "url": baseUrl
        }
      }
    ];

    if (pageFaqs.length > 0) {
      list.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": pageFaqs.map((f: any) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      });
    }

    return list;
  }, [page, pageUrl, metaDesc, pageImage, pageFaqs, settings, baseUrl]);

  usePageSeo({
    title: metaTitle,
    description: metaDesc,
    canonicalUrl: pageUrl,
    ogTitle: page?.ogTitle || metaTitle,
    ogDescription: page?.ogDescription || metaDesc,
    ogImage: pageImage ? (pageImage.startsWith("http") ? pageImage : baseUrl + pageImage) : "",
    ogUrl: pageUrl,
    ogType: page?.ogType || "website",
    noIndex: Boolean(settings?.search_engine_visibility || page?.noIndexNoFollow),
    siteName: settings?.business_name || "TravelLuxx",
    schemas: pageSchemas,
    customSchemaJson: page?.customSchema || ""
  });

  const isRenax = settings?.active_theme === "renax";

    if (fetching && !page) {
      return (
        <div className={`min-h-screen flex items-center justify-center ${isRenax ? "bg-brand-950" : "bg-white"}`}>
          <div
            role="status"
            aria-label="Loading"
            className={`h-8 w-8 animate-spin rounded-full border-2 border-t-transparent ${isRenax ? "border-brand-300" : "border-brand-700"}`}
          />
        </div>
      );
    }

    if (!page) {
      return (
        <div className={`min-h-screen flex flex-col ${isRenax ? "bg-brand-950 text-stone-200" : "bg-white text-stone-700"}`}>
          <Navbar onScrollTo={() => { }} />
          <main className="tl-container flex flex-1 flex-col items-center justify-center py-32 text-center lg:py-40">
            <h1 data-reveal="lines" className={`tl-h1 text-4xl sm:text-5xl ${isRenax ? "text-white" : "text-stone-900"}`}>Page Not Found</h1>
            <p data-reveal data-reveal-delay="0.15" className={`tl-lead mt-5 max-w-md ${isRenax ? "text-stone-300" : ""}`}>The page you are looking for does not exist or may have been moved.</p>
            <div data-reveal data-reveal-delay="0.3" className="mt-9">
              <button
                onClick={() => navigate("/")}
                className={`tl-btn ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
              >
                Back to Home
              </button>
            </div>
          </main>
          <Footer onScrollTo={() => { }} />
        </div>
      );
    }

    return (
      <div className={`min-h-screen flex flex-col ${isRenax ? "bg-brand-950 text-stone-200" : "bg-white text-stone-700"}`}>
        <Navbar onScrollTo={() => { }} />
        <main className="flex-1 w-full">
          {/* Page header */}
          <div className={isRenax ? "border-b border-white/10" : "bg-ivory"}>
            <div className="tl-container pt-32 pb-16 lg:pt-40 lg:pb-20">
              <h1 data-reveal="lines" className={`tl-h1 max-w-4xl text-4xl break-words sm:text-5xl ${isRenax ? "text-white" : "text-stone-900"}`}>{page.title}</h1>
            </div>
          </div>

          {/* Rich content */}
          <div className="tl-container tl-section">
            <div data-reveal className="max-w-3xl">
              <div className={`ql-snow ${isRenax ? "dark-page-content" : ""}`}>
                {/* Lists saved as plain <ul>/<ol> lose their markers to Quill's `.ql-editor li` reset: inherit them back from the list. */}
                <div
                  className={`ql-editor page-rich-content [&_li:not([data-list])]:[list-style-type:inherit]! ${isRenax ? "text-stone-200" : "text-stone-700"}`}
                  dangerouslySetInnerHTML={{ __html: normalizeRichHtml(page.content) }}
                />
              </div>
            </div>
          </div>

          {/* Page FAQs section if present */}
          {pageFaqs.length > 0 && (
            <div className={isRenax ? "border-t border-white/10" : "bg-ivory"}>
              <div className="tl-container tl-section">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className="lg:col-span-5">
                    <span data-reveal className={`tl-eyebrow ${isRenax ? "tl-eyebrow-light" : ""}`}>Frequently Asked Questions</span>
                    <h2 data-reveal="lines" className={`tl-h2 mt-4 text-3xl sm:text-4xl ${isRenax ? "text-white" : ""}`}>
                      {page.faqTitle || `${page.title} FAQ`}
                    </h2>
                  </div>
                  <div
                    data-reveal-group
                    className={`divide-y border-y lg:col-span-7 ${isRenax ? "divide-white/10 border-white/10" : "divide-stone-200 border-stone-200"}`}
                  >
                    {pageFaqs.map((faq: any, index: number) => {
                      const isOpen = openFaqIndex === index;
                      const questionId = `page-faq-q-${index}`;
                      const answerId = `page-faq-a-${index}`;
                      return (
                        <div key={faq.question || index}>
                          {/* The question is a plain <h3> (text only). The toggle lives on the row + sibling button. */}
                          <div
                            onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                            className="group flex items-start justify-between gap-6 py-6 cursor-pointer"
                          >
                            <h3
                              id={questionId}
                              className={`text-base leading-snug font-medium transition-colors duration-200 sm:text-lg ${isRenax
                                  ? "text-white group-hover:text-brand-300"
                                  : "text-stone-900 group-hover:text-brand-800"
                                }`}
                            >
                              {faq.question}
                            </h3>
                            <button
                              type="button"
                              aria-expanded={isOpen}
                              aria-controls={answerId}
                              aria-labelledby={questionId}
                              className={`-my-2.5 -mr-3 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center transition-colors duration-200 ${isRenax
                                  ? "text-stone-400 group-hover:text-white"
                                  : "text-stone-500 group-hover:text-stone-900"
                                }`}
                            >
                              {isOpen ? (
                                <Minus className="h-5 w-5" strokeWidth={1.5} />
                              ) : (
                                <Plus className="h-5 w-5" strokeWidth={1.5} />
                              )}
                            </button>
                          </div>
                          <div
                            id={answerId}
                            role="region"
                            aria-labelledby={questionId}
                            className={`pb-6 pr-10 text-base leading-relaxed ${isRenax ? "text-stone-300" : "text-stone-600"} ${isOpen ? "block" : "hidden"
                              }`}
                          >
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer onScrollTo={() => { }} />
      </div>
    );
  }
