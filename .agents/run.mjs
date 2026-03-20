#!/usr/bin/env node
/**
 * GA_NEXUS 에이전트 파이프라인 v2
 * 사용법: node .agents/run.mjs "작업 내용" [--hotfix]
 *
 * ── 설계 원칙 ─────────────────────────────────────────────────
 * 오케스트레이터(이 스크립트 + Opus)가 똑똑하게 분석하고
 * 서브에이전트들은 좁은 스펙만 받아서 실행한다.
 *
 * 각 에이전트는 Node.js가 파일을 미리 읽어서 프롬프트에 주입 →
 * Claude가 도구 호출 없이 첫 턴부터 바로 실행 가능
 *
 * ── 실행 흐름 ─────────────────────────────────────────────────
 * Phase 0. 오케스트레이터 분석 (Opus)
 *           PROJECT_CONTEXT + 요청 → orchestration_plan.json
 * Phase 1. scan-agent (Haiku, 병렬 가능)
 *           관련 파일 목록·요약 → scan_result.json
 * Phase 2. 오케스트레이터가 feature_spec.json 작성
 * Phase 3. feature-agent (Opus)
 *           feature_spec.json만 보고 코드 작성
 * Phase 4. db-agent + qa-agent (Sonnet, 병렬)
 * Phase 5. deploy-agent (Haiku)
 * Phase 6. rollback 체크 + 기억 저장
 * ─────────────────────────────────────────────────────────────
 */

import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT   = path.resolve(__dirname, '..');
const WS     = path.join(__dirname, 'workspace');
const CTX    = path.join(__dirname, 'PROJECT_CONTEXT.md');
const OBSIDIAN = 'C:\\obsidian_hoons\\Hoonseo\\GA_NEXUS';

const MODELS = {
  OPUS:   'claude-opus-4-6',
  SONNET: 'claude-sonnet-4-6',
  HAIKU:  'claude-haiku-4-5-20251001',
};

// ── 인수 파싱 ─────────────────────────────────────────────────
const args    = process.argv.slice(2);
const task    = args.find(a => !a.startsWith('--'));
const hotfix  = args.includes('--hotfix');  // QA 스킵 긴급배포
const dryrun  = args.includes('--dry-run'); // 배포 없이 코드만

if (!task) {
  console.error('❌ 사용법: node .agents/run.mjs "작업" [--hotfix] [--dry-run]');
  process.exit(1);
}

fs.mkdirSync(WS, { recursive: true });
['orchestration_plan','scan_result','feature_spec','feature_result',
 'db_result','qa_result','deploy_result'].forEach(f => {
  const p = path.join(WS, `${f}.json`);
  if (fs.existsSync(p)) fs.unlinkSync(p);
});

const taskId = `TASK-${Date.now()}`;
const now    = new Date().toISOString();
const today  = now.slice(0, 10);

console.log(`\n${'═'.repeat(56)}`);
console.log(`🚀 GA_NEXUS 파이프라인 v2  [${taskId}]`);
console.log(`📋 ${task}`);
if (hotfix)  console.log(`⚡ HOTFIX 모드: QA 경량화`);
if (dryrun)  console.log(`🔍 DRY-RUN: 배포 생략`);
console.log(`${'═'.repeat(56)}\n`);

// ── 핵심 유틸 ─────────────────────────────────────────────────

/** 파일을 읽어 프롬프트에 직접 주입 (Claude 도구 호출 불필요) */
function readFile(filePath) {
  if (!fs.existsSync(filePath)) return '(파일 없음)';
  return fs.readFileSync(filePath, 'utf8');
}

/** JSON 결과 파일 읽기 */
function readResult(file) {
  const p = path.join(WS, file);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

/**
 * 에이전트 실행 — Node.js가 필요한 파일을 미리 읽어서 프롬프트에 주입
 * Claude는 첫 턴부터 모든 컨텍스트를 가지고 바로 실행
 */
function buildPrompt(agentFile, injections, instruction) {
  const agentInstr = readFile(path.join(__dirname, agentFile));
  const contextBlock = injections.map(({ label, content }) =>
    `### ${label}\n\`\`\`\n${content}\n\`\`\``
  ).join('\n\n');
  return [agentInstr, '---', '## 주입된 컨텍스트', contextBlock,
          '---', '## 지금 할 일', instruction].join('\n\n');
}

function runAgent(name, model, prompt) {
  console.log(`\n${'─'.repeat(56)}\n▶ [${name}]  ${model}`);
  // 프롬프트를 파일로 저장 → Windows cmd 길이 제한 우회
  const pf = path.join(WS, `_p_${name}.txt`);
  fs.writeFileSync(pf, prompt, 'utf8');
  const cmd = `powershell -Command "claude --model ${model} --print (Get-Content -Raw '${pf.replace(/\\/g,'/')}')"`;
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit', timeout: 360_000 });
    console.log(`✅ [${name}] 완료`);
    return true;
  } catch(e) { console.error(`❌ [${name}]`, e.message); return false; }
}

