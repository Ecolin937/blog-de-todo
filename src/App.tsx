/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ClockWidget } from "./components/ClockWidget";
import { CalendarWidget } from "./components/CalendarWidget";
import { TimeStatsWidget } from "./components/TimeStatsWidget";
import { NotepadWidget } from "./components/NotepadWidget";
import { StopwatchWidget } from "./components/StopwatchWidget";
import { Clock, ArrowUpRight, Github, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  // Master synchronized system time
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  // Tick clock at high frequency for millisecond accuracy
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 50); // Fast enough to catch milliseconds cleanly without CPU overhead
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      id="app-root-container"
      className="min-h-screen bg-neutral-50/50 text-neutral-800 font-sans flex flex-col justify-between"
    >
      {/* Editorial Navigation Header */}
      <header
        id="app-main-header"
        className="border-b border-neutral-100 bg-white/60 backdrop-blur-md sticky top-0 z-30 select-none px-6 md:px-12 py-5"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Logo & Descriptive Heading */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-neutral-950 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-neutral-950/10 scale-100">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-neutral-900 tracking-tight leading-none">
                Estación Temporal
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Hora, Calendario y Bloc de Notas Integrado
              </p>
            </div>
          </div>

          {/* Quick Date Accent Badge */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-neutral-800">
                {currentTime.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                UTC Offset: {(-currentTime.getTimezoneOffset() / 60).toString().replace("-", "UTC-").replace("+", "UTC+") || "UTC"}h
              </div>
            </div>
            
            <div className="px-3.5 py-1.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Tiempo Real</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 py-8 px-6 md:px-12 max-w-7xl w-full mx-auto">
        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block: Time, Calendar & Stats Widgets (lg:col-span-7) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* Clock Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-auto"
            >
              <ClockWidget
                currentTime={currentTime}
                is24Hour={is24Hour}
                setIs24Hour={setIs24Hour}
              />
            </motion.div>

            {/* Split row: Calendar & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Calendar Widget */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="h-full"
              >
                <CalendarWidget systemTime={currentTime} />
              </motion.div>

              {/* Time Stats Widget */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="h-full"
              >
                <TimeStatsWidget currentTime={currentTime} />
              </motion.div>
            </div>

            {/* Stopwatch & Focus Tool */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <StopwatchWidget />
            </motion.div>
          </div>

          {/* Right Block: Integrated Notepad (lg:col-span-5) */}
          <div className="xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="h-full"
            >
              <NotepadWidget />
            </motion.div>
          </div>
          
        </div>
      </main>

      {/* Modern Compact Human Footer */}
      <footer
        id="app-main-footer"
        className="border-t border-neutral-100 bg-white py-6 px-6 text-center select-none"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-neutral-400">
          <div className="font-semibold text-neutral-500">
            Estación Temporal • {currentTime.getFullYear()}
          </div>
          <div className="flex items-center justify-center gap-1">
            <span>Creado con</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>para una productividad organizada</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

