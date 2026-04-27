import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GymBuddyMessage, GymBuddyMatch, GymBuddyProfile } from '@/lib/gymBuddyTypes';

export function useGymBuddyChat(matchId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GymBuddyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<GymBuddyProfile | null>(null);
  const [matchDetails, setMatchDetails] = useState<GymBuddyMatch | null>(null);

  const markMessagesAsRead = useCallback(async (messageIds: string[]) => {
    if (messageIds.length === 0) return;
    try {
      await supabase
        .from('gymbuddy_messages')
        .update({ is_read: true })
        .in('id', messageIds);
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  }, []);

  const fetchChatData = useCallback(async () => {
    if (!user || !matchId) return;

    setLoading(true);
    try {
      // 1. Fetch match and partner info
      const { data: matchData, error: matchError } = await supabase
        .from('gymbuddy_matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (matchError) throw matchError;
      setMatchDetails(matchData);

      const partnerId = matchData.user1_id === user.id ? matchData.user2_id : matchData.user1_id;
      
      const { data: partnerData, error: partnerError } = await supabase
        .from('gymbuddy_profiles')
        .select('*')
        .eq('id', partnerId)
        .single();
        
      if (partnerError) throw partnerError;
      setPartner(partnerData);

      // 2. Fetch messages
      const { data: messagesData, error: msgError } = await supabase
        .from('gymbuddy_messages')
        .select('*')
        .eq('match_id', matchId)
        .order('sent_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages(messagesData as GymBuddyMessage[]);

      // 3. Mark unread messages from partner as read
      const unreadFromPartner = messagesData
        .filter(m => m.sender_id !== user.id && !m.is_read)
        .map(m => m.id);

      if (unreadFromPartner.length > 0) {
        await markMessagesAsRead(unreadFromPartner);
        // Optimistically update local state
        setMessages(prev => prev.map(m => 
          unreadFromPartner.includes(m.id) ? { ...m, is_read: true } : m
        ));
      }

    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, matchId, markMessagesAsRead]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  // Realtime subscription
  useEffect(() => {
    if (!matchId || !user) return;

    const channel = supabase
      .channel(`gymbuddy_chat_${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'gymbuddy_messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          const newMsg = payload.new as GymBuddyMessage;
          setMessages(prev => {
            // Avoid duplicates in case of optimistic UI updates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          // If message is from partner, mark it as read immediately
          if (newMsg.sender_id !== user.id && !newMsg.is_read) {
            markMessagesAsRead([newMsg.id]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'gymbuddy_messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          const updatedMsg = payload.new as GymBuddyMessage;
          setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user, markMessagesAsRead]);

  const sendMessage = async (content: string) => {
    if (!user || !matchId || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('gymbuddy_messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;
      // We don't need to manually update state here because the realtime subscription 
      // will catch the INSERT event, but we can do it optimistically if we want.
      // Leaving it to realtime is safer to prevent duplicates.
      return data;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return {
    messages,
    loading,
    partner,
    matchDetails,
    sendMessage
  };
}