async function runParallel(agents) {
  console.log(`\n${'─'.repeat(56)}\n▶▶ 병렬: ${agents.map(a=>a.name).join(' + ')}`);
  return Promise.all(agents.map(({ name, model, prompt }) => {
    const pf = path.join(WS, `_p_${name}.txt`);
    fs.writeFileSync(pf, prompt, 'utf8');
    const cmd = `powershell -Command "claude --model ${model} --print (Get-Content -Raw '${pf.replace(/\\/g,'/')}')"`;
    const t = Date.now();
    return execAsync(cmd, { cwd: ROOT, timeout: 360_000 })
      .then(({ stdout, stderr }) => {
        if (stdout) process.stdout.write(stdout);
        if (stderr) process.stderr.write(stderr);
        console.log(`✅ [${name}]  ${((Date.now()-t)/1000).toFixed(1)}s`);
        return { name, ok: true };
      })
      .catch(e => { console.error(`❌ [${name}]`, e.message); return { name, ok: false }; });
  }));
}

// ── 파이프라인 ────────────────────────────────────────────────
(async () => {
  const t0 = Date.now();

  // ── Phase 0. 오케스트레이터 분석 (Opus) ──────────────────────
  // 메인 컨텍스트(PROJECT_CONTEXT)를 읽고 작업을 분석,
  // 어떤 파일을 스캔해야 하는지 + affects_auth 등 플래그 결정
  console.log(`\n📐 Phase 0: 오케스트레이터 분석`);
  const p0 = buildPrompt('orchestrator-plan.md', [
    { label: 'PROJECT_CONTEXT.md', content: readFile(CTX) },
  ], `작업 요청: "${task}"
hotfix: ${hotfix}

위 요청을 분석해서 ${path.join(WS, 'orchestration_plan.json')} 에 저장해.`);

  const p0ok = runAgent('orchestrator', MODELS.OPUS, p0);
  if (!p0ok) { console.error('🛑 오케스트레이터 분석 실패'); process.exit(1); }
  const plan = readResult('orchestration_plan.json');

  // ── Phase 1. scan-agent (Haiku, 병렬 가능) ───────────────────
  // 관련 파일만 빠르게 읽고 구조 요약 → feature-agent 컨텍스트 최소화
  console.log(`\n🔍 Phase 1: 코드 스캔`);
  const scanPrompt = buildPrompt('scan-agent.md', [
    { label: 'orchestration_plan.json', content: readFile(path.join(WS,'orchestration_plan.json')) },
  ], `orchestration_plan의 scan_targets 파일들을 읽고 요약해서 ${path.join(WS,'scan_result.json')} 에 저장해.`);
  runAgent('scan-agent', MODELS.HAIKU, scanPrompt);
  const scanResult = readResult('scan_result.json');

  // ── Phase 2. 오케스트레이터가 feature_spec 작성 ───────────────
  // scan 결과 + plan → 정밀한 코드 작성 스펙 생성
  // feature-agent는 이 스펙만 보면 됨 (전체 프로젝트 파악 불필요)
  console.log(`\n📝 Phase 2: 정밀 스펙 작성`);
  const p2 = buildPrompt('orchestrator-plan.md', [
    { label: 'orchestration_plan.json', content: readFile(path.join(WS,'orchestration_plan.json')) },
    { label: 'scan_result.json',        content: JSON.stringify(scanResult, null, 2) },
  ], `scan 결과를 바탕으로 feature-agent가 코드를 작성하기 위한 정밀 스펙을
${path.join(WS,'feature_spec.json')} 에 작성해. 스펙에는 다음이 포함되어야 해:
- 수정할 파일 목록 + 각 파일에서 변경할 부분 설명
- 새로 만들 파일 + 인터페이스/타입 정의
- DB 변경 필요 여부 + 상세 설명
- affects_auth: 인증 관련 코드 변경 여부
- 주의사항`);

  runAgent('spec-writer', MODELS.OPUS, p2);
  const featureSpec = readResult('feature_spec.json');
  if (!featureSpec) { console.error('🛑 스펙 작성 실패'); process.exit(1); }

  // ── Phase 3. feature-agent (Opus) ────────────────────────────
  // 정밀 스펙 + 관련 파일 내용만 받음 → 좁은 컨텍스트로 고품질 코드
  console.log(`\n⚙️  Phase 3: 코드 작성`);

  // scan_result의 파일 내용을 주입 (Claude가 별도로 파일 안 읽어도 됨)
  const fileInjections = (scanResult?.file_contents || []).map(f => ({
    label: f.path, content: f.content
  }));

  const p3 = buildPrompt('feature-agent.md', [
    { label: 'feature_spec.json', content: JSON.stringify(featureSpec, null, 2) },
    ...fileInjections,
  ], `feature_spec.json의 스펙대로 코드를 작성하고
${path.join(WS,'feature_result.json')} 에 결과를 저장해.
주입된 파일 내용을 참고해서 직접 파일을 수정해. (파일을 다시 읽을 필요 없음)`);

  const p3ok = runAgent('feature-agent', MODELS.OPUS, p3);
  if (!p3ok) { console.error('🛑 feature 실패'); process.exit(1); }
  const featureResult = readResult('feature_result.json');
  if (featureResult?.status === 'failed') {
    console.error('🛑', featureResult.summary); process.exit(1);
  }

  // ── Phase 4. db + qa 병렬 (Sonnet) ──────────────────────────
  console.log(`\n🔀 Phase 4: 검증 (병렬)`);
  const parallelAgents = [];

  // qa-agent: affects_auth면 더 엄격하게
  const qaInstruction = featureSpec?.affects_auth
    ? '인증 관련 변경이 포함됨. is_approved 체크, role 기반 접근, middleware 흐름까지 검증. qa_result.json 저장'
    : 'feature_result.json 기준으로 타입체크·빌드 검증. qa_result.json 저장';

  parallelAgents.push({
    name: 'qa-agent', model: MODELS.SONNET,
    prompt: buildPrompt('qa-agent.md', [
      { label: 'feature_result.json', content: JSON.stringify(featureResult, null, 2) },
      { label: 'feature_spec.json',   content: JSON.stringify(featureSpec, null, 2) },
    ], qaInstruction)
  });

  if (featureResult?.requires_db_change) {
    parallelAgents.push({
      name: 'db-agent', model: MODELS.SONNET,
      prompt: buildPrompt('db-agent.md', [
        { label: 'feature_result.json', content: JSON.stringify(featureResult, null, 2) },
        { label: 'PROJECT_CONTEXT.md',  content: readFile(CTX) },
      ], 'feature_result의 db_change_description 기반으로 마이그레이션 실행. db_result.json 저장')
    });
  } else {
    fs.writeFileSync(path.join(WS,'db_result.json'),
      JSON.stringify({ status:'skipped', summary:'DB 변경 없음' }, null, 2));
  }

  if (!hotfix) {
    const parallelResults = await runParallel(parallelAgents);
    if (!parallelResults.every(r=>r.ok)) {
      console.error(`🛑 병렬 실패: ${parallelResults.filter(r=>!r.ok).map(r=>r.name).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log(`⚡ HOTFIX 모드: QA 경량화 실행`);
    runAgent('qa-agent', MODELS.HAIKU,
      buildPrompt('qa-agent.md', [
        { label: 'feature_result.json', content: JSON.stringify(featureResult, null, 2) }
      ], '빌드만 빠르게 검증. qa_result.json 저장')
    );
  }

  const qaResult = readResult('qa_result.json');
  const dbResult = readResult('db_result.json');
  if (qaResult?.status === 'failed') {
    console.error('🛑 QA 실패:', qaResult?.issues_found); process.exit(1);
  }
  if (dbResult?.status === 'failed') {
    console.error('🛑 DB 실패'); process.exit(1);
  }

  // ── Phase 5. deploy (Haiku) ───────────────────────────────────
  let deployResult = null;
  if (!dryrun) {
    console.log(`\n🚀 Phase 5: 배포`);
    runAgent('deploy-agent', MODELS.HAIKU,
      buildPrompt('deploy-agent.md', [
        { label: 'qa_result.json',      content: JSON.stringify(qaResult, null, 2) },
        { label: 'feature_result.json', content: JSON.stringify(featureResult, null, 2) },
        { label: 'task.json',           content: readFile(path.join(WS,'task.json')) },
      ], 'qa_result 확인 후 git commit·push. deploy_result.json 저장')
    );
    deployResult = readResult('deploy_result.json');

    // 배포 실패 시 rollback-agent 호출
    if (deployResult?.status === 'failed' || deployResult?.status === 'error') {
      console.log(`\n⏪ 배포 실패 → rollback-agent 실행`);
      runAgent('rollback-agent', MODELS.HAIKU,
        buildPrompt('rollback-agent.md', [
          { label: 'deploy_result.json',  content: JSON.stringify(deployResult, null, 2) },
          { label: 'feature_result.json', content: JSON.stringify(featureResult, null, 2) },
        ], '배포 실패 원인 파악 후 git 상태 복구. rollback_result.json 저장')
      );
    }
  } else {
    console.log(`\n🔍 DRY-RUN: 배포 생략`);
    deployResult = { status: 'dry-run', summary: '배포 생략됨' };
  }

  // ── Phase 6. 기억 저장 ────────────────────────────────────────
  console.log(`\n${'─'.repeat(56)}\n▶ [기록] PROJECT_CONTEXT.md + Obsidian`);
  updateProjectContext(featureResult, dbResult, task, featureSpec);
  writeToObsidian(featureResult, dbResult, qaResult, deployResult);

  // ── 최종 보고 ─────────────────────────────────────────────────
  const elapsed = ((Date.now()-t0)/1000).toFixed(1);
  console.log(`\n${'═'.repeat(56)}`);
  console.log(`🎉 완료  (${elapsed}초)  [${taskId}]`);
  console.log(`${'═'.repeat(56)}`);
  console.log(`\n📋 ${task}`);
  console.log(`\n📁 변경:`);
  (featureResult?.changed_files||[]).forEach(f => console.log(`   • ${f}`));
  (featureResult?.new_files||[]).forEach(f => console.log(`   + ${f}`));
  if (featureSpec?.affects_auth) console.log(`\n🔐 인증 변경 포함 → QA 강화 적용됨`);
  console.log(`\n✅ QA: tsc ${qaResult?.tsc} / build ${qaResult?.build}`);
  if (!dryrun && deployResult?.status === 'deployed')
    console.log(`🚀 ${deployResult.commit_hash} → ${deployResult.pushed_to}`);
  console.log(`\n📓 Obsidian 작업로그 갱신됨`);
  console.log(`\n💰 모델: Opus(분석+스펙+코드) Sonnet(db+qa) Haiku(스캔+배포)`);
})();

// ── PROJECT_CONTEXT 갱신 ──────────────────────────────────────
function updateProjectContext(featureResult, dbResult, taskTitle, featureSpec) {
  const current = fs.existsSync(CTX) ? fs.readFileSync(CTX, 'utf8') : '';
  const row = `| ${today} | ${taskId} | ${taskTitle} | ${(featureResult?.changed_files||[]).join(', ')} | ${featureResult?.requires_db_change ? dbResult?.changes?.join(', ')||'-' : '없음'} |`;
  const updated = current
    .replace('| (아직 없음) | - | - | - | - |', `${row}\n| (아직 없음) | - | - | - | - |`)
    .replace(/\*마지막 갱신:.*\*/, `*마지막 갱신: ${today}*`);
  fs.writeFileSync(CTX, updated);
}

// ── Obsidian 기록 ─────────────────────────────────────────────
function writeToObsidian(featureResult, dbResult, qaResult, deployResult) {
  try {
    const files    = [...(featureResult?.changed_files||[]), ...(featureResult?.new_files||[])];
    const hash     = deployResult?.commit_hash || '미배포';
    const issues   = featureResult?.known_issues || [];

    const logPath = path.join(OBSIDIAN, '작업로그', `${today}_${taskId}.md`);
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.writeFileSync(logPath, `---
tags: [GA_NEXUS, 작업로그, ${today}]
task_id: ${taskId}
date: ${today}
---

# ${task}

> ${today} | \`${hash}\`

## 변경 파일
${files.map(f=>`- \`${f}\``).join('\n')||'없음'}

## QA
- tsc: ${qaResult?.tsc||'-'} / build: ${qaResult?.build||'-'}

## 요약
${featureResult?.summary||''}
${issues.length ? `\n## ⚠️ 이슈\n${issues.map(i=>`- ${i}`).join('\n')}` : ''}

---
[[📋 프로젝트 현황]] | [[확립된 코드 패턴]]
`);

    // 프로젝트 현황 갱신
    const dashPath = path.join(OBSIDIAN, '📋 프로젝트 현황.md');
    if (fs.existsSync(dashPath)) {
      let dash = fs.readFileSync(dashPath, 'utf8');
      dash = dash
        .replace(/_(작업 완료 시 자동 추가)_/, `- [[작업로그/${today}_${taskId}|${today} — ${task}]] \`${hash}\`\n\n_(작업 완료 시 자동 추가)_`)
        .replace('마지막 작업 | _(자동 갱신)_', `마지막 작업 | ${today} — ${task}`)
        .replace(/updated: .*/, `updated: ${today}`);
      fs.writeFileSync(dashPath, dash);
    }

    if (issues.length) {
      const ip = path.join(OBSIDIAN, '알려진 이슈 & 기술 부채.md');
      if (fs.existsSync(ip)) {
        let note = fs.readFileSync(ip, 'utf8');
        note = note.replace('_(자동 추가됨)_',
          issues.map(i=>`- [ ] ${i} _(${today})_`).join('\n') + '\n\n_(자동 추가됨)_');
        fs.writeFileSync(ip, note);
      }
    }
    console.log(`  📓 Obsidian 기록 완료`);
  } catch(e) { console.warn(`⚠️  Obsidian 기록 실패:`, e.message); }
}
