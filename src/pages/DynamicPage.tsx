import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "../utils/routerCompat";
import { ChevronDown, HelpCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";
import { usePageSeo } from "../utils/seo";

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
        <div className={`min-h-screen flex items-center justify-center ${isRenax ? "bg-[#0c0d12]" : "bg-white"}`}>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      );
    }

    if (!page) {
      return (
        <div className={`min-h-screen flex flex-col font-sans ${isRenax ? "bg-[#0c0d12] text-slate-100" : "bg-white text-slate-800"}`}>
          <Navbar onScrollTo={() => { }} />
          <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto py-28">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-sm text-slate-500 mb-6">The page you are looking for does not exist or may have been moved.</p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
            >
              Back to Home
            </button>
          </main>
          <Footer onScrollTo={() => { }} />
        </div>
      );
    }

    return (
      <div className={`min-h-screen flex flex-col font-sans ${isRenax ? "bg-[#0c0d12] text-slate-100" : "bg-white text-slate-800"}`}>
        <Navbar onScrollTo={() => { }} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
          <div className="w-full">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 pb-4 border-b break-words ${isRenax ? "text-white border-white/10" : "text-slate-900 border-slate-200"}`}>{page.title}</h1>
            <div className={`ql-snow ${isRenax ? "dark-page-content" : ""}`}>
              <div
                className={`ql-editor page-rich-content ${isRenax ? "text-slate-200" : "text-slate-800"}`}
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>

            {/* Page FAQs section if present */}
            {pageFaqs.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-200 max-w-4xl">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Frequently Asked Questions</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {page.faqTitle || `${page.title} FAQ`}
                  </h2>
                </div>
                <div className="space-y-3">
                  {pageFaqs.map((faq: any, index: number) => {
                    const isOpen = openFaqIndex === index;
                    const questionId = `page-faq-q-${index}`;
                    const answerId = `page-faq-a-${index}`;
                    return (
                      <div
                        key={faq.question || index}
                        className={`rounded-xl border transition-all duration-200 overflow-hidden ${isOpen
                            ? "border-emerald-300 bg-emerald-50/30 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                      >
                        {/* The question is a plain <h3> (text only). The toggle lives on the row + chevron button. */}
                        <div
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="cursor-pointer flex w-full items-center justify-between gap-4 p-5 select-none"
                        >
                          <h3
                            id={questionId}
                            className="text-left font-semibold text-slate-900 text-base sm:text-lg transition"
                          >
                            {faq.question}
                          </h3>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={answerId}
                            aria-labelledby={questionId}
                            className={`cursor-pointer h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>
                        <div
                          id={answerId}
                          role="region"
                          aria-labelledby={questionId}
                          className={`px-5 pb-5 pt-1 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-emerald-100/60 ${isOpen ? "block" : "hidden"
                            }`}
                        >
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer onScrollTo={() => { }} />
      </div>
    );
  }
