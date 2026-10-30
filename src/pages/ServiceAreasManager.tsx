import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  MapPin,
  Settings,
  Sparkles,
  Upload,
  Check,
  Globe,
  Search,
  Eye,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarDays,
  FileText
} from "lucide-react";
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

type ServiceAreasPageSettings = {
  hero_enabled: boolean;
  hero_tag: string;
  hero_title: string;
  hero_description: string;
  hero_button_text: string;
  hero_button_url: string;
  hero_image: string;
  meta_title: string;
  meta_description: string;
};

const defaultPageSettings: ServiceAreasPageSettings = {
  hero_enabled: true,
  hero_tag: "SERVICE AREAS",
  hero_title: "Explore TravelLuxx Service Areas Across the UK",
  hero_description:
    "Private chauffeur travel, airport transfers, and executive door-to-door transportation tailored around your location and schedule.",
  hero_button_text: "Plan Your Journey",
  hero_button_url: "/#calculator-section",
  hero_image:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85",
  meta_title: "Service Areas | Executive Chauffeur & Airport Transfers | TravelLuxx",
  meta_description:
    "Discover all the areas TravelLuxx covers across the West Midlands, London, and nationwide. Book your private chauffeur and airport transfer."
};

const emptyArea: Omit<ServiceArea, "id"> = {
  title: "",
  slug: "",
  heroBadge: "CHAUFFEUR SERVICE",
  heroTitle: "",
  heroDescription: "",
  heroImage:
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85",
  heroButtonText: "Plan your journey",
  heroButtonUrl: "/#calculator-section",
  heroSecondaryButtonText: "Call us",
  heroSecondaryButtonUrl: "tel:+441217140876",
  content: "",
  faqTitle: "Frequently Asked Questions",
  faqs: [],
  published: true,
  metaTitle: "",
  metaDescription: "",
  noIndexNoFollow: false
};

const quillModules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"]
  ]
};

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ServiceAreasManagerProps {
  initialViewMode?: "list" | "form" | "page-settings";
  onBack?: () => void;
}

