import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

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
      document.title = page.metaTitle || page.title || "Travelluxx";
      
      const meta = document.querySelector("meta[name='description']");
      if (meta) {
        meta.setAttribute("content", page.metaDescription || "");
      } else {
        const newMeta = document.createElement("meta");
        newMeta.setAttribute("name", "description");
        newMeta.setAttribute("content", page.metaDescription || "");
        document.head.appendChild(newMeta);
      }

      // Update robots meta tag
      let robotsMeta = document.querySelector("meta[name='robots']");
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      const isNoIndex = !!settings?.search_engine_visibility || !!page.noIndexNoFollow;
      robotsMeta.setAttribute("content", isNoIndex ? "noindex, nofollow" : "index, follow");

      // Inject JSON-LD Schema
      const existingScript = document.getElementById("jsonld-page-schema");
      if (existingScript) existingScript.remove();

      const schema = {
        "@context": "https://schema.org",
        "@type": page.template === "About Page" ? "AboutPage" : page.template === "Contact Page" ? "ContactPage" : "WebPage",
        "name": page.title,
        "description": page.metaDescription || "",
        "url": window.location.href,
        "publisher": {
          "@type": "Organization",
          "name": settings?.business_name || "Travelluxx",
          "logo": settings?.logo_image ? {
            "@type": "ImageObject",
            "url": settings.logo_image
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
      <Navbar onScrollTo={() => {}} settings={settings} />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-28 w-full">
        <div>
          <h1 className={`text-4xl font-extrabold mb-8 ${isRenax ? "text-white" : "text-slate-900"}`}>{page.title}</h1>
          <div
            className={`prose max-w-none text-base leading-relaxed ${isRenax ? "prose-invert text-slate-300" : "prose-slate text-slate-700"}`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </main>
      <Footer onScrollTo={() => {}} settings={settings} />
    </div>
  );
}
