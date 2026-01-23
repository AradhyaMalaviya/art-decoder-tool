import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bodyFront from "@/assets/body-front.jpg";
import bodyBack from "@/assets/body-back.png";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { getMuscleRoute, hasExercises, getDisplayNameFromDiagramId } from "@/lib/muscleMapping";

interface BodyDiagramProps {
  onMuscleSelect?: (muscle: string) => void;
  selectedMuscle?: string | null;
}

interface MuscleRegion {
  id: string;
  name: string;
  path: string;
  color: string;
}

export const BodyDiagram = ({ onMuscleSelect }: BodyDiagramProps) => {
  const navigate = useNavigate();
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");

  // Front view muscle regions with SVG paths
  const frontMuscles: MuscleRegion[] = [
    {
      id: "chest",
      name: "Chest",
      path: "M150,120 L170,110 L190,105 L210,105 L230,110 L250,120 L245,150 L240,170 L200,180 L160,170 L155,150 Z",
      color: "hsl(var(--primary) / 0.3)",
    },
    {
      id: "shoulders",
      name: "Shoulders",
      path: "M130,100 L150,110 L155,130 L145,140 L125,135 L110,120 Z M250,100 L230,110 L225,130 L235,140 L255,135 L270,120 Z",
      color: "hsl(var(--accent) / 0.3)",
    },
    {
      id: "biceps",
      name: "Biceps",
      path: "M120,140 L140,145 L145,180 L140,200 L125,195 L115,175 Z M260,140 L240,145 L235,180 L240,200 L255,195 L265,175 Z",
      color: "hsl(220 70% 50% / 0.3)",
    },
    {
      id: "abs",
      name: "Abs",
      path: "M165,180 L175,185 L185,190 L195,195 L205,195 L215,190 L225,185 L235,180 L230,220 L225,250 L205,260 L195,260 L175,260 L155,250 L150,220 Z",
      color: "hsl(30 100% 70% / 0.3)",
    },
    {
      id: "quadriceps",
      name: "Quadriceps",
      path: "M155,270 L175,265 L180,330 L175,380 L165,390 L155,385 L150,330 Z M225,270 L205,265 L200,330 L205,380 L215,390 L225,385 L230,330 Z",
      color: "hsl(160 50% 60% / 0.3)",
    },
    {
      id: "calves",
      name: "Calves",
      path: "M160,395 L170,400 L175,450 L170,480 L165,485 L155,480 L150,450 Z M220,395 L210,400 L205,450 L210,480 L215,485 L225,480 L230,450 Z",
      color: "hsl(240 50% 70% / 0.3)",
    },
  ];

  // Back view muscle regions
  const backMuscles: MuscleRegion[] = [
    {
      id: "back",
      name: "Back",
      path: "M140,110 L160,105 L180,100 L200,100 L220,105 L240,110 L250,130 L255,160 L250,190 L240,200 L220,205 L200,208 L180,208 L160,205 L140,200 L130,190 L125,160 L130,130 Z",
      color: "hsl(270 50% 60% / 0.3)",
    },
    {
      id: "shoulders",
      name: "Shoulders (Rear)",
      path: "M110,105 L130,100 L140,115 L145,135 L135,145 L120,140 L105,125 Z M270,105 L250,100 L240,115 L235,135 L245,145 L260,140 L275,125 Z",
      color: "hsl(var(--accent) / 0.3)",
    },
    {
      id: "legs",
      name: "Glutes & Hamstrings",
      path: "M145,210 L165,215 L170,260 L165,290 L155,300 L145,295 L140,250 Z M235,210 L215,215 L210,260 L215,290 L225,300 L235,295 L240,250 Z",
      color: "hsl(160 50% 60% / 0.3)",
    },
    {
      id: "calves",
      name: "Calves (Rear)",
      path: "M160,395 L170,400 L175,450 L170,480 L165,485 L155,480 L150,450 Z M220,395 L210,400 L205,450 L210,480 L215,485 L225,480 L230,450 Z",
      color: "hsl(240 50% 70% / 0.3)",
    },
  ];

  const currentMuscles = view === "front" ? frontMuscles : backMuscles;
  const currentImage = view === "front" ? bodyFront : bodyBack;

  const handleMuscleClick = (muscleId: string) => {
    // Check if muscle has exercises before navigating
    if (hasExercises(muscleId)) {
      const route = getMuscleRoute(muscleId);
      navigate(route);
    }
    // Also call the callback if provided (for backward compatibility)
    if (onMuscleSelect) {
      onMuscleSelect(muscleId);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-5xl bg-gradient-to-br from-background/95 to-muted/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-border/50">
          <h2 className="text-3xl font-bold text-center mb-6 text-foreground">
            Select a Muscle Group
          </h2>

          {/* View Toggle */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setView("front")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                view === "front"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Front View
            </button>
            <button
              onClick={() => setView("back")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                view === "back"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Back View
            </button>
          </div>

          {/* Body Diagram */}
          <div className="flex justify-center items-center relative">
            <div className="relative w-full max-w-[400px] mx-auto">
              <img
                src={currentImage}
                alt={`Body diagram ${view} view`}
                className="w-full h-auto"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 550"
                className="absolute top-0 left-0 w-full h-full"
              >
                {currentMuscles.map((muscle) => {
                  const hasExercisesForMuscle = hasExercises(muscle.id);
                  const isHovered = hoveredMuscle === muscle.id;
                  
                  return (
                    <Tooltip key={muscle.id}>
                      <TooltipTrigger asChild>
                        <path
                          d={muscle.path}
                          fill={isHovered ? muscle.color : "transparent"}
                          stroke={isHovered ? "hsl(var(--primary))" : "transparent"}
                          strokeWidth={isHovered ? "3" : "2"}
                          className={`transition-all duration-300 ${
                            hasExercisesForMuscle 
                              ? "cursor-pointer hover:opacity-80" 
                              : "cursor-not-allowed opacity-50"
                          }`}
                          onClick={() => hasExercisesForMuscle && handleMuscleClick(muscle.id)}
                          onMouseEnter={() => hasExercisesForMuscle && setHoveredMuscle(muscle.id)}
                          onMouseLeave={() => setHoveredMuscle(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-primary text-primary-foreground">
                        <p className="font-medium">
                          {muscle.name}
                          {!hasExercisesForMuscle && (
                            <span className="text-xs opacity-75 ml-2">(No exercises yet)</span>
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Hover Label */}
          {hoveredMuscle && hasExercises(hoveredMuscle) && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-medium">
                Click to explore {getDisplayNameFromDiagramId(hoveredMuscle)} exercises
              </div>
            </div>
          )}

          <p className="text-center text-muted-foreground mt-8 text-sm">
            Click any muscle area to see targeted exercises with video demonstrations
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
