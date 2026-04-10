import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ FIXED
import { AuthProvider, useAuth } from "./context/authContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DailyTracker from "./pages/DailyTracker";
import History from "./pages/History";
import Monthly from "./pages/MonthlyReport";
import Yearly from "./pages/YearlyReport";

// Animated Splash Loader
const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-on_surface font-display">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180, 270, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 mb-8 glass-panel rounded-[32px] flex items-center justify-center shadow-ambient"
      >
        <div className="w-16 h-16 gradient-primary rounded-2xl animate-pulse" />
      </motion.div>

      <motion.h1
        className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4 drop-shadow-md"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        DISCIPLINE
      </motion.h1>

      <p className="text-xl opacity-70 mb-8 font-body">
        Initializing Command Center...
      </p>

      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
};

// Protected Route
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <SplashScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

import AppLayout from "./layouts/AppLayout";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
      <Route path="/daily" element={<RequireAuth><AppLayout><DailyTracker /></AppLayout></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><AppLayout><History /></AppLayout></RequireAuth>} />
      <Route path="/monthly" element={<RequireAuth><AppLayout><Monthly /></AppLayout></RequireAuth>} />
      <Route path="/yearly" element={<RequireAuth><AppLayout><Yearly /></AppLayout></RequireAuth>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;