const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

function loadConnectionString() {
  let connectionString = process.env.NEON_DATABASE_URL;
  if (connectionString) return connectionString;

  try {
    const envPath = path.join(__dirname, "..", ".env.local");
    const raw = fs.readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key === "NEON_DATABASE_URL") {
        connectionString = rest.join("=").trim();
        break;
      }
    }
  } catch {
    // ignore
  }

  return connectionString;
}

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error("CSV 데이터가 비어있거나 헤더만 존재합니다.");
  }

  const header = lines[0].split(",").map((v) => v.trim());
  const idxCode = header.indexOf("매니저코드");
  const idxName = header.indexOf("매니저명");
  const idxTitle = header.indexOf("직책");
  const idxBranch = header.indexOf("지점명");

  if (idxCode < 0 || idxName < 0 || idxTitle < 0 || idxBranch < 0) {
    throw new Error("CSV 헤더가 예상과 다릅니다. 필요한 헤더: 매니저코드, 매니저명, 직책, 지점명");
  }

  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(",").map((v) => v.trim());
    const managerCode = cols[idxCode] ?? "";
    const managerName = cols[idxName] ?? "";
    const positionTitle = cols[idxTitle] ?? "";
    const branchName = cols[idxBranch] ?? "";

    if (!managerCode || !managerName || !branchName) {
      continue;
    }

    rows.push({
      managerCode,
      managerName,
      positionTitle: positionTitle || null,
      branchName,
    });
  }

  return rows;
}

async function ensureTable(client) {
  await client.query(`
    create table if not exists public.manager_code_registry (
      id uuid primary key default gen_random_uuid(),
      manager_code text not null,
      manager_name text not null,
      position_title text,
      branch_name text not null,
      is_active boolean not null default true,
      imported_at timestamptz not null default timezone('utc'::text, now()),
      import_batch_id text,
      source_filename text,
      claimed_profile_id uuid,
      claimed_at timestamptz,
      created_at timestamptz not null default timezone('utc'::text, now()),
      updated_at timestamptz not null default timezone('utc'::text, now()),
      constraint manager_code_registry_manager_code_uniq unique (manager_code)
    )
  `);

  await client.query(`
    create index if not exists idx_manager_code_registry_branch_name
      on public.manager_code_registry (branch_name)
  `);

  await client.query(`
    create index if not exists idx_manager_code_registry_is_active
      on public.manager_code_registry (is_active)
      where is_active = true
  `);
}

async function main() {
  const connectionString = loadConnectionString();
  if (!connectionString) {
    console.error("[import_manager_codes] NEON_DATABASE_URL 환경 변수가 없습니다.");
    process.exit(1);
  }

  const csvPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, "..", "public", "manager_code.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`[import_manager_codes] CSV 파일을 찾을 수 없습니다: ${csvPath}`);
    process.exit(1);
  }

  const rows = parseCsv(csvPath);
  if (rows.length === 0) {
    console.error("[import_manager_codes] 유효한 CSV 데이터가 없습니다.");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  const batchId = `batch-${Date.now()}`;
  const sourceFilename = path.basename(csvPath);

  let inserted = 0;
  let updated = 0;

  try {
    await client.connect();
    await client.query("begin");

    await ensureTable(client);

    for (const row of rows) {
      const result = await client.query(
        `
          insert into public.manager_code_registry (
            manager_code,
            manager_name,
            position_title,
            branch_name,
            is_active,
            imported_at,
            import_batch_id,
            source_filename,
            updated_at
          )
          values ($1, $2, $3, $4, true, timezone('utc'::text, now()), $5, $6, timezone('utc'::text, now()))
          on conflict (manager_code)
          do update set
            manager_name = excluded.manager_name,
            position_title = excluded.position_title,
            branch_name = excluded.branch_name,
            is_active = true,
            imported_at = excluded.imported_at,
            import_batch_id = excluded.import_batch_id,
            source_filename = excluded.source_filename,
            updated_at = timezone('utc'::text, now())
          returning (xmax = 0) as inserted
        `,
        [
          row.managerCode,
          row.managerName,
          row.positionTitle,
          row.branchName,
          batchId,
          sourceFilename,
        ],
      );

      if (result.rows[0]?.inserted) {
        inserted += 1;
      } else {
        updated += 1;
      }
    }

    await client.query("commit");

    console.log("[import_manager_codes] 완료");
    console.log(`- source: ${sourceFilename}`);
    console.log(`- batch: ${batchId}`);
    console.log(`- total: ${rows.length}`);
    console.log(`- inserted: ${inserted}`);
    console.log(`- updated: ${updated}`);
  } catch (err) {
    await client.query("rollback");
    console.error("[import_manager_codes] 실패", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
