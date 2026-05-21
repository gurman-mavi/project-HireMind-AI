"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

import UserWidget from "../../components/UserWidget";

export default function PricingPage() {
  const [user, setUser] = useState<{name: string} | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for students getting started with interview prep.",
      features: [
        "3 Mock Interviews per month",
        "Basic AI Feedback",
        "Technical & HR Modes",
        "Standard Resume Parsing"
      ],
      buttonText: "Start Free",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "Advanced analytics and unlimited practice for serious candidates.",
      features: [
        "Unlimited Mock Interviews",
        "Dynamic Video & Voice Analysis",
        "Comprehensive Scorecards",
        "Industry-specific AI Personas",
        "Priority Email Support"
      ],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "Custom solutions for universities and coaching centers.",
      features: [
        "Everything in Pro",
        "Custom Branding",
        "Admin Dashboard & Analytics",
        "API Access",
        "Dedicated Success Manager"
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-hidden relative pb-32">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
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

      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-16 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Simple & Transparent
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Invest in your career.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            Choose the perfect plan to master your interview skills and land your dream job faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-panel p-8 rounded-3xl flex flex-col relative ${
                plan.isPopular ? 'border-primary/50 scale-105 shadow-[0_0_40px_rgba(124,58,237,0.15)] z-10' : 'border-white/10'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                {plan.period && <span className="text-white/50 font-medium">{plan.period}</span>}
              </div>

              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={user ? (plan.price === "Free" ? "/setup" : "/checkout") : "/signup"} className="w-full">
                <button 
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    plan.isPopular 
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {plan.buttonText} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
