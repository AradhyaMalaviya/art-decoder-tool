import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MuscleRegion {
  id: string;
  name: string;
  path: string;
  muscleGroup: string;
}

interface MuscleMapSVGProps {
  view: "front" | "back";
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onMuscleHover: (muscleId: string | null) => void;
  onMuscleClick: (muscleId: string, muscleGroup: string) => void;
}

// Clean anatomical SVG paths based on the reference image
const frontMuscles: MuscleRegion[] = [
  // Chest - Left and Right Pecs
  {
    id: "chest-left",
    name: "Chest",
    muscleGroup: "Chest",
    path: "M170,115 Q180,105 200,105 L200,145 Q185,155 170,145 Q160,135 165,120 Z",
  },
  {
    id: "chest-right",
    name: "Chest",
    muscleGroup: "Chest",
    path: "M200,105 Q220,105 230,115 Q235,120 230,145 Q215,155 200,145 L200,105 Z",
  },
  // Shoulders - Front Delts
  {
    id: "shoulder-left",
    name: "Shoulders",
    muscleGroup: "Shoulders",
    path: "M135,95 Q150,85 165,95 Q175,110 170,125 Q155,130 145,120 Q130,110 135,95 Z",
  },
  {
    id: "shoulder-right",
    name: "Shoulders",
    muscleGroup: "Shoulders",
    path: "M235,95 Q250,85 265,95 Q270,110 255,120 Q245,130 230,125 Q225,110 235,95 Z",
  },
  // Biceps
  {
    id: "bicep-left",
    name: "Biceps",
    muscleGroup: "Arms",
    path: "M135,130 Q145,125 152,135 Q155,160 152,185 Q145,195 135,190 Q125,175 125,155 Q125,140 135,130 Z",
  },
  {
    id: "bicep-right",
    name: "Biceps",
    muscleGroup: "Arms",
    path: "M265,130 Q255,125 248,135 Q245,160 248,185 Q255,195 265,190 Q275,175 275,155 Q275,140 265,130 Z",
  },
  // Forearms
  {
    id: "forearm-left",
    name: "Forearms",
    muscleGroup: "Arms",
    path: "M130,195 Q145,200 148,210 Q150,240 145,275 Q135,280 125,275 Q120,240 125,210 Q125,200 130,195 Z",
  },
  {
    id: "forearm-right",
    name: "Forearms",
    muscleGroup: "Arms",
    path: "M270,195 Q255,200 252,210 Q250,240 255,275 Q265,280 275,275 Q280,240 275,210 Q275,200 270,195 Z",
  },
  // Abs
  {
    id: "abs",
    name: "Abs",
    muscleGroup: "Core",
    path: "M175,150 L225,150 L225,160 L175,160 Z M175,165 L225,165 L225,180 L175,180 Z M175,185 L225,185 L225,200 L175,200 Z M175,205 L225,205 L225,220 L175,220 Z M175,225 L225,225 L225,245 L175,245 Z",
  },
  // Obliques
  {
    id: "oblique-left",
    name: "Obliques",
    muscleGroup: "Core",
    path: "M158,155 Q170,150 175,155 L175,240 Q170,250 160,245 Q152,220 155,185 Q155,165 158,155 Z",
  },
  {
    id: "oblique-right",
    name: "Obliques",
    muscleGroup: "Core",
    path: "M242,155 Q230,150 225,155 L225,240 Q230,250 240,245 Q248,220 245,185 Q245,165 242,155 Z",
  },
  // Quadriceps
  {
    id: "quad-left",
    name: "Quadriceps",
    muscleGroup: "Legs",
    path: "M165,255 Q180,250 195,255 Q200,300 195,360 Q180,375 165,365 Q155,320 160,275 Q160,260 165,255 Z",
  },
  {
    id: "quad-right",
    name: "Quadriceps",
    muscleGroup: "Legs",
    path: "M235,255 Q220,250 205,255 Q200,300 205,360 Q220,375 235,365 Q245,320 240,275 Q240,260 235,255 Z",
  },
  // Calves - Front
  {
    id: "calf-front-left",
    name: "Calves",
    muscleGroup: "Legs",
    path: "M168,380 Q180,375 188,380 Q192,420 188,465 Q180,475 168,470 Q162,430 165,400 Q165,385 168,380 Z",
  },
  {
    id: "calf-front-right",
    name: "Calves",
    muscleGroup: "Legs",
    path: "M232,380 Q220,375 212,380 Q208,420 212,465 Q220,475 232,470 Q238,430 235,400 Q235,385 232,380 Z",
  },
];

