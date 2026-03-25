import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/data/exercises";

interface ExercisePosterProps {
  exercise: Pick<Exercise, "name" | "muscleGroup" | "poster" | "video">;
  className?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
  showPlayBadge?: boolean;
}

const posterThemes: Record<string, string> = {
  Chest: "from-rose-500/30 via-orange-500/15 to-background text-rose-100",
  Back: "from-sky-500/30 via-cyan-500/15 to-background text-sky-100",
  Legs: "from-emerald-500/30 via-lime-500/15 to-background text-emerald-100",
  Arms: "from-amber-500/30 via-yellow-500/15 to-background text-amber-100",
  Shoulders: "from-violet-500/30 via-fuchsia-500/15 to-background text-violet-100",
  Core: "from-red-500/30 via-pink-500/15 to-background text-red-100",
};

export const ExercisePoster = ({
  exercise,
  className,
  imageClassName,
  loading = "lazy",
  showPlayBadge = true,
}: ExercisePosterProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [exercise.poster]);

  const theme = posterThemes[exercise.muscleGroup] ?? "from-primary/35 via-primary/10 to-background text-primary-foreground";

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {exercise.poster && !imageFailed ? (
        <img
          src={exercise.poster}
          alt={`${exercise.name} poster`}
          loading={loading}
          decoding="async"
          className={cn("h-full w-full object-cover", imageClassName)}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={cn("flex h-full w-full flex-col justify-between bg-gradient-to-br p-4", theme)}>
          <div className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
            {exercise.muscleGroup}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold leading-tight text-white">{exercise.name}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">
              Exercise Demo
            </p>
          </div>
        </div>
      )}

      {showPlayBadge && exercise.video ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 py-3 text-white">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
            Video Preview
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-xs font-medium">
            <Play className="h-3.5 w-3.5 fill-current" />
            Play
          </span>
        </div>
      ) : null}
    </div>
  );
};
