/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string; // Tailwind color class, e.g. 'bg-amber-100', 'bg-emerald-100', etc.
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface TimeStats {
  percentOfDay: number;
  percentOfYear: number;
  dayOfYear: number;
  daysRemainingInYear: number;
  leapYear: boolean;
  moonPhase: {
    name: string;
    icon: string;
  };
  zodiac: string;
}
