"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface LimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    nextAvailableTime: number; // Timestamp in ms
}

export default function LimitModal({ isOpen, onClose, nextAvailableTime }: LimitModalProps) {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!isOpen) return;

        const calculateTimeLeft = () => {
            const now = Date.now();
            const diff = nextAvailableTime - now;

            if (diff <= 0) {
                setTimeLeft("00:00");
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            setTimeLeft(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [isOpen, nextAvailableTime]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-cyber-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#faf8f4] border-4 border-cyber-black p-8 text-center"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-yellow-100 flex items-center justify-center border-2 border-yellow-500">
                            <AlertTriangle className="text-yellow-600" size={32} />
                        </div>
                    </div>

                    <h3 className="font-pixel-heading text-xl mb-4 text-cyber-black">
                        GENERATION LIMIT REACHED
                    </h3>

                    <p className="font-pixel-body text-lg text-gray-600 mb-8">
                        You have reached the generation limit of 4 characters per hour.
                        Please come back later once the system has cooled down.
                    </p>

                    <div className="bg-cyber-black text-white p-6 mb-8 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-cyber-pink mb-1">
                            <Clock size={16} />
                            <span className="text-[10px] font-pixel-heading">TIME UNTIL RESET</span>
                        </div>
                        <span className="text-4xl font-pixel-heading tracking-widest">{timeLeft}</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full pixel-button py-4"
                    >
                        UNDERSTOOD
                    </button>

                    {/* Decorative lines */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyber-pink -translate-x-1 -translate-y-1" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyber-pink translate-x-1 translate-y-1" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
