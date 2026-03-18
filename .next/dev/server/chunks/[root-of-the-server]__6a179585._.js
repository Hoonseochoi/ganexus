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
const DB_QUERY_SLOW_MS = Number(process.env.DB_QUERY_SLOW_MS ?? 200);
if (!connectionString) {
    // 실제 런타임에서는 .env.local 에서 설정해야 함
    console.warn("[db] NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.");
}
const pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
});
function compactSql(sql) {
    return sql.replace(/\s+/g, " ").trim().slice(0, 220);
}
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
    const startedAt = Date.now();
    try {
        const result = await client.query(text, params);
        const elapsedMs = Date.now() - startedAt;
        if (elapsedMs >= DB_QUERY_SLOW_MS) {
            console.warn(`[db] slow query ${elapsedMs}ms :: ${compactSql(text)}`);
        }
        return result.rows;
    } catch (err) {
        const elapsedMs = Date.now() - startedAt;
        console.error(`[db] query failed after ${elapsedMs}ms :: ${compactSql(text)}`);
        throw err;
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
        created_at timestamptz default timezone('utc'::text, now()),
        is_instructor boolean default false,
        instructor_color text
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
    "getScheduleById",
    ()=>getScheduleById,
    "getScheduleEditLogs",
    ()=>getScheduleEditLogs,
    "invalidateScheduleListCache",
    ()=>invalidateScheduleListCache,
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
const SCHEDULE_LIST_CACHE_TTL_MS = Number(process.env.SCHEDULE_LIST_CACHE_TTL_MS ?? 15_000);
const SCHEDULE_LIST_CACHE_MAX_ENTRIES = Number(process.env.SCHEDULE_LIST_CACHE_MAX_ENTRIES ?? 200);
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
const scheduleListCache = new Map();
function buildScheduleListCacheKey(args) {
    const branch = encodeURIComponent(args.branchName);
    const from = encodeURIComponent(args.from ?? "");
    const to = encodeURIComponent(args.to ?? "");
    return `schema=${args.schema}|branch=${branch}|from=${from}|to=${to}`;
}
function getScheduleListFromCache(key) {
    const entry = scheduleListCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
        scheduleListCache.delete(key);
        return null;
    }
    return entry.rows;
}
function setScheduleListCache(key, rows) {
    if (scheduleListCache.size >= SCHEDULE_LIST_CACHE_MAX_ENTRIES) {
        const oldestKey = scheduleListCache.keys().next().value;
        if (oldestKey) scheduleListCache.delete(oldestKey);
    }
    scheduleListCache.set(key, {
        expiresAt: Date.now() + SCHEDULE_LIST_CACHE_TTL_MS,
        rows
    });
}
function invalidateScheduleListCache(branchName) {
    if (!branchName) {
        scheduleListCache.clear();
        return;
    }
    const branchMarker = `branch=${encodeURIComponent(branchName)}|`;
    for (const key of scheduleListCache.keys()){
        if (key.includes(branchMarker)) {
            scheduleListCache.delete(key);
        }
    }
}
async function listSchedulesForBranch(params) {
    const { branchName, from, to } = params;
    const tenantSchema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName);
    const schema = tenantSchema ?? "public";
    console.log(`[schedules] listSchedulesForBranch: branch=${branchName}, schema=${schema}`);
    const cacheKey = buildScheduleListCacheKey({
        schema,
        branchName,
        from,
        to
    });
    const cachedRows = getScheduleListFromCache(cacheKey);
    if (cachedRows) {
        return cachedRows;
    }
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
        select s.id, s.branch_name, s.title, s.description, s.category,
               s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
               s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
               p1.full_name as creator_full_name,
               p3.instructor_color as instructor_color,
               p2.full_name as target_full_name
        from ${schema}.schedules s
        left join public.profiles p1 on s.created_by::text = p1.id::text
        left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
        left join public.profiles p3 on s.instructor = p3.full_name and s.branch_name = p3.branch_name and p3.is_instructor = true
        where s.${where}
        order by s.is_soft_deleted asc, s.start_at asc
      `, values);
        const mappedRows = rows.map((r)=>({
                ...r,
                category: LEGACY_TO_CATEGORY[r.category] || r.category
            }));
        setScheduleListCache(cacheKey, mappedRows);
        return mappedRows;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다.");
            setScheduleListCache(cacheKey, []);
            return [];
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
            console.warn("[schedules] listSchedulesForBranch: 컬럼 누락 → instructor만 읽는 최소 쿼리로 재시도");
            try {
                const mid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
            select s.id, s.branch_name, s.title, s.description, s.category,
                   s.instructor,
                   s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                   p1.full_name as creator_full_name
            from ${schema}.schedules s
            left join public.profiles p1 on s.created_by::text = p1.id::text
            where s.${where}
            order by s.start_at asc
          `, values);
                const mappedMid = mid.map((r)=>({
                        ...r,
                        category: LEGACY_TO_CATEGORY[r.category] || r.category,
                        dealer_name: null,
                        location: null,
                        instructor: r.instructor,
                        target_audience: null,
                        manager_name: null,
                        instructor_color: null,
                        is_soft_deleted: false,
                        target_full_name: null,
                        target_avatar_url: null
                    }));
                setScheduleListCache(cacheKey, mappedMid);
                return mappedMid;
            } catch (err2) {
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err2) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err2)) throw err2;
            }
            console.warn("[schedules] listSchedulesForBranch: instructor 컬럼도 없음 → 풀 레거시 폴백");
            const legacy = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`
          select s.id, s.branch_name, s.title, s.description, s.category,
                 s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                 p.full_name as creator_full_name
          from ${schema}.schedules s
          left join public.profiles p on s.created_by::text = p.id::text
          where s.${where}
          order by s.start_at asc
        `, values);
            const mappedLegacy = legacy.map((r)=>({
                    ...r,
                    category: LEGACY_TO_CATEGORY[r.category] || r.category,
                    dealer_name: null,
                    location: null,
                    instructor: null,
                    target_audience: null,
                    manager_name: r.category === "vacation" ? r.title : null,
                    target_full_name: r.category === "vacation" ? r.title : null,
                    target_avatar_url: null
                }));
            setScheduleListCache(cacheKey, mappedLegacy);
            return mappedLegacy;
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
        invalidateScheduleListCache(input.branchName);
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
            invalidateScheduleListCache(input.branchName);
            return {
                ...r,
                category,
                dealer_name: null,
                location: null,
                instructor: null,
                target_audience: null,
                manager_name: null,
                target_full_name: null,
                target_avatar_url: null
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
        left join public.profiles p on l.modified_by::text = p.id::text
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
    const requestedUpdate = params.title !== undefined || params.description !== undefined || params.category !== undefined || params.dealerName !== undefined || params.location !== undefined || params.instructor !== undefined || params.targetAudience !== undefined || params.managerName !== undefined || params.startAt !== undefined || params.endAt !== undefined || params.isAllDay !== undefined;
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
                manager_name: null,
                target_full_name: null,
                target_avatar_url: null
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
            manager_name: null,
            target_full_name: null,
            target_avatar_url: null
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
        if (updated && requestedUpdate) {
            invalidateScheduleListCache(branchName);
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
            if (legacyUpdated && requestedUpdate) {
                invalidateScheduleListCache(branchName);
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
        invalidateScheduleListCache(branchName);
        return;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`update ${schema}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`, [
        id,
        branchName
    ]);
    invalidateScheduleListCache(branchName);
}
async function getScheduleById(params) {
    const { id, branchName } = params;
    const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$tenant$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTenantSchemaForBranch"])(branchName) ?? "public";
    try {
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select s.id, s.branch_name, s.title, s.description, s.category,
              s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
              s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
              p1.full_name as creator_full_name,
              p3.instructor_color as instructor_color,
              p2.full_name as target_full_name
       from ${schema}.schedules s
       left join public.profiles p1 on s.created_by::text = p1.id::text
       left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
       left join public.profiles p3 on s.instructor = p3.full_name and s.branch_name = p3.branch_name and p3.is_instructor = true
       where s.id = $1 and s.branch_name = $2
       limit 1`, [
            id,
            branchName
        ]);
        return rows[0] ?? null;
    } catch (err) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err)) {
            console.warn("[schedules] schedules 테이블이 없어 null을 반환합니다.");
            return null;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err)) {
            console.warn("[schedules] getScheduleById: 컬럼 누락 → instructor만 읽는 최소 쿼리로 재시도");
            try {
                const midRows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select s.id, s.branch_name, s.title, s.description, s.category,
                  s.instructor,
                  s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                  p1.full_name as creator_full_name
           from ${schema}.schedules s
           left join public.profiles p1 on s.created_by::text = p1.id::text
           where s.id = $1 and s.branch_name = $2
           limit 1`, [
                    id,
                    branchName
                ]);
                const r = midRows[0];
                if (!r) return null;
                return {
                    ...r,
                    category: LEGACY_TO_CATEGORY[r.category] || r.category,
                    dealer_name: null,
                    location: null,
                    instructor: r.instructor,
                    target_audience: null,
                    manager_name: null,
                    instructor_color: null,
                    is_soft_deleted: false,
                    target_full_name: null,
                    target_avatar_url: null
                };
            } catch (err2) {
                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isColumnNotFound"])(err2) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRelationNotFound"])(err2)) throw err2;
            }
            console.warn("[schedules] getScheduleById: instructor 컬럼도 없음 → 풀 레거시 폴백");
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(`select s.id, s.branch_name, s.title, s.description, s.category,
                s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                p.full_name as creator_full_name
         from ${schema}.schedules s
         left join public.profiles p on s.created_by::text = p.id::text
         where s.id = $1 and s.branch_name = $2
         limit 1`, [
                id,
                branchName
            ]);
            const r = rows[0];
            if (!r) return null;
            return {
                ...r,
                category: LEGACY_TO_CATEGORY[r.category] || r.category,
                dealer_name: null,
                location: null,
                instructor: null,
                target_audience: null,
                manager_name: r.category === "vacation" ? r.title : null,
                target_full_name: r.category === "vacation" ? r.title : null,
                target_avatar_url: null
            };
        }
        throw err;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/calendar/month-view.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCalendarMonthData",
    ()=>buildCalendarMonthData,
    "getCalendarFetchRange",
    ()=>getCalendarFetchRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$korean$2d$holidays$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/korean-holidays/dist/index.mjs [app-route] (ecmascript)");
