import React from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const ScoreCircle = ({ score = 0 }) => {
  const radius = 100;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle orbit
  const semiCircumference = circumference / 2;
  const strokeDashoffset = semiCircumference - (score / 100) * semiCircumference;

  return (
    <motion.div 
      className="flex flex-col items-center justify-center relative py-12"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative">
        <svg height={radius + stroke} width={radius * 2} className="drop-shadow-[0_0_20px_rgba(68,226,205,0.15)] overflow-visible">
          {/* Background Arc */}
          <motion.path
            d={`M ${stroke/2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius*2 - stroke/2} ${radius}`}
            stroke="var(--color-surface-container-highest)" 
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
          />

          {/* Progress Arc */}
          <motion.path
            d={`M ${stroke/2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius*2 - stroke/2} ${radius}`}
            stroke="url(#neonGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${semiCircumference} ${semiCircumference}`}
            style={{ strokeDashoffset }}
            initial={{ strokeDashoffset: semiCircumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          />

          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" /> {/* customColor */}
              <stop offset="100%" stopColor="#44e2cd" /> {/* secondary */}
            </linearGradient>
          </defs>
        </svg>

        {/* Score Display */}
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
          <motion.div 
            className="text-7xl font-display font-black text-on-surface drop-shadow-[0_0_12px_rgba(229,225,228,0.2)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {score}<span className="text-4xl text-outline ml-1">%</span>
          </motion.div>
          <motion.div 
            className="text-primary-container font-body text-sm font-semibold tracking-widest uppercase mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Target className="w-5 h-5" /> Today's Yield
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreCircle;