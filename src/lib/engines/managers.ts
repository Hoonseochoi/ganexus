import { query, isRelationNotFound } from "./db";
import { getTenantSchemaForBranch } from "./tenant";

export type ManagerRow = {
  id: string;
  full_name: string | null;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | null;
  created_at: string;
};

export async function listManagersForBranch(branchName: string): Promise<ManagerRow[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  try {
    const rows = await query<ManagerRow>(
      `
        select id, full_name, branch_name, phone_number, role, created_at
        from ${schema}.profiles
        where branch_name = $1
          and role in ('admin', 'manager')
        order by created_at asc
      `,
      [branchName],
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) {
      const rows = await query<ManagerRow>(
        `select id, full_name, branch_name, phone_number, role, created_at from public.profiles where branch_name = $1 and role in ('admin', 'manager') order by created_at asc`,
        [branchName],
      );
      return rows;
    }
    throw err;
  }
}

/** 지점에 가입된 전체 멤버(admin, manager 포함) 조회. admin → manager 순. */
export async function listAllBranchMembers(branchName: string): Promise<ManagerRow[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  try {
    const rows = await query<ManagerRow>(
      `
        select id, full_name, branch_name, phone_number, role, created_at
        from ${schema}.profiles
        where branch_name = $1
        order by case role when 'admin' then 1 when 'manager' then 2 else 3 end, created_at asc
      `,
      [branchName],
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) {
      const rows = await query<ManagerRow>(`
        select id, full_name, branch_name, phone_number, role, created_at
        from public.profiles
        where branch_name = $1
          and role in ('admin', 'manager')
        order by case role when 'admin' then 1 when 'manager' then 2 else 3 end, created_at asc
      `, [branchName]);
      return rows;
    }
    throw err;
  }
}

