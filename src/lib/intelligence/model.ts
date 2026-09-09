import type { NewsItem } from '@/types/news';

export const REGIONS = [
  ['US','미국','840',-98,39,'United States|U.S.|미국|Washington|워싱턴'], ['CA','캐나다','124',-106,56,'Canada|Canadian|캐나다'],
  ['MX','멕시코','484',-102,24,'Mexico|Mexican|멕시코'], ['BR','브라질','076',-51,-10,'Brazil|Brazilian|브라질'], ['AR','아르헨티나','032',-64,-35,'Argentina|아르헨티나'],
  ['UK','영국','826',-2,54,'United Kingdom|Britain|British|영국'], ['FR','프랑스','250',2,47,'France|French|프랑스'], ['DE','독일','276',10,51,'Germany|German|독일'],
  ['IT','이탈리아','380',12,43,'Italy|Italian|이탈리아'], ['ES','스페인','724',-4,40,'Spain|Spanish|스페인'], ['NL','네덜란드','528',5,52,'Netherlands|Dutch|네덜란드'],
  ['RU','러시아','643',100,60,'Russia|Russian|러시아'], ['UA','우크라이나','804',32,49,'Ukraine|Ukrainian|우크라이나'], ['TR','튀르키예','792',35,39,'Turkey|Turkiye|튀르키예|터키'],
  ['IL','이스라엘','376',35,31,'Israel|Israeli|이스라엘'], ['IR','이란','364',54,32,'Iran|Iranian|이란'], ['SA','사우디','682',45,24,'Saudi|사우디'], ['AE','UAE','784',54,24,'UAE|United Arab Emirates|아랍에미리트'],
  ['EG','이집트','818',30,27,'Egypt|Egyptian|이집트|Suez|수에즈'], ['ZA','남아공','710',25,-29,'South Africa|남아공|남아프리카'], ['NG','나이지리아','566',8,9,'Nigeria|나이지리아'], ['KE','케냐','404',38,1,'Kenya|케냐'],
  ['IN','인도','356',78,22,'India|Indian|인도'], ['CN','중국','156',104,35,'China|Chinese|중국|Beijing|베이징'], ['KR','한국','410',127,36,'South Korea|Korean|한국|서울|Seoul'],
  ['JP','일본','392',138,36,'Japan|Japanese|일본'], ['TW','대만','158',121,24,'Taiwan|Taiwanese|대만'], ['HK','홍콩','344',114,22,'Hong Kong|홍콩'], ['SG','싱가포르','702',104,1,'Singapore|싱가포르'],
  ['VN','베트남','704',108,16,'Vietnam|베트남'], ['ID','인도네시아','360',118,-3,'Indonesia|인도네시아'], ['TH','태국','764',101,15,'Thailand|Thai|태국'], ['MY','말레이시아','458',102,4,'Malaysia|말레이시아'],
  ['AU','호주','036',134,-25,'Australia|Australian|호주'], ['NZ','뉴질랜드','554',174,-41,'New Zealand|뉴질랜드'], ['PK','파키스탄','586',69,30,'Pakistan|파키스탄'],
] as const;
export type CountryCode = typeof REGIONS[number][0];
export const countryName = (code: string) => REGIONS.find(c => c[0] === code)?.[1] || code;

export const THEMES = [
  { id: 'geopolitics', label: '지정학·안보', words: 'war|conflict|military|missile|sanction|invasion|전쟁|분쟁|군사|미사일|제재|침공', check: '사업장·거래 상대의 노출 지역과 제재 적용 범위를 확인하세요.', channel: '사업 연속성 · 거래 상대 · 보험' },
  { id: 'macro', label: '금리·거시경제', words: 'inflation|interest rate|central bank|federal reserve|Fed|recession|GDP|금리|물가|인플레이션|중앙은행|연준|경기|고용', check: '차입 만기, 환 노출, 수요 전망의 기존 가정을 점검하세요.', channel: '조달 비용 · 환율 · 수요' },
  { id: 'trade', label: '무역·공급망', words: 'tariff|trade|supply chain|shipping|port|export|import|관세|무역|공급망|해운|항만|수출|수입|운하', check: '실제 적용 품목·시행일과 조달·운송 경로의 대체 가능성을 확인하세요.', channel: '원가 · 재고 · 납기' },
  { id: 'energy', label: '에너지·자원', words: 'oil|gas|energy|OPEC|crude|lithium|copper|석유|원유|가스|에너지|리튬|구리', check: '연료·원자재 계약과 비용 전가 시점, 공급처 집중도를 점검하세요.', channel: '투입 비용 · 공급 안정성' },
  { id: 'technology', label: '기술·산업', words: 'AI|artificial intelligence|semiconductor|chip|technology|patent|vehicle|battery|biotech|pharma|clinical trial|인공지능|반도체|기술|특허|데이터센터|배터리|자동차|바이오|제약|임상', check: '고객 수요, 경쟁사 투자, 기술 도입 비용과 규제 조건을 비교하세요.', channel: '경쟁 구도 · 설비 투자 · 생산성' },
  { id: 'policy', label: '정책·규제', words: 'regulation|legislation|antitrust|election|law|규제|법안|독점|선거|정책|입법', check: '공식 원문에서 적용 대상·시행일·유예 기간을 확인하세요.', channel: '시장 진입 · 준수 비용 · 사업 조건' },
] as const;
export type ThemeId = typeof THEMES[number]['id'];
export type Signal = { id: string; news: NewsItem; countries: string[]; themes: ThemeId[]; urgent: boolean; reasons: string[]; related: NewsItem[] };
export type IntelligenceSnapshot = { signals: Signal[]; mode: 'live' | 'demo' | 'stored'; retrievedAt: string; total: number; scanned: number; excluded: number; undated: number; coverage: number; truncated: boolean };
export type MonitorProfile = { countries: string[]; themes: string[]; keywords: string };

