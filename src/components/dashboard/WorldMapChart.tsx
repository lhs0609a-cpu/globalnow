'use client';

import { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO 3166-1 numeric (zero-padded) -> our country code
const NUMERIC_TO_CODE: Record<string, string> = {
  '840': 'US', '124': 'CA', '076': 'BR', '826': 'UK',
  '250': 'FR', '276': 'DE', '380': 'IT', '724': 'ES',
  '643': 'RU', '376': 'IL', '682': 'SA', '634': 'QA',
  '356': 'IN', '156': 'CN', '410': 'KR', '392': 'JP',
  '158': 'TW', '344': 'HK', '702': 'SG', '036': 'AU',
};

// Small countries that need clickable markers (too small or absent in 110m data)
const MARKER_COUNTRIES: { code: string; coordinates: [number, number]; label: string }[] = [
  { code: 'HK', coordinates: [114.17, 22.32], label: 'HK' },
  { code: 'SG', coordinates: [103.82, 1.35], label: 'SG' },
  { code: 'QA', coordinates: [51.18, 25.35], label: 'QA' },
];

type Props = {
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
};

function WorldMapChartInner({ selectedCountry, onSelectCountry }: Props) {
  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 155 }}
      width={800}
      height={420}
      style={{ width: '100%', height: 'auto' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const code = NUMERIC_TO_CODE[geo.id];
            const isSupported = !!code;
            const isSelected = code === selectedCountry;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  if (isSupported) {
                    onSelectCountry(isSelected ? null : code);
                  }
                }}
                style={{
                  default: {
                    fill: isSelected
                      ? '#3b82f6'
                      : isSupported
                      ? '#334155'
                      : '#1e293b',
                    stroke: '#0f172a',
                    strokeWidth: 0.5,
                    outline: 'none',
                    cursor: isSupported ? 'pointer' : 'default',
                  },
                  hover: {
                    fill: isSupported
                      ? isSelected
                        ? '#60a5fa'
                        : '#475569'
                      : '#1e293b',
                    stroke: isSupported ? '#475569' : '#0f172a',
                    strokeWidth: isSupported ? 0.75 : 0.5,
                    outline: 'none',
                    cursor: isSupported ? 'pointer' : 'default',
                  },
                  pressed: {
                    fill: isSelected ? '#2563eb' : '#334155',
                    stroke: '#0f172a',
                    strokeWidth: 0.5,
                    outline: 'none',
                  },
                }}
              />
            );
          })
        }
      </Geographies>

      {/* Clickable markers for small countries */}
      {MARKER_COUNTRIES.map((marker) => {
        const isSelected = selectedCountry === marker.code;
        return (
          <Marker
            key={marker.code}
            coordinates={marker.coordinates}
            onClick={() => onSelectCountry(isSelected ? null : marker.code)}
          >
            <circle
              r={5}
              fill={isSelected ? '#3b82f6' : '#475569'}
              stroke={isSelected ? '#60a5fa' : '#64748b'}
              strokeWidth={1.5}
              style={{ cursor: 'pointer' }}
            />
            <text
              textAnchor="middle"
              y={-10}
              style={{
                fontSize: '9px',
                fill: '#94a3b8',
                fontWeight: 600,
                pointerEvents: 'none',
              }}
            >
              {marker.label}
            </text>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}

export default memo(WorldMapChartInner);
