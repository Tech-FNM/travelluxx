import React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { useContent } from "../src/content/useContent";
import { getWebsiteSettings } from "../lib/mongodb";

interface NotFoundProps {
  settings: any;
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/i.test(href);

function SmartLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href || "/"} className={className}>
      {children}
    </Link>
  );
}

export default function NotFoundPage({ settings }: NotFoundProps) {
  const c = useContent(settings);
  const isRenax = c.settings?.active_theme === "renax";

  const extraLinks = c.on("page_not_found_links_enabled")
    ? [
        { text: c.t("page_not_found_link1_text"), href: c.t("page_not_found_link1_href") },
        { text: c.t("page_not_found_link2_text"), href: c.t("page_not_found_link2_href") },
      ].filter((l) => l.text && l.href)
    : [];

  return (
    <>
      <Head>
        <title>{c.t("page_not_found_meta_title")}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={`min-h-screen flex flex-col ${isRenax ? "bg-brand-950 text-stone-200" : "bg-white text-stone-700"}`}>
        <Navbar onScrollTo={() => {}} />
        <main className={`flex flex-1 flex-col ${isRenax ? "" : "bg-ivory"}`}>
          <div className="tl-container flex flex-1 flex-col items-center justify-center py-32 text-center lg:py-40">
            {c.t("page_not_found_eyebrow") && (
              <span data-reveal className={`tl-eyebrow ${isRenax ? "tl-eyebrow-light" : ""}`}>
                {c.t("page_not_found_eyebrow")}
              </span>
            )}
            <h1
              data-reveal="lines"
              className={`tl-h1 mt-5 text-4xl sm:text-5xl lg:text-6xl ${isRenax ? "text-white" : "text-stone-900"}`}
            >
              {c.t("page_not_found_title")}
            </h1>
            <p data-reveal data-reveal-delay="0.15" className={`tl-lead mt-5 max-w-md ${isRenax ? "text-stone-300" : ""}`}>
              {c.t("page_not_found_text")}
            </p>
            <div data-reveal data-reveal-delay="0.3" className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <SmartLink
                href={c.t("page_not_found_button_link") || "/"}
                className={`tl-btn ${isRenax ? "tl-btn-light" : "tl-btn-primary"}`}
              >
                {c.t("page_not_found_button_text")}
              </SmartLink>
              {extraLinks.map((l, i) => (
                <SmartLink key={i} href={l.href} className={`tl-btn ${isRenax ? "tl-btn-outline-light" : "tl-btn-outline"}`}>
                  {l.text}
                </SmartLink>
              ))}
            </div>
          </div>
        </main>
        <Footer onScrollTo={() => {}} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let settings: any = {};
  try {
    settings = (await getWebsiteSettings()) || {};
  } catch (e) {
    console.error("Error loading settings for 404 page:", e);
  }
  return { props: { settings }, revalidate: 60 };
};
