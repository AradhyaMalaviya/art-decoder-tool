import { useState } from "react";
import bodyDiagram from "@/assets/body-diagram.jpg";

interface BodyDiagramProps {
  onMuscleSelect: (muscle: string) => void;
  selectedMuscle: string | null;
}

export const BodyDiagram = ({ onMuscleSelect, selectedMuscle }: BodyDiagramProps) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const handleMuscleClick = (muscle: string) => {
    onMuscleSelect(muscle);
  };

  // Define clickable muscle regions with SVG paths
  const frontMuscles = [
    { 
      name: "chest", 
      title: "Chest",
      path: "M 133 125 L 133 195 L 210 195 L 210 125 Z"
    },
    { 
      name: "abs", 
      title: "Abs",
      path: "M 145 200 L 145 280 L 198 280 L 198 200 Z"
    },
    { 
      name: "shoulders", 
      title: "Shoulders",
      path: "M 95 115 L 95 145 L 125 155 L 125 115 Z M 218 115 L 218 145 L 248 155 L 248 115 Z"
    },
    { 
      name: "biceps", 
      title: "Biceps",
      path: "M 80 150 L 80 210 L 118 210 L 118 150 Z M 225 150 L 225 210 L 263 210 L 263 150 Z"
    },
    { 
      name: "quadriceps", 
      title: "Quadriceps",
      path: "M 125 285 L 125 395 L 218 395 L 218 285 Z"
    },
    { 
      name: "calves", 
      title: "Calves",
      path: "M 130 410 L 130 495 L 213 495 L 213 410 Z"
    },
  ];

  const backMuscles = [
    { 
      name: "back", 
      title: "Back",
      path: "M 493 125 L 493 280 L 586 280 L 586 125 Z"
    },
    { 
      name: "shoulders", 
      title: "Shoulders",
      path: "M 455 115 L 455 145 L 485 155 L 485 115 Z M 594 115 L 594 145 L 624 155 L 624 115 Z"
    },
    { 
      name: "arms", 
      title: "Triceps",
      path: "M 440 150 L 440 210 L 478 210 L 478 150 Z M 601 150 L 601 210 L 639 210 L 639 150 Z"
    },
    { 
      name: "legs", 
      title: "Glutes & Hamstrings",
      path: "M 485 285 L 485 395 L 594 395 L 594 285 Z"
    },
    { 
      name: "legs", 
      title: "Calves",
      path: "M 490 410 L 490 495 L 589 495 L 589 410 Z"
    },
  ];

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Base Image */}
        <img
          src={bodyDiagram}
          alt="Interactive Body Diagram"
          className="w-full h-auto"
        />
        
        {/* SVG Overlay for Interactive Regions */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 739 619"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Front View Muscles */}
          {frontMuscles.map((muscle, index) => (
            <path
              key={`front-${muscle.name}-${index}`}
              d={muscle.path}
              fill={hoveredMuscle === `${muscle.name}-${index}` ? "rgba(59, 130, 246, 0.4)" : "transparent"}
              stroke={hoveredMuscle === `${muscle.name}-${index}` ? "rgba(59, 130, 246, 0.8)" : "transparent"}
              strokeWidth="3"
              className="pointer-events-auto cursor-pointer transition-all duration-300 ease-out"
              style={{
                filter: hoveredMuscle === `${muscle.name}-${index}` 
                  ? "drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))" 
                  : "none"
              }}
              onClick={() => handleMuscleClick(muscle.name)}
              onMouseEnter={() => setHoveredMuscle(`${muscle.name}-${index}`)}
              onMouseLeave={() => setHoveredMuscle(null)}
            />
          ))}

          {/* Back View Muscles */}
          {backMuscles.map((muscle, index) => (
            <path
              key={`back-${muscle.name}-${index}`}
              d={muscle.path}
              fill={hoveredMuscle === `${muscle.name}-back-${index}` ? "rgba(59, 130, 246, 0.4)" : "transparent"}
              stroke={hoveredMuscle === `${muscle.name}-back-${index}` ? "rgba(59, 130, 246, 0.8)" : "transparent"}
              strokeWidth="3"
              className="pointer-events-auto cursor-pointer transition-all duration-300 ease-out"
              style={{
                filter: hoveredMuscle === `${muscle.name}-back-${index}` 
                  ? "drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))" 
                  : "none"
              }}
              onClick={() => handleMuscleClick(muscle.name)}
              onMouseEnter={() => setHoveredMuscle(`${muscle.name}-back-${index}`)}
              onMouseLeave={() => setHoveredMuscle(null)}
            />
          ))}
        </svg>
      </div>

      {/* Hover Tooltip */}
      {hoveredMuscle && (
        <div className="animate-fade-in bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg text-base font-medium">
          {frontMuscles.find((m, i) => `${m.name}-${i}` === hoveredMuscle)?.title || 
           backMuscles.find((m, i) => `${m.name}-back-${i}` === hoveredMuscle)?.title}
        </div>
      )}
    </div>
  );
};
