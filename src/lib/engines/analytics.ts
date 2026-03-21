import { query } from "./db";
import { getTenantSchemaForBranch } from "./tenant";

/** 월별 월차(leave) 카운트 */
export async function getMonthlyLeaveStats(
  branchName: string,
  year: number,
): Promise<{ month: string; count: number }[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  const rows = await query<{ month: string; count: string }>(
    `SELECT TO_CHAR(start_at, 'YYYY-MM') AS month, COUNT(*)::text AS count
     FROM ${schema}.schedules
     WHERE branch_name = $1
       AND EXTRACT(YEAR FROM start_at) = $2
       AND category IN ('leave', 'vacation')
       AND is_soft_deleted IS NOT TRUE
     GROUP BY TO_CHAR(start_at, 'YYYY-MM')
     ORDER BY month`,
    [branchName, year],
  );
  return rows.map((r) => ({ month: r.month, count: Number(r.count) }));
}

/** 해당 월 카테고리별 일정 수 */
export async function getCategoryDistribution(
  branchName: string,
  year: number,
  month: number,
): Promise<{ category: string; count: number }[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  const rows = await query<{ category: string; count: string }>(
    `SELECT category, COUNT(*)::text AS count
     FROM ${schema}.schedules
     WHERE branch_name = $1
       AND EXTRACT(YEAR FROM start_at) = $2
       AND EXTRACT(MONTH FROM start_at) = $3
       AND is_soft_deleted IS NOT TRUE
     GROUP BY category
     ORDER BY count DESC`,
    [branchName, year, month],
  );
  return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
}

/** 월별 교육(dealer+internal) 건수 */
export async function getEducationAttendance(
  branchName: string,
  year: number,
): Promise<{ month: string; total: number; attended: number }[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  const rows = await query<{ month: string; total: string; attended: string }>(
    `SELECT
       TO_CHAR(s.start_at, 'YYYY-MM') AS month,
       COUNT(s.id)::text AS total,
       COALESCE(SUM(
         CASE WHEN sp.id IS NOT NULL THEN 1 ELSE 0 END
       ), 0)::text AS attended
     FROM ${schema}.schedules s
     LEFT JOIN public.schedule_participants sp ON s.id = sp.schedule_id AND sp.status = 'attending'
     WHERE s.branch_name = $1
       AND EXTRACT(YEAR FROM s.start_at) = $2
       AND s.category IN ('dealer', 'internal', 'education', 'hq')
       AND s.is_soft_deleted IS NOT TRUE
     GROUP BY TO_CHAR(s.start_at, 'YYYY-MM')
     ORDER BY month`,
    [branchName, year],
  );
  return rows.map((r) => ({
    month: r.month,
    total: Number(r.total),
    attended: Number(r.attended),
  }));
}
