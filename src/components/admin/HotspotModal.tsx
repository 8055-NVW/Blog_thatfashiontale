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
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 p-8 overflow-auto">
            <div className="relative max-w-5xl mx-auto bg-white rounded shadow-lg">
                <div className="relative" ref={containerRef} onClick={handleAddHotspot}>
                    <img
                        src={imageUrl}
                        alt="Hotspot Base"
                        className="w-full object-contain max-h-[80vh]"
                    />
                    {hotspots.map((h, i) => (
                        <div
                            key={i}
                            title={`Hotspot #${i + 1}`}
                            className={`absolute w-6 h-6 rounded-full cursor-pointer transition 
                                ${activeIndex === i
                                    ? "bg-white border-6 border-blue-500 shadow-blue-500"
                                    : "bg-white border-2 border-black"}`}
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
                    <div className="p-4 border-t bg-gray-50">
                        <HotspotEditor
                            hotspot={hotspots[activeIndex]}
                            onChange={(updated) => updateHotspot(activeIndex, updated)}
                            onDelete={() => deleteHotspot(activeIndex)}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center p-4 border-t">
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
