import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { hasExercises } from "@/lib/muscleMapping";

type MuscleGroup = 'traps' | 'shoulders' | 'chest' | 'biceps' | 'forearms' | 'abs' | 'obliques' | 'quads' | 'calves' | 'lats' | 'triceps' | 'lower_back' | 'glutes' | 'hamstrings';

interface MuscleMapSVGProps {
  view: "front" | "back";
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onMuscleHover: (muscleId: string | null) => void;
  onMuscleClick: (muscleId: string, muscleGroup: string) => void;
}

const muscleGroupLabels: Record<MuscleGroup, string> = {
  traps: 'Trapezius',
  shoulders: 'Shoulders',
  chest: 'Chest',
  biceps: 'Biceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  quads: 'Quadriceps',
  calves: 'Calves',
  lats: 'Lats',
  triceps: 'Triceps',
  lower_back: 'Lower Back',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
};

export const MuscleMapSVG = ({
  view,
  hoveredMuscle,
  selectedMuscle,
  onMuscleHover,
  onMuscleClick,
}: MuscleMapSVGProps) => {
  
  const isSelected = (muscle: MuscleGroup) => selectedMuscle === muscleGroupLabels[muscle];
  const isHovered = (muscle: MuscleGroup) => hoveredMuscle === muscle;
  
  const getPathClass = (muscle: MuscleGroup) => {
    const selected = isSelected(muscle);
    const hovered = isHovered(muscle);
    const hasExercisesForMuscle = hasExercises(muscle);
    
    if (!hasExercisesForMuscle) {
      return 'cursor-not-allowed transition-colors duration-200 ease-in-out fill-slate-100 opacity-50 stroke-slate-300';
    }
    
    if (selected) {
      return 'cursor-pointer transition-colors duration-200 ease-in-out fill-pink-400 stroke-pink-500';
    }
    if (hovered) {
      return 'cursor-pointer transition-colors duration-200 ease-in-out fill-pink-200 stroke-pink-300';
    }
    return 'cursor-pointer transition-colors duration-200 ease-in-out fill-slate-100 hover:fill-pink-200 stroke-slate-300';
  };

  const handleClick = (muscle: MuscleGroup) => {
    if (hasExercises(muscle)) {
      onMuscleClick(muscle, muscleGroupLabels[muscle]);
    }
  };

  const handleMouseEnter = (muscle: MuscleGroup) => {
    if (hasExercises(muscle)) {
      onMuscleHover(muscle);
    }
  };

  const handleMouseLeave = () => {
    onMuscleHover(null);
  };

  const renderMuscle = (muscle: MuscleGroup, pathD: string) => {
    const hasExercisesForMuscle = hasExercises(muscle);
    const muscleIsHovered = isHovered(muscle);
    
    return (
      <Tooltip key={`${muscle}-${pathD.substring(0, 20)}`}>
        <TooltipTrigger asChild>
          <path 
            d={pathD}
            className={getPathClass(muscle)} 
            onClick={() => handleClick(muscle)} 
            onMouseEnter={() => handleMouseEnter(muscle)}
            onMouseLeave={handleMouseLeave}
            strokeWidth={muscleIsHovered && hasExercisesForMuscle ? "2.5" : "1.5"}
            style={{
              filter: muscleIsHovered && hasExercisesForMuscle 
                ? "drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))" 
                : "none",
            }}
          />
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-card text-card-foreground border border-border shadow-lg"
        >
          <p className="font-medium text-sm">
            {muscleGroupLabels[muscle]}
            {!hasExercisesForMuscle && (
              <span className="text-xs opacity-75 ml-2">(No exercises yet)</span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  };

  if (view === 'front') {
    return (
      <svg viewBox="0 0 200 400" className="w-full h-auto max-h-[600px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="100" cy="35" r="20" className="fill-slate-100 stroke-slate-300" strokeWidth="1.5" />
        
        {/* Neck */}
        <path d="M90 53 L90 65 L110 65 L110 53" className="fill-slate-100 stroke-slate-300" strokeWidth="1.5" />

        {/* Traps (Front View - small visible part) */}
        {renderMuscle('traps', "M90 65 L70 75 L130 75 L110 65 Z")}

        {/* Shoulders (Deltoids) - Left */}
        {renderMuscle('shoulders', "M70 75 Q60 85 55 100 L65 110 Q75 90 80 80 Z")}
        {/* Shoulders (Deltoids) - Right */}
        {renderMuscle('shoulders', "M130 75 Q140 85 145 100 L135 110 Q125 90 120 80 Z")}

        {/* Chest (Pectorals) */}
        {renderMuscle('chest', "M80 80 Q100 85 120 80 L115 115 Q100 120 85 115 Z")}

        {/* Biceps - Left */}
        {renderMuscle('biceps', "M55 100 L50 130 Q60 135 65 130 L65 110 Z")}
        {/* Biceps - Right */}
        {renderMuscle('biceps', "M145 100 L150 130 Q140 135 135 130 L135 110 Z")}

        {/* Forearms - Left */}
        {renderMuscle('forearms', "M50 130 L45 170 Q55 175 60 170 L65 130 Z")}
        {/* Forearms - Right */}
        {renderMuscle('forearms', "M150 130 L155 170 Q145 175 140 170 L135 130 Z")}

        {/* Abs (Rectus Abdominis) */}
        {renderMuscle('abs', "M85 115 L115 115 L110 160 L90 160 Z")}

        {/* Obliques - Left */}
        {renderMuscle('obliques', "M85 115 L75 125 L80 155 L90 160 Z")}
        {/* Obliques - Right */}
        {renderMuscle('obliques', "M115 115 L125 125 L120 155 L110 160 Z")}

        {/* Quads */}
        {renderMuscle('quads', "M80 160 L120 160 L125 180 L115 250 Q100 260 85 250 L75 180 Z")}

        {/* Calves (Front visible) */}
        {renderMuscle('calves', "M85 250 L115 250 L110 320 Q100 330 90 320 Z")}
      </svg>
    );
  } else {
    // BACK VIEW
    return (
      <svg viewBox="0 0 200 400" className="w-full h-auto max-h-[600px] drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="100" cy="35" r="20" className="fill-slate-100 stroke-slate-300" strokeWidth="1.5" />
        
        {/* Neck */}
        <path d="M90 53 L90 65 L110 65 L110 53" className="fill-slate-100 stroke-slate-300" strokeWidth="1.5" />

        {/* Traps */}
        {renderMuscle('traps', "M90 60 L70 75 L100 110 L130 75 L110 60 Z")}

        {/* Shoulders (Rear Delts) - Left */}
        {renderMuscle('shoulders', "M70 75 Q60 85 55 100 L65 110 Q70 95 80 85 Z")}
        {/* Shoulders (Rear Delts) - Right */}
        {renderMuscle('shoulders', "M130 75 Q140 85 145 100 L135 110 Q130 95 120 85 Z")}

        {/* Lats - Left */}
        {renderMuscle('lats', "M80 100 L65 130 L90 150 L100 110 Z")}
        {/* Lats - Right */}
        {renderMuscle('lats', "M120 100 L135 130 L110 150 L100 110 Z")}

        {/* Triceps - Left */}
        {renderMuscle('triceps', "M55 100 L50 130 Q60 135 65 130 L65 110 Z")}
        {/* Triceps - Right */}
        {renderMuscle('triceps', "M145 100 L150 130 Q140 135 135 130 L135 110 Z")}

        {/* Forearms - Left */}
        {renderMuscle('forearms', "M50 130 L45 170 Q55 175 60 170 L65 130 Z")}
        {/* Forearms - Right */}
        {renderMuscle('forearms', "M150 130 L155 170 Q145 175 140 170 L135 130 Z")}

        {/* Lower Back */}
        {renderMuscle('lower_back', "M90 150 L80 165 L120 165 L110 150 Z")}

        {/* Glutes */}
        {renderMuscle('glutes', "M80 165 L70 180 L100 200 L130 180 L120 165 L100 185 Z")}

        {/* Hamstrings */}
        {renderMuscle('hamstrings', "M70 180 L80 250 L100 240 L120 250 L130 180 L100 200 Z")}

        {/* Calves */}
        {renderMuscle('calves', "M80 250 L75 300 L100 320 L125 300 L120 250 Z")}
      </svg>
    );
  }
};
