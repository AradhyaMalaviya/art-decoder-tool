import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, format, parseISO } from 'date-fns';

export function useGymBuddyStreak(matchId: string) {
  const { user, authUserId } = useAuth();
  const activeAuthUserId = authUserId || user?.authUserId || user?.id;

  const [streak, setStreak] = useState(0);
  const [hasLoggedThisWeek, setHasLoggedThisWeek] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!matchId) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('gymbuddy_session_logs')
      .select('session_date')
      .eq('match_id', matchId)
      .order('session_date', { ascending: false });

    if (data && !error) {
      const today = new Date();
      let currentStreak = 0;
      let loggedThisWeek = false;

      if (data.length > 0) {
        const weeks = new Set(data.map(log => 
          format(startOfWeek(parseISO(log.session_date), { weekStartsOn: 1 }), 'yyyy-MM-dd')
        ));
        
        const thisWeekStr = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const lastWeekStr = format(startOfWeek(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 }), 'yyyy-MM-dd');
        
        loggedThisWeek = weeks.has(thisWeekStr);
        
        if (!loggedThisWeek && !weeks.has(lastWeekStr)) {
          currentStreak = 0;
        } else {
          let checkDate = loggedThisWeek ? today : new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          while (true) {
            const weekStr = format(startOfWeek(checkDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
            if (weeks.has(weekStr)) {
              currentStreak++;
              checkDate = new Date(checkDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else {
              break;
            }
          }
        }
      }
      
      setStreak(currentStreak);
      setHasLoggedThisWeek(loggedThisWeek);
    }
    setLoading(false);
  }, [matchId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const logSession = async (sessionDate: Date, notes: string) => {
    if (!activeAuthUserId || !matchId) return;
    
    const dateStr = format(sessionDate, 'yyyy-MM-dd');
    
    const { error: insertError } = await supabase
      .from('gymbuddy_session_logs')
      .insert({
        match_id: matchId,
        logged_by: activeAuthUserId,
        session_date: dateStr,
        notes: notes || null
      });
      
    if (insertError) throw insertError;
    
    const { error: updateError } = await supabase
      .from('gymbuddy_matches')
      .update({ 
        last_session_logged: new Date().toISOString(),
      })
      .eq('id', matchId);
      
    if (updateError) throw updateError;
      
    await fetchLogs();
  };

  return { streak, hasLoggedThisWeek, loading, logSession, refreshStreak: fetchLogs };
}
