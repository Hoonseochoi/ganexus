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
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>l,"createTenantForAdmin",()=>o,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),9458,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(63849),i=t([n,r]);async function o(e){return await (0,r.getTenantSchemaForBranch)(e)??"public"}async function l(e){let t=await o(e);try{return(await (0,n.query)(`
        select id, branch_name, title, body, image_url, created_by, created_at
        from ${t}.notices
        where branch_name = $1
        order by created_at desc
        limit 1
      `,[e]))[0]??null}catch(e){if((0,n.isRelationNotFound)(e))return console.warn("[notices] notices 테이블이 없습니다."),null;throw e}}async function s(e,t){let a=await o(t);try{return(await (0,n.query)(`
        select id, branch_name, title, body, image_url, created_by, created_at
        from ${a}.notices
        where id = $1 and branch_name = $2
      `,[e,t]))[0]??null}catch(e){if((0,n.isRelationNotFound)(e))return null;throw e}}async function u(e){let t=await o(e.branchName);return(await (0,n.query)(`
      insert into ${t}.notices (branch_name, title, body, image_url, created_by)
      values ($1, $2, $3, $4, $5)
      returning id, branch_name, title, body, image_url, created_by, created_at
    `,[e.branchName,e.title,e.body??null,e.imageUrl??null,e.createdByProfileId]))[0]}async function d(e){let{id:t,branchName:a}=e,r=await o(a),i=[],l=[];if(void 0!==e.title&&(i.push(`title = $${l.length+1}`),l.push(e.title)),void 0!==e.body&&(i.push(`body = $${l.length+1}`),l.push(e.body)),void 0!==e.imageUrl&&(i.push(`image_url = $${l.length+1}`),l.push(e.imageUrl)),0===i.length)return s(t,a);try{return(await (0,n.query)(`
        update ${r}.notices
        set ${i.join(", ")}
        where id = $${l.length+1} and branch_name = $${l.length+2}
        returning id, branch_name, title, body, image_url, created_by, created_at
      `,[...l,t,a]))[0]??null}catch(e){if((0,n.isRelationNotFound)(e))return null;throw e}}async function c(e){let t=await o(e.branchName);await (0,n.query)(`
      insert into ${t}.notice_reads (notice_id, profile_id)
      values ($1, $2)
      on conflict (notice_id, profile_id) do nothing
    `,[e.noticeId,e.profileId])}async function p(e,t,a){let r=await o(e);try{return(await (0,n.query)(`select id from ${r}.notice_reads where notice_id = $1 and profile_id = $2`,[t,a])).length>0}catch(e){if((0,n.isRelationNotFound)(e))return!1;throw e}}async function m(e,t){let a=await o(e);try{return await (0,n.query)(`
        select nr.id, nr.notice_id, nr.profile_id, nr.read_at, p.full_name
        from ${a}.notice_reads nr
        left join ${a}.profiles p on p.id = nr.profile_id
        where nr.notice_id = $1
        order by nr.read_at asc
      `,[t])}catch(e){if((0,n.isRelationNotFound)(e))return[];throw e}}[n,r]=i.then?(await i)():i,e.s(["createNotice",()=>u,"getLatestNoticeForBranch",()=>l,"getNoticeById",()=>s,"getNoticeReads",()=>m,"hasReadNotice",()=>p,"markNoticeRead",()=>c,"updateNotice",()=>d]),a()}catch(e){a(e)}},!1),59401,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(72707),i=e.i(9458),o=t([r,i]);async function l(e,{params:t}){let a=await (0,r.getCurrentUser)();if(!a)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});let o=a.profile?.branch_name;if(!o)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let{id:l}=await t,s=await (0,i.getNoticeById)(l,o);return s?n.NextResponse.json({notice:s}):n.NextResponse.json({message:"공지를 찾을 수 없습니다."},{status:404})}async function s(e,{params:t}){let a=await (0,r.getCurrentUser)();if(!a)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});if("admin"!==a.role)return n.NextResponse.json({message:"공지사항 수정은 관리자만 가능합니다."},{status:403});let o=a.profile?.branch_name;if(!o)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let{id:l}=await t,s=await e.json().catch(()=>({})),u=await (0,i.updateNotice)({id:l,branchName:o,title:s.title,body:s.body,imageUrl:s.imageUrl});return u?n.NextResponse.json({notice:u}):n.NextResponse.json({message:"공지를 찾을 수 없습니다."},{status:404})}[r,i]=o.then?(await o)():o,e.s(["GET",()=>l,"PATCH",()=>s]),a()}catch(e){a(e)}},!1),46433,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),o=e.i(28394),l=e.i(31003),s=e.i(74485),u=e.i(45387),d=e.i(48188),c=e.i(59590),p=e.i(55266),m=e.i(84379),h=e.i(66041),_=e.i(72827),f=e.i(33899),y=e.i(85787),x=e.i(93695);e.i(84790);var g=e.i(41779),w=e.i(59401),b=t([w]);[w]=b.then?(await b)():b;let $=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/notices/[id]/route",pathname:"/api/notices/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/notices/[id]/route.ts",nextConfigOutput:"",userland:w}),{workAsyncStorage:N,workUnitAsyncStorage:C,serverHooks:q}=$;function R(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:C})}async function v(e,t,a){$.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/notices/[id]/route";n=n.replace(/\/index$/,"")||"/";let i=await $.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:b,nextConfig:R,parsedUrl:v,isDraftMode:N,prerenderManifest:C,routerServerContext:q,isOnDemandRevalidate:E,revalidateOnlyGenerated:A,resolvedPathname:k,clientReferenceManifest:T,serverActionsManifest:j}=i,P=(0,u.normalizeAppPath)(n),I=!!(C.dynamicRoutes[P]||C.routes[k]),U=async()=>((null==q?void 0:q.render404)?await q.render404(e,t,v,!1):t.end("This page could not be found"),null);if(I&&!N){let e=!!C.routes[k],t=C.dynamicRoutes[P];if(t&&!1===t.fallback&&!e){if(R.experimental.adapterPath)return await U();throw new x.NoFallbackError}}let S=null;!I||$.isDev||N||(S=k,S="/index"===S?"/":S);let O=!0===$.isDev||!I,z=I&&!O;j&&T&&(0,s.setManifestsSingleton)({page:n,clientReferenceManifest:T,serverActionsManifest:j});let F=e.method||"GET",H=(0,l.getTracer)(),D=H.getActiveScopeSpan(),M={params:b,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:O,incrementalCache:(0,o.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:R.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>$.onRequestError(e,t,n,r,q)},sharedContext:{buildId:w}},B=new d.NodeNextRequest(e),K=new d.NodeNextResponse(t),L=c.NextRequestAdapter.fromNodeNextRequest(B,(0,c.signalFromNodeResponse)(t));try{let i=async e=>$.handle(L,M).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=H.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${F} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${F} ${n}`)}),s=!!(0,o.getRequestMeta)(e,"minimalMode"),u=async o=>{var l,u;let d=async({previousCacheEntry:r})=>{try{if(!s&&E&&A&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(o);e.fetchMetrics=M.renderOpts.fetchMetrics;let l=M.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=M.renderOpts.collectedTags;if(!I)return await (0,h.sendResponse)(B,K,n,M.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,_.toNodeOutgoingHttpHeaders)(n.headers);u&&(t[y.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,r=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:g.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await $.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:E})},!1,q),t}},c=await $.handleResponse({req:e,nextConfig:R,cacheKey:S,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:A,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!I)return null;if((null==c||null==(l=c.value)?void 0:l.kind)!==g.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",E?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,_.fromNodeOutgoingHttpHeaders)(c.value.headers);return s&&I||p.delete(y.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(B,K,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};D?await u(D):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${F} ${n}`,kind:l.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},u))}catch(t){if(t instanceof x.NoFallbackError||await $.onRequestError(e,t,{routerKind:"App Router",routePath:P,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:E})},!1,q),I)throw t;return await (0,h.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>R,"routeModule",()=>$,"serverHooks",()=>q,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>C]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__4ceb5589._.js.map