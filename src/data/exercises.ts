export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  equipment: string;
  video?: string;
}

export const exercises: Exercise[] = [
  // Chest Exercises
  {
    id: '1',
    name: 'Push-ups',
    muscleGroup: 'Chest',
    difficulty: 'Beginner',
    duration: '3 sets x 10-15 reps',
    equipment: 'Bodyweight',
    video: '/src/assets/pushups-video.mp4'
  },
  {
    id: '2',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Barbell',
    video: '/src/assets/benchpress-video.mp4'
  },
  {
    id: '3',
    name: 'Dumbbell Flyes',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells'
  },

  // Back Exercises
  {
    id: '4',
    name: 'Pull-ups',
    muscleGroup: 'Back',
    difficulty: 'Advanced',
    duration: '3 sets x 5-10 reps',
    equipment: 'Pull-up Bar'
  },
  {
    id: '5',
    name: 'Bent-over Rows',
    muscleGroup: 'Back',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Barbell'
  },
  {
    id: '6',
    name: 'Lat Pulldowns',
    muscleGroup: 'Back',
    difficulty: 'Beginner',
    duration: '3 sets x 10-15 reps',
    equipment: 'Cable Machine'
  },

  // Legs Exercises
  {
    id: '7',
    name: 'Squats',
    muscleGroup: 'Legs',
    difficulty: 'Beginner',
    duration: '4 sets x 12-15 reps',
    equipment: 'Bodyweight'
  },
  {
    id: '8',
    name: 'Deadlifts',
    muscleGroup: 'Legs',
    difficulty: 'Advanced',
    duration: '4 sets x 5-8 reps',
    equipment: 'Barbell'
  },
  {
    id: '9',
    name: 'Lunges',
    muscleGroup: 'Legs',
    difficulty: 'Intermediate',
    duration: '3 sets x 12 reps each leg',
    equipment: 'Dumbbells'
  },

  // Arms Exercises
  {
    id: '10',
    name: 'Bicep Curls',
    muscleGroup: 'Arms',
    difficulty: 'Beginner',
    duration: '3 sets x 12-15 reps',
    equipment: 'Dumbbells'
  },
  {
    id: '11',
    name: 'Tricep Dips',
    muscleGroup: 'Arms',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Bench'
  },
  {
    id: '12',
    name: 'Hammer Curls',
    muscleGroup: 'Arms',
    difficulty: 'Beginner',
    duration: '3 sets x 12-15 reps',
    equipment: 'Dumbbells'
  },

  // Shoulders Exercises
  {
    id: '13',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Dumbbells'
  },
  {
    id: '14',
    name: 'Lateral Raises',
    muscleGroup: 'Shoulders',
    difficulty: 'Beginner',
    duration: '3 sets x 12-15 reps',
    equipment: 'Dumbbells'
  },
  {
    id: '15',
    name: 'Pike Push-ups',
    muscleGroup: 'Shoulders',
    difficulty: 'Intermediate',
    duration: '3 sets x 8-12 reps',
    equipment: 'Bodyweight'
  },

  // Core Exercises
  {
    id: '16',
    name: 'Plank',
    muscleGroup: 'Core',
    difficulty: 'Beginner',
    duration: '3 sets x 30-60 seconds',
    equipment: 'Bodyweight'
  },
  {
    id: '17',
    name: 'Russian Twists',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    duration: '3 sets x 20 reps',
    equipment: 'Medicine Ball'
  },
  {
    id: '18',
    name: 'Dead Bug',
    muscleGroup: 'Core',
    difficulty: 'Beginner',
    duration: '3 sets x 10 each side',
    equipment: 'Bodyweight'
  }
];