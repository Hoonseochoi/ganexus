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
        select m.id, m.branch_name, m.content, m.created_by, m.created_at,
               p.full_name as author_name
        from public.branch_memos m
        left join public.profiles p on p.id = m.created_by
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
}): Promise<MemoRow> {
  const rows = await query<MemoRow>(
    `
      insert into public.branch_memos (branch_name, content, created_by)
      values ($1, $2, $3)
      returning id, branch_name, content, created_by, created_at
    `,
    [params.branchName, params.content, params.createdByProfileId],
  );
  return rows[0];
}
