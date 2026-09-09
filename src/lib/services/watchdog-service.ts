import { TICKER_NAME_MAP } from '@/lib/constants/watchlist-presets';
import { getNewsFeed } from './news-service';
import type { WatchdogMatchReason, WatchdogFeedResult } from '@/types/watchdog';
import type { NewsItem } from '@/types/news';
export function computeMatchReasons(news: NewsItem, tickers:string[]) {
  const matchedTickers:string[]=[];
  const matchReasons:WatchdogMatchReason[]=[];
  for (const ticker of tickers) {
    const info=TICKER_NAME_MAP[ticker];
    const terms=[ticker,info?.name,info?.nameKo].filter((term):term is string=>Boolean(term));
    for (const keyword of terms) {
      const escaped=keyword.replace(/[.*+?^\x24{}()|[\]\\]/g,'\\$&');
      const pattern=new RegExp(/^[a-z0-9 .-]+$/i.test(keyword)?'(?:^|[^a-z0-9])'+escaped+'(?=$|[^a-z0-9])':escaped,'i');
      const fields: [WatchdogMatchReason['field'],string][]=[['title',news.title],['titleKo',news.titleKo||''],['summary',[news.summary,news.summaryKo].join(' ')],['tags',(news.tags||[]).join(' ')]];
      for (const [field,text] of fields) if(pattern.test(text))matchReasons.push({field,ticker,keyword});
    }
    if(matchReasons.some(reason=>reason.ticker===ticker))matchedTickers.push(ticker);
  }
  return {matchedTickers,matchReasons};
}
export async function getWatchdogNews(tickers:string[],page=1,limit=20):Promise<WatchdogFeedResult> {
  if(!tickers.length)return {items:[],total:0,page,limit};
  const feed=await getNewsFeed({limit:400,page:1});
  const items=feed.items.flatMap(news=>{const match=computeMatchReasons(news,tickers);return match.matchedTickers.length?[{...news,...match}]:[];});
  return {items:items.slice((page-1)*limit,page*limit),total:items.length,page,limit,mode:feed.mode};
}
