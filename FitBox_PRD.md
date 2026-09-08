# FitBox Mega-PRD (Technical & Product Bible)
## Professional Edition — v1.2.0 (September 2026)

---

# VOLUME I: PRODUCT VISION & MARKET STRATEGY

## 1. Executive Summary
**FitBox** is a high-performance, full-stack fitness and nutrition ecosystem designed to bridge the gap between individual training and community accountability. By leveraging multiple AI assistants, an anatomically precision-mapped interface, and a culturally specialized Indian nutrition engine, FitBox delivers a personalized health experience that evolves with the user. The platform not only tracks metrics but fosters real-world connections through its "GymBuddy" social matching layer.

## 2. Core Value Propositions
### 2.1 For the Individual
- **Hyper-Personalized Programming**: Workouts generated not just by "level," but by specific anatomical inspiration (The Goku/Thor Preset System).
- **Desi-Nutrition Mastery**: No more translating US-centric diets. FitBox understands Sattu, Paneer, and Soya Chunks.
- **Layered AI Assistance**: Streamed fitness coaching plus a globally available project assistant that understands current FitBox product and codebase knowledge.

### 2.2 For the Community
- **GymBuddy Synergy**: A points-based matching engine that finds the "perfect" training partner based on split, timing, and goals.
- **Shared Accountability**: Weekly streaks that only increment when *both* partners show up, creating a social contract for fitness.

## 3. Product OKRs (Objectives & Key Results)
### Objective 1: Become the Primary Training Hub for Indian Athletes
- **KR1**: Maintain a library of 150+ localized Indian food items with exact macro-mapping.
- **KR2**: Achieve 90%+ accuracy in "Protein Swap" recommendations.

### Objective 2: Maximize Social-Driven Retention
- **KR1**: Average "Shared Streak" length exceeding 4 weeks per match.
- **KR2**: 40% of daily active users (DAU) interacting with the Gamified GymBuddy chat (via Live Session widgets and floating micro-reactions).
- **KR3**: Increase daily swipe conversions by 25% through high-fidelity UI feedback (spring physics cards, Proximity Radar scanning).

### Objective 3: Performance Excellence
- **KR1**: First-token delivery for AI chat under 1.5 seconds.
- **KR2**: Keep common assistant interactions responsive through streamed responses and compact project context.

---

# VOLUME II: THE TECHNICAL CORE

## 4. AI Assistant Architecture
FitBox uses complementary cloud assistants for fitness coaching and project-aware help, with shared Supabase Edge Function deployment and server-side credential protection.

### 4.1 Cloud Coach: Google Gemini 2.5 Flash Lite (via Lovable AI Gateway)
- **Deployment**: Supabase Edge Functions (Deno runtime).
- **Communication Protocol**: Server-Sent Events (SSE) for real-time token streaming.
- **Role**: Complex workout programming, macro-nutrient science, and long-form motivational coaching.
- **Security & Gateway**: Key-vaulted API access (`LOVABLE_API_KEY`) via `https://ai.gateway.lovable.dev/v1/chat/completions` with server-side rate-limiting.

### 4.2 Fitness Chat and Gym Trainer
- **Frontend**: `FitnessChat` and `GymTrainerChat` provide floating chat surfaces on the dashboard.
- **Transport**: Both send conversation history and a compact exercise summary to the `fitness-chat` Supabase Edge Function.
- **Model**: `google/gemini-2.5-flash-lite` through the Lovable AI Gateway.
- **Communication**: Server-Sent Events (SSE) stream responses incrementally to the React clients.
- **Security**: The gateway credential remains server-side in `LOVABLE_API_KEY`.

### 4.3 Project Assistant
- **Frontend**: `ProjectAssistantChat` is mounted globally in `App.tsx`, so it is available across public and authenticated routes.
- **Knowledge**: `scripts/build-project-knowledge.mjs` generates compact project context in `src/data/projectKnowledge.ts`.
- **Backend**: The `project-assistant` Supabase Edge Function calls Google's Gemini API directly with `gemini-2.5-flash-lite`.
- **Communication**: The assistant returns a bounded, non-streaming JSON response with up to 20 conversation turns and 1,024 output tokens.
- **Security**: The direct Gemini integration uses the server-side `GEMINI_API_KEY`; clients never receive the key.

## 5. State Management & Data Flow
FitBox employs a multi-tiered state architecture to ensure data persistence, UI responsiveness, and strict schema compliance.

### 5.1 Server State (TanStack Query)
- **Caching**: 5-minute cache for static datasets (Exercises, Food).
- **Invalidation**: Instant invalidation on "Match" or "Message" events.
- **Optimistic Updates**: Applied to "Message Sent" and "Set Logged" actions for zero-perceived latency.

### 5.2 Global UI State & Dual-Identity Architecture (React Context)
- **`AuthContext`**: Manages Supabase Auth sessions, guest-session hydration, and profile state.
  - **Dual-Identity Architecture**: Exposes both `authUserId` (`session.user.id` targeting `auth.users`) and `profileId` (`public.profiles.id` targeting `public.profiles`).
  - **Runtime Assertions**: Includes development environment (`import.meta.env.DEV`) sanity checks to ensure schema target compliance across the application.
