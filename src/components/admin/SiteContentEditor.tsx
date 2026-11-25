import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw, Search, X, ExternalLink } from "lucide-react";
import { CONTENT_SECTIONS } from "../../content/registry";
import type { ContentField } from "../../content/types";

interface Props {
  settings: any;
  setSettings: (updater: (prev: any) => any) => void;
  onSave: () => void;
  saving: boolean;
  /** Opens the media library; the chosen image is written to settings[key]. */
  pickImage: (key: string) => void;
}

const PREVIEW_PATH: Record<string, string> = {
  "Header & Footer": "/",
  Homepage: "/",
  Services: "/services",
  "Service Areas": "/service-areas",
  Blog: "/blog",
  Pages: "/about-us",
};

/**
 * "Site Content" tab: every editable text, link, image and switch on the public site, generated
 * from src/content/sections/*. An empty field means "use the default" (shown greyed out).
 */
export default function SiteContentEditor({ settings, setSettings, onSave, saving, pickImage }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const pages = useMemo(() => {
    const q = query.trim().toLowerCase();
    const groups: { page: string; sections: typeof CONTENT_SECTIONS }[] = [];
    for (const section of CONTENT_SECTIONS) {
      const matches =
        !q ||
        section.title.toLowerCase().includes(q) ||
        section.fields.some(
          (f) =>
            f.label.toLowerCase().includes(q) ||
            f.key.toLowerCase().includes(q) ||
            String(settings?.[f.key] ?? f.default).toLowerCase().includes(q)
        );
      if (!matches) continue;
      let g = groups.find((x) => x.page === section.page);
      if (!g) groups.push((g = { page: section.page, sections: [] }));
      g.sections.push(section);
    }
    return groups;
  }, [query, settings]);

  const set = (key: string, value: any) => setSettings((prev: any) => ({ ...prev, [key]: value }));
  const reset = (key: string) => setSettings((prev: any) => ({ ...prev, [key]: "" }));
  const isCustom = (f: ContentField) => {
    const v = settings?.[f.key];
    if (f.type === "toggle") return v === true || v === false || v === "true" || v === "false";
    return v !== undefined && v !== null && String(v).trim() !== "";
  };
  const totalFields = CONTENT_SECTIONS.reduce((n, s) => n + s.fields.length, 0);

  const inputClass =
    "w-full border border-[#8c8f94] bg-white rounded px-2.5 py-1.5 text-xs text-[#1d2327] focus:outline-none focus:border-[#2271b1] placeholder:text-[#a7aaad]";

  const renderField = (f: ContentField) => {
    const value = settings?.[f.key];
    const str = value === undefined || value === null || typeof value === "object" ? "" : String(value);

    let control: React.ReactNode;
    if (f.type === "toggle") {
      const on = value === true || value === "true" ? true : value === false || value === "false" ? false : f.default !== "false";
      control = (
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <input type="checkbox" checked={on} onChange={(e) => set(f.key, e.target.checked)} className="h-4 w-4" />
          <span>{on ? "Shown on the website" : "Hidden"}</span>
        </label>
      );
    } else if (f.type === "image") {
      const src = str || f.default;
      control = (
        <div className="flex flex-wrap items-center gap-3">
          {src ? (
            <div className="relative flex h-16 w-28 items-center justify-center overflow-hidden rounded border border-[#c3c4c7] bg-[#f6f7f7]">
              <img src={src} alt="" className="max-h-full max-w-full object-cover" />
              {!str && <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-center text-[9px] text-white">default</span>}
            </div>
          ) : null}
          <button type="button" onClick={() => pickImage(f.key)} className="rounded border border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1 text-xs text-[#2271b1] hover:bg-[#f0f0f1]">
            {str ? "Change image" : "Select image"}
          </button>
          <input type="text" value={str} onChange={(e) => set(f.key, e.target.value)} placeholder="or paste an image URL" className={`${inputClass} max-w-xs`} />
        </div>
      );
    } else if (f.type === "textarea" || f.type === "lines") {
      control = (
        <textarea
          rows={f.type === "lines" ? Math.min(10, Math.max(3, f.default.split("\n").length + 1)) : 3}
          value={str}
          onChange={(e) => set(f.key, e.target.value)}
          placeholder={f.default}
          className={inputClass}
        />
      );
    } else {
      control = (
        <input type="text" value={str} onChange={(e) => set(f.key, e.target.value)} placeholder={f.default} className={inputClass} />
      );
    }

    return (
      <div key={f.key} className="grid grid-cols-1 gap-1.5 border-b border-[#f0f0f1] py-3 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-4">
        <div>
          <span className="block text-xs font-semibold text-[#1d2327]">{f.label}</span>
          {f.type === "lines" && <span className="block text-[10px] text-[#646970]">One item per line</span>}
          {f.type === "url" && <span className="block text-[10px] text-[#646970]">/page, #section, https://, tel:, mailto:</span>}
          {f.help && <span className="block text-[10px] text-[#646970]">{f.help}</span>}
        </div>
        <div className="space-y-1">
          {control}
          <div className="flex items-center gap-3 text-[10px] text-[#646970]">
            {isCustom(f) ? (
              <button type="button" onClick={() => reset(f.key)} className="inline-flex items-center gap-1 text-[#2271b1] hover:underline">
                <RotateCcw className="h-3 w-3" /> Reset to default
              </button>
            ) : (
              f.type !== "toggle" && <span>Using the default text</span>
            )}
            <code className="text-[#a7aaad]">{f.key}</code>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-sm border border-[#c3c4c7] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1d2327]">Site Content</h2>
          <p className="text-xs text-[#646970]">
            Every text, button, link, image and section on the public website ({totalFields} fields). Leave a field empty to use the default shown in grey.
          </p>
        </div>
        <button type="button" onClick={onSave} disabled={saving} className="rounded bg-[#2271b1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#135e96] disabled:opacity-60">
          {saving ? "Saving..." : "Save all changes"}
        </button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8f94]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any text on the website, e.g. 'Get a quote'"
          className="w-full rounded-sm border border-[#8c8f94] bg-white py-2 pl-9 pr-9 text-sm focus:border-[#2271b1] focus:outline-none"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8f94]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {pages.length === 0 && <p className="text-xs text-[#646970]">Nothing matches "{query}".</p>}

      {pages.map((group) => (
        <div key={group.page} className="space-y-2">
          <div className="flex items-center justify-between pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#1d2327]">{group.page}</h3>
            {PREVIEW_PATH[group.page] && (
              <a href={PREVIEW_PATH[group.page]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#2271b1] hover:underline">
                View page <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          {group.sections.map((section) => {
            const expanded = query ? true : !!open[section.id];
            const custom = section.fields.filter(isCustom).length;
            return (
              <div key={section.id} className="rounded-sm border border-[#c3c4c7] bg-white">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [section.id]: !expanded }))}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#f6f7f7]"
                >
                  <span className="flex items-center gap-2">
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="text-sm font-semibold text-[#1d2327]">{section.title}</span>
                  </span>
                  <span className="text-[11px] text-[#646970]">
                    {section.fields.length} fields{custom ? ` · ${custom} edited` : ""}
                  </span>
                </button>
                {expanded && (
                  <div className="border-t border-[#f0f0f1] px-4 pb-2">
                    {section.description && <p className="pt-3 text-xs text-[#646970]">{section.description}</p>}
                    {section.fields
                      .filter(
                        (f) =>
                          !query ||
                          section.title.toLowerCase().includes(query.toLowerCase()) ||
                          f.label.toLowerCase().includes(query.toLowerCase()) ||
                          f.key.toLowerCase().includes(query.toLowerCase()) ||
                          String(settings?.[f.key] ?? f.default).toLowerCase().includes(query.toLowerCase())
                      )
                      .map(renderField)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="flex justify-end">
        <button type="button" onClick={onSave} disabled={saving} className="rounded bg-[#2271b1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#135e96] disabled:opacity-60">
          {saving ? "Saving..." : "Save all changes"}
        </button>
      </div>
    </div>
  );
}
