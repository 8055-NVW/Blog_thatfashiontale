"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { HotspotType } from "@/types/HotspotType";
import { getTrapWrapTarget, HOTSPOT_DIALOG_FOCUSABLE_SELECTOR } from "@/lib/hotspotDialogFocus";

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

function getFallbackTitle(title?: string) {
  return title?.trim() || "Sourced item";
}

export default function PostHotspots({ image, title, hotspots = [] }: PostHotspotsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
    const dialogElement = dialogRef.current;

    const getFocusableElements = () => {
      if (!dialogElement) {
        return [];
      }

      return Array.from(dialogElement.querySelectorAll<HTMLElement>(HOTSPOT_DIALOG_FOCUSABLE_SELECTOR));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogElement?.focus();
        return;
      }

      if (!dialogElement?.contains(document.activeElement)) {
        event.preventDefault();
        const fallbackTarget = event.shiftKey
          ? focusableElements[focusableElements.length - 1]
          : focusableElements[0];
        fallbackTarget?.focus();
        return;
      }

      const wrapTarget = getTrapWrapTarget(focusableElements, document.activeElement as HTMLElement | null, event.shiftKey);

      if (wrapTarget) {
        event.preventDefault();
        wrapTarget.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements();
      const initialTarget = focusableElements[0] ?? dialogElement;
      initialTarget?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [activeIndex]);

  return (
    <>
      <div className="overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-[var(--shadow-soft)]">
        <div className="relative">
          <Image
            src={image}
            alt={title}
            width={1200}
            height={900}
            priority
            className="aspect-[16/10] w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 md:p-4">
            <div className="meta-label rounded-full border border-border-strong/80 bg-surface/90 px-3 py-1.5 text-fg shadow-[var(--shadow-soft)] backdrop-blur-sm">
              Editorial notes
            </div>
          </div>

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
                    className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setActiveIndex(index);
                    }}
                  >
                    <span className="absolute inset-0 rounded-full bg-surface/15 opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <span className="absolute h-3.5 w-3.5 rounded-full border border-border-strong bg-surface shadow-[0_8px_18px_rgba(20,16,12,0.16)] transition duration-200 group-hover:scale-110 group-focus-visible:scale-110 md:h-4 md:w-4" />
                    <span className="absolute h-1.5 w-1.5 rounded-full bg-accent md:h-1.5 md:w-1.5" />
                    <span className="absolute left-full ml-2 hidden min-w-7 rounded-full border border-border-strong bg-surface px-2 py-1 text-[10px] font-medium leading-none text-fg shadow-[0_10px_24px_rgba(20,16,12,0.16)] transition group-hover:block group-focus-visible:block md:block md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                      {index + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {validHotspots.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-subtle/65 px-4 py-3 md:px-5">
            <span>Open the image markers for sourced item details.</span>
            <span className="meta-count">{validHotspots.length} note{validHotspots.length === 1 ? "" : "s"}</span>
          </div>
        ) : null}
      </div>

      {activeHotspot?.primary ? (
        <div
          className="public-dialog-backdrop fixed inset-0 z-50 flex items-end p-2 md:items-center md:justify-center md:p-4"
          role="presentation"
          onClick={() => setActiveIndex(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hotspot-dialog-title"
            tabIndex={-1}
            className="public-dialog-surface max-h-[85vh] w-full max-w-2xl overflow-y-auto p-5 overscroll-contain md:max-h-[min(82vh,48rem)] md:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2.5 pr-2">
                <p className="meta-label">
                  Image hotspot
                </p>
                <h2 id="hotspot-dialog-title" className="text-[1.7rem] font-semibold leading-tight tracking-[-0.035em] text-fg md:text-[2rem]">
                  {getFallbackTitle(activeHotspot.primary.title)}
                </h2>
                <p className="max-w-xl text-sm leading-7 text-fg-muted md:text-[0.98rem]">
                  {getHotspotDescription(activeHotspot.primary.title)}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close hotspot details"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-subtle text-lg text-fg-muted transition hover:border-border-strong hover:text-fg"
                onClick={() => setActiveIndex(null)}
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-6 md:items-start">
              {activeHotspot.primary.image ? (
                <div className="public-dialog-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Dynamic scraped image URLs are not guaranteed to be supported by next/image. */}
                  <img
                    src={activeHotspot.primary.image}
                    alt={getFallbackTitle(activeHotspot.primary.title)}
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="public-dialog-card flex aspect-[4/5] items-end border-dashed border-border-strong p-4 text-sm leading-6 text-fg-muted">
                  Preview image unavailable. The original source still includes the full item context.
                </div>
              )}

              <div className="space-y-4 md:space-y-5">
                {activeHotspot.primary.price?.trim() ? (
                  <div className="public-dialog-card px-4 py-3.5">
                    <p className="meta-label">Observed price</p>
                    <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-fg">
                      {activeHotspot.primary.price.trim()}
                    </p>
                  </div>
                ) : null}

                <div className="public-dialog-card px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="meta-label">Source</p>
                      <p className="mt-2 text-sm font-medium text-fg">{getSourceLabel(activeHotspot.primary.link)}</p>
                    </div>
                    <p className="meta-label">Primary item</p>
                  </div>
                </div>

                <a
                  href={activeHotspot.primary.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft"
                >
                  Open original source
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
