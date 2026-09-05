'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/AppShell';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';

type SentimentData = {
  country: string;
  countryKo: string;
  flag: string;
  lat: number;
  lng: number;
  sentiment: number;
  topTopic: string;
  articleCount: number;
};

const MOCK_SENTIMENT: SentimentData[] = [
  { country: 'US', countryKo: '미국', flag: '🇺🇸', lat: 39.8, lng: -98.5, sentiment: 0.2, topTopic: 'AI 규제', articleCount: 1250 },
  { country: 'UK', countryKo: '영국', flag: '🇬🇧', lat: 55.3, lng: -3.4, sentiment: -0.1, topTopic: '총선', articleCount: 890 },
  { country: 'CN', countryKo: '중국', flag: '🇨🇳', lat: 35.8, lng: 104.1, sentiment: -0.3, topTopic: '경제 둔화', articleCount: 2100 },
  { country: 'JP', countryKo: '일본', flag: '🇯🇵', lat: 36.2, lng: 138.2, sentiment: 0.4, topTopic: '반도체 부활', articleCount: 670 },
  { country: 'DE', countryKo: '독일', flag: '🇩🇪', lat: 51.1, lng: 10.4, sentiment: -0.2, topTopic: '에너지 위기', articleCount: 540 },
  { country: 'FR', countryKo: '프랑스', flag: '🇫🇷', lat: 46.2, lng: 2.2, sentiment: 0.1, topTopic: '올림픽', articleCount: 430 },
  { country: 'KR', countryKo: '한국', flag: '🇰🇷', lat: 35.9, lng: 127.7, sentiment: 0.3, topTopic: 'K-컬처', articleCount: 380 },
  { country: 'BR', countryKo: '브라질', flag: '🇧🇷', lat: -14.2, lng: -51.9, sentiment: 0.0, topTopic: '아마존 보호', articleCount: 290 },
  { country: 'IN', countryKo: '인도', flag: '🇮🇳', lat: 20.5, lng: 78.9, sentiment: 0.5, topTopic: 'IT 성장', articleCount: 810 },
  { country: 'AU', countryKo: '호주', flag: '🇦🇺', lat: -25.2, lng: 133.7, sentiment: 0.1, topTopic: '기후 정책', articleCount: 220 },
];

export default function SentimentPage() {
  const [data, setData] = useState<SentimentData[]>(MOCK_SENTIMENT);
  const [selectedCountry, setSelectedCountry] = useState<SentimentData | null>(null);

  const getSentimentColor = (value: number) => {
    if (value > 0.3) return 'text-emerald-400 bg-emerald-500/10';
    if (value > 0) return 'text-emerald-300 bg-emerald-500/5';
    if (value > -0.3) return 'text-amber-400 bg-amber-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getSentimentLabel = (value: number) => {
    if (value > 0.3) return '긍정적';
    if (value > 0) return '약간 긍정';
    if (value > -0.3) return '약간 부정';
    return '부정적';
  };

  return (
    <div>
      <PageHeader title="센티먼트 맵" description="전세계 뉴스 감정 분석 현황" />

      <Card>
        <CardHeader title="국가별 감정" description="카드를 선택하면 상세 지표를 봅니다" icon="sentiment" />
        <CardDivider />
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-5">
          {data.map(item => {
            const active = selectedCountry?.country === item.country;
            return (
              <button
                key={item.country}
                type="button"
                onClick={() => setSelectedCountry(item)}
                aria-pressed={active}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? 'border-blue-500/50 bg-blue-500/[0.08]'
                    : 'border-line bg-fill-subtle hover:border-line-strong'
                }`}
              >
                <span className="text-[1.0625rem] leading-none">{item.flag}</span>
                <p className="mt-1.5 t-body-sm font-medium text-slate-100">
                  {item.countryKo}
                </p>
                <span
                  className={`mt-1.5 inline-block rounded px-1.5 py-0.5 t-meta-sm font-medium ${getSentimentColor(item.sentiment)}`}
                >
                  {getSentimentLabel(item.sentiment)}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Details panel */}
      {selectedCountry && (
        <Card className="mt-5">
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <div>
              <h2 className="t-title font-semibold text-slate-100">
                {selectedCountry.countryKo}
              </h2>
              <p className="tnum t-body-sm text-slate-500">
                분석 기사 {selectedCountry.articleCount.toLocaleString()}건
              </p>
            </div>
          </div>
          <CardDivider />
          <div className="grid grid-cols-1 gap-px bg-fill-weak sm:grid-cols-3">
            <div className="bg-surface px-5 py-4">
              <p className="t-meta-sm text-slate-500">감정 점수</p>
              <p
                className={`tnum mt-1 t-headline-xl tracking-tight ${
                  selectedCountry.sentiment >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {selectedCountry.sentiment > 0 ? '+' : ''}
                {selectedCountry.sentiment.toFixed(2)}
              </p>
            </div>
            <div className="bg-surface px-5 py-4">
              <p className="t-meta-sm text-slate-500">주요 토픽</p>
              <p className="mt-1 t-title font-semibold text-slate-100">
                {selectedCountry.topTopic}
              </p>
            </div>
            <div className="bg-surface px-5 py-4">
              <p className="t-meta-sm text-slate-500">감정 상태</p>
              <p
                className={`mt-1 t-title font-semibold ${getSentimentColor(selectedCountry.sentiment).split(' ')[0]}`}
              >
                {getSentimentLabel(selectedCountry.sentiment)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
