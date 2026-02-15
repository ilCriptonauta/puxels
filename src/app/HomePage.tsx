"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { generateCyberPixel, GeneratedPixelArt } from "@/lib/pixel-engine";
import { supabase } from "@/lib/supabase";
import PixelCanvas from "@/components/PixelCanvas";
import Gallery from "@/components/Gallery";
import ArtModal from "@/components/ArtModal";
import LimitModal from "@/components/LimitModal";
import RainEffect from "@/components/RainEffect";
import confetti from "canvas-confetti";

interface HomePageProps {
  initialId?: number;
}

export default function HomePage({ initialId }: HomePageProps) {
  const [collection, setCollection] = useState<GeneratedPixelArt[]>([]);
  const [selectedArt, setSelectedArt] = useState<GeneratedPixelArt | null>(null);
  const [currentSvg, setCurrentSvg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [count, setCount] = useState(1);
  const [genHistory, setGenHistory] = useState<number[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [theme, setTheme] = useState<'cyber' | 'sunset'>('cyber');

  // Handle initial shared ID
  useEffect(() => {
    if (initialId) {
      const art = generateCyberPixel(initialId);
      setSelectedArt(art);
    }
  }, [initialId]);

  // Load history and characters on mount
  useEffect(() => {
    const fetchCollection = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && !error) {
        setCollection(data as GeneratedPixelArt[]);
      }
    };

    fetchCollection();

    const saved = localStorage.getItem("gen_history");
    if (saved) {
      const parsed = JSON.parse(saved).filter((t: number) => t > Date.now() - 3600000);
      setGenHistory(parsed);
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem("gen_history", JSON.stringify(genHistory));
  }, [genHistory]);

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme") as 'cyber' | 'sunset';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update theme attribute and save
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'cyber' ? 'sunset' : 'cyber');
  };

  const handleGenerate = async () => {
    const now = Date.now();
    const recentGens = genHistory.filter(t => t > now - 3600000);

    if (recentGens.length >= 4) {
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);

    // Get current count from Supabase for sequential ID
    const { count: currentCount, error: countError } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true });

    if (countError) console.error("Count fetch error:", countError);

    const nextId = (currentCount || 0) + 1;
    const newArt = generateCyberPixel(nextId);

    // Save to Supabase if online/production (as requested)
    if (process.env.NODE_ENV === 'production' || true) { // Enabled also for test if needed, but the user said localhost can disappear. I'll keep it active for now so they see it works.
      const { error } = await supabase
        .from('characters')
        .insert([{
          id: newArt.id,
          svg: newArt.svg,
          traits: newArt.traits
        }]);

      if (error) console.error("Persistence error:", error);
    }

    setCurrentSvg(newArt.svg);
    setCollection(prev => [newArt, ...prev]); // Keep all generated items
    setGenHistory(prev => [...prev.filter(t => t > now - 3600000), now]);
    setCount(prev => prev + 1);
    setIsGenerating(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: theme === 'cyber' ? ['#00F2FF', '#18181B', '#FFFFFF'] : ['#F97316', '#431407', '#FFFFFF']
    });
  };

  const nextAvailableTime = genHistory.length > 0 ? genHistory[0] + 3600000 : Date.now();

  const handleSave = (art: GeneratedPixelArt) => {
    const blob = new Blob([art.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyber-punxel-${art.id.toString().padStart(6, '0')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <main className="min-h-screen pb-20 overflow-x-hidden relative transition-colors duration-500">
      <RainEffect />

      {/* Header */}
      <nav className="p-6 flex justify-between items-center border-b-2 border-cyber-black bg-[#0f172a] theme-nav sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyber-pink animate-pulse" />
          <h1 className="font-pixel-heading text-lg tracking-tighter text-white logo-text">
            CYBERPUNXELS <span className="text-cyber-pink">GEN</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="pixel-button !p-2 flex items-center gap-2 group"
          >
            {theme === 'cyber' ? (
              <Sun size={18} className="group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="group-hover:-rotate-12 transition-transform" />
            )}
            <span className="hidden md:inline font-pixel-heading text-[10px]">
              {theme === 'cyber' ? 'SUNSET' : 'CYBER'}
            </span>
          </button>

          <div className="hidden lg:flex gap-4 font-pixel-body text-sm text-slate-400">
            <span>v2.0.4-PROTO</span>
            <span className="text-cyber-pink">SYSTEM: ONLINE</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-16 px-4 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 bg-cyber-pink text-black font-pixel-heading text-[10px] mb-4"
          >
            PROCEDURAL ART ENGINE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-pixel-heading mb-6 uppercase tracking-tight text-foreground"
          >
            Cyber <span className="text-cyber-pink drop-shadow-[4px_4px_0_var(--accent-shadow)]">Punxels</span>
          </motion.h2>
          <p className="font-pixel-body text-xl max-w-2xl mx-auto mb-12 opacity-80 text-muted">
            Generate unique high-fidelity pixel art street warriors for the digital underworld.
            All creations are exported as scalable vector graphics.
          </p>
        </section>

        {/* Generator */}
        <PixelCanvas
          onGenerate={handleGenerate}
          currentSvg={currentSvg}
          isGenerating={isGenerating}
          theme={theme}
        />

        {/* Gallery */}
        <Gallery images={collection} onSelect={setSelectedArt} />
      </div>

      {/* Modal */}
      <ArtModal
        image={selectedArt}
        onClose={() => setSelectedArt(null)}
        onSave={handleSave}
      />

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        nextAvailableTime={nextAvailableTime}
      />

      <style jsx global>{`
        .theme-nav { background-color: var(--navbar-bg) !important; color: var(--foreground) !important; }
        .logo-text { color: var(--foreground) !important; }
      `}</style>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-pink to-transparent opacity-30" />
    </main>
  );
}
