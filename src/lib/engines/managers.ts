import { query, isRelationNotFound } from "./db";
import { getTenantSchemaForBranch } from "./tenant";

export type ManagerRow = {
  id: string;
  full_name: string | null;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
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

/** 지점에 가입된 전체 멤버(admin, manager, agent 포함) 조회.
 *  - 기준:
 *    - profiles.branch_name = 주어진 지점명
 *    - OR 해당 지점에서 발급된 초대코드(invite_codes.branch_name = 지점명)를 사용해 가입한 경우
 *    - AND is_approved = true 인 멤버만
 *  - 정렬: admin → manager → agent 순, 이후 생성일 오래된 순
 */
export async function listAllBranchMembers(branchName: string): Promise<ManagerRow[]> {
  // 멤버 관리는 전역 public.profiles 기준으로 조회한다.
  const rows = await query<ManagerRow>(
    `
      select id, full_name, branch_name, phone_number, role, created_at
      from public.profiles
      where
        is_approved = true
        and role in ('admin', 'manager', 'agent')
        and (
          branch_name = $1
          or invite_code in (
            select code from public.invite_codes where branch_name = $1
          )
        )
      order by
        case role
          when 'admin' then 1
          when 'manager' then 2
          else 3
        end,
        created_at asc
    `,
    [branchName],
  );
  return rows;
}

