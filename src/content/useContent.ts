import { useSettings } from "../context/SettingsContext";
import { CONTENT_DEFAULTS } from "./registry";

const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");

/** The value the site shows for `key`: the admin's value, or the registered default. */
export function contentText(settings: any, key: string): string {
  const v = settings?.[key];
  if (!isEmpty(v) && typeof v !== "object") return String(v);
  return CONTENT_DEFAULTS[key] ?? "";
}

/** Show/hide switches. Stored as true/false (or "true"/"false"). */
export function contentOn(settings: any, key: string): boolean {
  const v = settings?.[key];
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return (CONTENT_DEFAULTS[key] ?? "true") !== "false";
}

/** A list field: one item per line. */
export function contentLines(settings: any, key: string): string[] {
  return contentText(settings, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * const c = useContent(settings);   // pass the page's settings prop if the component has one
 * c.t("home_statement_text"), c.on("home_statement_enabled"), c.lines("home_marquee_places")
 */
export function useContent(settingsOverride?: any) {
  const { settings: ctx } = useSettings();
  const s = settingsOverride && Object.keys(settingsOverride).length > 0 ? { ...ctx, ...settingsOverride } : ctx;
  return {
    t: (key: string) => contentText(s, key),
    on: (key: string) => contentOn(s, key),
    lines: (key: string) => contentLines(s, key),
    settings: s,
  };
}
