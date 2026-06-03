/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarRange, Star, Moon, CalendarDays } from "lucide-react";
import { getDayOfYear, getZodiacSign, getMoonPhase } from "../utils/timeUtils";

interface CalendarWidgetProps {
  systemTime: Date;
}

export function CalendarWidget({ systemTime }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(systemTime));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(systemTime));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayLabels = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleResetToToday = () => {
    const today = new Date(systemTime);
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Get calendar information
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayIndex = (y: number, m: number) => {
    // getDay() gives 0 for Sunday, 1 for Monday...
    // In our row, Sunday is index 6, Monday is index 0
    let day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);
  
  // Previous month padding days
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYearContext = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYearContext, prevMonthIndex);

  const daysArray: { dayNum: number; isCurrentMonth: boolean; dateObj: Date }[] = [];

  // Generate padded days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayVal = daysInPrevMonth - i;
    daysArray.push({
      dayNum: dayVal,
      isCurrentMonth: false,
      dateObj: new Date(prevYearContext, prevMonthIndex, dayVal)
    });
  }

  // Generate days of current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    daysArray.push({
      dayNum: d,
      isCurrentMonth: true,
      dateObj: new Date(year, month, d)
    });
  }

  // Next month padding days to make exact grid of 6 rows (42 days)
  const remainingCells = 42 - daysArray.length;
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYearContext = month === 11 ? year + 1 : year;
  for (let n = 1; n <= remainingCells; n++) {
    daysArray.push({
      dayNum: n,
      isCurrentMonth: false,
      dateObj: new Date(nextYearContext, nextMonthIndex, n)
    });
  }

  // Helper comparison
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  // Stats of the currently selected day
  const sDayOfYear = getDayOfYear(selectedDate);
  const sZodiac = getZodiacSign(selectedDate);
  const sMoonPos = getMoonPhase(selectedDate);
  const isSelectedToday = isSameDay(selectedDate, systemTime);

  return (
    <div
      id="calendar-widget-container"
      className="bg-white rounded-3xl border border-neutral-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all flex flex-col justify-between h-full"
    >
      <div>
        {/* Header navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5 text-neutral-500 font-medium text-xs tracking-wider uppercase">
            <CalendarRange className="w-4 h-4 text-emerald-500" />
            <span>Calendario Interactivo</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="reset-to-today"
              onClick={handleResetToToday}
              className="text-xs px-2.5 py-1 rounded-md text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors font-medium cursor-pointer"
            >
              Hoy
            </button>
            <div className="flex items-center border border-neutral-100 rounded-lg bg-neutral-50 p-0.5">
              <button
                id="prev-month-btn"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-white rounded-md text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="next-month-btn"
                onClick={handleNextMonth}
                className="p-1 hover:bg-white rounded-md text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Month & Year Title */}
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-neutral-900 capitalize">
            {monthNames[month]} <span className="text-neutral-400 font-light">{year}</span>
          </h3>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Labels */}
          {dayLabels.map((lbl, idx) => (
            <div key={idx} className="font-medium text-neutral-400 py-2">
              {lbl}
            </div>
          ))}

          {/* Day Numbers */}
          {daysArray.map((cell, idx) => {
            const isToday = isSameDay(cell.dateObj, systemTime);
            const isCurrentlySelected = isSameDay(cell.dateObj, selectedDate);
            return (
              <button
                key={idx}
                id={`calendar-day-${cell.dateObj.getFullYear()}-${cell.dateObj.getMonth()}-${cell.dayNum}`}
                onClick={() => setSelectedDate(cell.dateObj)}
                className={`
                  h-9 w-9 mx-auto rounded-xl flex items-center justify-center font-medium transition-all text-xs relative cursor-pointer
                  ${
                    cell.isCurrentMonth
                      ? "text-neutral-800 hover:bg-neutral-50"
                      : "text-neutral-300 hover:bg-neutral-50/50"
                  }
                  ${
                    isCurrentlySelected
                      ? "bg-neutral-900! text-white! font-semibold scale-105 shadow-sm"
                      : ""
                  }
                  ${
                    isToday && !isCurrentlySelected
                      ? "ring-2 ring-emerald-500 ring-offset-2 text-emerald-700 font-bold"
                      : ""
                  }
                `}
              >
                {cell.dayNum}
                {isToday && (
                  <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Information Panel */}
      <div className="mt-8 pt-5 border-t border-neutral-100">
        <div className="bg-neutral-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
              Detalle del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </span>
            {isSelectedToday && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded">
                Hoy
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* Day of year */}
            <div className="bg-white border border-neutral-100/60 rounded-xl p-2.5">
              <div className="text-[10px] text-neutral-400 font-medium">Día del año</div>
              <div className="text-sm font-semibold text-neutral-800 font-mono mt-0.5">
                {sDayOfYear}
              </div>
            </div>

            {/* Zodiac */}
            <div className="bg-white border border-neutral-100/60 rounded-xl p-2.5 truncate">
              <div className="text-[10px] text-neutral-400 font-medium">Zodíaco</div>
              <div className="text-xs font-semibold text-neutral-800 mt-1 truncate" title={sZodiac}>
                {sZodiac}
              </div>
            </div>

            {/* Moon Phase */}
            <div className="bg-white border border-neutral-100/60 rounded-xl p-2.5 flex flex-col justify-center items-center">
              <div className="text-[10px] text-neutral-400 font-medium truncate w-full">Fase lunar</div>
              <div
                className="text-xs font-semibold text-neutral-800 mt-0.5 flex items-center justify-center gap-1"
                title={sMoonPos.name}
              >
                <span>{sMoonPos.icon}</span>
                <span className="text-[10px] text-neutral-500 font-mono truncate hidden max-w-16 sm:inline-block">
                  {sMoonPos.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
