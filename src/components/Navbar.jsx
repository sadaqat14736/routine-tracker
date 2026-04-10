import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, History, BarChart3, CalendarClock, LogOut, Flame } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = React.useState(location.pathname);

  const navLinks = [
    { path: "/dashboard", name: "Command", icon: Home },
    { path: "/daily", name: "Daily", icon: Calendar },
    { path: "/history", name: "History", icon: History },
    { path: "/monthly", name: "Monthly", icon: BarChart3 },
    { path: "/yearly", name: "Yearly", icon: CalendarClock },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkClass = (path) =>
    `px-4 py-3 rounded-xl relative group transition-all duration-300 font-body text-sm ${
      location.pathname === path
        ? "text-on_surface"
        : "text-outline hover:text-on_surface"
    } flex items-center gap-2`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-4 z-50 py-4 px-6 mb-8 flex justify-center w-full"
    >
      <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2 md:gap-8 shadow-ambient border border-outline_variant/30">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 mr-2 md:mr-4 shrink-0"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-primary flex items-center justify-center shadow-[0_0_15px_rgba(208,188,255,0.4)]">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-on_primary" />
          </div>
          <span className="font-display font-black text-base sm:text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hidden sm:block uppercase">
            Discipline
          </span>
        </motion.div>

        {/* Links */}
        <div className="flex gap-1 relative">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={linkClass(link.path)}
                onMouseEnter={() => setHoveredPath(link.path)}
                onMouseLeave={() => setHoveredPath(location.pathname)}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(208,188,255,0.6)]' : ''}`} />
                <span className="hidden md:inline font-semibold">{link.name}</span>
                <AnimatePresence>
                  {hoveredPath === link.path && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-surface_container_high rounded-xl -z-10 ghost-border"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="text-tertiary p-2 rounded-full hover:bg-surface_container_highest transition-colors ml-2 md:ml-4 border border-transparent hover:border-tertiary/20"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;