export default function ServiceAreasManager({ initialViewMode = "list", onBack }: ServiceAreasManagerProps = {}) {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "form" | "page-settings">(initialViewMode);

  useEffect(() => {
    if (initialViewMode) setViewMode(initialViewMode);
  }, [initialViewMode]);
  const [editing, setEditing] = useState<ServiceArea | null>(null);
  const [form, setForm] = useState(emptyArea);
  const [pageSettings, setPageSettings] = useState<ServiceAreasPageSettings>(defaultPageSettings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Media Library modal state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"area-hero" | "page-hero">("area-hero");
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/service-areas");
      if (!response.ok) throw new Error("Could not load service areas.");
      const data = await response.json();
      if (Array.isArray(data)) setAreas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load service areas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSettings = async () => {
    try {
      const res = await fetch("/api/service-areas-page-settings");
      if (res.ok) {
        const data = await res.json();
        setPageSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load service areas page settings", e);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setMediaList(data);
      }
    } catch (e) {
      console.error("Failed to fetch media", e);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchPageSettings();
    fetchMedia();
  }, []);

  const openNewArea = () => {
    setEditing(null);
    setForm({ ...emptyArea });
    setError("");
    setViewMode("form");
  };

  const openEditArea = (area: ServiceArea) => {
    setEditing(area);
    setForm({
      ...emptyArea,
      ...area,
      faqs: Array.isArray(area.faqs) ? area.faqs : [],
      noIndexNoFollow: !!area.noIndexNoFollow
    });
    setError("");
    setViewMode("form");
  };

  const openPageSettings = () => {
    setError("");
    setViewMode("page-settings");
  };

  const saveArea = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Please provide both a page title and URL slug.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const cleanedSlug = form.slug.trim().replace(/^\/+|\/+$/g, "").toLowerCase();
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: cleanedSlug
      };

      const response = await fetch(
        editing ? `/api/admin/service-areas/${editing.id}` : "/api/admin/service-areas",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save service area.");
      const savedArea = result.serviceArea as ServiceArea;

      setAreas(current =>
        editing
          ? current.map(area => (area.id === savedArea.id ? savedArea : area))
          : [...current, savedArea].sort((a, b) => a.title.localeCompare(b.title))
      );
      setEditing(savedArea);
      setForm({ ...emptyArea, ...savedArea });
      showToast(editing ? "Service area updated successfully!" : "New service area published!");
      setViewMode("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service area.");
    } finally {
      setSaving(false);
    }
  };

  const savePageSettings = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/service-areas-page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageSettings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save page settings");
      showToast("Service areas main page settings saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save page settings.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArea = async (area: ServiceArea) => {
    if (!window.confirm(`Are you sure you want to delete the ${area.title} service area page?`)) return;
    try {
      const response = await fetch(`/api/admin/service-areas/${area.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete service area.");
      }
      setAreas(current => current.filter(item => item.id !== area.id));
      if (editing?.id === area.id) {
        setEditing(null);
        setViewMode("list");
      }
      showToast("Service area deleted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service area.");
    }
  };

  const toggleAreaStatus = async (area: ServiceArea) => {
    const updatedStatus = !area.published;
    try {
      const response = await fetch(`/api/admin/service-areas/${area.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...area, published: updatedStatus })
      });
      if (response.ok) {
        setAreas(current =>
          current.map(a => (a.id === area.id ? { ...a, published: updatedStatus } : a))
        );
        showToast(updatedStatus ? "Page published live!" : "Page set to draft.");
      }
    } catch (e) {
      showToast("Failed to update status", "error" as any);
    }
  };

  const updateFaq = (index: number, key: keyof ServiceAreaFaq, value: string) => {
    setForm(current => ({
      ...current,
      faqs: current.faqs.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [key]: value } : faq
      )
    }));
  };

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingMedia(true);
    for (const file of Array.from(files)) {
      try {
        const base64Data = await toBase64(file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, data: base64Data })
        });
        const json = await res.json();
        if (json.url) {
          setMediaList(prev => [json.url, ...prev]);
          setSelectedMediaUrl(json.url);
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    setUploadingMedia(false);
  };

  const confirmMediaSelection = () => {
    if (!selectedMediaUrl) return;
    if (mediaTarget === "area-hero") {
      setForm(prev => ({ ...prev, heroImage: selectedMediaUrl }));
    } else if (mediaTarget === "page-hero") {
      setPageSettings(prev => ({ ...prev, hero_image: selectedMediaUrl }));
    }
    setMediaModalOpen(false);
    setSelectedMediaUrl(null);
  };

  // Filtered areas
  const filteredAreas = areas.filter(area => {
    const matchesSearch =
      area.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && area.published !== false) ||
      (statusFilter === "draft" && area.published === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d2327] text-white px-4 py-3 rounded shadow-xl flex items-center gap-2 border-l-4 border-emerald-500 animate-fadeIn text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs (WordPress & Services-Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1d2327] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#2271b1]" />
            {viewMode === "page-settings"
              ? "Service Areas Main Page Settings"
              : viewMode === "form"
              ? editing?.id
                ? `Edit Area: ${form.title}`
                : "Add New Service Area"
              : "Service Areas Management"}
          </h1>
          <p className="text-[#646970] text-xs mt-0.5">
            {viewMode === "page-settings"
              ? "Manage the hero banner, titles, and SEO meta tags of the public /service-areas hub."
              : viewMode === "form"
              ? "Configure hero image, local chauffeur content, badges, FAQs, and SEO for this area landing page."
              : "Create and manage your local service area landing pages. Styled exactly like your Services Management system."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "list" ? (
            <>
              <button
                type="button"
                onClick={openNewArea}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3.5 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Area
              </button>
              <button
                type="button"
                onClick={openPageSettings}
                className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#2c3338] px-3.5 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-600" />
                Page Settings (/service-areas)
              </button>
              <a
                href="/service-areas"
                target="_blank"
                rel="noreferrer"
                className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#2271b1] px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View Hub Live
              </a>
            </>
          ) : viewMode === "page-settings" ? (
            <>
              <button
                type="button"
                onClick={savePageSettings}
                disabled={saving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Page Settings"}
              </button>
              <a
                href="/service-areas"
                target="_blank"
                rel="noreferrer"
                className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#2271b1] px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                View /service-areas
              </a>
              <button
                type="button"
                onClick={onBack ? onBack : () => setViewMode("list")}
                className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#50575e] px-3.5 py-1.5 rounded text-xs font-semibold transition"
              >
                {onBack ? "Back to Pages" : "Back to Areas List"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={saveArea}
                disabled={saving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : editing?.id ? "Update Area Page" : "Publish Area Page"}
              </button>
              {editing?.id && (
                <a
                  href={`/service-areas/${form.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#2271b1] px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Live
                </a>
              )}
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#50575e] px-3.5 py-1.5 rounded text-xs font-semibold transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div role="alert" className="flex items-center justify-between border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 rounded-sm">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. SERVICE AREAS MAIN PAGE SETTINGS TAB                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {viewMode === "page-settings" && (
        <div className="bg-white border border-[#c3c4c7] rounded-sm p-4 sm:p-6 shadow-sm space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#c3c4c7] bg-slate-50 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 p-4 sm:p-6 rounded-t-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                Public /service-areas Hub Configuration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the hero banner image, titles, button call-to-actions, and SEO search results preview.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/service-areas"
                target="_blank"
                rel="noreferrer"
                className="border border-[#c3c4c7] hover:bg-white bg-slate-100 text-[#2271b1] px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Preview
              </a>
              <button
                type="button"
                onClick={savePageSettings}
                disabled={saving}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-1.5 rounded text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Hub Settings"}
              </button>
            </div>
          </div>

          {/* Section: Main Hero Settings */}
          <div className="space-y-4 border-b border-[#f0f0f1] pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                1. Hero Banner Section
              </h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={pageSettings.hero_enabled !== false}
                  onChange={e => setPageSettings({ ...pageSettings, hero_enabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className={pageSettings.hero_enabled !== false ? "text-emerald-700 font-bold" : "text-slate-400"}>
                  {pageSettings.hero_enabled !== false ? "Hero Visible" : "Hero Hidden"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Hero Badge Tag
                </label>
                <input
                  type="text"
                  value={pageSettings.hero_tag || ""}
                  onChange={e => setPageSettings({ ...pageSettings, hero_tag: e.target.value })}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                  placeholder="SERVICE AREAS"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={pageSettings.hero_title || ""}
                  onChange={e => setPageSettings({ ...pageSettings, hero_title: e.target.value })}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                  placeholder="Explore TravelLuxx Service Areas Across the UK"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                Hero Subheading / Description
              </label>
              <textarea
                rows={2}
                value={pageSettings.hero_description || ""}
                onChange={e => setPageSettings({ ...pageSettings, hero_description: e.target.value })}
                className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                placeholder="Private chauffeur travel, airport transfers, and executive door-to-door transportation tailored around your location..."
              />
            </div>

            {/* Hero Background Image Picker with Media Library */}
            <div>
              <span className="block text-xs font-semibold text-[#1d2327] mb-1.5 uppercase tracking-wide">
                Hero Background Image Management
              </span>
              {pageSettings.hero_image ? (
                <div className="space-y-2 max-w-xl">
                  <div className="relative group aspect-[21/9] rounded border border-[#c3c4c7] overflow-hidden bg-slate-900 shadow-sm">
                    <img
                      src={pageSettings.hero_image}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget("page-hero");
                          setMediaModalOpen(true);
                        }}
                        className="bg-white/90 hover:bg-white text-slate-900 px-3 py-1.5 rounded text-xs font-bold shadow"
                      >
                        Change from Media Library
                      </button>
                      <button
                        type="button"
                        onClick={() => setPageSettings({ ...pageSettings, hero_image: "" })}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pageSettings.hero_image}
                      onChange={e => setPageSettings({ ...pageSettings, hero_image: e.target.value })}
                      placeholder="Or enter direct Image URL: https://..."
                      className="flex-1 border border-[#8c8f94] rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaTarget("page-hero");
                        setMediaModalOpen(true);
                      }}
                      className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 px-3 py-1.5 rounded text-xs font-semibold shrink-0"
                    >
                      Media Library
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget("page-hero");
                    setMediaModalOpen(true);
                  }}
                  className="w-full max-w-xl border border-dashed border-[#8c8f94] hover:bg-slate-50 text-[#2271b1] py-8 rounded text-xs font-semibold transition text-center flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span>+ Select Hero Banner Image from Media Library</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Hero Button Text
                </label>
                <input
                  type="text"
                  value={pageSettings.hero_button_text || ""}
                  onChange={e => setPageSettings({ ...pageSettings, hero_button_text: e.target.value })}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                  placeholder="Plan Your Journey"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Hero Button URL
                </label>
                <input
                  type="text"
                  value={pageSettings.hero_button_url || ""}
                  onChange={e => setPageSettings({ ...pageSettings, hero_button_url: e.target.value })}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                  placeholder="/#calculator-section"
                />
              </div>
            </div>
          </div>

          {/* Section: Hub SEO & Meta Tags */}
          <div className="space-y-4 border-b border-[#f0f0f1] pb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                2. SEO & Meta Tags for /service-areas
              </h3>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                SEO Page Meta Title
              </label>
              <input
                type="text"
                value={pageSettings.meta_title || ""}
                onChange={e => setPageSettings({ ...pageSettings, meta_title: e.target.value })}
                className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                placeholder="Service Areas | Executive Chauffeur & Airport Transfers | TravelLuxx"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={pageSettings.meta_description || ""}
                onChange={e => setPageSettings({ ...pageSettings, meta_description: e.target.value })}
                className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                placeholder="Discover all the areas TravelLuxx covers across the West Midlands, London, and nationwide..."
              />
            </div>

            {/* Google Snippet Preview */}
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1 max-w-2xl">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Google Search Result Preview
              </div>
              <div className="text-xs text-[#202124] flex items-center gap-1.5 font-mono">
                <span className="font-semibold text-emerald-800">travelluxx.co.uk</span>
                <span className="text-slate-400">› service-areas</span>
              </div>
              <div className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer line-clamp-1">
                {pageSettings.meta_title || "Service Areas | Executive Chauffeur & Airport Transfers | TravelLuxx"}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {pageSettings.meta_description || "Discover all the areas TravelLuxx covers across the West Midlands, London, and nationwide."}
              </div>
            </div>
          </div>

          {/* Bottom Save Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="border border-[#c3c4c7] hover:bg-slate-50 bg-white text-[#50575e] px-4 py-2 rounded text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={savePageSettings}
              disabled={saving}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Settings..." : "Save Hub Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. ADD / EDIT SERVICE AREA FORM                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      {viewMode === "form" && (
        <form onSubmit={saveArea} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main 3 Columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1.5 uppercase tracking-wide">
                  Area Name / Page Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => {
                    const newTitle = e.target.value;
                    setForm(prev => ({
                      ...prev,
                      title: newTitle,
                      slug:
                        !editing?.id &&
                        (!prev.slug ||
                          prev.slug ===
                            prev.title
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, ""))
                          ? newTitle
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "")
                          : prev.slug
                    }));
                  }}
                  placeholder="e.g. Solihull, Birmingham, Coventry, Stratford-upon-Avon..."
                  className="w-full border border-[#8c8f94] rounded-sm px-3 py-2 text-sm font-semibold text-[#1d2327] focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1.5 uppercase tracking-wide">
                  Permalink URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-sm border border-[#8c8f94] bg-slate-50 px-3 py-1.5 text-xs">
                  <span className="text-slate-500 font-mono select-none">/service-areas/</span>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="solihull"
                    className="flex-1 bg-transparent px-1 font-mono text-[#1d2327] outline-none font-semibold"
                  />
                  {editing?.id && (
                    <a
                      href={`/service-areas/${form.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-[#2271b1] hover:underline flex items-center gap-1 font-sans"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Hero Section Banner Settings for this Area */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm p-5 shadow-sm space-y-4">
              <div className="border-b border-[#f0f0f1] pb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Area Landing Hero Banner
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Displays at the top of /service-areas/{form.slug || ":slug"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Hero Badge Tag
                  </label>
                  <input
                    type="text"
                    value={form.heroBadge}
                    onChange={e => setForm({ ...form, heroBadge: e.target.value })}
                    placeholder="CHAUFFEUR SERVICE SOLIHULL"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Hero Main Heading
                  </label>
                  <input
                    type="text"
                    value={form.heroTitle}
                    onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                    placeholder="e.g. Executive Chauffeur & Airport Transfers in Solihull"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                  Hero Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={form.heroDescription}
                  onChange={e => setForm({ ...form, heroDescription: e.target.value })}
                  placeholder="Arrive in unmatched comfort, punctuality, and luxury with TravelLuxx..."
                  className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={form.heroButtonText}
                    onChange={e => setForm({ ...form, heroButtonText: e.target.value })}
                    placeholder="Plan your journey"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Primary Button URL
                  </label>
                  <input
                    type="text"
                    value={form.heroButtonUrl}
                    onChange={e => setForm({ ...form, heroButtonUrl: e.target.value })}
                    placeholder="/#calculator-section"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Secondary Call Button Text
                  </label>
                  <input
                    type="text"
                    value={form.heroSecondaryButtonText}
                    onChange={e => setForm({ ...form, heroSecondaryButtonText: e.target.value })}
                    placeholder="Call us"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                    Secondary Call Button URL / Phone
                  </label>
                  <input
                    type="text"
                    value={form.heroSecondaryButtonUrl}
                    onChange={e => setForm({ ...form, heroSecondaryButtonUrl: e.target.value })}
                    placeholder="tel:+441217140876"
                    className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                  />
                </div>
              </div>
            </div>

            {/* Rich Text Editor for Detailed Content */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                <label className="block text-xs font-semibold text-[#1d2327] uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Area Detailed Content & Guide
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Rich Text / HTML / Headings
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Write comprehensive details about chauffeur services, executive business travel, routes to Birmingham Airport / London Heathrow, fleet options, and local perks in {form.title || "this area"}.
              </p>
              <div className="min-h-[280px]">
                <ReactQuill
                  theme="snow"
                  value={form.content}
                  onChange={content => setForm(prev => ({ ...prev, content }))}
                  modules={quillModules}
                  placeholder="Introduce the area, local chauffeur solutions, corporate transport, airport pickups, and fleet perks..."
                  className="bg-white"
                />
              </div>
            </div>

            {/* FAQs Builder */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Area Frequently Asked Questions (FAQ)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Helpful local answers regarding pickups, wait times, airport flight monitoring, and pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      faqs: [...prev.faqs, { question: "", answer: "" }]
                    }))
                  }
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1.5 rounded-sm text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add FAQ Item
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                  FAQ Section Heading
                </label>
                <input
                  type="text"
                  value={form.faqTitle}
                  onChange={e => setForm({ ...form, faqTitle: e.target.value })}
                  placeholder="Frequently Asked Questions"
                  className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              {form.faqs.length === 0 ? (
                <div className="border border-dashed border-[#8c8f94] rounded p-6 text-center bg-slate-50">
                  <p className="text-xs text-slate-500 mb-2">No FAQs added for this area yet.</p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        faqs: [
                          {
                            question: `Can I book an executive airport transfer from ${form.title || "this area"}?`,
                            answer: `Yes, TravelLuxx provides round-the-clock private airport transfers to Birmingham (BHX), London Heathrow (LHR), Gatwick, Manchester, and East Midlands.`
                          },
                          {
                            question: `How far in advance should I reserve my chauffeur?`,
                            answer: `We recommend booking at least 24 hours in advance to guarantee vehicle availability, though last-minute bookings can also be arranged via our WhatsApp hotline.`
                          }
                        ]
                      }))
                    }
                    className="text-xs text-[#2271b1] font-semibold hover:underline"
                  >
                    + Load Default 2 FAQs
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-[#c3c4c7] rounded bg-[#fbfbfc] p-3.5 relative space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-1.5">
                        <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider">
                          FAQ #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm(prev => ({
                              ...prev,
                              faqs: prev.faqs.filter((_, i) => i !== idx)
                            }))
                          }
                          className="text-red-500 hover:text-red-700 p-1 transition"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => updateFaq(idx, "question", e.target.value)}
                          placeholder="e.g. Do you offer meet & greet services?"
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-[#646970] mb-1 uppercase">
                          Answer
                        </label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={e => updateFaq(idx, "answer", e.target.value)}
                          placeholder="Provide the detailed explanation..."
                          className="w-full border border-[#8c8f94] bg-white rounded-sm px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-[#2271b1]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEO & Meta Details */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#f0f0f1] pb-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Search Engine Optimization (SEO)
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                  placeholder={`Executive Chauffeur Service in ${form.title || "Area"} | TravelLuxx`}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1 uppercase tracking-wide">
                  Meta Description
                </label>
                <textarea
                  rows={2}
                  value={form.metaDescription}
                  onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                  placeholder={`Book executive private chauffeur travel and airport transfers across ${form.title || "this area"} with TravelLuxx. Fixed rates, luxury fleet.`}
                  className="w-full border border-[#8c8f94] rounded-sm px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                />
              </div>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-[#50575e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Published Live</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-[#50575e] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.noIndexNoFollow}
                    onChange={e => setForm({ ...form, noIndexNoFollow: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Discourage search engines (noindex, nofollow)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar: Hero Image & Actions) */}
          <div className="space-y-6">
            {/* Publish Actions Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 font-semibold text-xs text-[#2c3338] flex items-center justify-between">
                <span>Publish</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    form.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {form.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#646970]">
                  <span>Status:</span>
                  <span className="font-semibold text-black">
                    {form.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#646970]">
                  <span>Visibility:</span>
                  <span className="font-semibold text-black">
                    {form.noIndexNoFollow ? "Hidden from Google" : "Public Index"}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#f0f0f1] flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white py-2 rounded text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : editing?.id ? "Update Area" : "Publish Area"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="w-full border border-[#c3c4c7] hover:bg-slate-50 text-[#50575e] py-1.5 rounded text-xs font-semibold transition text-center"
                  >
                    Cancel & Return
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Image Management Box */}
            <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 font-semibold text-xs text-[#2c3338] flex items-center justify-between">
                <span>Hero Banner Image</span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="p-4 space-y-3">
                {form.heroImage ? (
                  <div className="space-y-2">
                    <div className="relative aspect-[16/9] rounded border border-[#c3c4c7] overflow-hidden bg-slate-900 shadow-sm">
                      <img src={form.heroImage} alt="Area Hero" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMediaTarget("area-hero");
                          setMediaModalOpen(true);
                        }}
                        className="flex-1 border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 py-1.5 rounded text-xs font-semibold transition"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, heroImage: "" })}
                        className="text-red-600 hover:text-red-800 text-xs px-2"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.heroImage}
                      onChange={e => setForm({ ...form, heroImage: e.target.value })}
                      placeholder="Or enter direct image URL"
                      className="w-full border border-[#8c8f94] rounded px-2 py-1 text-[11px] font-mono"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget("area-hero");
                      setMediaModalOpen(true);
                    }}
                    className="w-full border border-dashed border-[#8c8f94] hover:bg-slate-50 text-[#2271b1] py-6 rounded text-xs font-semibold transition text-center flex flex-col items-center justify-center gap-1.5"
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span>+ Select Hero Banner from Media</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. SERVICE AREAS LIST TABLE VIEW                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {/* Status Filters & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="space-x-2 text-[#50575e]">
              <span
                onClick={() => setStatusFilter("all")}
                className={`cursor-pointer ${
                  statusFilter === "all" ? "font-bold text-black" : "text-[#2271b1] hover:underline"
                }`}
              >
                All ({areas.length})
              </span>
              <span className="text-[#c3c4c7]">|</span>
              <span
                onClick={() => setStatusFilter("published")}
                className={`cursor-pointer ${
                  statusFilter === "published" ? "font-bold text-black" : "text-[#2271b1] hover:underline"
                }`}
              >
                Published ({areas.filter(a => a.published !== false).length})
              </span>
              <span className="text-[#c3c4c7]">|</span>
              <span
                onClick={() => setStatusFilter("draft")}
                className={`cursor-pointer ${
                  statusFilter === "draft" ? "font-bold text-black" : "text-[#2271b1] hover:underline"
                }`}
              >
                Drafts ({areas.filter(a => a.published === false).length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search service areas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="border border-[#8c8f94] bg-white rounded pl-8 pr-2.5 py-1 text-xs outline-none focus:border-[#2271b1] w-52"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs min-w-[750px]">
                <thead className="bg-[#f0f0f1] text-[#646970] font-semibold uppercase text-[10px] tracking-wide border-b border-[#c3c4c7]">
                  <tr>
                    <th className="py-2.5 px-3 text-left w-16">Hero Image</th>
                    <th className="py-2.5 px-3 text-left">Area Page Title</th>
                    <th className="py-2.5 px-3 text-left">URL Slug</th>
                    <th className="py-2.5 px-3 text-center">Hero Badge</th>
                    <th className="py-2.5 px-3 text-center">FAQs</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1] text-[#2c3338]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500 font-semibold">
                        Loading service areas...
                      </td>
                    </tr>
                  ) : filteredAreas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500">
                        No service areas found. Click "Add New Area" to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredAreas.map(area => (
                      <tr key={area.id} className="hover:bg-[#f6f7f7] transition group">
                        {/* Thumbnail */}
                        <td className="py-2 px-3">
                          <div className="w-14 h-9 rounded bg-slate-900 overflow-hidden border border-slate-200">
                            {area.heroImage ? (
                              <img
                                src={area.heroImage}
                                alt={area.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title & Quick Actions */}
                        <td className="py-2 px-3">
                          <div className="font-semibold text-sm text-[#2271b1]">
                            <span
                              onClick={() => openEditArea(area)}
                              className="hover:underline cursor-pointer"
                            >
                              {area.title}
                            </span>
                          </div>
                          <div className="hidden group-hover:flex items-center gap-1.5 text-[11px] text-[#555] pt-0.5">
                            <button
                              type="button"
                              onClick={() => openEditArea(area)}
                              className="text-[#2271b1] hover:underline"
                            >
                              Edit
                            </button>
                            <span className="text-[#ddd]">|</span>
                            <button
                              type="button"
                              onClick={() => toggleAreaStatus(area)}
                              className="text-slate-600 hover:underline"
                            >
                              {area.published !== false ? "Draft" : "Publish"}
                            </button>
                            <span className="text-[#ddd]">|</span>
                            <button
                              type="button"
                              onClick={() => deleteArea(area)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                            <span className="text-[#ddd]">|</span>
                            <a
                              href={`/service-areas/${area.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline"
                            >
                              View Live
                            </a>
                          </div>
                        </td>

                        {/* URL Slug */}
                        <td className="py-2 px-3 font-mono text-[#2271b1] text-xs">
                          /service-areas/{area.slug}
                        </td>

                        {/* Hero Badge */}
                        <td className="py-2 px-3 text-center">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                            {area.heroBadge || "CHAUFFEUR SERVICE"}
                          </span>
                        </td>

                        {/* FAQs Count */}
                        <td className="py-2 px-3 text-center">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {Array.isArray(area.faqs) ? area.faqs.length : 0} FAQs
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-2 px-3 text-center">
                          <span
                            onClick={() => toggleAreaStatus(area)}
                            className={`cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                              area.published !== false
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            }`}
                            title="Click to toggle status"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                area.published !== false ? "bg-emerald-600" : "bg-amber-600"
                              }`}
                            />
                            {area.published !== false ? "Published" : "Draft"}
                          </span>
                        </td>

                        {/* Quick Row Buttons */}
                        <td className="py-2 px-3 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openEditArea(area)}
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                          >
                            Edit
                          </button>
                          <a
                            href={`/service-areas/${area.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="border border-[#c3c4c7] hover:bg-white text-[#2271b1] px-2 py-1 rounded text-[11px] font-semibold transition inline-flex items-center gap-0.5"
                          >
                            View
                          </a>
                          <button
                            type="button"
                            onClick={() => deleteArea(area)}
                            className="border border-red-300 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-[11px] font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MEDIA LIBRARY SELECTION MODAL                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      {mediaModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn text-xs">
          <div className="bg-white shadow-xl rounded-sm w-full max-w-4xl border border-[#c3c4c7] flex flex-col overflow-hidden max-h-[85vh]">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#23282d] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#2271b1]" />
                Select Image for{" "}
                {mediaTarget === "page-hero"
                  ? "Main /service-areas Hero Banner"
                  : `Service Area Hero Banner`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setMediaModalOpen(false);
                  setSelectedMediaUrl(null);
                }}
                className="text-[#a7aaad] hover:text-[#2c3338] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto min-h-[400px]">
              {/* Media Grid */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 border-r border-[#c3c4c7]">
                <div className="flex items-center justify-between gap-3 mb-4 border-b border-[#ddd] pb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#2c3338]">Media Library</span>
                    <label className="border border-[#2271b1] text-[#2271b1] hover:bg-slate-50 bg-white px-2.5 py-1 rounded-sm text-xs font-semibold transition shadow-sm flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingMedia ? "Uploading..." : "Upload New Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleMediaUpload(e.target.files)}
                      />
                    </label>
                  </div>
                  <span className="text-[#646970] text-xs">{mediaList.length} total images</span>
                </div>

                {mediaList.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {mediaList.map((url, i) => {
                      const isSelected = selectedMediaUrl === url;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedMediaUrl(url)}
                          className={`aspect-video bg-white border cursor-pointer relative overflow-hidden group shadow-xs rounded-sm ${
                            isSelected
                              ? "border-4 border-[#2271b1]"
                              : "border-[#c3c4c7] hover:border-[#8c8f94]"
                          }`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#2271b1] text-white rounded-full p-0.5 shadow">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-400">
                    No media items uploaded yet. Click "Upload New Image" above.
                  </div>
                )}
              </div>

              {/* Sidebar Preview & Confirm */}
              <div className="w-full md:w-72 bg-[#f6f7f7] p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wide text-[#646970] border-b border-[#ddd] pb-1.5 mb-3">
                    Selected Image
                  </h4>
                  {selectedMediaUrl ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-slate-900 border border-[#c3c4c7] rounded overflow-hidden">
                        <img
                          src={selectedMediaUrl}
                          alt="Selected preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] text-[#646970] truncate font-mono">
                        {selectedMediaUrl.split("/").pop()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-10 text-center">
                      Click an image to preview and select it.
                    </p>
                  )}
                </div>

                <div className="border-t border-[#ddd] pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalOpen(false);
                      setSelectedMediaUrl(null);
                    }}
                    className="border border-[#c3c4c7] hover:bg-slate-100 px-3 py-1.5 rounded-sm font-semibold transition bg-white text-[#50575e]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmMediaSelection}
                    disabled={!selectedMediaUrl}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded-sm font-semibold shadow-sm transition disabled:opacity-40"
                  >
                    Use Selected Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
