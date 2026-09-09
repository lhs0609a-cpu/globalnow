'use client';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { REGIONS } from '@/lib/intelligence/model';
export default function IntelligenceMap({ counts, selected, onSelect }: { counts: Record<string, number>; selected: string; onSelect: (code: string) => void }) {
  return <div className="intel-map">
    <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 155 }} width={800} height={400} style={{ width: '100%', height: 'auto' }} role="img" aria-label="기사 언급 지역 지도. 아래 지역 선택 메뉴에서 같은 정보를 확인할 수 있습니다.">
      <Geographies geography="/maps/countries-110m.json">{({ geographies }) => geographies.map(geo => {
        const country = REGIONS.find(c => c[2] === String(geo.id).padStart(3,'0'));
        const code = country?.[0] || '';
        const count = counts[code] || 0;
        return <Geography key={geo.rsmKey} geography={geo} data-country={code || 'unclassified'} tabIndex={-1} onClick={() => { if (code) onSelect(selected === code ? '' : code); }}
          style={{ default: { fill: code && selected === code ? 'var(--accent)' : count > 0 ? 'var(--map-active)' : 'var(--map-land)', stroke: 'var(--map-border)', strokeWidth: .65, outline: 'none' }, hover: { fill: code ? 'var(--accent)' : 'var(--map-land)', stroke: 'var(--map-border)', strokeWidth: .65, outline: 'none', cursor: code ? 'pointer' : 'default' }, pressed: { fill: code ? 'var(--accent)' : 'var(--map-land)', outline: 'none' } }} />;
      })}</Geographies>
      {REGIONS.filter(c => counts[c[0]] > 0).map(c => <Marker key={c[0]} coordinates={[c[3],c[4]]}>
        <circle r={4 + Math.min(counts[c[0]], 12)/4} fill="var(--accent-text)" stroke="var(--n-900)" strokeWidth={1.5} />
        <text y={-12} textAnchor="middle" fill="var(--n-100)" fontSize={10} fontWeight={600}>{c[0]} {counts[c[0]]}</text>
      </Marker>)}
    </ComposableMap>
    <div className="intel-map-caption"><span><i /> 기사 언급 지역</span><span>회색: 분류된 기사 없음 · 위험 없음이라는 뜻이 아닙니다</span></div>
  </div>;
}
