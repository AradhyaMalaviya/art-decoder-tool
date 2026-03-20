import { supabaseUrl } from "@/lib/env";

const EXERCISE_MEDIA_BUCKET = "exercise-media";
const EXERCISE_MEDIA_BASE_URL = `${supabaseUrl}/storage/v1/object/public/${EXERCISE_MEDIA_BUCKET}`;

export const buildExerciseMediaUrl = (directory: "videos" | "posters", filename: string) =>
  `${EXERCISE_MEDIA_BASE_URL}/${directory}/${filename}`;
