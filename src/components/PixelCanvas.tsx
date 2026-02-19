"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface PixelCanvasProps {
    onGenerate: (svg: string) => void;
    currentSvg: string | null;
    isGenerating: boolean;
    isDisabled?: boolean;
    disabledMessage?: string;
    theme?: 'cyber' | 'sunset';
}

export default function PixelCanvas({
    onGenerate,
    currentSvg,
    isGenerating,
    isDisabled = false,
    disabledMessage,
    theme = 'cyber'
}: PixelCanvasProps) {
    const [pixels, setPixels] = useState<{ id: number; active: boolean }[]>([]);

    const activeColor = theme === 'cyber' ? "#00F2FF" : "#F97316";

    useEffect(() => {
        // Initialize 256 pixels for a denser 16x16 grid animation
        const initialPixels = Array.from({ length: 256 }, (_, i) => ({
            id: i,
            active: Math.random() > 0.7, // Denser distribution
        }));
        setPixels(initialPixels);

        const interval = setInterval(() => {
            setPixels(prev =>
                prev.map(p => Math.random() > 0.9 ? { ...p, active: !p.active } : p)
            );
        }, 1000); // Slower animation to save CPU

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center gap-8 py-12">
            <div className="relative group">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-cyber-pink" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-cyber-pink" />

                <div className="w-[320px] h-[320px] bg-white pixel-border flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!currentSvg ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-16 gap-0.5 w-full h-full p-2"
                            >
                                {pixels.map(p => (
                                    <motion.div
                                        key={p.id}
                                        animate={{
                                            backgroundColor: p.active ? activeColor : "#f1f5f9",
                                            opacity: p.active ? 1 : 0.4
                                        }}
                                        className="w-full aspect-square transition-all duration-300"
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="rendered"
                                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: currentSvg }}
                            />
                        )}
                    </AnimatePresence>

                    {isGenerating && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <Zap className="text-cyber-pink w-12 h-12 fill-cyber-pink" />
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={() => onGenerate("")}
                    disabled={isGenerating || isDisabled}
                    className={`pixel-button scale-125 transition-all ${isDisabled
                            ? "!bg-gray-400 !border-gray-600 cursor-not-allowed opacity-60 scale-110"
                            : "hover:scale-135"
                        }`}
                >
                    {isGenerating ? "GENERATING..." : "GENERATE PUNXEL"}
                </button>

                {isDisabled && disabledMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-xs text-center mt-4"
                    >
                        <p className="font-pixel-heading text-xs text-cyber-pink uppercase tracking-wider leading-relaxed">
                            {disabledMessage}
                        </p>
                    </motion.div>
                )}
            </div>

            <Link
                href="/punxeltown"
                className="font-pixel-body text-cyber-pink hover:underline uppercase tracking-widest text-sm flex items-center gap-2"
            >
                <div className="w-2 h-2 bg-cyber-pink animate-pulse" />
                Explore Punxeltown
            </Link>
        </div>
    );
}

