"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mic, Video, FileText, BarChart3, BrainCircuit, Bot, Clock } from "lucide-react";
import Link from "next/link";
import UserWidget from "../../components/UserWidget";

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "Smart Resume Analysis",
      description: "Upload your CV and let our AI parse your experience. It automatically generates highly relevant questions tailored to your specific background and the job you want."
    },
    {
      icon: BrainCircuit,
      title: "Dynamic AI Personas",
      description: "Practice with different interviewer personalities. From a friendly HR recruiter to a rigorous Senior Technical Lead, prepare for every scenario."
    },
    {
      icon: Mic,
      title: "Voice & Tone Analysis",
      description: "Advanced speech recognition tracks your confidence level, speaking rate, and filler words to help you perfect your verbal delivery."
    },
    {
      icon: Video,
      title: "Facial Expression Tracking",
      description: "Our computer vision models analyze your eye contact, micro-expressions, and stress indicators during the interview simulation."
    },
    {
      icon: Bot,
      title: "Real-time Technical Evaluation",
      description: "Answer coding questions or architecture problems verbally, and the AI will evaluate the accuracy and depth of your technical knowledge."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Scorecards",
      description: "Get a detailed breakdown of your performance across multiple dimensions, highlighting exactly what you did well and where to improve."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
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

      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Cutting-edge AI Technology
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Powerful Features
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-20">
            Everything you need to transform your interview anxiety into unshakeable confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full text-left">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 * index }}
              className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors pointer-events-none" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-24 glass-panel p-10 rounded-3xl w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="text-left flex-1">
            <h3 className="text-2xl font-bold mb-2">Ready to level up?</h3>
            <p className="text-white/60">Join thousands of job seekers landing their dream roles.</p>
          </div>
          <Link href="/signup">
            <button className="px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_30px_rgba(124,58,237,0.3)] whitespace-nowrap">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
