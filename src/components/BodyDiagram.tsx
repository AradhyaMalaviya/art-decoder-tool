import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FlipHorizontal2 } from "lucide-react";

interface BodyDiagramProps {
  onMuscleSelect: (muscle: string) => void;
  selectedMuscle: string | null;
}

export const BodyDiagram = ({ onMuscleSelect, selectedMuscle }: BodyDiagramProps) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");

  const getMuscleColor = (muscleId: string) => {
    if (selectedMuscle === muscleId) return "#ff4444";
    if (hoveredMuscle === muscleId) return "#ff7d16";
    return "hsl(var(--primary) / 0.3)";
  };

  const handleMuscleClick = (muscleId: string) => {
    onMuscleSelect(muscleId === selectedMuscle ? "" : muscleId);
  };

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      {/* Toggle Button */}
      <Button
        onClick={() => setViewSide(viewSide === "front" ? "back" : "front")}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FlipHorizontal2 className="w-4 h-4" />
        Show {viewSide === "front" ? "Back" : "Front"} View
      </Button>

      {/* Body Diagram */}
      <div className="relative">
        {viewSide === "front" ? (
          <svg
            viewBox="0 0 300 600"
            className="w-full max-w-md drop-shadow-2xl transition-all duration-300"
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
        ) : (
          // Back View SVG
          <svg
            viewBox="0 0 300 600"
            className="w-full max-w-md drop-shadow-2xl transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <ellipse cx="150" cy="50" rx="30" ry="40" fill="hsl(var(--muted))" />

            {/* Neck */}
            <rect x="140" y="85" width="20" height="20" fill="hsl(var(--muted))" />

            {/* Upper Back - Traps */}
            <path
              id="traps"
              d="M 120 105 L 140 95 L 150 90 L 160 95 L 180 105 L 170 130 L 150 135 L 130 130 Z"
              fill={getMuscleColor("back")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("back")}
              onMouseEnter={() => setHoveredMuscle("back")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Rear Deltoids Left */}
            <path
              id="rear-delt-left"
              d="M 105 105 Q 95 115 90 125 L 90 145 L 105 140 L 120 130 L 120 105 Z"
              fill={getMuscleColor("shoulders")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("shoulders")}
              onMouseEnter={() => setHoveredMuscle("shoulders")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Rear Deltoids Right */}
            <path
              id="rear-delt-right"
              d="M 195 105 Q 205 115 210 125 L 210 145 L 195 140 L 180 130 L 180 105 Z"
              fill={getMuscleColor("shoulders")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("shoulders")}
              onMouseEnter={() => setHoveredMuscle("shoulders")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Middle Back - Lats */}
            <path
              id="lats"
              d="M 130 135 L 150 140 L 170 135 L 185 180 L 175 220 L 150 225 L 125 220 L 115 180 Z"
              fill={getMuscleColor("back")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("back")}
              onMouseEnter={() => setHoveredMuscle("back")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Triceps Left */}
            <path
              id="triceps-left"
              d="M 105 140 L 90 145 L 80 200 L 85 220 L 100 215 L 110 180 Z"
              fill={getMuscleColor("arms")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("arms")}
              onMouseEnter={() => setHoveredMuscle("arms")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Triceps Right */}
            <path
              id="triceps-right"
              d="M 195 140 L 210 145 L 220 200 L 215 220 L 200 215 L 190 180 Z"
              fill={getMuscleColor("arms")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("arms")}
              onMouseEnter={() => setHoveredMuscle("arms")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Forearms Left */}
            <rect
              x="75"
              y="220"
              width="20"
              height="60"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />

            {/* Forearms Right */}
            <rect
              x="205"
              y="220"
              width="20"
              height="60"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />

            {/* Lower Back */}
            <path
              id="lower-back"
              d="M 125 225 L 150 230 L 175 225 L 175 260 L 150 265 L 125 260 Z"
              fill={getMuscleColor("back")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("back")}
              onMouseEnter={() => setHoveredMuscle("back")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Glutes */}
            <path
              id="glutes"
              d="M 125 265 L 150 270 L 175 265 L 175 300 L 150 305 L 125 300 Z"
              fill={getMuscleColor("legs")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("legs")}
              onMouseEnter={() => setHoveredMuscle("legs")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Hamstrings Left */}
            <path
              id="hamstrings-left"
              d="M 125 305 L 110 310 L 100 370 L 105 380 L 120 375 L 130 330 Z"
              fill={getMuscleColor("legs")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("legs")}
              onMouseEnter={() => setHoveredMuscle("legs")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Hamstrings Right */}
            <path
              id="hamstrings-right"
              d="M 175 305 L 190 310 L 200 370 L 195 380 L 180 375 L 170 330 Z"
              fill={getMuscleColor("legs")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("legs")}
              onMouseEnter={() => setHoveredMuscle("legs")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Calves Left */}
            <path
              id="calves-back-left"
              d="M 105 380 L 100 440 L 95 500 L 105 505 L 115 500 L 120 440 L 120 380 Z"
              fill={getMuscleColor("legs")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("legs")}
              onMouseEnter={() => setHoveredMuscle("legs")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />

            {/* Calves Right */}
            <path
              id="calves-back-right"
              d="M 195 380 L 200 440 L 205 500 L 195 505 L 185 500 L 180 440 L 180 380 Z"
              fill={getMuscleColor("legs")}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onClick={() => handleMuscleClick("legs")}
              onMouseEnter={() => setHoveredMuscle("legs")}
              onMouseLeave={() => setHoveredMuscle(null)}
            />
          </svg>
        )}

        {/* Tooltip on hover */}
        {hoveredMuscle && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-4 py-2 rounded-lg shadow-lg border border-border text-sm font-medium animate-fade-in">
            {formatMuscleName(hoveredMuscle)}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format muscle names
const formatMuscleName = (muscle: string): string => {
  const names: Record<string, string> = {
    "chest": "Chest",
    "abs": "Abs",
    "shoulders-left": "Left Shoulder",
    "shoulders-right": "Right Shoulder",
    "shoulders": "Shoulders",
    "biceps-left": "Left Bicep",
    "biceps-right": "Right Bicep",
    "quadriceps-left": "Left Quadriceps",
    "quadriceps-right": "Right Quadriceps",
    "calves-left": "Left Calf",
    "calves-right": "Right Calf",
    "back": "Back",
    "arms": "Arms",
    "legs": "Legs"
  };
  return names[muscle] || muscle.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
};
