/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Timer, Hourglass, Play, Pause, RotateCcw, Award } from "lucide-react";

export function StopwatchWidget() {
  const [activeTab, setActiveTab] = useState<"stopwatch" | "pomodoro">("stopwatch");

  // Stopwatch state
  const [swTime, setSwTime] = useState(0); // milliseconds
  const [swActive, setSwActive] = useState(false);
  const [swLaps, setSwLaps] = useState<number[]>([]);

  // Pomodoro state
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60); // 25 Min
  const [pomoActive, setPomoActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // References for accurate timing
  const swIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pomoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stopwatch effect
  useEffect(() => {
    if (swActive) {
      const startTime = Date.now() - swTime;
      swIntervalRef.current = setInterval(() => {
        setSwTime(Date.now() - startTime);
      }, 10);
    } else {
      if (swIntervalRef.current) {
        clearInterval(swIntervalRef.current);
      }
    }

    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [swActive]);

  // Pomodoro effect
  useEffect(() => {
    if (pomoActive) {
      pomoIntervalRef.current = setInterval(() => {
        setPomoSeconds((prev) => {
          if (prev <= 1) {
            // Timer finished
            setPomoActive(false);
            if (pomoIntervalRef.current) clearInterval(pomoIntervalRef.current);
            // Toggle break
            setIsBreak(!isBreak);
            return !isBreak ? 5 * 60 : 25 * 60; // 5 min break, 25 min work
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomoIntervalRef.current) {
        clearInterval(pomoIntervalRef.current);
      }
    }

    return () => {
      if (pomoIntervalRef.current) clearInterval(pomoIntervalRef.current);
    };
  }, [pomoActive, isBreak]);

  // Stopwatch controllers
  const handleSwReset = () => {
    setSwActive(false);
    setSwTime(0);
    setSwLaps([]);
  };

  const handleSwLap = () => {
    setSwLaps([swTime, ...swLaps]);
  };

  // Pomodoro controllers
  const handlePomoReset = () => {
    setPomoActive(false);
    setIsBreak(false);
    setPomoSeconds(25 * 60);
  };

  // Format Stopwatch time: MM:SS.cc
  const formatStopwatch = (timeMs: number) => {
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const centiseconds = Math.floor((timeMs % 1000) / 10);

    return {
      min: minutes.toString().padStart(2, "0"),
      sec: seconds.toString().padStart(2, "0"),
      centi: centiseconds.toString().padStart(2, "0"),
    };
  };

  const swFormatted = formatStopwatch(swTime);

  // Format Pomodoro Time
  const formatPomodoro = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="stopwatch-pomodoro-container"
      className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all flex flex-col justify-between h-full select-none"
    >
      <div>
        {/* Header Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-neutral-50 p-1 rounded-full text-xs font-semibold border border-neutral-100 w-full">
            <button
              id="tab-stopwatch-trigger"
              onClick={() => setActiveTab("stopwatch")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === "stopwatch"
                  ? "bg-white text-rose-700 shadow-sm font-bold"
                  : "text-neutral-400 hover:text-neutral-700 font-medium"
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Cronómetro</span>
            </button>
            <button
              id="tab-pomodoro-trigger"
              onClick={() => setActiveTab("pomodoro")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeTab === "pomodoro"
                  ? "bg-white text-rose-700 shadow-sm font-bold"
                  : "text-neutral-400 hover:text-neutral-700 font-medium"
              }`}
            >
              <Hourglass className="w-3.5 h-3.5" />
              <span>Mtodo. Pomodoro</span>
            </button>
          </div>
        </div>

        {/* Stopwatch Layout */}
        {activeTab === "stopwatch" && (
          <div className="text-center py-2 flex flex-col items-center">
            {/* Counter display */}
            <div className="font-mono text-5xl font-bold text-neutral-900 tracking-tight tabular-nums flex items-baseline">
              <span>{swFormatted.min}</span>
              <span className="text-neutral-300 mx-1">:</span>
              <span>{swFormatted.sec}</span>
              <span className="text-rose-500/80 text-xl font-medium ml-1.5">
                .{swFormatted.centi}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                id="sw-reset"
                onClick={handleSwReset}
                className="p-3 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-xl transition-all border border-neutral-100 cursor-pointer"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="sw-toggle"
                onClick={() => setSwActive(!swActive)}
                className={`flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-sm cursor-pointer ${
                  swActive 
                    ? "bg-neutral-800 hover:bg-neutral-900" 
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {swActive ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{swActive ? "Pausar" : "Iniciar"}</span>
              </button>

              <button
                id="sw-lap"
                onClick={handleSwLap}
                disabled={swTime === 0}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  swTime > 0
                    ? "bg-neutral-50 border-neutral-100 text-neutral-600 hover:bg-neutral-110/50"
                    : "bg-neutral-50/50 border-neutral-100/50 text-neutral-300 cursor-not-allowed"
                }`}
                title="Vuelta"
              >
                <Award className="w-4 h-4" />
              </button>
            </div>

            {/* Laps List */}
            {swLaps.length > 0 && (
              <div className="mt-5 w-full max-h-[110px] overflow-y-auto border border-neutral-100/50 rounded-xl bg-neutral-50/20 p-2 text-xs">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-left pl-2">
                  Tiempos Parciales
                </div>
                <div className="space-y-1">
                  {swLaps.map((lapTime, i) => {
                    const f = formatStopwatch(lapTime);
                    return (
                      <div key={i} className="flex justify-between items-center text-neutral-600 px-2 py-1 bg-white border border-neutral-100 rounded-lg">
                        <span className="font-medium text-neutral-400">Vuelta #{swLaps.length - i}</span>
                        <span className="font-mono font-bold text-neutral-700">
                          {f.min}:{f.sec}.{f.centi}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pomodoro Layout */}
        {activeTab === "pomodoro" && (
          <div className="text-center py-2 flex flex-col items-center">
            {/* Counter display */}
            <div className="font-mono text-5xl font-bold text-neutral-900 tracking-tight tabular-nums relative">
              {formatPomodoro(pomoSeconds)}
            </div>

            {/* Subtext */}
            <div className="text-xs text-neutral-500 mt-2 font-medium">
              {isBreak ? (
                <span className="text-emerald-600 animate-pulse bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  ¡Modo Descanso! 🌱
                </span>
              ) : (
                <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                  Tiempo de Concentración 🎯
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                id="pomo-reset"
                onClick={handlePomoReset}
                className="p-3 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 rounded-xl border border-neutral-100 cursor-pointer"
                title="Reiniciar a 25 min"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="pomo-toggle"
                onClick={() => setPomoActive(!pomoActive)}
                className={`py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  pomoActive 
                    ? "bg-neutral-800 hover:bg-neutral-900" 
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {pomoActive ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{pomoActive ? "Pausar" : "Concentrar"}</span>
              </button>
            </div>

            {/* Selector helper */}
            <div className="flex justify-center gap-2 mt-4 select-none">
              <button
                id="pomo-set-work"
                onClick={() => {
                  setPomoActive(false);
                  setIsBreak(false);
                  setPomoSeconds(25 * 60);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-md font-semibold border cursor-pointer ${
                  !isBreak
                    ? "bg-rose-50 border-rose-200 text-rose-800"
                    : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Estudio (25m)
              </button>
              <button
                id="pomo-set-break"
                onClick={() => {
                  setPomoActive(false);
                  setIsBreak(true);
                  setPomoSeconds(5 * 60);
                }}
                className={`text-[10px] px-2.5 py-1 rounded-md font-semibold border cursor-pointer ${
                  isBreak
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                Descanso (5m)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative timing quote footer */}
      <div className="mt-6 pt-4 border-t border-neutral-100/80 text-center">
        <span className="text-[10px] font-medium text-neutral-400 italic">
          {activeTab === "stopwatch"
            ? "Mide tu velocidad de entrega al segundo."
            : "Estudia 25m y descansa 5m para mantener la mente fresca."}
        </span>
      </div>
    </div>
  );
}
