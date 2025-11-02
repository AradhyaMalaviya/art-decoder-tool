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

  // Define clickable areas for each muscle group (coordinates are percentages)
  const muscleAreas = [
    // Front view muscles (left side of image)
    { name: "chest", coords: "18,22,30,22,30,33,18,33", title: "Chest" },
    { name: "abs", coords: "20,34,29,34,29,45,20,45", title: "Abs" },
    { name: "biceps", coords: "11,24,16,24,16,33,11,33", title: "Biceps" },
    { name: "biceps", coords: "33,24,38,24,38,33,33,33", title: "Biceps" },
    { name: "shoulders", coords: "13,20,18,20,18,25,13,25", title: "Shoulders" },
    { name: "shoulders", coords: "31,20,36,20,36,25,31,25", title: "Shoulders" },
    { name: "quadriceps", coords: "18,46,30,46,30,62,18,62", title: "Quadriceps" },
    { name: "calves", coords: "18,66,30,66,30,78,18,78", title: "Calves" },
    
    // Back view muscles (right side of image)
    { name: "back", coords: "68,22,80,22,80,45,68,45", title: "Back" },
    { name: "arms", coords: "61,24,66,24,66,33,61,33", title: "Triceps" },
    { name: "arms", coords: "83,24,88,24,88,33,83,33", title: "Triceps" },
    { name: "shoulders", coords: "63,20,68,20,68,25,63,25", title: "Shoulders" },
    { name: "shoulders", coords: "81,20,86,20,86,25,81,25", title: "Shoulders" },
    { name: "legs", coords: "68,46,80,46,80,65,68,65", title: "Glutes & Hamstrings" },
    { name: "legs", coords: "68,66,80,66,80,78,68,78", title: "Calves" },
  ];

  return (
    <div className="flex flex-col items-center py-8 space-y-6">
      <div className="relative w-full max-w-4xl">
        <img
          src={bodyDiagram}
          alt="Interactive Body Diagram - Click on muscle groups"
          useMap="#body-map"
          className="w-full h-auto"
        />
        <map name="body-map">
          {muscleAreas.map((area, index) => (
            <area
              key={`${area.name}-${index}`}
              shape="rect"
              coords={area.coords.split(',').map((c, i) => {
                // Convert percentage-based coordinates to pixel coordinates
                const isX = i % 2 === 0;
                return `${(parseFloat(c) * (isX ? 739 : 619)) / 100}`;
              }).join(',')}
              alt={area.title}
              title={area.title}
              onClick={() => handleMuscleClick(area.name)}
              onMouseEnter={() => setHoveredMuscle(area.title)}
              onMouseLeave={() => setHoveredMuscle(null)}
              className="cursor-pointer"
            />
          ))}
        </map>
      </div>

      {hoveredMuscle && (
        <div className="mt-4 text-center bg-primary/10 text-primary px-6 py-3 rounded-lg text-base font-medium animate-fade-in">
          {hoveredMuscle}
        </div>
      )}
    </div>
  );
};
