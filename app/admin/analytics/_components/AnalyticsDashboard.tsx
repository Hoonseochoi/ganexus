"use client";

import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RechartsLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);
const RechartsBarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false },
);
const RechartsPieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  { ssr: false },
);

// recharts 하위 컴포넌트들은 dynamic import 불필요 (차트 컴포넌트와 함께 번들됨)
import {
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type MonthlyLeaveData = { month: string; count: number };
type CategoryData = { category: string; count: number };
type EducationData = { month: string; total: number; attended: number };

type Props = {
  initialYear: number;
  initialMonth: number;
};

const CATEGORY_LABELS: Record<string, string> = {
  dealer: "대리점",
  internal: "사내",
  personal: "개인",
  leave: "월차",
  etc: "기타",
  education: "교육",
  vacation: "휴가",
  hq: "본사",
};

const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"];

function AnalyticsDashboardBase({ initialYear, initialMonth }: Props) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [monthlyLeave, setMonthlyLeave] = useState<MonthlyLeaveData[]>([]);
  const [categoryDist, setCategoryDist] = useState<CategoryData[]>([]);
  const [eduAttendance, setEduAttendance] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?year=${y}&month=${m}`);
      const data = await res.json() as {
        monthlyLeave?: MonthlyLeaveData[];
        categoryDistribution?: CategoryData[];
        educationAttendance?: EducationData[];
      };
      if (res.ok) {
        setMonthlyLeave(data.monthlyLeave ?? []);
        setCategoryDist(
          (data.categoryDistribution ?? []).map((d) => ({
            ...d,
            category: CATEGORY_LABELS[d.category] ?? d.category,
          })),
        );
        setEduAttendance(data.educationAttendance ?? []);
      }
    } catch {
      // 조회 실패 시 빈 데이터
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData(year, month);
  }, [year, month, fetchData]);

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-brand-gray">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 연도/월 선택 */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handlePrevYear}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
        >
          ◀
        </button>
        <span className="text-lg font-bold text-brand-black">{year}년</span>
        <button
          type="button"
          onClick={handleNextYear}
          className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
        >
          ▶
        </button>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="ml-4 px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월차 인원 추이 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-brand-black mb-4">월별 월차 현황</h3>
          {monthlyLeave.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLineChart data={monthlyLeave}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="월차 수"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-brand-gray py-10 text-center">데이터가 없습니다</p>
          )}
        </div>

        {/* 카테고리별 일정 분포 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-brand-black mb-4">
            {month}월 카테고리별 일정 분포
          </h3>
          {categoryDist.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={categoryDist}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryDist.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-brand-gray py-10 text-center">데이터가 없습니다</p>
          )}
        </div>

        {/* 교육 참석 현황 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
          <h3 className="text-sm font-bold text-brand-black mb-4">월별 교육 현황</h3>
          {eduAttendance.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsBarChart data={eduAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="전체 교육" fill="#3B82F6" />
                <Bar dataKey="attended" name="참석자 수" fill="#10B981" />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-brand-gray py-10 text-center">데이터가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}

const AnalyticsDashboard = memo(AnalyticsDashboardBase);
export default AnalyticsDashboard;