const backMuscles: MuscleRegion[] = [
  // Trapezius
  {
    id: "traps",
    name: "Trapezius",
    muscleGroup: "Back",
    path: "M175,70 Q200,60 225,70 Q215,95 200,100 Q185,95 175,70 Z",
  },
  // Rear Delts
  {
    id: "rear-delt-left",
    name: "Rear Delts",
    muscleGroup: "Shoulders",
    path: "M140,95 Q155,85 168,95 Q175,110 170,125 Q155,130 145,120 Q135,110 140,95 Z",
  },
  {
    id: "rear-delt-right",
    name: "Rear Delts",
    muscleGroup: "Shoulders",
    path: "M260,95 Q245,85 232,95 Q225,110 230,125 Q245,130 255,120 Q265,110 260,95 Z",
  },
  // Lats
  {
    id: "lat-left",
    name: "Lats",
    muscleGroup: "Back",
    path: "M155,130 Q175,120 190,130 Q195,160 190,200 Q175,215 160,205 Q150,175 152,150 Q152,135 155,130 Z",
  },
  {
    id: "lat-right",
    name: "Lats",
    muscleGroup: "Back",
    path: "M245,130 Q225,120 210,130 Q205,160 210,200 Q225,215 240,205 Q250,175 248,150 Q248,135 245,130 Z",
  },
  // Lower Back
  {
    id: "lower-back",
    name: "Lower Back",
    muscleGroup: "Back",
    path: "M180,210 Q200,205 220,210 Q225,240 220,260 Q200,270 180,260 Q175,240 180,210 Z",
  },
  // Triceps
  {
    id: "tricep-left",
    name: "Triceps",
    muscleGroup: "Arms",
    path: "M135,130 Q148,125 152,140 Q155,165 150,195 Q140,200 130,195 Q125,165 128,145 Q128,135 135,130 Z",
  },
  {
    id: "tricep-right",
    name: "Triceps",
    muscleGroup: "Arms",
    path: "M265,130 Q252,125 248,140 Q245,165 250,195 Q260,200 270,195 Q275,165 272,145 Q272,135 265,130 Z",
  },
  // Glutes
  {
    id: "glute-left",
    name: "Glutes",
    muscleGroup: "Legs",
    path: "M165,265 Q185,255 200,265 Q205,295 195,320 Q175,330 160,315 Q155,290 165,265 Z",
  },
  {
    id: "glute-right",
    name: "Glutes",
    muscleGroup: "Legs",
    path: "M235,265 Q215,255 200,265 Q195,295 205,320 Q225,330 240,315 Q245,290 235,265 Z",
  },
  // Hamstrings
  {
    id: "hamstring-left",
    name: "Hamstrings",
    muscleGroup: "Legs",
    path: "M165,330 Q180,325 195,335 Q198,380 195,430 Q180,445 165,435 Q158,385 162,355 Q162,340 165,330 Z",
  },
  {
    id: "hamstring-right",
    name: "Hamstrings",
    muscleGroup: "Legs",
    path: "M235,330 Q220,325 205,335 Q202,380 205,430 Q220,445 235,435 Q242,385 238,355 Q238,340 235,330 Z",
  },
  // Calves - Back
  {
    id: "calf-back-left",
    name: "Calves",
    muscleGroup: "Legs",
    path: "M168,445 Q180,440 192,448 Q198,485 192,530 Q180,540 168,535 Q160,490 165,465 Q165,450 168,445 Z",
  },
  {
    id: "calf-back-right",
    name: "Calves",
    muscleGroup: "Legs",
    path: "M232,445 Q220,440 208,448 Q202,485 208,530 Q220,540 232,535 Q240,490 235,465 Q235,450 232,445 Z",
  },
];

