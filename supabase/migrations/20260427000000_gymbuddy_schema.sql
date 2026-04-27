-- Create GymBuddy Profiles Table
CREATE TABLE gymbuddy_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT CHECK (char_length(bio) <= 150),
  fitness_goals TEXT[] NOT NULL,
  workout_split TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  preferred_timings TEXT[] NOT NULL,
  gym_location TEXT NOT NULL,
  gender TEXT,
  age_range_min INT NOT NULL,
  age_range_max INT NOT NULL,
  is_discoverable BOOLEAN DEFAULT false,
  profile_visibility TEXT DEFAULT 'public',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create GymBuddy Swipes Table
CREATE TABLE gymbuddy_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('right', 'left')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, target_id)
);

-- Create GymBuddy Matches Table
CREATE TABLE gymbuddy_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  shared_streak INT DEFAULT 0,
  last_session_logged TIMESTAMPTZ,
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Create GymBuddy Messages Table
CREATE TABLE gymbuddy_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES gymbuddy_matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Create GymBuddy Session Logs Table
CREATE TABLE gymbuddy_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES gymbuddy_matches(id) ON DELETE CASCADE,
  logged_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gymbuddy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gymbuddy_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gymbuddy_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gymbuddy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gymbuddy_session_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read their own profile"
  ON gymbuddy_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Discoverable users can read public profiles"
  ON gymbuddy_profiles FOR SELECT
  USING (
    profile_visibility = 'public' 
    AND EXISTS (
      SELECT 1 FROM gymbuddy_profiles AS gp 
      WHERE gp.id = auth.uid() AND gp.is_discoverable = true
    )
  );

CREATE POLICY "Users can insert their own profile"
  ON gymbuddy_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON gymbuddy_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON gymbuddy_profiles FOR DELETE
  USING (auth.uid() = id);

-- Swipes Policies
CREATE POLICY "Users can read their own swipes"
  ON gymbuddy_swipes FOR SELECT
  USING (auth.uid() = swiper_id);

CREATE POLICY "Users can insert their own swipes"
  ON gymbuddy_swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Matches Policies
CREATE POLICY "Users can read their own matches"
  ON gymbuddy_matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can insert matches they are part of"
  ON gymbuddy_matches FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update matches they are part of"
  ON gymbuddy_matches FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages Policies
CREATE POLICY "Users can read messages in their matches"
  ON gymbuddy_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gymbuddy_matches 
      WHERE gymbuddy_matches.id = gymbuddy_messages.match_id 
      AND (gymbuddy_matches.user1_id = auth.uid() OR gymbuddy_matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their matches"
  ON gymbuddy_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM gymbuddy_matches 
      WHERE gymbuddy_matches.id = gymbuddy_messages.match_id 
      AND (gymbuddy_matches.user1_id = auth.uid() OR gymbuddy_matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update message read status in their matches"
  ON gymbuddy_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM gymbuddy_matches 
      WHERE gymbuddy_matches.id = gymbuddy_messages.match_id 
      AND (gymbuddy_matches.user1_id = auth.uid() OR gymbuddy_matches.user2_id = auth.uid())
    )
  );

-- Session Logs Policies
CREATE POLICY "Users can read session logs for their matches"
  ON gymbuddy_session_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gymbuddy_matches 
      WHERE gymbuddy_matches.id = gymbuddy_session_logs.match_id 
      AND (gymbuddy_matches.user1_id = auth.uid() OR gymbuddy_matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert session logs for their matches"
  ON gymbuddy_session_logs FOR INSERT
  WITH CHECK (
    auth.uid() = logged_by AND
    EXISTS (
      SELECT 1 FROM gymbuddy_matches 
      WHERE gymbuddy_matches.id = gymbuddy_session_logs.match_id 
      AND (gymbuddy_matches.user1_id = auth.uid() OR gymbuddy_matches.user2_id = auth.uid())
    )
  );

-- Functions and Triggers

-- Update `updated_at` column for gymbuddy_profiles
CREATE OR REPLACE FUNCTION update_gymbuddy_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gymbuddy_profiles_updated_at
BEFORE UPDATE ON gymbuddy_profiles
FOR EACH ROW
EXECUTE FUNCTION update_gymbuddy_profiles_updated_at();

-- Add RLS policy for matches update if we need users to be able to set last_session_logged and streak.
-- The UPDATE policy is already there.

-- Enable Realtime for Messages
alter publication supabase_realtime add table gymbuddy_messages;
