import { query, isRelationNotFound } from "./db";

export type ScheduleRow = {
  id: string;
  branch_name: string;
  title: string;
  description: string | null;
  category: "education" | "vacation" | "hq" | "etc";
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
  category?: ScheduleRow["category"];
  startAt: string; // ISO
  endAt: string; // ISO
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
    throw err;
  }
}

export async function createSchedule(input: ScheduleInput): Promise<ScheduleRow> {
  const rows = await query<ScheduleRow>(
    `
      insert into public.schedules (
        branch_name, title, description, category,
        start_at, end_at, is_all_day, created_by
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning id, branch_name, title, description, category,
                start_at, end_at, is_all_day, created_by, created_at
    `,
    [
      input.branchName,
      input.title,
      input.description ?? null,
      input.category ?? "etc",
      input.startAt,
      input.endAt,
      input.isAllDay ?? false,
      input.createdByProfileId,
    ],
  );

  return rows[0];
}

export async function updateSchedule(params: {
  id: string;
  branchName: string;
  title?: string;
  description?: string | null;
  category?: ScheduleRow["category"];
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
  if (params.startAt !== undefined) push("start_at", params.startAt);
  if (params.endAt !== undefined) push("end_at", params.endAt);
  if (params.isAllDay !== undefined) push("is_all_day", params.isAllDay);

  if (fields.length === 0) {
    const rows = await query<ScheduleRow>(
      `
        select id, branch_name, title, description, category,
               start_at, end_at, is_all_day, created_by, created_at
        from public.schedules
        where id = $1 and branch_name = $2
      `,
      [id, branchName],
    );
    return rows[0] ?? null;
  }

  const rows = await query<ScheduleRow>(
    `
      update public.schedules
      set ${fields.join(", ")}
      where id = $${fields.length + 1} and branch_name = $${
        fields.length + 2
      }
      returning id, branch_name, title, description, category,
                start_at, end_at, is_all_day, created_by, created_at
    `,
    [...values, id, branchName],
  );

  return rows[0] ?? null;
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

