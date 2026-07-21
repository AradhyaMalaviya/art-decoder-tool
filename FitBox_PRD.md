# FitBox Mega-PRD (Technical & Product Bible)
## Professional Edition — v1.0.0 (May 2026)

---

# VOLUME I: PRODUCT VISION & MARKET STRATEGY

## 1. Executive Summary
**FitBox** is a high-performance, full-stack fitness and nutrition ecosystem designed to bridge the gap between individual training and community accountability. By leveraging a dual-AI architecture (Cloud-based LLM + Local NLP), an anatomically precision-mapped interface, and a culturally specialized Indian nutrition engine, FitBox delivers a personalized health experience that evolves with the user. The platform not only tracks metrics but fosters real-world connections through its "GymBuddy" social matching layer.

## 2. Core Value Propositions
### 2.1 For the Individual
- **Hyper-Personalized Programming**: Workouts generated not just by "level," but by specific anatomical inspiration (The Goku/Thor Preset System).
- **Desi-Nutrition Mastery**: No more translating US-centric diets. FitBox understands Sattu, Paneer, and Soya Chunks.
- **Zero-Latency AI**: A local trainer that answers common form questions instantly, regardless of internet connectivity.

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
- **KR2**: 0ms latency for Local Trainer intent classification.

---

# VOLUME II: THE TECHNICAL CORE

## 4. Dual-AI Architecture
FitBox operates on a "Hybrid-Intelligence" model, balancing the deep reasoning of cloud models with the speed of local processing.

### 4.1 Cloud Coach: Google Gemini 1.5 Flash
- **Deployment**: Supabase Edge Functions (Deno).
- **Communication Protocol**: Server-Sent Events (SSE) for real-time token streaming.
- **Role**: Complex workout programming, macro-nutrient science, and long-form motivational coaching.
- **Security**: Key-vaulted API access with request rate-limiting.

### 4.2 Local Trainer: Custom NLP Engine
- **Logic**: Client-side JavaScript executing Term-Frequency Inverse Document Frequency (TF-IDF) principles.
- **Similarity Metric**: **Cosine Similarity** between user input vectors and predefined intent vectors.
- **Intent Inventory**:
    - `GREETING`: General engagement.
    - `EXERCISE_REC`: Suggesting movements based on muscle groups.
    - `NUTRITION_ADVICE`: General diet tips.
    - `MUSCLE_INFO`: Explaining anatomical functions.
- **Performance**: $O(1)$ intent lookup after initial vectorization.

## 5. State Management & Data Flow
FitBox employs a multi-tiered state architecture to ensure data persistence and UI responsiveness.

### 5.1 Server State (TanStack Query)
- **Caching**: 5-minute cache for static datasets (Exercises, Food).
- **Invalidation**: Instant invalidation on "Match" or "Message" events.
- **Optimistic Updates**: Applied to "Message Sent" and "Set Logged" actions for zero-perceived latency.

### 5.2 Global UI State (React Context)
- **`AuthContext`**: Manages Supabase Auth sessions, guest-session hydration from `localStorage`, and profile state.
- **`WorkoutContext`**: A dedicated provider for the "Active Session," tracking timers, set logs, and current exercise focus.
- **`GymBuddyNotificationContext`**: Subscribes to the `gymbuddy_messages` table via WebSockets to provide global toast notifications.

---

# VOLUME III: DATABASE & SECURITY ENCYCLOPEDIA

## 6. Complete Database Schema (DDL Reference)
The following SQL definitions represent the authoritative source of truth for the FitBox data model.

### 6.1 GymBuddy Social Core
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

### 6.2 Communication & Logging
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
- Exact Match (PPL/PPL): **20 Points**.
- Full Body Versatility: **15 Points** (if either user is "Flexible").
- Complete Mismatch: **0 Points**.

### 8.4 Timing Synchronization (20 Points)
- Shared preferred windows (Morning/Evening).
- "Flexible" users receive a bonus **20 Points** regardless of partner choice.

### 8.5 Geographic Context (10 Points)
- Matching Gym Location string: **10 Points**.
- Same City (Keyword match): **5 Points**.

## 8.a High-Fidelity Interaction Layer
The GymBuddy module utilizes advanced web capabilities to create a premium, gamified experience:
- **Proximity Radar Scanner**: Instead of static loading states, the app uses GPU-accelerated CSS keyframes to render a sweeping sonar radar (`GymBuddyRadar.tsx`) with interactive radius constraints (2km–30km).
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
FitBox is built on 70+ modular components.

### 12.1 The Social Module
- **`GymBuddyRadar`**: High-performance CSS conic-sweep scanning interface with interactive radius control.
- **`GymBuddyCard`**: Handles swipe gestures using `framer-motion` spring physics, and houses the Recharts Synergy Radar drawer.
- **`GymBuddyChat`**: Real-time message list with sticky header, Live Session status widgets, and floating Emoji micro-reactions.
- **`MatchOverlay`**: High-priority modal for mutual likes featuring `canvas-confetti` and `navigator.vibrate` haptic triggers.

### 12.2 The Training Module
- **`WorkoutLogCard`**: Manages the input for weight/reps for a specific set.
- **`ExerciseDrawer`**: An overlay allowing exercise discovery during an active session.
- **`AnatomyMap`**: The SVG-driven interactive body visualizer.

### 12.3 The Nutrition Module
- **`MacroPieChart`**: Visual representation of the day's targets.
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
