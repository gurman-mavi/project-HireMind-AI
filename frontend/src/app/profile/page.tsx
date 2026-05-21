"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Target, TrendingUp, History, Star, Brain, MessageSquare, Shield, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import UserWidget from "../../components/UserWidget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function ProfilePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      window.location.href = "/signin";
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    const fetchReports = async () => {
      try {
        const userId = userData.id || userData._id;
        const res = await fetch(`http://localhost:5000/api/interview/reports/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error("Backend returned non-array:", data);
          setReports([]);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">Loading Profile...</h2>
      </div>
    );
  }

  // Calculate Aggregates
  const totalInterviews = reports.length;
  let avgOverall = 0, avgTech = 0, avgComm = 0, avgConf = 0;
  
  if (totalInterviews > 0) {
    avgOverall = Math.round(reports.reduce((acc, r) => acc + (r.overallScore || 0), 0) / totalInterviews);
    avgTech = Math.round(reports.reduce((acc, r) => acc + (r.technicalAccuracy || 0), 0) / totalInterviews);
    avgComm = Math.round(reports.reduce((acc, r) => acc + (r.communicationScore || 0), 0) / totalInterviews);
    avgConf = Math.round(reports.reduce((acc, r) => acc + (r.confidenceScore || 0), 0) / totalInterviews);
  }

  // Format data for Recharts Trendline (chronological order)
  const trendData = [...reports].reverse().map((r, index) => ({
    name: `Session ${index + 1}`,
    score: r.overallScore || 0,
    date: new Date(r.createdAt).toLocaleDateString()
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
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
              Candidate Profile
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50"
            >
              Track your long-term progress and historical interview performance.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap items-center gap-3 relative z-50"
          >
            <Link href="/">
              <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-2 text-sm font-medium transition-all">
                <Home className="w-4 h-4" /> Home
              </button>
            </Link>
            <Link href="/setup">
              <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white flex items-center gap-2 text-sm font-medium transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                <Target className="w-4 h-4" /> Practice Now
              </button>
            </Link>
            <div className="ml-2">
              <UserWidget />
            </div>
          </motion.div>
        </header>

        {totalInterviews === 0 ? (
          <div className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center text-center">
            <History className="w-16 h-16 text-white/20 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Interviews Yet</h2>
            <p className="text-white/50 mb-8 max-w-md">
              You haven't completed any mock interviews yet. Complete your first session to generate your personalized progress dashboard!
            </p>
            <Link href="/setup">
              <button className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg">
                Start First Interview
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Aggregated Stats */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> All-Time Averages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl">
                <span className="text-white/50 text-sm mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Overall Score</span>
                <span className="text-4xl font-bold text-primary">{avgOverall}</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl">
                <span className="text-white/50 text-sm mb-2 flex items-center gap-2"><Brain className="w-4 h-4" /> Technical</span>
                <span className="text-4xl font-bold text-blue-400">{avgTech}%</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl">
                <span className="text-white/50 text-sm mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Communication</span>
                <span className="text-4xl font-bold text-green-400">{avgComm}%</span>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl">
                <span className="text-white/50 text-sm mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Confidence</span>
                <span className="text-4xl font-bold text-yellow-400">{avgConf}%</span>
              </motion.div>
            </div>

            {/* Growth Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 rounded-2xl h-[400px] mb-10 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Progression Trend
              </h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                    <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={4} dot={{ r: 6, fill: '#7c3aed', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* History List */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><History className="w-5 h-5 text-white/70" /> Interview History</h2>
            <div className="flex flex-col gap-4">
              {reports.map((report, index) => (
                <motion.div 
                  key={report._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {report.overallScore}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{report.interviewType} Interview</h4>
                      <p className="text-white/50 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-white/40 text-xs uppercase tracking-wider">Tech</span>
                      <span className="font-medium text-blue-400">{report.technicalAccuracy}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-white/40 text-xs uppercase tracking-wider">Comm</span>
                      <span className="font-medium text-green-400">{report.communicationScore}%</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-white/40 text-xs uppercase tracking-wider">Conf</span>
                      <span className="font-medium text-yellow-400">{report.confidenceScore}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
