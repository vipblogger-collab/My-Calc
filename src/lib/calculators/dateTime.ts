export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function parseIsoDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  if (!y || !m || !d) throw new Error('Invalid date format');
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function formatUtcIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function getUsFederalHolidays(year: number): Set<string> {
  const holidays = new Set<string>();
  const pad = (n: number) => String(n).padStart(2, '0');
  const observed = (m: number, day: number) => {
    const d = new Date(Date.UTC(year, m - 1, day, 12));
    const dow = d.getUTCDay();
    if (dow === 6) d.setUTCDate(d.getUTCDate() - 1);
    if (dow === 0) d.setUTCDate(d.getUTCDate() + 1);
    return formatUtcIso(d);
  };
  const nthWeekday = (m: number, weekday: number, nth: number) => {
    const first = new Date(Date.UTC(year, m - 1, 1, 12));
    const diff = (weekday - first.getUTCDay() + 7) % 7;
    const day = 1 + diff + (nth - 1) * 7;
    return `${year}-${pad(m)}-${pad(day)}`;
  };
  const lastMonday = (m: number) => {
    const last = new Date(Date.UTC(year, m, 0, 12));
    const diff = (last.getUTCDay() - 1 + 7) % 7;
    last.setUTCDate(last.getUTCDate() - diff);
    return formatUtcIso(last);
  };

  holidays.add(observed(1, 1)); // New Year's Day
  holidays.add(nthWeekday(1, 1, 3)); // MLK Jr. Day
  holidays.add(nthWeekday(2, 1, 3)); // Presidents' Day
  holidays.add(lastMonday(5)); // Memorial Day
  holidays.add(observed(6, 19)); // Juneteenth
  holidays.add(observed(7, 4)); // Independence Day
  holidays.add(nthWeekday(9, 1, 1)); // Labor Day
  holidays.add(nthWeekday(10, 1, 2)); // Columbus Day
  holidays.add(observed(11, 11)); // Veterans Day
  holidays.add(nthWeekday(11, 4, 4)); // Thanksgiving
  holidays.add(observed(12, 25)); // Christmas

  return holidays;
}

export function calculateCalendarYMD(startStr: string, endStr: string) {
  let start = parseIsoDate(startStr);
  let end = parseIsoDate(endStr);
  const inverted = start.getTime() > end.getTime();
  if (inverted) [start, end] = [end, start];

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  return { years, months, days, totalDays, inverted };
}

export function calculateAge(dobStr: string, targetDateStr: string) {
  const dob = parseIsoDate(dobStr);
  const target = parseIsoDate(targetDateStr);
  if (dob.getTime() > target.getTime()) {
    throw new Error('Birth date must be on or before the target date.');
  }
  const diff = calculateCalendarYMD(dobStr, targetDateStr);
  const weekdayBorn = dob.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

  let nextBdayYear = target.getUTCFullYear();
  let nextBday = new Date(Date.UTC(nextBdayYear, dob.getUTCMonth(), dob.getUTCDate(), 12));
  if (nextBday.getTime() <= target.getTime()) {
    nextBdayYear++;
    nextBday = new Date(Date.UTC(nextBdayYear, dob.getUTCMonth(), dob.getUTCDate(), 12));
  }
  const daysUntilNextBirthday = Math.round((nextBday.getTime() - target.getTime()) / 86400000);

  return {
    years: diff.years,
    months: diff.months,
    days: diff.days,
    totalDays: diff.totalDays,
    totalWeeks: Math.floor(diff.totalDays / 7),
    totalHours: diff.totalDays * 24,
    totalMinutes: diff.totalDays * 1440,
    weekdayBorn,
    daysUntilNextBirthday,
  };
}

