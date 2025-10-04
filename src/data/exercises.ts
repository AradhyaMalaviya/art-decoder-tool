export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  equipment: string;
  video?: string;
  description?: string;
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
    video: '/src/assets/pushups-video.mp4',
    description: 'A fundamental bodyweight exercise for chest development'
  },
  {
    id: '2',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Barbell',
    video: '/src/assets/benchpress-video.mp4',
    description: 'The classic chest-building exercise'
  },
  {
    id: '3',
    name: 'Dumbbell Flyes',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells',
    description: 'An isolation movement to stretch and work the chest muscles'
  },
  {
    id: '19',
    name: 'Cable Chest Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Cable Machine',
    description: 'A versatile exercise that can be done at various angles to target different parts of the chest'
  },
  {
    id: '20',
    name: 'Cable Pec Fly',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 12-15 reps',
    equipment: 'Cable Machine',
    description: 'An isolation exercise that\'s great for feeling the chest muscles contract'
  },
  {
    id: '21',
    name: 'Cable Decline Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Cable Machine',
    description: 'This variation targets the lower chest muscles'
  },
  {
    id: '22',
    name: 'Cable Decline Bench Chest Fly',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 12-15 reps',
    equipment: 'Cable Machine',
    description: 'Similar to the decline press, but with a flying motion to isolate the pecs'
  },
  {
    id: '23',
    name: 'Cable Crossover',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 12-15 reps',
    equipment: 'Cable Machine',
    description: 'A classic exercise for a good chest stretch and contraction'
  },
  {
    id: '24',
    name: 'Standing Low to High Cable Fly',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 12-15 reps',
    equipment: 'Cable Machine',
    description: 'This targets the upper chest'
  },
  {
    id: '25',
    name: 'Standing High to Low Cable Fly',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 12-15 reps',
    equipment: 'Cable Machine',
    description: 'This variation focuses on the lower chest'
  },
  {
    id: '26',
    name: 'Dumbbell Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Dumbbells',
    description: 'A fundamental compound exercise for the chest'
  },
  {
    id: '27',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Dumbbells',
    description: 'This version of the bench press emphasizes the upper chest'
  },
  {
    id: '28',
    name: 'Decline Dumbbell Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Dumbbells',
    description: 'This targets the lower part of the chest'
  },
  {
    id: '29',
    name: 'Incline Dumbbell Flys',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells',
    description: 'The incline variation puts more focus on the upper pecs'
  },
  {
    id: '30',
    name: 'Dumbbell Pullover',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells',
    description: 'An exercise that works both the chest and the lats'
  },
  {
    id: '31',
    name: 'Close Grip Dumbbell Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells',
    description: 'This variation places more emphasis on the inner chest'
  },
  {
    id: '32',
    name: 'Neutral Grip Dumbbell Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Dumbbells',
    description: 'By keeping your palms facing each other, you can reduce shoulder strain and target the chest differently'
  },
  {
    id: '33',
    name: 'Reverse Grip Dumbbell Squeeze Press',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 8-10 reps',
    equipment: 'Dumbbells',
    description: 'An interesting variation to challenge your muscles in a new way'
  },
  {
    id: '34',
    name: 'Dumbbell Twist Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Dumbbells',
    description: 'This adds a rotational component to the standard press'
  },
  {
    id: '35',
    name: 'Incline Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Barbell',
    description: 'To target the upper chest'
  },
  {
    id: '36',
    name: 'Decline Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Barbell',
    description: 'To focus on the lower chest'
  },
  {
    id: '37',
    name: 'Guillotine Press',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 8-10 reps',
    equipment: 'Barbell',
    description: 'A variation where you lower the bar to your neck, creating a greater stretch in the pecs'
  },
  {
    id: '38',
    name: 'Incline Push-Up',
    muscleGroup: 'Chest',
    difficulty: 'Beginner',
    duration: '3 sets x 12-15 reps',
    equipment: 'Bodyweight',
    description: 'An easier variation of push-ups'
  },
  {
    id: '39',
    name: 'Decline Push-Up',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Bodyweight',
    description: 'A more challenging variation that targets the upper chest'
  },
  {
    id: '40',
    name: 'Clap Press-Up',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 8-10 reps',
    equipment: 'Bodyweight',
    description: 'An explosive variation for power development'
  },
  {
    id: '41',
    name: 'Spiderman Press-Up',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 10-12 reps',
    equipment: 'Bodyweight',
    description: 'Adds a core and hip flexor challenge'
  },
  {
    id: '42',
    name: 'Stair Press-Up',
    muscleGroup: 'Chest',
    difficulty: 'Beginner',
    duration: '3 sets x 12-15 reps',
    equipment: 'Bodyweight',
    description: 'A convenient way to do incline or decline push-ups'
  },
  {
    id: '43',
    name: 'Dips',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 8-12 reps',
    equipment: 'Dip Bar',
    description: 'A great compound exercise for the chest and triceps'
  },
  {
    id: '44',
    name: 'Smith Machine Incline Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Smith Machine',
    description: 'Provides a fixed path for the barbell, which can be helpful for beginners or when training without a spotter'
  },
  {
    id: '45',
    name: 'Hammer Strength Machine Incline Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '4 sets x 8-12 reps',
    equipment: 'Machine',
    description: 'A machine that mimics the incline bench press motion'
  },
  {
    id: '46',
    name: 'Medicine Ball Chest Press Partner Toss',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    duration: '3 sets x 10-12 reps',
    equipment: 'Medicine Ball',
    description: 'A dynamic and explosive exercise'
  },
  {
    id: '47',
    name: 'Bosu Ball Push Up',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 8-10 reps',
    equipment: 'Bosu Ball',
    description: 'Adds an element of instability to challenge your core and stabilizer muscles'
  },
  {
    id: '48',
    name: 'Push Up (Feet on Swiss Ball)',
    muscleGroup: 'Chest',
    difficulty: 'Advanced',
    duration: '3 sets x 8-10 reps',
    equipment: 'Swiss Ball',
    description: 'Another way to add instability and increase the difficulty of the push-up'
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