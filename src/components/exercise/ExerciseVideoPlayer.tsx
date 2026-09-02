import { useEffect, useRef, useState } from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center bg-muted p-4 text-center text-muted-foreground"
        role="img"
        aria-label="Video preview unavailable"
      >
        <PlayCircle className="mb-2 h-10 w-10 opacity-50" />
        <p className="text-xs font-medium">Video preview unavailable</p>
        <p className="mt-1 text-[11px] opacity-70">
          Check your connection or try a different exercise.
        </p>
      </div>
    );
  }

  useEffect(() => {
    setShowPoster(true);
  }, [exercise.poster, exercise.video]);

  useEffect(() => {
    const video = videoRef.current;

    if (video && autoPlay) {
       video.muted = muted;
       video.play().catch((err) => {
         console.warn("Autoplay was prevented by the browser:", err);
       });
    }

    return () => {
      if (!video) {
        return;
      }

      video.pause();
      video.currentTime = 0;
    };
  }, [exercise.video, autoPlay, muted]);

  if (!exercise.video) {
    return null;
  }

  const isYouTube = exercise.video.includes("youtube.com") || exercise.video.includes("youtu.be");

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v") || "";
    } else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1` : url;
  };

  return (
    <div className="relative h-full w-full bg-black">
      {showPoster ? (
        <div className="pointer-events-none absolute inset-0 z-10">
          <ExercisePoster exercise={exercise} loading="eager" />
        </div>
      ) : null}

      {isYouTube ? (
        <iframe
          src={getYouTubeEmbedUrl(exercise.video)}
          title={exercise.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={cn("absolute inset-0 w-full h-full", className)}
          onLoad={() => setShowPoster(false)}
          onError={() => setHasError(true)}
        />
      ) : (
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
          className={cn("absolute inset-0 w-full h-full object-cover", className)}
          onPlay={() => setShowPoster(false)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
};
