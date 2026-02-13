"use client";

interface MapSparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export default function MapSparkline({
  data,
  color = "#3b82f6",
  width = 80,
  height = 24,
}: MapSparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(1, ...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (v / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
