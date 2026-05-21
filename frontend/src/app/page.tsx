"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mic, Video, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

import UserWidget from "../components/UserWidget";

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
            H
          </div>
          <span className="text-xl font-bold tracking-tight">HireMind AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="/features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        
        <UserWidget />
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          v2.0 AI Models Now Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
        >
          Master your next interview <br className="hidden md:block" />
          with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI precision</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-12"
        >
          Experience real-time AI-driven mock interviews. Analyze your voice, body language, and technical answers to land your dream job faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/setup">
            <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              Start Free Interview <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/demo">
            <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition-all">
              View Demo
            </button>
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-32"
        >
          {[
            { icon: FileText, title: "Smart Resume Analysis", desc: "Upload your CV and let AI tailor the interview questions specifically for you." },
            { icon: Mic, title: "Voice & Speech Analysis", desc: "Real-time tracking of confidence, tone, and filler words to perfect your delivery." },
            { icon: Video, title: "Facial Expression AI", desc: "Advanced computer vision tracks eye contact and stress levels during the session." },
            { icon: BarChart3, title: "Actionable Feedback", desc: "Get a comprehensive post-interview report with a detailed scoring dashboard." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col text-left hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
