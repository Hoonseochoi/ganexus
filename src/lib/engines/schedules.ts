import { query, isRelationNotFound, isColumnNotFound } from "./db";

export type ScheduleCategory = "dealer" | "internal" | "personal" | "leave" | "etc";

/** DB에 메타 컬럼이 없을 때 읽어오는 레거시 행 (category는 구 enum) */
type LegacyCategory = "education" | "vacation" | "hq" | "etc";

const LEGACY_TO_CATEGORY: Record<LegacyCategory, ScheduleCategory> = {
  education: "dealer",
  vacation: "leave",
  hq: "internal",
  etc: "etc",
};

const CATEGORY_TO_LEGACY: Record<ScheduleCategory, LegacyCategory> = {
  dealer: "education",
  internal: "hq",
  personal: "etc",
  leave: "vacation",
  etc: "etc",
};

export type ScheduleRow = {
  id: string;
  branch_name: string;
  title: string;
  description: string | null;
  category: ScheduleCategory;
  dealer_name: string | null;
  location: string | null;
  instructor: string | null;
  target_audience: string | null;
  manager_name: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  created_by: string;
  created_at: string;
};

export type ScheduleInput = {
  branchName: string;
  title: string;
  description?: string | null;
  category?: ScheduleCategory;
  dealerName?: string | null;
  location?: string | null;
  instructor?: string | null;
  targetAudience?: string | null;
  managerName?: string | null;
  startAt: string; // ISO
  endAt?: string; // ISO (없으면 startAt 과 동일하게 처리)
  isAllDay?: boolean;
  createdByProfileId: string;
};

export async function listSchedulesForBranch(params: {
  branchName: string;
  from?: string;
  to?: string;
}): Promise<ScheduleRow[]> {
  const { branchName, from, to } = params;

  const conditions = ["branch_name = $1"];
  const values: unknown[] = [branchName];

  if (from) {
    conditions.push("end_at >= $2");
    values.push(from);
  }

  if (to) {
    conditions.push("start_at <= $" + (values.length + 1));
    values.push(to);
  }

  const where = conditions.join(" and ");

  try {
    const rows = await query<ScheduleRow>(
      `
        select id, branch_name, title, description, category,
               dealer_name, location, instructor, target_audience, manager_name,
               start_at, end_at, is_all_day, created_by, created_at
        from public.schedules
        where ${where}
        order by start_at asc
      `,
      values,
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) {
      console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다.");
      return [];
    }
    if (isColumnNotFound(err)) {
      type LegacyRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name"> & { category: LegacyCategory };
      const legacy = await query<LegacyRow>(
        `
          select id, branch_name, title, description, category,
                 start_at, end_at, is_all_day, created_by, created_at
          from public.schedules
          where ${where}
          order by start_at asc
        `,
        values,
      );
      return legacy.map((r) => ({
        ...r,
        category: LEGACY_TO_CATEGORY[r.category],
        dealer_name: null,
        location: null,
        instructor: null,
        target_audience: null,
        manager_name: null,
      }));
    }
    throw err;
  }
}

