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
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/schedules.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "createSchedule",
    ()=>createSchedule,
    "deleteSchedule",
    ()=>deleteSchedule,
    "getScheduleEditLogs",
    ()=>getScheduleEditLogs,
    "listSchedulesForBranch",
    ()=>listSchedulesForBranch,
    "updateSchedule",
    ()=>updateSchedule
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
const LEGACY_TO_CATEGORY = {
    education: "dealer",
    vacation: "leave",
    hq: "internal",
    etc: "etc"
};
const CATEGORY_TO_LEGACY = {
    dealer: "education",
    internal: "hq",
    personal: "etc",
    leave: "vacation",
    etc: "etc"
};
async function listSchedulesForBranch(params) {
    const { branchName, from, to } = params;
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    const conditions = [
        "branch_name = $1"
    ];
    const values = [
        branchName
    ];
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
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        select id, branch_name, title, description, category,
               dealer_name, location, instructor, target_audience, manager_name,
               start_at, end_at, is_all_day, created_by, created_at, is_soft_deleted
        from ${schema}.schedules
        where ${where}
        order by is_soft_deleted asc, start_at asc
      `, values);
        return rows;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다.");
            return [];
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
            const legacy = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
          select id, branch_name, title, description, category,
                 start_at, end_at, is_all_day, created_by, created_at
          from ${schema}.schedules
          where ${where}
          order by start_at asc
        `, values);
            return legacy.map((r)=>({
                    ...r,
                    category: LEGACY_TO_CATEGORY[r.category],
                    dealer_name: null,
                    location: null,
                    instructor: null,
                    target_audience: null,
                    manager_name: null
                }));
        }
        throw err;
    }
}
async function createSchedule(input) {
    const startAt = input.startAt;
    const endAt = input.endAt ?? input.startAt;
    const category = input.category ?? "etc";
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(input.branchName) ?? "public";
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        insert into ${schema}.schedules (
          branch_name, title, description, category,
          dealer_name, location, instructor, target_audience, manager_name,
          start_at, end_at, is_all_day, created_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        returning id, branch_name, title, description, category,
                  dealer_name, location, instructor, target_audience, manager_name,
                  start_at, end_at, is_all_day, created_by, created_at
      `, [
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
            input.createdByProfileId
        ]);
        return rows[0];
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
            const legacyCategory = CATEGORY_TO_LEGACY[category];
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`insert into ${schema}.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`, [
                input.branchName,
                input.title,
                input.description ?? null,
                legacyCategory,
                startAt,
                endAt,
                input.isAllDay ?? false,
                input.createdByProfileId
            ]);
            const r = rows[0];
            return {
                ...r,
                category,
                dealer_name: null,
                location: null,
                instructor: null,
                target_audience: null,
                manager_name: null
            };
        }
        throw err;
    }
}
async function insertScheduleEditLog(args) {
    const changed = {};
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
        "manager_name"
    ].forEach((field)=>{
        const vBefore = args.before[field];
        const vAfter = args.after[field];
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
                after: vAfter
            };
        }
    });
    if (Object.keys(changed).length === 0) return;
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        insert into ${args.schema}.schedule_edit_logs (schedule_id, branch_name, modified_by, modifier_name, changed_fields)
        values ($1, $2, $3, $4, $5)
      `, [
            args.scheduleId,
            args.branchName,
            args.modifiedBy,
            args.modifiedByName ?? null,
            JSON.stringify(changed)
        ]);
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            // 로그 테이블이 없으면 로깅만 건너뛴다.
            return;
        }
        throw err;
    }
}
async function getScheduleEditLogs(params) {
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(params.branchName) ?? "public";
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
        select l.id, l.schedule_id, l.branch_name, l.modified_by,
               COALESCE(l.modifier_name, p.full_name) as modifier_name,
               l.changed_fields, l.created_at
        from ${schema}.schedule_edit_logs l
        left join ${schema}.profiles p on l.modified_by::text = p.id::text
        where l.schedule_id = $1 and l.branch_name = $2
        order by l.created_at desc
      `, [
            params.scheduleId,
            params.branchName
        ]);
        return rows;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            // 로그 테이블이 아직 없는 스키마는 빈 이력으로 처리
            return [];
        }
        throw err;
    }
}
async function updateSchedule(params) {
    const { id, branchName } = params;
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    const fields = [];
    const values = [];
    function push(field, value) {
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
    let before = null;
    try {
        const rowsBefore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`, [
            id,
            branchName
        ]);
        before = rowsBefore[0] ?? null;
    } catch (err) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
            throw err;
        }
        // 메타 컬럼이 없는 레거시 스키마인 경우, 수정 이력 로깅은 생략
        before = null;
    }
    const runFull = async ()=>{
        if (fields.length === 0) {
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`, [
                id,
                branchName
            ]);
            return rows[0] ?? null;
        }
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`update ${schema}.schedules set ${fields.join(", ")} where id = $${fields.length + 1} and branch_name = $${fields.length + 2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`, [
            ...values,
            id,
            branchName
        ]);
        return rows[0] ?? null;
    };
    const runLegacy = async ()=>{
        const legacyFields = [];
        const legacyValues = [];
        function legPush(field, value) {
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
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from ${schema}.schedules where id = $1 and branch_name = $2`, [
                id,
                branchName
            ]);
            const r = rows[0];
            if (!r) return null;
            return {
                ...r,
                category: LEGACY_TO_CATEGORY[r.category],
                dealer_name: null,
                location: null,
                instructor: null,
                target_audience: null,
                manager_name: null
            };
        }
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`update ${schema}.schedules set ${legacyFields.join(", ")} where id = $${legacyFields.length + 1} and branch_name = $${legacyFields.length + 2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`, [
            ...legacyValues,
            id,
            branchName
        ]);
        const r = rows[0];
        if (!r) return null;
        return {
            ...r,
            category: LEGACY_TO_CATEGORY[r.category],
            dealer_name: null,
            location: null,
            instructor: null,
            target_audience: null,
            manager_name: null
        };
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
                after: updated
            });
        }
        return updated;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
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
                    after: legacyUpdated
                });
            }
            return legacyUpdated;
        }
        throw err;
    }
}
async function deleteSchedule(params) {
    const { id, branchName, hardDelete } = params;
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    if (hardDelete) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`delete from ${schema}.schedules where id = $1 and branch_name = $2`, [
            id,
            branchName
        ]);
        return;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`update ${schema}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`, [
        id,
        branchName
    ]);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/api/schedules/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/schedules.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function PATCH(req, { params }) {
    const { id } = await params;
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
        });
    }
    const canEditSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
    if (!canEditSchedule) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "일정 수정 권한이 없습니다."
        }, {
            status: 403
        });
    }
    const branchName = user.profile?.branch_name;
    const profileId = user.profile?.id;
    const fullName = user.profile?.full_name ?? null;
    if (!branchName || !profileId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "지점 정보 또는 프로필 정보가 설정되지 않았습니다."
        }, {
            status: 400
        });
    }
    const body = await req.json().catch(()=>({}));
    const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSchedule"])({
        id,
        branchName,
        modifiedBy: profileId,
        modifiedByName: fullName,
        title: body.title,
        description: body.description,
        category: body.category,
        startAt: body.startAt,
        endAt: body.endAt,
        isAllDay: body.isAllDay,
        dealerName: body.dealerName,
        location: body.location,
        instructor: body.instructor,
        targetAudience: body.targetAudience,
        managerName: body.managerName
    });
    if (!updated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "해당 일정을 찾을 수 없습니다."
        }, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        schedule: updated
    });
}
async function DELETE(_req, { params }) {
    const { id } = await params;
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
        });
    }
    const canDeleteSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
    if (!canDeleteSchedule) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "일정 삭제 권한이 없습니다."
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
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteSchedule"])({
        id,
        branchName,
        hardDelete: user.role === "admin"
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ff49c8f8._.js.map