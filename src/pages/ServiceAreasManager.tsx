import React, { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type ServiceAreaFaq = { question: string; answer: string };
type ServiceArea = {
  id: string;
  title: string;
  slug: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroButtonText: string;
  heroButtonUrl: string;
  heroSecondaryButtonText: string;
  heroSecondaryButtonUrl: string;
  content: string;
  faqTitle: string;
  faqs: ServiceAreaFaq[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  noIndexNoFollow: boolean;
};

const emptyArea: Omit<ServiceArea, "id"> = {
  title: "",
  slug: "",
  heroBadge: "",
  heroTitle: "",
  heroDescription: "",
  heroImage: "",
  heroButtonText: "Plan your journey",
  heroButtonUrl: "/#calculator-section",
  heroSecondaryButtonText: "Call us",
  heroSecondaryButtonUrl: "",
  content: "",
  faqTitle: "",
  faqs: [],
  published: true,
  metaTitle: "",
  metaDescription: "",
  noIndexNoFollow: false,
};

const quillModules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function ServiceAreasManager() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceArea | null>(null);
  const [form, setForm] = useState(emptyArea);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/service-areas");
      if (!response.ok) throw new Error("Could not load service areas.");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("The service areas response was invalid.");
      setAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load service areas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({ ...emptyArea });
    setError("");
  };

  const startEdit = (area: ServiceArea) => {
    setEditing(area);
    setForm({
      ...emptyArea,
      ...area,
      faqs: Array.isArray(area.faqs) ? area.faqs : [],
      noIndexNoFollow: !!area.noIndexNoFollow,
    });
    setError("");
  };

  const saveArea = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Enter both a page title and URL slug.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        editing ? `/api/admin/service-areas/${editing.id}` : "/api/admin/service-areas",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            slug: form.slug.trim().replace(/^\/+|\/+$/g, "").toLowerCase(),
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save service area.");
      const savedArea = result.serviceArea as ServiceArea;
      setAreas(current =>
        editing
          ? current.map(area => (area.id === savedArea.id ? savedArea : area))
          : [...current, savedArea].sort((a, b) => a.title.localeCompare(b.title)),
      );
      setEditing(savedArea);
      setForm({ ...emptyArea, ...savedArea });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service area.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArea = async (area: ServiceArea) => {
    if (!window.confirm(`Delete the ${area.title} service area page?`)) return;
    try {
      const response = await fetch(`/api/admin/service-areas/${area.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete service area.");
      }
      setAreas(current => current.filter(item => item.id !== area.id));
      if (editing?.id === area.id) startNew();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service area.");
    }
  };

  const updateFaq = (index: number, key: keyof ServiceAreaFaq, value: string) => {
    setForm(current => ({
      ...current,
      faqs: current.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [key]: value } : faq,
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327] sm:text-2xl">Service Areas Management</h1>
          <p className="mt-1 text-xs text-[#646970]">
            Create and manage local area landing pages and their public content.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#135e96]"
        >
          <Plus className="h-4 w-4" /> Add New Area
        </button>
      </header>

      {error && (
        <div role="alert" className="flex items-center justify-between border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="overflow-hidden border border-[#c3c4c7] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#c3c4c7] bg-[#f6f7f7] px-4 py-3">
            <h2 className="text-sm font-bold">Service Areas</h2>
            <span className="text-xs text-[#646970]">{areas.length} total</span>
          </div>
          {loading ? (
            <p className="p-5 text-xs text-[#646970]">Loading service areas…</p>
          ) : areas.length === 0 ? (
            <p className="p-5 text-xs text-[#646970]">No service areas yet. Add one to get started.</p>
          ) : (
            <ul className="divide-y divide-[#f0f0f1]">
              {areas.map(area => (
                <li key={area.id} className="flex items-center justify-between gap-3 p-3 hover:bg-[#f6f7f7]">
                  <button type="button" onClick={() => startEdit(area)} className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-sm font-semibold text-[#2271b1]">{area.title}</span>
                    <span className="block truncate text-xs text-[#646970]">/service-areas/{area.slug}</span>
                    <span className={`mt-1 inline-block text-[10px] font-semibold ${area.published ? "text-emerald-700" : "text-slate-500"}`}>
                      {area.published ? "Published" : "Draft"}
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={() => startEdit(area)} className="p-1 text-[#2271b1]" aria-label={`Edit ${area.title}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <a href={`/service-areas/${area.slug}`} target="_blank" rel="noreferrer" className="p-1 text-[#2271b1]" aria-label={`View ${area.title}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={() => deleteArea(area)} className="p-1 text-red-600" aria-label={`Delete ${area.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form onSubmit={saveArea} className="space-y-5 border border-[#c3c4c7] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-[#f0f0f1] pb-3">
            <div>
              <h2 className="text-base font-bold">{editing ? `Edit: ${editing.title}` : "Add New Service Area"}</h2>
              <p className="mt-1 text-xs text-[#646970]">Manage its URL, hero, page copy, FAQs and SEO details.</p>
            </div>
            {editing && (
              <a href={`/service-areas/${editing.slug}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2271b1]">
                View Live <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#50575e]">
              Page title
              <input required value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" placeholder="e.g. Solihull" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              URL slug
              <span className="mt-1 flex items-center rounded-sm border border-[#8c8f94] px-2.5 text-sm font-normal text-[#646970]">
                /service-areas/
                <input required value={form.slug} onChange={event => setForm({ ...form, slug: event.target.value })} className="min-w-0 flex-1 border-0 py-2 text-[#1d2327] outline-none" placeholder="solihull" />
              </span>
            </label>
            <label className="text-xs font-semibold text-[#50575e] sm:col-span-2">
              Hero badge
              <input value={form.heroBadge} onChange={event => setForm({ ...form, heroBadge: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e] sm:col-span-2">
              Hero heading
              <input value={form.heroTitle} onChange={event => setForm({ ...form, heroTitle: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e] sm:col-span-2">
              Hero description
              <textarea rows={3} value={form.heroDescription} onChange={event => setForm({ ...form, heroDescription: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e] sm:col-span-2">
              Hero background image URL
              <input value={form.heroImage} onChange={event => setForm({ ...form, heroImage: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" placeholder="https://…" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              Primary button text
              <input value={form.heroButtonText} onChange={event => setForm({ ...form, heroButtonText: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              Primary button URL
              <input value={form.heroButtonUrl} onChange={event => setForm({ ...form, heroButtonUrl: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              Secondary button text
              <input value={form.heroSecondaryButtonText} onChange={event => setForm({ ...form, heroSecondaryButtonText: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              Secondary button URL <span className="font-normal">(leave blank to call business number)</span>
              <input value={form.heroSecondaryButtonUrl} onChange={event => setForm({ ...form, heroSecondaryButtonUrl: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" placeholder="tel:+441217140876" />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#50575e]">Area page content</label>
            <ReactQuill theme="snow" value={form.content} onChange={content => setForm(current => ({ ...current, content }))} modules={quillModules} className="bg-white" />
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Frequently Asked Questions</h3>
              <button type="button" onClick={() => setForm(current => ({ ...current, faqs: [...current.faqs, { question: "", answer: "" }] }))} className="inline-flex items-center gap-1 text-xs font-semibold text-[#2271b1]">
                <Plus className="h-3.5 w-3.5" /> Add FAQ
              </button>
            </div>
            <label className="block text-xs font-semibold text-[#50575e]">
              FAQ section heading
              <input value={form.faqTitle} onChange={event => setForm({ ...form, faqTitle: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            {form.faqs.map((faq, index) => (
              <div key={index} className="relative grid gap-3 rounded border border-[#dcdcde] bg-[#f6f7f7] p-3">
                <button type="button" onClick={() => setForm(current => ({ ...current, faqs: current.faqs.filter((_, faqIndex) => faqIndex !== index) }))} aria-label="Remove FAQ" className="absolute right-2 top-2 text-red-600">
                  <X className="h-4 w-4" />
                </button>
                <label className="pr-6 text-xs font-semibold text-[#50575e]">
                  Question
                  <input value={faq.question} onChange={event => updateFaq(index, "question", event.target.value)} className="mt-1 w-full rounded-sm border border-[#8c8f94] bg-white px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
                </label>
                <label className="text-xs font-semibold text-[#50575e]">
                  Answer
                  <textarea rows={2} value={faq.answer} onChange={event => updateFaq(index, "answer", event.target.value)} className="mt-1 w-full rounded-sm border border-[#8c8f94] bg-white px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
                </label>
              </div>
            ))}
          </section>

          <section className="grid gap-4 border-t border-[#f0f0f1] pt-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#50575e]">
              SEO title
              <input value={form.metaTitle} onChange={event => setForm({ ...form, metaTitle: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="text-xs font-semibold text-[#50575e]">
              SEO description
              <textarea rows={2} value={form.metaDescription} onChange={event => setForm({ ...form, metaDescription: event.target.value })} className="mt-1 w-full rounded-sm border border-[#8c8f94] px-2.5 py-2 text-sm font-normal text-[#1d2327]" />
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-[#50575e]">
              <input type="checkbox" checked={form.published} onChange={event => setForm({ ...form, published: event.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-[#50575e]">
              <input type="checkbox" checked={form.noIndexNoFollow} onChange={event => setForm({ ...form, noIndexNoFollow: event.target.checked })} />
              Hide from search engines
            </label>
          </section>

          <div className="flex flex-wrap justify-end gap-2 border-t border-[#f0f0f1] pt-4">
            <button type="button" onClick={startNew} className="rounded border border-[#c3c4c7] px-3.5 py-2 text-xs font-semibold text-[#50575e] hover:bg-slate-50">
              Clear
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#135e96] disabled:opacity-60">
              <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : editing ? "Update Area Page" : "Publish Area Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
