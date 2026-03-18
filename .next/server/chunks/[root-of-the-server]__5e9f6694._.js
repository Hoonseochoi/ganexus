module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},95522,e=>e.a(async(t,a)=>{try{let t=await e.y("pg-d2edf3aec5ca8167");e.n(t),a()}catch(e){a(e)}},!0),54799,(e,t,a)=>{t.exports=e.x("crypto",()=>require("crypto"))},72707,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(7017),l=t([n,r]);async function i(){let e=await (0,r.getCurrentSession)();if(!e)return null;let[t,a]=await Promise.all([(0,n.query)("select login_id, role from public.auth_users where login_id = $1",[e.loginId]),(0,n.query)("select * from public.profiles where login_id = $1",[e.loginId])]),l=t[0];if(!l)return null;let i=a[0]??null;return{loginId:l.login_id,role:l.role,profile:i}}[n,r]=l.then?(await l)():l,e.s(["getCurrentUser",()=>i]),a()}catch(e){a(e)}},!1),63849,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=t([n]);async function l(e){try{let t=await (0,n.query)("select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1",[e]);return t[0]?.tenant_schema??null}catch(e){if((0,n.isColumnNotFound)(e))return null;throw e}}async function i(e){let t,a=(t=e.employeeCode.replace(/[^a-zA-Z0-9]/g,"_").replace(/^_+|_+$/g,"")||"tenant",`t_${t}`.toLowerCase()),r=await n.pool.connect();try{await r.query(`create schema if not exists ${a}`),await r.query(`
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
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,[e.profileId,e.employeeCode,e.fullName,e.branchName,e.phoneNumber,e.company??null,e.email??null]),await r.query("update public.profiles set tenant_schema = $1 where login_id = $2",[a,e.employeeCode])}finally{r.release()}return a}async function s(e){await (0,n.query)(`insert into ${e.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>s,"createTenantForAdmin",()=>i,"getTenantSchemaForBranch",()=>l]),a()}catch(e){a(e)}},!1),69910,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(63849),l=t([n,r]);[n,r]=l.then?(await l)():l;let m={education:"dealer",vacation:"leave",hq:"internal",etc:"etc"},p={dealer:"education",internal:"hq",personal:"etc",leave:"vacation",etc:"etc"};async function i(e){let{branchName:t,from:a,to:l}=e,i=await (0,r.getTenantSchemaForBranch)(t)??"public";console.log(`[schedules] listSchedulesForBranch: branch=${t}, schema=${i}`);let s=["branch_name = $1"],o=[t];a&&(s.push("end_at >= $2"),o.push(a)),l&&(s.push("start_at <= $"+(o.length+1)),o.push(l));let d=s.join(" and ");try{return(await (0,n.query)(`
        select s.id, s.branch_name, s.title, s.description, s.category,
               s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
               s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
               p1.full_name as creator_full_name,
               p3.instructor_color as instructor_color,
               p2.full_name as target_full_name
        from ${i}.schedules s
        left join public.profiles p1 on s.created_by::text = p1.id::text
        left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
        left join public.profiles p3 on s.instructor = p3.full_name and s.branch_name = p3.branch_name and p3.is_instructor = true
        where s.${d}
        order by s.is_soft_deleted asc, s.start_at asc
      `,o)).map(e=>({...e,category:m[e.category]||e.category}))}catch(e){if((0,n.isRelationNotFound)(e))return console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다."),[];if((0,n.isColumnNotFound)(e)){console.warn("[schedules] listSchedulesForBranch: 컬럼 누락 → instructor만 읽는 최소 쿼리로 재시도");try{return(await (0,n.query)(`
            select s.id, s.branch_name, s.title, s.description, s.category,
                   s.instructor,
                   s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                   p1.full_name as creator_full_name
            from ${i}.schedules s
            left join public.profiles p1 on s.created_by::text = p1.id::text
            where s.${d}
            order by s.start_at asc
          `,o)).map(e=>({...e,category:m[e.category]||e.category,dealer_name:null,location:null,instructor:e.instructor,target_audience:null,manager_name:null,instructor_color:null,is_soft_deleted:!1,target_full_name:null,target_avatar_url:null}))}catch(e){if(!(0,n.isColumnNotFound)(e)&&!(0,n.isRelationNotFound)(e))throw e}return console.warn("[schedules] listSchedulesForBranch: instructor 컬럼도 없음 → 풀 레거시 폴백"),(await (0,n.query)(`
          select s.id, s.branch_name, s.title, s.description, s.category,
                 s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                 p.full_name as creator_full_name
          from ${i}.schedules s
          left join public.profiles p on s.created_by::text = p.id::text
          where s.${d}
          order by s.start_at asc
        `,o)).map(e=>({...e,category:m[e.category]||e.category,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:"vacation"===e.category?e.title:null,target_full_name:"vacation"===e.category?e.title:null,target_avatar_url:null}))}throw e}}async function s(e){let t=e.startAt,a=e.endAt??e.startAt,l=e.category??"etc",i=await (0,r.getTenantSchemaForBranch)(e.branchName)??"public";try{return(await (0,n.query)(`
        insert into ${i}.schedules (
          branch_name, title, description, category,
          dealer_name, location, instructor, target_audience, manager_name,
          start_at, end_at, is_all_day, created_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        returning id, branch_name, title, description, category,
                  dealer_name, location, instructor, target_audience, manager_name,
                  start_at, end_at, is_all_day, created_by, created_at
      `,[e.branchName,e.title,e.description??null,l,e.dealerName??null,e.location??null,e.instructor??null,e.targetAudience??null,e.managerName??null,t,a,e.isAllDay??!1,e.createdByProfileId]))[0]}catch(r){if((0,n.isColumnNotFound)(r)){let r=p[l];return{...(await (0,n.query)(`insert into ${i}.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[e.branchName,e.title,e.description??null,r,t,a,e.isAllDay??!1,e.createdByProfileId]))[0],category:l,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}}throw r}}async function o(e){let t={};if(["title","description","start_at","end_at","category","dealer_name","location","instructor","target_audience","manager_name"].forEach(a=>{let n=e.before[a],r=e.after[a],l=!1;if(n instanceof Date||r instanceof Date||"start_at"===a||"end_at"===a){let e=n?new Date(n).getTime():null,t=r?new Date(r).getTime():null;l=e!==t}else l=n!==r;l&&(t[a]={before:n,after:r})}),0!==Object.keys(t).length)try{await (0,n.query)(`
        insert into ${e.schema}.schedule_edit_logs (schedule_id, branch_name, modified_by, modifier_name, changed_fields)
        values ($1, $2, $3, $4, $5)
      `,[e.scheduleId,e.branchName,e.modifiedBy,e.modifiedByName??null,JSON.stringify(t)])}catch(e){if((0,n.isRelationNotFound)(e))return;throw e}}async function d(e){let t=await (0,r.getTenantSchemaForBranch)(e.branchName)??"public";try{return await (0,n.query)(`
        select l.id, l.schedule_id, l.branch_name, l.modified_by,
               COALESCE(l.modifier_name, p.full_name) as modifier_name,
               l.changed_fields, l.created_at
        from ${t}.schedule_edit_logs l
        left join public.profiles p on l.modified_by::text = p.id::text
        where l.schedule_id = $1 and l.branch_name = $2
        order by l.created_at desc
      `,[e.scheduleId,e.branchName])}catch(e){if((0,n.isRelationNotFound)(e))return[];throw e}}async function c(e){let{id:t,branchName:a}=e,l=await (0,r.getTenantSchemaForBranch)(a)??"public",i=[],s=[];function d(e,t){i.push(`${e} = $${i.length+1}`),s.push(t)}void 0!==e.title&&d("title",e.title),void 0!==e.description&&d("description",e.description),void 0!==e.category&&d("category",e.category),void 0!==e.dealerName&&d("dealer_name",e.dealerName),void 0!==e.location&&d("location",e.location),void 0!==e.instructor&&d("instructor",e.instructor),void 0!==e.targetAudience&&d("target_audience",e.targetAudience),void 0!==e.managerName&&d("manager_name",e.managerName),void 0!==e.startAt&&d("start_at",e.startAt),void 0!==e.endAt&&d("end_at",e.endAt),void 0!==e.isAllDay&&d("is_all_day",e.isAllDay);let c=null;try{c=(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null}catch(e){if(!(0,n.isColumnNotFound)(e))throw e;c=null}let u=async()=>0===i.length?(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null:(await (0,n.query)(`update ${l}.schedules set ${i.join(", ")} where id = $${i.length+1} and branch_name = $${i.length+2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`,[...s,t,a]))[0]??null,_=async()=>{let r=[],i=[];function s(e,t){r.push(`${e} = $${r.length+1}`),i.push(t)}if(void 0!==e.title&&s("title",e.title),void 0!==e.description&&s("description",e.description),void 0!==e.category&&s("category",p[e.category]),void 0!==e.startAt&&s("start_at",e.startAt),void 0!==e.endAt&&s("end_at",e.endAt),void 0!==e.isAllDay&&s("is_all_day",e.isAllDay),0===r.length){let e=(await (0,n.query)(`select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0];return e?{...e,category:m[e.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}:null}let o=(await (0,n.query)(`update ${l}.schedules set ${r.join(", ")} where id = $${r.length+1} and branch_name = $${r.length+2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[...i,t,a]))[0];return o?{...o,category:m[o.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}:null};try{let n=await u();return c&&n&&await o({schema:l,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,modifiedByName:e.modifiedByName??null,before:c,after:n}),n}catch(r){if((0,n.isColumnNotFound)(r)){let n=await _();return c&&n&&await o({schema:l,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,modifiedByName:e.modifiedByName??null,before:c,after:n}),n}throw r}}async function u(e){let{id:t,branchName:a,hardDelete:l}=e,i=await (0,r.getTenantSchemaForBranch)(a)??"public";l?await (0,n.query)(`delete from ${i}.schedules where id = $1 and branch_name = $2`,[t,a]):await (0,n.query)(`update ${i}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`,[t,a])}async function _(e){let{id:t,branchName:a}=e,l=await (0,r.getTenantSchemaForBranch)(a)??"public";try{return(await (0,n.query)(`select s.id, s.branch_name, s.title, s.description, s.category,
              s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
              s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
              p1.full_name as creator_full_name,
              p3.instructor_color as instructor_color,
              p2.full_name as target_full_name
       from ${l}.schedules s
       left join public.profiles p1 on s.created_by::text = p1.id::text
       left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
       left join public.profiles p3 on s.instructor = p3.full_name and s.branch_name = p3.branch_name and p3.is_instructor = true
       where s.id = $1 and s.branch_name = $2
       limit 1`,[t,a]))[0]??null}catch(e){if((0,n.isRelationNotFound)(e))return console.warn("[schedules] schedules 테이블이 없어 null을 반환합니다."),null;if((0,n.isColumnNotFound)(e)){console.warn("[schedules] getScheduleById: 컬럼 누락 → instructor만 읽는 최소 쿼리로 재시도");try{let e=(await (0,n.query)(`select s.id, s.branch_name, s.title, s.description, s.category,
                  s.instructor,
                  s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                  p1.full_name as creator_full_name
           from ${l}.schedules s
           left join public.profiles p1 on s.created_by::text = p1.id::text
           where s.id = $1 and s.branch_name = $2
           limit 1`,[t,a]))[0];if(!e)return null;return{...e,category:m[e.category]||e.category,dealer_name:null,location:null,instructor:e.instructor,target_audience:null,manager_name:null,instructor_color:null,is_soft_deleted:!1,target_full_name:null,target_avatar_url:null}}catch(e){if(!(0,n.isColumnNotFound)(e)&&!(0,n.isRelationNotFound)(e))throw e}console.warn("[schedules] getScheduleById: instructor 컬럼도 없음 → 풀 레거시 폴백");let e=(await (0,n.query)(`select s.id, s.branch_name, s.title, s.description, s.category,
                s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                p.full_name as creator_full_name
         from ${l}.schedules s
         left join public.profiles p on s.created_by::text = p.id::text
         where s.id = $1 and s.branch_name = $2
         limit 1`,[t,a]))[0];if(!e)return null;return{...e,category:m[e.category]||e.category,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:"vacation"===e.category?e.title:null,target_full_name:"vacation"===e.category?e.title:null,target_avatar_url:null}}throw e}}e.s(["createSchedule",()=>s,"deleteSchedule",()=>u,"getScheduleById",()=>_,"getScheduleEditLogs",()=>d,"listSchedulesForBranch",()=>i,"updateSchedule",()=>c]),a()}catch(e){a(e)}},!1),78388,e=>e.a(async(t,a)=>{try{var n=e.i(78504),r=e.i(72707),l=e.i(69910),i=t([r,l]);async function s(e,{params:t}){let{id:a}=await t,i=await (0,r.getCurrentUser)();if(!i)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});if("admin"!==i.role&&"manager"!==i.role&&"agent"!==i.role)return n.NextResponse.json({message:"일정 수정 권한이 없습니다."},{status:403});let s=i.profile?.branch_name,o=i.profile?.id,d=i.profile?.full_name??null;if(!s||!o)return n.NextResponse.json({message:"지점 정보 또는 프로필 정보가 설정되지 않았습니다."},{status:400});let c=await e.json().catch(()=>({})),u=await (0,l.updateSchedule)({id:a,branchName:s,modifiedBy:o,modifiedByName:d,title:c.title,description:c.description,category:c.category,startAt:c.startAt,endAt:c.endAt,isAllDay:c.isAllDay,dealerName:c.dealerName,location:c.location,instructor:c.instructor,targetAudience:c.targetAudience,managerName:c.managerName});return u?n.NextResponse.json({schedule:u}):n.NextResponse.json({message:"해당 일정을 찾을 수 없습니다."},{status:404})}async function o(e,{params:t}){let{id:a}=await t,i=await (0,r.getCurrentUser)();if(!i)return n.NextResponse.json({message:"인증이 필요합니다."},{status:401});if("admin"!==i.role&&"manager"!==i.role&&"agent"!==i.role)return n.NextResponse.json({message:"일정 삭제 권한이 없습니다."},{status:403});let s=i.profile?.branch_name,o=i.profile?.id;if(!s||!o)return n.NextResponse.json({message:"지점 정보가 설정되지 않았습니다."},{status:400});let d=await (0,l.getScheduleById)({id:a,branchName:s});if(!d)return n.NextResponse.json({message:"해당 일정을 찾을 수 없습니다."},{status:404});let c=String(d.created_by)===String(o);return c||"admin"===i.role?(await (0,l.deleteSchedule)({id:a,branchName:s,hardDelete:"admin"===i.role||c}),n.NextResponse.json({ok:!0})):n.NextResponse.json({message:"일정 삭제 권한이 없습니다."},{status:403})}[r,l]=i.then?(await i)():i,e.s(["DELETE",()=>o,"PATCH",()=>s]),a()}catch(e){a(e)}},!1),53376,e=>e.a(async(t,a)=>{try{var n=e.i(25515),r=e.i(13874),l=e.i(3337),i=e.i(28394),s=e.i(31003),o=e.i(74485),d=e.i(45387),c=e.i(48188),u=e.i(59590),_=e.i(55266),m=e.i(84379),p=e.i(66041),h=e.i(72827),y=e.i(33899),f=e.i(85787),g=e.i(93695);e.i(84790);var b=e.i(41779),x=e.i(78388),w=t([x]);[x]=w.then?(await w)():w;let N=new n.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/schedules/[id]/route",pathname:"/api/schedules/[id]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/OneDrive/Desktop/GA_NEXUS/app/api/schedules/[id]/route.ts",nextConfigOutput:"",userland:x}),{workAsyncStorage:R,workUnitAsyncStorage:A,serverHooks:q}=N;function $(){return(0,l.patchFetch)({workAsyncStorage:R,workUnitAsyncStorage:A})}async function v(e,t,a){N.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/schedules/[id]/route";n=n.replace(/\/index$/,"")||"/";let l=await N.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!l)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:x,params:w,nextConfig:$,parsedUrl:v,isDraftMode:R,prerenderManifest:A,routerServerContext:q,isOnDemandRevalidate:C,revalidateOnlyGenerated:E,resolvedPathname:S,clientReferenceManifest:j,serverActionsManifest:T}=l,B=(0,d.normalizeAppPath)(n),F=!!(A.dynamicRoutes[B]||A.routes[S]),k=async()=>((null==q?void 0:q.render404)?await q.render404(e,t,v,!1):t.end("This page could not be found"),null);if(F&&!R){let e=!!A.routes[S],t=A.dynamicRoutes[B];if(t&&!1===t.fallback&&!e){if($.experimental.adapterPath)return await k();throw new g.NoFallbackError}}let I=null;!F||N.isDev||R||(I=S,I="/index"===I?"/":I);let D=!0===N.isDev||!F,P=F&&!D;T&&j&&(0,o.setManifestsSingleton)({page:n,clientReferenceManifest:j,serverActionsManifest:T});let O=e.method||"GET",U=(0,s.getTracer)(),z=U.getActiveScopeSpan(),H={params:w,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!$.experimental.authInterrupts},cacheComponents:!!$.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:$.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,r)=>N.onRequestError(e,t,n,r,q)},sharedContext:{buildId:x}},M=new c.NodeNextRequest(e),L=new c.NodeNextResponse(t),K=u.NextRequestAdapter.fromNodeNextRequest(M,(0,u.signalFromNodeResponse)(t));try{let l=async e=>N.handle(K,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==_.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=a.get("next.route");if(r){let t=`${O} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${O} ${n}`)}),o=!!(0,i.getRequestMeta)(e,"minimalMode"),d=async i=>{var s,d;let c=async({previousCacheEntry:r})=>{try{if(!o&&C&&E&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await l(i);e.fetchMetrics=H.renderOpts.fetchMetrics;let s=H.renderOpts.pendingWaitUntil;s&&a.waitUntil&&(a.waitUntil(s),s=void 0);let d=H.renderOpts.collectedTags;if(!F)return await (0,p.sendResponse)(M,L,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[f.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,r=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==r?void 0:r.isStale)&&await N.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:C})},!1,q),t}},u=await N.handleResponse({req:e,nextConfig:$,cacheKey:I,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:E,responseGenerator:c,waitUntil:a.waitUntil,isMinimalMode:o});if(!F)return null;if((null==u||null==(s=u.value)?void 0:s.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(d=u.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",C?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),R&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let _=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return o&&F||_.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||_.get("Cache-Control")||_.set("Cache-Control",(0,y.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(M,L,new Response(u.value.body,{headers:_,status:u.value.status||200})),null};z?await d(z):await U.withPropagatedContext(e.headers,()=>U.trace(_.BaseServerSpan.handleRequest,{spanName:`${O} ${n}`,kind:s.SpanKind.SERVER,attributes:{"http.method":O,"http.target":e.url}},d))}catch(t){if(t instanceof g.NoFallbackError||await N.onRequestError(e,t,{routerKind:"App Router",routePath:B,routeType:"route",revalidateReason:(0,m.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:C})},!1,q),F)throw t;return await (0,p.sendResponse)(M,L,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>$,"routeModule",()=>N,"serverHooks",()=>q,"workAsyncStorage",()=>R,"workUnitAsyncStorage",()=>A]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__5e9f6694._.js.map