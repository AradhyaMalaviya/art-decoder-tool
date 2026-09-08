# FitBox — AI-Powered Fitness & Nutrition Ecosystem

**FitBox** is a high-end, full-stack fitness and social web application that unifies professional AI coaching, anatomical exercise discovery, real-time workout tracking, culturally specific Indian nutrition planning, and social partner matching into a single, cohesive platform. Built with React 18 + TypeScript on a Supabase/PostgreSQL backend, FitBox delivers a production-grade experience for athletes of every level.

---

## 🌟 Core Feature Pillars

### 🤖 Multi-Assistant Intelligence Engine
FitBox operates on a layered AI model with complementary assistants serving distinct roles:

- **Cloud Coach (Google Gemini 2.5 Flash Lite):** Deployed as a serverless **Deno Edge Function** on Supabase through the Lovable AI Gateway. Streams token-by-token responses using **Server-Sent Events (SSE)** for real-time coaching on workout programming, biomechanics, and sports nutrition.
- **Gym Trainer Chat:** `GymTrainerChat.tsx` is a dashboard chat surface using the same streamed Gemini 2.5 Flash Lite backend and a compact exercise-library context.
- **Project Assistant:** `ProjectAssistantChat.tsx` is globally mounted and uses generated project knowledge with a direct Gemini 2.5 Flash Lite Edge Function for FitBox architecture and implementation questions.
- **Inspiration Archetype Scorer:** The `deriveInspirationScore()` algorithm in `src/lib/onboarding.ts` analyzes character-preset tags (Goku → lean/explosive, Thor → bulky/strength, Captain America → athletic/balanced, Toji → lean/dense-muscle) to deterministically classify users into one of four training archetypes: `bulk`, `cutting`, `athletic-performance`, or `strength-hybrid`.

### 🏋️ The Interactive Training Lab

- **SVG Anatomy Map:** A precision-engineered, custom-built interactive human body diagram (`src/lib/muscleMapping.ts`) with **19 individually clickable muscle groups** across front and back views. Supports gender toggle (male/female silhouettes), hover tooltips, and animated exercise-count panels. Clicking any muscle routes directly to a filtered exercise directory.
- **Exercise Directory:** 50+ exercises with muscle group, difficulty (Beginner/Intermediate/Advanced), duration, equipment, embedded YouTube player, and detailed form instructions. Searchable and filterable.
- **Smart Workout Generator:** A multi-step wizard (`GenerateWorkout.tsx`) that produces custom exercise plans based on fitness level, equipment, and target body parts.
- **Real-Time Workout Tracker:** Live session interface (`ActiveWorkout.tsx` + `WorkoutContext`) with a persistent elapsed timer, per-exercise set/rep/weight logging, completion checkboxes, and an in-session exercise browser drawer. Session data is persisted to a three-table PostgreSQL chain: `workout_sessions → workout_logs → workout_sets`.

### 🥗 Indian Nutrition Roadmap

- **Mifflin-St Jeor BMR Engine:** Personalized calorie calculations (`NutritionRoadmap.tsx`) using the clinically validated Mifflin-St Jeor equation, activity multipliers (sedentary 1.2 / moderate 1.55 / active 1.725), and goal-based surplus/deficit (Bulk: +500 kcal, Lean Bulk: +250 kcal, Cut: -500 kcal).
- **Macro Distribution:** Protein at 2.2g/kg bodyweight, Fats at 25% of TDEE, Carbohydrates filling the remainder.
- **Indian-First Food Database:** 150+ items curated for Indian dietary habits — Soya Chunks, Paneer, Sattu, Dal, Curd, Roti — with full macros, INR cost ranges, diet type tags (veg/non-veg/vegan), meal timing roles, and Hindi names.
- **5-Tab Roadmap View:** Pre-Workout, Post-Workout, Rest Day, Supplements (incl. Desi alternatives like Sattu and Chaas), and Protein Swap cards.
- **Questionnaire Flow:** `NutritionQuestionnaire.tsx` captures gender, age, weight, height, goal, diet preference, and activity level, storing results in `localStorage` for the roadmap calculation.

