/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TimeStats } from "../types";

/**
 * Checks if a given year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns the day of the year (1 - 365/366)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns moon phase estimate and unicode character based on date
 */
export function getMoonPhase(date: Date): { name: string; icon: string } {
  // Reference date: Dec 11, 2023 at 23:32 UTC (Known New Moon)
  const refDate = new Date(Date.UTC(2023, 11, 11, 23, 32, 0));
  const diffMs = date.getTime() - refDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const lunarCycle = 29.530588853;
  const phase = (diffDays % lunarCycle) / lunarCycle;
  const normalizedPhase = phase < 0 ? phase + 1 : phase;
  
  if (normalizedPhase < 0.03 || normalizedPhase > 0.97) return { name: "Luna Nueva", icon: "🌑" };
  if (normalizedPhase >= 0.03 && normalizedPhase < 0.22) return { name: "Luna Creciente", icon: "🌒" };
  if (normalizedPhase >= 0.22 && normalizedPhase < 0.28) return { name: "Cuarto Creciente", icon: "🌓" };
  if (normalizedPhase >= 0.28 && normalizedPhase < 0.47) return { name: "Gibosa Creciente", icon: "🌔" };
  if (normalizedPhase >= 0.47 && normalizedPhase < 0.53) return { name: "Luna Llena", icon: "🌕" };
  if (normalizedPhase >= 0.53 && normalizedPhase < 0.72) return { name: "Gibosa Menguante", icon: "🌖" };
  if (normalizedPhase >= 0.72 && normalizedPhase < 0.78) return { name: "Cuarto Menguante", icon: "🌗" };
  return { name: "Luna Menguante", icon: "🌘" };
}

/**
 * Returns zodiac sign based on date
 */
export function getZodiacSign(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-indexed (Jan = 1, Feb = 2...)

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Tauro ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Géminis ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cáncer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpio ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitario ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricornio ♑";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Acuario ♒";
  return "Piscis ♓";
}

/**
 * Returns season in Spanish depending on hemisphere
 */
export function getSeason(date: Date, isNorthernHemisphere: boolean): { name: string; icon: string } {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Determine transition bounds
  // March Equinox: ~Mar 20
  // June Solstice: ~Jun 21
  // September Equinox: ~Sep 22
  // December Solstice: ~Dec 21

  const isSpring = (month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day < 21);
  const isSummer = (month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day < 22);
  const isAutumn = (month === 9 && day >= 22) || month === 10 || month === 11 || (month === 12 && day < 21);
  
  if (isNorthernHemisphere) {
    if (isSpring) return { name: "Primavera", icon: "🌱" };
    if (isSummer) return { name: "Verano", icon: "☀️" };
    if (isAutumn) return { name: "Otoño", icon: "🍂" };
    return { name: "Invierno", icon: "❄️" };
  } else {
    // Southern hemisphere is inverted
    if (isSpring) return { name: "Otoño", icon: "🍂" };
    if (isSummer) return { name: "Invierno", icon: "❄️" };
    if (isAutumn) return { name: "Primavera", icon: "🌱" };
    return { name: "Verano", icon: "☀️" };
  }
}

/**
 * Computes all granular stats
 */
export function computeTimeStats(date: Date, isNorthernHemisphere = true): TimeStats {
  const year = date.getFullYear();
  const dayNum = getDayOfYear(date);
  const isLeap = isLeapYear(year);
  const totalDays = isLeap ? 366 : 365;

  // Percentage of year passed
  const percentOfYear = (dayNum / totalDays) * 100;

  // Percentage of day passed
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ms = date.getMilliseconds();
  const totalMsPassed = ((hours * 60 + minutes) * 60 + seconds) * 1000 + ms;
  const totalMsInDay = 24 * 60 * 60 * 1000;
  const percentOfDay = (totalMsPassed / totalMsInDay) * 100;

  return {
    percentOfDay,
    percentOfYear,
    dayOfYear: dayNum,
    daysRemainingInYear: totalDays - dayNum,
    leapYear: isLeap,
    moonPhase: getMoonPhase(date),
    zodiac: getZodiacSign(date),
  };
}
