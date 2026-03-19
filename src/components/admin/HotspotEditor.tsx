"use client"

import { extractApiMessage } from "@/lib/adminFeedback";
import { getHotspotValidation } from "@/lib/adminHotspotAuthoring";
import { useState } from "react"
import { HotspotType, HotspotItem } from "@/types/HotspotType"

interface Props {
    hotspot: HotspotType;
    onChange: (updated: HotspotType) => void;
    onDelete: ()=> void;
}

export default function HotspotEditor({ hotspot, onChange, onDelete} : Props) {

    const [linkInput, setLinkInput] = useState("");
    const validation = getHotspotValidation(hotspot);
    const [scrapeError, setScrapeError] = useState<string | null>(null);

    const handleScrape = async (target: "primary" | "related") => {
    try {
      setScrapeError(null);
      const res = await fetch("/api/scrape-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkInput }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setScrapeError(extractApiMessage(data, "Metadata scrape failed. You can still enter the item manually."));
        return;
      }

      const item: HotspotItem = {
        title: data.title || "",
        link: data.link || linkInput,
        image: data.image || "",
        price: data.price || "",
      };

      if (target === "primary") {
        onChange({ ...hotspot, primary: item });
      } else {
        onChange({ ...hotspot, related: [...hotspot.related, item] });
      }

      setLinkInput("");
    } catch {
      setScrapeError("Metadata scrape failed. You can still enter the item manually.");
    }
  };

  const updateItem = (field: keyof HotspotItem, value: string, isPrimary: boolean, index?: number) => {
    if (isPrimary && hotspot.primary) {
      onChange({ ...hotspot, primary: { ...hotspot.primary, [field]: value } });
    } else if (!isPrimary && typeof index === "number") {
      const updated = [...hotspot.related];
      updated[index] = { ...updated[index], [field]: value };
      onChange({ ...hotspot, related: updated });
    }
  };

  const deleteRelatedItem = (index: number) => {
    const updated = hotspot.related.filter((_, i) => i !== index);
    onChange({ ...hotspot, related: updated });
  };

    return (
        <div className="space-y-4">
      <div className="space-y-1">
        <p className="meta-label">Hotspot editor</p>
        <h3 className="text-lg font-semibold text-fg">Hotspot Products</h3>
        <p className="text-sm leading-6 text-fg-muted">
          Assign one primary item to keep this marker. Related items are optional references.
        </p>
      </div>

      {!validation.isSavable ? (
        <p className="rounded-lg border border-dashed border-danger/40 bg-danger/8 px-3 py-2 text-sm text-danger">
          This marker needs a primary item with a valid link before it can be saved.
        </p>
      ) : null}

      {validation.invalidRelatedItemCount > 0 ? (
        <p className="rounded-lg border border-dashed border-border-strong bg-surface px-3 py-2 text-sm text-fg-muted">
          Related items without links will be skipped on save.
        </p>
      ) : null}

      {/* Link Input */}
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
        <input
          placeholder="Paste product link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="input"
        />
        <button type="button" onClick={() => handleScrape("primary")} className="btn-secondary w-full md:w-auto">
          Add as Primary
        </button>
        <button type="button" onClick={() => handleScrape("related")} className="btn w-full md:w-auto">
          + Related
        </button>
      </div>

      {scrapeError ? (
        <p className="rounded-lg border border-dashed border-danger/40 bg-danger/8 px-3 py-2 text-sm text-danger">
          {scrapeError}
        </p>
      ) : null}

      {/* Primary Item */}
      {hotspot.primary && (
        <div className="admin-subcard space-y-3 p-4 md:p-5">
          <div className="space-y-1">
            <h4 className="font-semibold text-fg">Primary Product</h4>
            <p className="text-sm text-fg-muted">This is the only item shown in the public hotspot modal right now.</p>
          </div>
          <input
            value={hotspot.primary.title}
            onChange={(e) => updateItem("title", e.target.value, true)}
            placeholder="Title"
            className="input"
          />
          <input
            value={hotspot.primary.image}
            onChange={(e) => updateItem("image", e.target.value, true)}
            placeholder="Image URL"
            className="input"
          />
          <input
            value={hotspot.primary.link}
            onChange={(e) => updateItem("link", e.target.value, true)}
            placeholder="Link"
            className="input"
          />
          {hotspot.primary.image && (
            // eslint-disable-next-line @next/next/no-img-element -- Admin hotspot editing previews arbitrary scraped or manual image URLs.
            <img
              src={hotspot.primary.image}
              alt={hotspot.primary.title}
              className="h-24 w-24 rounded-lg border border-border object-cover"
            />
          )}
        </div>
      )}

      {/* Related Items */}
      {hotspot.related.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-semibold text-fg">Related Products</h4>
            <p className="text-sm text-fg-muted">Optional references for later expansion. Add links if you want them kept in the draft.</p>
          </div>
          {hotspot.related.map((item, index) => (
            <div
              key={index}
              className="admin-subcard relative space-y-3 p-4 md:p-5"
            >
              <button
                type="button"
                className="quiet-action absolute right-2 top-2 min-h-8 px-2 text-danger"
                onClick={() => deleteRelatedItem(index)}
              >
                ✕
              </button>
              <input
                value={item.title}
                onChange={(e) => updateItem("title", e.target.value, false, index)}
                placeholder="Title"
                className="input"
              />
              <input
                value={item.image}
                onChange={(e) => updateItem("image", e.target.value, false, index)}
                placeholder="Image URL"
                className="input"
              />
              <input
                value={item.link}
                onChange={(e) => updateItem("link", e.target.value, false, index)}
                placeholder="Link"
                className="input"
              />
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element -- Admin hotspot editing previews arbitrary scraped or manual image URLs.
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 rounded-lg border border-border object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={onDelete} className="btn-danger mt-2 w-full sm:w-auto">
        Delete This Hotspot
      </button>
    </div>
    )
}
