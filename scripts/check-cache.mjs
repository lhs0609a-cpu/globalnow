import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import path from 'node:path';
import { createRequire } from 'node:module';
const loadPackage = createRequire(import.meta.url);

// Load the real TypeScript implementation without changing the app's compiler setup.
function loadTypeScript(file) {
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const implementation = { exports: {} };
  const resolveRequire = name => name.startsWith('@/') ? loadTypeScript(path.join('src', `${name.slice(2)}.ts`)) : loadPackage(name);
  vm.compileFunction(output, ['exports', 'require', 'module'])(implementation.exports, resolveRequire, implementation);
  return implementation.exports;
}
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
const { cacheGet, cacheSet, cacheDelete, cacheGetOrSet } = loadTypeScript('src/lib/redis/cache.ts');

(async () => {
  let calls = 0;
  const values = await Promise.all(Array.from({ length: 100 }, () => cacheGetOrSet('test:concurrent', async () => {
    calls++;
    await new Promise(resolve => setTimeout(resolve, 10));
    return { count: 42 };
  }, 60)));
  assert.equal(calls, 1, '100 concurrent cache misses must perform one upstream fetch');
  assert.ok(values.every(value => value.count === 42));
  await cacheGetOrSet('test:concurrent', async () => { throw new Error('cache hit must not refetch'); });
  await cacheDelete('test:concurrent');
  assert.equal(await cacheGet('test:concurrent'), null);
  await cacheSet('test:expired', { value: 1 }, 0);
  assert.equal(await cacheGet('test:expired'), null, 'expired entries must not be returned');
  await assert.rejects(cacheGetOrSet('test:retry', async () => { throw new Error('upstream'); }));
  assert.equal(await cacheGetOrSet('test:retry', async () => 7), 7, 'failed in-flight entry must allow retry');
  for (let i = 0; i < 250; i++) await cacheSet(`test:bounded:${i}`, i, 60);
  assert.equal(await cacheGet('test:bounded:0'), null, 'memory must remain bounded');
  assert.equal(await cacheGet('test:bounded:249'), 249);
  console.log('PASS: 100-way coalescing, warm hit, delete, expiry, failure recovery, 200-entry bound');
  const { articleToNewsItem } = loadTypeScript('src/lib/collectors/rss-collector.ts');
  const article = { title: 'Original title', link: 'https://example.com/one', sourceId: 'reuters', category: 'international', country: 'US' };
  const first = articleToNewsItem(article);
  assert.equal(first.id, articleToNewsItem({ ...article, title: 'Updated title' }).id, 'the same URL must retain identity after recollection and title updates');
  assert.notEqual(first.id, articleToNewsItem({ ...article, link: 'https://example.com/two' }).id);
  const { getMockNews } = loadTypeScript('src/lib/demo/mock-news.ts');
  assert.deepEqual(getMockNews({ search: 'no-match-unique-query' }), [], 'demo search must respect the query');
  assert.ok(getMockNews({ country: 'US', category: 'economy' }).every(item => item.country === 'US' && item.category === 'economy'));
  console.log('PASS: stable article identity and demo search/filter semantics');
})().catch(error => { console.error(error); process.exitCode = 1; });
