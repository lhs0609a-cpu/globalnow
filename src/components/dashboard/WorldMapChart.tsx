'use client';

import { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
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

// Labels for major supported countries (excluding MARKER_COUNTRIES which already have labels)
const COUNTRY_LABELS: { code: string; coordinates: [number, number]; label: string }[] = [
  { code: 'US', coordinates: [-98, 39], label: 'US' },
  { code: 'CA', coordinates: [-106, 56], label: 'CA' },
  { code: 'BR', coordinates: [-51, -10], label: 'BR' },
  { code: 'UK', coordinates: [-2, 54], label: 'UK' },
  { code: 'FR', coordinates: [2, 47], label: 'FR' },
  { code: 'DE', coordinates: [10, 51], label: 'DE' },
  { code: 'IT', coordinates: [12, 43], label: 'IT' },
  { code: 'ES', coordinates: [-4, 40], label: 'ES' },
  { code: 'RU', coordinates: [100, 60], label: 'RU' },
  { code: 'IL', coordinates: [35, 31], label: 'IL' },
  { code: 'SA', coordinates: [45, 24], label: 'SA' },
  { code: 'IN', coordinates: [78, 22], label: 'IN' },
  { code: 'CN', coordinates: [104, 35], label: 'CN' },
  { code: 'KR', coordinates: [127, 36], label: 'KR' },
  { code: 'JP', coordinates: [138, 36], label: 'JP' },
  { code: 'TW', coordinates: [121, 24], label: 'TW' },
  { code: 'AU', coordinates: [134, -25], label: 'AU' },
];

type Props = {
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
  center: [number, number];
  zoom: number;
  onMoveEnd: (position: { coordinates: [number, number]; zoom: number }) => void;
};

function WorldMapChartInner({ selectedCountry, onSelectCountry, center, zoom, onMoveEnd }: Props) {
  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 155 }}
      width={800}
      height={420}
      style={{ width: '100%', height: 'auto' }}
    >
      <ZoomableGroup
        center={center}
        zoom={zoom}
        minZoom={1}
        maxZoom={6}
        onMoveEnd={onMoveEnd}
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
                        ? '#3b7bff'
                        : isSupported
                        ? '#232b38'
                        : '#151a23',
                      stroke: '#0a0c11',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: isSupported ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: isSupported
                        ? isSelected
                          ? '#6fa0ff'
                          : '#323b4c'
                        : '#151a23',
                      stroke: isSupported ? '#3b7bff' : '#0a0c11',
                      strokeWidth: isSupported ? 0.75 : 0.5,
                      outline: 'none',
                      cursor: isSupported ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: isSelected ? '#2563f0' : '#323b4c',
                      stroke: '#0a0c11',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Labels for major supported countries */}
        {COUNTRY_LABELS.map((marker) => {
          const isSelected = selectedCountry === marker.code;
          return (
            <Marker
              key={`label-${marker.code}`}
              coordinates={marker.coordinates}
              onClick={() => onSelectCountry(isSelected ? null : marker.code)}
            >
              <circle
                r={2.5}
                fill={isSelected ? '#3b7bff' : '#3a4356'}
                stroke={isSelected ? '#9cbeff' : 'transparent'}
                strokeWidth={1}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                y={-6}
                style={{
                  fontSize: '7.5px',
                  fill: isSelected ? '#9cbeff' : '#6b7482',
                  fontWeight: isSelected ? 600 : 500,
                  letterSpacing: '0.02em',
                  pointerEvents: 'none',
                }}
              >
                {marker.label}
              </text>
            </Marker>
          );
        })}

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
                r={4}
                fill={isSelected ? '#3b7bff' : '#3a4356'}
                stroke={isSelected ? '#9cbeff' : '#4b566b'}
                strokeWidth={1}
                style={{ cursor: 'pointer' }}
              />
              <text
                textAnchor="middle"
                y={-8}
                style={{
                  fontSize: '7.5px',
                  fill: isSelected ? '#9cbeff' : '#6b7482',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  pointerEvents: 'none',
                }}
              >
                {marker.label}
              </text>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
}

export default memo(WorldMapChartInner);
