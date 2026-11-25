/**
 * Custom code from Settings → Code Snippets (analytics, tag managers, verification tags, pixels).
 * Used by pages/_document.tsx so the code is part of every public page's server HTML.
 */

/** Plain JS or CSS pasted without tags is wrapped in <script> / <style>. */
export function prepareSnippet(code: unknown): string {
  if (!code || typeof code !== "string") return "";
  const trimmed = code.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("<") || /<\w+/i.test(trimmed)) return trimmed;
  if (trimmed.includes("{") && trimmed.includes("}") && !/function|var |const |let |=>/.test(trimmed)) {
    return `<style>\n${trimmed}\n</style>`;
  }
  return `<script>\n${trimmed}\n</script>`;
}

export interface HeadTag {
  tag: "script" | "style" | "noscript" | "meta" | "link" | "base";
  attrs: Record<string, string | true>;
  inner: string;
}

const REACT_ATTR: Record<string, string> = {
  class: "className",
  charset: "charSet",
  "http-equiv": "httpEquiv",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  nomodule: "noModule",
  hreflang: "hrefLang",
  fetchpriority: "fetchPriority",
};

function parseAttrs(source: string): Record<string, string | true> {
  const attrs: Record<string, string | true> = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const name = m[1].toLowerCase();
    if (name.startsWith("on")) continue; // inline event handlers are not supported in <head> tags
    const value = m[2] ?? m[3] ?? m[4];
    attrs[REACT_ATTR[name] || name] = value === undefined ? true : value;
  }
  return attrs;
}

/** Splits head HTML into the tags that are allowed in <head>. Anything else is ignored. */
export function parseHeadTags(html: string): HeadTag[] {
  const tags: HeadTag[] = [];
  const re = /<(script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<(meta|link|base)\b([^>]*?)\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1]) tags.push({ tag: m[1].toLowerCase() as HeadTag["tag"], attrs: parseAttrs(m[2] || ""), inner: m[3] || "" });
    else tags.push({ tag: m[4].toLowerCase() as HeadTag["tag"], attrs: parseAttrs(m[5] || ""), inner: "" });
  }
  return tags;
}
