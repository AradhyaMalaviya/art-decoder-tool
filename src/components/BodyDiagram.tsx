import { useState } from "react";

interface BodyDiagramProps {
  onMuscleSelect: (muscle: string) => void;
  selectedMuscle: string | null;
}

interface MuscleGroup {
  id: string;
  name: string;
  color: string;
}

export const BodyDiagram = ({ onMuscleSelect }: BodyDiagramProps) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const muscleGroups: MuscleGroup[] = [
    { id: "chest", name: "Chest", color: "#FF6B6B" },
    { id: "shoulders", name: "Shoulders", color: "#4ECDC4" },
    { id: "biceps", name: "Biceps", color: "#45B7D1" },
    { id: "abs", name: "Abs", color: "#FFA07A" },
    { id: "quadriceps", name: "Quadriceps", color: "#98D8C8" },
    { id: "calves", name: "Calves", color: "#C7CEEA" },
    { id: "back", name: "Back", color: "#B4A7D6" },
    { id: "legs", name: "Legs", color: "#98D8C8" },
  ];

  const handleMuscleClick = (muscleId: string) => {
    onMuscleSelect(muscleId);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-slate-700/50">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Select a Muscle Group
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle.id}
              onClick={() => handleMuscleClick(muscle.id)}
              onMouseEnter={() => setHoveredMuscle(muscle.id)}
              onMouseLeave={() => setHoveredMuscle(null)}
              className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-primary"
              style={{
                background: hoveredMuscle === muscle.id 
                  ? `linear-gradient(135deg, ${muscle.color}40, ${muscle.color}20)` 
                  : `linear-gradient(135deg, ${muscle.color}20, ${muscle.color}10)`,
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: muscle.color }}
                  />
                  <span className="text-lg font-semibold text-foreground">
                    {muscle.name}
                  </span>
                </div>
                <svg 
                  className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Hover Label */}
        {hoveredMuscle && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-medium">
              Click to explore {muscleGroups.find((m) => m.id === hoveredMuscle)?.name} exercises
            </div>
          </div>
        )}
        
        <p className="text-center text-muted-foreground mt-8 text-sm">
          Click any muscle group to see targeted exercises with video demonstrations
        </p>
      </div>
    </div>
  );
};
