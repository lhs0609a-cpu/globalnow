'use client';

export function WorldMap() {
  return (
    <div className="bg-slate-800 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 text-sm">World Map Visualization</p>
        <p className="text-slate-500 text-xs mt-1">Requires Leaflet + react-leaflet setup</p>
        <p className="text-slate-600 text-xs mt-1">See sentiment page for country grid view</p>
      </div>
    </div>
  );
}
