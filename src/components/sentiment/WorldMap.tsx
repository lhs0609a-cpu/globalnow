'use client';

export function WorldMap() {
  return (
    <div className="surface p-6 min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 t-body">World Map Visualization</p>
        <p className="text-slate-500 t-body-sm mt-1">Requires Leaflet + react-leaflet setup</p>
        <p className="text-slate-600 t-body-sm mt-1">See sentiment page for country grid view</p>
      </div>
    </div>
  );
}
