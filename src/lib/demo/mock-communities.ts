import { TrendingItem } from '@/types/news';

export const MOCK_COMMUNITY_TRENDING: TrendingItem[] = [
  // V2EX (CN)
  { id: 'v2ex-1', title: '为什么越来越多的开发者转向 Rust？', titleKo: '왜 점점 더 많은 개발자들이 Rust로 전환하는가?', url: 'https://www.v2ex.com/t/1001', source: 'v2ex', score: 156, commentCount: 89, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
  { id: 'v2ex-2', title: '2026年远程工作的现状', titleKo: '2026년 원격 근무의 현황', url: 'https://www.v2ex.com/t/1002', source: 'v2ex', score: 203, commentCount: 134, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },

  // Zhihu (CN)
  { id: 'zhihu-1', title: '如何看待 AI 对传统行业的冲击？', titleKo: 'AI가 전통 산업에 미치는 충격을 어떻게 볼 것인가?', url: 'https://www.zhihu.com/question/1001', source: 'zhihu', score: 0, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: 'zhihu-2', title: '大模型时代，程序员还需要刷 LeetCode 吗？', titleKo: '대규모 모델 시대, 프로그래머는 여전히 LeetCode를 풀어야 하는가?', url: 'https://www.zhihu.com/question/1002', source: 'zhihu', score: 0, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 100).toISOString() },

  // 36kr (CN)
  { id: '36kr-1', title: '小米 SU7 Ultra 交付量突破新纪录', titleKo: '샤오미 SU7 Ultra 출고량 신기록 돌파', url: 'https://36kr.com/p/1001', source: '36kr', score: 0, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { id: '36kr-2', title: '2026 中国独角兽企业图谱', titleKo: '2026 중국 유니콘 기업 지도', url: 'https://36kr.com/p/1002', source: '36kr', score: 0, region: 'CN', publishedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString() },

  // Qiita (JP)
  { id: 'qiita-1', title: 'Next.js 15で変わったこと総まとめ', titleKo: 'Next.js 15에서 달라진 점 총정리', url: 'https://qiita.com/user/items/1001', source: 'qiita', score: 342, commentCount: 24, region: 'JP', publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'qiita-2', title: 'Docker入門2026年版', titleKo: 'Docker 입문 2026년 버전', url: 'https://qiita.com/user/items/1002', source: 'qiita', score: 210, commentCount: 15, region: 'JP', publishedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString() },

  // Hatena (JP)
  { id: 'hatena-1', title: '日本のAIスタートアップが世界で勝つために必要なこと', titleKo: '일본 AI 스타트업이 세계에서 이기기 위해 필요한 것', url: 'https://example.hatena.jp/entry/1001', source: 'hatena', score: 0, region: 'JP', publishedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
  { id: 'hatena-2', title: 'プログラマの独立開業マニュアル 2026', titleKo: '프로그래머의 독립 개업 매뉴얼 2026', url: 'https://example.hatena.jp/entry/1002', source: 'hatena', score: 0, region: 'JP', publishedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString() },

  // GeekNews (KR)
  { id: 'geeknews-1', title: 'Claude 4.5 발표 - AI 코딩 에이전트의 새로운 시대', titleKo: 'Claude 4.5 발표 - AI 코딩 에이전트의 새로운 시대', url: 'https://news.hada.io/topic?id=1001', source: 'geeknews', score: 0, region: 'KR', publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'geeknews-2', title: 'Rust로 만드는 CLI 도구 베스트 프랙티스', titleKo: 'Rust로 만드는 CLI 도구 베스트 프랙티스', url: 'https://news.hada.io/topic?id=1002', source: 'geeknews', score: 0, region: 'KR', publishedAt: new Date(Date.now() - 1000 * 60 * 85).toISOString() },
  { id: 'geeknews-3', title: 'SQLite가 서버리스 데이터베이스로 부상하는 이유', titleKo: 'SQLite가 서버리스 데이터베이스로 부상하는 이유', url: 'https://news.hada.io/topic?id=1003', source: 'geeknews', score: 0, region: 'KR', publishedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString() },

  // Disquiet (KR)
  { id: 'disquiet-1', title: 'AI 기반 이력서 최적화 서비스 런칭', titleKo: 'AI 기반 이력서 최적화 서비스 런칭', url: 'https://disquiet.io/@user/makerlog/1001', source: 'disquiet', score: 0, region: 'KR', publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: 'disquiet-2', title: '사이드프로젝트로 월 1000만원 달성 후기', titleKo: '사이드프로젝트로 월 1000만원 달성 후기', url: 'https://disquiet.io/@user/makerlog/1002', source: 'disquiet', score: 0, region: 'KR', publishedAt: new Date(Date.now() - 1000 * 60 * 105).toISOString() },

  // Lobsters (EU)
  { id: 'lobsters-1', title: 'Why I switched from Neovim to Helix', titleKo: 'Neovim에서 Helix로 갈아탄 이유', url: 'https://lobste.rs/s/abc123', source: 'lobsters', score: 89, commentCount: 56, region: 'EU', publishedAt: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
  { id: 'lobsters-2', title: 'The state of WebAssembly in 2026', titleKo: '2026년 WebAssembly의 현재', url: 'https://lobste.rs/s/def456', source: 'lobsters', score: 67, commentCount: 32, region: 'EU', publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },

  // TabNews (BR)
  { id: 'tabnews-1', title: 'Como criar uma startup no Brasil em 2026', titleKo: '2026년 브라질에서 스타트업을 만드는 방법', url: 'https://www.tabnews.com.br/user/startup-2026', source: 'tabnews', score: 45, commentCount: 23, region: 'BR', publishedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString() },
  { id: 'tabnews-2', title: 'O guia definitivo de TypeScript para 2026', titleKo: '2026년을 위한 TypeScript 완벽 가이드', url: 'https://www.tabnews.com.br/user/typescript-guide', source: 'tabnews', score: 38, commentCount: 17, region: 'BR', publishedAt: new Date(Date.now() - 1000 * 60 * 115).toISOString() },

  // DEV.to (GLOBAL)
  { id: 'devto-1', title: '10 VS Code Extensions Every Developer Needs in 2026', titleKo: '2026년 모든 개발자에게 필요한 VS Code 확장 10가지', url: 'https://dev.to/user/vscode-extensions-2026', source: 'devto', score: 1523, commentCount: 89, region: 'GLOBAL', publishedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
  { id: 'devto-2', title: 'Building a SaaS with Next.js 15 and Supabase', titleKo: 'Next.js 15와 Supabase로 SaaS 만들기', url: 'https://dev.to/user/nextjs-saas', source: 'devto', score: 987, commentCount: 67, region: 'GLOBAL', publishedAt: new Date(Date.now() - 1000 * 60 * 100).toISOString() },
];

export function getMockCommunityTrending(source?: string, region?: string): TrendingItem[] {
  let items = [...MOCK_COMMUNITY_TRENDING];
  if (source) items = items.filter(t => t.source === source);
  if (region && region !== 'all') items = items.filter(t => t.region === region);
  return items;
}