export async function createSchedule(input: ScheduleInput): Promise<ScheduleRow> {
  const startAt = input.startAt;
  const endAt = input.endAt ?? input.startAt;
  const category = input.category ?? "etc";

  try {
    const rows = await query<ScheduleRow>(
      `
        insert into public.schedules (
          branch_name, title, description, category,
          dealer_name, location, instructor, target_audience, manager_name,
          start_at, end_at, is_all_day, created_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        returning id, branch_name, title, description, category,
                  dealer_name, location, instructor, target_audience, manager_name,
                  start_at, end_at, is_all_day, created_by, created_at
      `,
      [
        input.branchName,
        input.title,
        input.description ?? null,
        category,
        input.dealerName ?? null,
        input.location ?? null,
        input.instructor ?? null,
        input.targetAudience ?? null,
        input.managerName ?? null,
        startAt,
        endAt,
        input.isAllDay ?? false,
        input.createdByProfileId,
      ],
    );
    return rows[0];
  } catch (err) {
    if (isColumnNotFound(err)) {
      const legacyCategory = CATEGORY_TO_LEGACY[category];
      type LegacyInsertRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name"> & { category: LegacyCategory };
      const rows = await query<LegacyInsertRow>(
        `insert into public.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,
        [
          input.branchName,
          input.title,
          input.description ?? null,
          legacyCategory,
          startAt,
          endAt,
          input.isAllDay ?? false,
          input.createdByProfileId,
        ],
      );
      const r = rows[0];
      return {
        ...r,
        category,
        dealer_name: null,
        location: null,
        instructor: null,
        target_audience: null,
        manager_name: null,
      };
    }
    throw err;
  }
}

export async function updateSchedule(params: {
  id: string;
  branchName: string;
  title?: string;
  description?: string | null;
  category?: ScheduleCategory;
  dealerName?: string | null;
  location?: string | null;
  instructor?: string | null;
  targetAudience?: string | null;
  managerName?: string | null;
  startAt?: string;
  endAt?: string;
  isAllDay?: boolean;
}): Promise<ScheduleRow | null> {
  const { id, branchName } = params;

  const fields: string[] = [];
  const values: unknown[] = [];

  function push(field: string, value: unknown) {
    fields.push(`${field} = $${fields.length + 1}`);
    values.push(value);
  }

  if (params.title !== undefined) push("title", params.title);
  if (params.description !== undefined) push("description", params.description);
  if (params.category !== undefined) push("category", params.category);
  if (params.dealerName !== undefined) push("dealer_name", params.dealerName);
  if (params.location !== undefined) push("location", params.location);
  if (params.instructor !== undefined) push("instructor", params.instructor);
  if (params.targetAudience !== undefined) push("target_audience", params.targetAudience);
  if (params.managerName !== undefined) push("manager_name", params.managerName);
  if (params.startAt !== undefined) push("start_at", params.startAt);
  if (params.endAt !== undefined) push("end_at", params.endAt);
  if (params.isAllDay !== undefined) push("is_all_day", params.isAllDay);

  type LegacyRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name"> & { category: LegacyCategory };

  const runFull = async (): Promise<ScheduleRow | null> => {
    if (fields.length === 0) {
      const rows = await query<ScheduleRow>(
        `select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from public.schedules where id = $1 and branch_name = $2`,
        [id, branchName],
      );
      return rows[0] ?? null;
    }
    const rows = await query<ScheduleRow>(
      `update public.schedules set ${fields.join(", ")} where id = $${fields.length + 1} and branch_name = $${fields.length + 2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`,
      [...values, id, branchName],
    );
    return rows[0] ?? null;
  };

  const runLegacy = async (): Promise<ScheduleRow | null> => {
    const legacyFields: string[] = [];
    const legacyValues: unknown[] = [];
    function legPush(field: string, value: unknown) {
      legacyFields.push(`${field} = $${legacyFields.length + 1}`);
      legacyValues.push(value);
    }
    if (params.title !== undefined) legPush("title", params.title);
    if (params.description !== undefined) legPush("description", params.description);
    if (params.category !== undefined) legPush("category", CATEGORY_TO_LEGACY[params.category]);
    if (params.startAt !== undefined) legPush("start_at", params.startAt);
    if (params.endAt !== undefined) legPush("end_at", params.endAt);
    if (params.isAllDay !== undefined) legPush("is_all_day", params.isAllDay);

    if (legacyFields.length === 0) {
      const rows = await query<LegacyRow>(
        "select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from public.schedules where id = $1 and branch_name = $2",
        [id, branchName],
      );
      const r = rows[0];
      if (!r) return null;
      return { ...r, category: LEGACY_TO_CATEGORY[r.category], dealer_name: null, location: null, instructor: null, target_audience: null, manager_name: null };
    }
    const rows = await query<LegacyRow>(
      `update public.schedules set ${legacyFields.join(", ")} where id = $${legacyFields.length + 1} and branch_name = $${legacyFields.length + 2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,
      [...legacyValues, id, branchName],
    );
    const r = rows[0];
    if (!r) return null;
    return { ...r, category: LEGACY_TO_CATEGORY[r.category], dealer_name: null, location: null, instructor: null, target_audience: null, manager_name: null };
  };

  try {
    return await runFull();
  } catch (err) {
    if (isColumnNotFound(err)) return runLegacy();
    throw err;
  }
}

export async function deleteSchedule(params: {
  id: string;
  branchName: string;
}): Promise<void> {
  const { id, branchName } = params;
  await query(
    "delete from public.schedules where id = $1 and branch_name = $2",
    [id, branchName],
  );
}

