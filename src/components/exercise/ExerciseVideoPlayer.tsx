import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/data/exercises";
import { ExercisePoster } from "@/components/exercise/ExercisePoster";

interface ExerciseVideoPlayerProps {
  exercise: Pick<Exercise, "name" | "muscleGroup" | "poster" | "video">;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export const ExerciseVideoPlayer = ({
  exercise,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
}: ExerciseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    setShowPoster(true);
  }, [exercise.poster, exercise.video]);

  useEffect(() => {
    const video = videoRef.current;

    return () => {
      if (!video) {
        return;
      }

      video.pause();
      video.currentTime = 0;
    };
  }, [exercise.video]);

  if (!exercise.video) {
    return null;
  }

  return (
    <div className="relative h-full w-full bg-black">
      {showPoster ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <ExercisePoster exercise={exercise} loading="eager" />
        </div>
      ) : null}

      <video
        ref={videoRef}
        src={exercise.video}
        poster={exercise.poster}
        controls
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        className={className}
        onPlay={() => setShowPoster(false)}
      />
    </div>
  );
};
