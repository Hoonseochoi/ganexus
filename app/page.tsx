import Link from "next/link";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { redirect } from "next/navigation";
import {
  listSchedulesForBranch,
  type ScheduleRow,
} from "@/src/lib/engines/schedules";
import { getHolidays } from "korean-holidays";
import RightPanel from "./components/RightPanel";
import CalendarCellDropZone from "./components/CalendarCellDropZone";
import DesktopShell, { DesktopShellHamburger } from "./components/DesktopShell";
import CalendarMonthNav from "./components/CalendarMonthNav";

type CalendarCell = {
  key: number;
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isHoliday: boolean;
};

type PageProps = { searchParams?: Promise<{ year?: string; month?: string }> };

export default async function Page({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (user?.role === "agent" && user.profile && !user.profile.is_approved) {
    redirect("/pending-approval");
  }

  const now = new Date();
  const params = await searchParams?.catch(() => ({})) ?? {};
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) - 1 : now.getMonth();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();

  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0=Sun
  const lastDate = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + lastDate) / 7) * 7;

  const mobileMonthLabel = new Date(year, month + 1, 0).toLocaleString("ko-KR", {
    month: "long",
    year: "numeric",
  });

  // 공휴일 계산 (해당 연도 전체)
  const holidaysForYear = getHolidays(year);
  const holidaySet = new Set(
    holidaysForYear.map((h) =>
      h.date.toISOString().slice(0, 10),
    ),
  );

  // 일정 조회 (현재 달 범위만)
  let schedules: ScheduleRow[] = [];
  if (user?.profile?.branch_name) {
    const startOfMonthISO = new Date(year, month, 1).toISOString();
    const endOfMonthISO = new Date(
      year,
      month + 1,
      0,
      23,
      59,
      59,
    ).toISOString();
    schedules = await listSchedulesForBranch({
      branchName: user.profile.branch_name,
      from: startOfMonthISO,
      to: endOfMonthISO,
    });
  }

  const eventsByDay = new Map<number, ScheduleRow[]>();
  for (const s of schedules) {
    const d = new Date(s.start_at);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay.has(day)) eventsByDay.set(day, []);
      eventsByDay.get(day)!.push(s);
    }
  }

  const calendarCells: CalendarCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - firstWeekday + 1;
    if (dayNumber < 1 || dayNumber > lastDate) {
      calendarCells.push({
        key: i,
        day: null,
        date: null,
        isToday: false,
        isSunday: false,
        isSaturday: false,
        isHoliday: false,
      });
      continue;
    }

    const date = new Date(year, month, dayNumber);
    const weekday = date.getDay();
    const iso = date.toISOString().slice(0, 10);
    const isHoliday = holidaySet.has(iso);

    calendarCells.push({
      key: i,
      day: dayNumber,
      date,
      isToday: year === todayYear && month === todayMonth && dayNumber === todayDate,
      isSunday: weekday === 0,
      isSaturday: weekday === 6,
      isHoliday,
    });
  }

  const leftPanel = (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="text-sm font-bold">GA</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight tracking-tight text-brand-black">
            GA_NEXUS
          </h1>
          <p className="text-xs text-brand-gray font-medium">
            Management Portal
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-brand-gray hover:bg-slate-50 rounded-lg transition-colors text-left">
          <span className="text-sm font-medium">Dashboard</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors text-left">
          <span className="text-sm font-medium">Main Calendar</span>
        </button>
        <Link
          href="/admin/branch"
          className="w-full flex items-center gap-3 px-3 py-2 text-brand-gray hover:bg-slate-50 rounded-lg transition-colors text-left"
        >
          <span className="text-sm font-medium">지점 정보 설정</span>
        </Link>
        <Link
          href="/admin/approvals"
          className="w-full flex items-center gap-3 px-3 py-2 text-brand-gray hover:bg-slate-50 rounded-lg transition-colors text-left"
        >
          <span className="text-sm font-medium">에이전트 승인</span>
        </Link>
        <div className="pt-8 pb-2">
          <h3 className="px-3 text-[10px] uppercase font-bold tracking-wider text-brand-gray mb-4">
            Branch Members
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 px-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-brand-black">
                  Sarah Chen
                </p>
                <p className="text-xs text-brand-gray">In Office</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-brand-black">
                  Marcus Jordan
                </p>
                <p className="text-xs text-brand-gray">On Break</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-300 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-brand-black">
                  Elena Rodriguez
                </p>
                <p className="text-xs text-slate-500">Offline</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );

  return (
    <main className="h-screen bg-background-light">
      {/* 데스크탑: 좌측 패널 오버레이(기본 숨김) + 캘린더 확장 */}
      <div className="hidden lg:flex h-full overflow-hidden">
        <DesktopShell leftPanel={leftPanel}>
          <>
          {/* Main Calendar */}
          <section className="flex-1 overflow-y-auto flex flex-col min-w-0">
            <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 bg-background-light z-10 bg-opacity-95 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <DesktopShellHamburger />
                <CalendarMonthNav year={year} month={month} />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    className="pl-3 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary w-44 max-w-[180px] text-brand-gray placeholder:text-brand-gray/60"
                    placeholder="Search events..."
                    type="text"
                  />
                </div>
              </div>
            </header>

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => {
                const color =
                  idx === 0
                    ? "text-red-500"
                    : idx === 6
                      ? "text-blue-500"
                      : "text-slate-400";
                return (
                  <div
                    key={d}
                    className={`py-3 text-center text-xs font-bold uppercase ${color}`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7 flex-1">
              {calendarCells.map((cell) => {
                const events =
                  cell.day !== null ? eventsByDay.get(cell.day) ?? [] : [];
                const isRed = cell.isSunday || cell.isHoliday;
                const isBlue = cell.isSaturday && !cell.isHoliday;

                let dayColor = "text-slate-800";
                let dayWeight = "font-normal";

                if (cell.isToday) {
                  dayColor = "text-brand-black";
                  dayWeight = "font-bold";
                } else {
                  if (isRed) dayColor = "text-red-500";
                  else if (isBlue) dayColor = "text-blue-500";
                }

                return (
                  <CalendarCellDropZone
                    key={cell.key}
                    dateISO={
                      cell.date ? cell.date.toISOString().slice(0, 10) : null
                    }
                    isEmpty={cell.day === null}
                    className={`p-2 min-h-[120px] ${
                      cell.isToday
                        ? "border-2 border-primary bg-primary/5 relative"
                        : "border border-slate-100"
                    }`}
                  >
                    <span className={`text-sm ${dayWeight} ${dayColor}`}>
                      {cell.day ?? ""}
                    </span>
                    {cell.day !== null && events.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {events.slice(0, 3).map((ev) => (
                          <div
                            key={ev.id}
                            className="text-[10px] p-1.5 bg-primary/5 border-l-2 border-primary text-slate-700 rounded truncate"
                          >
                            {ev.title}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-[9px] text-brand-gray">
                            + {events.length - 3}개 더보기
                          </div>
                        )}
                      </div>
                    )}
                  </CalendarCellDropZone>
                );
              })}
            </div>
          </div>
        </div>
        </section>

            {/* Right Panel: 오늘 일정 · 메모 · 공지 (실제 오늘 날짜 기준) */}
            <RightPanel
              todaySchedules={(year === todayYear && month === todayMonth ? eventsByDay.get(todayDate) ?? [] : []).map((s) => ({
                id: s.id,
                title: s.title,
                description: s.description,
                start_at: s.start_at,
                end_at: s.end_at,
                is_all_day: s.is_all_day,
                category: s.category,
              }))}
              isAdmin={user?.role === "admin"}
            />
          </>
        </DesktopShell>
      </div>

      {/* 모바일: 달력 고정 + 좌/우 패널 슬라이드 */}
      <div className="flex lg:hidden h-full flex-col">
        {/* 상단 헤더 */}
        <header className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
              GA
            </div>
            <div>
              <p className="text-[11px] text-brand-gray font-medium">
                Management Portal
              </p>
              <p className="text-sm font-semibold text-brand-black">
                Main Calendar
              </p>
            </div>
          </div>
        </header>

        {/* 중앙: 달력 고정 */}
        <section className="px-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="text-[11px] text-brand-gray font-medium">
                {mobileMonthLabel}
              </p>
              <button className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] text-brand-gray font-semibold">
                Today
              </button>
            </div>
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {["일", "월", "화", "수", "목", "금", "토"].map((d, idx) => {
                const color =
                  idx === 0
                    ? "text-red-500"
                    : idx === 6
                      ? "text-blue-500"
                      : "text-slate-400";
                return (
                  <div
                    key={`${d}-${idx}`}
                    className={`py-2 text-center text-[10px] font-bold uppercase ${color}`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7">
              {calendarCells.map((cell) => {
                const events =
                  cell.day !== null ? eventsByDay.get(cell.day) ?? [] : [];

                const isRed = cell.isSunday || cell.isHoliday;
                const isBlue = cell.isSaturday && !cell.isHoliday;

                let dayColor = "text-slate-800";
                let dayWeight = "font-normal";

                if (cell.isToday) {
                  dayColor = "text-brand-black";
                  dayWeight = "font-bold";
                } else {
                  if (isRed) dayColor = "text-red-500";
                  else if (isBlue) dayColor = "text-blue-500";
                }

                return (
                  <CalendarCellDropZone
                    key={cell.key}
                    dateISO={
                      cell.date ? cell.date.toISOString().slice(0, 10) : null
                    }
                    isEmpty={cell.day === null}
                    className={`p-1.5 min-h-[70px] ${
                      cell.isToday
                        ? "border-2 border-primary bg-primary/5 relative"
                        : "border border-slate-100"
                    }`}
                  >
                    <span
                      className={`text-[11px] ${dayWeight} ${dayColor}`}
                    >
                      {cell.day ?? ""}
                    </span>
                    {cell.day !== null && events.length > 0 && (
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 2).map((ev) => (
                          <div
                            key={ev.id}
                            className="text-[9px] px-1.5 py-1 bg-primary/5 border-l-2 border-primary text-slate-700 rounded truncate"
                          >
                            {ev.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-[9px] text-brand-gray">
                            + {events.length - 2}개
                          </div>
                        )}
                      </div>
                    )}
                  </CalendarCellDropZone>
                );
              })}
            </div>
          </div>
        </section>

        {/* 하단: 좌/우 패널 슬라이드 영역 */}
        <section className="mt-4 flex-1">
          <div className="px-4 text-[11px] text-brand-gray mb-1">
            좌·우로 넘겨 멤버 / 인사이트를 확인하세요.
          </div>
          <div className="flex gap-4 px-4 pb-4 overflow-x-auto snap-x snap-mandatory">
            {/* Left panel 내용 - Branch Members */}
            <div className="min-w-[85vw] snap-center bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="text-sm font-bold mb-3 text-brand-black">
                Branch Members
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">
                      Sarah Chen
                    </p>
                    <p className="text-[11px] text-brand-gray">In Office</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">
                      Marcus Jordan
                    </p>
                    <p className="text-[11px] text-brand-gray">On Break</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-200" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-slate-300 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-black">
                      Elena Rodriguez
                    </p>
                    <p className="text-[11px] text-brand-gray">Offline</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel - 오늘 일정 · 메모 · 공지 (동일 구조) */}
            <div className="min-w-[85vw] snap-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <RightPanel
                todaySchedules={(eventsByDay.get(todayDate) ?? []).map((s) => ({
                  id: s.id,
                  title: s.title,
                  description: s.description,
                  start_at: s.start_at,
                  end_at: s.end_at,
                  is_all_day: s.is_all_day,
                  category: s.category,
                }))}
                isAdmin={user?.role === "admin"}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

