import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSettings } from "../context/SettingsContext";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { settings } = useSettings();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => { 
        if (!data.error && data.id) {
          setPage(data);
        } else {
          setPage(null);
        }
        setLoading(false); 
      })
      .catch(() => {
        setPage(null);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (page) {
      const baseUrl = "https://travelluxx.co.uk";
      const pageUrl = `${baseUrl}/${page.slug || slug}`;

      document.title = page.metaTitle || page.title || "Travelluxx";
      
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

      const desc = page.metaDescription || "";
      setMeta("name", "description", desc);

      // Robots
      const isNoIndex = !!settings?.search_engine_visibility || !!page.noIndexNoFollow;
      setMeta("name", "robots", isNoIndex ? "noindex, nofollow" : "index, follow");

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", pageUrl);

      // Open Graph
      setMeta("property", "og:type", "website");
      setMeta("property", "og:url", pageUrl);
      setMeta("property", "og:title", page.metaTitle || page.title || "");
      setMeta("property", "og:description", desc);
      setMeta("property", "og:site_name", settings?.business_name || "TravelLuxx");
      if (page.socialImage || page.image) {
        const img = page.socialImage || page.image;
        setMeta("property", "og:image", img.startsWith("http") ? img : baseUrl + img);
      }

      // Twitter Card
      setMeta("property", "twitter:card", "summary_large_image");
      setMeta("property", "twitter:url", pageUrl);
      setMeta("property", "twitter:title", page.metaTitle || page.title || "");
      setMeta("property", "twitter:description", desc);
      if (page.xImage || page.socialImage || page.image) {
        const img = page.xImage || page.socialImage || page.image;
        setMeta("property", "twitter:image", img.startsWith("http") ? img : baseUrl + img);
      }

      // Inject JSON-LD Schema
      const existingScript = document.getElementById("jsonld-page-schema");
      if (existingScript) existingScript.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": page.template === "About Page" ? "AboutPage" : page.template === "Contact Page" ? "ContactPage" : "WebPage",
        "@id": pageUrl,
        "name": page.title,
        "description": desc,
        "url": pageUrl,
        "inLanguage": "en-GB",
        "datePublished": page.date || undefined,
        "dateModified": page.updatedAt || page.date || undefined,
        "image": page.image ? (page.image.startsWith("http") ? page.image : baseUrl + page.image) : undefined,
        "isPartOf": {
          "@id": `${baseUrl}/#website`
        },
        "publisher": {
          "@type": "Organization",
          "name": settings?.business_name || "Travelluxx",
          "logo": settings?.logo_image ? {
            "@type": "ImageObject",
            "url": settings.logo_image.startsWith("http") ? settings.logo_image : baseUrl + settings.logo_image
          } : undefined
        }
      };

      const script = document.createElement("script");
      script.id = "jsonld-page-schema";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const existingScript = document.getElementById("jsonld-page-schema");
      if (existingScript) existingScript.remove();
    };
  }, [page, settings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d12] flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const isRenax = settings?.active_theme === "renax";

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isRenax ? "bg-[#0c0d12] text-slate-100" : "bg-white text-slate-800"}`}>
      <Navbar onScrollTo={() => {}} />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-28 w-full">
        <div>
          <h1 className={`text-4xl font-extrabold mb-8 ${isRenax ? "text-white" : "text-slate-900"}`}>{page.title}</h1>
          <div
            className={`prose max-w-none text-base leading-relaxed ${isRenax ? "prose-invert text-slate-300" : "prose-slate text-slate-700"}`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
      <Footer onScrollTo={() => {}} />
    </div>
  );
}
