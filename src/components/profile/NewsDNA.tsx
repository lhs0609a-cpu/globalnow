'use client';

import { NewsDNA as NewsDNAType } from '@/types/user';

export function NewsDNA({ dna }: { dna: NewsDNAType }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <span>🧬</span> 뉴스 DNA
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-slate-400 text-sm mb-3">카테고리 분포</h3>
          <div className="space-y-2">
            {dna.categoryDistribution.map(cat => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{cat.category}</span>
                  <span className="text-slate-400">{cat.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-slate-400 text-sm mb-3">주요 소스</h3>
          <div className="space-y-2">
            {dna.sourceDistribution.map(src => (
              <div key={src.source} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                <span className="text-white text-sm">{src.source}</span>
                <span className="text-slate-400 text-sm">{src.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
