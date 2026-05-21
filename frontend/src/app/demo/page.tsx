"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserWidget from "../../components/UserWidget";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Navigation (Simplified) */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
              H
            </div>
            <span className="text-xl font-bold tracking-tight">HireMind AI</span>
          </div>
        </Link>
        {user ? (
          <UserWidget />
        ) : (
          <Link href="/signin">
            <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium">
              Sign In
            </button>
          </Link>
        )}
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Product Walkthrough
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            See HireMind in Action
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-16">
            Watch how our advanced AI interviewer analyzes your voice, tracks your eye contact, and gives you real-time feedback.
          </p>
        </motion.div>

        {/* Video Player Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full aspect-video glass-panel rounded-3xl overflow-hidden relative group shadow-2xl flex items-center justify-center border border-white/10"
        >
          {isPlaying ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black">
              {/* Dummy playing state for demo purposes */}
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/50 animate-pulse">Loading Demo Video...</p>
            </div>
          ) : (
            <>
              {/* Thumbnail Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/40 to-blue-600/20 z-0" />
              
              {/* Play Button */}
              <button 
                onClick={() => setIsPlaying(true)}
                className="relative z-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              >
                <Play className="w-10 h-10 text-white ml-2" />
              </button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/signup">
            <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              Try It Yourself Free <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/how-it-works">
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-all text-lg">
              Read How It Works
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
