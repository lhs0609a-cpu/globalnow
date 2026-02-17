'use client';

import { useState, useEffect } from 'react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">센티먼트 맵</h1>
        <p className="text-slate-400 text-sm mt-1">전세계 뉴스 감정 분석 현황</p>
      </div>

      {/* Map placeholder */}
      <div className="bg-slate-800 rounded-xl p-6 relative overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Interactive world map (requires Leaflet)</p>
        </div>
        {/* Country grid as fallback */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {data.map(item => (
            <button
              key={item.country}
              onClick={() => setSelectedCountry(item)}
              className={`p-3 rounded-lg border transition-all ${
                selectedCountry?.country === item.country
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-700/30 hover:border-slate-600'
              }`}
            >
              <div className="text-2xl mb-1">{item.flag}</div>
              <div className="text-white text-sm font-medium">{item.countryKo}</div>
              <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getSentimentColor(item.sentiment)}`}>
                {getSentimentLabel(item.sentiment)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Details panel */}
      {selectedCountry && (
        <div className="bg-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{selectedCountry.flag}</span>
            <div>
              <h2 className="text-white text-xl font-bold">{selectedCountry.countryKo}</h2>
              <p className="text-slate-400 text-sm">분석 기사 수: {selectedCountry.articleCount.toLocaleString()}건</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">감정 점수</p>
              <p className={`text-2xl font-bold ${selectedCountry.sentiment >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {selectedCountry.sentiment > 0 ? '+' : ''}{selectedCountry.sentiment.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">주요 토픽</p>
              <p className="text-white text-lg font-semibold">{selectedCountry.topTopic}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">감정 상태</p>
              <p className={`text-lg font-semibold ${getSentimentColor(selectedCountry.sentiment).split(' ')[0]}`}>
                {getSentimentLabel(selectedCountry.sentiment)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
