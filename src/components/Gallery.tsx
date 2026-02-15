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
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex-1 hidden md:block" />

                <h2 className="font-pixel-heading text-lg text-center flex items-center justify-center gap-4 text-foreground">
                    <span className="w-8 h-1 bg-cyber-pink" />
                    COLLECTION ({images.length})
                    <span className="w-8 h-1 bg-cyber-pink" />
                </h2>

                <div className="flex-1 flex justify-center md:justify-end items-center gap-4">
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={validPage === 1}
                                className="pixel-button !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <span className="font-pixel-heading text-[12px] min-w-[60px] text-center">
                                PAGE {validPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={validPage === totalPages}
                                className="pixel-button !p-2 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
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
                <div className="mt-12 flex justify-center items-center gap-6">
                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: document.getElementById('collection-top')?.offsetTop || 0, behavior: 'smooth' });
                        }}
                        disabled={validPage === 1}
                        className="pixel-button flex items-center gap-2 disabled:opacity-30"
                    >
                        <ChevronLeft size={16} /> PREVIOUS
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 font-pixel-heading text-[10px] flex items-center justify-center transition-all ${validPage === i + 1
                                    ? "bg-cyber-pink text-black"
                                    : "bg-background text-foreground border-2 border-foreground/20 hover:border-cyber-pink"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                        }}
                        disabled={validPage === totalPages}
                        className="pixel-button flex items-center gap-2 disabled:opacity-30"
                    >
                        NEXT <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