;
function getKoreaNow() {
    const now = new Date();
    const koreaString = now.toLocaleString("en-US", {
        timeZone: "Asia/Seoul"
    });
    return new Date(koreaString);
}
function getKoreaDateFromISO(iso) {
    const date = new Date(iso);
    const koreaString = date.toLocaleString("en-US", {
        timeZone: "Asia/Seoul"
    });
    return new Date(koreaString);
}
function getCalendarFetchRange(year, month) {
    const fromDate = new Date(year, month, 1);
    fromDate.setDate(fromDate.getDate() - 7);
    const toDate = new Date(year, month + 1, 0, 23, 59, 59);
    toDate.setDate(toDate.getDate() + 7);
    return {
        from: fromDate.toISOString(),
        to: toDate.toISOString()
    };
}
function mapScheduleItem(schedule) {
    return {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        start_at: schedule.start_at,
        end_at: schedule.end_at,
        is_all_day: schedule.is_all_day,
        category: schedule.category,
        dealer_name: schedule.dealer_name ?? null,
        location: schedule.location ?? null,
        instructor: schedule.instructor ?? null,
        target_audience: schedule.target_audience ?? null,
        manager_name: schedule.manager_name ?? null,
        is_soft_deleted: schedule.is_soft_deleted ?? false,
        creator_full_name: schedule.creator_full_name ?? null,
        creator_avatar_url: schedule.creator_avatar_url ?? null,
        target_full_name: schedule.target_full_name ?? null,
        target_avatar_url: schedule.target_avatar_url ?? null,
        instructor_color: schedule.instructor_color ?? null
    };
}
function buildCalendarMonthData(args) {
    const { year, month, schedules } = args;
    const now = getKoreaNow();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();
    const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, "0")}-${String(todayDate).padStart(2, "0")}`;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const mobileMonthLabel = new Date(year, month + 1, 0).toLocaleString("ko-KR", {
        month: "long",
        year: "numeric"
    });
    const holidaysForYear = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$korean$2d$holidays$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHolidays"])(year);
    const holidaySet = new Set(holidaysForYear.map((holiday)=>holiday.date.toISOString().slice(0, 10)));
    const uniqueSchedules = [];
    const seenScheduleIds = new Set();
    for (const schedule of schedules){
        if (seenScheduleIds.has(schedule.id)) continue;
        seenScheduleIds.add(schedule.id);
        uniqueSchedules.push(schedule);
    }
    const eventsByDay = new Map();
    const eventsByDateStr = {};
    for (const schedule of uniqueSchedules){
        const date = getKoreaDateFromISO(schedule.start_at);
        if (date.getFullYear() !== year || date.getMonth() !== month) continue;
        const day = date.getDate();
        const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const item = mapScheduleItem(schedule);
        if (!eventsByDay.has(day)) eventsByDay.set(day, []);
        eventsByDay.get(day).push(item);
        if (!eventsByDateStr[iso]) eventsByDateStr[iso] = [];
        eventsByDateStr[iso].push(item);
    }
    const daysToShow = [];
    for(let day = 1; day <= lastDate; day++){
        const weekday = new Date(year, month, day).getDay();
        if (weekday >= 1 && weekday <= 5) daysToShow.push(day);
    }
    const firstWeekdayInMonth = daysToShow.length ? new Date(year, month, daysToShow[0]).getDay() : 1;
    const offset = firstWeekdayInMonth - 1;
    const totalCells = Math.ceil((offset + daysToShow.length) / 5) * 5;
    const cells = [];
    let key = 0;
    for(let index = 0; index < offset; index++){
        cells.push({
            key: key++,
            day: null,
            dateISO: null,
            isToday: false,
            isSunday: false,
            isSaturday: false,
            isHoliday: false
        });
    }
    for (const dayNumber of daysToShow){
        const date = new Date(year, month, dayNumber);
        const weekday = date.getDay();
        const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
        cells.push({
            key: key++,
            day: dayNumber,
            dateISO: iso,
            isToday: year === todayYear && month === todayMonth && dayNumber === todayDate,
            isSunday: weekday === 0,
            isSaturday: weekday === 6,
            isHoliday: holidaySet.has(iso)
        });
    }
    for(let index = offset + daysToShow.length; index < totalCells; index++){
        cells.push({
            key: key++,
            day: null,
            dateISO: null,
            isToday: false,
            isSunday: false,
            isSaturday: false,
            isHoliday: false
        });
    }
    return {
        year,
        month,
        todayStr,
        mobileMonthLabel,
        cells,
        eventsByDay: Object.fromEntries(Array.from(eventsByDay.entries()).map(([day, list])=>[
                String(day),
                list
            ])),
        eventsByDateStr
    };
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/api/schedules/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/engines/schedules.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$calendar$2f$month$2d$view$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/calendar/month-view.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
async function GET(req) {
    const startedAt = Date.now();
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
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
    const { searchParams } = new URL(req.url);
    const requestedYear = Number(searchParams.get("year"));
    const requestedMonth = Number(searchParams.get("month"));
    const hasMonthRequest = Number.isInteger(requestedYear) && Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12;
    let from = searchParams.get("from") ?? undefined;
    let to = searchParams.get("to") ?? undefined;
    if (hasMonthRequest && (!from || !to)) {
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$calendar$2f$month$2d$view$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCalendarFetchRange"])(requestedYear, requestedMonth - 1);
        from = from ?? range.from;
        to = to ?? range.to;
    }
    const schedules = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listSchedulesForBranch"])({
        branchName,
        from,
        to
    });
    const elapsedMs = Date.now() - startedAt;
    const payload = {
        schedules
    };
    if (hasMonthRequest) {
        payload.monthData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$calendar$2f$month$2d$view$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCalendarMonthData"])({
            year: requestedYear,
            month: requestedMonth - 1,
            schedules
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(payload, {
        headers: {
            "Cache-Control": "private, max-age=30",
            "Server-Timing": `app;dur=${elapsedMs}`,
            "X-Response-Time": `${elapsedMs}ms`
        }
    });
}
async function POST(req) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "인증이 필요합니다."
        }, {
            status: 401
        });
    }
    // 일정 생성: admin / manager / agent(승인된 에이전트) 동일 권한
    const canCreateSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
    if (!canCreateSchedule) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "일정 생성 권한이 없습니다."
        }, {
            status: 403
        });
    }
    const profile = user.profile;
    if (!profile?.branch_name || !profile.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "지점 정보가 설정되지 않았습니다."
        }, {
            status: 400
        });
    }
    const body = await req.json().catch(()=>({}));
    if (!body.title?.trim()) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "제목을 입력해주세요."
        }, {
            status: 400
        });
    }
    const now = new Date();
    const startAt = body.startAt ?? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
    const created = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$engines$2f$schedules$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSchedule"])({
        branchName: profile.branch_name,
        title: body.title.trim(),
        description: body.description ?? null,
        category: body.category,
        startAt,
        endAt: body.endAt,
        isAllDay: body.isAllDay ?? false,
        dealerName: body.dealerName ?? null,
        location: body.location ?? null,
        instructor: body.instructor ?? null,
        targetAudience: body.targetAudience ?? null,
        managerName: body.managerName ?? null,
        createdByProfileId: profile.id
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        schedule: created
    }, {
        status: 201
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6a179585._.js.map