/**
 * Cleans HTML that comes out of the CMS editor before it is rendered.
 *
 * Text pasted into the editor is often saved with a non-breaking space between every word.
 * A paragraph like that has no place where a line is allowed to wrap, so the browser ends up
 * splitting words in the middle ("cha-uffeur"). A single non-breaking space that sits between
 * two words is turned back into a normal space. Deliberate spacing is left alone: empty
 * paragraphs (<p>&nbsp;</p>) and runs of several non-breaking spaces.
 *
 * Every page already has its own <h1> (the page title). A "Heading 1" used inside the editor would
 * give the page several, so those are rendered as <h2>.
 */
export function normalizeRichHtml(html: unknown): string {
  if (typeof html !== "string" || html.length === 0) return "";
  // (?<![\s>]) / (?![\s<]) : only between two visible characters, never next to a tag or other space.
  return html
    .replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2")
    .replace(/(?<![\s>\u00a0;])(?:&nbsp;|\u00a0)(?!&nbsp;|[\s<\u00a0])/g, " ");
}
