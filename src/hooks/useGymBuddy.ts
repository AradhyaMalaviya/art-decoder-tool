import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GymBuddyProfile, GymBuddyCandidate } from '@/lib/gymBuddyTypes';
import { calculateCompatibilityScore } from '@/lib/compatibilityScore';

export function useGymBuddy() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GymBuddyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gymbuddy_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data as GymBuddyProfile | null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (updates: Partial<GymBuddyProfile>) => {
    if (!user) throw new Error('No user found');
    try {
      const { data, error } = await supabase
        .from('gymbuddy_profiles')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert({ id: user.id, ...updates } as any)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as GymBuddyProfile);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      if (msg === 'Failed to fetch') {
         throw new Error("Network Error: Cannot connect to Supabase. Your project might be paused or blocked by Brave Shields.");
      }
      throw err;
    }
  };

  const getCandidates = async (): Promise<GymBuddyCandidate[]> => {
    if (!user || !profile) return [];
    
    try {
      // 1. Get IDs of users we've already swiped on
      const { data: swipes } = await supabase
        .from('gymbuddy_swipes')
        .select('target_id')
        .eq('swiper_id', user.id);
        
      const swipedIds = swipes?.map(s => s.target_id) || [];
      
      // 2. Fetch profiles of discoverable users, excluding self and already swiped
      // Since supabase doesn't support 'not in' with empty arrays, we handle it conditionally
      let query = supabase
        .from('gymbuddy_profiles')
        .select('*')
        .eq('is_discoverable', true)
        .neq('id', user.id);
        
      if (swipedIds.length > 0) {
        // PostgREST expects parenthesized, comma-separated values for the `not.in` filter
        query = query.not('id', 'in', `(${swipedIds.join(',')})`);
      }

      const { data: candidates, error } = await query;

      if (error) throw error;

      // Client-side fallback filter in case DB filter didn't work as expected
      const filteredCandidates = (candidates as GymBuddyProfile[]).filter(
        c => !swipedIds.includes(c.id)
      );

      // 3. Calculate compatibility scores
      const scoredCandidates = filteredCandidates.map(candidate => {
        const { score, compatibilityLabel } = calculateCompatibilityScore(profile, candidate);
        return {
          ...candidate,
          compatibility_score: score,
          compatibility_label: compatibilityLabel
        };
      });

      // 4. Sort by score descending
      scoredCandidates.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));

      return scoredCandidates;
    } catch (err: unknown) {
      console.error('Error fetching candidates:', err);
      return [];
    }
  };

  const swipe = async (targetId: string, direction: 'right' | 'left'): Promise<{ match: boolean }> => {
    if (!user) throw new Error('No user found');
    
    try {
      // 1. Record the swipe
      const { error: swipeError } = await supabase
        .from('gymbuddy_swipes')
        .insert({
          swiper_id: user.id,
          target_id: targetId,
          direction
        });

      if (swipeError) throw swipeError;

      // 2. Check for match if swiped right
      if (direction === 'right') {
        const { data: mutualSwipe } = await supabase
          .from('gymbuddy_swipes')
          .select('*')
          .eq('swiper_id', targetId)
          .eq('target_id', user.id)
          .eq('direction', 'right')
          .maybeSingle();

        if (mutualSwipe) {
          // It's a match!
          const user1_id = user.id < targetId ? user.id : targetId;
          const user2_id = user.id < targetId ? targetId : user.id;

          const { error: matchError } = await supabase
            .from('gymbuddy_matches')
            .insert({
              user1_id,
              user2_id,
              shared_streak: 0
            });

          if (matchError && matchError.code !== '23505') { // Ignore unique violation if it already exists
            throw matchError;
          }
          
          return { match: true };
        }
      }

      return { match: false };
    } catch (err: unknown) {
      console.error('Error swiping:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'Failed to fetch') {
         throw new Error("Network Error: Cannot connect to Supabase.");
      }
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile,
    getCandidates,
    swipe,
    refreshProfile: fetchProfile
  };
}
