/**
 * Cleans HTML that comes out of the CMS editor before it is rendered.
 *
 * Text pasted into the editor is often saved with a non-breaking space between every word.
 * A paragraph like that has no place where a line is allowed to wrap, so the browser ends up
 * splitting words in the middle ("cha-uffeur"). A single non-breaking space that sits between
 * two words is turned back into a normal space. Deliberate spacing is left alone: empty
 * paragraphs (<p>&nbsp;</p>) and runs of several non-breaking spaces.
 */
export function normalizeRichHtml(html: unknown): string {
  if (typeof html !== "string" || html.length === 0) return "";
  // (?<![\s>]) / (?![\s<]) : only between two visible characters, never next to a tag or other space.
  return html.replace(/(?<![\s> ;])(?:&nbsp;| )(?!&nbsp;|[\s< ])/g, " ");
}
