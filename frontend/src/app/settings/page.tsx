"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User, Lock, CreditCard, Save, Loader2, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import UserWidget from "../../components/UserWidget";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      window.location.href = "/signin";
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const payload: any = { userId: user.id || user._id, name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Failed to update profile", type: "error" });
      } else {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        // Update local storage so the widget syncs
        const updatedUser = { ...user, name: data.user.name, email: data.user.email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Clear passwords
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      setMessage({ text: "Network error occurred", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

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
              Settings
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/50"
            >
              Manage your account preferences and subscription.
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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === "account" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <User className="w-5 h-5" /> Account Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === "security" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <Lock className="w-5 h-5" /> Security
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === "subscription" ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
            >
              <CreditCard className="w-5 h-5" /> Subscription
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 glass-panel rounded-3xl p-8">
            <form onSubmit={handleUpdate}>
              
              {/* Account Tab */}
              {activeTab === "account" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Account Details</h2>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Security & Password</h2>
                  <p className="text-white/50 text-sm mb-6">Leave these blank if you do not wish to change your password.</p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter current password to authorize change"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter new password"
                    />
                  </div>
                </motion.div>
              )}

              {/* Action Buttons for Form Tabs */}
              {(activeTab === "account" || activeTab === "security") && (
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    {message && (
                      <span className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                        {message.text}
                      </span>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading || (activeTab === 'security' && newPassword && !currentPassword)}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              )}
            </form>

            {/* Subscription Tab (Non-Form) */}
            {activeTab === "subscription" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Subscription Plan</h2>
                
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
                    <p className="text-white/50 text-sm max-w-md">
                      You are currently on the Free Plan. This gives you access to standard AI evaluations and a limited number of mock interviews per month.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-white/50 text-sm">/mo</span>
                  </div>
                </div>

                <div className="bg-gradient-to-tr from-primary/20 to-blue-500/20 border border-primary/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">Pro Plan</h3>
                    <p className="text-white/70 text-sm max-w-md">
                      Upgrade to unlock unlimited interviews, advanced coding environments, and hyper-detailed feedback scorecards.
                    </p>
                  </div>
                  <Link href="/pricing" className="shrink-0 relative z-10">
                    <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all">
                      Upgrade Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
