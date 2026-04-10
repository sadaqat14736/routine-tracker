import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calendar, History, BarChart3, CalendarClock, LogOut, Flame, X } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", name: "Command", icon: Home },
    { path: "/daily", name: "Daily", icon: Calendar },
    { path: "/history", name: "History", icon: History },
    { path: "/monthly", name: "Monthly", icon: BarChart3 },
    { path: "/yearly", name: "Yearly", icon: CalendarClock },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <aside className="h-screen w-64 lg:w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col py-6 lg:py-8 transition-all duration-300 shadow-2xl lg:shadow-none">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 lg:px-8 mb-10 shrink-0">
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => { navigate("/dashboard"); handleNavClick(); }}
        >
          <div className="w-10 h-10 rounded-[12px] gradient-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(208,188,255,0.4)]">
            <Flame className="w-6 h-6 text-on-primary" />
          </div>
          <span className="font-display font-black text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase">
            Discipline
          </span>
        </motion.div>

        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-container-high transition-colors text-outline"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 px-4 lg:px-5">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-surface-container-highest border border-outline-variant/30 text-primary shadow-[0_0_15px_rgba(208,188,255,0.05)]"
                  : "text-outline hover:bg-surface-container-low hover:text-on-surface border border-transparent"
              }`
            }
          >
            {({ isActive }) => {
              const Icon = link.icon;
              return (
                <>
                  <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]' : 'group-hover:scale-110'}`} />
                  <span className="font-body font-semibold tracking-wide text-sm">
                    {link.name}
                  </span>
                </>
              );
            }}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 lg:px-5 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-[#ffb4ab]/70 hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10 border border-transparent hover:border-[#ffb4ab]/30 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          <span className="font-body font-semibold tracking-wide text-sm">Terminate</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
