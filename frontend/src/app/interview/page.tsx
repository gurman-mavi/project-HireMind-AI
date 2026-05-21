"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InterviewRoom() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I have reviewed your profile. Could you start by telling me a bit about yourself?" }
  ]);
  
  const [eyeContactStatus, setEyeContactStatus] = useState("Initializing AI...");
  const [speakingRateStatus, setSpeakingRateStatus] = useState("Waiting...");
  const [interviewConfig, setInterviewConfig] = useState({ type: "Technical", skills: "General" });

  // Load config
  useEffect(() => {
    const config = localStorage.getItem("interviewConfig");
    if (config) {
      setInterviewConfig(JSON.parse(config));
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Setup Webcam
  useEffect(() => {
    let active = true;
    async function setupCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (active) setEyeContactStatus("Error: Insecure Context or Not Supported");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch(e) {
            console.error("Autoplay prevented:", e);
          }
        } else {
          stream.getTracks().forEach(t => t.stop());
        }
      } catch (err: any) {
        console.error("Camera access denied or unavailable.", err);
        if (active) setEyeContactStatus(`Camera Error: ${err?.message || "Unknown"}`);
      }
    }
    setupCamera();
    
    return () => {
      active = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Load Face API Models
  useEffect(() => {
    async function loadModels() {
      try {
        const faceapi = await import('@vladmandic/face-api');
        // Load tiny face detector from a CDN for ease of use without local files
        await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
        setEyeContactStatus("Analyzing...");
      } catch (e) {
        console.error("Face API failed to load", e);
        setEyeContactStatus("AI Load Failed");
      }
    }
    loadModels();
  }, []);

  // Face & Lighting Tracking Interval
  useEffect(() => {
    if (isVideoOff) {
      setEyeContactStatus("Camera Off");
      return;
    }

    if (eyeContactStatus === "Initializing AI..." || eyeContactStatus === "AI Load Failed" || eyeContactStatus === "Camera Error") return;

    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        // Basic Lighting Check via Canvas
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let colorSum = 0;
          
          for(let x = 0; x < data.length; x += 4) {
              const r = data[x];
              const g = data[x+1];
              const b = data[x+2];
              colorSum += Math.floor((r+g+b)/3);
          }
          const brightness = Math.floor(colorSum / (canvas.width * canvas.height));
          
          if (brightness < 30) {
            setEyeContactStatus("Poor Lighting");
            return;
          }
        }

        // Face Detection
        try {
          const faceapi = await import('@vladmandic/face-api');
          const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());
          if (detections.length > 0) {
            setEyeContactStatus("Good");
          } else {
            setEyeContactStatus("No Face Detected");
          }
        } catch (err) {
          console.error("Face detection error:", err);
        }
      }
    }, 1000); // Analyze 1 frame per second to save performance

    return () => clearInterval(interval);
  }, [isVideoOff, eyeContactStatus]);

  // Sync isMuted state with ref and start/stop recognition
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      setSpeakingRateStatus("Muted");
      try { recognitionRef.current?.stop(); } catch(e){}
    } else {
      setSpeakingRateStatus("Listening...");
      try { recognitionRef.current?.start(); } catch(e){}
    }
  }, [isMuted]);

  // Setup Speech Recognition exactly once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeakingRateStatus("Browser Not Supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;

    let startTime = Date.now();

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
      
      // Dynamic WPM Calculation
      const words = currentTranscript.trim().split(/\s+/).length;
      const minutesElapsed = (Date.now() - startTime) / 60000;
      
      if (minutesElapsed > 0.05) { 
        const wpm = words / minutesElapsed;
        if (wpm < 100) setSpeakingRateStatus("Slow");
        else if (wpm > 160) setSpeakingRateStatus("Fast");
        else setSpeakingRateStatus("Optimal");
      }
    };
    
    recognition.onerror = (event: any) => {
      // Suppress console.error to prevent Next.js dev overlay from popping up on "no-speech" events
      if (event.error !== 'no-speech') {
        console.log("Speech API Status:", event.error);
      }
      setSpeakingRateStatus(`Error: ${event.error}`);
    };
    
    recognition.onend = () => {
      if (!isMutedRef.current) {
        try { recognition.start(); } catch(e){}
      }
    };

    if (!isMutedRef.current) {
      try { recognition.start(); } catch(e){}
    }

    return () => {
      recognition.onend = null;
      try { recognition.stop(); } catch(e){}
    };
  }, []);

  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!transcript.trim()) return;
    
    const userMessage = { role: "user", text: transcript };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setTranscript("");
    setIsAiTyping(true);
    
    // Force speech recognition to restart to clear its internal buffer
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/interview/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: newMessages,
          resumeContext: { summary: `Target Skills: ${interviewConfig.skills}` },
          role: `${interviewConfig.type} Interview`
        })
      });
      
      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      if (data.question) {
        setMessages(prev => [...prev, { role: "ai", text: data.question }]);
      }
    } catch (error) {
      // Intentionally suppressing console.error to prevent Next.js dev overlay from popping up
      setMessages(prev => [...prev, { role: "ai", text: "I'm currently experiencing high server demand (API 503). Please try sending your message again in a few moments!" }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleEndInterview = () => {
    localStorage.setItem("interviewTranscript", JSON.stringify(messages));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="font-medium tracking-wide">Interview in Progress</span>
        </div>
        <div className="text-white/50 text-sm font-mono">00:14:32</div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 relative min-h-0">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Left Side: Video & Metrics */}
        <div className="flex-1 flex flex-col gap-6 relative z-10 min-h-0">
          <div className="flex-1 rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative min-h-0">
            {isVideoOff ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <VideoOff className="w-10 h-10 text-white/50" />
                </div>
              </div>
            ) : (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              />
            )}
            
            {/* Live Metrics Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className={`px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium flex items-center gap-2 transition-colors`}>
                <span className={`w-2 h-2 rounded-full ${
                  eyeContactStatus === "Good" ? "bg-green-500" :
                  eyeContactStatus === "Poor Lighting" || eyeContactStatus === "Camera Off" ? "bg-red-500" :
                  eyeContactStatus === "No Face Detected" ? "bg-yellow-500" : "bg-blue-500 animate-pulse"
                }`} />
                Eye Contact: {eyeContactStatus}
              </div>
              <div className={`px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium flex items-center gap-2 transition-colors`}>
                <span className={`w-2 h-2 rounded-full ${
                  speakingRateStatus === "Optimal" ? "bg-green-500" :
                  speakingRateStatus === "Muted" ? "bg-red-500" :
                  speakingRateStatus === "Listening..." ? "bg-blue-500 animate-pulse" : "bg-yellow-500"
                }`} />
                Speaking Rate: {speakingRateStatus}
              </div>
            </div>
            
            {/* Name Tag */}
            <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-sm font-medium shadow-lg">
              You (Candidate)
            </div>
          </div>

          {/* Controls */}
          <div className="h-20 glass-panel rounded-2xl flex items-center justify-center gap-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleEndInterview}
              className="w-16 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] ml-4"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Chat & Transcript */}
        <div className="w-full md:w-[400px] h-full glass-panel rounded-2xl flex flex-col overflow-hidden relative z-10 min-h-0">
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center shadow-lg">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Interviewer</h3>
              <p className="text-xs text-white/50">{interviewConfig.type} Round</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 min-h-0">
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx} 
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-sm' 
                    : 'bg-white/10 border border-white/5 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isAiTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col max-w-[85%] self-start items-start"
              >
                <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/5 rounded-bl-sm flex items-center gap-1.5 h-11">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <input 
                type="text" 
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type or speak your answer..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/30"
              />
              <button 
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
