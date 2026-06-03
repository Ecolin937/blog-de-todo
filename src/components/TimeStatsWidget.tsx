/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Compass, Sparkles, Navigation, Globe2, MoonStar } from "lucide-react";
import { computeTimeStats, getSeason } from "../utils/timeUtils";

interface TimeStatsWidgetProps {
  currentTime: Date;
}

export function TimeStatsWidget({ currentTime }: TimeStatsWidgetProps) {
  const [isNorthernHemisphere, setIsNorthernHemisphere] = useState(true);

  const stats = computeTimeStats(currentTime, isNorthernHemisphere);
  const season = getSeason(currentTime, isNorthernHemisphere);

  // Time remaining to the absolute end of the current year
  const endOfYear = new Date(currentTime.getFullYear(), 11, 31, 23, 59, 59, 999);
  const diffMs = endOfYear.getTime() - currentTime.getTime();
  
  const daysRem = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRem = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minsRem = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div
      id="time-stats-widget-container"
      className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all flex flex-col justify-between h-full"
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5 text-neutral-500 font-medium text-xs tracking-wider uppercase">
            <Compass className="w-4 h-4 text-purple-500" />
            <span>Métricas Temporales</span>
          </div>

          <button
            id="toggle-hemisphere"
            onClick={() => setIsNorthernHemisphere(!isNorthernHemisphere)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100/90 transition-all px-2.5 py-1 rounded-full cursor-pointer select-none"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Hem. {isNorthernHemisphere ? "Norte" : "Sur"}</span>
          </button>
        </div>

        {/* Dynamic Season Display */}
        <div className="flex items-center gap-4 bg-neutral-50 rounded-2xl p-4.5 mt-2 border border-neutral-100/20">
          <div className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-neutral-100">
            {season.icon}
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Estación Actual</div>
            <div className="text-base font-bold text-neutral-800 font-display mt-0.5">
              {season.name}
            </div>
          </div>
        </div>

        {/* Linear stats */}
        <div className="space-y-5 mt-6">
          {/* Day progression */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-400 font-medium mb-1.5">
              <span className="flex items-center gap-1">Día Transcurrido (%)</span>
              <span className="font-mono text-neutral-700 font-semibold">
                {stats.percentOfDay.toFixed(4)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentOfDay}%` }}
              ></div>
            </div>
          </div>

          {/* Year progression */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-400 font-medium mb-1.5">
              <span className="flex items-center gap-1">Año Transcurrido (%)</span>
              <span className="font-mono text-neutral-700 font-semibold">
                {stats.percentOfYear.toFixed(4)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.percentOfYear}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown stats footer */}
      <div className="mt-8 pt-5 border-t border-neutral-100 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-500">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Fin de Año</div>
            <div className="text-sm font-bold text-neutral-800 font-display mt-0.5">
              Faltan {daysRem}d y {hoursRem}h
            </div>
            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
              {stats.leapYear ? "Año bisiesto" : "Año regular"} ({currentTime.getFullYear()})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
