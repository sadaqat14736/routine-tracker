import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Flame } from "lucide-react";
import { useAuth } from "../context/authContext";
import ThemeToggle from "../components/ThemeToggle";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Initialization failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-body transition-colors duration-500">
      <ThemeToggle />
      {/* Ambient background glows */}
      <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism Card */}
        <div className="glass-panel rounded-[32px] p-10 shadow-ambient border border-outline-variant/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-surface-container-highest/30 to-transparent -z-10" />
          
          <div className="text-center mb-10">
            <motion.div
              className="w-20 h-20 bg-surface-container-low border-2 border-secondary/30 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(68,226,205,0.2)]"
              whileHover={{ rotate: [0, 5, -5, 0], scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <User className="w-10 h-10 text-secondary" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-display font-black tracking-widest text-on-surface mb-2 uppercase"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Initialize Profile
            </motion.h1>
            <p className="text-outline text-sm tracking-wide">FORGE THE DISCIPLINE</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="relative group">
                <User className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
                <input
                  type="text"
                  placeholder="Operative Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface placeholder-outline focus:outline-none focus:border-secondary focus:bg-surface-container-high transition-all duration-300 shadow-inner"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative group">
                <Mail className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
                <input
                  type="email"
                  placeholder="Designation (Email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface placeholder-outline focus:outline-none focus:border-secondary focus:bg-surface-container-high transition-all duration-300 shadow-inner"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="relative group">
                <Lock className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-secondary transition-colors" />
                <input
                  type="password"
                  placeholder="Set Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant/40 rounded-xl text-on-surface placeholder-outline focus:outline-none focus:border-secondary focus:bg-surface-container-high transition-all duration-300 shadow-inner"
                  required
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 rounded-xl text-[#ffb4ab] text-sm font-medium text-center backdrop-blur-sm"
              >
                {error}
              </motion.p>
            )}

            {/* Signup Button */}
            <motion.button
              type="submit"
              disabled={loading || !name || !email || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 mt-4 bg-gradient-to-br from-secondary to-secondary-container text-on-secondary-container rounded-xl font-display font-bold text-lg tracking-wide shadow-lg hover:shadow-[0_4px_24px_-8px_#44e2cd] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 uppercase"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-secondary-container/30 border-t-on-secondary-container rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Establish Protocol <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 pt-6 border-t border-outline-variant/20"
          >
            <p className="text-outline text-sm mb-4">Already got a clearance code?</p>
            <button
              onClick={() => navigate("/login")}
              className="text-on-surface hover:text-secondary font-semibold transition-colors bg-surface-container-low border border-outline-variant/30 hover:border-secondary/50 px-6 py-2 rounded-full text-sm"
              disabled={loading}
            >
              Access System
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;