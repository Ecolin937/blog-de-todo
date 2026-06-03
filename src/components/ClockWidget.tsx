/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Clock, Calendar, Globe, EyeOff, Eye } from "lucide-react";
import { motion } from "motion/react";

interface ClockWidgetProps {
  currentTime: Date;
  is24Hour: boolean;
  setIs24Hour: (val: boolean) => void;
}

export function ClockWidget({ currentTime, is24Hour, setIs24Hour }: ClockWidgetProps) {
  const [showCentiseconds, setShowCentiseconds] = useState(true);
  const [centiseconds, setCentiseconds] = useState(0);

  // Hook to update high-frequency centiseconds
  useEffect(() => {
    let animationFrameId: number;
    const updateCentis = () => {
      const now = new Date();
      setCentiseconds(Math.floor(now.getMilliseconds() / 10));
      animationFrameId = requestAnimationFrame(updateCentis);
    };
    if (showCentiseconds) {
      animationFrameId = requestAnimationFrame(updateCentis);
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showCentiseconds]);

  // Handle formatted date
  const formatTime = () => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    let ampm = "";

    if (!is24Hour) {
      ampm = hours >= 12 ? " PM" : " AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
    }

    const hrsStr = hours.toString().padStart(2, "0");
    return {
      hoursStr: hrsStr,
      minutesStr: minutes,
      secondsStr: seconds,
      ampm,
    };
  };

  const { hoursStr, minutesStr, secondsStr, ampm } = formatTime();

  // Spanish month and day names
  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const currentDayName = dayNames[currentTime.getDay()];
  const currentMonthName = monthNames[currentTime.getMonth()];
  const currentDayOfMonth = currentTime.getDate();
  const currentYear = currentTime.getFullYear();

  // Progress of current hour (minutes and seconds converted to percent)
  const currentMinute = currentTime.getMinutes();
  const currentSec = currentTime.getSeconds();
  const hourProgress = ((currentMinute * 60 + currentSec) / 3600) * 100;

  // Timezone string
  let timezoneStr = "";
  try {
    timezoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    timezoneStr = "UTC";
  }

  return (
    <div
      id="clock-widget-container"
      className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all flex flex-col justify-between h-full"
    >
      <div>
        {/* Header toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5 text-neutral-500 font-medium text-xs tracking-wider uppercase">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Precisión Temporal</span>
          </div>

          <div className="flex bg-neutral-50 p-1 rounded-full text-xs font-medium border border-neutral-100">
            <button
              id="toggle-24h-false"
              onClick={() => setIs24Hour(false)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                !is24Hour
                  ? "bg-white text-neutral-800 shadow-sm font-semibold"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              12H
            </button>
            <button
              id="toggle-24h-true"
              onClick={() => setIs24Hour(true)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                is24Hour
                  ? "bg-white text-neutral-800 shadow-sm font-semibold"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              24H
            </button>
          </div>
        </div>

        {/* Digital Time display with Layout animation */}
        <div className="mt-4 flex items-baseline select-none">
          <div className="font-display text-6xl md:text-7xl font-bold text-neutral-950 tracking-tighter tabular-nums flex items-center">
            <span>{hoursStr}</span>
            <span className="text-neutral-300 animate-pulse mx-1">:</span>
            <span>{minutesStr}</span>
            <span className="text-neutral-300 animate-pulse mx-1">:</span>
            <span>{secondsStr}</span>
          </div>

          {/* Centiseconds display */}
          {showCentiseconds ? (
            <span className="font-mono text-xl md:text-2xl font-medium text-amber-500/80 ml-2.5 w-10 tabular-nums">
              .{centiseconds.toString().padStart(2, "0")}
            </span>
          ) : (
            <span className="w-2"></span>
          )}

          {/* AM/PM Badge */}
          {!is24Hour && (
            <span className="ml-2 px-2.5 py-1 text-xs font-bold font-display uppercase tracking-wider text-amber-800 bg-amber-50 rounded-md border border-amber-100 select-none">
              {ampm.trim()}
            </span>
          )}
        </div>

        {/* Hour Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-mono mb-1.5">
            <span>Progreso de la hora</span>
            <span>{Math.floor(hourProgress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${hourProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Date & Location Footer */}
      <div className="mt-8 pt-6 border-t border-neutral-100/80">
        <div className="space-y-4">
          {/* Day & Date formatted beautifully */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-500">
              <Calendar className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-800">
                {currentDayName}, {currentDayOfMonth} de {currentMonthName}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Año {currentYear}
              </div>
            </div>
          </div>

          {/* Timezone Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-500">
                <Globe className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-800 truncate max-w-44 md:max-w-xs">
                  {timezoneStr}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Zona Horaria Local
                </div>
              </div>
            </div>

            <button
              id="toggle-centiseconds"
              onClick={() => setShowCentiseconds(!showCentiseconds)}
              title={showCentiseconds ? "Ocultar centisegundos" : "Mostrar centisegundos"}
              className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              {showCentiseconds ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