- **`WorkoutContext`**: A dedicated provider for the "Active Session," tracking timers, set logs, and current exercise focus.
- **`GymBuddyNotificationContext`**: Subscribes to the `gymbuddy_messages` table via WebSockets (targeting `authUserId`) to provide global toast notifications.

---

# VOLUME III: DATABASE & SECURITY ENCYCLOPEDIA

## 6. Complete Database Schema & Foreign Key Targets
The FitBox data model relies on clear distinction between authentication identity (`auth.users`) and application profile identity (`public.profiles`).

### 6.1 Database Foreign Key Target Mapping
- **Workout Log Tables** (`workout_sessions`, `workouts`, `workout_exercises`, `workout_sets`): Target `public.profiles(id)` (`profileId`).
- **GymBuddy Social Tables** (`gymbuddy_profiles`, `gymbuddy_swipes`, `gymbuddy_matches`, `gymbuddy_messages`, `gymbuddy_session_logs`): Target `auth.users(id)` (`authUserId`).

### 6.2 GymBuddy Social Core DDL
```sql
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
```

### 6.3 Communication & Logging
```sql
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
```

## 7. Row Level Security (RLS) Policy Matrix
FitBox enforces strict data isolation to protect user privacy.

| Table | Policy Name | Permission | Logic |
| :--- | :--- | :--- | :--- |
| `gymbuddy_profiles` | Own Profile Access | ALL | `auth.uid() = id` |
| `gymbuddy_profiles` | Public Discoverability | SELECT | `profile_visibility = 'public' AND is_discoverable = true` |
| `gymbuddy_swipes` | Swiper Isolation | ALL | `auth.uid() = swiper_id` |
| `gymbuddy_matches` | Participant Select | SELECT | `auth.uid() = user1_id OR auth.uid() = user2_id` |
| `gymbuddy_messages` | Match Visibility | SELECT | `EXISTS (SELECT 1 FROM gymbuddy_matches WHERE id = match_id AND (user1_id = auth.uid() OR user2_id = auth.uid()))` |

---

# VOLUME IV: THE SOCIAL ENGINE (GYMBUDDY)

## 8. Compatibility Scoring Algorithm (The 100-Point System)
When a user swipes, candidates are ranked using the following weighted points system:

### 8.1 Goals Overlap (30 Points)
- **Formula**: `(Shared Goals / Total Unique Goals) * 30`.
- **Example**: User A (Bulk, Strength), User B (Bulk, Cardio). Overlap is 1 (Bulk). Score = `(1 / 3) * 30 = 10`.

### 8.2 Experience Parity (20 Points)
- Same Level: **20 Points**.
- Adjacent Levels (e.g., Beginner/Intermediate): **10 Points**.
- Far Levels (e.g., Beginner/Advanced): **0 Points**.

### 8.3 Split Synergy (20 Points)
- Strict union type alignment with `WorkoutSplit` (`'push_pull_legs'`, `'full_body'`, `'upper_lower'`, `'bro_split'`, `'athletic'`, `'cardio_focused'`).
- Exact Match (`push_pull_legs`/`push_pull_legs`): **20 Points**.
- Full Body / Versatile: **15 Points**.
- Complete Mismatch: **0 Points**.

### 8.4 Timing Synchronization (20 Points)
- Shared preferred windows (Morning/Evening).
- "Flexible" users receive a bonus **20 Points** regardless of partner choice.

### 8.5 Geographic Context (10 Points)
- Matching Gym Location string: **10 Points**.
- Same City (Keyword match): **5 Points**.

