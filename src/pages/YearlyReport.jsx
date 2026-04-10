import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { CalendarClock, TrendingUp, Trophy, Flame, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YearlyReport = () => {
  const [monthlyScores, setMonthlyScores] = useState([]);
  const [quarterlyAverages, setQuarterlyAverages] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = dayjs().format("YYYY");

  useEffect(() => {
    loadYearlyData();
  }, []);

  const loadYearlyData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const daysRef = collection(db, "routines", user.uid, "days");
      const snapshot = await getDocs(daysRef);

      const monthMap = {};
      const quarters = [
        { name: "Q1", range: "Jan-Mar", scores: [] },
        { name: "Q2", range: "Apr-Jun", scores: [] },
        { name: "Q3", range: "Jul-Sep", scores: [] },
        { name: "Q4", range: "Oct-Dec", scores: [] },
      ];

      snapshot.forEach((doc) => {
        if (doc.id.startsWith(currentYear)) {
          const monthStr = doc.id.substring(0, 7); // YYYY-MM
          const monthNum = parseInt(doc.id.substring(5, 7), 10); // 1-12
          const score = doc.data().score || 0;

          // Collect for monthly breakdown
          if (!monthMap[monthStr]) {
            monthMap[monthStr] = [];
          }
          monthMap[monthStr].push(score);

          // Collect for quarterly breakdown
          const quarterIndex = Math.ceil(monthNum / 3) - 1;
          quarters[quarterIndex].scores.push(score);
        }
      });

      const monthlyAvg = Object.keys(monthMap).map((month) => {
        const scores = monthMap[month];
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
        return {
          month, // "YYYY-MM"
          avg: Math.round(avg),
        };
      });

      monthlyAvg.sort((a, b) => (a.month > b.month ? 1 : -1));
      setMonthlyScores(monthlyAvg);

      const calculatedQuarters = quarters.map(q => {
        if (q.scores.length === 0) return { ...q, avg: 0, active: false };
        const avg = q.scores.reduce((a, b) => a + b, 0) / q.scores.length;
        return { ...q, avg: Math.round(avg), active: true };
      });
      setQuarterlyAverages(calculatedQuarters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Computations for KPI cards
  const yearAverage = monthlyScores.length > 0
    ? Math.round(monthlyScores.reduce((sum, m) => sum + m.avg, 0) / monthlyScores.length)
    : 0;

  const peakMonthObj = monthlyScores.length > 0 
    ? monthlyScores.reduce((p, c) => (p.avg > c.avg ? p : c), monthlyScores[0])
    : null;

  const bestQuarter = quarterlyAverages.filter(q => q.active).length > 0
    ? quarterlyAverages.filter(q => q.active).reduce((p, c) => (p.avg > c.avg ? p : c))
    : null;

  // Chart Logic
  const labels = monthlyScores.map((m) => dayjs(m.month).format("MMM"));
  const dataValues = monthlyScores.map((m) => m.avg);

  const data = {
    labels,
    datasets: [
      {
        label: "Efficiency Rate (%)",
        data: dataValues,
        backgroundColor: "rgba(68, 226, 205, 0.8)", // secondary
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#958ea0", font: { family: "Inter", size: 12 } }
      },
      y: {
        grid: { color: "rgba(73, 68, 84, 0.2)" },
        ticks: { color: "#958ea0", font: { family: "Inter", size: 12 }, stepSize: 20 },
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#201f21", titleColor: "#e5e1e4", bodyColor: "#e5e1e4", borderColor: "#494454", borderWidth: 1 }
    }
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-2 border-surface-container-highest border-t-secondary rounded-full animate-spin"></div>
        </div>
     );
  }

  return (
    <div className="w-full relative py-6">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 w-full overflow-hidden">
        
        {/* Context Header */}
        <div className="mb-4 text-center sm:text-left border-b border-outline-variant/30 pb-4 relative group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-secondary/10 transition-colors" />
          <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight uppercase flex items-center justify-center sm:justify-start gap-2 relative z-10">
            <CalendarClock className="w-6 h-6 text-secondary" />
            <span>Annual Analysis • {currentYear}</span>
          </h2>
          <p className="text-outline mt-1 font-body text-sm md:text-base max-w-2xl">
            A comprehensive look at your macro operational momentum and monthly efficiency distributions.
          </p>
        </div>

        {monthlyScores.length === 0 ? (
          <div className="glass-panel p-16 rounded-[32px] text-center flex flex-col items-center">
             <Trophy className="w-16 h-16 text-outline-variant mb-4" />
             <p className="text-on-surface font-display font-black text-2xl uppercase tracking-wider mb-2">Insufficient Yearly Data</p>
             <p className="text-outline max-w-md">The system requires active tracking logs within this year to project macro-level arrays. Initialize daily operations.</p>
          </div>
        ) : (
          <>
            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 mt-2">
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                className="glass-panel p-4 rounded-[20px] border border-outline-variant/20 flex flex-col items-center text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 border border-primary/20">
                   <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-black text-2xl md:text-3xl text-transparent bg-clip-text gradient-primary mb-1">{yearAverage}%</h3>
                <span className="text-[11px] font-bold text-outline tracking-widest uppercase">Annual Average Score</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel p-4 rounded-[20px] border border-secondary/20 flex flex-col items-center text-center shadow-[0_0_15px_rgba(68,226,205,0.05)] hover:border-secondary transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-2 border border-secondary/20">
                   <Flame className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display font-black text-2xl md:text-3xl text-secondary mb-1">
                  {peakMonthObj ? dayjs(peakMonthObj.month).format("MMMM") : "N/A"}
                </h3>
                <span className="text-[11px] font-bold text-outline tracking-widest uppercase">Peak Performance Month</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-panel p-4 rounded-[20px] border border-outline_variant/20 flex flex-col items-center text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-surface_container_highest flex items-center justify-center mb-2 border border-outline_variant/30">
                   <Trophy className="w-5 h-5 text-on_surface" />
                </div>
                <h3 className="font-display font-black text-on_surface text-lg leading-tight mb-1 uppercase break-words w-full">
                  {bestQuarter ? `${bestQuarter.name} Dominance` : 'Gathering Baseline'}
                </h3>
                <span className="text-[10px] font-bold text-outline tracking-widest uppercase px-2 leading-tight">
                  {bestQuarter ? `Highest quarterly consistency recorded at ${bestQuarter.avg}%.` : 'Awaiting quarterly completion threshold.'}
                </span>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-4 gap-4 w-full">
              
              {/* Main Monthly Distribution Bar Chart */}
              <div className="lg:col-span-3 glass-panel p-4 sm:p-5 rounded-[24px] w-full overflow-x-auto flex flex-col shadow-ambient border-t-4 border-t-secondary relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-[40px] pointer-events-none rounded-full" />
                <h3 className="font-display font-black text-lg tracking-wider uppercase text-on_surface mb-3 relative z-10 flex items-center gap-2">
                   Efficiency Distribution
                </h3>
                <div className="min-w-[600px] w-full h-[220px] md:h-[260px] relative z-10 block">
                  <Bar data={data} options={chartOptions} />
                </div>
              </div>

              {/* Quarterly Averages Module */}
              <div className="lg:col-span-1 glass-panel p-4 sm:p-5 rounded-[24px] flex flex-col gap-3">
                <h3 className="font-display font-black text-base tracking-wider uppercase text-on_surface_variant border-b border-outline_variant/30 pb-2 mb-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" /> Quarterly Trace
                </h3>
                
                <div className="flex flex-col gap-3 flex-grow justify-around">
                  {quarterlyAverages.map((q, idx) => (
                    <div key={idx} className={`relative flex flex-col gap-1.5 p-3 rounded-[16px] transition-all border ${q.active ? 'bg-surface_container_highest border-surface_container_highest/20 shadow-inner' : 'bg-surface_container_low border-transparent opacity-40'}`}>
                      <div className="flex justify-between items-end mb-0.5">
                        <div>
                          <span className="font-display font-black text-lg text-on_surface tracking-wide">{q.name}</span>
                          <span className="text-outline text-[10px] uppercase font-bold tracking-widest block -mt-1">{q.range}</span>
                        </div>
                        <span className={`font-display font-black text-xl ${q.active ? 'text-primary drop-shadow-[0_0_8px_rgba(208,188,255,0.3)]' : 'text-outline/50'}`}>
                          {q.active ? `${q.avg}%` : '--'}
                        </span>
                      </div>
                      <div className="w-full bg-surface_container h-2 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${q.active ? q.avg : 0}%` }}
                          transition={{ duration: 1.5, type: 'spring' }}
                          className={`h-full rounded-full ${q.name === bestQuarter?.name ? 'bg-gradient-to-r from-secondary to-[#20d8c0]' : 'bg-gradient-to-r from-primary to-[#b895fc]'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default YearlyReport;