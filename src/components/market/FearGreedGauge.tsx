export function FearGreedGauge({ value, label }: { value: number; label: string }) {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20 overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
          <path d="M10 55 A50 50 0 0 1 110 55" fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round" />
          <line
            x1="60" y1="55" x2="60" y2="15"
            stroke="white" strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${rotation}, 60, 55)`}
          />
          <circle cx="60" cy="55" r="4" fill="white" />
        </svg>
      </div>
      <div className="text-center mt-1">
        <span className="text-white text-2xl font-bold">{value}</span>
        <span className="text-slate-400 text-sm ml-2">{label}</span>
      </div>
    </div>
  );
}
