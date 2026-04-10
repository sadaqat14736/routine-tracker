import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScoreCircle from "../components/ScoreCircle";
import SectionCard from "../components/SectionCard";
import CheckboxItem from "../components/CheckboxItem";
import { calculateScore } from "../utils/scoreCalculator";
import { auth, db } from "../firebase/config";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import dayjs from "dayjs";
import { 
  Save, CheckCircle2, Activity,
  Sunrise, Sparkles, Dumbbell, Sun, Coffee,
  BookOpen, Glasses, GraduationCap, CloudSun,
  Code2, FileCode2, Search, BrainCircuit, Timer,
  Footprints, Users, Moon, BookHeart, CalendarClock, Target,
  ShieldX, CigaretteOff, SearchX, MessageSquareOff
} from "lucide-react";

const DailyTracker = () => {
  const [routine, setRoutine] = useState({
    prayers: { tahajjud: false, fajr: false, zohar: false, asr: false, maghrib: false, isha: false },
    morning: { wakeup: false, exercise: false, breakfast: false },
    academics: { study: false, reading: false, college: false, coding: false, assignment: false, research: false, learning: false },
    social_family: { walk: false, friends: false, dinner: false, mother_help: false },
    night: { quran: false, planning: false, sleep: false },
    discipline: { no_porn: false, no_smoke: false, no_reels: false, no_abuse: false },
  });

  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const today = dayjs().format("YYYY-MM-DD");
      const docRef = doc(db, "routines", user.uid, "days", today);

      const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Merge fetched data gracefully avoiding crash if structure changed
          setRoutine(prev => ({
            prayers: { ...prev.prayers, ...(data.prayers || {}) },
            morning: { ...prev.morning, ...(data.morning || {}) },
            academics: { ...prev.academics, ...(data.academics || {}) },
            social_family: { ...prev.social_family, ...(data.social_family || {}) },
            night: { ...prev.night, ...(data.night || {}) },
            discipline: { ...prev.discipline, ...(data.discipline || {}) }
          }));
          setScore(data.score || 0);
        }
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const newScore = calculateScore(routine);
    setScore(newScore);
  }, [routine]);

  const handleChange = (section, task) => {
    setRoutine((prev) => ({
      ...prev,
      [section]: { ...prev[section], [task]: !prev[section][task] },
    }));
  };

  const saveRoutine = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) return;

      const today = dayjs().format("YYYY-MM-DD");

      await setDoc(
        doc(db, "routines", user.uid, "days", today),
        {
          ...routine,
          score,
          updatedAt: dayjs().toISOString(),
        },
        { merge: true }
      );

      setLastSaved(true);
      setTimeout(() => setLastSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Error saving routine");
    } finally {
      setSaving(false);
    }
  };

  // Variable column span architecture to create dynamic grid footprints 
  const sections = [
    { id: "discipline", colSpan: "lg:col-span-2 xl:col-span-3", title: "🛡️ Absolute Discipline", tasks: [
      { label: "No Reels", key: "no_reels", subtitle: "Avoid cheap dopamine loops", timeTag: "STRICT", icon: SearchX },
      { label: "No Abuse", key: "no_abuse", subtitle: "Maintain verbal composure", timeTag: "STRICT", icon: MessageSquareOff },
      { label: "No Smoke", key: "no_smoke", subtitle: "Preserve lung integrity", timeTag: "STRICT", icon: CigaretteOff },
      { label: "No P***", key: "no_porn", subtitle: "Maintain neuro-chemical baseline", timeTag: "STRICT", icon: ShieldX },
    ]},
    { id: "prayers", colSpan: "lg:col-span-2 xl:col-span-2", title: "🕌 Salah Obligations", tasks: [
      { label: "Tahajjud", key: "tahajjud", subtitle: "Pre-dawn communion", timeTag: "20m", icon: Sparkles },
      { label: "Fajr", key: "fajr", subtitle: "Dawn prayer", timeTag: "15m", icon: Sun },
      { label: "Zohar", key: "zohar", subtitle: "Midday prayer", timeTag: "10m", icon: CloudSun },
      { label: "Asr", key: "asr", subtitle: "Afternoon prayer", timeTag: "10m", icon: Timer },
      { label: "Maghrib", key: "maghrib", subtitle: "Sunset prayer", timeTag: "10m", icon: Sunrise },
      { label: "Isha", key: "isha", subtitle: "Nightfall prayer", timeTag: "15m", icon: Moon },
    ]},
    { id: "morning", colSpan: "lg:col-span-1 xl:col-span-1", title: "🌅 Morning Operations", tasks: [
      { label: "Wakeup", key: "wakeup", subtitle: "Initialize protocol", timeTag: "5:00 AM", icon: Sunrise },
      { label: "Exercise", key: "exercise", subtitle: "Physical conditioning", timeTag: "30m", icon: Dumbbell },
      { label: "Breakfast", key: "breakfast", subtitle: "Nutritional intake", timeTag: "Prio", icon: Coffee },
    ]},
    { id: "academics", colSpan: "lg:col-span-2 xl:col-span-2", title: "📚 Academics & Skills", tasks: [
      { label: "Study Block", key: "study", subtitle: "Deep work session", timeTag: "2 Hrs", icon: BookOpen },
      { label: "Reading", key: "reading", subtitle: "Consume literature", timeTag: "15m", icon: Glasses },
      { label: "College", key: "college", subtitle: "Attend lectures", timeTag: "Variable", icon: GraduationCap },
      { label: "Core Coding", key: "coding", subtitle: "Algorithm development", timeTag: "1.5 Hrs", icon: Code2 },
      { label: "Assignment", key: "assignment", subtitle: "Execute deliverables", timeTag: "Priority", icon: FileCode2 },
      { label: "Research", key: "research", subtitle: "Analyze documentations", timeTag: "45m", icon: Search },
      { label: "Learning", key: "learning", subtitle: "Absorb frameworks", timeTag: "30m", icon: BrainCircuit },
    ]},
    { id: "social_family", colSpan: "lg:col-span-1 xl:col-span-1", title: "👥 Social & Family", tasks: [
      { label: "Evening Walk", key: "walk", subtitle: "Decompression", timeTag: "20m", icon: Footprints },
      { label: "Networking", key: "friends", subtitle: "Colleague interaction", timeTag: "Variable", icon: Users },
      { label: "Dinner", key: "dinner", subtitle: "Family gathering", timeTag: "30m", icon: Coffee },
      { label: "Mother Help", key: "mother_help", subtitle: "Household targets", timeTag: "Required", icon: BookHeart },
    ]},
    { id: "night", colSpan: "lg:col-span-1 xl:col-span-1", title: "🌙 Night Protocol", tasks: [
      { label: "Quran", key: "quran", subtitle: "Spiritual sequence", timeTag: "20m", icon: BookOpen },
      { label: "Planning", key: "planning", subtitle: "Schedule operations", timeTag: "10m", icon: CalendarClock },
      { label: "Sleep", key: "sleep", subtitle: "Terminate waking state", timeTag: "11:00 PM", icon: Target },
    ]},
  ];

  return (
    <div className="w-full relative py-2">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 relative z-10 pb-16">
        
        {/* TOP HEADER HUD */}
        <div className="glass-panel p-14 rounded-[24px] border-l-4 border-l-primary flex flex-col md:flex-row items-center justify-between gap-6 shadow-ambient">
          <div className="flex-1 flex flex-col gap-2 w-full text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <h2 className="text-2xl md:text-3xl font-display font-black tracking-widest uppercase">System Operations</h2>
            </div>
            <p className="text-outline font-body leading-relaxed max-w-2xl text-sm md:text-base">
              Synchronize your active checkpoints. Execute parameters and finalize synchronization below to automatically log analytics arrays into your trajectory.
            </p>
          </div>
          <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 relative flex items-center justify-center">
             <div className="absolute inset-0 bg-primary/10 rounded-full blur-[20px] pointer-events-none" />
             <ScoreCircle score={score} />
          </div>
        </div>

        {/* HUD MASONRY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 w-full items-start">
          {sections.map((section, idx) => {
            const totalCount = section.tasks.length;
            let completedCount = 0;
            section.tasks.forEach(t => {
              if (routine[section.id] && routine[section.id][t.key]) completedCount++;
            });

            return (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${section.colSpan} w-full h-full`}
              >
                <SectionCard 
                  title={section.title} 
                  totalCount={totalCount} 
                  completedCount={completedCount}
                >
                  <div className={`grid gap-3 w-full ${section.colSpan.includes('col-span-2') ? 'md:grid-cols-2' : ''} ${section.colSpan.includes('col-span-3') ? 'md:grid-cols-2 xl:grid-cols-4' : ''}`}>
                    {section.tasks.map((task) => (
                      <CheckboxItem
                        key={task.key}
                        label={task.label}
                        subtitle={task.subtitle}
                        timeTag={task.timeTag}
                        icon={task.icon}
                        checked={routine[section.id]?.[task.key] || false}
                        onChange={() => handleChange(section.id, task.key)}
                      />
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM ANCHOR BUTTON - SHORTENED WIDTH */}
        <div className="w-full relative mt-8 flex justify-center">
          <motion.div className="w-full max-w-md relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveRoutine}
              disabled={saving}
              className="w-full gradient-primary px-6 py-5 rounded-[24px] font-display font-black tracking-widest uppercase text-lg inline-flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(208,188,255,0.1)] hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {saving ? (
                <>
                  <div className="w-6 h-6 border-[3px] border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Synching...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 group-hover:scale-110 transition-transform shadow-sm" />
                  Commit Operations
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {lastSaved && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 text-secondary font-bold tracking-wider bg-surface-container-highest px-6 py-2.5 rounded-full backdrop-blur-md border border-secondary/30 shadow-lg z-50 whitespace-nowrap"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary" /> SYNCHRONIZED
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default DailyTracker;