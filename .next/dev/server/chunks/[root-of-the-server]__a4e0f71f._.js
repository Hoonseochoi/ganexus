module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "PG_CODE_RELATION_NOT_EXIST",
    ()=>PG_CODE_RELATION_NOT_EXIST,
    "isColumnNotFound",
    ()=>isColumnNotFound,
    "isRelationNotFound",
    ()=>isRelationNotFound,
    "pool",
    ()=>pool,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/OneDrive/Desktop/GA_NEXUS/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
    // 실제 런타임에서는 .env.local 에서 설정해야 함
    console.warn("[db] NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.");
}
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000
});
const PG_CODE_RELATION_NOT_EXIST = "42P01";
function isRelationNotFound(err) {
    return err !== null && typeof err === "object" && "code" in err && err.code === PG_CODE_RELATION_NOT_EXIST;
}
function isColumnNotFound(err) {
    if (err === null || typeof err !== "object" || !("message" in err)) return false;
    const msg = String(err.message ?? "");
    return msg.includes("does not exist") || err.code === "42703";
}
async function query(text, params) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result.rows;
    } finally{
        client.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "destroyCurrentSession",
    ()=>destroyCurrentSession,
    "getCurrentSession",
    ()=>getCurrentSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const SESSION_COOKIE_NAME = "ga_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일
async function createSession(loginId) {
    const sessionId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])();
    const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("insert into public.sessions (id, user_login_id, expires_at) values ($1, $2, $3)", [
        sessionId,
        loginId,
        expires.toISOString()
    ]);
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_TTL_SECONDS
    });
    return sessionId;
}
async function destroyCurrentSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const current = cookieStore.get(SESSION_COOKIE_NAME);
    if (!current?.value) return;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("update public.sessions set revoked_at = timezone('utc', now()) where id = $1", [
        current.value
    ]);
    cookieStore.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
    });
}
async function getCurrentSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const current = cookieStore.get(SESSION_COOKIE_NAME);
    if (!current?.value) return null;
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("select id, user_login_id, expires_at, revoked_at from public.sessions where id = $1", [
        current.value
    ]);
    const session = rows[0];
    if (!session) return null;
    const now = Date.now();
    const isExpired = session.expires_at !== null && new Date(session.expires_at).getTime() < now;
    const isRevoked = session.revoked_at !== null && new Date(session.revoked_at).getTime() <= now;
    if (isExpired || isRevoked) {
        return null;
    }
    return {
        loginId: session.user_login_id
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/session.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function getCurrentUser() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentSession"])();
    if (!session) return null;
    const [authRows, profileRows] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("select login_id, role from public.auth_users where login_id = $1", [
            session.loginId
        ]),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("select * from public.profiles where login_id = $1", [
            session.loginId
        ])
    ]);
    const auth = authRows[0];
    if (!auth) return null;
    const profile = profileRows[0] ?? null;
    return {
        loginId: auth.login_id,
        role: auth.role,
        profile
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/tenant.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "addProfileToTenant",
    ()=>addProfileToTenant,
    "createTenantForAdmin",
    ()=>createTenantForAdmin,
    "getTenantSchemaForBranch",
    ()=>getTenantSchemaForBranch,
    "schemaNameFromEmployeeCode",
    ()=>schemaNameFromEmployeeCode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function schemaNameFromEmployeeCode(employeeCode) {
    const safe = employeeCode.replace(/[^a-zA-Z0-9]/g, "_").replace(/^_+|_+$/g, "") || "tenant";
    return `t_${safe}`.toLowerCase();
}
async function getTenantSchemaForBranch(branchName) {
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1", [
            branchName
        ]);
        return rows[0]?.tenant_schema ?? null;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) return null;
        throw err;
    }
}
async function createTenantForAdmin(params) {
    const schema = schemaNameFromEmployeeCode(params.employeeCode);
    const client = await __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].connect();
    try {
        await client.query(`create schema if not exists ${schema}`);
        await client.query(`
      create table if not exists ${schema}.schedules (
        id uuid not null default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        description text,
        category text check (category in ('dealer', 'internal', 'personal', 'leave', 'etc')) default 'etc',
        dealer_name text,
        location text,
        instructor text,
        target_audience text,
        manager_name text,
        start_at timestamptz not null,
        end_at timestamptz not null,
        is_all_day boolean default false,
        created_by uuid not null,
        creator_name text,
        created_at timestamptz default timezone('utc'::text, now()),
        is_soft_deleted boolean default false
      )
    `);
        await client.query(`
      create table if not exists ${schema}.profiles (
        id uuid not null default gen_random_uuid() primary key,
        login_id text not null,
        full_name text,
        branch_name text,
        birth_date varchar(6),
        phone_number text,
        is_approved boolean default false,
        role text check (role in ('admin', 'manager', 'agent')),
        manager_code text,
        company text,
        email text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);
        await client.query(`
      create table if not exists ${schema}.invite_codes (
        id uuid default gen_random_uuid() primary key,
        code text unique not null,
        branch_name text not null,
        created_by uuid not null,
        max_uses int,
        used_count int default 0,
        expires_at timestamptz,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);
        await client.query(`
      create table if not exists ${schema}.notices (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        body text,
        image_url text,
        created_by uuid not null,
        author_name text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);
        await client.query(`
      create table if not exists ${schema}.branch_memos (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        content text not null,
        created_by uuid not null,
        author_name text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);
        await client.query(`
      create table if not exists ${schema}.schedule_edit_logs (
        id uuid default gen_random_uuid() primary key,
        schedule_id uuid not null,
        branch_name text not null,
        modified_by uuid not null,
        modifier_name text,
        changed_fields jsonb not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);
        await client.query(`
      create table if not exists ${schema}.notice_reads (
        id uuid default gen_random_uuid() primary key,
        notice_id uuid not null,
        profile_id uuid not null,
        read_at timestamptz default timezone('utc'::text, now()),
        unique(notice_id, profile_id)
      )
    `);
        await client.query(`insert into ${schema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`, [
            params.profileId,
            params.employeeCode,
            params.fullName,
            params.branchName,
            params.phoneNumber,
            params.company ?? null,
            params.email ?? null
        ]);
        await client.query(`update public.profiles set tenant_schema = $1 where login_id = $2`, [
            schema,
            params.employeeCode
        ]);
    } finally{
        client.release();
    }
    return schema;
}
async function addProfileToTenant(params) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`insert into ${params.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`, [
        params.profileId,
        params.loginId,
        params.fullName,
        params.branchName,
        params.phoneNumber,
        params.role,
        params.isApproved,
        params.managerCode ?? null
    ]);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/managers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "listAllBranchMembers",
    ()=>listAllBranchMembers,
    "listManagersForBranch",
    ()=>listManagersForBranch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/tenant.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function listManagersForBranch(branchName) {
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        select id, full_name, branch_name, phone_number, role, created_at
        from ${schema}.profiles
        where branch_name = $1
          and role in ('admin', 'manager')
        order by created_at asc
      `, [
            branchName
        ]);
        return rows;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select id, full_name, branch_name, phone_number, role, created_at from public.profiles where branch_name = $1 and role in ('admin', 'manager') order by created_at asc`, [
                branchName
            ]);
            return rows;
        }
        throw err;
    }
}
async function listAllBranchMembers(branchName) {
    // 멤버 관리는 전역 public.profiles 기준으로 조회한다.
    const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
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
    `, [
        branchName
    ]);
    return rows;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/api/admin/managers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$managers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/managers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/tenant.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$managers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$managers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function GET(_req) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
        });
    }
    const canListMembers = user.role === "admin" || user.role === "manager";
    if (!canListMembers) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "매니저 리스트 조회 권한이 없습니다."
        }, {
            status: 403
        });
    }
    const branchName = user.profile?.branch_name;
    if (!branchName) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "지점 정보가 설정되지 않았습니다."
        }, {
            status: 400
        });
    }
    const members = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$managers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listAllBranchMembers"])(branchName);
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        managers: members.map((m)=>({
                id: m.id,
                name: m.full_name ?? "이름 없음",
                branch_name: m.branch_name,
                phone_number: m.phone_number,
                role: m.role,
                created_at: m.created_at
            })),
        canEdit: user.role === "admin",
        currentUserId: user.profile?.id ?? null
    });
}
async function DELETE(req) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
        });
    }
    if (user.role !== "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "멤버 삭제는 관리자만 가능합니다."
        }, {
            status: 403
        });
    }
    const branchName = user.profile?.branch_name;
    if (!branchName) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "지점 정보가 설정되지 않았습니다."
        }, {
            status: 400
        });
    }
    const { memberId } = await req.json().catch(()=>({}));
    if (!memberId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "멤버 ID가 필요합니다."
        }, {
            status: 400
        });
    }
    if (user.profile?.id === memberId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "자기 자신은 삭제할 수 없습니다."
        }, {
            status: 400
        });
    }
    // 해당 지점 멤버인지, Admin 이 아닌지 확인
    const profileRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      select id, login_id, role
      from public.profiles
      where id = $1 and branch_name = $2
    `, [
        memberId,
        branchName
    ]);
    const target = profileRows[0];
    if (!target) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "해당 지점에서 찾을 수 없는 멤버입니다."
        }, {
            status: 404
        });
    }
    if (target.role === "admin") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "관리자 계정은 여기서 삭제할 수 없습니다."
        }, {
            status: 400
        });
    }
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    // auth_users, tenant 프로필, public 프로필 순서로 삭제
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
      delete from public.auth_users
      where login_id = $1
    `, [
        target.login_id
    ]);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`delete from ${schema}.profiles where id = $1`, [
        memberId
    ]);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("delete from public.profiles where id = $1", [
        memberId
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: "ok"
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a4e0f71f._.js.map