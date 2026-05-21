"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, Download, Home, Target, Loader2 } from "lucide-react";
import Link from "next/link";
import UserWidget from "../../components/UserWidget";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [isEvaluating, setIsEvaluating] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [interviewType, setInterviewType] = useState("Technical");

  useEffect(() => {
    // Load interview config for the header
    const configStr = localStorage.getItem("interviewConfig");
    if (configStr) {
      setInterviewType(JSON.parse(configStr).type);
    }

    const fetchEvaluation = async () => {
      const transcriptStr = localStorage.getItem("interviewTranscript");
      if (!transcriptStr) {
        setIsEvaluating(false);
        return;
      }

      try {
        const history = JSON.parse(transcriptStr);
        // Only evaluate if there are actual user messages
        if (history.length <= 1) {
          setIsEvaluating(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/interview/evaluate-interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history })
        });
        
        const data = await response.json();
        setEvaluation(data);
        
        // Background task to save report to database
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const iType = configStr ? JSON.parse(configStr).type : "General";
            
            fetch("http://localhost:5000/api/interview/report", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id || user._id,
                interviewType: iType,
                ...data
              })
            }).catch(e => console.error("Failed to save report to DB", e));
          } catch(e) {}
        }

      } catch (error) {
        console.error("Failed to evaluate interview:", error);
      } finally {
        setIsEvaluating(false);
      }
    };

    fetchEvaluation();
  }, []);

  if (isEvaluating) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analyzing Your Performance...</h2>
        <p className="text-white/50 text-center max-w-md">
          Our AI is reviewing your entire interview transcript, analyzing your technical accuracy, communication skills, and confidence.
        </p>
      </div>
    );
  }

  // Fallback if no evaluation was generated (e.g., user ended immediately without talking)
  if (!evaluation) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">No Interview Data Found</h2>
        <p className="text-white/50 max-w-lg mb-8">
          It looks like you didn't answer any questions during the interview. 
          Return to the setup page to try again.
        </p>
        <Link href="/setup">
          <button className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <Home className="w-5 h-5" /> Back to Setup
          </button>
        </Link>
      </div>
    );
  }

  // Map dynamic data to Recharts format
  const skillData = [
    { subject: 'Technical', A: evaluation.technicalAccuracy || 0, fullMark: 100 },
    { subject: 'Communication', A: evaluation.communicationScore || 0, fullMark: 100 },
    { subject: 'Confidence', A: evaluation.confidenceScore || 0, fullMark: 100 },
    { subject: 'Problem Solving', A: Math.min((evaluation.technicalAccuracy + evaluation.communicationScore) / 2 + 5, 100) || 0, fullMark: 100 },
    { subject: 'Overall', A: evaluation.overallScore || 0, fullMark: 100 },
  ];

  const timelineData = evaluation.timelineData || [];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Interview Performance Report
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50"
            >
              {interviewType} Interview Role • Completed Just Now
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link href="/">
              <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2 text-sm font-medium transition-all">
                <Home className="w-4 h-4" /> Home
              </button>
            </Link>
            <button className="px-5 py-2.5 rounded-xl glass-panel hover:bg-white/5 flex items-center gap-2 text-sm font-medium transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <Link href="/setup">
              <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2 text-sm font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <Target className="w-4 h-4" /> New Interview
              </button>
            </Link>
            <div className="ml-2">
              <UserWidget />
            </div>
          </motion.div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Overall Score", value: `${evaluation.overallScore}/100`, highlight: "text-primary" },
            { label: "Technical Accuracy", value: `${evaluation.technicalAccuracy}%`, highlight: "text-blue-400" },
            { label: "Communication", value: `${evaluation.communicationScore}%`, highlight: "text-green-400" },
            { label: "Confidence", value: `${evaluation.confidenceScore}%`, highlight: "text-yellow-400" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-center"
            >
              <span className="text-white/50 text-sm mb-2">{stat.label}</span>
              <span className={`text-3xl font-bold ${stat.highlight}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Skill Analysis
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                  <Radar name="Candidate" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" /> Performance Over Time
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel p-6 rounded-2xl border-l-4 border-l-green-500"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Strengths
            </h3>
            <ul className="space-y-3">
              {evaluation.strengths && evaluation.strengths.length > 0 ? (
                evaluation.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-green-500 mt-1">•</span>
                    {str}
                  </li>
                ))
              ) : (
                <li className="text-white/50 text-sm">No specific strengths identified.</li>
              )}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-panel p-6 rounded-2xl border-l-4 border-l-red-500"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {evaluation.improvements && evaluation.improvements.length > 0 ? (
                evaluation.improvements.map((imp: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="text-red-500 mt-1">•</span>
                    {imp}
                  </li>
                ))
              ) : (
                <li className="text-white/50 text-sm">No specific improvements identified.</li>
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
