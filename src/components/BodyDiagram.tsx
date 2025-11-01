import { useState } from "react";

interface BodyDiagramProps {
  onMuscleSelect: (muscle: string) => void;
  selectedMuscle: string | null;
}

export const BodyDiagram = ({ onMuscleSelect, selectedMuscle }: BodyDiagramProps) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const getMuscleColor = (muscleId: string) => {
    if (selectedMuscle === muscleId) return "#ff4444";
    if (hoveredMuscle === muscleId) return "#ff7d16";
    return "hsl(var(--primary) / 0.3)";
  };

  const handleMuscleClick = (muscleId: string) => {
    onMuscleSelect(muscleId === selectedMuscle ? "" : muscleId);
  };

  return (
    <div className="flex justify-center items-center py-12">
      <svg
        viewBox="0 0 300 600"
        className="w-full max-w-md drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <ellipse cx="150" cy="50" rx="30" ry="40" fill="hsl(var(--muted))" />

        {/* Neck */}
        <rect x="140" y="85" width="20" height="20" fill="hsl(var(--muted))" />

        {/* Shoulders */}
        <path
          id="shoulders"
          d="M 110 105 Q 100 115 95 125 L 95 140 L 110 135 L 125 130 L 140 110 Z"
          fill={getMuscleColor("shoulders-left")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("shoulders-left")}
          onMouseEnter={() => setHoveredMuscle("shoulders-left")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />
        <path
          id="shoulders-right"
          d="M 190 105 Q 200 115 205 125 L 205 140 L 190 135 L 175 130 L 160 110 Z"
          fill={getMuscleColor("shoulders-right")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("shoulders-right")}
          onMouseEnter={() => setHoveredMuscle("shoulders-right")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Chest */}
        <path
          id="chest"
          d="M 125 130 L 140 110 L 150 105 L 160 110 L 175 130 L 170 165 L 150 170 L 130 165 Z"
          fill={getMuscleColor("chest")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("chest")}
          onMouseEnter={() => setHoveredMuscle("chest")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Abs */}
        <path
          id="abs"
          d="M 130 170 L 150 175 L 170 170 L 175 230 L 150 235 L 125 230 Z"
          fill={getMuscleColor("abs")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("abs")}
          onMouseEnter={() => setHoveredMuscle("abs")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Biceps Left */}
        <path
          id="biceps-left"
          d="M 110 135 L 95 140 L 85 200 L 90 220 L 105 215 L 115 180 Z"
          fill={getMuscleColor("biceps-left")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("biceps-left")}
          onMouseEnter={() => setHoveredMuscle("biceps-left")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Biceps Right */}
        <path
          id="biceps-right"
          d="M 190 135 L 205 140 L 215 200 L 210 220 L 195 215 L 185 180 Z"
          fill={getMuscleColor("biceps-right")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("biceps-right")}
          onMouseEnter={() => setHoveredMuscle("biceps-right")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Forearms Left */}
        <rect
          x="80"
          y="220"
          width="20"
          height="60"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* Forearms Right */}
        <rect
          x="200"
          y="220"
          width="20"
          height="60"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* Quadriceps Left */}
        <path
          id="quadriceps-left"
          d="M 125 235 L 110 240 L 100 320 L 105 380 L 120 375 L 130 310 Z"
          fill={getMuscleColor("quadriceps-left")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("quadriceps-left")}
          onMouseEnter={() => setHoveredMuscle("quadriceps-left")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Quadriceps Right */}
        <path
          id="quadriceps-right"
          d="M 175 235 L 190 240 L 200 320 L 195 380 L 180 375 L 170 310 Z"
          fill={getMuscleColor("quadriceps-right")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("quadriceps-right")}
          onMouseEnter={() => setHoveredMuscle("quadriceps-right")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Calves Left */}
        <path
          id="calves-left"
          d="M 105 380 L 100 440 L 95 500 L 105 505 L 115 500 L 120 440 L 120 380 Z"
          fill={getMuscleColor("calves-left")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("calves-left")}
          onMouseEnter={() => setHoveredMuscle("calves-left")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />

        {/* Calves Right */}
        <path
          id="calves-right"
          d="M 195 380 L 200 440 L 205 500 L 195 505 L 185 500 L 180 440 L 180 380 Z"
          fill={getMuscleColor("calves-right")}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-300 hover:opacity-90"
          onClick={() => handleMuscleClick("calves-right")}
          onMouseEnter={() => setHoveredMuscle("calves-right")}
          onMouseLeave={() => setHoveredMuscle(null)}
        />
      </svg>
    </div>
  );
};
