import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCircle from "../components/ScoreCircle";
import SectionCard from "../components/SectionCard";
import { calculateStreak } from "../utils/streak";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { Activity, Flame, Zap, CheckCircle2, AlertCircle, CalendarClock } from "lucide-react";

const Dashboard = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [metrics, setMetrics] = useState({ totalDays: 0, actionsComplete: 0, consistency: 0 });
  const [loading, setLoading] = useState(true);
  const [recentDays, setRecentDays] = useState([]);
  const [todayData, setTodayData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const daysRef = collection(db, "routines", user.uid, "days");
        const snapshot = await getDocs(daysRef);
        
        let allDays = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Sort chronologically ascending
        allDays.sort((a, b) => a.id.localeCompare(b.id));

        const result = calculateStreak(allDays);
        setStreak(result);

        // Get today's explicit data
        const todayStr = dayjs().format("YYYY-MM-DD");
        const todayDoc = allDays.find(d => d.id === todayStr);
        setTodayData(todayDoc || null);

        // Score logic (fallback to the latest day if today doesn't exist yet)
        if (todayDoc) {
          setScore(todayDoc.score || 0);
        } else if (allDays.length > 0) {
          setScore(allDays[allDays.length - 1].score || 0);
        }

        // Global KPI Computations
        let actionsCount = 0;
        let cumulativeScore = 0;
        allDays.forEach(day => {
           cumulativeScore += (day.score || 0);
           Object.keys(day).forEach(key => {
              if (key !== 'id' && key !== 'score' && key !== 'updatedAt') {
                 if (typeof day[key] === 'object') {
                    Object.values(day[key]).forEach(val => {
                       if (val === true) actionsCount++;
                    });
                 }
              }
           });
        });

        setMetrics({
           totalDays: allDays.length,
           actionsComplete: actionsCount,
           consistency: allDays.length > 0 ? Math.round(cumulativeScore / allDays.length) : 0
        });

        // Get last 5 days for the momentum widget
        setRecentDays(allDays.slice(-5));
        
      } catch (err) {
        console.error("Dashboard fetch err:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AnimatedCounter = ({ value, label, icon: Icon, colorClass = "text-primary", bgClass = "bg-primary/5 border-primary/20" }) => (
    <motion.div
      className="glass-panel p-6 rounded-[24px] text-center group transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b from-${bgClass.split(' ')[0].split('-').slice(1).join('-')}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${bgClass} shadow-[0_0_15px_rgba(208,188,255,0.05)] group-hover:shadow-[0_0_20px_rgba(208,188,255,0.2)] transition-shadow`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <motion.div
        className="text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-on-surface to-on-surface-variant mb-1"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {value}
      </motion.div>
      <p className="text-outline font-body text-sm font-medium tracking-widest uppercase">{label}</p>
    </motion.div>
  );

  const todayStr = dayjs().format("YYYY-MM-DD");

  return (
    <div className="w-full relative min-h-full pb-10">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="flex justify-center py-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-12 h-12 border-2 border-surface_container_highest border-t-primary rounded-full animate-spin"></div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col gap-8"
            >
              
              {/* Header Module */}
              <div className="glass-panel rounded-[32px] p-8 md:p-12 mb-2 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-t-primary shadow-ambient overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                <div className="text-center md:text-left z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                    <Activity className="w-3.5 h-3.5" /> Live Operations
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight uppercase leading-none">
                    Command <span className="text-transparent bg-clip-text gradient-primary italic">Center</span>
                  </h1>
                  <p className="text-outline mt-4 font-body text-base lg:text-lg leading-relaxed">
                    Review your core operational telemetry. Maintain the standard and continuously build systemic momentum to secure your operational streaks.
                  </p>
                </div>
                
                <div className="shrink-0 z-10">
                  <div className="w-40 h-40 lg:w-48 lg:h-48 relative flex justify-center items-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-[30px]" />
                    <ScoreCircle score={score} />
                  </div>
                </div>
              </div>

              {/* Analytical KPI Counters */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
                <AnimatedCounter 
                  value={streak.current} 
                  label="Active Streak" 
                  icon={Flame} 
                  colorClass="text-secondary"
                  bgClass="bg-secondary/5 border-secondary/20"
                />
                <AnimatedCounter 
                  value={metrics.totalDays} 
                  label="Tracked Days" 
                  icon={CalendarClock} 
                  colorClass="text-primary"
                  bgClass="bg-primary/5 border-primary/20"
                />
                <AnimatedCounter 
                  value={`${metrics.consistency}%`} 
                  label="Consistency Rate" 
                  icon={Activity} 
                  colorClass="text-on-surface"
                  bgClass="bg-surface-container-highest border-outline-variant/30"
                />
                <AnimatedCounter 
                  value={metrics.actionsComplete} 
                  label="Actions Executed" 
                  icon={CheckCircle2} 
                  colorClass="text-secondary"
                  bgClass="bg-secondary/5 border-secondary/20"
                />
              </div>

              {/* Data Intelligence Grid - Momentum */}
              <div className="grid md:grid-cols-1 gap-6 items-stretch mt-2">
                
                <div className="md:col-span-1">
                  <SectionCard title="Recent Momentum Log">
                    <div className="flex flex-col justify-center h-full pt-4 pb-2">
                       {recentDays.length === 0 ? (
                         <div className="flex flex-col items-center justify-center text-outline-variant py-6">
                           <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                           <p className="text-sm font-medium uppercase tracking-widest">No Log Data Found</p>
                         </div>
                       ) : (
                         <div className="flex items-end justify-between gap-1 sm:gap-2 h-[120px] px-2 md:px-6">
                           {recentDays.map((dayObj, i) => {
                             const isPerfect = dayObj.score >= 95;
                             const isDanger = dayObj.score < 50;
                             const colorClass = isPerfect ? 'bg-secondary' : isDanger ? 'bg-error' : 'bg-primary';
                             const label = dayjs(dayObj.id).format("ddd");
                             const numFormat = Math.round(dayObj.score);

                             return (
                               <div key={dayObj.id} className="flex flex-col items-center flex-1 group">
                                 <motion.div 
                                    className="w-full relative flex items-end justify-center rounded-lg overflow-hidden bg-surface-container-highest border border-outline-variant/10 shadow-inner group-hover:border-outline-variant/30 transition-colors"
                                    style={{ height: '100px' }}
                                    initial={{ height: 0 }}
                                    animate={{ height: 100 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                 >
                                    <motion.div 
                                      className={`w-full ${colorClass} shadow-t-glow`}
                                      initial={{ height: "0%" }}
                                      animate={{ height: `${dayObj.score}%` }}
                                      transition={{ duration: 1, type: "spring", damping: 15 }}
                                    />
                                    <span className="absolute top-1/2 -translate-y-1/2 font-display font-black text-xs text-white drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      {numFormat}%
                                    </span>
                                 </motion.div>
                                 <span className={`mt-3 text-[10px] md:text-xs font-bold uppercase tracking-widest ${dayObj.id === todayStr ? 'text-primary' : 'text-outline-variant'}`}>
                                    {label}
                                  </span>
                               </div>
                             );
                           })}
                         </div>
                       )}
                    </div>
                  </SectionCard>
                </div>

              </div>

              {/* Today's Launch Module */}
              <div className="glass-panel p-6 md:p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                 <div className="absolute right-0 top-0 w-64 h-64 bg-secondary/5 blur-[50px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-secondary/10" />
                 
                 <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-[18px] bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                      <Zap className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-display font-black text-on-surface uppercase tracking-wide">
                        Today's Architecture
                      </h3>
                      <p className="text-outline font-body text-sm mt-1">
                        {todayData ? `Active Session Logging. Score: ${Math.round(todayData.score)}%` : "Operations pending execution. Initialize today's routines."}
                      </p>
                    </div>
                 </div>

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => window.location.href = '/daily'}
                   className="w-full md:w-auto shrink-0 bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary px-8 py-4 rounded-[20px] font-display font-black tracking-widest uppercase text-sm transition-all duration-300 flex items-center justify-center gap-3 relative z-10 shadow-[0_0_20px_rgba(68,226,205,0.1)]"
                 >
                   {todayData ? 'Continue Operations' : 'Initialize Session'} <Activity className="w-4 h-4" />
                 </motion.button>
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;