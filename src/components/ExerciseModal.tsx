import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { exercises, Exercise } from "@/data/exercises";
import { X, Dumbbell, Clock } from "lucide-react";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  muscleGroup: string | null;
}

export const ExerciseModal = ({ isOpen, onClose, muscleGroup }: ExerciseModalProps) => {
  const muscleMappings: Record<string, string> = {
    "chest": "Chest",
    "abs": "Core",
    "shoulders-left": "Shoulders",
    "shoulders-right": "Shoulders",
    "shoulders": "Shoulders",
    "biceps-left": "Arms",
    "biceps-right": "Arms",
    "quadriceps-left": "Legs",
    "quadriceps-right": "Legs",
    "calves-left": "Legs",
    "calves-right": "Legs",
    "back": "Back",
    "arms": "Arms",
    "legs": "Legs"
  };

  const targetMuscle = muscleGroup ? muscleMappings[muscleGroup] : null;
  const filteredExercises = targetMuscle 
    ? exercises.filter(ex => ex.muscleGroup === targetMuscle)
    : [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-fitness-green/20 text-fitness-green border-fitness-green/30';
      case 'Intermediate':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Advanced':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-primary" />
            {targetMuscle} Exercises
          </DialogTitle>
          <DialogDescription>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available for {targetMuscle?.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-120px)] px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 p-4 space-y-3"
              >
                {/* Video Thumbnail */}
                {exercise.video && (
                  <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <video
                      src={exercise.video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  </div>
                )}

                {/* Exercise Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                      {exercise.name}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`${getDifficultyColor(exercise.difficulty)} shrink-0`}
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>

                  {exercise.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exercise.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Dumbbell className="w-4 h-4" />
                      <span>{exercise.equipment}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No exercises found for this muscle group.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
