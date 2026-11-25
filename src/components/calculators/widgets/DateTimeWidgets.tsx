import { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import {
  addSubtractCalendarDate,
  addWorkingDays,
  calculateAge,
  calculateBusinessDays,
  calculateCalendarYMD,
  calculateIsoWeekNumber,
  calculateTimeDuration,
} from '../../../lib/calculators/dateTime.ts';
import {
  CalcSplitLayout,
  ErrorAlert,
  FieldLabel,
  NumberInput,
  ResultHero,
  SegmentedControl,
  SelectInput,
  StatTile,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <input
        type="date"
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
      />
    </div>
  );
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const TIME_ZONES = [
  { value: 'America/New_York', label: 'New York (Eastern Time)' },
  { value: 'America/Chicago', label: 'Chicago (Central Time)' },
  { value: 'America/Denver', label: 'Denver (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific Time)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/London', label: 'London (GMT / BST)' },
  { value: 'Europe/Paris', label: 'Paris / Berlin (CET / CEST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai / New Delhi (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST / AEDT)' },
];

export function DateTimeWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  const [dob, setDob] = useState('1995-06-15');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(todayIso());
  const [includeEnd, setIncludeEnd] = useState(false);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [workDaysDelta, setWorkDaysDelta] = useState('10');

  const [addOp, setAddOp] = useState<'add' | 'subtract'>('add');
  const [addYears, setAddYears] = useState('0');
  const [addMonths, setAddMonths] = useState('3');
  const [addWeeks, setAddWeeks] = useState('0');
  const [addDays, setAddDays] = useState('15');

  const [startDT, setStartDT] = useState(`${todayIso()}T09:00`);
  const [endDT, setEndDT] = useState(`${todayIso()}T17:30`);

  const [eventName, setEventName] = useState('New Year 2027');
  const [targetDT, setTargetDT] = useState('2027-01-01T00:00');
  const [nowMs, setNowMs] = useState(() => Date.now());

  const [srcZone, setSrcZone] = useState('America/New_York');
  const [dstZone, setDstZone] = useState('Europe/London');
  const [tzDate, setTzDate] = useState(todayIso());
  const [tzTime, setTzTime] = useState('09:00');

  useEffect(() => {
    if (slug !== 'countdown-calculator') return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [slug]);

  if (slug === 'age-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateAge> | null = null;
    try {
      res = calculateAge(dob, endDate);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid dates';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <DateInput label="Date of Birth" value={dob} onChange={setDob} />
            <DateInput label="Target / As-Of Date" value={endDate} onChange={setEndDate} />
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label="Exact Chronological Age"
                value={
                  isAr
                    ? `${res.years} سنة، ${res.months} شهر، ${res.days} يوم`
                    : `${res.years} yrs, ${res.months} mos, ${res.days} days`
                }
                subtext={
                  isAr
                    ? `وُلد يوم ${res.weekdayBorn} · عيد الميلاد القادم خلال ${res.daysUntilNextBirthday} يوماً`
                    : `Born on a ${res.weekdayBorn} · Next birthday in ${res.daysUntilNextBirthday} days`
                }
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatTile label="Total Days" value={fmtNum(res.totalDays, 0)} />
                <StatTile label="Total Weeks" value={fmtNum(res.totalWeeks, 0)} />
                <StatTile label="Total Hours" value={fmtNum(res.totalHours, 0)} />
              </div>
              <ResultActions
                copyText={`Age: ${res.years} years, ${res.months} months, ${res.days} days (${res.totalDays} total days)`}
                onReset={() => {
                  setDob('1995-06-15');
                  setEndDate(todayIso());
                }}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'date-difference-calculator' || slug === 'days-between-dates-calculator') {
    let err: string | null = null;
    let diff: ReturnType<typeof calculateCalendarYMD> | null = null;
    let biz: ReturnType<typeof calculateBusinessDays> | null = null;
    try {
      diff = calculateCalendarYMD(startDate, endDate);
      biz = calculateBusinessDays(startDate, endDate, false, includeEnd);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid dates';
    }
    const totalDays = diff ? diff.totalDays + (includeEnd ? 1 : 0) : 0;
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    return (
      <CalcSplitLayout
        inputs={
          <>
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />
            <label className="flex items-center gap-2 text-sm text-[#1E293B] pt-1">
              <input
                type="checkbox"
                checked={includeEnd}
                onChange={(e) => setIncludeEnd(e.target.checked)}
                className="rounded border-[#CBD5E1] text-[#2563EB]"
              />
              <span>{isAr ? 'تضمين تاريخ النهاية (+1 يوم)' : 'Include end date (+1 day)'}</span>
            </label>
          </>
        }
        results={
          err || !diff || !biz ? (
            <ErrorAlert message={err || 'Invalid date input'} />
          ) : (
            <>
              <ResultHero
                label={slug === 'days-between-dates-calculator' ? 'Total Days Between Dates' : 'Calendar Difference'}
                value={
                  slug === 'days-between-dates-calculator'
                    ? isAr
                      ? `${fmtNum(totalDays, 0)} يوماً`
                      : `${fmtNum(totalDays, 0)} days`
                    : isAr
                    ? `${diff.years} سنة ${diff.months} شهر ${diff.days} يوم`
                    : `${diff.years}y ${diff.months}m ${diff.days}d`
                }
                subtext={
                  isAr
                    ? `${weeks} أسبوعاً و ${remDays} أيام · ${biz.businessDays} يوم عمل`
                    : `${weeks} weeks and ${remDays} days · ${biz.businessDays} weekdays`
                }
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatTile label="Total Calendar Days" value={fmtNum(totalDays, 0)} />
                <StatTile label="Weekdays (Mon–Fri)" value={fmtNum(biz.businessDays, 0)} />
                <StatTile label="Total Hours" value={fmtNum(totalDays * 24, 0)} />
              </div>
              <ResultActions
                copyText={`Difference between ${startDate} and ${endDate}: ${totalDays} days (${diff.years}y ${diff.months}m ${diff.days}d)`}
                onReset={() => {
                  setStartDate('2026-01-01');
                  setEndDate(todayIso());
                  setIncludeEnd(false);
                }}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'time-duration-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateTimeDuration> | null = null;
    try {
      res = calculateTimeDuration(startDT, endDT);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid timestamps';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <div>
              <FieldLabel label="Start Date & Time" />
              <input
                type="datetime-local"
                dir="ltr"
                value={startDT}
                onChange={(e) => setStartDT(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
            <div>
              <FieldLabel label="End Date & Time" />
              <input
                type="datetime-local"
                dir="ltr"
                value={endDT}
                onChange={(e) => setEndDT(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid date/time'} />
          ) : (
            <>
              <ResultHero
                label="Elapsed Time Duration"
                value={`${res.days > 0 ? `${res.days}d ` : ''}${res.hours}h ${res.minutes}m ${res.seconds}s`}
                subtext={
                  res.isNegative
                    ? isAr
                      ? 'وقت النهاية أسبق من وقت البداية'
                      : 'End timestamp is earlier than start timestamp'
                    : undefined
                }
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatTile label="Decimal Hours" value={`${res.totalHours.toFixed(4)} ${isAr ? 'ساعة' : 'hrs'}`} />
                <StatTile label="Total Minutes" value={fmtNum(res.totalMinutes, 2)} />
                <StatTile label="Total Seconds" value={fmtNum(res.totalSeconds, 0)} />
              </div>
              <ResultActions
                copyText={`Duration: ${res.days}d ${res.hours}h ${res.minutes}m (${res.totalHours.toFixed(2)} decimal hours)`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'business-days-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateBusinessDays> | null = null;
    try {
      res = calculateBusinessDays(startDate, endDate, excludeHolidays, includeEnd);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid dates';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <DateInput label="End Date" value={endDate} onChange={setEndDate} />
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-sm text-[#1E293B]">
                <input
                  type="checkbox"
                  checked={excludeHolidays}
                  onChange={(e) => setExcludeHolidays(e.target.checked)}
                />
                <span>{isAr ? 'استبعاد العطلات الفيدرالية الأمريكية' : 'Exclude US Federal Holidays'}</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-[#1E293B]">
                <input
                  type="checkbox"
                  checked={includeEnd}
                  onChange={(e) => setIncludeEnd(e.target.checked)}
                />
                <span>{isAr ? 'تضمين تاريخ النهاية' : 'Include end date'}</span>
              </label>
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid dates'} />
          ) : (
            <>
              <ResultHero
                label="Business / Working Days"
                value={isAr ? `${fmtNum(res.businessDays, 0)} يوم عمل` : `${fmtNum(res.businessDays, 0)} business days`}
                subtext={
                  isAr
                    ? `من أصل ${res.totalDays} يوماً تقويمياً`
                    : `Out of ${res.totalDays} total calendar days`
                }
              />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Total Days" value={fmtNum(res.totalDays, 0)} />
                <StatTile label="Weekend Days" value={fmtNum(res.weekendDays, 0)} />
                <StatTile label="Holidays Skipped" value={fmtNum(res.holidayDays, 0)} />
              </div>
              <ResultActions
                copyText={`Business days (${startDate} to ${endDate}): ${res.businessDays} business days`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'countdown-calculator') {
    const targetMs = new Date(targetDT).getTime();
    const valid = Number.isFinite(targetMs);
    const diffMs = valid ? targetMs - nowMs : 0;
    const isPast = diffMs < 0;
    const absSec = Math.floor(Math.abs(diffMs) / 1000);
    const d = Math.floor(absSec / 86400);
    const h = Math.floor((absSec % 86400) / 3600);
    const m = Math.floor((absSec % 3600) / 60);
    const s = absSec % 60;

    return (
      <CalcSplitLayout
        inputs={
          <>
            <div>
              <FieldLabel label="Event Name" />
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#0F172A]"
              />
            </div>
            <div>
              <FieldLabel label="Target Date & Time" />
              <input
                type="datetime-local"
                dir="ltr"
                value={targetDT}
                onChange={(e) => setTargetDT(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
          </>
        }
        results={
          valid ? (
            <>
              <ResultHero
                label={
                  isPast
                    ? isAr
                      ? `الوقت المنقضي منذ ${eventName || 'المناسبة'}`
                      : `Time Elapsed Since ${eventName || 'Event'}`
                    : isAr
                    ? `الوقت المتبقي حتى ${eventName || 'المناسبة'}`
                    : `Time Until ${eventName || 'Event'}`
                }
                value={`${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`}
                accent={isPast ? 'slate' : 'blue'}
              />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Total Days" value={(absSec / 86400).toFixed(2)} />
                <StatTile label="Total Hours" value={fmtNum(Math.floor(absSec / 3600), 0)} />
                <StatTile label="Total Minutes" value={fmtNum(Math.floor(absSec / 60), 0)} />
              </div>
            </>
          ) : (
            <ErrorAlert message="Select a valid target date and time." />
          )
        }
      />
    );
  }

  if (slug === 'working-days-calculator') {
    const delta = parseInt(workDaysDelta, 10);
    let err: string | null = null;
    let res: ReturnType<typeof addWorkingDays> | null = null;
    if (!Number.isFinite(delta)) err = 'Enter an integer number of working days.';
    else {
      try {
        res = addWorkingDays(startDate, delta, excludeHolidays);
      } catch (e) {
        err = e instanceof Error ? e.message : 'Invalid input';
      }
    }

    return (
      <CalcSplitLayout
        inputs={
          <>
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <NumberInput
              label="Working Days to Add / Subtract"
              hint="Use negative to subtract"
              value={workDaysDelta}
              onChange={setWorkDaysDelta}
              step={1}
            />
            <label className="flex items-center gap-2 text-sm text-[#1E293B] pt-1">
              <input
                type="checkbox"
                checked={excludeHolidays}
                onChange={(e) => setExcludeHolidays(e.target.checked)}
              />
              <span>{isAr ? 'تخطي العطلات الفيدرالية الأمريكية' : 'Skip US Federal Holidays'}</span>
            </label>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label="Resulting Target Business Date"
                value={res.resultDate}
                subtext={
                  isAr
                    ? `${res.weekday} · إجمالي الأيام المنقضية: ${res.calendarDaysElapsed} يوماً`
                    : `${res.weekday} · ${res.calendarDaysElapsed} total calendar days elapsed`
                }
              />
              <ResultActions
                copyText={`${startDate} + (${delta} working days) = ${res.resultDate} (${res.weekday})`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'date-add-subtract-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof addSubtractCalendarDate> | null = null;
    try {
      res = addSubtractCalendarDate(
        startDate,
        addOp,
        parseFloat(addYears) || 0,
        parseFloat(addMonths) || 0,
        parseFloat(addWeeks) || 0,
        parseFloat(addDays) || 0
      );
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid date';
    }

    return (
      <CalcSplitLayout
        inputs={
          <>
            <DateInput label="Start Date" value={startDate} onChange={setStartDate} />
            <SegmentedControl
              label="Operation"
              value={addOp}
              onChange={setAddOp}
              options={[
                { value: 'add', label: 'Add (+)' },
                { value: 'subtract', label: 'Subtract (−)' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberInput label="Years" value={addYears} onChange={setAddYears} min={0} />
              <NumberInput label="Months" value={addMonths} onChange={setAddMonths} min={0} />
              <NumberInput label="Weeks" value={addWeeks} onChange={setAddWeeks} min={0} />
              <NumberInput label="Days" value={addDays} onChange={setAddDays} min={0} />
            </div>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid date'} />
          ) : (
            <>
              <ResultHero
                label="Resulting Calendar Date"
                value={res.resultDate}
                subtext={`${res.weekday} · ${
                  res.isLeapYear
                    ? isAr
                      ? 'سنة كبيسة'
                      : 'Leap year'
                    : isAr
                    ? 'سنة بسيطة (365 يوماً)'
                    : 'Common 365-day year'
                }`}
              />
              <ResultActions copyText={`Result Date: ${res.resultDate} (${res.weekday})`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'week-number-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof calculateIsoWeekNumber> | null = null;
    try {
      res = calculateIsoWeekNumber(endDate);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid date';
    }

    return (
      <CalcSplitLayout
        inputs={<DateInput label="Selected Date" value={endDate} onChange={setEndDate} />}
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid date'} />
          ) : (
            <>
              <ResultHero
                label="ISO-8601 Week Number"
                value={
                  isAr
                    ? `الأسبوع ${res.weekNumber} (${res.isoYear}-W${String(res.weekNumber).padStart(2, '0')})`
                    : `Week ${res.weekNumber} (${res.isoYear}-W${String(res.weekNumber).padStart(2, '0')})`
                }
                subtext={isAr ? `${res.weekday} · الربع ${res.quarter}` : `${res.weekday} · Quarter ${res.quarter}`}
              />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Day of Year" value={`${res.dayOfYear}`} />
                <StatTile label="Days Remaining" value={`${res.daysRemaining}`} />
                <StatTile
                  label="Leap Year?"
                  value={res.isLeap ? (isAr ? 'نعم (366ي)' : 'Yes (366d)') : isAr ? 'لا (365ي)' : 'No (365d)'}
                />
              </div>
              <ResultActions
                copyText={`${endDate}: ISO Week ${res.weekNumber} (${res.isoYear}), Day ${res.dayOfYear} of year`}
              />
            </>
          )
        }
      />
    );
  }

  // Time Zone Converter
  const tzResult = useMemo(() => {
    try {
      // Interpret tzDate + tzTime in srcZone using iterative Intl offset resolution
      const [y, m, d] = tzDate.split('-').map(Number);
      const [hh, mm] = tzTime.split(':').map(Number);
      if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
      const utcGuess = Date.UTC(y, m - 1, d, hh, mm, 0);

      const getZoneParts = (ms: number, tz: string) => {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).formatToParts(new Date(ms));
        const val = (type: string) => Number(parts.find((p) => p.type === type)?.value || '0');
        return Date.UTC(val('year'), val('month') - 1, val('day'), val('hour') % 24, val('minute'), 0);
      };

      const guessInSrc = getZoneParts(utcGuess, srcZone);
      const exactUtcMs = utcGuess - (guessInSrc - utcGuess);
      const instant = new Date(exactUtcMs);

      const formatInZone = (tz: string) =>
        new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }).format(instant);

      return {
        sourceFormatted: formatInZone(srcZone),
        targetFormatted: formatInZone(dstZone),
        worldClocks: ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'].map(
          (tz) => ({
            tz: TIME_ZONES.find((z) => z.value === tz)?.label || tz,
            formatted: formatInZone(tz),
          })
        ),
      };
    } catch {
      return null;
    }
  }, [tzDate, tzTime, srcZone, dstZone]);

  return (
    <CalcSplitLayout
      inputs={
        <>
          <div className="grid grid-cols-2 gap-3">
            <DateInput label="Date" value={tzDate} onChange={setTzDate} />
            <div>
              <FieldLabel label="Time (24h)" />
              <input
                type="time"
                dir="ltr"
                value={tzTime}
                onChange={(e) => setTzTime(e.target.value)}
                className="w-full h-10 rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm tabular-nums"
              />
            </div>
          </div>
          <SelectInput label="Source Time Zone" value={srcZone} onChange={setSrcZone} options={TIME_ZONES} />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSrcZone(dstZone);
                setDstZone(srcZone);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-xs font-medium text-[#475569]"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isAr ? 'تبديل المناطق الزمنية' : 'Swap Time Zones'}</span>
            </button>
          </div>
          <SelectInput label="Target Time Zone" value={dstZone} onChange={setDstZone} options={TIME_ZONES} />
        </>
      }
      results={
        tzResult ? (
          <>
            <ResultHero
              label={`Converted Time (${dstZone})`}
              value={tzResult.targetFormatted}
              subtext={`${isAr ? 'المصدر:' : 'Source:'} ${tzResult.sourceFormatted}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tzResult.worldClocks.map((c) => (
                <StatTile key={c.tz} label={c.tz} value={c.formatted} />
              ))}
            </div>
            <ResultActions copyText={`${tzResult.sourceFormatted} = ${tzResult.targetFormatted}`} />
          </>
        ) : (
          <ErrorAlert message="Enter a valid date and time." />
        )
      }
    />
  );
}
