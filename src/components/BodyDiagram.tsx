import { useState } from "react";
import bodyDiagramFront from "@/assets/body-diagram-front.jpg";

interface BodyDiagramProps {
  onMuscleSelect: (muscle: string) => void;
  selectedMuscle: string | null;
}

interface Muscle {
  name: string;
  title: string;
  path: string;
}

export const BodyDiagram = ({ onMuscleSelect }: BodyDiagramProps) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const handleMuscleClick = (muscle: string) => {
    onMuscleSelect(muscle);
  };

  // Front view muscles mapped to the anatomical diagram
  const frontMuscles: Muscle[] = [
    {
      name: "chest",
      title: "Chest",
      path: "M165 115 Q155 120 150 135 Q145 150 150 165 Q155 175 170 180 Q185 180 200 175 Q210 170 215 165 Q215 155 210 145 Q205 130 200 120 Q190 115 180 115 Z M240 115 Q230 115 220 120 Q215 130 210 145 Q205 155 205 165 Q210 170 220 175 Q235 180 250 180 Q265 175 270 165 Q275 150 270 135 Q265 120 255 115 Z"
    },
    {
      name: "shoulders",
      title: "Shoulders",
      path: "M115 100 Q105 105 100 115 Q95 125 95 140 Q100 155 110 160 Q125 162 140 155 Q145 145 145 135 Q145 120 140 110 Q130 100 120 100 Z M305 100 Q315 100 325 110 Q330 120 330 135 Q330 145 325 155 Q310 162 295 160 Q285 155 280 140 Q280 125 285 115 Q290 105 300 100 Z"
    },
    {
      name: "biceps",
      title: "Biceps",
      path: "M130 165 Q120 170 115 180 Q110 195 110 215 Q112 230 120 240 Q130 245 142 240 Q150 230 152 215 Q152 195 147 180 Q142 170 135 165 Z M290 165 Q300 170 305 180 Q310 195 310 215 Q308 230 300 240 Q290 245 278 240 Q270 230 268 215 Q268 195 273 180 Q278 170 285 165 Z"
    },
    {
      name: "abs",
      title: "Abs",
      path: "M185 190 Q175 195 170 210 Q168 230 170 250 Q172 270 175 290 Q180 305 190 310 Q200 310 210 305 Q215 290 217 270 Q218 250 217 230 Q215 210 210 195 Q205 190 195 190 Z"
    },
    {
      name: "quadriceps",
      title: "Quadriceps",
      path: "M160 320 Q150 325 145 340 Q140 360 140 390 Q142 420 145 450 Q150 470 160 480 Q170 482 180 478 Q185 460 187 440 Q188 410 187 380 Q185 350 180 335 Q175 325 168 320 Z M240 320 Q250 325 255 340 Q260 360 260 390 Q258 420 255 450 Q250 470 240 480 Q230 482 220 478 Q215 460 213 440 Q212 410 213 380 Q215 350 220 335 Q225 325 232 320 Z"
    },
    {
      name: "calves",
      title: "Calves",
      path: "M165 495 Q155 500 152 515 Q150 535 152 555 Q155 575 160 590 Q165 600 175 605 Q185 605 192 600 Q197 585 198 565 Q198 540 195 520 Q190 505 182 495 Z M238 495 Q248 505 253 520 Q256 540 256 565 Q255 585 250 600 Q245 605 235 605 Q225 600 220 590 Q215 575 212 555 Q210 535 212 515 Q215 500 225 495 Z"
    }
  ];

  // Back view muscles (mirrored positioning for back view)
  const backMuscles: Muscle[] = [
    {
      name: "back",
      title: "Upper Back",
      path: "M165 120 Q155 125 150 140 Q145 160 150 185 Q155 210 165 230 Q180 245 200 250 Q220 245 235 230 Q245 210 250 185 Q255 160 250 140 Q245 125 235 120 Z"
    },
    {
      name: "shoulders",
      title: "Shoulders",
      path: "M115 100 Q105 105 100 115 Q95 125 95 140 Q100 155 110 160 Q125 162 140 155 Q145 145 145 135 Q145 120 140 110 Q130 100 120 100 Z M305 100 Q315 100 325 110 Q330 120 330 135 Q330 145 325 155 Q310 162 295 160 Q285 155 280 140 Q280 125 285 115 Q290 105 300 100 Z"
    },
    {
      name: "arms",
      title: "Triceps",
      path: "M130 165 Q120 170 115 180 Q110 195 110 215 Q112 230 120 240 Q130 245 142 240 Q150 230 152 215 Q152 195 147 180 Q142 170 135 165 Z M290 165 Q300 170 305 180 Q310 195 310 215 Q308 230 300 240 Q290 245 278 240 Q270 230 268 215 Q268 195 273 180 Q278 170 285 165 Z"
    },
    {
      name: "legs",
      title: "Glutes & Hamstrings",
      path: "M160 260 Q150 270 145 290 Q140 320 140 360 Q142 400 145 440 Q150 465 160 478 Q170 480 180 475 Q185 455 187 430 Q188 390 187 350 Q185 310 180 285 Q175 270 168 260 Z M240 260 Q250 270 255 290 Q260 320 260 360 Q258 400 255 440 Q250 465 240 478 Q230 480 220 475 Q215 455 213 430 Q212 390 213 350 Q215 310 220 285 Q225 270 232 260 Z"
    },
    {
      name: "legs",
      title: "Calves",
      path: "M165 495 Q155 500 152 515 Q150 535 152 555 Q155 575 160 590 Q165 600 175 605 Q185 605 192 600 Q197 585 198 565 Q198 540 195 520 Q190 505 182 495 Z M238 495 Q248 505 253 520 Q256 540 256 565 Q255 585 250 600 Q245 605 235 605 Q225 600 220 590 Q215 575 212 555 Q210 535 212 515 Q215 500 225 495 Z"
    }
  ];

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl bg-[#f6fbff] rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Select a Muscle Group
        </h2>
        
        <div className="flex justify-center items-center">
          {/* Front View */}
          <div className="flex flex-col items-center relative">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Select a Muscle Group</h3>
            <div className="relative w-full max-w-[400px]">
              <img 
                src={bodyDiagramFront} 
                alt="Body diagram" 
                className="w-full h-auto"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 420 680"
                className="absolute top-0 left-0 w-full h-full"
              >
                {frontMuscles.map((muscle, index) => (
                  <path
                    key={`front-${muscle.name}-${index}`}
                    id={`front-${muscle.name}-${index}`}
                    d={muscle.path}
                    fill={hoveredMuscle === `front-${muscle.name}-${index}` ? "rgba(255, 91, 91, 0.6)" : "transparent"}
                    stroke="transparent"
                    strokeWidth="0"
                    className="cursor-pointer"
                    style={{
                      transition: "fill 0.3s ease"
                    }}
                    onClick={() => handleMuscleClick(muscle.name)}
                    onMouseEnter={() => setHoveredMuscle(`front-${muscle.name}-${index}`)}
                    onMouseLeave={() => setHoveredMuscle(null)}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Hover Label */}
        {hoveredMuscle && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg text-lg font-medium">
              {[...frontMuscles, ...backMuscles].find((m, i) => 
                `front-${m.name}-${i}` === hoveredMuscle || `back-${m.name}-${i}` === hoveredMuscle
              )?.title}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
