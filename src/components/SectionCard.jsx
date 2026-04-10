import React from "react";
import { motion } from "framer-motion";

const SectionCard = ({ title, completedCount, totalCount, children }) => {
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      className="glass-panel p-4 rounded-[16px] shadow-ambient overflow-hidden relative group h-full flex flex-col transition-all duration-300 hover:border-outline-variant/30"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative gradient blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-end justify-between mt-1 mb-2 relative z-10">
        <h2 className="text-base md:text-lg font-display font-black text-on-surface tracking-wide">
          {title}
        </h2>
        
        {totalCount !== undefined && (
          <div className="flex flex-col items-end">
            <span className={`text-[10px] uppercase tracking-widest font-bold ${percentage === 100 ? 'text-secondary font-black drop-shadow-[0_0_8px_rgba(68,226,205,0.4)]' : 'text-outline'}`}>
              {percentage === 100 ? 'Verified' : 'Progress'}
            </span>
            <span className={`font-display font-black text-base ${percentage === 100 ? 'text-secondary' : 'text-primary'}`}>
              {completedCount} <span className="text-outline-variant font-medium text-xs">/ {totalCount}</span>
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount !== undefined && (
        <div className="w-full h-1 bg-surface-container-highest rounded-full mb-3 overflow-hidden relative z-10 shadow-inner">
          <motion.div 
            className={`h-full rounded-full ${percentage === 100 ? 'bg-gradient-to-r from-secondary to-primary shadow-[0_0_10px_rgba(68,226,205,0.6)]' : 'bg-gradient-to-r from-primary to-primary-container'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="grid gap-3 relative z-10 w-full flex-grow content-start">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionCard;