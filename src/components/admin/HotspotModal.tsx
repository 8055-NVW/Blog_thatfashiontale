"use client";

import { getTrapWrapTarget, HOTSPOT_DIALOG_FOCUSABLE_SELECTOR } from "@/lib/hotspotDialogFocus";
import { getHotspotValidation, prepareHotspotsForSave } from "@/lib/adminHotspotAuthoring";
import { useEffect, useRef, useState } from "react";
import { HotspotType } from "@/types/HotspotType";
import HotspotEditor from "./HotspotEditor";

interface Props {
    imageUrl: string;
    initialHotspots: HotspotType[];
    onSave: (hotspots: HotspotType[]) => void;
    onClose: () => void;
}

export default function HotspotModal({
    imageUrl,
    initialHotspots,
    onSave,
    onClose,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [hotspots, setHotspots] = useState<HotspotType[]>(initialHotspots);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const saveState = prepareHotspotsForSave(hotspots);

    useEffect(() => {
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
                onClose();
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
            closeButtonRef.current?.focus();
        });

        return () => {
            window.cancelAnimationFrame(focusTimer);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleAddHotspot = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const newHotspot: HotspotType = { x, y, primary: null, related: [] };
        setHotspots([...hotspots, newHotspot]);
        setActiveIndex(hotspots.length);
    };

    const updateHotspot = (index: number, updated: HotspotType) => {
        const next = [...hotspots];
        next[index] = updated;
        setHotspots(next);
    };

    const deleteHotspot = (index: number) => {
        const next = [...hotspots];
        next.splice(index, 1);
        setHotspots(next);
        setActiveIndex(null);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/70 p-3 backdrop-blur-[2px] md:p-6" onClick={onClose}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-hotspot-title" tabIndex={-1} className="admin-card relative mx-auto max-w-5xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
                <div className="flex flex-col gap-3 border-b border-border px-4 py-4 md:px-5 md:py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <p className="meta-label">Hotspot authoring</p>
                            <h2 id="admin-hotspot-title" className="text-xl font-semibold tracking-[-0.02em] text-fg md:text-2xl">Place markers and assign products</h2>
                        </div>
                        <button ref={closeButtonRef} type="button" aria-label="Close hotspot editor" className="quiet-action min-h-10 w-10 px-0 text-lg" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    <div className="grid gap-3 text-sm leading-6 text-fg-muted lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <p>
                            Click the image to place a marker. Each saved hotspot needs a primary item with a link.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="admin-subcard px-3 py-2 text-sm text-fg-muted">{hotspots.length} draft marker{hotspots.length === 1 ? "" : "s"}</span>
                            <span className="admin-subcard px-3 py-2 text-sm text-fg-muted">{saveState.hotspots.length} ready to save</span>
                        </div>
                    </div>

                    {saveState.invalidHotspotCount > 0 ? (
                        <p className="rounded-lg border border-dashed border-danger/40 bg-danger/8 px-3 py-2 text-sm text-danger">
                            {saveState.invalidHotspotCount} marker{saveState.invalidHotspotCount === 1 ? " is" : "s are"} missing a primary link and cannot be saved yet.
                        </p>
                    ) : null}

                    {saveState.invalidRelatedItemCount > 0 ? (
                        <p className="rounded-lg border border-dashed border-border-strong bg-subtle px-3 py-2 text-sm text-fg-muted">
                            {saveState.invalidRelatedItemCount} related item{saveState.invalidRelatedItemCount === 1 ? "" : "s"} missing a link will be skipped on save.
                        </p>
                    ) : null}
                </div>

                <div className="relative" ref={containerRef} onClick={handleAddHotspot}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Admin authoring canvas needs arbitrary remote image URLs before persistence. */}
                    <img
                        src={imageUrl}
                        alt="Hotspot Base"
                        className="w-full object-contain max-h-[80vh]"
                    />
                    {hotspots.map((h, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Edit hotspot ${i + 1}`}
                            title={`Hotspot #${i + 1}`}
                            className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                                ${activeIndex === i
                                    ? "border-4 border-accent bg-surface shadow-[var(--shadow-soft)]"
                                    : getHotspotValidation(h).isSavable
                                        ? "border-2 border-fg bg-surface"
                                        : "border-2 border-danger bg-surface"}`}
                            style={{
                                left: `${h.x * 100}%`,
                                top: `${h.y * 100}%`,
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(i);
                            }}
                        >
                            <span className="sr-only">Hotspot {i + 1}</span>
                        </button>
                    ))}
                </div>

                {activeIndex !== null && (
                    <div className="border-t border-border bg-subtle p-4 md:p-5">
                        <HotspotEditor
                            hotspot={hotspots[activeIndex]}
                            onChange={(updated) => updateHotspot(activeIndex, updated)}
                            onDelete={() => deleteHotspot(activeIndex)}
                        />
                    </div>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
                    <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
                        Cancel
                    </button>
                    <button onClick={() => onSave(saveState.hotspots)} className="btn-primary w-full sm:w-auto" disabled={saveState.invalidHotspotCount > 0}>
                        Save Hotspots
                    </button>
                </div>
            </div>
        </div>
    );
}
