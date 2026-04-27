-- Enable Realtime for matches and session logs to support notifications
alter publication supabase_realtime add table gymbuddy_matches;
alter publication supabase_realtime add table gymbuddy_session_logs;