export function calculateBusinessDays(
  startStr: string,
  endStr: string,
  excludeHolidays = true,
  includeEndDate = false
) {
  let start = parseIsoDate(startStr);
  let end = parseIsoDate(endStr);
  if (start.getTime() > end.getTime()) [start, end] = [end, start];

  const holidayCache = new Map<number, Set<string>>();
  const isHoliday = (iso: string, year: number) => {
    if (!excludeHolidays) return false;
    if (!holidayCache.has(year)) holidayCache.set(year, getUsFederalHolidays(year));
    return holidayCache.get(year)!.has(iso);
  };

  let totalDays = 0;
  let businessDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;

  const cursor = new Date(start.getTime());
  const limit = includeEndDate ? end.getTime() : end.getTime() - 86400000;

  while (cursor.getTime() <= limit) {
    totalDays++;
    const dow = cursor.getUTCDay();
    const iso = formatUtcIso(cursor);
    if (dow === 0 || dow === 6) {
      weekendDays++;
    } else if (isHoliday(iso, cursor.getUTCFullYear())) {
      holidayDays++;
    } else {
      businessDays++;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    if (totalDays > 50000) break;
  }

  return { totalDays, businessDays, weekendDays, holidayDays };
}

export function addWorkingDays(
  startStr: string,
  deltaDays: number,
  excludeHolidays = true
) {
  const start = parseIsoDate(startStr);
  const step = deltaDays >= 0 ? 1 : -1;
  let remaining = Math.abs(Math.round(deltaDays));
  const holidayCache = new Map<number, Set<string>>();
  const cursor = new Date(start.getTime());
  let calendarDaysElapsed = 0;

  while (remaining > 0 && calendarDaysElapsed < 50000) {
    cursor.setUTCDate(cursor.getUTCDate() + step);
    calendarDaysElapsed++;
    const dow = cursor.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    if (excludeHolidays) {
      const yr = cursor.getUTCFullYear();
      if (!holidayCache.has(yr)) holidayCache.set(yr, getUsFederalHolidays(yr));
      if (holidayCache.get(yr)!.has(formatUtcIso(cursor))) continue;
    }
    remaining--;
  }

  return {
    resultDate: formatUtcIso(cursor),
    weekday: cursor.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
    calendarDaysElapsed,
  };
}

export function addSubtractCalendarDate(
  startStr: string,
  operation: 'add' | 'subtract',
  years: number,
  months: number,
  weeks: number,
  days: number
) {
  const d = parseIsoDate(startStr);
  const sign = operation === 'add' ? 1 : -1;
  d.setUTCFullYear(d.getUTCFullYear() + sign * Math.round(years));
  d.setUTCMonth(d.getUTCMonth() + sign * Math.round(months));
  d.setUTCDate(d.getUTCDate() + sign * (Math.round(weeks) * 7 + Math.round(days)));

  return {
    resultDate: formatUtcIso(d),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
    isLeapYear: isLeapYear(d.getUTCFullYear()),
  };
}

export function calculateIsoWeekNumber(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const isoYear = temp.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNumber = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const actualYear = date.getUTCFullYear();
  const actualYearStart = new Date(Date.UTC(actualYear, 0, 1, 12));
  const dayOfYear = Math.floor((date.getTime() - actualYearStart.getTime()) / 86400000) + 1;
  const totalDaysInYear = isLeapYear(actualYear) ? 366 : 365;
  const quarter = Math.floor(date.getUTCMonth() / 3) + 1;

  return {
    weekNumber,
    isoYear,
    dayOfYear,
    daysRemaining: totalDaysInYear - dayOfYear,
    quarter,
    isLeap: isLeapYear(actualYear),
    weekday: date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
  };
}

export function calculateTimeDuration(startIsoDateTime: string, endIsoDateTime: string) {
  const s = new Date(startIsoDateTime);
  const e = new Date(endIsoDateTime);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    throw new Error('Invalid date/time values');
  }
  const diffMs = Math.abs(e.getTime() - s.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalHours: diffMs / 3600000,
    totalMinutes: diffMs / 60000,
    totalSeconds,
    isNegative: e.getTime() < s.getTime(),
  };
}
