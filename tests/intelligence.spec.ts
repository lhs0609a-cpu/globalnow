import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { buildSnapshot, classifyNews, inWindow, matchesProfile, briefMarkdown } from '../src/lib/intelligence/model';
import { MOCK_NEWS } from '../src/lib/demo/mock-news';
import { getMockMarketData } from '../src/lib/demo/mock-market';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { computeMatchReasons } from '../src/lib/services/watchdog-service';
const now=new Date();
const article=(id:string,title:string,hours=1)=>({...MOCK_NEWS[0],id,url:'https://example.com/'+id,title,titleKo:title,tags:[],summary:undefined,summaryKo:undefined,category:'economy' as const,country:'US',source:{...MOCK_NEWS[0].source,country:'US'},publishedAt:new Date(now.getTime()-hours*3600000).toISOString()});
const snapshot=buildSnapshot([
  article('japan','Japan central bank announces interest rate decision'),
  article('china','China export sanctions disrupt semiconductor supply chain'),
  article('china-copy','China export sanctions disrupt semiconductor supply chain'),
  article('korea','한국 반도체 수출 증가'),
  article('energy','Saudi oil supply update'),
  article('older','Germany trade policy update',50),
  article('expired','France regulation update',200),
  {...article('invalid','India trade update'),publishedAt:'invalid'},
  {...article('sports','Brazil football match'),category:'sports'},
], 'demo',9,now);
test.beforeEach(async({page})=>{
  await page.route('https://**',route=>route.abort());
  await page.route('**/api/intelligence',route=>route.fulfill({json:snapshot}));
  await page.route('**/api/market',route=>route.fulfill({json:{...getMockMarketData(),provenance:{indices:'demo',forex:'demo',crypto:'demo',fearGreed:'demo'}}}));
});
test('classification uses article geography, preserves evidence, rejects incidental matches and stale dates',()=>{
  const japan=snapshot.signals.find(s=>s.id==='japan')!;
  expect(japan.countries).toEqual(['JP']);
  expect(japan.themes).toContain('macro');
  expect(snapshot.signals.find(s=>s.id==='china')!.related).toHaveLength(1);
  expect(snapshot.signals.find(s=>s.id==='china')!.urgent).toBe(true);
  expect(classifyNews(article('plural','New tariffs and chips exports'))!.themes).toEqual(expect.arrayContaining(['trade','technology']));
  expect(snapshot.signals.some(s=>s.id==='sports')).toBe(false);
  expect(classifyNews(article('words','Companies said their gains remain steady'))!.themes).not.toContain('technology');
  expect(classifyNews(article('geo','Indonesia shipping update'))!.countries).toEqual(['ID']);
  expect(classifyNews(article('geoko','인도네시아 공급망 점검'))!.countries).toEqual(['ID']);
  expect(inWindow(snapshot.signals.find(s=>s.id==='invalid')!,168,now.getTime())).toBe(false);
  expect(inWindow(snapshot.signals.find(s=>s.id==='older')!,24,now.getTime())).toBe(false);
  expect(matchesProfile(japan,{countries:['JP'],themes:[],keywords:''})).toBe(true);
  const markdown=briefMarkdown([japan],snapshot,'일본');
  expect(markdown).toContain('https://example.com/japan');
  expect(markdown).toContain('샘플');
  expect(computeMatchReasons(article('ticker','Retail demand remains steady'),['AI']).matchedTickers).toEqual([]);
  expect(computeMatchReasons(article('ticker-ok','AI reports quarterly earnings'),['AI']).matchedTickers).toEqual(['AI']);
});
test('map, country, theme and time filters agree and survive browser history',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'세계 상황판',exact:true})).toBeVisible();
  await expect(page.locator('article')).toHaveCount(4);
  await expect(page.locator('.intel-map .rsm-geography')).toHaveCount(177);
  expect(await page.locator('.intel-map [data-country="unclassified"]').first().evaluate(el=>(el as SVGElement).style.fill)).toBe('var(--map-land)');
  await page.getByLabel('지역',{exact:true}).selectOption('JP');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('Japan');
  await expect(page).toHaveURL(/country=JP/);
  await page.goBack();
  await expect(page.locator('article')).toHaveCount(4);
  await page.getByLabel('기간',{exact:true}).selectOption('72');
  await expect(page.locator('article')).toHaveCount(5);
  await page.getByLabel('주제',{exact:true}).selectOption('energy');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('Saudi');
});
test('monitor persistence, evidence dialog and export form a complete decision workflow',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'내 모니터 설정',exact:true}).click();
  const editor=page.getByRole('dialog',{name:'내 모니터 설정'});
  await editor.getByRole('button',{name:'일본',exact:true}).click();
  await editor.getByRole('button',{name:'모니터 저장',exact:true}).click();
  await page.getByRole('button',{name:/^내 모니터 \d/}).click();
  await expect(page.locator('article')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('article')).toHaveCount(1);
  const trigger=page.locator('article').getByRole('button',{name:'근거·영향 검토'});
  await trigger.click();
  const dialog=page.getByRole('dialog',{name:'상황 근거와 확인 과제'});
  await expect(dialog).toContainText('매체 소재지');
  await expect(dialog).toContainText('금리·거시경제');
  await expect(dialog.getByRole('link',{name:/원문 열기/})).toHaveAttribute('href','https://example.com/japan');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'브리프 내보내기'}).click();
  const download=await downloadPromise;
  const content=await readFile((await download.path())!,'utf8');
  expect(content).toContain('Japan');
  expect(content).not.toContain('Saudi');
  expect(content).toContain('샘플');
});
test('failed refresh retains evidence and a retry recovers',async({page})=>{
  await page.goto('/');
  await expect(page.locator('article')).toHaveCount(4);
  await page.route('**/api/intelligence',route=>route.fulfill({status:503,json:{}}));
  await page.getByRole('button',{name:'새로고침',exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('이전 조회 자료');
  await expect(page.locator('article')).toHaveCount(4);
  await page.route('**/api/intelligence',route=>route.fulfill({json:snapshot}));
  await page.getByRole('button',{name:'다시 시도',exact:true}).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
});
test('retired entertainment routes and APIs are no longer active',async({page,request})=>{
  await page.goto('/predict');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link',{name:'뉴스 배틀'})).toHaveCount(0);
  await page.goto('/fun/memes');
  await expect(page).toHaveURL('/');
  expect((await request.get('/api/leaderboard')).status()).toBe(410);
  expect((await request.post('/api/predict/test/vote',{data:{vote:'yes'}})).status()).toBe(410);
});
test('regional comparison and industry research expose original evidence',async({page})=>{
  await page.goto('/compare');
  await page.getByLabel('비교 지역 1').selectOption('JP');
  await expect(page.locator('section').first()).toContainText('Japan central bank');
  await page.goto('/reports');
  await expect(page.getByRole('heading',{name:'산업 리서치',exact:true})).toBeVisible();
  await expect(page.locator('article')).toHaveCount(2);
  await page.getByRole('button',{name:'에너지·자원',exact:true}).click();
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('Saudi');
});
test('executive board reflows and has no automated AA violations in both themes',async({page})=>{
  test.setTimeout(240000);
  for(const theme of ['light','dark'] as const){
    await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
    for(const width of [320,390,768,1024,1440]){
      await page.setViewportSize({width,height:1000});
      await page.goto('/');
      await expect(page.locator('article')).toHaveCount(4);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(width===390||width===1440){
        const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
        await page.screenshot({path:'artifacts/ux/board-'+theme+'-'+width+'.png',fullPage:true});
      }
    }
  }
});
test('decision strategy artifact has working navigation and cited sources',async({page})=>{
  await page.setViewportSize({width:1280,height:900});
  await page.goto(pathToFileURL(resolve('docs/decision-intelligence-strategy.html')).href);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Globalnow 의사결정 도구 재설계');
  expect(await page.locator('nav a').count()).toBeGreaterThan(8);
  expect(await page.locator('a[href^="https://"]').count()).toBeGreaterThanOrEqual(6);
  await page.getByRole('link',{name:'분류와 우선순위의 데이터 계약',exact:true}).click();
  await expect(page.getByRole('heading',{name:'분류와 우선순위의 데이터 계약',exact:true})).toBeInViewport();
  await page.goto(pathToFileURL(resolve('docs/decision-intelligence-strategy.html')).href);
  await page.screenshot({path:'artifacts/ux/decision-strategy-report.png'});
});
