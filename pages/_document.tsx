import React from "react";
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { parseHeadTags, prepareSnippet } from "../src/lib/snippets";

/**
 * Site-wide <head>/<body> shell. Also outputs what the owner sets in the dashboard:
 *  - Settings → Code Snippets: header code (in <head>) and footer code (end of <body>)
 *  - Settings → General: favicon
 * These come from the page's settings prop, so a dashboard save shows on the next page refresh.
 */
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    const data: any = (this.props as any).__NEXT_DATA__ || {};
    const isAdmin = String(data.page || "").startsWith("/admin");
    const settings: any = data.props?.pageProps?.settings || {};
    const favicon = typeof settings.favicon_url === "string" && settings.favicon_url.trim() ? settings.favicon_url.trim() : "/travelluxx_logo.webp";
    const headTags = isAdmin ? [] : parseHeadTags(prepareSnippet(settings.custom_header_code));
    const footerCode = isAdmin ? "" : prepareSnippet(settings.custom_footer_code);

    return (
      <Html lang="en-GB">
        <Head>
          <link rel="icon" href={favicon} />
          <link rel="apple-touch-icon" href={favicon} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          {/* Enables scroll-reveal styling only when JS runs and motion is welcome (see src/components/Motion.tsx). */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                'try{if(!/^\\/admin/.test(location.pathname)&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")}catch(e){}',
            }}
          />
          {headTags.map((t, i) =>
            t.tag === "meta" || t.tag === "link" || t.tag === "base"
              ? React.createElement(t.tag, { key: `custom-head-${i}`, ...t.attrs })
              : React.createElement(t.tag, { key: `custom-head-${i}`, ...t.attrs, dangerouslySetInnerHTML: { __html: t.inner } })
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
          {footerCode ? <div id="custom-footer-code" dangerouslySetInnerHTML={{ __html: footerCode }} /> : null}
        </body>
      </Html>
    );
  }
}
