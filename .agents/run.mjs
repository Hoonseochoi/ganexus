#!/usr/bin/env node
/**
 * GA_NEXUS 에이전트 파이프라인 v3
 *
 * 사용법:
 *   1. .agents/task_input.txt 에 작업 내용 입력 후 저장
 *   2. node .agents/run.mjs
 *
 * 옵션: --hotfix  (QA 경량화)
 *       --dry-run (배포 생략)
 *
 * v3 변경: PowerShell 완전 제거 → Node.js stdin 파이프로 직접 전달
 *          한글 인코딩 문제 근본 해결
 */

import { spawnSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const WS        = path.join(__dirname, 'workspace');
const CTX       = path.join(__dirname, 'PROJECT_CONTEXT.md');
const OBSIDIAN  = 'C:\\obsidian_hoons\\Hoonseo\\GA_NEXUS';
const TASK_FILE = path.join(__dirname, 'task_input.txt');

const MODELS = {
  OPUS:   'claude-opus-4-6',
  SONNET: 'claude-sonnet-4-6',
  HAIKU:  'claude-haiku-4-5-20251001',
};

// ── 인수 파싱 ──────────────────────────────────────────────────
const args   = process.argv.slice(2);
const hotfix = args.includes('--hotfix');
const dryrun = args.includes('--dry-run');

// task 읽기 — task_input.txt 우선
let task = args.find(a => !a.startsWith('--'));
if (!task) {
  if (fs.existsSync(TASK_FILE)) {
    task = fs.readFileSync(TASK_FILE, 'utf8').trim();
    if (!task) {
      console.error('❌ task_input.txt 가 비어있어요. 작업 내용을 입력 후 저장하세요.');
      process.exit(1);
    }
    console.log(`📄 작업: "${task}"`);
  } else {
    fs.writeFileSync(TASK_FILE, '여기에 작업 내용을 한글로 입력하세요\n예: 반복 일정 기능 추가\n', 'utf8');
    console.error(`❌ task_input.txt 를 새로 만들었어요. 작업 내용 입력 후 다시 실행하세요.`);
    process.exit(1);
  }
}

fs.mkdirSync(WS, { recursive: true });
['orchestration_plan','scan_result','feature_spec','feature_result',
 'db_result','qa_result','deploy_result'].forEach(f => {
  const p = path.join(WS, `${f}.json`);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

const taskId = `TASK-${Date.now()}`;
const today  = new Date().toISOString().slice(0, 10);

console.log(`\n${'═'.repeat(56)}`);
console.log(`🚀 GA_NEXUS 파이프라인 v3  [${taskId}]`);
console.log(`📋 ${task}`);
if (hotfix) console.log(`⚡ HOTFIX 모드`);
if (dryrun) console.log(`🔍 DRY-RUN 모드`);
console.log(`${'═'.repeat(56)}\n`);

// ── 유틸 ──────────────────────────────────────────────────────
const readFile   = p => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '(파일 없음)';
const readResult = f => { const p = path.join(WS, f); if (!fs.existsSync(p)) return null; try { return JSON.parse(fs.readFileSync(p,'utf8')); } catch { return null; } };

function buildPrompt(agentFile, injections, instruction) {
  const agent = readFile(path.join(__dirname, agentFile));
  const ctx   = injections.map(({label,content}) => `### ${label}\n\`\`\`\n${content}\n\`\`\``).join('\n\n');
  return [agent, '---', '## 주입된 컨텍스트', ctx, '---', '## 지금 할 일', instruction].join('\n\n');
}

/**
 * 핵심: PowerShell 없이 Node spawnSync + stdin 파이프
 * 프롬프트를 stdin으로 직접 주입 → 인코딩 문제 없음
 */
function runAgent(name, model, prompt) {
  console.log(`\n${'─'.repeat(56)}\n▶ [${name}]  ${model}`);
  const result = spawnSync('claude', ['--model', model, '--print', '--dangerously-skip-permissions', '-'], {
    input:   prompt,
    encoding:'utf8',
    cwd:     ROOT,
    timeout: 360_000,
    maxBuffer: 50 * 1024 * 1024,
    stdio:   ['pipe', 'inherit', 'inherit'],
    shell:   true,            // Windows .cmd 실행파일 인식
    env:     { ...process.env, PYTHONIOENCODING:'utf-8' },
  });
  if (result.status !== 0) {
    console.error(`❌ [${name}] 실패 (exit ${result.status})`);
    if (result.error) console.error(result.error.message);
    return false;
  }
  console.log(`✅ [${name}] 완료`);
  return true;
}

/**
 * 병렬 실행 — Promise + spawn (stdin 파이프)
 */
function runAgentAsync(name, model, prompt) {
  return new Promise((resolve) => {
    console.log(`  ▷ [${name}] 시작...`);
    const chunks = [];
    const proc = spawn('claude', ['--model', model, '--print', '--dangerously-skip-permissions', '-'], {
      cwd:   ROOT,
      shell: true,            // Windows .cmd 실행파일 인식
      env:   { ...process.env, PYTHONIOENCODING:'utf-8' },
    });
    proc.stdin.write(prompt, 'utf8');
    proc.stdin.end();
    proc.stdout.on('data', d => { process.stdout.write(d); chunks.push(d); });
    proc.stderr.on('data', d => process.stderr.write(d));
    proc.on('close', code => {
      if (code === 0) { console.log(`  ✅ [${name}] 완료`); resolve({ name, ok: true }); }
      else { console.error(`  ❌ [${name}] 실패`); resolve({ name, ok: false }); }
    });
    proc.on('error', e => { console.error(`  ❌ [${name}]`, e.message); resolve({ name, ok: false }); });
    setTimeout(() => { proc.kill(); resolve({ name, ok: false }); }, 360_000);
  });
}

async function runParallel(agents) {
  console.log(`\n${'─'.repeat(56)}\n▶▶ 병렬: ${agents.map(a=>a.name).join(' + ')}`);
  return Promise.all(agents.map(a => runAgentAsync(a.name, a.model, a.prompt)));
}

// ── 파이프라인 ────────────────────────────────────────────────
(async () => {
  const t0 = Date.now();

  // Phase 0. 오케스트레이터 분석
  console.log(`\n📐 Phase 0: 오케스트레이터 분석`);
  const ok0 = runAgent('orchestrator', MODELS.OPUS, buildPrompt('orchestrator-plan.md',
    [{ label:'PROJECT_CONTEXT.md', content:readFile(CTX) }],
    `작업 요청: "${task}"\nhotfix: ${hotfix}\n위 요청을 분석해서 ${path.join(WS,'orchestration_plan.json')} 에 저장해.`
  ));
  if (!ok0) { console.error('🛑 오케스트레이터 실패'); process.exit(1); }

  // Phase 1. scan-agent
  console.log(`\n🔍 Phase 1: 코드 스캔`);
  runAgent('scan-agent', MODELS.HAIKU, buildPrompt('scan-agent.md',
    [{ label:'orchestration_plan.json', content:readFile(path.join(WS,'orchestration_plan.json')) }],
    `orchestration_plan의 scan_targets 파일들을 읽고 요약해서 ${path.join(WS,'scan_result.json')} 에 저장해.`
  ));
  const scanResult = readResult('scan_result.json');

  // Phase 2. 스펙 작성
  console.log(`\n📝 Phase 2: 정밀 스펙 작성`);
  runAgent('spec-writer', MODELS.OPUS, buildPrompt('orchestrator-plan.md',
    [
      { label:'orchestration_plan.json', content:readFile(path.join(WS,'orchestration_plan.json')) },
      { label:'scan_result.json',        content:JSON.stringify(scanResult,null,2) },
    ],
    `scan 결과 바탕으로 feature-agent용 정밀 스펙을 ${path.join(WS,'feature_spec.json')} 에 작성해.`
  ));
  const featureSpec = readResult('feature_spec.json');
  if (!featureSpec) { console.error('🛑 스펙 작성 실패'); process.exit(1); }

  // Phase 3. feature-agent
  console.log(`\n⚙️  Phase 3: 코드 작성`);
  const fileInj = (scanResult?.file_contents||[]).map(f=>({ label:f.path, content:f.content }));
  const ok3 = runAgent('feature-agent', MODELS.OPUS, buildPrompt('feature-agent.md',
    [{ label:'feature_spec.json', content:JSON.stringify(featureSpec,null,2) }, ...fileInj],
    `feature_spec.json의 스펙대로 코드를 작성하고 ${path.join(WS,'feature_result.json')} 에 결과 저장.`
  ));
  if (!ok3) { console.error('🛑 feature 실패'); process.exit(1); }
  const featureResult = readResult('feature_result.json');
  if (featureResult?.status === 'failed') { console.error('🛑', featureResult.summary); process.exit(1); }

  // Phase 4. qa + db 병렬
  console.log(`\n🔀 Phase 4: 검증 (병렬)`);
  const parallelAgents = [{
    name:'qa-agent', model:MODELS.SONNET,
    prompt: buildPrompt('qa-agent.md',
      [{ label:'feature_result.json', content:JSON.stringify(featureResult,null,2) },
       { label:'feature_spec.json',   content:JSON.stringify(featureSpec,null,2) }],
      featureSpec?.affects_auth
        ? '인증 변경 포함. is_approved·role·middleware 검증. qa_result.json 저장'
        : '타입체크·빌드 검증. qa_result.json 저장')
  }];
  if (featureResult?.requires_db_change) {
    parallelAgents.push({ name:'db-agent', model:MODELS.SONNET,
      prompt: buildPrompt('db-agent.md',
        [{ label:'feature_result.json', content:JSON.stringify(featureResult,null,2) },
         { label:'PROJECT_CONTEXT.md',  content:readFile(CTX) }],
        'db_change_description 기반 마이그레이션 실행. db_result.json 저장') });
  } else {
    fs.writeFileSync(path.join(WS,'db_result.json'), JSON.stringify({status:'skipped'},null,2));
  }

  if (!hotfix) {
    const pr = await runParallel(parallelAgents);
    if (!pr.every(r=>r.ok)) { console.error(`🛑 병렬 실패`); process.exit(1); }
  } else {
    runAgent('qa-agent', MODELS.HAIKU, buildPrompt('qa-agent.md',
      [{ label:'feature_result.json', content:JSON.stringify(featureResult,null,2) }],
      '빌드만 빠르게 검증. qa_result.json 저장'));
  }

  const qaResult = readResult('qa_result.json');
  const dbResult = readResult('db_result.json');
  if (qaResult?.status==='failed') { console.error('🛑 QA 실패:', qaResult?.issues_found); process.exit(1); }
  if (dbResult?.status==='failed') { console.error('🛑 DB 실패'); process.exit(1); }

  // Phase 5. deploy
  let deployResult = null;
  if (!dryrun) {
    console.log(`\n🚀 Phase 5: 배포`);
    runAgent('deploy-agent', MODELS.HAIKU, buildPrompt('deploy-agent.md',
      [{ label:'qa_result.json',      content:JSON.stringify(qaResult,null,2) },
       { label:'feature_result.json', content:JSON.stringify(featureResult,null,2) }],
      'qa_result 확인 후 git commit·push. deploy_result.json 저장'));
    deployResult = readResult('deploy_result.json');
    if (deployResult?.status==='failed' || deployResult?.status==='error') {
      console.log(`\n⏪ rollback-agent 실행`);
      runAgent('rollback-agent', MODELS.HAIKU, buildPrompt('rollback-agent.md',
        [{ label:'deploy_result.json',  content:JSON.stringify(deployResult,null,2) },
         { label:'feature_result.json', content:JSON.stringify(featureResult,null,2) }],
        'git 상태 복구. rollback_result.json 저장'));
    }
  } else {
    deployResult = { status:'dry-run' };
  }

  // Phase 6. 기억 저장
  console.log(`\n${'─'.repeat(56)}\n▶ [기록]`);
  updateContext(featureResult, dbResult, task);
  writeObsidian(featureResult, dbResult, qaResult, deployResult);

  // task_input.txt 초기화
  fs.writeFileSync(TASK_FILE, '', 'utf8');

  const elapsed = ((Date.now()-t0)/1000).toFixed(1);
  console.log(`\n${'═'.repeat(56)}`);
  console.log(`🎉 완료  (${elapsed}초)`);
  console.log(`📋 ${task}`);
  (featureResult?.changed_files||[]).forEach(f=>console.log(`   • ${f}`));
  console.log(`✅ QA: tsc ${qaResult?.tsc} / build ${qaResult?.build}`);
  if (!dryrun && deployResult?.status==='deployed') console.log(`🚀 ${deployResult.commit_hash}`);
  console.log(`\n✏️  task_input.txt 초기화됨`);
})();

// ── 기억 저장 ─────────────────────────────────────────────────
function updateContext(featureResult, dbResult, taskTitle) {
  const cur = fs.existsSync(CTX) ? fs.readFileSync(CTX,'utf8') : '';
  const row = `| ${today} | ${taskId} | ${taskTitle} | ${(featureResult?.changed_files||[]).join(', ')} | ${featureResult?.requires_db_change ? dbResult?.changes?.join(', ')||'-' : '없음'} |`;
  fs.writeFileSync(CTX, cur
    .replace('| (아직 없음) | - | - | - | - |', `${row}\n| (아직 없음) | - | - | - | - |`)
    .replace(/\*마지막 갱신:.*\*/, `*마지막 갱신: ${today}*`));
}

function writeObsidian(featureResult, dbResult, qaResult, deployResult) {
  try {
    const files  = [...(featureResult?.changed_files||[]), ...(featureResult?.new_files||[])];
    const hash   = deployResult?.commit_hash || '미배포';
    const issues = featureResult?.known_issues || [];
    const logPath = path.join(OBSIDIAN,'작업로그',`${today}_${taskId}.md`);
    fs.mkdirSync(path.dirname(logPath),{recursive:true});
    fs.writeFileSync(logPath,
`---\ntags: [GA_NEXUS, 작업로그, ${today}]\ntask_id: ${taskId}\ndate: ${today}\n---\n\n# ${task}\n\n> ${today} | \`${hash}\`\n\n## 변경 파일\n${files.map(f=>`- \`${f}\``).join('\n')||'없음'}\n\n## QA\n- tsc: ${qaResult?.tsc||'-'} / build: ${qaResult?.build||'-'}\n\n## 요약\n${featureResult?.summary||''}${issues.length?`\n\n## ⚠️ 이슈\n${issues.map(i=>`- ${i}`).join('\n')}`:''}
`,'utf8');
    const dp = path.join(OBSIDIAN,'📋 프로젝트 현황.md');
    if (fs.existsSync(dp)) {
      let d = fs.readFileSync(dp,'utf8');
      d = d.replace(/_(작업 완료 시 자동 추가)_/, `- [[작업로그/${today}_${taskId}|${today} — ${task}]] \`${hash}\`\n\n_(작업 완료 시 자동 추가)_`)
           .replace('마지막 작업 | _(자동 갱신)_', `마지막 작업 | ${today} — ${task}`);
      fs.writeFileSync(dp, d,'utf8');
    }
    console.log(`  📓 Obsidian 기록 완료`);
  } catch(e) { console.warn(`⚠️  Obsidian 실패:`, e.message); }
}
