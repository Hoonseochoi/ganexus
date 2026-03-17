module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},95522,e=>e.a(async(t,a)=>{try{let t=await e.y("pg-d2edf3aec5ca8167");e.n(t),a()}catch(e){a(e)}},!0),54799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},72707,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(7017),i=t([n,r]);async function l(){let e=await (0,r.getCurrentSession)();if(!e)return null;let[t,a]=await Promise.all([(0,n.query)("select login_id, role from public.auth_users where login_id = $1",[e.loginId]),(0,n.query)("select * from public.profiles where login_id = $1",[e.loginId])]),i=t[0];if(!i)return null;let l=a[0]??null;return{loginId:i.login_id,role:i.role,profile:l}}[n,r]=i.then?(await i)():i,e.s(["getCurrentUser",()=>l]),a()}catch(e){a(e)}},!1),63849,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=t([n]);async function i(e){try{let t=await (0,n.query)("select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1",[e]);return t[0]?.tenant_schema??null}catch(e){if((0,n.isColumnNotFound)(e))return null;throw e}}async function l(e){let t,a=(t=e.employeeCode.replace(/[^a-zA-Z0-9]/g,"_").replace(/^_+|_+$/g,"")||"tenant",`t_${t}`.toLowerCase()),r=await n.pool.connect();try{await r.query(`create schema if not exists ${a}`),await r.query(`
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
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,[e.profileId,e.employeeCode,e.fullName,e.branchName,e.phoneNumber,e.company??null,e.email??null]),await r.query("update public.profiles set tenant_schema = $1 where login_id = $2",[a,e.employeeCode])}finally{r.release()}return a}async function o(e){await (0,n.query)(`insert into ${e.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>o,"createTenantForAdmin",()=>l,"getTenantSchemaForBranch",()=>i]),a()}catch(e){a(e)}},!1),69910,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(63849),i=t([n,r]);[n,r]=i.then?(await i)():i;let _={education:"dealer",vacation:"leave",hq:"internal",etc:"etc"},m={dealer:"education",internal:"hq",personal:"etc",leave:"vacation",etc:"etc"};async function l(e){let{branchName:t,from:a,to:i}=e,l=await (0,r.getTenantSchemaForBranch)(t)??"public",o=["branch_name = $1"],d=[t];a&&(o.push("end_at >= $2"),d.push(a)),i&&(o.push("start_at <= $"+(d.length+1)),d.push(i));let s=o.join(" and ");try{return await (0,n.query)(`
        select id, branch_name, title, description, category,
               dealer_name, location, instructor, target_audience, manager_name,
               start_at, end_at, is_all_day, created_by, created_at, is_soft_deleted
        from ${l}.schedules
        where ${s}
        order by is_soft_deleted asc, start_at asc
      `,d)}catch(e){if((0,n.isRelationNotFound)(e))return console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다."),[];if((0,n.isColumnNotFound)(e))return(await (0,n.query)(`
          select id, branch_name, title, description, category,
                 start_at, end_at, is_all_day, created_by, created_at
          from ${l}.schedules
          where ${s}
          order by start_at asc
        `,d)).map(e=>({...e,category:_[e.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null}));throw e}}async function o(e){let t=e.startAt,a=e.endAt??e.startAt,i=e.category??"etc",l=await (0,r.getTenantSchemaForBranch)(e.branchName)??"public";try{return(await (0,n.query)(`
        insert into ${l}.schedules (
          branch_name, title, description, category,
          dealer_name, location, instructor, target_audience, manager_name,
          start_at, end_at, is_all_day, created_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        returning id, branch_name, title, description, category,
                  dealer_name, location, instructor, target_audience, manager_name,
                  start_at, end_at, is_all_day, created_by, created_at
      `,[e.branchName,e.title,e.description??null,i,e.dealerName??null,e.location??null,e.instructor??null,e.targetAudience??null,e.managerName??null,t,a,e.isAllDay??!1,e.createdByProfileId]))[0]}catch(r){if((0,n.isColumnNotFound)(r)){let r=m[i];return{...(await (0,n.query)(`insert into ${l}.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[e.branchName,e.title,e.description??null,r,t,a,e.isAllDay??!1,e.createdByProfileId]))[0],category:i,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null}}throw r}}async function d(e){let t={};if(["title","description","start_at","end_at","category","dealer_name","location","instructor","target_audience","manager_name"].forEach(a=>{let n=e.before[a],r=e.after[a],i=!1;if(n instanceof Date||r instanceof Date||"start_at"===a||"end_at"===a){let e=n?new Date(n).getTime():null,t=r?new Date(r).getTime():null;i=e!==t}else i=n!==r;i&&(t[a]={before:n,after:r})}),0!==Object.keys(t).length)try{await (0,n.query)(`
        insert into public.schedule_edit_logs (schedule_id, branch_name, modified_by, changed_fields)
        values ($1, $2, $3, $4)
      `,[e.scheduleId,e.branchName,e.modifiedBy,JSON.stringify(t)])}catch(e){if((0,n.isRelationNotFound)(e))return;throw e}}async function s(e){await (0,r.getTenantSchemaForBranch)(e.branchName);try{return await (0,n.query)(`
        select id, schedule_id, branch_name, modified_by, changed_fields, created_at
        from public.schedule_edit_logs
        where schedule_id = $1 and branch_name = $2
        order by created_at desc
      `,[e.scheduleId,e.branchName])}catch(e){if((0,n.isRelationNotFound)(e))return[];throw e}}async function c(e){let{id:t,branchName:a}=e,i=await (0,r.getTenantSchemaForBranch)(a)??"public",l=[],o=[];function s(e,t){l.push(`${e} = $${l.length+1}`),o.push(t)}void 0!==e.title&&s("title",e.title),void 0!==e.description&&s("description",e.description),void 0!==e.category&&s("category",e.category),void 0!==e.dealerName&&s("dealer_name",e.dealerName),void 0!==e.location&&s("location",e.location),void 0!==e.instructor&&s("instructor",e.instructor),void 0!==e.targetAudience&&s("target_audience",e.targetAudience),void 0!==e.managerName&&s("manager_name",e.managerName),void 0!==e.startAt&&s("start_at",e.startAt),void 0!==e.endAt&&s("end_at",e.endAt),void 0!==e.isAllDay&&s("is_all_day",e.isAllDay);let c=null;try{c=(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${i}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null}catch(e){if(!(0,n.isColumnNotFound)(e))throw e;c=null}let u=async()=>0===l.length?(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${i}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null:(await (0,n.query)(`update ${i}.schedules set ${l.join(", ")} where id = $${l.length+1} and branch_name = $${l.length+2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`,[...o,t,a]))[0]??null,p=async()=>{let r=[],l=[];function o(e,t){r.push(`${e} = $${r.length+1}`),l.push(t)}if(void 0!==e.title&&o("title",e.title),void 0!==e.description&&o("description",e.description),void 0!==e.category&&o("category",m[e.category]),void 0!==e.startAt&&o("start_at",e.startAt),void 0!==e.endAt&&o("end_at",e.endAt),void 0!==e.isAllDay&&o("is_all_day",e.isAllDay),0===r.length){let e=(await (0,n.query)(`select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from ${i}.schedules where id = $1 and branch_name = $2`,[t,a]))[0];return e?{...e,category:_[e.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null}:null}let d=(await (0,n.query)(`update ${i}.schedules set ${r.join(", ")} where id = $${r.length+1} and branch_name = $${r.length+2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[...l,t,a]))[0];return d?{...d,category:_[d.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null}:null};try{let n=await u();return c&&n&&await d({schema:i,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,before:c,after:n}),n}catch(r){if((0,n.isColumnNotFound)(r)){let n=await p();return c&&n&&await d({schema:i,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,before:c,after:n}),n}throw r}}async function u(e){let{id:t,branchName:a,hardDelete:i}=e,l=await (0,r.getTenantSchemaForBranch)(a)??"public";i?await (0,n.query)(`delete from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]):await (0,n.query)(`update ${l}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`,[t,a])}e.s(["createSchedule",()=>o,"deleteSchedule",()=>u,"getScheduleEditLogs",()=>s,"listSchedulesForBranch",()=>l,"updateSchedule",()=>c]),a()}catch(e){a(e)}},!1),11660,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(72707),i=e.i(69910),l=t([r,i]);async function o(e,{params:t}){let{id:a}=await t,l=await (0,r.getCurrentUser)();if(!l)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});let o=l.profile?.branch_name;if(!o)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let d=await (0,i.getScheduleEditLogs)({scheduleId:a,branchName:o});return n.NextResponse.json({logs:d})}[r,i]=l.then?(await l)():l,e.s(["GET",()=>o]),a()}catch(e){a(e)}},!1),75024,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),i=e.i(3337),l=e.i(28394),o=e.i(31003),d=e.i(74485),s=e.i(45387),c=e.i(48188),u=e.i(59590),_=e.i(55266),m=e.i(84379),p=e.i(66041),h=e.i(72827),y=e.i(33899),g=e.i(85787),f=e.i(93695);e.i(84790);var b=e.i(41779),x=e.i(11660),w=t([x]);[x]=w.then?(await w)():w;let R=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/schedules/[id]/logs/route",pathname:"/api/schedules/[id]/logs",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/schedules/[id]/logs/route.ts",nextConfigOutput:"",userland:x}),{workAsyncStorage:N,workUnitAsyncStorage:A,serverHooks:q}=R;function $(){return(0,i.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:A})}async function v(e,t,a){R.isDev&&(0,l.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/schedules/[id]/logs/route";n=n.replace(/\/index$/,"")||"/";let i=await R.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!i)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:x,params:w,nextConfig:$,parsedUrl:v,isDraftMode:N,prerenderManifest:A,routerServerContext:q,isOnDemandRevalidate:C,revalidateOnlyGenerated:E,resolvedPathname:T,clientReferenceManifest:S,serverActionsManifest:k}=i,I=(0,s.normalizeAppPath)(n),P=!!(A.dynamicRoutes[I]||A.routes[T]),D=async()=>((null==q?void 0:q.render404)?await q.render404(e,t,v,!1):t.end("This page could not be found"),null);if(P&&!N){let e=!!A.routes[T],t=A.dynamicRoutes[I];if(t&&!1===t.fallback&&!e){if($.experimental.adapterPath)return await D();throw new f.NoFallbackError}}let j=null;!P||R.isDev||N||(j=T,j="/index"===j?"/":j);let F=!0===R.isDev||!P,O=P&&!F;k&&S&&(0,d.setManifestsSingleton)({page:n,clientReferenceManifest:S,serverActionsManifest:k});let B=e.method||"GET",U=(0,o.getTracer)(),z=U.getActiveScopeSpan(),H={params:w,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,l.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>R.onRequestError(e,t,n,r,q)},sharedContext:{buildId:x}},M=new c.NodeNextRequest(e),K=new c.NodeNextResponse(t),L=u.NextRequestAdapter.fromNodeNextRequest(M,(0,u.signalFromNodeResponse)(t));try{let i=async e=>R.handle(L,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${B} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${B} ${n}`)}),d=!!(0,l.getRequestMeta)(e,"minimalMode"),s=async l=>{var o,s;let c=async({previousCacheEntry:r})=>{try{if(!d&&C&&E&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(l);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let s=H.renderOpts.collectedTags;if(!P)return await (0,p.sendResponse)(M,K,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);s&&(t[g.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,r=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await R.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:O,isOnDemandRevalidate:C})},!1,q),t}},u=await R.handleResponse({req:e,nextConfig:$,cacheKey:j,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:E,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:d});if(!P)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});d||t.setHeader("x-nextjs-cache",C?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let _=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return d&&P||_.delete(g.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||_.get("Cache-Control")||_.set("Cache-Control",(0,y.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(M,K,new Response(u.value.body,{headers:_,status:u.value.status||200})),null};z?await s(z):await U.withPropagatedContext(e.headers,()=>U.trace(_.BaseServerSpan.handleRequest,{spanName:`${B} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},s))}catch(t){if(t instanceof f.NoFallbackError||await R.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:O,isOnDemandRevalidate:C})},!1,q),P)throw t;return await (0,p.sendResponse)(M,K,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>$,"routeModule",()=>R,"serverHooks",()=>q,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__72f2da06._.js.map