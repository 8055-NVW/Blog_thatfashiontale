"use client"

import { useState } from "react"
import { Hotspot, HotspotItem } from "./HotspotModal"

interface Props {
    hotspot: Hotspot;
    onChange: (updated: Hotspot) => void;
    onDelete: ()=> void;
}

export default function HotspotEditor({ hotspot, onChange, onDelete} : Props) {

    const [linkInput, setLinkInput] = useState("");

    const handleScrape = async (target: "primary" | "related") => {
    try {
      const res = await fetch("/api/scrape-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkInput }),
      });
      const data = await res.json();
      const item: HotspotItem = {
        title: data.title || "",
        link: data.link || linkInput,
        image: data.image || "",
      };

      if (target === "primary") {
        onChange({ ...hotspot, primary: item });
      } else {
        onChange({ ...hotspot, related: [...hotspot.related, item] });
      }

      setLinkInput("");
    } catch {
      alert("Scrape failed. You can enter manually.");
      const fallback: HotspotItem = { title: "", link: linkInput, image: "" };

      if (target === "primary") {
        onChange({ ...hotspot, primary: fallback });
      } else {
        onChange({ ...hotspot, related: [...hotspot.related, fallback] });
      }

      setLinkInput("");
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
      <h3 className="text-lg font-semibold">Hotspot Products</h3>

      {/* Link Input */}
      <div className="flex gap-2">
        <input
          placeholder="Paste product link"
          value={linkInput}
          onChange={(e) => setLinkInput(e.target.value)}
          className="input flex-1"
        />
        <button onClick={() => handleScrape("primary")} className="btn-secondary">
          Add as Primary
        </button>
        <button onClick={() => handleScrape("related")} className="btn">
          + Related
        </button>
      </div>

      {/* Primary Item */}
      {hotspot.primary && (
        <div className="border p-4 rounded bg-white shadow space-y-2">
          <h4 className="font-semibold">Primary Product</h4>
          <input
            value={hotspot.primary.title}
            onChange={(e) => updateItem("title", e.target.value, true)}
            placeholder="Title"
            className="input w-full"
          />
          <input
            value={hotspot.primary.image}
            onChange={(e) => updateItem("image", e.target.value, true)}
            placeholder="Image URL"
            className="input w-full"
          />
          <input
            value={hotspot.primary.link}
            onChange={(e) => updateItem("link", e.target.value, true)}
            placeholder="Link"
            className="input w-full"
          />
          {hotspot.primary.image && (
            <img
              src={hotspot.primary.image}
              alt={hotspot.primary.title}
              className="w-24 h-24 object-cover rounded"
            />
          )}
        </div>
      )}

      {/* Related Items */}
      {hotspot.related.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Related Products</h4>
          {hotspot.related.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded bg-white shadow space-y-2 relative"
            >
              <button
                type="button"
                className="absolute top-1 right-1 text-red-500 text-sm"
                onClick={() => deleteRelatedItem(index)}
              >
                ✕
              </button>
              <input
                value={item.title}
                onChange={(e) => updateItem("title", e.target.value, false, index)}
                placeholder="Title"
                className="input w-full"
              />
              <input
                value={item.image}
                onChange={(e) => updateItem("image", e.target.value, false, index)}
                placeholder="Image URL"
                className="input w-full"
              />
              <input
                value={item.link}
                onChange={(e) => updateItem("link", e.target.value, false, index)}
                placeholder="Link"
                className="input w-full"
              />
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={onDelete} className="btn-danger mt-2">
        Delete This Hotspot
      </button>
    </div>
    )
}