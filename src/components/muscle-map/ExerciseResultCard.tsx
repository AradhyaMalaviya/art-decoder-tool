import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import type { Exercise } from "@/data/exercises";
import { ExercisePoster } from "@/components/exercise/ExercisePoster";

interface ExerciseResultCardProps {
  exercise: Exercise;
  onViewDetails: (exercise: Exercise) => void;
}

const difficultyColors = {
  Beginner: "bg-fitness-green/20 text-fitness-green border-fitness-green/30",
  Intermediate: "bg-energetic-orange/20 text-energetic-orange border-energetic-orange/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

export const ExerciseResultCard = ({
  exercise,
  onViewDetails,
}: ExerciseResultCardProps) => {
  return (
    <div className="group bg-card/60 backdrop-blur-sm rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 animate-fade-in">
      {exercise.video ? (
        <div className="mb-4 overflow-hidden rounded-lg border border-border/60 bg-muted aspect-video">
          <ExercisePoster exercise={exercise} />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {exercise.name}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {exercise.duration}
          </p>
        </div>
        {exercise.video && (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Play className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Badge
          variant="outline"
          className={difficultyColors[exercise.difficulty]}
        >
          {exercise.difficulty}
        </Badge>
        <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
          {exercise.equipment}
        </Badge>
      </div>

      {exercise.description && (
        <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
          {exercise.description}
        </p>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-3 text-primary hover:bg-primary/10"
        onClick={() => onViewDetails(exercise)}
      >
        <Info className="w-4 h-4 mr-2" />
        View Details
      </Button>
    </div>
  );
};
