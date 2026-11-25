import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

/**
 * Editor for the homepage reviews list (settings.google_reviews_list).
 * Used in both the Homepage editor and Settings, so both screens behave the same.
 */
export default function ReviewsListEditor({
  reviews,
  onChange,
}: {
  reviews: any[];
  onChange: (list: any[]) => void;
}) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;

  const update = (idx: number, patch: Record<string, any>) =>
    onChange(reviews.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const move = (idx: number, dir: -1 | 1) => {
    const swap = idx + dir;
    if (swap < 0 || swap >= reviews.length) return;
    const list = [...reviews];
    [list[idx], list[swap]] = [list[swap], list[idx]];
    onChange(list);
  };
  const remove = (idx: number) => onChange(reviews.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3 pt-1">
      {reviews.map((rev: any, rIdx: number) => (
        <div key={rIdx} className="bg-white border border-slate-200 rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Reviewer #{rIdx + 1}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={rIdx === 0}
                onClick={() => move(rIdx, -1)}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={rIdx === reviews.length - 1}
                onClick={() => move(rIdx, 1)}
                className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(rIdx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Author Name</label>
              <input
                type="text"
                value={rev.author_name || ""}
                onChange={e => update(rIdx, { author_name: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Star Rating</label>
              <select
                value={rev.rating || 5}
                onChange={e => update(rIdx, { rating: parseInt(e.target.value, 10) })}
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs bg-white"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Date / Relative Time</label>
              <input
                type="text"
                value={rev.relative_time_description || ""}
                onChange={e => update(rIdx, { relative_time_description: e.target.value })}
                placeholder="e.g. 2 weeks ago"
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>
          <div className="flex items-start gap-2">
            {rev.profile_photo_url ? (
              <img
                src={rev.profile_photo_url}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-4"
              />
            ) : null}
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Photo URL</label>
              <input
                type="text"
                value={rev.profile_photo_url || ""}
                onChange={e => update(rIdx, { profile_photo_url: e.target.value })}
                placeholder="https://... (leave empty to show the reviewer's initial)"
                className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Review Text</label>
            <textarea
              rows={2}
              value={rev.text || ""}
              onChange={e => update(rIdx, { text: e.target.value })}
              placeholder="Customer review comment..."
              className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
