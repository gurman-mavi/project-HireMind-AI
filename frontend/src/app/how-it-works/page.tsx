"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Settings, Video, LineChart } from "lucide-react";
import Link from "next/link";

import UserWidget from "../../components/UserWidget";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload Your Resume",
      description: "Start by securely uploading your CV. Our AI analyzes your skills, experience, and targeted role to generate highly customized, company-specific interview questions."
    },
    {
      icon: Settings,
      title: "2. Configure the Interview",
      description: "Choose the type of interview (Technical, Behavioral, HR) and set the difficulty level. The AI Interviewer adapts its persona to match your specific industry standards."
    },
    {
      icon: Video,
      title: "3. Live AI Simulation",
      description: "Jump into a realistic video call. The AI asks dynamic questions, analyzes your voice tone, facial expressions, and technical accuracy in real-time, just like a human recruiter."
    },
    {
      icon: LineChart,
      title: "4. Actionable Feedback",
      description: "Instantly receive a comprehensive scorecard. Review metrics on your eye contact, speaking rate, confidence, and get actionable tips on how to improve your specific answers."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
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
        <UserWidget />
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-8 pt-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-20">
            Four simple steps to mastering your next big interview with the power of artificial intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
              className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform"
            >
              {/* Subtle hover gradient inside the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/60 leading-relaxed text-lg">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20"
        >
          <Link href="/signup">
            <button className="px-10 py-5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              Start Practicing Free <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
