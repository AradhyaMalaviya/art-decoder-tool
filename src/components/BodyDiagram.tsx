import { useState } from "react";

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

  // Front view muscles with anatomically accurate SVG paths
  const frontMuscles: Muscle[] = [
    {
      name: "chest",
      title: "Chest",
      path: "M280 160 Q270 165 265 175 L265 210 Q270 225 285 230 L315 230 Q330 225 335 210 L335 175 Q330 165 320 160 Z"
    },
    {
      name: "shoulders",
      title: "Shoulders",
      path: "M240 150 Q235 155 235 165 L235 185 Q238 195 248 198 L260 195 Q265 188 265 180 L265 160 Q262 152 252 150 Z M340 150 Q348 152 351 160 L351 180 Q351 188 346 195 L334 198 Q324 195 321 185 L321 165 Q321 155 326 150 Z"
    },
    {
      name: "biceps",
      title: "Biceps",
      path: "M225 200 Q220 205 220 215 L220 250 Q223 258 230 260 L245 258 Q250 253 250 245 L250 210 Q248 202 240 200 Z M350 200 Q360 202 362 210 L362 245 Q362 253 357 258 L342 260 Q335 258 332 250 L332 215 Q332 205 337 200 Z"
    },
    {
      name: "abs",
      title: "Abs",
      path: "M275 240 Q270 245 270 255 L270 310 Q272 325 280 330 L320 330 Q328 325 330 310 L330 255 Q330 245 325 240 Z"
    },
    {
      name: "quadriceps",
      title: "Quadriceps",
      path: "M265 345 Q260 350 260 360 L260 470 Q263 485 275 490 L325 490 Q337 485 340 470 L340 360 Q340 350 335 345 Z"
    },
    {
      name: "calves",
      title: "Calves",
      path: "M270 505 Q265 510 265 520 L265 590 Q268 600 278 605 L322 605 Q332 600 335 590 L335 520 Q335 510 330 505 Z"
    }
  ];

  // Back view muscles
  const backMuscles: Muscle[] = [
    {
      name: "back",
      title: "Upper Back",
      path: "M680 160 Q670 165 665 175 L665 240 Q670 260 685 265 L715 265 Q730 260 735 240 L735 175 Q730 165 720 160 Z"
    },
    {
      name: "shoulders",
      title: "Shoulders",
      path: "M640 150 Q635 155 635 165 L635 185 Q638 195 648 198 L660 195 Q665 188 665 180 L665 160 Q662 152 652 150 Z M740 150 Q748 152 751 160 L751 180 Q751 188 746 195 L734 198 Q724 195 721 185 L721 165 Q721 155 726 150 Z"
    },
    {
      name: "arms",
      title: "Triceps",
      path: "M625 200 Q620 205 620 215 L620 250 Q623 258 630 260 L645 258 Q650 253 650 245 L650 210 Q648 202 640 200 Z M750 200 Q760 202 762 210 L762 245 Q762 253 757 258 L742 260 Q735 258 732 250 L732 215 Q732 205 737 200 Z"
    },
    {
      name: "legs",
      title: "Glutes & Hamstrings",
      path: "M665 280 Q660 285 660 295 L660 470 Q663 485 675 490 L725 490 Q737 485 740 470 L740 295 Q740 285 735 280 Z"
    },
    {
      name: "legs",
      title: "Calves",
      path: "M670 505 Q665 510 665 520 L665 590 Q668 600 678 605 L722 605 Q732 600 735 590 L735 520 Q735 510 730 505 Z"
    }
  ];

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-5xl bg-[#f6fbff] rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Select a Muscle Group
        </h2>
        
        <div className="flex flex-col lg:flex-row justify-center items-start gap-12 lg:gap-20">
          {/* Front View */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Front</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 800"
              className="w-full max-w-[300px] h-auto"
            >
              {frontMuscles.map((muscle, index) => (
                <path
                  key={`front-${muscle.name}-${index}`}
                  id={`front-${muscle.name}-${index}`}
                  d={muscle.path}
                  fill={hoveredMuscle === `front-${muscle.name}-${index}` ? "rgba(255, 91, 91, 0.6)" : "transparent"}
                  stroke="#2a2a2a"
                  strokeWidth="1"
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

          {/* Back View */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Back</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 800"
              className="w-full max-w-[300px] h-auto"
            >
              {backMuscles.map((muscle, index) => (
                <path
                  key={`back-${muscle.name}-${index}`}
                  id={`back-${muscle.name}-${index}`}
                  d={muscle.path}
                  fill={hoveredMuscle === `back-${muscle.name}-${index}` ? "rgba(255, 91, 91, 0.6)" : "transparent"}
                  stroke="#2a2a2a"
                  strokeWidth="1"
                  className="cursor-pointer"
                  style={{
                    transition: "fill 0.3s ease"
                  }}
                  onClick={() => handleMuscleClick(muscle.name)}
                  onMouseEnter={() => setHoveredMuscle(`back-${muscle.name}-${index}`)}
                  onMouseLeave={() => setHoveredMuscle(null)}
                />
              ))}
            </svg>
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
