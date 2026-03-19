"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { HotspotType } from "@/types/HotspotType";

type PostHotspotsProps = {
  image: string;
  title: string;
  hotspots?: HotspotType[];
};

function clampCoordinate(value: number) {
  if (!Number.isFinite(value)) {
    return 50;
  }

  return Math.min(100, Math.max(0, value * 100));
}

function getSourceLabel(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function getHotspotDescription(title?: string) {
  if (title?.trim()) {
    return "Open the original source for full product details and current availability.";
  }

  return "This hotspot includes a source link, but the scraped title was incomplete. Open the original source for the full item details.";
}

export default function PostHotspots({ image, title, hotspots = [] }: PostHotspotsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const validHotspots = useMemo(
    () => hotspots.filter((hotspot) => hotspot?.primary?.link),
    [hotspots]
  );

  const activeHotspot = activeIndex !== null ? validHotspots[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={900}
            priority
            className="aspect-[16/10] w-full object-cover"
          />

          {validHotspots.length > 0 ? (
            <div className="absolute inset-0">
              {validHotspots.map((hotspot, index) => {
                const left = clampCoordinate(hotspot.x);
                const top = clampCoordinate(hotspot.y);

                return (
                  <button
                    key={`${hotspot.primary?.link ?? "hotspot"}-${index}`}
                    type="button"
                    aria-label={`Open hotspot ${index + 1}${hotspot.primary?.title ? ` for ${hotspot.primary.title}` : ""}`}
                    className="group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/85 bg-[rgba(245,240,232,0.92)] text-xs font-semibold text-fg shadow-[0_12px_26px_rgba(20,16,12,0.16)] transition duration-200 hover:scale-105 hover:border-white hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(20,16,12,0.14)]"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="absolute inset-0 scale-[1.45] rounded-full border border-white/35 bg-white/10 opacity-90 transition group-hover:scale-[1.6] group-hover:opacity-100" />
                    <span className="relative">{index + 1}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {validHotspots.length > 0 ? (
          <div className="border-t border-border bg-subtle/65 px-4 py-3 text-xs tracking-[0.16em] text-fg-subtle uppercase md:px-5">
            Open the image markers for sourced item details.
          </div>
        ) : null}
      </div>

      {activeHotspot?.primary ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[rgba(20,16,12,0.42)] p-4 backdrop-blur-[2px] md:items-center md:justify-center"
          role="presentation"
          onClick={() => setActiveIndex(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hotspot-dialog-title"
            className="w-full max-w-xl rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
                  Image hotspot
                </p>
                <h2 id="hotspot-dialog-title" className="text-2xl font-semibold tracking-[-0.03em] text-fg">
                  {activeHotspot.primary.title?.trim() || "Linked item"}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close hotspot details"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-subtle text-lg text-fg-muted transition hover:border-border-strong hover:text-fg"
                onClick={() => setActiveIndex(null)}
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] md:items-start">
              {activeHotspot.primary.image ? (
                <div className="overflow-hidden rounded-xl border border-border bg-subtle">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic scraped image URLs are not guaranteed to be supported by next/image. */}
                  <img
                    src={activeHotspot.primary.image}
                    alt={activeHotspot.primary.title?.trim() || "Linked item preview"}
                    className="aspect-square h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-end rounded-xl border border-dashed border-border-strong bg-subtle p-4 text-sm leading-6 text-fg-muted">
                  Preview image unavailable. Open the source for the full product details.
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm leading-7 text-fg-muted">
                  {getHotspotDescription(activeHotspot.primary.title)}
                </p>

                {activeHotspot.primary.price?.trim() ? (
                  <div className="rounded-xl border border-border bg-subtle px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-fg-subtle">Observed price</p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.02em] text-fg">
                      {activeHotspot.primary.price.trim()}
                    </p>
                  </div>
                ) : null}

                <div className="rounded-xl border border-border bg-subtle px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-fg-subtle">Source</p>
                  <p className="mt-2 text-sm font-medium text-fg">{getSourceLabel(activeHotspot.primary.link)}</p>
                </div>

                <a
                  href={activeHotspot.primary.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft"
                >
                  View source
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
