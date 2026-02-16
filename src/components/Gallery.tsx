"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GeneratedPixelArt } from "@/lib/pixel-engine";

interface GalleryProps {
    images: GeneratedPixelArt[];
    onSelect: (image: GeneratedPixelArt) => void;
}

export default function Gallery({ images, onSelect }: GalleryProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const totalPages = Math.max(1, Math.ceil(images.length / itemsPerPage));

    // Ensure current page is within bounds after image updates
    const validPage = Math.min(currentPage, totalPages);
    if (validPage !== currentPage) {
        setCurrentPage(validPage);
    }

    const startIndex = (validPage - 1) * itemsPerPage;
    const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div id="collection-top" className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row items-center justify-center mb-8 gap-4 text-center">
                <h2 className="font-pixel-heading text-lg flex items-center justify-center gap-4 text-foreground">
                    <span className="w-8 h-1 bg-cyber-pink" />
                    COLLECTION ({images.length})
                    <span className="w-8 h-1 bg-cyber-pink" />
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {currentImages.map((img, idx) => (
                        <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            onClick={() => onSelect(img)}
                            className="aspect-square bg-white pixel-border p-2 cursor-pointer pixel-shadow hover:shadow-lg transition-all"
                        >
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: img.svg }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Fill empty slots logic simplified for the new 12-grid */}
                {images.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-foreground/5 border-2 border-dashed border-foreground/20 rounded-lg flex items-center justify-center">
                        <span className="text-foreground/40 font-pixel-heading text-[10px]">EMPTY SLOT</span>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 order-2 md:order-1">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: document.getElementById('collection-top')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            disabled={validPage === 1}
                            className="pixel-button !p-2 md:!px-4 md:!py-2 flex items-center gap-2 disabled:opacity-30"
                            title="Previous Page"
                        >
                            <ChevronLeft size={16} /> <span className="hidden sm:inline">PREVIOUS</span>
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                            {(() => {
                                const pages: (number | string)[] = [];
                                const showBoundary = 2;

                                if (totalPages <= 6) {
                                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                                } else {
                                    // Start pages
                                    for (let i = 1; i <= showBoundary; i++) pages.push(i);

                                    if (validPage > showBoundary + 2) {
                                        pages.push("...");
                                    }

                                    // Middle pages
                                    const rangeStart = Math.max(showBoundary + 1, validPage - 1);
                                    const rangeEnd = Math.min(totalPages - showBoundary, validPage + 1);

                                    for (let i = rangeStart; i <= rangeEnd; i++) {
                                        if (!pages.includes(i)) pages.push(i);
                                    }

                                    if (validPage < totalPages - showBoundary - 1) {
                                        pages.push("...");
                                    }

                                    // End pages
                                    for (let i = totalPages - showBoundary + 1; i <= totalPages; i++) {
                                        if (!pages.includes(i)) pages.push(i);
                                    }
                                }

                                return pages.map((p, i) => (
                                    p === "..." ? (
                                        <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-foreground/40 font-pixel-heading text-[10px]">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                setCurrentPage(Number(p));
                                                window.scrollTo({ top: document.getElementById('collection-top')?.offsetTop || 0, behavior: 'smooth' });
                                            }}
                                            className={`w-8 h-8 font-pixel-heading text-[10px] flex items-center justify-center transition-all ${validPage === p
                                                ? "bg-cyber-pink text-black"
                                                : "bg-background text-foreground border-2 border-foreground/20 hover:border-cyber-pink"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                ));
                            })()}
                        </div>

                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: document.getElementById('collection-top')?.offsetTop || 0, behavior: 'smooth' });
                            }}
                            disabled={validPage === totalPages}
                            className="pixel-button !p-2 md:!px-4 md:!py-2 flex items-center gap-2 disabled:opacity-30"
                            title="Next Page"
                        >
                            <span className="hidden sm:inline">NEXT</span> <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="order-1 md:order-2 text-[10px] font-pixel-heading text-slate-400">
                        PAGE <span className="text-cyber-pink">{validPage}</span> OF {totalPages}
                    </div>
                </div>
            )}
        </div>
    );
}
