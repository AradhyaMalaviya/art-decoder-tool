import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ActiveWorkout } from '@/contexts/WorkoutContext';

interface SaveWorkoutResult {
  sessionId: string;
  exerciseCount: number;
  setCount: number;
}

export const useWorkoutSave = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (workout: ActiveWorkout): Promise<SaveWorkoutResult> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the user's profile ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (profileError || !profile) {
        throw new Error('Could not find user profile');
      }

      // 1. Create the workout session
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: profile.id,
          name: workout.name,
          started_at: workout.startedAt.toISOString(),
          ended_at: new Date().toISOString(),
          status: 'completed',
        })
        .select('id')
        .single();

      if (sessionError || !session) {
        throw new Error(`Failed to create workout session: ${sessionError?.message}`);
      }

      // 2. Create workout logs for each exercise
      const logsToInsert = workout.exercises.map((exercise, index) => ({
        session_id: session.id,
        exercise_name: exercise.exerciseName,
        exercise_id: exercise.exerciseId || null,
        order_index: index,
      }));

      const { data: logs, error: logsError } = await supabase
        .from('workout_logs')
        .insert(logsToInsert)
        .select('id, order_index');

      if (logsError || !logs) {
        throw new Error(`Failed to create workout logs: ${logsError?.message}`);
      }

      // Map order_index to log_id
      const logIdMap = new Map(logs.map(log => [log.order_index, log.id]));

      // 3. Create workout sets for each log
      const setsToInsert = workout.exercises.flatMap((exercise, exerciseIndex) => {
        const logId = logIdMap.get(exerciseIndex);
        if (!logId) return [];
        
        return exercise.sets
          .filter(set => set.completed)
          .map(set => ({
            log_id: logId,
            set_number: set.setNumber,
            weight: set.weight,
            reps: set.reps,
            completed: true,
          }));
      });

      if (setsToInsert.length > 0) {
        const { error: setsError } = await supabase
          .from('workout_sets')
          .insert(setsToInsert);

        if (setsError) {
          throw new Error(`Failed to create workout sets: ${setsError.message}`);
        }
      }

      return {
        sessionId: session.id,
        exerciseCount: workout.exercises.length,
        setCount: setsToInsert.length,
      };
    },
  });
};
