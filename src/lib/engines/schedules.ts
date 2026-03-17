import { query, isRelationNotFound, isColumnNotFound } from "./db";
import { getTenantSchemaForBranch } from "./tenant";

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
  is_soft_deleted?: boolean;
  creator_full_name?: string | null;
  creator_avatar_url?: string | null;
  target_full_name?: string | null;
  target_avatar_url?: string | null;
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

export type ScheduleEditLog = {
  id: string;
  schedule_id: string;
  branch_name: string;
  modified_by: string;
  modifier_name: string | null;
  changed_fields: Record<string, { before: unknown; after: unknown }>;
  created_at: string;
};

export async function listSchedulesForBranch(params: {
  branchName: string;
  from?: string;
  to?: string;
}): Promise<ScheduleRow[]> {
  const { branchName, from, to } = params;
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";

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
        select s.id, s.branch_name, s.title, s.description, s.category,
               s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
               s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
               p1.full_name as creator_full_name,
               p2.full_name as target_full_name
        from ${schema}.schedules s
        left join public.profiles p1 on s.created_by::text = p1.id::text
        left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
        where s.${where}
        order by s.is_soft_deleted asc, s.start_at asc
      `,
      values,
    );
    return rows.map(r => ({
      ...r,
      category: (LEGACY_TO_CATEGORY[r.category as LegacyCategory] || r.category) as ScheduleCategory
    }));
  } catch (err) {
    if (isRelationNotFound(err)) {
      console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다.");
      return [];
    }
    if (isColumnNotFound(err)) {
      type LegacyRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name" | "category" | "target_full_name" | "target_avatar_url"> & { category: LegacyCategory };
      const legacy = await query<LegacyRow>(
        `
          select s.id, s.branch_name, s.title, s.description, s.category,
                 s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                 p.full_name as creator_full_name
          from ${schema}.schedules s
          left join public.profiles p on s.created_by::text = p.id::text
          where s.${where}
          order by s.start_at asc
        `,
        values,
      );
      return legacy.map((r) => ({
        ...r,
        category: LEGACY_TO_CATEGORY[r.category] || (r.category as unknown as ScheduleCategory),
        dealer_name: null,
        location: null,
        instructor: null,
        target_audience: null,
        manager_name: r.category === "vacation" ? r.title : null,
        target_full_name: r.category === "vacation" ? r.title : null,
        target_avatar_url: null,
      }));
    }
    throw err;
  }
}

export async function createSchedule(input: ScheduleInput): Promise<ScheduleRow> {
  const startAt = input.startAt;
  const endAt = input.endAt ?? input.startAt;
  const category = input.category ?? "etc";
  const schema = (await getTenantSchemaForBranch(input.branchName)) ?? "public";

  try {
    const rows = await query<ScheduleRow>(
      `
        insert into ${schema}.schedules (
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
      type LegacyInsertRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name" | "category" | "target_full_name" | "target_avatar_url"> & { category: LegacyCategory };
      const rows = await query<LegacyInsertRow>(
        `insert into ${schema}.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,
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
        target_full_name: null,
        target_avatar_url: null,
      };
    }
    throw err;
  }
}

async function insertScheduleEditLog(args: {
  schema: string;
  scheduleId: string;
  branchName: string;
  modifiedBy: string;
  modifiedByName: string | null;
  before: ScheduleRow;
  after: ScheduleRow;
}) {
  const changed: ScheduleEditLog["changed_fields"] = {};
  (
    [
      "title",
      "description",
      "start_at",
      "end_at",
      "category",
      "dealer_name",
      "location",
      "instructor",
      "target_audience",
      "manager_name",
    ] as const
  ).forEach((field) => {
    const vBefore = (args.before as any)[field];
    const vAfter = (args.after as any)[field];
    let isChanged = false;

    if (vBefore instanceof Date || vAfter instanceof Date || field === "start_at" || field === "end_at") {
      const tBefore = vBefore ? new Date(vBefore).getTime() : null;
      const tAfter = vAfter ? new Date(vAfter).getTime() : null;
      isChanged = tBefore !== tAfter;
    } else {
      isChanged = vBefore !== vAfter;
    }

    if (isChanged) {
      changed[field] = {
        before: vBefore,
        after: vAfter,
      };
    }
  });
  if (Object.keys(changed).length === 0) return;
  try {
    await query(
      `
        insert into ${args.schema}.schedule_edit_logs (schedule_id, branch_name, modified_by, modifier_name, changed_fields)
        values ($1, $2, $3, $4, $5)
      `,
      [args.scheduleId, args.branchName, args.modifiedBy, args.modifiedByName ?? null, JSON.stringify(changed)],
    );
  } catch (err) {
    if (isRelationNotFound(err)) {
      // 로그 테이블이 없으면 로깅만 건너뛴다.
      return;
    }
    throw err;
  }
}

export async function getScheduleEditLogs(params: {
  scheduleId: string;
  branchName: string;
}): Promise<ScheduleEditLog[]> {
  const schema =
    (await getTenantSchemaForBranch(params.branchName)) ?? "public";
  try {
    const rows = await query<ScheduleEditLog>(
      `
        select l.id, l.schedule_id, l.branch_name, l.modified_by,
               COALESCE(l.modifier_name, p.full_name) as modifier_name,
               l.changed_fields, l.created_at
        from ${schema}.schedule_edit_logs l
        left join public.profiles p on l.modified_by::text = p.id::text
        where l.schedule_id = $1 and l.branch_name = $2
        order by l.created_at desc
      `,
      [params.scheduleId, params.branchName],
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) {
      // 로그 테이블이 아직 없는 스키마는 빈 이력으로 처리
      return [];
    }
    throw err;
  }
}

export async function updateSchedule(params: {
  id: string;
  branchName: string;
  modifiedBy: string;
  modifiedByName?: string | null;
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
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";

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

  type LegacyRow = Omit<ScheduleRow, "dealer_name" | "location" | "instructor" | "target_audience" | "manager_name" | "category" | "target_full_name" | "target_avatar_url"> & { category: LegacyCategory };

  let before: ScheduleRow | null = null;
  try {
    const rowsBefore = await query<ScheduleRow>(
      `select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`,
      [id, branchName],
    );
    before = rowsBefore[0] ?? null;
  } catch (err) {
    if (!isColumnNotFound(err)) {
      throw err;
    }
    // 메타 컬럼이 없는 레거시 스키마인 경우, 수정 이력 로깅은 생략
    before = null;
  }

  const runFull = async (): Promise<ScheduleRow | null> => {
    if (fields.length === 0) {
      const rows = await query<ScheduleRow>(
        `select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`,
        [id, branchName],
      );
      return rows[0] ?? null;
    }
    const rows = await query<ScheduleRow>(
      `update ${schema}.schedules set ${fields.join(", ")} where id = $${fields.length + 1} and branch_name = $${fields.length + 2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`,
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
        `select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`,
        [id, branchName],
      );
      const r = rows[0];
      if (!r) return null;
      return { ...r, category: LEGACY_TO_CATEGORY[r.category], dealer_name: null, location: null, instructor: null, target_audience: null, manager_name: null, target_full_name: null, target_avatar_url: null };
    }
    const rows = await query<LegacyRow>(
      `update ${schema}.schedules set ${legacyFields.join(", ")} where id = $${legacyFields.length + 1} and branch_name = $${legacyFields.length + 2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,
      [...legacyValues, id, branchName],
    );
    const r = rows[0];
    if (!r) return null;
    return { ...r, category: LEGACY_TO_CATEGORY[r.category], dealer_name: null, location: null, instructor: null, target_audience: null, manager_name: null, target_full_name: null, target_avatar_url: null };
  };

  try {
    const updated = await runFull();
    if (before && updated) {
      await insertScheduleEditLog({
        schema,
        scheduleId: id,
        branchName,
        modifiedBy: params.modifiedBy,
        modifiedByName: params.modifiedByName ?? null,
        before,
        after: updated,
      });
    }
    return updated;
  } catch (err) {
    if (isColumnNotFound(err)) {
      const legacyUpdated = await runLegacy();
      // 레거시 스키마에서는 위에서 before 조회가 실패했을 가능성이 높아 로깅을 건너뜀
      if (before && legacyUpdated) {
        await insertScheduleEditLog({
          schema,
          scheduleId: id,
          branchName,
          modifiedBy: params.modifiedBy,
          modifiedByName: params.modifiedByName ?? null,
          before,
          after: legacyUpdated,
        });
      }
      return legacyUpdated;
    }
    throw err;
  }
}

export async function deleteSchedule(params: {
  id: string;
  branchName: string;
  hardDelete?: boolean;
}): Promise<void> {
  const { id, branchName, hardDelete } = params;
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  if (hardDelete) {
    await query(
      `delete from ${schema}.schedules where id = $1 and branch_name = $2`,
      [id, branchName],
    );
    return;
  }
  await query(
    `update ${schema}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`,
    [id, branchName],
  );
}

export async function getScheduleById(params: {
  id: string;
  branchName: string;
}): Promise<ScheduleRow | null> {
  const { id, branchName } = params;
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  try {
    const rows = await query<ScheduleRow>(
      `select s.id, s.branch_name, s.title, s.description, s.category,
              s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
              s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
              p1.full_name as creator_full_name,
              p2.full_name as target_full_name
       from ${schema}.schedules s
       left join public.profiles p1 on s.created_by::text = p1.id::text
       left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
       where s.id = $1 and s.branch_name = $2
       limit 1`,
      [id, branchName],
    );
    return rows[0] ?? null;
  } catch (err) {
    if (isRelationNotFound(err)) {
      console.warn("[schedules] schedules 테이블이 없어 null을 반환합니다.");
      return null;
    }
    if (isColumnNotFound(err)) {
      type LegacyRow = Omit<
        ScheduleRow,
        | "dealer_name"
        | "location"
        | "instructor"
        | "target_audience"
        | "manager_name"
        | "category"
        | "target_full_name"
        | "target_avatar_url"
      > & { category: LegacyCategory };
      const rows = await query<LegacyRow>(
        `select s.id, s.branch_name, s.title, s.description, s.category,
                s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                p.full_name as creator_full_name
         from ${schema}.schedules s
         left join public.profiles p on s.created_by::text = p.id::text
         where s.id = $1 and s.branch_name = $2
         limit 1`,
        [id, branchName],
      );
      const r = rows[0];
      if (!r) return null;
      return {
        ...r,
        category: LEGACY_TO_CATEGORY[r.category as LegacyCategory] || (r.category as ScheduleCategory),
        dealer_name: null,
        location: null,
        instructor: null,
        target_audience: null,
        manager_name: r.category === "vacation" ? r.title : null,
        target_full_name: r.category === "vacation" ? r.title : null,
        target_avatar_url: null,
      };
    }
    throw err;
  }
}
