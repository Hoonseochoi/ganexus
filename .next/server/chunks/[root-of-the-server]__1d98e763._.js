module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},95522,e=>e.a(async(t,a)=>{try{let t=await e.y("pg-d2edf3aec5ca8167");e.n(t),a()}catch(e){a(e)}},!0),63849,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=t([n]);async function i(e){try{let t=await (0,n.query)("select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1",[e]);return t[0]?.tenant_schema??null}catch(e){if((0,n.isColumnNotFound)(e))return null;throw e}}async function o(e){let t,a=(t=e.employeeCode.replace(/[^a-zA-Z0-9]/g,"_").replace(/^_+|_+$/g,"")||"tenant",`t_${t}`.toLowerCase()),r=await n.pool.connect();try{await r.query(`create schema if not exists ${a}`),await r.query(`
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
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),96929,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(76022),i=e.i(63849),o=t([r,i]);async function l(e){try{let t,a=await e.json().catch(()=>({})),o=(a.company??"").trim(),l=(a.fullName??"").trim(),s=(a.branchName??"").trim(),u=(a.employeeCode??"").trim(),d=(a.phoneNumber??"").trim(),c=(a.email??"").trim();if(!u)return n.NextResponse.json({message:"사번 코드를 입력해주세요."},{status:400});if(!l)return n.NextResponse.json({message:"성함을 입력해주세요."},{status:400});if(!s)return n.NextResponse.json({message:"지점명을 입력해주세요."},{status:400});if(!d)return n.NextResponse.json({message:"휴대폰 번호를 입력해주세요."},{status:400});if(!c)return n.NextResponse.json({message:"이메일을 입력해주세요."},{status:400});if((await (0,r.query)("select login_id from public.auth_users where login_id = $1",[u])).length>0)return n.NextResponse.json({message:"이미 사용 중인 사번입니다."},{status:409});await (0,r.query)(`insert into public.auth_users (login_id, password, role, must_change_password)
       values ($1, $2, 'admin', true)`,[u,u]);try{t=(await (0,r.query)(`insert into public.profiles (login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
         values ($1, $2, $3, $4, 'admin', true, $5, $6)
         returning id`,[u,l,s,d.replace(/-/g,""),o||null,c||null]))[0].id}catch(e){if((0,r.isColumnNotFound)(e))t=(await (0,r.query)(`insert into public.profiles (login_id, full_name, branch_name, phone_number, role, is_approved)
           values ($1, $2, $3, $4, 'admin', true)
           returning id`,[u,l,s,d.replace(/-/g,"")]))[0].id;else throw e}try{await (0,i.createTenantForAdmin)({employeeCode:u,branchName:s,fullName:l,phoneNumber:d.replace(/-/g,""),company:o||null,email:c||null,profileId:t})}catch(e){return console.error("[auth/admin-signup] tenant 생성 실패",e),n.NextResponse.json({message:"테넌트 생성 중 오류가 발생했습니다. 관리자에게 문의해주세요."},{status:500})}return n.NextResponse.json({status:"ok",message:"가입이 완료되었습니다. 로그인에서 사번(ID·PW 동일)으로 접속 후 비밀번호를 변경해주세요."})}catch(e){return console.error("[auth/admin-signup]",e),n.NextResponse.json({message:"가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."},{status:500})}}[r,i]=o.then?(await o)():o,e.s(["POST",()=>l]),a()}catch(e){a(e)}},!1),13149,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),_=e.i(66041),h=e.i(72827),x=e.i(33899),f=e.i(85787),g=e.i(93695);e.i(84790);var y=e.i(41779),b=e.i(96929),w=t([b]);[b]=w.then?(await w)():w;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/auth/admin-signup/route",pathname:"/api/auth/admin-signup",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/auth/admin-signup/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:N,workUnitAsyncStorage:E,serverHooks:C}=$;function v(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:E})}async function R(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/auth/admin-signup/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:w,nextConfig:v,parsedUrl:R,isDraftMode:N,prerenderManifest:E,routerServerContext:C,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:j}=i,P=(0,u.normalizeAppPath)(n),O=!!(E.dynamicRoutes[P]||E.routes[k]),S=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,R,!1):t.end("This page could not be found"),null);if(O&&!N){let e=!!E.routes[k],t=E.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await S();throw new g.NoFallbackError}}let z=null;!O||$.isDev||N||(z=k,z="/index"===z?"/":z);let I=!0===$.isDev||!O,H=O&&!I;j&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:j});let U=e.method||"GET",D=(0,l.getTracer)(),F=D.getActiveScopeSpan(),M={params:w,prerenderManifest:E,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,C)},sharedContext:{buildId:b}},K=new d.NodeNextRequest(e),B=new d.NodeNextResponse(t),L=c.NextRequestAdapter.fromNodeNextRequest(K,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(L,M).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=D.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${U} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${U} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&q&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=M.renderOpts.fetchMetrics;let l=M.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=M.renderOpts.collectedTags;if(!O)return await (0,_.sendResponse)(K,B,n,M.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,r=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,C),t}},c=await $.handleResponse({req:e,nextConfig:v,cacheKey:z,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:E,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!O)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",q?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&O||p.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(K,B,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};F?await u(F):await D.withPropagatedContext(e.headers,()=>D.trace(p.BaseServerSpan.handleRequest,{spanName:`${U} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,C),O)throw t;return await (0,_.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>R,"patchFetch",()=>v,"routeModule",()=>$,"serverHooks",()=>C,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>E]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d98e763._.js.map