### 🤝 GymBuddy — The Social Matching Layer

- **Smart Profiles:** Specialized setup wizard (`GymBuddyProfileSetup.tsx`) covering workout split (PPL, Bro-Split, Upper/Lower, Full Body), experience level, fitness goals, preferred timings, gym location, and age range.
- **100-Point Compatibility Scorer:** Candidates are ranked across five weighted dimensions — Goals Overlap (30 pts), Experience Parity (20 pts), Split Synergy (20 pts), Timing Synchronization (20 pts), and Geographic Context (10 pts).
- **Gamified Discovery & Swiping:** `GymBuddyDiscover.tsx` provides right/left swipe matching with **Framer Motion spring physics** for realistic card dragging. A high-fidelity **Proximity Radar** (`GymBuddyRadar.tsx`) provides an interactive scanning phase, while a slide-up drawer reveals a 5-point **Recharts Radar polygon** displaying the Synergy Match Rating details.
- **Mutual Matches:** Mutual right-swipes atomically create a row in `gymbuddy_matches` (enforced with `CHECK (user1_id < user2_id)`), triggering an exciting `canvas-confetti` explosion and browser haptic feedback (`navigator.vibrate`) via `GymBuddyMatchOverlay.tsx`.
- **Real-Time Messaging:** `GymBuddyChat.tsx` uses Supabase WebSocket subscriptions (`supabase_realtime`) for instant message delivery. The chat interface includes an ambient **Live Session Widget** to show if partners are currently working out, and **Floating Micro-Reactions** for rapid-fire hype (🔥, 💪).
- **Shared Streaks:** `shared_streak` in `gymbuddy_matches` increments only when both partners log sessions, creating a mutual social accountability contract.

### 🧭 5-Step Onboarding Wizard

A structured, Zod-validated onboarding flow (`Onboarding.tsx`) that collects user preferences and seeds all downstream personalization:

1. **Physique Inspiration** — Character preset + free-form tags (validated via `inspirationStepSchema`)
2. **Diet Preferences** — Diet type enum + optional calorie target (validated via `dietStepSchema`)
3. **Meals & Allergies** — Meal routine, eating window time-range, allergen list (validated via `mealsStepSchema`)
4. **Workout Schedule** — Preferred time of day + specific time range (validated via `workoutStepSchema`)
5. **Summary & Confirm** — Full review before Supabase persistence

### 🔐 Subscription & Trainer Assignment Layer

