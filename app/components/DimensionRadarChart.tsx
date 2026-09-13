import React from "react";
import { DIAGNOSTIC_DIMENSIONS } from "~/lib/diagnostic";

interface DimensionRadarProps {
  scores: Record<string, { current: number; max: number; percentage: number }>;
  size?: number;
}

export function DimensionRadarChart({ scores, size = 320 }: DimensionRadarProps) {
  const dimensionKeys = Object.keys(DIAGNOSTIC_DIMENSIONS);
  const totalPoints = dimensionKeys.length;
  const center = size / 2;
  const radius = (size / 2) * 0.75;
  const angleStep = (Math.PI * 2) / totalPoints;

  // Compute Web / Grid polygon points
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  
  const getCoordinates = (angle: number, distance: number) => {
    // Start from top (-PI/2)
    const currentAngle = angle - Math.PI / 2;
    return {
      x: center + distance * Math.cos(currentAngle),
      y: center + distance * Math.sin(currentAngle),
    };
  };

  // Compute Data Points Polygon
  const dataPoints = dimensionKeys.map((key, i) => {
    const dimScore = scores[key] || { percentage: 50 };
    const factor = Math.max(0.15, dimScore.percentage / 100);
    const pos = getCoordinates(i * angleStep, radius * factor);
    return `${pos.x},${pos.y}`;
  }).join(" ");

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible select-none">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E3346B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4044A5" stopOpacity="0.15" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Circular / Hexagonal Grids */}
        {gridLevels.map((lvl, idx) => {
          const points = dimensionKeys.map((_, i) => {
            const pos = getCoordinates(i * angleStep, radius * lvl);
            return `${pos.x},${pos.y}`;
          }).join(" ");

          return (
            <polygon
              key={`grid-${idx}`}
              points={points}
              fill={idx === gridLevels.length - 1 ? "#faf5ff" : "none"}
              stroke="#e9d5ff"
              strokeWidth={idx === gridLevels.length - 1 ? "1.5" : "1"}
              strokeDasharray={idx < gridLevels.length - 1 ? "3 3" : undefined}
            />
          );
        })}

        {/* Axis Lines */}
        {dimensionKeys.map((_, i) => {
          const target = getCoordinates(i * angleStep, radius);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={target.x}
              y2={target.y}
              stroke="#d8b4fe"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area Polygon */}
        <polygon
          points={dataPoints}
          fill="url(#radarGradient)"
          stroke="#E3346B"
          strokeWidth="2.5"
          filter="url(#glow)"
          className="transition-all duration-700 ease-out"
        />

        {/* Data Vertex Dots and Labels */}
        {dimensionKeys.map((key, i) => {
          const dimInfo = DIAGNOSTIC_DIMENSIONS[key];
          const dimScore = scores[key] || { percentage: 50 };
          const factor = Math.max(0.15, dimScore.percentage / 100);
          const pos = getCoordinates(i * angleStep, radius * factor);
          const labelPos = getCoordinates(i * angleStep, radius + 24);

          return (
            <g key={`vertex-${key}`}>
              {/* Point Dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#E3346B"
                strokeWidth="2.5"
                className="transition-all duration-700 ease-out"
              />

              {/* Label Text */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-medium fill-slate-700 font-sans"
              >
                {dimInfo?.nameTh?.split(" ")[0]}
              </text>

              {/* Percentage Badge */}
              <text
                x={labelPos.x}
                y={labelPos.y + 13}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-bold fill-purple-600 font-sans"
              >
                {dimScore.percentage}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