## 8.a High-Fidelity Interaction & Component Isolation
The GymBuddy module utilizes advanced web capabilities and strict file modularization:
- **Proximity Radar Scanner**: `GymBuddyRadar.tsx` renders a sweeping conic-sonar radar with hoisted constant arrays (`SCANNING_PHASES`) and interactive radius constraints (2km–30km).
- **Extracted UI Variants**: Component variants are isolated into sibling helper modules (`badge-variants.ts`, `button-variants.ts`, `navigation-menu-variants.ts`, `sidebar-variants.ts`, `toggle-variants.ts`) to maintain 100% React Fast Refresh compliance.
- **Authentication Schemas**: Extracted `signUpSchema` and `signInSchema` into [`src/lib/authSchemas.ts`](file:///C:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/lib/authSchemas.ts).
- **Synergy Visualization**: Tapping a match score triggers a glassmorphic drawer containing a Recharts `RadarChart` mapping the 5 dimensions of compatibility.
- **Swipe Physics**: `framer-motion` dictates physical drag boundaries, velocity detection, and cubic-bezier spring returns for profile cards.
- **Dopamine Match State**: Mutual matches trigger immediate browser haptic feedback (`navigator.vibrate`) and a `canvas-confetti` explosion.

---

# VOLUME V: NUTRITION & BIOMETRICS

## 9. Personalized Roadmap Logic
The FitBox roadmap is generated using standard medical formulas tailored for fitness optimization.

### 9.1 BMR & TDEE Calculations
- **Base Formula**: Mifflin-St Jeor.
- **Surplus/Deficit Tiers**:
    - **Bulk**: TDEE + 500 kcal.
    - **Lean Bulk**: TDEE + 250 kcal.
    - **Recomp**: TDEE (Maintenance).
    - **Cut**: TDEE - 500 kcal.

### 9.2 Protein Swapping Engine
FitBox provides 1:1 macro-equivalent swaps for vegetarians.
- **Reference Pair 1**: 150g Chicken Breast ↔ 150g Paneer (requires fat adjustment).
- **Reference Pair 2**: 150g Chicken Breast ↔ 50g Dry Soya Chunks.
- **Reference Pair 3**: 1 Scoop Whey ↔ 100g Paneer.

## 10. The Indian Food Encyclopedia (Exhaustive Sample)
The database contains ~150 items. Below are the key staples.

| Item | Protein (g/100g) | Fat (g/100g) | Cost Tier | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Soya Chunks** | 52.0 | 0.5 | ₹ (Low) | The "Veg Protein King" |
| **Paneer** | 19.0 | 20.0 | ₹₹ (Mid) | Primary veg whole protein |
| **Sattu** | 20.0 | 5.0 | ₹ (Low) | Desi pre-workout staple |
| **Whole Egg** | 13.0 | 10.0 | ₹ (Low) | Standard budget bioavailable |
| **Curd (Dahi)** | 4.3 | 4.0 | ₹ (Low) | Probiotic/Protein mix |
| **Dal (Toor)** | 22.0 (dry) | 1.5 | ₹ (Low) | Pair with rice for profile |

---

# VOLUME VI: TRAINING & ANATOMY

## 11. Interactive Muscle Mapping System
The FitBox Anatomy view uses precision SVG IDs mapped to exercise categories.

### 11.1 Anatomical Taxonomy
- **Chest**: `chest_upper`, `chest_mid`, `chest_lower`.
- **Back**: `latissimus_dorsi`, `trapezius`, `rhomboids`, `erector_spinae`.
- **Legs**: `quadriceps`, `hamstrings`, `glutes`, `gastrocnemius`.
- **Arms**: `biceps`, `triceps`, `forearms`.
- **Shoulders**: `deltoid_front`, `deltoid_lateral`, `deltoid_rear`.

### 11.2 The Exercise Master List (Representative Samples)
The full dataset (600+ lines) covers:
- **Push-ups**: Beginner | Chest | Bodyweight.
- **Bench Press**: Intermediate | Chest | Barbell.
- **Deadlifts**: Advanced | Back/Legs | Barbell.
- **Lat Pulldowns**: Beginner | Back | Cable Machine.
- **Bulgarian Split Squats**: Advanced | Legs | Dumbbells.

---

# VOLUME VII: COMPONENT ENCYCLOPEDIA

## 12. Component Registry (Core UI)
FitBox is built on 70+ modular components and isolated route controllers.

### 12.1 The Social Module
- **`GymBuddyRadar`**: High-performance CSS conic-sweep scanning interface with interactive radius control.
- **`GymBuddyCard`**: Handles swipe gestures using `framer-motion` spring physics, housing the Recharts Synergy Radar drawer.
- **`GymBuddyChat`**: Real-time message list with sticky header, Live Session status widgets, and floating Emoji micro-reactions.
- **`MatchOverlay`**: High-priority modal for mutual likes featuring `canvas-confetti` and `navigator.vibrate` haptic triggers.

### 12.2 The Training & Routing Module
- **Direct Route Controllers**: Post-workout completions in `ActiveWorkout.tsx` and `GenerateWorkout.tsx` redirect directly to `/dashboard`.
- **`WorkoutLogCard`**: Manages input for weight/reps for specific sets.
- **`ExerciseDrawer`**: An overlay allowing exercise discovery during active sessions.
- **`AnatomyMap`**: The SVG-driven interactive body visualizer.

### 12.3 The Nutrition Module
- **`MacroPieChart`**: Visual representation of daily macro targets.
- **`FoodSwapCard`**: Comparison UI for vegetarian protein alternatives.

---

# VOLUME VIII: FUTURE ROADMAP

## 13. Phase 2: Gamification (Q3 2026)
- **FitPoints (XP)**: Earn points for every 1000kg moved.
- **Leaderboards**: Monthly rankings for "Most Consistent Partner."

## 14. Phase 3: Hardware Integration (Q4 2026)
- **Apple Health / Google Fit**: Auto-importing step counts and heart rate variability (HRV).
- **QR Gym Check-in**: Physical verification of sessions to validate streaks.

---

*End of Master Specification. This document serves as the absolute authority for FitBox Development.*
