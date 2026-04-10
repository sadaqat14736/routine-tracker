import React from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const currentDate = dayjs();

  // Dynamic Page Titles mapping
  const routeTitles = {
    '/dashboard': 'Command Center',
    '/daily': 'Daily Operations',
    '/history': 'System Log & History',
    '/monthly': 'Monthly Analytics',
    '/yearly': 'Yearly Trajectory',
  };

  const title = routeTitles[location.pathname] || 'Dashboard';
  
  const dayName = currentDate.format('dddd');       // e.g. "Wednesday"
  const fullDate = currentDate.format('MMMM D, YYYY'); // e.g. "April 8, 2026"

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-outline-variant/20 px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      
      {/* Mobile Menu Toggle & Dynamic Route Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg bg-surface-container-low border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-black tracking-tight text-on-surface uppercase flex items-center gap-2 md:gap-3">
          <span className="w-1.5 h-6 md:h-8 bg-primary rounded-full inline-block shadow-[0_0_10px_rgba(208,188,255,0.6)]"></span>
          <span className="truncate max-w-[150px] md:max-w-none">{title}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Toggle Theme Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface hover:bg-surface-container-high transition-all duration-300 shadow-sm group"
          title="Toggle Appearance"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-secondary group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Absolute Temporal Awareness (Date Box) */}
        <div className="hidden sm:flex items-center gap-4 bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 shadow-sm transition-colors">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-display font-bold text-outline uppercase tracking-widest leading-tight">
              {dayName}
            </span>
            <span className="text-xs font-body font-medium text-on_surface_variant leading-tight">
              {fullDate}
            </span>
          </div>
          <div className="w-px h-6 bg-outline_variant/50 mx-0.5"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(68,226,205,0.8)]"></div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
