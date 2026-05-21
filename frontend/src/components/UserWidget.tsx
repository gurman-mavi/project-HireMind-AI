"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserWidget() {
  const [user, setUser] = useState<{name: string} | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Link href="/signin">
        <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all text-sm font-medium">
          Sign In
        </button>
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 pl-4 pr-1.5 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
        <span className="text-sm font-medium text-white/80">Hi, {user.name.split(' ')[0]}</span>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm shadow-inner uppercase text-white">
          {user.name.charAt(0)}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute right-0 top-full pt-2 z-50">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-48 rounded-xl bg-[#111111] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="flex flex-col p-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="h-px bg-white/10 my-1 mx-2" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
