"use client";

import { useRef, useState } from "react";
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
    const [hotspots, setHotspots] = useState<HotspotType[]>(initialHotspots);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
        <div className="fixed inset-0 z-50 overflow-auto bg-black/70 p-3 backdrop-blur-[2px] md:p-6">
            <div className="admin-card relative mx-auto max-w-5xl overflow-hidden">
                <div className="relative" ref={containerRef} onClick={handleAddHotspot}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- Admin authoring canvas needs arbitrary remote image URLs before persistence. */}
                    <img
                        src={imageUrl}
                        alt="Hotspot Base"
                        className="w-full object-contain max-h-[80vh]"
                    />
                    {hotspots.map((h, i) => (
                        <div
                            key={i}
                            title={`Hotspot #${i + 1}`}
                            className={`absolute h-6 w-6 cursor-pointer rounded-full transition 
                                ${activeIndex === i
                                    ? "border-4 border-accent bg-surface shadow-[var(--shadow-soft)]"
                                    : "border-2 border-fg bg-surface"}`}
                            style={{
                                left: `${h.x * 100}%`,
                                top: `${h.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveIndex(i);
                            }}
                        />
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
                    <button onClick={onClose} className="btn-secondary">
                        Cancel
                    </button>
                    <button onClick={() => onSave(hotspots)} className="btn-primary">
                        Save Hotspots
                    </button>
                </div>
            </div>
        </div>
    );
}
