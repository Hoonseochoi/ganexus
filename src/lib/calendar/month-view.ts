import { getHolidays } from "korean-holidays";
import type { ScheduleRow } from "@/src/lib/engines/schedules";

export type CalendarCellData = {
  key: number;
  day: number | null;
  dateISO: string | null;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isHoliday: boolean;
};

export type CalendarScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  dealer_name?: string | null;
  location?: string | null;
  instructor?: string | null;
  target_audience?: string | null;
  manager_name?: string | null;
  is_soft_deleted?: boolean;
  is_private?: boolean;
  recurrence_rule?: string | null;
  is_recurring?: boolean;
  creator_full_name?: string | null;
  creator_avatar_url?: string | null;
  target_full_name?: string | null;
  target_avatar_url?: string | null;
  instructor_color?: string | null;
};

export type CalendarMonthData = {
  year: number;
  month: number;
  todayStr: string;
  mobileMonthLabel: string;
  cells: CalendarCellData[];
  eventsByDay: Record<string, CalendarScheduleItem[]>;
  eventsByDateStr: Record<string, CalendarScheduleItem[]>;
};

function getKoreaNow(): Date {
  const now = new Date();
  const koreaString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  return new Date(koreaString);
}

function getKoreaDateFromISO(iso: string): Date {
  const date = new Date(iso);
  const koreaString = date.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  return new Date(koreaString);
}

export function getCalendarFetchRange(year: number, month: number): { from: string; to: string } {
  const fromDate = new Date(year, month, 1);
  fromDate.setDate(fromDate.getDate() - 7);

  const toDate = new Date(year, month + 1, 0, 23, 59, 59);
  toDate.setDate(toDate.getDate() + 7);

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
}

function mapScheduleItem(schedule: ScheduleRow): CalendarScheduleItem {
  return {
    id: schedule.id,
    title: schedule.title,
    description: schedule.description,
    start_at: schedule.start_at,
    end_at: schedule.end_at,
    is_all_day: schedule.is_all_day,
    category: schedule.category,
    dealer_name: schedule.dealer_name ?? null,
    location: schedule.location ?? null,
    instructor: schedule.instructor ?? null,
    target_audience: schedule.target_audience ?? null,
    manager_name: schedule.manager_name ?? null,
    is_soft_deleted: schedule.is_soft_deleted ?? false,
    is_private: schedule.is_private ?? false,
    recurrence_rule: schedule.recurrence_rule ?? null,
    is_recurring: !!schedule.recurrence_rule,
    creator_full_name: schedule.creator_full_name ?? null,
    creator_avatar_url: schedule.creator_avatar_url ?? null,
    target_full_name: schedule.target_full_name ?? null,
    target_avatar_url: schedule.target_avatar_url ?? null,
    instructor_color: schedule.instructor_color ?? null,
  };
}

export function buildCalendarMonthData(args: {
  year: number;
  month: number;
  schedules: ScheduleRow[];
}): CalendarMonthData {
  const { year, month, schedules } = args;
  const now = getKoreaNow();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();
  const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, "0")}-${String(todayDate).padStart(2, "0")}`;
  const lastDate = new Date(year, month + 1, 0).getDate();

  const mobileMonthLabel = new Date(year, month + 1, 0).toLocaleString("ko-KR", {
    month: "long",
    year: "numeric",
  });

  const holidaysForYear = getHolidays(year);
  const holidaySet = new Set(
    holidaysForYear.map((holiday) => holiday.date.toISOString().slice(0, 10)),
  );

  const uniqueSchedules: ScheduleRow[] = [];
  const seenScheduleIds = new Set<string>();
  for (const schedule of schedules) {
    if (seenScheduleIds.has(schedule.id)) continue;
    seenScheduleIds.add(schedule.id);
    uniqueSchedules.push(schedule);
  }

  const eventsByDay = new Map<number, CalendarScheduleItem[]>();
  const eventsByDateStr: Record<string, CalendarScheduleItem[]> = {};

  for (const schedule of uniqueSchedules) {
    const date = getKoreaDateFromISO(schedule.start_at);
    if (date.getFullYear() !== year || date.getMonth() !== month) continue;

    const day = date.getDate();
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const item = mapScheduleItem(schedule);

    if (!eventsByDay.has(day)) eventsByDay.set(day, []);
    eventsByDay.get(day)!.push(item);

    if (!eventsByDateStr[iso]) eventsByDateStr[iso] = [];
    eventsByDateStr[iso].push(item);
  }

  const daysToShow: number[] = [];
  for (let day = 1; day <= lastDate; day++) {
    const weekday = new Date(year, month, day).getDay();
    if (weekday >= 1 && weekday <= 5) daysToShow.push(day);
  }

  const firstWeekdayInMonth = daysToShow.length
    ? new Date(year, month, daysToShow[0]).getDay()
    : 1;
  const offset = firstWeekdayInMonth - 1;
  const totalCells = Math.ceil((offset + daysToShow.length) / 5) * 5;

  const cells: CalendarCellData[] = [];
  let key = 0;
  for (let index = 0; index < offset; index++) {
    cells.push({
      key: key++,
      day: null,
      dateISO: null,
      isToday: false,
      isSunday: false,
      isSaturday: false,
      isHoliday: false,
    });
  }

  for (const dayNumber of daysToShow) {
    const date = new Date(year, month, dayNumber);
    const weekday = date.getDay();
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

    cells.push({
      key: key++,
      day: dayNumber,
      dateISO: iso,
      isToday: year === todayYear && month === todayMonth && dayNumber === todayDate,
      isSunday: weekday === 0,
      isSaturday: weekday === 6,
      isHoliday: holidaySet.has(iso),
    });
  }

  for (let index = offset + daysToShow.length; index < totalCells; index++) {
    cells.push({
      key: key++,
      day: null,
      dateISO: null,
      isToday: false,
      isSunday: false,
      isSaturday: false,
      isHoliday: false,
    });
  }

  return {
    year,
    month,
    todayStr,
    mobileMonthLabel,
    cells,
    eventsByDay: Object.fromEntries(
      Array.from(eventsByDay.entries()).map(([day, list]) => [String(day), list]),
    ),
    eventsByDateStr,
  };
}