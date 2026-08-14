#!/usr/bin/env node
/**
 * 수집·생성 잡 수동 실행기.
 *
 * Vercel 크론은 유료 구간에서 비용이 붙어 쓰지 않기로 했다. 대신 필요할 때
 * 이 스크립트로 같은 엔드포인트를 직접 호출한다. 인증은 라우트가 검사하는
 * CRON_SECRET을 그대로 쓴다.
 *
 *   npm run collect                  기본 잡 전부 (프로덕션)
 *   npm run collect -- rss market    지정한 잡만
 *   npm run collect -- --local       localhost:3000 대상
 *   npm run collect -- --list        실행 가능한 잡 목록
 *
 * newsletter는 실제로 메일을 보내므로 기본 실행에서 빠져 있다. 보내려면
 * 이름을 직접 적어야 한다: npm run collect -- newsletter
 */

import { readFileSync } from 'node:fs';

const JOBS = [
  { name: 'rss', path: 'collect-rss', desc: 'RSS 피드 수집', default: true },
  { name: 'hn', path: 'collect-hn', desc: '해커뉴스 수집', default: true },
  { name: 'reddit', path: 'collect-reddit', desc: '레딧 수집', default: true },
  { name: 'market', path: 'collect-market', desc: '시장 데이터 수집', default: true },
  { name: 'humor', path: 'collect-humor', desc: '유머·밈 수집', default: true },
  { name: 'brief', path: 'generate-brief', desc: '모닝 브리프 생성', default: true },
  { name: 'weekly', path: 'generate-weekly-report', desc: '주간 산업 리포트 생성', default: false },
  { name: 'newsletter', path: 'send-newsletter', desc: '뉴스레터 발송 (실제로 메일이 나간다)', default: false },
];

const PROD_URL = 'https://globalnow-temp.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

function readSecret() {
  if (process.env.CRON_SECRET) return process.env.CRON_SECRET;
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    const match = env.match(/^CRON_SECRET=(.*)$/m);
    if (match) return match[1].trim();
  } catch {
    // .env.local이 없으면 아래에서 안내한다
  }
  return null;
}

const args = process.argv.slice(2);

if (args.includes('--list')) {
  console.log('실행 가능한 잡:\n');
  for (const job of JOBS) {
    console.log(`  ${job.name.padEnd(12)} ${job.desc}${job.default ? '' : '  (기본 실행에서 제외)'}`);
  }
  process.exit(0);
}

const secret = readSecret();
if (!secret) {
  console.error('CRON_SECRET을 찾지 못했습니다.');
  console.error('.env.local에 CRON_SECRET=... 을 넣거나 환경변수로 넘겨 주세요.');
  console.error('Vercel에 등록된 값은 대시보드 > Settings > Environment Variables에서 확인할 수 있습니다.');
  process.exit(1);
}

const baseUrl = args.includes('--local') ? LOCAL_URL : PROD_URL;
const named = args.filter(a => !a.startsWith('--'));

let targets;
if (named.length > 0) {
  targets = [];
  for (const name of named) {
    const job = JOBS.find(j => j.name === name);
    if (!job) {
      console.error(`알 수 없는 잡: ${name}`);
      console.error(`가능한 값: ${JOBS.map(j => j.name).join(', ')}`);
      process.exit(1);
    }
    targets.push(job);
  }
} else {
  targets = JOBS.filter(j => j.default);
}

console.log(`대상: ${baseUrl}`);
console.log(`실행할 잡 ${targets.length}개: ${targets.map(j => j.name).join(', ')}\n`);

let failed = 0;

for (const job of targets) {
  const url = `${baseUrl}/api/cron/${job.path}`;
  const started = process.hrtime.bigint();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
    });
    const elapsed = Number(process.hrtime.bigint() - started) / 1e9;
    const body = await res.text();

    if (!res.ok) {
      failed++;
      console.log(`✗ ${job.name.padEnd(12)} HTTP ${res.status}  ${elapsed.toFixed(1)}s  ${body.slice(0, 120)}`);
      continue;
    }

    let summary = body.slice(0, 120);
    try {
      const json = JSON.parse(body);
      const { success, ...rest } = json;
      void success;
      summary = JSON.stringify(rest);
    } catch {
      // JSON이 아니면 원문 앞부분을 그대로 보여준다
    }
    console.log(`✓ ${job.name.padEnd(12)} ${elapsed.toFixed(1)}s  ${summary}`);
  } catch (error) {
    failed++;
    const elapsed = Number(process.hrtime.bigint() - started) / 1e9;
    console.log(`✗ ${job.name.padEnd(12)} ${elapsed.toFixed(1)}s  ${error.message}`);
  }
}

console.log(`\n성공 ${targets.length - failed} / ${targets.length}`);
process.exit(failed > 0 ? 1 : 0);
