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
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),56091,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(63849),i=t([n,r]);async function o(e){return await (0,n.query)(`
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
    `,[e])}[n,r]=i.then?(await i)():i,e.s(["listAllBranchMembers",()=>o]),a()}catch(e){a(e)}},!1),38110,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(72707),i=e.i(56091),o=e.i(76022),l=e.i(63849),s=t([r,i,o,l]);async function u(e){let t=await (0,r.getCurrentUser)();if(!t)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});if("admin"!==t.role&&"manager"!==t.role)return n.NextResponse.json({message:"매니저 리스트 조회 권한이 없습니다."},{status:403});let a=t.profile?.branch_name;if(!a)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let o=await (0,i.listAllBranchMembers)(a);return n.NextResponse.json({managers:o.map(e=>({id:e.id,name:e.full_name??"이름 없음",branch_name:e.branch_name,phone_number:e.phone_number,role:e.role,created_at:e.created_at})),canEdit:"admin"===t.role,currentUserId:t.profile?.id??null})}async function d(e){let t=await (0,r.getCurrentUser)();if(!t)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});if("admin"!==t.role)return n.NextResponse.json({message:"멤버 삭제는 관리자만 가능합니다."},{status:403});let a=t.profile?.branch_name;if(!a)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let{memberId:i}=await e.json().catch(()=>({}));if(!i)return n.NextResponse.json({message:"멤버 ID가 필요합니다."},{status:400});if(t.profile?.id===i)return n.NextResponse.json({message:"자기 자신은 삭제할 수 없습니다."},{status:400});let s=(await (0,o.query)(`
      select id, login_id, role
      from public.profiles
      where id = $1 and branch_name = $2
    `,[i,a]))[0];if(!s)return n.NextResponse.json({message:"해당 지점에서 찾을 수 없는 멤버입니다."},{status:404});if("admin"===s.role)return n.NextResponse.json({message:"관리자 계정은 여기서 삭제할 수 없습니다."},{status:400});let u=await (0,l.getTenantSchemaForBranch)(a)??"public";return await (0,o.query)(`
      delete from public.auth_users
      where login_id = $1
    `,[s.login_id]),await (0,o.query)(`delete from ${u}.profiles where id = $1`,[i]),await (0,o.query)("delete from public.profiles where id = $1",[i]),n.NextResponse.json({status:"ok"})}[r,i,o,l]=s.then?(await s)():s,e.s(["DELETE",()=>d,"GET",()=>u]),a()}catch(e){a(e)}},!1),9958,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),h=e.i(66041),_=e.i(72827),f=e.i(33899),x=e.i(85787),g=e.i(93695);e.i(84790);var y=e.i(41779),w=e.i(38110),b=t([w]);[w]=b.then?(await b)():b;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/admin/managers/route",pathname:"/api/admin/managers",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/admin/managers/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:E,workUnitAsyncStorage:C,serverHooks:N}=$;function v(){return(0,i.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:C})}async function R(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/admin/managers/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:b,nextConfig:v,parsedUrl:R,isDraftMode:E,prerenderManifest:C,routerServerContext:N,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:j}=i,P=(0,u.normalizeAppPath)(n),S=!!(C.dynamicRoutes[P]||C.routes[k]),I=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,R,!1):t.end("This page could not be found"),null);if(S&&!E){let e=!!C.routes[k],t=C.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await I();throw new g.NoFallbackError}}let O=null;!S||$.isDev||E||(O=k,O="/index"===O?"/":O);let U=!0===$.isDev||!S,z=S&&!U;j&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:j});let D=e.method||"GET",H=(0,l.getTracer)(),M=H.getActiveScopeSpan(),F={params:b,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,N)},sharedContext:{buildId:w}},B=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),L=c.NextRequestAdapter.fromNodeNextRequest(B,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(L,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${D} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${D} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&q&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=F.renderOpts.collectedTags;if(!S)return await (0,h.sendResponse)(B,K,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[x.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,r=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),t}},c=await $.handleResponse({req:e,nextConfig:v,cacheKey:O,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!S)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",q?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&S||p.delete(x.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(B,K,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};M?await u(M):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${D} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),S)throw t;return await (0,h.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>R,"patchFetch",()=>v,"routeModule",()=>$,"serverHooks",()=>N,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__48ade09f._.js.map