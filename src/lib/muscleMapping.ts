/**
 * Centralized muscle mapping configuration
 * Maps diagram muscle IDs to exercise muscle groups
 */

export interface MuscleMapping {
  diagramId: string; // ID used in the diagram (e.g., "chest", "biceps")
  exerciseGroup: string; // Muscle group in exercises data (e.g., "Chest", "Arms")
  displayName: string; // Human-readable name
}

/**
 * Maps diagram muscle IDs to exercise muscle groups
 * This ensures consistent linking between body diagram clicks and exercise content
 */
export const MUSCLE_MAPPINGS: Record<string, MuscleMapping> = {
  // Front view muscles
  chest: {
    diagramId: "chest",
    exerciseGroup: "Chest",
    displayName: "Chest",
  },
  shoulders: {
    diagramId: "shoulders",
    exerciseGroup: "Shoulders",
    displayName: "Shoulders",
  },
  biceps: {
    diagramId: "biceps",
    exerciseGroup: "Arms",
    displayName: "Biceps",
  },
  abs: {
    diagramId: "abs",
    exerciseGroup: "Core",
    displayName: "Abs",
  },
  quadriceps: {
    diagramId: "quadriceps",
    exerciseGroup: "Legs",
    displayName: "Quadriceps",
  },
  quads: {
    diagramId: "quads",
    exerciseGroup: "Legs",
    displayName: "Quadriceps",
  },
  calves: {
    diagramId: "calves",
    exerciseGroup: "Legs",
    displayName: "Calves",
  },

  // Back view muscles
  back: {
    diagramId: "back",
    exerciseGroup: "Back",
    displayName: "Back",
  },
  legs: {
    diagramId: "legs",
    exerciseGroup: "Legs",
    displayName: "Legs",
  },

  // Detailed muscle groups (from MuscleMapSVG)
  traps: {
    diagramId: "traps",
    exerciseGroup: "Back",
    displayName: "Trapezius",
  },
  lats: {
    diagramId: "lats",
    exerciseGroup: "Back",
    displayName: "Lats",
  },
  triceps: {
    diagramId: "triceps",
    exerciseGroup: "Arms",
    displayName: "Triceps",
  },
  forearms: {
    diagramId: "forearms",
    exerciseGroup: "Arms",
    displayName: "Forearms",
  },
  obliques: {
    diagramId: "obliques",
    exerciseGroup: "Core",
    displayName: "Obliques",
  },
  lower_back: {
    diagramId: "lower_back",
    exerciseGroup: "Back",
    displayName: "Lower Back",
  },
  glutes: {
    diagramId: "glutes",
    exerciseGroup: "Legs",
    displayName: "Glutes",
  },
  hamstrings: {
    diagramId: "hamstrings",
    exerciseGroup: "Legs",
    displayName: "Hamstrings",
  },
  // Additional mappings for InteractiveBodyDiagram
  neck: {
    diagramId: "neck",
    exerciseGroup: "Shoulders",
    displayName: "Neck",
  },
  adductors: {
    diagramId: "adductors",
    exerciseGroup: "Legs",
    displayName: "Adductors",
  },
  rear_delts: {
    diagramId: "rear_delts",
    exerciseGroup: "Shoulders",
    displayName: "Rear Deltoids",
  },
  rhomboids: {
    diagramId: "rhomboids",
    exerciseGroup: "Back",
    displayName: "Rhomboids",
  },
  calves_front: {
    diagramId: "calves_front",
    exerciseGroup: "Legs",
    displayName: "Tibialis Anterior",
  },
  calves_back: {
    diagramId: "calves_back",
    exerciseGroup: "Legs",
    displayName: "Calves",
  },
};

/**
 * Get exercise group from diagram muscle ID
 * @param diagramId - The muscle ID from the diagram
 * @returns The corresponding exercise muscle group, or null if not found
 */
export function getExerciseGroupFromDiagramId(diagramId: string): string | null {
  const mapping = MUSCLE_MAPPINGS[diagramId.toLowerCase()];
  return mapping ? mapping.exerciseGroup : null;
}

/**
 * Get display name from diagram muscle ID
 * @param diagramId - The muscle ID from the diagram
 * @returns The display name, or the original ID if not found
 */
export function getDisplayNameFromDiagramId(diagramId: string): string {
  const mapping = MUSCLE_MAPPINGS[diagramId.toLowerCase()];
  return mapping ? mapping.displayName : diagramId;
}

/**
 * Get route path for a muscle group
 * @param diagramId - The muscle ID from the diagram
 * @returns The route path (e.g., "/exercises/chest")
 */
export function getMuscleRoute(diagramId: string): string {
  const normalizedId = diagramId.toLowerCase();
  return `/exercises/${normalizedId}`;
}

/**
 * Check if a muscle ID has associated exercises
 * @param diagramId - The muscle ID from the diagram
 * @returns True if the muscle has exercises, false otherwise
 */
export function hasExercises(diagramId: string): boolean {
  return getExerciseGroupFromDiagramId(diagramId) !== null;
}
