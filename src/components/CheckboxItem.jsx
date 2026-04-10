import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const CheckboxItem = ({ label, subtitle, icon: Icon, timeTag, checked, onChange }) => {
  return (
    <motion.label 
      className={`flex items-start gap-3 p-3 rounded-[12px] border ${checked ? 'bg-surface-container-highest border-primary/20 shadow-[0_0_20px_rgba(208,188,255,0.03)]' : 'bg-surface-container-low border-transparent hover:border-outline-variant/30 hover:bg-surface-container'} cursor-pointer group transition-all duration-300 relative overflow-hidden`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {checked && <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />}
      
      {/* Dynamic Left Icon Block */}
      {Icon && (
        <div className={`relative w-8 h-8 mt-0.5 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-500 ${checked ? 'bg-primary/20 text-primary shadow-[0_0_12px_rgba(208,188,255,0.3)]' : 'bg-surface-container-highest text-outline-variant group-hover:text-primary/70 group-hover:bg-primary/5'}`}>
          <Icon className="w-4 h-4 z-10" />
          {checked && <div className="absolute inset-0 bg-primary/20 rounded-[10px] blur-[8px]" />}
        </div>
      )}

      {/* Center Logic: Label and Subtext with Animations */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="relative">
            <span className={`font-display font-bold text-base block transition-colors duration-300 ${checked ? 'text-primary/60' : 'text-on-surface group-hover:text-white'}`}>
              {label}
            </span>
            {/* Strikethrough Animation */}
            <motion.div 
              className="absolute top-1/2 left-0 h-[2px] bg-primary w-full transform -translate-y-1/2 rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: checked ? 1 : 0, opacity: checked ? 0.6 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Time Tag Pill */}
          {timeTag && (
            <div className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${checked ? 'bg-surface-container text-outline/50' : 'bg-surface-container-highest border border-outline-variant/30 text-outline'}`}>
              {timeTag}
            </div>
          )}
        </div>
        
        {/* Subtle Operational Subtitle */}
        {subtitle && (
          <p className={`font-body text-xs leading-snug transition-all duration-300 mt-0.5 ${checked ? 'text-outline/40 line-through decoration-outline/20' : 'text-outline group-hover:text-on-surface-variant'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side Checkbox Orb */}
      <motion.div
        className={`relative w-5 h-5 mt-1 shrink-0 rounded-full shadow-sm border-2 z-10 transition-colors ${checked ? 'border-primary' : 'border-outline group-hover:border-primary/50'}`}
        animate={checked ? { borderColor: "#d0bcff" } : {}}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer peer"
        />
        <AnimatePresence>
          {checked && (
            <motion.div
              className="absolute inset-0 gradient-primary flex items-center justify-center -m-[2px] rounded-full shadow-[0_0_12px_rgba(208,188,255,0.5)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-on_primary" strokeWidth={3.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.label>
  );
};

export default CheckboxItem;