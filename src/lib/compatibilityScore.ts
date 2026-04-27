import { GymBuddyProfile } from './gymBuddyTypes';

export function calculateCompatibilityScore(
  currentUser: GymBuddyProfile,
  candidate: GymBuddyProfile
): { score: number; compatibilityLabel: string } {
  let score = 0;

  // 1. Fitness goals overlap (30 pts)
  // Points = (shared goals / total unique goals) × 30
  const userGoals = new Set(currentUser.fitness_goals);
  const candidateGoals = new Set(candidate.fitness_goals);
  const allGoals = new Set([...userGoals, ...candidateGoals]);
  const sharedGoals = [...userGoals].filter(goal => candidateGoals.has(goal));
  
  if (allGoals.size > 0) {
    score += (sharedGoals.length / allGoals.size) * 30;
  }

  // 2. Experience level match (20 pts)
  // Same = 20, adjacent = 10, far = 0
  const expLevels = ['beginner', 'intermediate', 'advanced'];
  const userExpIdx = expLevels.indexOf(currentUser.experience_level);
  const candidateExpIdx = expLevels.indexOf(candidate.experience_level);
  
  const expDiff = Math.abs(userExpIdx - candidateExpIdx);
  if (expDiff === 0) {
    score += 20; // Same
  } else if (expDiff === 1) {
    score += 10; // Adjacent
  } // expDiff === 2 (far) gives 0 points

  // 3. Workout split compatibility (20 pts)
  // Same = 20; Full Body matches with anything = 15; otherwise 0
  if (currentUser.workout_split === candidate.workout_split) {
    score += 20;
  } else if (
    currentUser.workout_split === 'full_body' || 
    candidate.workout_split === 'full_body'
  ) {
    score += 15;
  }

  // 4. Timing overlap (20 pts)
  // Points = (shared timings / total unique timings) × 20; 'flexible' counts as matching all timings
  const userTimings = currentUser.preferred_timings || [];
  const candidateTimings = candidate.preferred_timings || [];
  
  if (userTimings.includes('flexible') || candidateTimings.includes('flexible')) {
    score += 20; // If either is flexible, they have 100% overlap
  } else {
    const uTimings = new Set(userTimings);
    const cTimings = new Set(candidateTimings);
    const allTimings = new Set([...uTimings, ...cTimings]);
    const sharedTimings = [...uTimings].filter(timing => cTimings.has(timing));
    
    if (allTimings.size > 0) {
      score += (sharedTimings.length / allTimings.size) * 20;
    }
  }

  // 5. Gym/location proximity (10 pts)
  // Exact match = 10, same city keyword = 5, otherwise 0
  const uLocation = (currentUser.gym_location || '').toLowerCase().trim();
  const cLocation = (candidate.gym_location || '').toLowerCase().trim();

  if (uLocation && cLocation && uLocation === cLocation) {
    score += 10;
  } else if (uLocation && cLocation) {
    // Check for shared keywords (length > 3)
    const uWords = uLocation.split(/[\s,]+/).filter(w => w.length > 3);
    const cWords = new Set(cLocation.split(/[\s,]+/).filter(w => w.length > 3));
    const hasSharedKeyword = uWords.some(word => cWords.has(word));
    if (hasSharedKeyword) {
      score += 5;
    }
  }

  // Round score to nearest integer
  const finalScore = Math.round(score);

  // Label assignment
  let compatibilityLabel = "Potential Match 🤝"; // 0-39
  if (finalScore >= 80) {
    compatibilityLabel = "Perfect Match 🔥";
  } else if (finalScore >= 60) {
    compatibilityLabel = "Strong Match 💪";
  } else if (finalScore >= 40) {
    compatibilityLabel = "Good Fit ✅";
  }

  return { score: finalScore, compatibilityLabel };
}
