import React from "react";
import NextLink from "next/link";

// One link component for dashboard-edited links (menu items, buttons):
//  - "#section" / "/#section": smooth-scrolls on the homepage; on any other page it goes to the
//    homepage section ("/#section").
//  - http(s), mailto:, tel: links: a plain <a>.
//  - other internal paths: a Next client-side link.
// The menu item's target is respected everywhere; "_blank" also gets rel="noopener noreferrer".

/** Section id of a homepage anchor link ("#x" or "/#x"), or "" if the link is not one. */
export function homeAnchorId(href: string | undefined | null): string {
  const h = String(href || "").trim();
  if (h.startsWith("#")) return h.slice(1);
  if (h.startsWith("/#")) return h.slice(2);
  return "";
}

/** True for links that leave the Next app (other sites, email, phone). */
export function isExternalHref(href: string | undefined | null): boolean {
  return /^(https?:|mailto:|tel:|sms:|whatsapp:|\/\/)/i.test(String(href || "").trim());
}

/** Smooth-scrolls to a section if it is on the current page. Returns true when it scrolled. */
export function scrollToSectionOnPage(id: string): boolean {
  if (typeof window === "undefined" || !id) return false;
  if (window.location.pathname !== "/") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    window.history.replaceState(window.history.state, "", `#${id}`);
  } catch {
    /* ignore */
  }
  return true;
}

type SiteLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string | null;
  target?: string | null;
};

export function SiteLink({ href, target, rel, onClick, children, ...rest }: SiteLinkProps) {
  const raw = String(href || "").trim() || "/";
  const tgt = target && target !== "_self" ? target : undefined;
  const relValue = tgt === "_blank" ? rel || "noopener noreferrer" : rel;
  const anchorId = homeAnchorId(raw);

  if (anchorId) {
    const to = `/#${anchorId}`;
    return (
      <NextLink
        href={to}
        target={tgt}
        rel={relValue}
        {...rest}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || tgt === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          if (scrollToSectionOnPage(anchorId)) e.preventDefault();
        }}
      >
        {children}
      </NextLink>
    );
  }

  if (isExternalHref(raw)) {
    return (
      <a href={raw} target={tgt} rel={relValue} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={raw} target={tgt} rel={relValue} onClick={onClick} {...rest}>
      {children}
    </NextLink>
  );
}
