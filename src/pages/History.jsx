import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CalendarCheck2, Activity, Search, SlidersHorizontal, Flame } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortParam, setSortParam] = useState("date_desc");
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      try {
        const daysRef = collection(db, "routines", user.uid, "days");
        const snapshot = await getDocs(daysRef);

        const allDays = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setHistory(allDays);
      } catch (error) {
        console.error("Error loading history:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleDay = (id) => {
    setExpandedDay(expandedDay === id ? null : id);
  };

  const formatTask = (task) =>
    task.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-2 border-surface-container-highest border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pre-compute Peak Performance
  const peakDay = history.length > 0 
    ? history.reduce((prev, current) => ((prev.score || 0) > (current.score || 0) ? prev : current), history[0])
    : null;

  let peakCompletedCount = 0;
  if (peakDay) {
    Object.keys(peakDay).forEach(key => {
      if (key !== 'id' && key !== 'score' && key !== 'updatedAt') {
        if (typeof peakDay[key] === 'object') {
          Object.values(peakDay[key]).forEach(val => {
            if (val === true) peakCompletedCount++;
          });
        }
      }
    });
  }

  // Render Filtered & Sorted Array
  const processedLogs = history.filter(day => {
    if (!searchQuery) return true;
    const searchTarget = dayjs(day.id).format("MMMM D YYYY dddd").toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  }).sort((a, b) => {
    const aScore = a.score || 0;
    const bScore = b.score || 0;
    if (sortParam === "date_desc") return a.id < b.id ? 1 : -1;
    if (sortParam === "date_asc") return a.id > b.id ? 1 : -1;
    if (sortParam === "score_desc") return bScore - aScore;
    if (sortParam === "score_asc") return aScore - bScore;
    return 0;
  });

  return (
    <div className="w-full relative py-6">
      
      <div className="max-w-4xl mx-auto relative z-10 px-4 md:px-0">
        
        {/* Subtle Log Header */}
        <div className="mb-6 flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-3 text-outline">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="uppercase tracking-widest font-display font-bold">Operational Logs</h3>
          </div>
          <span className="text-outline text-sm tracking-widest">{history.length} Records Detected</span>
        </div>

        {/* Search & Sort HUD */}
        {history.length > 0 && (
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input 
                type="text"
                placeholder="Search by day or month (e.g., 'Monday', 'April')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary/50 transition-colors shadow-inner font-body text-sm"
              />
            </div>
            
            <div className="relative w-full md:w-64 shrink-0">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <select
                value={sortParam}
                onChange={(e) => setSortParam(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-full py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary/50 transition-colors shadow-inner font-body text-sm appearance-none cursor-pointer"
              >
                <option value="date_desc">Latest to Oldest</option>
                <option value="date_asc">Oldest to Latest</option>
                <option value="score_desc">Highest Yield First</option>
                <option value="score_asc">Lowest Yield First</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <ChevronDown className="w-4 h-4 text-outline" />
              </div>
            </div>
          </div>
        )}

        {/* Peak Performance Widget */}
        {peakDay && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 md:p-8 rounded-[24px] mb-10 border-l-4 border-secondary flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(68,226,205,0.05)] relative overflow-hidden group hover:border-l-primary transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
               <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
                 <Flame className="w-7 h-7 text-secondary" />
               </div>
               <div>
                 <p className="text-secondary font-bold tracking-widest text-xs uppercase mb-1 drop-shadow-md">System Peak Record</p>
                 <h3 className="text-2xl md:text-3xl font-display font-black text-on-surface capitalize tracking-wide">
                   {dayjs(peakDay.id).format("MMMM D, YYYY")}
                 </h3>
                 <p className="text-outline font-body text-sm mt-1">
                   {dayjs(peakDay.id).format("dddd")} Benchmark • {peakCompletedCount} Actions Completed
                 </p>
               </div>
            </div>

            <div className="shrink-0 relative z-10 w-full md:w-auto text-center md:text-right">
                <span className={`font-display font-black text-4xl lg:text-5xl drop-shadow-[0_0_12px_currentColor] text-secondary`}>
                  {Math.round(peakDay.score || 0)}%
                </span>
                <span className="block text-[11px] uppercase tracking-widest text-outline-variant font-bold mt-1">Consistency Rate</span>
            </div>
          </motion.div>
        )}

        {history.length === 0 ? (
          <div className="glass-panel p-12 rounded-[32px] text-center flex flex-col items-center mt-10">
            <CalendarCheck2 className="w-16 h-16 text-outline-variant mb-4" />
            <p className="text-outline font-body text-xl font-medium">No system history logs found.</p>
            <p className="text-outline/60 text-sm mt-2">Initialize your first daily operation to begin tracking.</p>
          </div>
        ) : (
          <div className="relative pl-6 lg:pl-10">
            {/* Central Timeline Rule */}
            <div className="absolute left-[39px] lg:left-[55px] top-6 bottom-0 w-px bg-gradient-to-b from-primary via-secondary/50 to-transparent shadow-[0_0_8px_rgba(208,188,255,0.4)]" />

            <div className="space-y-6">
              <AnimatePresence>
                {processedLogs.slice(0, visibleCount).map((day, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    key={day.id} 
                    className="relative flex flex-col sm:flex-row gap-6 lg:gap-8 group"
                  >
                    
                    {/* Timeline Node */}
                    <div className="absolute -left-6 lg:-left-10 top-5 w-8 h-8 rounded-full bg-surface-container-highest border-[3px] border-background flex items-center justify-center z-10 transition-colors group-hover:border-primary/50 shadow-sm">
                      <div className={`w-3 h-3 rounded-full ${day.score >= 80 ? 'bg-secondary' : day.score >= 50 ? 'bg-primary' : 'bg-[#ffb4ab]'} shadow-[0_0_8px_currentColor]`} />
                    </div>

                    {/* Glass Log Card */}
                    <div className="flex-1 glass-panel rounded-[24px] p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(208,188,255,0.08)] border-l-4 border-l-transparent hover:border-l-primary cursor-pointer border border-outline-variant/15" onClick={() => toggleDay(day.id)}>
                      
                      <div className="flex justify-between items-center px-1">
                        <div>
                          <span className="font-display font-black text-xl text-on-surface block leading-tight">
                            {dayjs(day.id).format("MMMM D, YYYY")}
                          </span>
                          <span className="text-outline text-xs tracking-widest uppercase font-bold mt-1 block">
                            {dayjs(day.id).format("dddd")}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className={`font-display font-black text-3xl drop-shadow-[0_0_8px_currentColor] ${day.score >= 80 ? 'text-secondary' : day.score >= 50 ? 'text-primary' : 'text-[#ffb4ab]'}`}>
                              {Math.round(day.score || 0)}%
                            </span>
                            <span className="block text-[10px] uppercase tracking-widest text-outline">Yield</span>
                          </div>
                          <motion.div animate={{ rotate: expandedDay === day.id ? 180 : 0 }}>
                            <ChevronDown className="w-6 h-6 text-outline group-hover:text-primary transition-colors" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedDay === day.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5 border-t border-outline-variant/30 pt-6 px-1">
                              {Object.keys(day).map((section) => {
                                if (section === "score" || section === "updatedAt" || section === "id") return null;
                                return (
                                  <div key={section} className="bg-surface-container-low p-5 rounded-[20px] border border-outline-variant/20 relative overflow-hidden group/section">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary opacity-50 rounded-l-md" />
                                    <h3 className="font-display font-black mb-4 uppercase text-on-surface-variant tracking-widest text-[11px]">{section.replace(/_/g, " ")}</h3>
                                    <ul className="space-y-3">
                                      {Object.keys(day[section]).map((task) => (
                                        <li key={task} className="flex items-start text-sm font-body leading-tight">
                                          <div className={`w-4 h-4 mt-0.5 shrink-0 rounded-[4px] flex items-center justify-center mr-3 border ${day[section][task] ? 'bg-primary/20 border-primary' : 'bg-surface border-outline-variant/50'}`}>
                                            {day[section][task] && <div className="w-2 h-2 rounded-[2px] bg-primary" />}
                                          </div>
                                          <span className={day[section][task] ? 'text-on-surface font-semibold' : 'text-outline/70'}>{formatTask(task)}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
              
              {processedLogs.length === 0 && searchQuery && (
                 <div className="text-center py-10 text-outline-variant font-body tracking-wide">
                   No logs matched your search filters.
                 </div>
              )}
            </div>

            {/* Load More Button */}
            {visibleCount < processedLogs.length && (
              <div className="mt-8 flex justify-center pb-8">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="bg-transparent border border-outline-variant/30 hover:border-primary text-on-surface hover:text-primary px-8 py-3 rounded-full font-body font-bold text-sm tracking-widest uppercase transition-all duration-300"
                >
                  Load Previous Records
                </button>
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default History;