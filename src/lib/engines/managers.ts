import { query } from "./db";

export type ManagerRow = {
  id: string;
  full_name: string | null;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
  created_at: string;
};

export async function listManagersForBranch(branchName: string): Promise<ManagerRow[]> {
  const rows = await query<ManagerRow>(
    `
      select id, full_name, branch_name, phone_number, role, created_at
      from public.profiles
      where branch_name = $1
        and role in ('admin', 'manager')
      order by created_at asc
    `,
    [branchName],
  );
  return rows;
}

/** 지점에 가입된 전체 멤버(admin, manager, agent 포함) 조회. admin → manager → agent 순. */
export async function listAllBranchMembers(branchName: string): Promise<ManagerRow[]> {
  const rows = await query<ManagerRow>(
    `
      select id, full_name, branch_name, phone_number, role, created_at
      from public.profiles
      where branch_name = $1
      order by case role when 'admin' then 1 when 'manager' then 2 when 'agent' then 3 else 4 end, created_at asc
    `,
    [branchName],
  );
  return rows;
}

