import Link from "next/link";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { redirect } from "next/navigation";
import {
  listSchedulesForBranch,
  type ScheduleRow,
} from "@/src/lib/engines/schedules";
import LeftPanelBranchMembers from "./components/LeftPanelBranchMembers";
import LandingPage from "./components/LandingPage";
import AdminSettingsMenu from "./components/AdminSettingsMenu";
import CalendarPageClientShell from "./components/CalendarPageClientShell";
import { buildCalendarMonthData, getCalendarFetchRange } from "@/src/lib/calendar/month-view";

type SearchParamsShape = { year?: string; month?: string; date?: string };
type PageProps = { searchParams?: Promise<SearchParamsShape> };

function getKoreaNow(): Date {
  const now = new Date();
  const koreaString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  return new Date(koreaString);
}

export default async function Page({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return <LandingPage />;
  }

  if (user.role === "manager" && user.profile && !user.profile.is_approved) {
    redirect("/pending-approval");
  }

  const now = getKoreaNow();
  const params: SearchParamsShape = await searchParams?.catch((): SearchParamsShape => ({})) ?? {};
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) - 1 : now.getMonth();
  const selectedDateStr = params.date ?? null;

  let schedules: ScheduleRow[] = [];
  if (user?.profile?.branch_name) {
    const { from, to } = getCalendarFetchRange(year, month);
    schedules = await listSchedulesForBranch({
      branchName: user.profile.branch_name,
      from,
      to,
    });
  }
  const initialMonthData = buildCalendarMonthData({ year, month, schedules });

  const leftPanel = (
    <>
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
          <img
            src="/galenderciapp.png"
            alt="GALENDER 로고"
            className="h-10 w-auto"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight tracking-tight text-brand-black">
            GALENDER
          </h1>
          <p className="text-xs text-brand-gray font-medium">
            {user?.profile?.full_name
              ? `${user.profile.full_name}님, 환영합니다!`
              : "우리만의 GA 캘린더"}
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg transition-colors text-left">
          <span className="text-sm font-medium">MainCalender</span>
        </button>
        {user?.role === "admin" && (
          <AdminSettingsMenu />
        )}
        <LeftPanelBranchMembers />
        <div className="pt-4 border-t border-slate-100">
          <form
            action="/api/auth/logout"
            method="post"
            className="px-3"
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-brand-gray hover:bg-slate-50"
            >
              로그아웃
            </button>
          </form>
        </div>
      </nav>
    </>
  );

  return (
    <main className="h-screen bg-background-light">
      <CalendarPageClientShell
        leftPanel={leftPanel}
        initialMonthData={initialMonthData}
        initialSelectedDateStr={selectedDateStr}
        isAdmin={user?.role === "admin"}
        canAddSchedule={
          user?.role === "admin" ||
          user?.role === "manager" ||
          user?.role === "agent" ||
          user?.profile?.role === "manager" ||
          user?.profile?.role === "agent"
        }
        currentUserFullName={user?.profile?.full_name ?? null}
        branchName={user?.profile?.branch_name ?? null}
      />
    </main>
  );
}

