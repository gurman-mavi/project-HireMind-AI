"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-3xl flex flex-col"
      >
        <div className="flex items-center gap-2 mb-8 mx-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-bold text-white shadow-lg text-xl">
            H
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="text-white/50 text-center mb-6">
          Sign in to continue your interview prep.
        </p>

        {error && <div className="p-3 rounded-xl bg-red-500/20 text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center justify-between mt-2 mb-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-white/10 border-white/20 text-primary focus:ring-primary/50" />
              <span className="text-white/70">Remember me</span>
            </label>
            <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.2)]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-white/50 mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
