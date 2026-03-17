module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},95522,e=>e.a(async(t,a)=>{try{let t=await e.y("pg-d2edf3aec5ca8167");e.n(t),a()}catch(e){a(e)}},!0),54799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},72707,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(7017),i=t([n,r]);async function o(){let e=await (0,r.getCurrentSession)();if(!e)return null;let[t,a]=await Promise.all([(0,n.query)("select login_id, role from public.auth_users where login_id = $1",[e.loginId]),(0,n.query)("select * from public.profiles where login_id = $1",[e.loginId])]),i=t[0];if(!i)return null;let o=a[0]??null;return{loginId:i.login_id,role:i.role,profile:o}}[n,r]=i.then?(await i)():i,e.s(["getCurrentUser",()=>o]),a()}catch(e){a(e)}},!1),63849,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=t([n]);async function i(e){try{let t=await (0,n.query)("select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1",[e]);return t[0]?.tenant_schema??null}catch(e){if((0,n.isColumnNotFound)(e))return null;throw e}}async function o(e){let t,a=(t=e.employeeCode.replace(/[^a-zA-Z0-9]/g,"_").replace(/^_+|_+$/g,"")||"tenant",`t_${t}`.toLowerCase()),r=await n.pool.connect();try{await r.query(`create schema if not exists ${a}`),await r.query(`
      create table if not exists ${a}.schedules (
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
        created_at timestamptz default timezone('utc'::text, now()),
        is_soft_deleted boolean default false
      )
    `),await r.query(`
      create table if not exists ${a}.profiles (
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
    `),await r.query(`
      create table if not exists ${a}.invite_codes (
        id uuid default gen_random_uuid() primary key,
        code text unique not null,
        branch_name text not null,
        created_by uuid not null,
        max_uses int,
        used_count int default 0,
        expires_at timestamptz,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `),await r.query(`
      create table if not exists ${a}.notices (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        body text,
        image_url text,
        created_by uuid not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `),await r.query(`
      create table if not exists ${a}.branch_memos (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        content text not null,
        created_by uuid not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `),await r.query(`
      create table if not exists ${a}.notice_reads (
        id uuid default gen_random_uuid() primary key,
        notice_id uuid not null,
        profile_id uuid not null,
        read_at timestamptz default timezone('utc'::text, now()),
        unique(notice_id, profile_id)
      )
    `),await r.query(`insert into ${a}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,[e.profileId,e.employeeCode,e.fullName,e.branchName,e.phoneNumber,e.company??null,e.email??null]),await r.query("update public.profiles set tenant_schema = $1 where login_id = $2",[a,e.employeeCode])}finally{r.release()}return a}async function l(e){await (0,n.query)(`insert into ${e.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),74362,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(76022),i=e.i(72707),o=e.i(63849),l=t([r,i,o]);async function s(e){let t=await (0,i.getCurrentUser)();if(!t||"admin"!==t.role)return n.NextResponse.json({message:"관리자 권한이 필요합니다."},{status:403});let{managerCode:a,fullName:l,branchName:s}=await e.json(),u=(a??"").trim(),d=(l??"").trim(),c=(s??"").trim();if(!u)return n.NextResponse.json({message:"매니저 코드를 입력해주세요."},{status:400});if(!d)return n.NextResponse.json({message:"이름을 입력해주세요."},{status:400});if(!c)return n.NextResponse.json({message:"지점명을 입력해주세요."},{status:400});try{if((await (0,r.query)("select 1 from public.auth_users where login_id = $1",[u])).length>0)return n.NextResponse.json({message:"이미 사용 중인 매니저 코드입니다."},{status:409});await (0,r.query)(`insert into public.auth_users (login_id, password, role, must_change_password)
       values ($1, $2, 'manager', true)`,[u,u]);let e=(await (0,r.query)(`insert into public.profiles (login_id, full_name, branch_name, role, manager_code, is_approved)
       values ($1, $2, $3, 'manager', $4, true)
       returning id`,[u,d,c,u]))[0].id,a=t.profile?.tenant_schema;return a&&await (0,o.addProfileToTenant)({tenantSchema:a,profileId:e,loginId:u,fullName:d,branchName:c,phoneNumber:null,role:"manager",isApproved:!0,managerCode:u}),n.NextResponse.json({status:"ok",message:"매니저가 등록되었습니다. 해당 매니저코드로 로그인할 수 있습니다."})}catch(e){return console.error("[admin/managers/register]",e),n.NextResponse.json({message:"등록 처리 중 오류가 발생했습니다."},{status:500})}}[r,i,o]=l.then?(await l)():l,e.s(["POST",()=>s]),a()}catch(e){a(e)}},!1),91104,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),h=e.i(66041),_=e.i(72827),x=e.i(33899),f=e.i(85787),g=e.i(93695);e.i(84790);var y=e.i(41779),w=e.i(74362),b=t([w]);[w]=b.then?(await b)():b;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/managers/register/route",pathname:"/api/admin/managers/register",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/admin/managers/register/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:C,workUnitAsyncStorage:E,serverHooks:N}=$;function v(){return(0,i.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:E})}async function R(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/admin/managers/register/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:b,nextConfig:v,parsedUrl:R,isDraftMode:C,prerenderManifest:E,routerServerContext:N,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:P}=i,j=(0,u.normalizeAppPath)(n),S=!!(E.dynamicRoutes[j]||E.routes[k]),O=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,R,!1):t.end("This page could not be found"),null);if(S&&!C){let e=!!E.routes[k],t=E.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await O();throw new g.NoFallbackError}}let I=null;!S||$.isDev||C||(I=k,I="/index"===I?"/":I);let U=!0===$.isDev||!S,z=S&&!U;P&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:P});let H=e.method||"GET",D=(0,l.getTracer)(),M=D.getActiveScopeSpan(),F={params:b,prerenderManifest:E,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,N)},sharedContext:{buildId:w}},K=new d.NodeNextRequest(e),B=new d.NodeNextResponse(t),L=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(L,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=D.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&q&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=F.renderOpts.collectedTags;if(!S)return await (0,h.sendResponse)(K,B,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,r=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),t}},c=await $.handleResponse({req:e,nextConfig:v,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:E,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!S)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",q?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&S||p.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(K,B,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};M?await u(M):await D.withPropagatedContext(e.headers,()=>D.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),S)throw t;return await (0,h.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>R,"patchFetch",()=>v,"routeModule",()=>$,"serverHooks",()=>N,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>E]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__40f1852f._.js.map