- **Subscription Plans:** `subscription_plans` table with INR pricing, `duration_days`, and `features` JSONB. Default seeded plan: *Premium Personal Trainer Plan* (₹10/month, 30 days).
- **Payment Transactions:** Full Razorpay integration schema (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`) with immutable payment records (UPDATE/DELETE locked by RLS).
- **Assigned Trainers:** Admin-side trainer assignment with a secure PII vault. Sensitive contact info (email, phone) is isolated in `trainer_sensitive_data` — blocked from all direct client access by RLS (`USING (false)`). Accessed only through a privileged Supabase Edge Function (`get-trainer-contact`) which logs every access attempt to `audit_logs`.
- **Audit Logging:** `audit_logs` table records `user_id`, `action`, `resource_type`, `resource_id`, `metadata` JSONB, `ip_address`, and timestamp. Insert-only via service role; users can view their own logs but cannot modify them.

---

## 🚀 Technology Stack

| Layer | Technology | Version |
| :--- | :--- | :--- |
| **UI Framework** | React | 18.3.1 |
| **Language** | TypeScript | 5.8.3 |
| **Build Tool** | Vite | 5.4.19 |
| **Styling** | Tailwind CSS + shadcn/ui + Radix UI | 3.4.17 |
| **Backend & Auth** | Supabase (PostgreSQL, Auth, Edge Functions, RLS, Realtime) | 2.58.0 |
| **AI (Fitness)** | Google Gemini 2.5 Flash Lite via Lovable Gateway and Deno Edge Function | — |
| **AI (Project)** | Google Gemini 2.5 Flash Lite via direct Deno Edge Function | — |
| **Server State** | TanStack Query | v5.83.0 |
| **Validation** | Zod + React Hook Form | 3.25.76 |
| **Routing** | React Router DOM | 6.30.1 |
| **Charts** | Recharts | 2.15.4 |
| **Animations** | Framer Motion + Canvas Confetti | 12.38.0 |
| **Icons** | Lucide React | 0.462.0 |
| **Toasts** | Sonner | 1.7.4 |

---

## 📂 Full Project Architecture

```bash
fitbox/
├── src/
│   ├── components/
│   │   ├── gymbuddy/         # GymBuddyCard, GymBuddyRadar, GymBuddyMatchOverlay,
│   │   │                     # GymBuddySessionModal, GymBuddySettings, WorkoutStreak
│   │   ├── muscle-map/       # InteractiveBodyDiagram, MuscleMapSVG, ExerciseResults,
│   │   │                     # ExerciseResultCard, EquipmentFilter
│   │   ├── workout/          # AddExerciseDrawer, ExerciseLogCard, StartWorkoutCard,
│   │   │                     # WorkoutHeader
│   │   ├── ui/               # shadcn/ui design system (Button, Card, Dialog, etc.)
│   │   ├── GymTrainerChat.tsx   # Dashboard Gemini SSE trainer chat
│   │   ├── FitnessChat.tsx      # Dashboard Gemini SSE fitness chat
│   │   ├── ProjectAssistantChat.tsx # Global project-aware assistant
│   │   └── Header.tsx           # Global nav with auth state
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Supabase session, guest-mode, profile state
│   │   ├── WorkoutContext.tsx        # Active session timer, logs, current exercise
│   │   └── GymBuddyNotification     # WebSocket message subscription → global toasts
│   │
│   ├── hooks/
│   │   ├── useGymBuddy.ts           # Swipe, match, message mutations
│   │   ├── useWorkoutSave.ts        # Session persist to workout_sessions/logs/sets
│   │   ├── useTrainerContact.ts     # Calls get-trainer-contact edge function
│   │   └── use-toast.ts             # Sonner toast wrapper
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx          # Public marketing page
│   │   ├── Auth.tsx                 # Sign-in / Sign-up / Guest access
│   │   ├── Onboarding.tsx           # 5-step Zod-validated onboarding wizard
│   │   ├── Index.tsx                # Main dashboard with muscle map + quick actions
│   │   ├── Exercises.tsx            # Full exercise directory with search & filters
│   │   ├── ExerciseDetail.tsx       # Exercise deep-dive with embedded video player
│   │   ├── GenerateWorkout.tsx      # AI workout plan generator wizard
│   │   ├── ActiveWorkout.tsx        # Live real-time workout tracker
│   │   ├── Nutrition.tsx            # Nutrition hub / entry point
│   │   ├── NutritionQuestionnaire.tsx  # Body data collection form
│   │   ├── NutritionRoadmap.tsx     # Personalized Indian food plan (5 tabs)
│   │   ├── GymBuddyDiscover.tsx     # Swipe-based partner discovery
│   │   ├── GymBuddyMatches.tsx      # Match list with streak badges
│   │   ├── GymBuddyChat.tsx         # Real-time match messaging
│   │   ├── GymBuddyProfileSetup.tsx # Social profile creation wizard
│   │   └── NotFound.tsx             # 404 fallback
│   │
│   ├── data/
│   │   ├── exercises.ts             # 50+ exercise objects with full metadata
│   │   ├── indianFoodDatabase.ts    # 150+ Indian food items with macros & INR cost
│   │   └── projectKnowledge.ts      # AUTO-GENERATED project context (npm run build:knowledge)
│   │
│   └── lib/
│       ├── onboarding.ts            # Zod schemas + deriveInspirationScore() algorithm
│       ├── muscleMapping.ts         # SVG diagramId → exerciseGroup → route mapping
│       └── utils.ts                 # cn() tailwind class merger + helpers
│
├── supabase/
│   ├── config.toml                  # project_id + verify_jwt per edge function
│   ├── functions/
│   │   ├── fitness-chat/            # Gemini 2.5 Flash Lite SSE streaming edge function
│   │   ├── project-assistant/       # Direct Gemini project assistant
│   │   └── get-trainer-contact/     # Secure PII retrieval + audit logging
│   └── migrations/                  # 14 chronological SQL migration files
│       ├── 20251007…                # Initial profiles + workouts schema
│       ├── 20251101134400…          # Trainer data additions
│       ├── 20251101134431…          # Subscriptions, payments, assigned_trainers
│       ├── 20251102…                # Additional profile columns
│       ├── 20251103…                # Minor column tweaks
│       ├── 20251104…                # RLS policy updates
│       ├── 20251107…                # Auth trigger + secure RLS overhaul
│       ├── 20251225085149…          # trainer_sensitive_data PII vault + audit_logs
│       ├── 20251225093343…          # workout_sessions / workout_logs / workout_sets
│       ├── 20260320…                # exercise_media storage bucket
│       ├── 20260427000000…          # Full GymBuddy social schema
│       └── 20260427000001…          # GymBuddy realtime publication
│
├── scripts/
│   ├── build-project-knowledge.mjs # Generates src/data/projectKnowledge.ts
│   └── upload-exercise-media.mjs   # Uploads exercise videos/posters to Supabase Storage
├── tailwind.config.ts              # Custom design tokens, dark-mode theme
├── vite.config.ts                  # Path aliases (@/) + build optimisation
└── tsconfig.json                   # Strict TypeScript configuration
```

---

## 🔑 Route Map

| Route | Page | Auth Required |
| :--- | :--- | :--- |
| `/` | `LandingPage` | No |
| `/auth` | `Auth` | No |
| `/onboarding` | `Onboarding` | Yes |
| `/dashboard` | `Index` | Yes |
| `/exercises` | `Exercises` | Yes |
| `/exercises/:muscleId` | `Exercises` (muscle-filtered) | Yes |
| `/exercise/:exerciseId` | `ExerciseDetail` | Yes |
| `/generate-workout` | `GenerateWorkout` | Yes |
| `/workout/active` | `ActiveWorkout` | Yes |
| `/nutrition` | `Nutrition` | Yes |
| `/nutrition/questionnaire` | `NutritionQuestionnaire` | Yes |
| `/nutrition/roadmap` | `NutritionRoadmap` | Yes |
| `/gymbuddy/setup` | `GymBuddyProfileSetup` | Yes |
| `/gymbuddy/discover` | `GymBuddyDiscover` | Yes |
| `/gymbuddy/matches` | `GymBuddyMatches` | Yes |
| `/gymbuddy/chat/:matchId` | `GymBuddyChat` | Yes |
| `/gymbuddy/settings` | `GymBuddySettings` | Yes |

---

## 💻 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/AradhyaMalaviya/art-decoder-tool.git
   cd art-decoder-tool
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```
   In the Supabase Edge Function secrets dashboard, set:
   ```
   LOVABLE_API_KEY=your_lovable_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Database Setup**
   Apply all 14 migrations via the Supabase CLI:
   ```bash
   supabase db push
   ```

4. **Deploy Edge Functions**
   ```bash
   supabase functions deploy fitness-chat project-assistant get-trainer-contact
   ```

5. **Run in Development**
   ```bash
   npm run dev
   ```

---

## ✍️ Author

**Aaradhya Malaviya**
- Full-Stack Developer & Fitness Technology Architect
- [GitHub](https://github.com/AaradhyaMalaviya)
- [LinkedIn](https://linkedin.com/in/aaradhyamalaviya)

---

## 📄 License

Proprietary. © 2026 Aaradhya Malaviya. All rights reserved.
