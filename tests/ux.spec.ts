import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MOCK_NEWS } from '../src/lib/demo/mock-news';
import { getMockMarketData } from '../src/lib/demo/mock-market';
import { getMockBrief } from '../src/lib/demo/mock-brief';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const articles = Array.from({ length: 23 }, (_, index) => ({
  ...MOCK_NEWS[index % MOCK_NEWS.length], id: `test-${index}`, url: `https://example.com/news/${index}`, imageUrl: undefined,
  title: `Research ${index}`, titleKo: `검증 뉴스 ${index} — 세계 경제와 기술의 변화`,
  category: index % 2 ? 'tech' : 'economy', publishedAt: '2026-09-08T00:00:00Z',
}));
async function fixtures(page: Page) {
  await page.route('https://**', route => route.abort());
  await page.route('**/api/brief/today', route => route.fulfill({ json: getMockBrief() }));
  await page.route('**/api/market', route => route.fulfill({ json: { ...getMockMarketData(), provenance: { indices: 'demo', crypto: 'demo', forex: 'demo', fearGreed: 'demo' } } }));
  await page.route('**/api/news?**', route => {
    const params = new URL(route.request().url()).searchParams;
    const category = params.get('category');
    const search = params.get('search');
    let result = articles.filter(item => !category || item.category === category);
    if (search) result = result.filter(item => `${item.title} ${item.titleKo}`.includes(search));
    const current = Number(params.get('page') || 1);
    const limit = Number(params.get('limit') || 10);
    return route.fulfill({ json: { items: result.slice((current - 1) * limit, current * limit), total: result.length, mode: 'demo' } });
  });
}

test.beforeEach(async ({ page }) => { await fixtures(page); });

test('search, category and browser history control the actual feed', async ({ page }) => {
  await page.goto('/news');
  await expect(page.locator('article')).toHaveCount(10);
  await page.getByRole('button', { name: '테크', exact: true }).click();
  await expect(page).toHaveURL(/category=tech/);
  await expect(page.locator('article').first()).toContainText('검증 뉴스 1');
  await expect(page.locator('article').filter({ hasText: '검증 뉴스 0 —' })).toHaveCount(0);
  await page.goBack();
  await expect(page.locator('article').first()).toContainText('검증 뉴스 0');
  await page.getByRole('searchbox', { name: '뉴스 검색' }).fill('Research 22');
  await page.getByRole('searchbox', { name: '뉴스 검색' }).press('Enter');
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('검증 뉴스 22');
});

test('one request per added page, append preserves earlier articles and failures are recoverable', async ({ page }) => {
  let pageTwoRequests = 0;
  await page.route('**/api/news?**', async route => {
    const pageNumber = new URL(route.request().url()).searchParams.get('page');
    if (pageNumber === '2') { pageTwoRequests++; if (pageTwoRequests === 1) return route.fulfill({ status: 503, json: { error: 'test failure' } }); }
    return route.fallback();
  });
  await page.goto('/news');
  await expect(page.locator('article')).toHaveCount(10);
  await page.getByRole('button', { name: '뉴스 더 보기', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('불러오지 못했습니다');
  await expect(page.locator('article')).toHaveCount(10);
  expect(pageTwoRequests).toBe(1);
  await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(20);
  expect(pageTwoRequests).toBe(2);
  await expect(page.locator('article').first()).toContainText('검증 뉴스 0');
  await page.getByRole('button', { name: '뉴스 더 보기', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(23);
  await expect(page.getByRole('button', { name: '뉴스 더 보기', exact: true })).toHaveCount(0);
});

test('empty results offer a working escape and failures are not presented as empty results', async ({ page }) => {
  await page.goto('/news?search=no-match');
  await expect(page.getByText('검색 결과가 없습니다', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: '전체 뉴스 보기', exact: true }).click();
  await expect(page.locator('article')).toHaveCount(10);
  await page.route('**/api/news?**', route => route.fulfill({ status: 500, json: {} }));
  await page.reload();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('뉴스를 불러오지 못했습니다');
  await expect(page.getByText('검색 결과가 없습니다', { exact: true })).toHaveCount(0);
});

test('guest save survives reload, appears on saved page, exports and can be removed', async ({ page }) => {
  await page.goto('/news');
  await page.getByRole('button', { name: '기사 저장', exact: true }).first().click();
  await expect(page.getByRole('button', { name: '저장 해제', exact: true })).toHaveCount(1);
  await page.goto('/saved');
  await page.reload();
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.locator('article')).toContainText('검증 뉴스 0');
  await page.goto('/settings');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'CSV 내보내기 (1건)' }).click();
  expect((await download).suggestedFilename()).toMatch(/globalnow-saved/);
  await page.goto('/saved');
  await page.getByRole('button', { name: '저장 해제', exact: true }).click();
  await expect(page.getByText('다시 읽고 싶은 뉴스를 모아보세요.')).toBeVisible();
});

test('analysis is not clipped, supports retry, traps keyboard focus and restores it', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  let attempts = 0;
  await page.route('**/so-what', route => {
    attempts++;
    return attempts === 1 ? route.fulfill({ status: 503, json: {} }) : route.fulfill({ json: { keyPoint: '검증된 해설', background: '배경', outlook: '전망', actionItem: '원문 확인' } });
  });
  await page.goto('/news');
  const trigger = page.getByRole('button', { name: 'AI 분석 보기' }).first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '다시 시도' }).click();
  await expect(dialog).toContainText('검증된 해설');
  const box = await dialog.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('mobile navigation exposes every secondary route and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/news');
  const more = page.getByRole('button', { name: '더보기', exact: true });
  await more.click();
  const dialog = page.getByRole('dialog', { name: '전체 메뉴' });
  await expect(dialog.getByRole('link', { name: '관심 종목 뉴스' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: '설정', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(more).toBeFocused();
  await more.click();
  await dialog.getByRole('link', { name: '설정', exact: true }).click();
  await expect(page).toHaveURL('/settings');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('responsive layouts and light/dark accessibility', async ({ page }) => {
  test.setTimeout(240000);
  for (const theme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: theme as 'light' | 'dark', reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/news');
      await expect(page.locator('article')).toHaveCount(10);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (width === 390 || width === 1440) {
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
        await page.screenshot({ path: `artifacts/ux/news-${theme}-${width}.png`, fullPage: true });
      }
    }
  }
});

test('slow earlier category cannot replace the selected category', async ({ page }) => {
  await page.route('**/api/news?**', async route => {
    if (new URL(route.request().url()).searchParams.get('category') === 'tech') await new Promise(resolve => setTimeout(resolve, 1000));
    return route.fallback();
  });
  await page.goto('/news');
  await expect(page.locator('article')).toHaveCount(10);
  await page.getByRole('button', { name: '테크', exact: true }).click();
  await page.getByRole('button', { name: '경제', exact: true }).click();
  await expect(page).toHaveURL(/category=economy/);
  await expect(page.locator('article').first()).toContainText('검증 뉴스 0');
  await page.waitForTimeout(1200);
  await expect(page.locator('article').first()).toContainText('검증 뉴스 0');
});

test('research artifact is readable and sources are linked', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(pathToFileURL(resolve('docs/ux-review-2026-09-08.html')).href);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('개선 연구');
  expect(await page.locator('a[href^="https://"]').count()).toBeGreaterThanOrEqual(10);
  expect(await page.locator('table').count()).toBeGreaterThanOrEqual(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/ux/research-report.png' });
});
