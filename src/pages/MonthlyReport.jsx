import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import dayjs from "dayjs";
import { CalendarDays, TrendingUp } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyReport = () => {
  const [scores, setScores] = useState([]);
  const [weeklyAverages, setWeeklyAverages] = useState([]);

  const currentDate = dayjs();
  const currentMonthName = currentDate.format("MMMM YYYY");
  const todayFormatted = currentDate.format("dddd, D MMMM");

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const daysRef = collection(db, "routines", user.uid, "days");
    const snapshot = await getDocs(daysRef);

    const currentMonthPrefix = dayjs().format("YYYY-MM");

    const monthlyData = [];

    snapshot.forEach((doc) => {
      if (doc.id.startsWith(currentMonthPrefix)) {
        monthlyData.push({
          date: doc.id,
          score: doc.data().score || 0,
        });
      }
    });

    monthlyData.sort((a, b) => (a.date > b.date ? 1 : -1));
    setScores(monthlyData);

    // Calculate Weekly Averages
    const weeksList = [
      { name: "Week 1", scores: [] },
      { name: "Week 2", scores: [] },
      { name: "Week 3", scores: [] },
      { name: "Week 4", scores: [] },
      { name: "Week 5", scores: [] },
    ];

    monthlyData.forEach((s) => {
      const dayNum = parseInt(dayjs(s.date).format("D"), 10);
      let targetWeek = Math.floor((dayNum - 1) / 7);
      if (targetWeek > 4) targetWeek = 4; // Days 29-31 go into Week 5
      weeksList[targetWeek].scores.push(s.score);
    });

    const calculatedWeeks = weeksList.map(week => {
      if (week.scores.length === 0) return { name: week.name, avg: 0, active: false };
      const sum = week.scores.reduce((a, b) => a + b, 0);
      return { name: week.name, avg: Math.round(sum / week.scores.length), active: true };
    });

    setWeeklyAverages(calculatedWeeks);
  };

  // Add Day Names to X-Axis Labels e.g., "12 (Fri)"
  const labels = scores.map((s) => dayjs(s.date).format("D (ddd)"));
  const dataValues = scores.map((s) => s.score);

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Yield (%)",
        data: dataValues,
        tension: 0.4,
        borderColor: "#8B5CF6", // primary
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        pointBackgroundColor: "#44e2cd", // secondary
        pointBorderColor: "#131315",
        pointHoverBackgroundColor: "#131315",
        pointHoverBorderColor: "#44e2cd",
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: { color: "rgba(73, 68, 84, 0.2)", tickLength: 0 },
        ticks: { color: "#958ea0", font: { family: "Inter", size: 11 } }
      },
      y: {
        grid: { color: "rgba(73, 68, 84, 0.2)" },
        ticks: { color: "#958ea0", font: { family: "Inter", size: 12 }, stepSize: 20 },
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: { labels: { color: "#e5e1e4", font: { family: "Manrope", weight: "bold", size: 14 } } },
      tooltip: { backgroundColor: "#201f21", titleColor: "#e5e1e4", bodyColor: "#e5e1e4", borderColor: "#494454", borderWidth: 1 }
    }
  };

  const average =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, s) => sum + s.score, 0) / scores.length
        )
      : 0;

  const bestDay =
    scores.length > 0
      ? scores.reduce((max, s) => (s.score > max.score ? s : max))
      : null;

  const worstDay =
    scores.length > 0
      ? scores.reduce((min, s) => (s.score < min.score ? s : min))
      : null;

  return (
    <div className="w-full relative py-6">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10 w-full overflow-hidden">
        
        {/* Context Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between border-b border-outline_variant/30 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase flex items-center justify-center sm:justify-start gap-3">
              <CalendarDays className="w-8 h-8 text-primary" />
              <span>{currentMonthName}</span>
            </h2>
            <p className="text-outline mt-2 font-body text-lg">Monthly Analytics Report</p>
          </div>
          <div className="mt-4 sm:mt-0 text-center sm:text-right">
            <p className="text-outline uppercase text-xs font-bold tracking-widest mb-1">Today</p>
            <p className="text-xl font-display font-bold text-secondary">{todayFormatted}</p>
          </div>
        </div>

        {/* Global Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
          <div className="glass-panel p-6 rounded-[24px] text-center w-full flex flex-col justify-center border-t-4 border-t-primary">
            <p className="text-outline uppercase text-xs font-bold tracking-widest mb-2 flex items-center justify-center gap-2">
               <TrendingUp className="w-4 h-4" /> Average Yield
            </p>
            <p className="text-5xl font-display font-black text-primary">
              {average}%
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[24px] text-center w-full flex flex-col justify-center border-t-4 border-t-secondary">
            <p className="text-outline uppercase text-xs font-bold tracking-widest mb-2">Best Day</p>
            <p className="text-4xl font-display font-black text-secondary mt-1">
              {bestDay ? `${bestDay.score}%` : "-"}
            </p>
            {bestDay && <p className="text-outline text-sm mt-2">{dayjs(bestDay.date).format("D MMMM")}</p>}
          </div>

          <div className="glass-panel p-6 rounded-[24px] text-center w-full flex flex-col justify-center border-t-4 border-t-[#ffb4ab]">
            <p className="text-outline uppercase text-xs font-bold tracking-widest mb-2">Worst Day</p>
            <p className="text-4xl font-display font-black text-[#ffb4ab] mt-1">
              {worstDay ? `${worstDay.score}%` : "-"}
            </p>
            {worstDay && <p className="text-outline text-sm mt-2">{dayjs(worstDay.date).format("D MMMM")}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 w-full">
          {/* Main Chart (Takes up 3/4 width on desktop) */}
          <div className="lg:col-span-3 glass-panel p-4 sm:p-6 rounded-[24px] w-full overflow-x-auto">
            <div className="min-w-[600px] w-full">
              <Line data={data} options={chartOptions} />
            </div>
          </div>

          {/* Weekly Averages Module (Takes 1/4 width) */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-[24px] flex flex-col gap-4">
            <h3 className="font-display font-bold tracking-wide uppercase text-on-surface-variant border-b border-outline-variant/30 pb-3 mb-2">Weekly Averages</h3>
            
            <div className="flex flex-col gap-4 flex-grow justify-around">
              {weeklyAverages.map((week, idx) => (
                <div key={idx} className={`relative flex flex-col gap-1 p-3 rounded-xl border ${week.active ? 'bg-surface-container-low border-primary/20' : 'bg-surface-container border-transparent opacity-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm font-semibold">{week.name}</span>
                    <span className={`font-display font-bold ${week.active ? 'text-secondary' : 'text-outline'}`}>{week.active ? `${week.avg}%` : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${week.active ? week.avg : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;