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
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,[e.profileId,e.employeeCode,e.fullName,e.branchName,e.phoneNumber,e.company??null,e.email??null]),await r.query("update public.profiles set tenant_schema = $1 where login_id = $2",[a,e.employeeCode])}finally{r.release()}return a}async function o(e){await (0,n.query)(`insert into ${e.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,[e.profileId,e.loginId,e.fullName,e.branchName,e.phoneNumber,e.role,e.isApproved,e.managerCode??null])}[n]=r.then?(await r)():r,e.s(["addProfileToTenant",()=>o,"createTenantForAdmin",()=>i,"getTenantSchemaForBranch",()=>l]),a()}catch(e){a(e)}},!1),69910,e=>e.a(async(t,a)=>{try{var n=e.i(76022),r=e.i(63849),l=t([n,r]);[n,r]=l.then?(await l)():l;let y=Number(process.env.SCHEDULE_LIST_CACHE_TTL_MS??15e3),p=Number(process.env.SCHEDULE_LIST_CACHE_MAX_ENTRIES??200),f={education:"dealer",vacation:"leave",hq:"internal",etc:"etc"},g={dealer:"education",internal:"hq",personal:"etc",leave:"vacation",etc:"etc"},b=new Map;function i(e,t){if(b.size>=p){let e=b.keys().next().value;e&&b.delete(e)}b.set(e,{expiresAt:Date.now()+y,rows:t})}function o(e){if(!e)return void b.clear();let t=`branch=${encodeURIComponent(e)}|`;for(let e of b.keys())e.includes(t)&&b.delete(e)}async function s(e){var t;let a,l,o,s,{branchName:c,from:d,to:u}=e,_=await (0,r.getTenantSchemaForBranch)(c)??"public";console.log(`[schedules] listSchedulesForBranch: branch=${c}, schema=${_}`);let m=(t={schema:_,branchName:c,from:d,to:u},a=encodeURIComponent(t.branchName),l=encodeURIComponent(t.from??""),o=encodeURIComponent(t.to??""),`schema=${t.schema}|branch=${a}|from=${l}|to=${o}`),h=(s=b.get(m))?s.expiresAt<=Date.now()?(b.delete(m),null):s.rows:null;if(h)return h;let y=["branch_name = $1"],p=[c];d&&(y.push("end_at >= $2"),p.push(d)),u&&(y.push("start_at <= $"+(p.length+1)),p.push(u));let g=y.join(" and ");try{let e=(await (0,n.query)(`
        select s.id, s.branch_name, s.title, s.description, s.category,
               s.dealer_name, s.location, s.instructor, s.target_audience, s.manager_name,
               s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at, s.is_soft_deleted,
               p1.full_name as creator_full_name,
               p3.instructor_color as instructor_color,
               p2.full_name as target_full_name
        from ${_}.schedules s
        left join public.profiles p1 on s.created_by::text = p1.id::text
        left join public.profiles p2 on s.manager_name = p2.full_name and s.branch_name = p2.branch_name
        left join public.profiles p3 on s.instructor = p3.full_name and s.branch_name = p3.branch_name and p3.is_instructor = true
        where s.${g}
        order by s.is_soft_deleted asc, s.start_at asc
      `,p)).map(e=>({...e,category:f[e.category]||e.category}));return i(m,e),e}catch(e){if((0,n.isRelationNotFound)(e))return console.warn("[schedules] schedules 테이블이 없어 빈 결과를 반환합니다."),i(m,[]),[];if((0,n.isColumnNotFound)(e)){console.warn("[schedules] listSchedulesForBranch: 컬럼 누락 → instructor만 읽는 최소 쿼리로 재시도");try{let e=(await (0,n.query)(`
            select s.id, s.branch_name, s.title, s.description, s.category,
                   s.instructor,
                   s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                   p1.full_name as creator_full_name
            from ${_}.schedules s
            left join public.profiles p1 on s.created_by::text = p1.id::text
            where s.${g}
            order by s.start_at asc
          `,p)).map(e=>({...e,category:f[e.category]||e.category,dealer_name:null,location:null,instructor:e.instructor,target_audience:null,manager_name:null,instructor_color:null,is_soft_deleted:!1,target_full_name:null,target_avatar_url:null}));return i(m,e),e}catch(e){if(!(0,n.isColumnNotFound)(e)&&!(0,n.isRelationNotFound)(e))throw e}console.warn("[schedules] listSchedulesForBranch: instructor 컬럼도 없음 → 풀 레거시 폴백");let e=(await (0,n.query)(`
          select s.id, s.branch_name, s.title, s.description, s.category,
                 s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                 p.full_name as creator_full_name
          from ${_}.schedules s
          left join public.profiles p on s.created_by::text = p.id::text
          where s.${g}
          order by s.start_at asc
        `,p)).map(e=>({...e,category:f[e.category]||e.category,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:"vacation"===e.category?e.title:null,target_full_name:"vacation"===e.category?e.title:null,target_avatar_url:null}));return i(m,e),e}throw e}}async function c(e){let t=e.startAt,a=e.endAt??e.startAt,l=e.category??"etc",i=await (0,r.getTenantSchemaForBranch)(e.branchName)??"public";try{let r=await (0,n.query)(`
        insert into ${i}.schedules (
          branch_name, title, description, category,
          dealer_name, location, instructor, target_audience, manager_name,
          start_at, end_at, is_all_day, created_by
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        returning id, branch_name, title, description, category,
                  dealer_name, location, instructor, target_audience, manager_name,
                  start_at, end_at, is_all_day, created_by, created_at
      `,[e.branchName,e.title,e.description??null,l,e.dealerName??null,e.location??null,e.instructor??null,e.targetAudience??null,e.managerName??null,t,a,e.isAllDay??!1,e.createdByProfileId]);return o(e.branchName),r[0]}catch(r){if((0,n.isColumnNotFound)(r)){let r=g[l],s=(await (0,n.query)(`insert into ${i}.schedules (branch_name, title, description, category, start_at, end_at, is_all_day, created_by) values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[e.branchName,e.title,e.description??null,r,t,a,e.isAllDay??!1,e.createdByProfileId]))[0];return o(e.branchName),{...s,category:l,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}}throw r}}async function d(e){let t={};if(["title","description","start_at","end_at","category","dealer_name","location","instructor","target_audience","manager_name"].forEach(a=>{let n=e.before[a],r=e.after[a],l=!1;if(n instanceof Date||r instanceof Date||"start_at"===a||"end_at"===a){let e=n?new Date(n).getTime():null,t=r?new Date(r).getTime():null;l=e!==t}else l=n!==r;l&&(t[a]={before:n,after:r})}),0!==Object.keys(t).length)try{await (0,n.query)(`
        insert into ${e.schema}.schedule_edit_logs (schedule_id, branch_name, modified_by, modifier_name, changed_fields)
        values ($1, $2, $3, $4, $5)
      `,[e.scheduleId,e.branchName,e.modifiedBy,e.modifiedByName??null,JSON.stringify(t)])}catch(e){if((0,n.isRelationNotFound)(e))return;throw e}}async function u(e){let t=await (0,r.getTenantSchemaForBranch)(e.branchName)??"public";try{return await (0,n.query)(`
        select l.id, l.schedule_id, l.branch_name, l.modified_by,
               COALESCE(l.modifier_name, p.full_name) as modifier_name,
               l.changed_fields, l.created_at
        from ${t}.schedule_edit_logs l
        left join public.profiles p on l.modified_by::text = p.id::text
        where l.schedule_id = $1 and l.branch_name = $2
        order by l.created_at desc
      `,[e.scheduleId,e.branchName])}catch(e){if((0,n.isRelationNotFound)(e))return[];throw e}}async function _(e){let{id:t,branchName:a}=e,l=await (0,r.getTenantSchemaForBranch)(a)??"public",i=void 0!==e.title||void 0!==e.description||void 0!==e.category||void 0!==e.dealerName||void 0!==e.location||void 0!==e.instructor||void 0!==e.targetAudience||void 0!==e.managerName||void 0!==e.startAt||void 0!==e.endAt||void 0!==e.isAllDay,s=[],c=[];function u(e,t){s.push(`${e} = $${s.length+1}`),c.push(t)}void 0!==e.title&&u("title",e.title),void 0!==e.description&&u("description",e.description),void 0!==e.category&&u("category",e.category),void 0!==e.dealerName&&u("dealer_name",e.dealerName),void 0!==e.location&&u("location",e.location),void 0!==e.instructor&&u("instructor",e.instructor),void 0!==e.targetAudience&&u("target_audience",e.targetAudience),void 0!==e.managerName&&u("manager_name",e.managerName),void 0!==e.startAt&&u("start_at",e.startAt),void 0!==e.endAt&&u("end_at",e.endAt),void 0!==e.isAllDay&&u("is_all_day",e.isAllDay);let _=null;try{_=(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null}catch(e){if(!(0,n.isColumnNotFound)(e))throw e;_=null}let m=async()=>0===s.length?(await (0,n.query)(`select id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0]??null:(await (0,n.query)(`update ${l}.schedules set ${s.join(", ")} where id = $${s.length+1} and branch_name = $${s.length+2} returning id, branch_name, title, description, category, dealer_name, location, instructor, target_audience, manager_name, start_at, end_at, is_all_day, created_by, created_at`,[...c,t,a]))[0]??null,h=async()=>{let r=[],i=[];function o(e,t){r.push(`${e} = $${r.length+1}`),i.push(t)}if(void 0!==e.title&&o("title",e.title),void 0!==e.description&&o("description",e.description),void 0!==e.category&&o("category",g[e.category]),void 0!==e.startAt&&o("start_at",e.startAt),void 0!==e.endAt&&o("end_at",e.endAt),void 0!==e.isAllDay&&o("is_all_day",e.isAllDay),0===r.length){let e=(await (0,n.query)(`select id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at from ${l}.schedules where id = $1 and branch_name = $2`,[t,a]))[0];return e?{...e,category:f[e.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}:null}let s=(await (0,n.query)(`update ${l}.schedules set ${r.join(", ")} where id = $${r.length+1} and branch_name = $${r.length+2} returning id, branch_name, title, description, category, start_at, end_at, is_all_day, created_by, created_at`,[...i,t,a]))[0];return s?{...s,category:f[s.category],dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:null,target_full_name:null,target_avatar_url:null}:null};try{let n=await m();return _&&n&&await d({schema:l,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,modifiedByName:e.modifiedByName??null,before:_,after:n}),n&&i&&o(a),n}catch(r){if((0,n.isColumnNotFound)(r)){let n=await h();return _&&n&&await d({schema:l,scheduleId:t,branchName:a,modifiedBy:e.modifiedBy,modifiedByName:e.modifiedByName??null,before:_,after:n}),n&&i&&o(a),n}throw r}}async function m(e){let{id:t,branchName:a,hardDelete:l}=e,i=await (0,r.getTenantSchemaForBranch)(a)??"public";if(l){await (0,n.query)(`delete from ${i}.schedules where id = $1 and branch_name = $2`,[t,a]),o(a);return}await (0,n.query)(`update ${i}.schedules set is_soft_deleted = true where id = $1 and branch_name = $2`,[t,a]),o(a)}async function h(e){let{id:t,branchName:a}=e,l=await (0,r.getTenantSchemaForBranch)(a)??"public";try{return(await (0,n.query)(`select s.id, s.branch_name, s.title, s.description, s.category,
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
           limit 1`,[t,a]))[0];if(!e)return null;return{...e,category:f[e.category]||e.category,dealer_name:null,location:null,instructor:e.instructor,target_audience:null,manager_name:null,instructor_color:null,is_soft_deleted:!1,target_full_name:null,target_avatar_url:null}}catch(e){if(!(0,n.isColumnNotFound)(e)&&!(0,n.isRelationNotFound)(e))throw e}console.warn("[schedules] getScheduleById: instructor 컬럼도 없음 → 풀 레거시 폴백");let e=(await (0,n.query)(`select s.id, s.branch_name, s.title, s.description, s.category,
                s.start_at, s.end_at, s.is_all_day, s.created_by, s.created_at,
                p.full_name as creator_full_name
         from ${l}.schedules s
         left join public.profiles p on s.created_by::text = p.id::text
         where s.id = $1 and s.branch_name = $2
         limit 1`,[t,a]))[0];if(!e)return null;return{...e,category:f[e.category]||e.category,dealer_name:null,location:null,instructor:null,target_audience:null,manager_name:"vacation"===e.category?e.title:null,target_full_name:"vacation"===e.category?e.title:null,target_avatar_url:null}}throw e}}e.s(["createSchedule",()=>c,"deleteSchedule",()=>m,"getScheduleById",()=>h,"getScheduleEditLogs",()=>u,"listSchedulesForBranch",()=>s,"updateSchedule",()=>_]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__37df5727._.js.map