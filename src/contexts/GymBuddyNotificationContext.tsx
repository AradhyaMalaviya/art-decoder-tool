import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GymBuddyMatch, GymBuddyProfile } from '@/lib/gymBuddyTypes';

export const GymBuddyNotificationContext = createContext({});

export function GymBuddyNotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [matches, setMatches] = useState<GymBuddyMatch[]>([]);
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, GymBuddyProfile>>({});

  const fetchPartnerProfile = async (partnerId: string): Promise<GymBuddyProfile | null> => {
    const { data } = await supabase
      .from('gymbuddy_profiles')
      .select('*')
      .eq('id', partnerId)
      .single();
    return data as GymBuddyProfile | null;
  };

  // Initial load
  useEffect(() => {
    if (!user) return;
    
    const loadInitialData = async () => {
      const { data: matchData } = await supabase
        .from('gymbuddy_matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
        
      if (matchData && matchData.length > 0) {
        setMatches(matchData);
        
        const pIds = matchData.map(m => m.user1_id === user.id ? m.user2_id : m.user1_id);
        const { data: profiles } = await supabase
          .from('gymbuddy_profiles')
          .select('*')
          .in('id', pIds);
          
        if (profiles) {
          const pMap: Record<string, GymBuddyProfile> = {};
          profiles.forEach(p => { pMap[p.id] = p as unknown as GymBuddyProfile; });
          setPartnerProfiles(pMap);
        }
      }
    };
    
    loadInitialData();
  }, [user]);

  // Match listeners
  useEffect(() => {
    if (!user) return;

    const handleNewMatch = async (payload: Record<string, unknown>) => {
      const newMatch = payload.new as GymBuddyMatch;
      
      // Avoid duplicates if we already have it
      setMatches(prev => {
        if (prev.some(m => m.id === newMatch.id)) return prev;
        return [...prev, newMatch];
      });

      const partnerId = newMatch.user1_id === user.id ? newMatch.user2_id : newMatch.user1_id;
      const partner = await fetchPartnerProfile(partnerId);
      
      if (partner) {
        setPartnerProfiles(prev => ({ ...prev, [partnerId]: partner }));
        toast({
          title: "🎉 You matched!",
          description: `You matched with ${partner.display_name}!`,
          action: (
            <button onClick={() => navigate(`/gymbuddy/chat/${newMatch.id}`)} className="text-sm underline font-medium">
              Say Hi
            </button>
          )
        });
      }
    };

    const matchChannel1 = supabase.channel('matches_user1')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gymbuddy_matches', filter: `user1_id=eq.${user.id}` }, handleNewMatch)
      .subscribe();
      
    const matchChannel2 = supabase.channel('matches_user2')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gymbuddy_matches', filter: `user2_id=eq.${user.id}` }, handleNewMatch)
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel1);
      supabase.removeChannel(matchChannel2);
    };
  }, [user, navigate, toast]);

  // Messages and Logs listeners (dependent on matches)
  useEffect(() => {
    if (!user || matches.length === 0) return;

    const matchIds = matches.map(m => m.id);
    // Realtime filter string for 'in'
    const filterStr = `match_id=in.(${matchIds.join(',')})`;

    const channel = supabase.channel('gymbuddy_activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gymbuddy_messages', filter: filterStr }, (payload) => {
        const msg = payload.new;
        if (msg.sender_id !== user.id) {
          // If we are currently in this chat, don't show toast
          if (location.pathname === `/gymbuddy/chat/${msg.match_id}`) return;
          
          const match = matches.find(m => m.id === msg.match_id);
          if (match) {
            const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            const partnerName = partnerProfiles[partnerId]?.display_name || 'A partner';
            
            toast({
              title: `💬 New message from ${partnerName}`,
              description: msg.content.length > 30 ? msg.content.substring(0, 30) + '...' : msg.content,
              action: (
                <button onClick={() => navigate(`/gymbuddy/chat/${match.id}`)} className="text-sm underline font-medium">
                  Reply
                </button>
              )
            });
          }
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gymbuddy_session_logs', filter: filterStr }, (payload) => {
        const log = payload.new;
        if (log.logged_by !== user.id) {
          const match = matches.find(m => m.id === log.match_id);
          if (match) {
            const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            const partnerName = partnerProfiles[partnerId]?.display_name || 'A partner';
            
            toast({
              title: "🏋️ Session Logged!",
              description: `${partnerName} logged a session. Confirm yours to keep the streak going!`,
              action: (
                <button onClick={() => navigate(`/gymbuddy/matches`)} className="text-sm underline font-medium">
                  View
                </button>
              )
            });
          }
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'gymbuddy_matches', filter: `id=in.(${matchIds.join(',')})` }, (payload) => {
         // Streak milestone check
         const oldMatch = payload.old as GymBuddyMatch;
         const newMatch = payload.new as GymBuddyMatch;
         
         // In a real app we'd compare the derived streak, but since we update last_session_logged 
         // we might just catch it here if we also explicitly track streak changes.
         // Alternatively, we skip real-time milestone toasts and show them when loading the match.
         // But the requirements asked for: "A streak milestone is hit ("🔥 You and [Name] hit a 4-week streak!")"
         // If we added a shared_streak column update, we can detect it.
         // For now, if the shared_streak increments to a milestone:
         if (newMatch.shared_streak > (oldMatch.shared_streak || 0)) {
           const s = newMatch.shared_streak;
           if (s === 4 || s === 12 || s === 26) {
             const partnerId = newMatch.user1_id === user.id ? newMatch.user2_id : newMatch.user1_id;
             const partnerName = partnerProfiles[partnerId]?.display_name || 'your partner';
             toast({
               title: "🔥 Streak Milestone!",
               description: `You and ${partnerName} hit a ${s}-week streak! Keep it up!`,
             });
           }
         }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, matches, partnerProfiles, location.pathname, navigate, toast]);

  return (
    <GymBuddyNotificationContext.Provider value={{}}>
      {children}
    </GymBuddyNotificationContext.Provider>
  );
}
