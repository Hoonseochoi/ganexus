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
        creator_name text,
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
        created_at timestamptz default timezone('utc'::text, now()),
        is_instructor boolean default false,
        instructor_color text
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
        author_name text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `),await r.query(`
      create table if not exists ${a}.branch_memos (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        content text not null,
        created_by uuid not null,
        author_name text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `),await r.query(`
      create table if not exists ${a}.schedule_edit_logs (
        id uuid default gen_random_uuid() primary key,
        schedule_id uuid not null,
        branch_name text not null,
        modified_by uuid not null,
        modifier_name text,
        changed_fields jsonb not null,
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
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),18140,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(76022),i=e.i(72707),o=e.i(63849),l=t([r,i,o]);async function s(e){let t=await (0,i.getCurrentUser)();if(!t||"admin"!==t.role)return n.NextResponse.json({message:"관리자 권한이 필요합니다."},{status:403});if(!t.profile?.branch_name)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let{profileId:a,action:l,managerCode:s}=await e.json();if(!a||!l||!["approve","reject"].includes(l))return n.NextResponse.json({message:"profileId와 action(approve|reject)을 보내주세요."},{status:400});let u=t.profile.branch_name,d=(await (0,r.query)("select id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code from public.profiles where id = $1",[a]))[0];if(!d)return n.NextResponse.json({message:"해당 신청을 찾을 수 없습니다."},{status:404});if(d.branch_name!==u)return n.NextResponse.json({message:"본인 지점의 신청만 처리할 수 있습니다."},{status:403});try{if("approve"===l){let e=(s??"").trim();if(""!==e){if((await (0,r.query)("select 1 from public.auth_users where login_id = $1",[e])).length>0)return n.NextResponse.json({message:"이미 사용 중인 매니저 코드입니다."},{status:409});await (0,r.query)(`update public.auth_users
           set login_id = $1, password = $1, role = 'manager', must_change_password = true
           where login_id = $2`,[e,d.login_id]),await (0,r.query)(`update public.profiles
           set login_id = $1, role = 'manager', manager_code = $2, is_approved = true
           where id = $3`,[e,e,a]);let i=t.profile?.tenant_schema;if(i){let e=(await (0,r.query)("select id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code from public.profiles where id = $1",[a]))[0];e&&await (0,o.addProfileToTenant)({tenantSchema:i,profileId:e.id,loginId:e.login_id,fullName:e.full_name,branchName:e.branch_name,phoneNumber:e.phone_number,role:e.role,isApproved:e.is_approved,managerCode:e.manager_code??void 0})}return n.NextResponse.json({ok:!0,message:"매니저로 승인되었습니다. 해당 매니저코드로 로그인할 수 있습니다."})}await (0,r.query)("update public.profiles set is_approved = true where id = $1",[a]);let i=t.profile?.tenant_schema;if(i){let e=(await (0,r.query)("select id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code from public.profiles where id = $1",[a]))[0];e&&await (0,o.addProfileToTenant)({tenantSchema:i,profileId:e.id,loginId:e.login_id,fullName:e.full_name,branchName:e.branch_name,phoneNumber:e.phone_number,role:e.role,isApproved:e.is_approved,managerCode:e.manager_code??void 0})}return n.NextResponse.json({ok:!0,message:"승인되었습니다."})}return await (0,r.query)("delete from public.auth_users where login_id = $1",[d.login_id]),await (0,r.query)("delete from public.profiles where id = $1",[a]),n.NextResponse.json({ok:!0,message:"거절 처리되었습니다."})}catch(e){return console.error("[admin/approvals]",e),n.NextResponse.json({message:"처리 중 오류가 발생했습니다."},{status:500})}}[r,i,o]=l.then?(await l)():l,e.s(["POST",()=>s]),a()}catch(e){a(e)}},!1),37018,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),_=e.i(66041),h=e.i(72827),f=e.i(33899),x=e.i(85787),g=e.i(93695);e.i(84790);var y=e.i(41779),b=e.i(18140),w=t([b]);[b]=w.then?(await w)():w;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/approvals/route",pathname:"/api/admin/approvals",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/admin/approvals/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:N,workUnitAsyncStorage:q,serverHooks:C}=$;function v(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:q})}async function R(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/admin/approvals/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:w,nextConfig:v,parsedUrl:R,isDraftMode:N,prerenderManifest:q,routerServerContext:C,isOnDemandRevalidate:E,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:j}=i,P=(0,u.normalizeAppPath)(n),I=!!(q.dynamicRoutes[P]||q.routes[k]),S=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,R,!1):t.end("This page could not be found"),null);if(I&&!N){let e=!!q.routes[k],t=q.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await S();throw new g.NoFallbackError}}let O=null;!I||$.isDev||N||(O=k,O="/index"===O?"/":O);let z=!0===$.isDev||!I,U=I&&!z;j&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:j});let H=e.method||"GET",D=(0,l.getTracer)(),M=D.getActiveScopeSpan(),F={params:w,prerenderManifest:q,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:z,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,C)},sharedContext:{buildId:b}},K=new d.NodeNextRequest(e),B=new d.NodeNextResponse(t),L=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(L,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=D.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${H} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${H} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&E&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=F.renderOpts.collectedTags;if(!I)return await (0,_.sendResponse)(K,B,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[x.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,r=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:E})},!1,C),t}},c=await $.handleResponse({req:e,nextConfig:v,cacheKey:O,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:q,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!I)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",E?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&I||p.delete(x.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(K,B,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};M?await u(M):await D.withPropagatedContext(e.headers,()=>D.trace(p.BaseServerSpan.handleRequest,{spanName:`${H} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:E})},!1,C),I)throw t;return await (0,_.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>R,"patchFetch",()=>v,"routeModule",()=>$,"serverHooks",()=>C,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>q]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd355492._.js.map