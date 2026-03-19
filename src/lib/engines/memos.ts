import { query, isRelationNotFound } from "./db";

export type MemoRow = {
  id: string;
  branch_name: string;
  content: string;
  created_by: string;
  created_at: string;
};

export type MemoWithAuthor = MemoRow & {
  author_name: string | null;
};

export async function listMemosForBranch(params: {
  branchName: string;
  date?: string; // YYYY-MM-DD, 없으면 최근 100건
}): Promise<MemoWithAuthor[]> {
  const { branchName, date } = params;

  try {
    const conditions = ["m.branch_name = $1"];
    const values: unknown[] = [branchName];
    if (date) {
      conditions.push("m.created_at >= $2::date and m.created_at < $2::date + interval '1 day'");
      values.push(date);
    }
    const rows = await query<MemoRow & { author_name: string | null }>(
      `
        select id, branch_name, content, created_by, created_at, author_name
        from public.branch_memos m
        where ${conditions.join(" and ")}
        order by m.created_at desc
        limit 100
      `,
      values,
    );

    return rows.map((r) => ({
      id: r.id,
      branch_name: r.branch_name,
      content: r.content,
      created_by: r.created_by,
      created_at: r.created_at,
      author_name: r.author_name ?? null,
    }));
  } catch (err) {
    if (isRelationNotFound(err)) {
      console.warn("[memos] branch_memos 테이블이 없어 빈 결과를 반환합니다.");
      return [];
    }
    throw err;
  }
}

export async function createMemo(params: {
  branchName: string;
  content: string;
  createdByProfileId: string;
  createdByName?: string | null;
}): Promise<MemoRow> {
  const rows = await query<MemoRow>(
    `
      insert into public.branch_memos (branch_name, content, created_by, author_name)
      values ($1, $2, $3, $4)
      returning id, branch_name, content, created_by, created_at, author_name
    `,
    [params.branchName, params.content, params.createdByProfileId, params.createdByName ?? null],
  );
  return rows[0];
}

export async function updateMemo(params: {
  id: string;
  branchName: string;
  content: string;
  createdBy?: string; // if provided, only update if created_by matches (non-admin)
}): Promise<MemoWithAuthor | null> {
  try {
    const conditions = ["id = $2", "branch_name = $3"];
    const values: unknown[] = [params.content, params.id, params.branchName];
    if (params.createdBy) {
      conditions.push(`created_by = $${values.length + 1}`);
      values.push(params.createdBy);
    }
    const rows = await query<MemoRow & { author_name: string | null }>(
      `update public.branch_memos set content = $1 where ${conditions.join(" and ")}
       returning id, branch_name, content, created_by, created_at, author_name`,
      values,
    );
    const r = rows[0];
    if (!r) return null;
    return { id: r.id, branch_name: r.branch_name, content: r.content, created_by: r.created_by, created_at: r.created_at, author_name: r.author_name ?? null };
  } catch (err) {
    if (isRelationNotFound(err)) return null;
    throw err;
  }
}

export async function deleteMemo(params: {
  id: string;
  branchName: string;
  createdBy?: string; // if provided, only delete if created_by matches (non-admin)
}): Promise<boolean> {
  try {
    const conditions = ["id = $1", "branch_name = $2"];
    const values: unknown[] = [params.id, params.branchName];
    if (params.createdBy) {
      conditions.push(`created_by = $${values.length + 1}`);
      values.push(params.createdBy);
    }
    const rows = await query<{ id: string }>(
      `delete from public.branch_memos where ${conditions.join(" and ")} returning id`,
      values,
    );
    return rows.length > 0;
  } catch (err) {
    if (isRelationNotFound(err)) return false;
    throw err;
  }
}
