import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const bucketName = "exercise-media";

const exerciseMedia = [
  { title: "Push-ups", muscleGroup: "Chest", videoFile: "pushups-video.mp4" },
  { title: "Bicep Curls", muscleGroup: "Arms", videoFile: "bicep-curls-video.mp4" },
  { title: "Hammer Curls", muscleGroup: "Arms", videoFile: "hammer-curls-video.mp4" },
  { title: "Lateral Raises", muscleGroup: "Shoulders", videoFile: "lateral-raises-video.mp4" },
  { title: "Plank", muscleGroup: "Core", videoFile: "plank-video.mp4" },
  { title: "Dead Bug", muscleGroup: "Core", videoFile: "dead-bug-video.mp4" },
  { title: "Bench Press", muscleGroup: "Chest", videoFile: "benchpress-video.mp4" },
  { title: "Tricep Dips", muscleGroup: "Arms", videoFile: "tricep-dips-video.mp4" },
  { title: "Shoulder Press", muscleGroup: "Shoulders", videoFile: "shoulder-press-video.mp4" },
  { title: "Pike Push-ups", muscleGroup: "Shoulders", videoFile: "pike-pushups-video.mp4" },
  { title: "Russian Twists", muscleGroup: "Core", videoFile: "russian-twists-video.mp4" },
];

const posterGradients = {
  Chest: ["#fb7185", "#f97316"],
  Back: ["#38bdf8", "#06b6d4"],
  Legs: ["#34d399", "#a3e635"],
  Arms: ["#f59e0b", "#facc15"],
  Shoulders: ["#a78bfa", "#d946ef"],
  Core: ["#ef4444", "#ec4899"],
};

const parseEnvFile = async (fileName) => {
  try {
    const filePath = path.join(rootDir, fileName);
    const content = await fs.readFile(filePath, "utf8");
    const entries = {};

    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();

      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");
      entries[key] = value;
    }

    return entries;
  } catch {
    return {};
  }
};

const env = {
  ...(await parseEnvFile(".env")),
  ...(await parseEnvFile(".env.local")),
  ...process.env,
};

const supabaseUrl = env.VITE_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them before running the upload script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildPosterSvg = ({ title, muscleGroup }) => {
  const [start, end] = posterGradients[muscleGroup] ?? ["#1d4ed8", "#14b8a6"];
  const safeTitle = escapeXml(title);
  const safeGroup = escapeXml(muscleGroup);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="posterGradient" x1="80" y1="72" x2="1200" y2="648" gradientUnits="userSpaceOnUse">
      <stop stop-color="${start}" />
      <stop offset="1" stop-color="${end}" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" rx="36" fill="#0f172a" />
  <rect x="32" y="32" width="1216" height="656" rx="28" fill="url(#posterGradient)" fill-opacity="0.18" stroke="rgba(255,255,255,0.14)" />
  <rect x="72" y="88" width="204" height="48" rx="24" fill="rgba(15,23,42,0.55)" />
  <text x="174" y="119" fill="#E2E8F0" font-family="Arial, sans-serif" font-size="22" text-anchor="middle" letter-spacing="3">${safeGroup.toUpperCase()}</text>
  <text x="72" y="552" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="72" font-weight="700">${safeTitle}</text>
  <text x="72" y="608" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="28" letter-spacing="6">FITBOX EXERCISE DEMO</text>
  <circle cx="1110" cy="560" r="84" fill="rgba(15,23,42,0.55)" stroke="rgba(255,255,255,0.2)" stroke-width="4" />
  <path d="M1082 518V602L1152 560L1082 518Z" fill="#FFFFFF" />
</svg>`;
};

const ensureBucket = async () => {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  const existingBucket = buckets.find((bucket) => bucket.name === bucketName);

  if (existingBucket) {
    await supabase.storage.updateBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800,
      allowedMimeTypes: ["video/mp4", "image/svg+xml"],
    });
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: 52428800,
    allowedMimeTypes: ["video/mp4", "image/svg+xml"],
  });

  if (createError) {
    throw createError;
  }
};

const uploadAsset = async (filePath, destinationPath, contentType) => {
  const file = await fs.readFile(filePath);
  const { error } = await supabase.storage.from(bucketName).upload(destinationPath, file, {
    upsert: true,
    contentType,
    cacheControl: "31536000",
  });

  if (error) {
    throw error;
  }
};

const uploadPoster = async (exercise) => {
  const posterSvg = buildPosterSvg(exercise);
  const posterFile = exercise.videoFile.replace(/\.mp4$/, ".svg");
  const { error } = await supabase.storage.from(bucketName).upload(`posters/${posterFile}`, Buffer.from(posterSvg, "utf8"), {
    upsert: true,
    contentType: "image/svg+xml",
    cacheControl: "31536000",
  });

  if (error) {
    throw error;
  }
};

try {
  await ensureBucket();

  for (const exercise of exerciseMedia) {
    const localVideoPath = path.join(rootDir, "src", "assets", exercise.videoFile);

    await uploadAsset(localVideoPath, `videos/${exercise.videoFile}`, "video/mp4");
    await uploadPoster(exercise);

    console.log(`Uploaded ${exercise.videoFile}`);
  }

  console.log(`Exercise media uploaded to bucket "${bucketName}".`);
} catch (error) {
  console.error("Exercise media upload failed:");
  console.error(error);
  process.exit(1);
}
