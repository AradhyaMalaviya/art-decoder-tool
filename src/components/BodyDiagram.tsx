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

  // Define anatomically accurate muscle regions with curved SVG paths
  const frontMuscles = [
    { 
      name: "chest", 
      title: "Chest",
      path: "M 145 125 Q 145 120 150 118 L 193 118 Q 198 120 198 125 L 198 175 Q 198 185 193 190 L 150 190 Q 145 185 145 175 Z"
    },
    { 
      name: "abs", 
      title: "Abs",
      path: "M 152 198 Q 150 198 150 200 L 150 270 Q 150 278 152 280 L 191 280 Q 193 278 193 270 L 193 200 Q 193 198 191 198 Z"
    },
    { 
      name: "shoulders", 
      title: "Shoulders",
      path: "M 100 115 Q 98 118 98 122 L 98 142 Q 100 148 105 150 L 125 155 Q 128 153 128 148 L 128 118 Q 126 115 122 115 Z M 221 115 Q 217 115 215 118 L 215 148 Q 215 153 218 155 L 238 150 Q 243 148 245 142 L 245 122 Q 245 118 243 115 Z"
    },
    { 
      name: "biceps", 
      title: "Biceps",
      path: "M 85 155 Q 82 158 82 163 L 82 205 Q 84 210 89 210 L 115 210 Q 118 208 118 203 L 118 160 Q 116 155 111 155 Z M 228 155 Q 225 155 223 160 L 223 203 Q 223 208 226 210 L 254 210 Q 259 210 261 205 L 261 163 Q 261 158 258 155 Z"
    },
    { 
      name: "quadriceps", 
      title: "Quadriceps",
      path: "M 130 288 Q 128 290 128 295 L 128 385 Q 130 390 135 392 L 208 392 Q 213 390 215 385 L 215 295 Q 215 290 213 288 Z"
    },
    { 
      name: "calves", 
      title: "Calves",
      path: "M 135 415 Q 133 418 133 422 L 133 485 Q 135 490 138 492 L 205 492 Q 208 490 210 485 L 210 422 Q 210 418 208 415 Z"
    },
  ];

  const backMuscles = [
    { 
      name: "back", 
      title: "Back",
      path: "M 500 125 Q 498 128 498 135 L 498 265 Q 500 275 505 278 L 574 278 Q 579 275 581 265 L 581 135 Q 581 128 579 125 Z"
    },
    { 
      name: "shoulders", 
      title: "Shoulders",
      path: "M 460 115 Q 458 118 458 122 L 458 142 Q 460 148 465 150 L 485 155 Q 488 153 488 148 L 488 118 Q 486 115 482 115 Z M 597 115 Q 593 115 591 118 L 591 148 Q 591 153 594 155 L 614 150 Q 619 148 621 142 L 621 122 Q 621 118 619 115 Z"
    },
    { 
      name: "arms", 
      title: "Triceps",
      path: "M 445 155 Q 442 158 442 163 L 442 205 Q 444 210 449 210 L 475 210 Q 478 208 478 203 L 478 160 Q 476 155 471 155 Z M 604 155 Q 601 155 599 160 L 599 203 Q 599 208 602 210 L 630 210 Q 635 210 637 205 L 637 163 Q 637 158 634 155 Z"
    },
    { 
      name: "legs", 
      title: "Glutes & Hamstrings",
      path: "M 490 288 Q 488 290 488 295 L 488 385 Q 490 390 495 392 L 584 392 Q 589 390 591 385 L 591 295 Q 591 290 589 288 Z"
    },
    { 
      name: "legs", 
      title: "Calves",
      path: "M 495 415 Q 493 418 493 422 L 493 485 Q 495 490 498 492 L 581 492 Q 584 490 586 485 L 586 422 Q 586 418 584 415 Z"
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
              fill={hoveredMuscle === `${muscle.name}-${index}` ? "rgba(255, 91, 91, 0.6)" : "transparent"}
              stroke="#2a2a2a"
              strokeWidth="1"
              className="pointer-events-auto cursor-pointer"
              style={{
                transition: "fill 0.3s ease",
                filter: hoveredMuscle === `${muscle.name}-${index}` 
                  ? "drop-shadow(0 0 8px rgba(255, 91, 91, 0.8))" 
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
              fill={hoveredMuscle === `${muscle.name}-back-${index}` ? "rgba(255, 91, 91, 0.6)" : "transparent"}
              stroke="#2a2a2a"
              strokeWidth="1"
              className="pointer-events-auto cursor-pointer"
              style={{
                transition: "fill 0.3s ease",
                filter: hoveredMuscle === `${muscle.name}-back-${index}` 
                  ? "drop-shadow(0 0 8px rgba(255, 91, 91, 0.8))" 
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
