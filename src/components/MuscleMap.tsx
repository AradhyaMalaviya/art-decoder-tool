import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMuscleRoute, hasExercises, getDisplayNameFromDiagramId } from "@/lib/muscleMapping";

interface MuscleRegion {
  id: string;
  name: string;
  path: string;
  color: string;
}

export const MuscleMap = () => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const navigate = useNavigate();

  const muscleRegions: MuscleRegion[] = [
    {
      id: "chest",
      name: "Chest",
      path: "M160,95 L165,90 L175,87 L185,86 L195,86 L205,87 L215,90 L220,95 L222,105 L220,115 L215,125 L210,130 L200,133 L190,134 L180,133 L170,130 L165,125 L160,115 L158,105 Z",
      color: "rgba(255, 150, 150, 0.45)",
    },
    {
      id: "shoulders",
      name: "Shoulders",
      path: "M135,85 L145,82 L155,85 L160,92 L160,105 L155,110 L145,108 L135,102 L130,92 Z M225,85 L215,82 L205,85 L200,92 L200,105 L205,110 L215,108 L225,102 L230,92 Z",
      color: "rgba(150, 200, 255, 0.45)",
    },
    {
      id: "biceps",
      name: "Biceps",
      path: "M130,108 L138,110 L143,125 L145,145 L143,165 L138,175 L130,178 L125,175 L122,165 L120,145 L122,125 L125,115 Z M250,108 L242,110 L237,125 L235,145 L237,165 L242,175 L250,178 L255,175 L258,165 L260,145 L258,125 L255,115 Z",
      color: "rgba(180, 150, 255, 0.45)",
    },
    {
      id: "abs",
      name: "Abs",
      path: "M165,135 L170,138 L175,142 L180,145 L185,147 L190,147 L195,147 L200,145 L205,142 L210,138 L215,135 L215,155 L213,175 L210,195 L205,210 L200,218 L190,222 L180,218 L175,210 L170,195 L167,175 L165,155 Z",
      color: "rgba(255, 200, 120, 0.45)",
    },
    {
      id: "quadriceps",
      name: "Quadriceps",
      path: "M165,225 L172,223 L178,228 L182,245 L185,270 L185,295 L183,315 L178,328 L172,332 L167,330 L163,315 L162,295 L163,270 L165,245 Z M215,225 L208,223 L202,228 L198,245 L195,270 L195,295 L197,315 L202,328 L208,332 L213,330 L217,315 L218,295 L217,270 L215,245 Z",
      color: "rgba(150, 255, 200, 0.45)",
    },
    {
      id: "calves",
      name: "Calves",
      path: "M168,338 L173,340 L176,355 L178,375 L178,395 L176,410 L172,418 L168,420 L164,418 L162,410 L160,395 L160,375 L162,355 L165,345 Z M212,338 L207,340 L204,355 L202,375 L202,395 L204,410 L208,418 L212,420 L216,418 L218,410 L220,395 L220,375 L218,355 L215,345 Z",
      color: "rgba(200, 180, 255, 0.45)",
    },
  ];

  const handleMuscleClick = (muscleId: string) => {
    if (hasExercises(muscleId)) {
      const route = getMuscleRoute(muscleId);
      navigate(route);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col items-center justify-center py-8 px-4 bg-[#0d0f14] min-h-screen">
        <div className="w-full max-w-[450px] md:w-[450px] sm:w-[380px] xs:w-[320px]">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground font-['Inter','Poppins',sans-serif]">
            Select a Muscle Group
          </h2>

          <div className="relative flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 380 460"
              className="w-full h-auto"
              style={{ maxWidth: "450px" }}
            >
              {/* Body outline base */}
              <g stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" opacity="0.3">
                {/* Head */}
                <ellipse cx="190" cy="40" rx="25" ry="32" />
                <path d="M190,72 L190,85" />
                
                {/* Torso outline */}
                <path d="M160,95 Q155,110 155,135 L155,220 Q160,235 175,240" />
                <path d="M220,95 Q225,110 225,135 L225,220 Q220,235 205,240" />
                
                {/* Arms */}
                <path d="M135,85 Q125,100 120,120 L120,180 Q115,195 110,210" />
                <path d="M245,85 Q255,100 260,120 L260,180 Q265,195 270,210" />
                
                {/* Legs */}
                <path d="M175,240 L165,245 Q162,270 162,295 L162,335 Q163,360 165,385 L165,425" />
                <path d="M205,240 L215,245 Q218,270 218,295 L218,335 Q217,360 215,385 L215,425" />
              </g>

              {/* Interactive muscle regions */}
              {muscleRegions.map((muscle) => {
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
                        style={{
                          filter: isHovered && hasExercisesForMuscle 
                            ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))" 
                            : "none",
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-primary text-primary-foreground font-['Inter','Poppins',sans-serif]"
                    >
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

          {hoveredMuscle && hasExercises(hoveredMuscle) && (
            <div className="mt-8 text-center animate-fade-in">
              <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-medium font-['Inter','Poppins',sans-serif]">
                Click to explore {getDisplayNameFromDiagramId(hoveredMuscle)} exercises
              </div>
            </div>
          )}

          <p className="text-center text-muted-foreground mt-8 text-sm font-['Inter','Poppins',sans-serif]">
            Hover over any muscle group to highlight it, then click to see targeted exercises
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};
