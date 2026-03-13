import { query, isRelationNotFound } from "./db";
import { getTenantSchemaForBranch } from "./tenant";

export type NoticeRow = {
  id: string;
  branch_name: string;
  title: string;
  body: string | null;
  image_url: string | null;
  created_by: string;
  created_at: string;
};

export type NoticeReadRow = {
  id: string;
  notice_id: string;
  profile_id: string;
  read_at: string;
  full_name: string | null;
};

/** 지점(tenant) 스키마 또는 public 사용 — 공지사항은 항상 해당 지점 전용 */
async function getSchemaForBranch(branchName: string): Promise<string> {
  const tenant = await getTenantSchemaForBranch(branchName);
  return tenant ?? "public";
}

export async function getLatestNoticeForBranch(
  branchName: string,
): Promise<NoticeRow | null> {
  const schema = await getSchemaForBranch(branchName);
  try {
    const rows = await query<NoticeRow>(
      `
        select id, branch_name, title, body, image_url, created_by, created_at
        from ${schema}.notices
        where branch_name = $1
        order by created_at desc
        limit 1
      `,
      [branchName],
    );
    return rows[0] ?? null;
  } catch (err) {
    if (isRelationNotFound(err)) {
      console.warn("[notices] notices 테이블이 없습니다.");
      return null;
    }
    throw err;
  }
}

export async function getNoticeById(
  id: string,
  branchName: string,
): Promise<NoticeRow | null> {
  const schema = await getSchemaForBranch(branchName);
  try {
    const rows = await query<NoticeRow>(
      `
        select id, branch_name, title, body, image_url, created_by, created_at
        from ${schema}.notices
        where id = $1 and branch_name = $2
      `,
      [id, branchName],
    );
    return rows[0] ?? null;
  } catch (err) {
    if (isRelationNotFound(err)) return null;
    throw err;
  }
}

export async function createNotice(params: {
  branchName: string;
  title: string;
  body?: string | null;
  imageUrl?: string | null;
  createdByProfileId: string;
}): Promise<NoticeRow> {
  const schema = await getSchemaForBranch(params.branchName);
  const rows = await query<NoticeRow>(
    `
      insert into ${schema}.notices (branch_name, title, body, image_url, created_by)
      values ($1, $2, $3, $4, $5)
      returning id, branch_name, title, body, image_url, created_by, created_at
    `,
    [
      params.branchName,
      params.title,
      params.body ?? null,
      params.imageUrl ?? null,
      params.createdByProfileId,
    ],
  );
  return rows[0];
}

export async function updateNotice(params: {
  id: string;
  branchName: string;
  title?: string;
  body?: string | null;
  imageUrl?: string | null;
}): Promise<NoticeRow | null> {
  const { id, branchName } = params;
  const schema = await getSchemaForBranch(branchName);
  const fields: string[] = [];
  const values: unknown[] = [];
  if (params.title !== undefined) {
    fields.push(`title = $${values.length + 1}`);
    values.push(params.title);
  }
  if (params.body !== undefined) {
    fields.push(`body = $${values.length + 1}`);
    values.push(params.body);
  }
  if (params.imageUrl !== undefined) {
    fields.push(`image_url = $${values.length + 1}`);
    values.push(params.imageUrl);
  }
  if (fields.length === 0) {
    return getNoticeById(id, branchName);
  }
  try {
    const rows = await query<NoticeRow>(
      `
        update ${schema}.notices
        set ${fields.join(", ")}
        where id = $${values.length + 1} and branch_name = $${values.length + 2}
        returning id, branch_name, title, body, image_url, created_by, created_at
      `,
      [...values, id, branchName],
    );
    return rows[0] ?? null;
  } catch (err) {
    if (isRelationNotFound(err)) return null;
    throw err;
  }
}

export async function markNoticeRead(params: {
  branchName: string;
  noticeId: string;
  profileId: string;
}): Promise<void> {
  const schema = await getSchemaForBranch(params.branchName);
  await query(
    `
      insert into ${schema}.notice_reads (notice_id, profile_id)
      values ($1, $2)
      on conflict (notice_id, profile_id) do nothing
    `,
    [params.noticeId, params.profileId],
  );
}

export async function hasReadNotice(
  branchName: string,
  noticeId: string,
  profileId: string,
): Promise<boolean> {
  const schema = await getSchemaForBranch(branchName);
  try {
    const rows = await query<{ id: string }>(
      `select id from ${schema}.notice_reads where notice_id = $1 and profile_id = $2`,
      [noticeId, profileId],
    );
    return rows.length > 0;
  } catch (err) {
    if (isRelationNotFound(err)) return false;
    throw err;
  }
}

export async function getNoticeReads(
  branchName: string,
  noticeId: string,
): Promise<NoticeReadRow[]> {
  const schema = await getSchemaForBranch(branchName);
  try {
    const rows = await query<NoticeReadRow>(
      `
        select nr.id, nr.notice_id, nr.profile_id, nr.read_at, p.full_name
        from ${schema}.notice_reads nr
        left join ${schema}.profiles p on p.id = nr.profile_id
        where nr.notice_id = $1
        order by nr.read_at asc
      `,
      [noticeId],
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) return [];
    throw err;
  }
}
