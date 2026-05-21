"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, ArrowRight, Loader2, Target, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const [file, setFile] = useState<File | null>(null);
  const [interviewType, setInterviewType] = useState("Technical");
  const [skills, setSkills] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStart = async () => {
    // Basic validation: user should either upload a resume or provide skills
    if (!file && !skills.trim()) {
      alert("Please upload a resume or enter your target skills.");
      return;
    }
    
    setIsUploading(true);
    
    // Save configuration so the interview page can use it to prompt the AI
    localStorage.setItem("interviewConfig", JSON.stringify({
      type: interviewType,
      skills: skills
    }));
    
    // Simulating API setup delay
    setTimeout(() => {
      setIsUploading(false);
      router.push("/interview");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl glass-panel p-10 rounded-3xl flex flex-col"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Configure Interview</h2>
            <p className="text-white/50 text-sm">Tailor the AI to your specific goals</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          {/* Interview Type Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Interview Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Technical', 'Behavioral', 'HR'].map((type) => (
                <button
                  key={type}
                  onClick={() => setInterviewType(type)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                    interviewType === type 
                      ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Target Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/70">Target Skills / Focus Areas</label>
            <input 
              type="text" 
              placeholder="e.g. React, Python, Leadership, System Design" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
            />
          </div>

          {/* Resume Upload (Optional now) */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/70">Upload Resume (Optional)</label>
            <label className="w-full h-32 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all relative">
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <File className="w-8 h-8 text-primary" />
                  <span className="font-medium text-sm">{file.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-white/40">
                  <UploadCloud className="w-8 h-8" />
                  <span className="text-sm font-medium">Click to upload CV</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={isUploading}
          className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-white/10 disabled:text-white/30 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.2)] disabled:shadow-none"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Preparing AI Environment...
            </>
          ) : (
            <>
              Start Interview <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