// Human body outline for the anatomical background
const bodyOutlineFront = `
  M200,30 
  Q230,30 240,50 Q245,60 240,75 Q235,85 225,90 
  Q260,95 275,110 Q290,125 290,160 Q290,200 280,240 Q275,260 270,280
  Q268,290 265,300
  Q275,310 280,330 Q282,350 278,380
  Q250,380 235,375
  Q245,340 240,310 Q235,280 230,260
  L225,255 L200,250 L175,255 L170,260
  Q165,280 160,310 Q155,340 165,375
  Q150,380 122,380
  Q118,350 120,330 Q125,310 135,300
  Q132,290 130,280 Q125,260 120,240 Q110,200 110,160 Q110,125 125,110 Q140,95 175,90
  Q165,85 160,75 Q155,60 160,50 Q170,30 200,30 Z
  M165,380 Q180,375 200,375 Q220,375 235,380
  Q240,420 235,470 Q230,520 220,560
  Q200,565 180,560 Q170,520 165,470 Q160,420 165,380 Z
`;

const bodyOutlineBack = `
  M200,30 
  Q230,30 240,50 Q245,60 240,75 Q235,85 225,90 
  Q260,95 275,110 Q290,125 290,160 Q290,200 280,240 Q275,260 270,280
  Q268,290 265,300
  Q275,310 280,330 Q282,350 278,380
  Q250,380 235,375
  Q245,340 240,310 Q235,280 230,260
  L225,255 L200,250 L175,255 L170,260
  Q165,280 160,310 Q155,340 165,375
  Q150,380 122,380
  Q118,350 120,330 Q125,310 135,300
  Q132,290 130,280 Q125,260 120,240 Q110,200 110,160 Q110,125 125,110 Q140,95 175,90
  Q165,85 160,75 Q155,60 160,50 Q170,30 200,30 Z
  M165,380 Q180,375 200,375 Q220,375 235,380
  Q240,420 235,470 Q230,520 220,560
  Q200,565 180,560 Q170,520 165,470 Q160,420 165,380 Z
`;

export const MuscleMapSVG = ({
  view,
  hoveredMuscle,
  selectedMuscle,
  onMuscleHover,
  onMuscleClick,
}: MuscleMapSVGProps) => {
  const muscles = view === "front" ? frontMuscles : backMuscles;
  const bodyOutline = view === "front" ? bodyOutlineFront : bodyOutlineBack;

  const getMuscleState = (muscle: MuscleRegion) => {
    const isSelected = selectedMuscle === muscle.muscleGroup;
    const isHovered = hoveredMuscle === muscle.id;
    
    if (isSelected) {
      return {
        fill: "hsl(0 84% 60%)", // Deep red for selected
        stroke: "hsl(0 84% 45%)",
        strokeWidth: 2,
      };
    }
    if (isHovered) {
      return {
        fill: "hsl(0 84% 80% / 0.6)", // Soft red for hover
        stroke: "hsl(0 84% 60%)",
        strokeWidth: 1.5,
      };
    }
    return {
      fill: "hsl(220 20% 95% / 0.15)", // Light fill
      stroke: "hsl(220 30% 60% / 0.4)",
      strokeWidth: 1,
    };
  };

  return (
    <svg
      viewBox="0 0 400 600"
      className="w-full h-auto max-h-[550px]"
      style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.1))" }}
    >
      {/* Background body outline */}
      <path
        d={bodyOutline}
        fill="hsl(220 20% 95%)"
        stroke="hsl(220 30% 60%)"
        strokeWidth="1.5"
      />

      {/* Muscle regions */}
      {muscles.map((muscle) => {
        const state = getMuscleState(muscle);
        return (
          <Tooltip key={muscle.id}>
            <TooltipTrigger asChild>
              <path
                d={muscle.path}
                fill={state.fill}
                stroke={state.stroke}
                strokeWidth={state.strokeWidth}
                className="cursor-pointer transition-all duration-300"
                onClick={() => onMuscleClick(muscle.id, muscle.muscleGroup)}
                onMouseEnter={() => onMuscleHover(muscle.id)}
                onMouseLeave={() => onMuscleHover(null)}
              />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-card text-card-foreground border border-border shadow-lg"
            >
              <p className="font-medium text-sm">{muscle.name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </svg>
  );
};