function matches(text: string, alternatives: string, geography = false): boolean {
  return alternatives.split('|').some(word => {
    if (/^[a-z .]+$/i.test(word)) return new RegExp('(?:^|[^a-z])' + word.replaceAll('.', '\\.') + (geography ? '' : '(?:s|es)?') + '(?=$|[^a-z])', 'i').test(text);
    if (geography && /[가-힣]/.test(word)) return new RegExp('(?:^|[^가-힣])' + word + '(?=$|[^가-힣]|은|는|이|가|을|를|의|에|와|과|도|로|산|발|군)', 'i').test(text);
    return new RegExp(word, 'i').test(text);
  });
}
export function classifyNews(news: NewsItem): Signal | null {
  const text = [news.title, news.titleKo, news.summary, news.summaryKo, ...(news.tags || [])].filter(Boolean).join(' ');
  const themes = THEMES.filter(theme => matches(text, theme.words)).map(theme => theme.id);
  if (!themes.length && !['international','economy','tech','politics','risk'].includes(news.category)) return null;
  // A publisher's country is NOT the location of the reported event.
  const countries = REGIONS.filter(country => matches(text, country[5], true)).map(country => country[0]);
  const urgent = matches(text, 'sanction|invasion|blockade|default|earthquake|shutdown|제재|침공|봉쇄|채무불이행|지진|가동 중단');
  return { id: news.id, news, countries, themes, urgent, reasons: urgent ? ['중단·제재 등 우선 확인 키워드 감지'] : themes.map(id => THEMES.find(t => t.id === id)!.label + ' 키워드 일치'), related: [] };
}
export function buildSnapshot(items: NewsItem[], mode: IntelligenceSnapshot['mode'], total: number, now = new Date()): IntelligenceSnapshot {
  const grouped = new Map<string, Signal>();
  const urls = new Set<string>();
  let excluded = 0;
  let undated = 0;
  for (const news of items) {
    if (!/^https?:\/\//i.test(news.url) || urls.has(news.url)) continue;
    urls.add(news.url);
    const signal = classifyNews(news);
    if (!signal) { excluded++; continue; }
    if (!Number.isFinite(Date.parse(news.publishedAt))) undated++;
    const key = news.title.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '') || news.url;
    const prior = grouped.get(key);
    if (prior) prior.related.push(news);
    else grouped.set(key, signal);
  }
  const signals = [...grouped.values()].sort((a,b) => (Date.parse(b.news.publishedAt) || 0) - (Date.parse(a.news.publishedAt) || 0));
  return { signals, mode, retrievedAt: now.toISOString(), total, scanned: items.length, excluded, undated, coverage: new Set(signals.flatMap(s => s.countries)).size, truncated: total > items.length };
}
export function inWindow(signal: Signal, hours: number, now: number) {
  const time = Date.parse(signal.news.publishedAt);
  return Number.isFinite(time) && time <= now + 300000 && time >= now - hours * 3600000;
}
export function matchesProfile(signal: Signal, profile: MonitorProfile) {
  const words = profile.keywords.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const text = [signal.news.title, signal.news.titleKo, signal.news.summary, signal.news.summaryKo].join(' ').toLowerCase();
  return signal.countries.some(c => profile.countries.includes(c)) || signal.themes.some(t => profile.themes.includes(t)) || words.some(word => text.includes(word));
}
export function briefMarkdown(signals: Signal[], snapshot: IntelligenceSnapshot, scope: string) {
  return `# Globalnow 의사결정 브리프\n\n범위: ${scope}\n조회: ${snapshot.retrievedAt}\n자료: ${snapshot.mode === 'demo' ? '샘플 — 실제 상황 판단에 사용하지 마세요' : snapshot.mode === 'stored' ? '저장 자료' : '수집 기사'}\n\n지역·주제는 제목/요약의 키워드 분류이며, 우선 확인 표시는 위험 확률이나 투자 추천이 아닙니다.\n\n` + signals.map((s,i) => `## ${i+1}. ${s.news.titleKo || s.news.title}\n\n${s.news.summaryKo || s.news.summary || '요약 미제공 — 원문 확인 필요'}\n\n게시: ${s.news.publishedAt}\n언급 지역: ${s.countries.map(countryName).join(', ') || '미분류'}\n출처: ${s.news.source?.nameKo || s.news.sourceId}\n원문: ${s.news.url}\n\n확인 과제: ${THEMES.filter(t => s.themes.includes(t.id)).map(t=>t.check).join(' ') || '원문과 사업 관련성을 확인하세요.'}\n`).join('\n');
}
