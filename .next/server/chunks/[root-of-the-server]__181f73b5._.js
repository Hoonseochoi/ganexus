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
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),72250,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(63849),i=e.i(76022),o=t([r,i]);function l(e){return e.replace(/\s+/g,"").trim().toLowerCase()}async function s(e){let{code:t,fullName:a,birthDate:o,phoneNumber:s,managerCode:u}=await e.json(),d=(u??"").trim();if(!t||!a||!o||!s||!d)return n.NextResponse.json({message:"매니저 코드, 초대 코드, 성함, 생년월일, 휴대폰 번호를 모두 입력해주세요."},{status:400});let c=s.replace(/\D/g,"");if(c.length<8)return n.NextResponse.json({message:"휴대폰 번호 형식이 올바르지 않습니다."},{status:400});if(!/^[0-9]{6}$/.test(o))return n.NextResponse.json({message:"생년월일은 YYMMDD 6자리로 입력해주세요."},{status:400});let p=(await (0,i.query)("select * from public.invite_codes where code = $1",[t]))[0];if(!p)return n.NextResponse.json({message:"유효하지 않은 초대 코드입니다."},{status:404});let m=Date.now();if(p.expires_at&&new Date(p.expires_at).getTime()<m)return n.NextResponse.json({message:"만료된 초대 코드입니다."},{status:410});if(null!==p.max_uses&&p.used_count>=p.max_uses)return n.NextResponse.json({message:"사용 가능한 횟수를 모두 소진한 초대 코드입니다."},{status:409});let _=await i.pool.connect(),h=null,x=!1;try{await _.query("begin");let e=await _.query("select 1 from public.auth_users where login_id = $1",[d]);if(e.rowCount&&e.rowCount>0)return await _.query("rollback"),n.NextResponse.json({message:"이미 사용 중인 매니저 코드입니다. 다른 코드를 입력해주세요."},{status:409});let r=null,s=!1,u=!1;try{let e=(await _.query(`
          select manager_code, manager_name, branch_name, is_active, claimed_profile_id
          from public.manager_code_registry
          where manager_code = $1
          limit 1
        `,[d])).rows[0]??null;e&&e.is_active&&null===e.claimed_profile_id&&e.branch_name===p.branch_name&&(s=!0,(u=l(a)===l(e.manager_name))&&(r=e))}catch(e){if(!(0,i.isRelationNotFound)(e))throw e;r=null}if(s&&!u)return await _.query("rollback"),n.NextResponse.json({message:"이름과 코드가 일치하지않습니다."},{status:400});if(x=null!==r,await _.query(`
        insert into public.auth_users (login_id, password, role, must_change_password, branch_name, invite_code)
        values ($1, $2, 'manager', true, $3, $4)
        on conflict (login_id)
        do update set role = 'manager',
                     must_change_password = true,
                     password = $2,
                     branch_name = $3,
                     invite_code = $4
      `,[d,d,p.branch_name,t]),h=(await _.query(`
        insert into public.profiles (login_id, full_name, branch_name, birth_date, phone_number, role, is_approved, manager_code, invite_code)
        values ($1, $2, $3, $4, $5, 'manager', $6, $1, $7)
        on conflict (login_id)
        do update set full_name = excluded.full_name,
                    branch_name = excluded.branch_name,
                    birth_date = excluded.birth_date,
                    phone_number = excluded.phone_number,
                    role = 'manager',
                    is_approved = excluded.is_approved,
                    manager_code = excluded.manager_code,
                    invite_code = excluded.invite_code
        returning id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code
      `,[d,a,p.branch_name,o,c,x,t])).rows[0]??null,x&&h&&((await _.query(`
          update public.manager_code_registry
          set claimed_profile_id = $2,
              claimed_at = timezone('utc'::text, now()),
              updated_at = timezone('utc'::text, now())
          where manager_code = $1
            and branch_name = $3
            and is_active = true
            and claimed_profile_id is null
        `,[d,h.id,p.branch_name])).rowCount??0)===0)throw Error("MANAGER_CODE_ALREADY_CLAIMED");await _.query("update public.invite_codes set used_count = used_count + 1 where id = $1",[p.id]),await _.query("commit")}catch(e){if(await _.query("rollback"),e instanceof Error&&"MANAGER_CODE_ALREADY_CLAIMED"===e.message)return n.NextResponse.json({message:"이미 사용된 사전등록 매니저 코드입니다. 관리자에게 문의해주세요."},{status:409});throw e}finally{_.release()}if(x&&h)try{let e=await (0,r.getTenantSchemaForBranch)(p.branch_name);e&&await (0,r.addProfileToTenant)({tenantSchema:e,profileId:h.id,loginId:h.login_id,fullName:h.full_name,branchName:h.branch_name,phoneNumber:h.phone_number,role:h.role,isApproved:!0,managerCode:h.manager_code})}catch(e){console.error("[agent/apply] tenant sync failed after auto-approval",e)}return n.NextResponse.json({status:"ok",loginId:d,autoApproved:x,message:x?"사전등록된 매니저 코드가 확인되어 즉시 승인되었습니다. 매니저 코드(ID·PW 동일)로 바로 로그인할 수 있습니다.":"지점장 승인 후 매니저 로그인에서 해당 코드(ID·PW 동일)로 접속할 수 있습니다."})}[r,i]=o.then?(await o)():o,e.s(["POST",()=>s]),a()}catch(e){a(e)}},!1),17103,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),_=e.i(66041),h=e.i(72827),x=e.i(33899),f=e.i(85787),g=e.i(93695);e.i(84790);var y=e.i(41779),w=e.i(72250),b=t([w]);[w]=b.then?(await b)():b;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/agent/apply/route",pathname:"/api/agent/apply",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/agent/apply/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:E,workUnitAsyncStorage:C,serverHooks:N}=$;function v(){return(0,i.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:C})}async function R(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/agent/apply/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:b,nextConfig:v,parsedUrl:R,isDraftMode:E,prerenderManifest:C,routerServerContext:N,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:j}=i,D=(0,u.normalizeAppPath)(n),P=!!(C.dynamicRoutes[D]||C.routes[k]),I=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,R,!1):t.end("This page could not be found"),null);if(P&&!E){let e=!!C.routes[k],t=C.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await I();throw new g.NoFallbackError}}let O=null;!P||$.isDev||E||(O=k,O="/index"===O?"/":O);let S=!0===$.isDev||!P,z=P&&!S;j&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:j});let M=e.method||"GET",H=(0,l.getTracer)(),U=H.getActiveScopeSpan(),F={params:b,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:S,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,N)},sharedContext:{buildId:w}},L=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),B=c.NextRequestAdapter.fromNodeNextRequest(L,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(B,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${M} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&q&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=F.renderOpts.collectedTags;if(!P)return await (0,_.sendResponse)(L,K,n,F.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,r=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:y.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),t}},c=await $.handleResponse({req:e,nextConfig:v,cacheKey:O,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!P)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==y.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",q?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&P||p.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,x.getCacheControlHeader)(c.cacheControl)),await (0,_.sendResponse)(L,K,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};U?await u(U):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${M} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:q})},!1,N),P)throw t;return await (0,_.sendResponse)(L,K,new Response(null,{status:500})),null}}e.s(["handler",()=>R,"patchFetch",()=>v,"routeModule",()=>$,"serverHooks",()=>N,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__181f73b5._.js.map