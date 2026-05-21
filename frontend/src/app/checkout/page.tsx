"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const value = e.target.value.replace(/\D/g, "");
    // Add a space after every 4 digits, and limit to 16 digits max
    const truncated = value.substring(0, 16);
    const formattedValue = truncated.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    
    let error = "";
    
    // Validate month
    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2));
      if (month < 1 || month > 12) {
        error = "Invalid month";
      }
    }

    // Validate year
    if (value.length === 4 && !error) {
      const year = parseInt(value.substring(2, 4));
      const currentYear = parseInt(new Date().getFullYear().toString().substring(2, 4));
      const month = parseInt(value.substring(0, 2));
      const currentMonth = new Date().getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        error = "Card has expired";
      }
    }

    setExpiryError(error);

    if (value.length >= 3) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiryDate(value);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (expiryError || expiryDate.length < 5) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Route to main page after success animation
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-green-500/20 blur-[120px] pointer-events-none" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 rounded-3xl flex flex-col items-center text-center relative z-10 max-w-md w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-white/60 mb-8">
            Welcome to HireMind Pro. Your account has been upgraded and all premium features are now unlocked.
          </p>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500"
            />
          </div>
          <p className="text-xs text-white/40 mt-4">Redirecting to home page...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden flex justify-center pt-20 pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Side: Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <Link href="/pricing" className="text-sm text-primary hover:text-primary/80 transition-colors mb-8 flex items-center gap-2">
            ← Back to plans
          </Link>
          
          <h1 className="text-4xl font-bold mb-8">Complete your upgrade</h1>
          
          <div className="glass-panel p-8 rounded-3xl border-primary/30 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">HireMind Pro</h3>
                <p className="text-white/50">Billed monthly</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">$19.00</div>
                <p className="text-white/50 text-sm">USD</p>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-6" />
            
            <ul className="space-y-4 mb-6">
              {[
                "Unlimited AI Mock Interviews",
                "Advanced Video & Voice Analytics",
                "Personalized Growth Roadmaps",
                "Priority Support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-sm text-white/50 bg-white/5 p-4 rounded-2xl border border-white/10">
            <ShieldCheck className="w-6 h-6 text-green-500 shrink-0" />
            <p>Guaranteed safe & secure checkout. Your connection is encrypted with 256-bit SSL.</p>
          </div>
        </motion.div>

        {/* Right Side: Payment Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-8 rounded-3xl h-fit"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Payment Details</h2>
              <p className="text-sm text-white/50">Enter your card information</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Cardholder Name</label>
              <input 
                type="text" 
                required
                placeholder="John Doe" 
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Card Number</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-primary/50 transition-colors font-mono"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm font-medium text-white/70 mb-2">Expiry Date</label>
                <input 
                  type="text" 
                  required
                  maxLength={5}
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY" 
                  className={`w-full bg-black/50 border ${expiryError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'} rounded-xl py-3 px-4 outline-none transition-colors font-mono`}
                />
                {expiryError && <span className="absolute -bottom-5 left-1 text-xs text-red-500 font-medium">{expiryError}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">CVC</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    maxLength={3}
                    placeholder="123" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-primary/50 transition-colors font-mono"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-white/10 my-2" />
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70">Subtotal</span>
              <span className="font-medium">$19.00</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-white/70">Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-lg font-bold text-white">
              <span>Total Pay</span>
              <span className="text-primary">$19.00</span>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:shadow-none"
            >
              {isProcessing ? (
                <>Processing <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Pay $19.00 <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
            <p className="text-center text-xs text-white/40 mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> Secure Stripe Payment
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
