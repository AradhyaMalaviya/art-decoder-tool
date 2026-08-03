# FitBox — Comprehensive Project Synopsis

## 1. Project Overview

**FitBox** is a full-stack, AI-powered fitness and nutrition web application designed to provide an immersive, personalized health and wellness experience. Built with **React 18**, **TypeScript**, and **Vite 5**, FitBox combines cutting-edge AI technologies — including **Google Gemini 1.5 Flash (via Lovable Gateway)** for real-time conversational assistance and a **custom NLP engine** for local intent recognition — with a rich interactive front-end featuring an anatomically accurate SVG body diagram, a comprehensive exercise directory, AI-generated workout plans, a real-time workout tracker, a social GymBuddy matching engine, and an Indian nutrition roadmap system. The application uses **Supabase** as its Backend-as-a-Service (BaaS) for authentication, database, and Deno edge functions.

**Technology Stack:**

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui component library |
| State Management | React Context API (`AuthContext`, `WorkoutContext`, `GymBuddyNotificationContext`) |
| Form Validation | Zod schema validation (`authSchemas.ts`, `onboarding.ts`) |
| Routing | React Router DOM v6 (14 routes, protected navigation) |
| Backend-as-a-Service | Supabase (PostgreSQL, Auth, Edge Functions, Row Level Security) |
| AI/ML — Cloud | Google Gemini 1.5 Flash via Lovable Gateway (`fitness-chat` Edge Function, SSE) |
| AI/ML — Local | Custom NLP engine with intent classification, entity extraction, similarity scoring |
| Icons | Lucide React |
| Database Migrations | 13 SQL migrations (`supabase/migrations/`) |
| HTTP Client | Supabase JS Client |

---

## 2. AI Integration — Deep Dive

> [!IMPORTANT]
> FitBox incorporates **two distinct AI systems** operating at different architectural layers, plus an **AI-driven inspiration scoring algorithm**. These are not superficial integrations — they form the intelligent backbone of the application's personalization engine.

### 2.1 AI System #1: Cloud-Based AI Fitness Chat (Google Gemini 1.5 Flash via Lovable Gateway)

**Component:** [FitnessChat.tsx](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/components/FitnessChat.tsx)
**Backend:** [fitness-chat Edge Function](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/supabase/functions/fitness-chat/index.ts)

This is the primary AI conversational interface powered by **Google's Gemini 1.5 Flash** model routed via the **Lovable AI Gateway**, deployed as a **Supabase Edge Function** running on Deno.

#### Architecture

```mermaid
sequenceDiagram
    participant User
    participant FitnessChat (React)
    participant Supabase Edge Function
    participant Lovable AI Gateway (Gemini 1.5 Flash)

    User->>FitnessChat (React): Types fitness question
    FitnessChat (React)->>Supabase Edge Function: POST /fitness-chat {messages}
    Supabase Edge Function->>Lovable AI Gateway (Gemini 1.5 Flash): POST /v1/chat/completions (LOVABLE_API_KEY)
    Lovable AI Gateway (Gemini 1.5 Flash)-->>Supabase Edge Function: Streaming text chunks
    Supabase Edge Function-->>FitnessChat (React): SSE stream (text/event-stream)
    FitnessChat (React)-->>User: Real-time token-by-token rendering
```

#### Technical Implementation Details

**Edge Function (`fitness-chat/index.ts`):**
- Runs on **Deno runtime** inside Supabase's serverless infrastructure.
- Uses `LOVABLE_API_KEY` to connect to `https://ai.gateway.lovable.dev/v1/chat/completions`.
- Model: `google/gemini-1.5-flash` — optimized for low-latency, high-throughput conversational AI.
- Implements **streaming Server-Sent Events (SSE)** — responses are streamed token-by-token to the client.
- Full **conversation history** is maintained and sent with each request for multi-turn dialogue.
- Constrained by a detailed system prompt covering workout programming, form correction, macro calculations, and Indian nutrition.

**Frontend Component (`FitnessChat.tsx`):**
- Floating chat widget accessible from any page via a fixed-position button.
- Real-time streaming rendering using `ReadableStream` chunk processing.
- Maintains full conversation history in React state with smooth auto-scroll.

---

### 2.2 AI System #2: Local NLP-Based Gym Trainer Chat

**Component:** [GymTrainerChat.tsx](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/components/GymTrainerChat.tsx)

A **client-side AI chatbot** that operates entirely in the browser without any external API calls. It uses a **custom-built Natural Language Processing (NLP) engine** with intent classification, entity extraction, and cosine similarity-based text matching.

#### Architecture

```mermaid
flowchart TD
    A["User Input"] --> B["Text Preprocessing<br/>(lowercase, tokenize, stopword removal)"]
    B --> C["Intent Classification<br/>(keyword pattern matching)"]
    C --> D{"Classified Intent"}
    D -->|exercise_recommendation| E["Entity Extraction<br/>(muscle group identification)"]
    D -->|greeting| F["Greeting Response"]
    D -->|help| G["Help/Menu Response"]
    D -->|exercise_info| H["Exercise Detail Lookup"]
    D -->|unknown| I["Cosine Similarity Search<br/>(fallback matching)"]
    E --> J["Filter exercise database<br/>by extracted muscle group"]
    J --> K["Format structured response<br/>with exercise cards"]
    H --> L["Search exercise DB<br/>by name similarity"]
    I --> M["Rank all intents by<br/>cosine similarity score"]
    M --> N["Return best match<br/>or fallback response"]
```

#### Key Characteristics
- **Zero Latency** — instantaneous response generation.
- **100% Offline Capability** — runs without network access or external credentials.
- **Safe Click Binding** — explicit callback handlers `onClick={() => sendMessage()}` prevent event parameter pollution.

---

### 2.3 AI System #3: Inspiration-Based Physique Scoring Algorithm

**Module:** [onboarding.ts](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/lib/onboarding.ts) — `deriveInspirationScore()` function

Classifies the user's fitness archetype during onboarding based on preset tags (Goku, Thor, Captain America, Toji):

```
Input Tags → Keyword Analysis → Fitness Score Classification
```

| Inspiration Tags | Derived Score | Meaning |
|---|---|---|
| bulky, powerful, strength | `bulk` | Focus on mass-building programs |
| lean + explosive/agile | `athletic-performance` | Speed, agility, and functional fitness |
| cut, shredded | `cutting` | Fat loss while preserving muscle |
| Mixed/unknown | `strength-hybrid` | Balanced approach |

---

### 2.4 AI-Powered Nutrition Personalization Engine

**Module:** [NutritionRoadmap.tsx](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/NutritionRoadmap.tsx) — `calculateNutrition()` function

Uses the **Mifflin-St Jeor equation** to calculate BMR and TDEE, applying surplus/deficit adjustments (+500 kcal for Bulk, +250 kcal for Lean Bulk) and macro distribution (2.2g/kg protein). Automatically filters the 150-item Indian food database.

---

## 3. Interactive Muscle Map System

**Component:** [InteractiveBodyDiagram.tsx](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/components/muscle-map/InteractiveBodyDiagram.tsx)
**Mapping Library:** [muscleMapping.ts](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/lib/muscleMapping.ts)

A custom **SVG-based interactive anatomy diagram** mapping 19 muscle groups across front and back views with gender toggling, hover tooltips, click selection, and animated exercise counts.

---

## 4. Exercise Directory & Detail System

- **Database:** [`exercises.ts`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/data/exercises.ts) — 50+ exercises with detailed descriptions, equipment tags, difficulty badges, and YouTube embeds.
- **Directory Page:** [`Exercises.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/Exercises.tsx) — Muscle group filtering, search bar, and route-based auto-selection.
- **Detail Page:** [`ExerciseDetail.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/ExerciseDetail.tsx) — Dedicated exercise view with embedded video and form instructions.

---

## 5. AI-Driven Workout Generator & Real-Time Tracker

- **Generator:** [`GenerateWorkout.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/GenerateWorkout.tsx) — Multi-step wizard creating personalized exercise routines. Direct completion button redirects to `/dashboard`.
- **Tracker Context:** [`WorkoutContext.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/contexts/WorkoutContext.tsx) — Global workout session state tracking sets, reps, weight, and elapsed time.
- **Active Workout Page:** [`ActiveWorkout.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/ActiveWorkout.tsx) — Live tracking interface with set completion checkboxes and direct `/dashboard` finish routing.
- **Persistence Hook:** [`useWorkoutSave.ts`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/hooks/useWorkoutSave.ts) — Persists workout logs targeting `public.profiles.id` (`profileId`).

---

## 6. Social Matching Engine (GymBuddy)

- **Discovery Radar:** [`GymBuddyRadar.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/components/gymbuddy/GymBuddyRadar.tsx) — Conic sonar radar with interactive search radius (2km–30km) and hoisted static phase constants.
- **Card Swiping:** [`GymBuddyCard.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/components/gymbuddy/GymBuddyCard.tsx) — Spring physics card stack with `'push_pull_legs'` union type alignment and Recharts compatibility visualization.
- **Matches & Chat:** [`GymBuddyMatches.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/pages/GymBuddyMatches.tsx) & [`useGymBuddyChat.ts`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/hooks/useGymBuddyChat.ts) — Real-time messaging, match listing, and shared workout streak logging (`gymbuddy_session_logs`).

---

## 7. Authentication & Dual-Identity Architecture

**Context:** [`AuthContext.tsx`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/contexts/AuthContext.tsx)
**Schemas:** [`authSchemas.ts`](file:///c:/Users/deepa/Downloads/musclewebsite%20test%202/art-decoder-tool/src/lib/authSchemas.ts)

### Dual-Identity Architecture
`AuthContext` provides explicit exposure of two distinct IDs to guarantee database target integrity:
1. `authUserId` — `session.user.id` from `auth.users`, used for all `gymbuddy_*` social tables and realtime channels.
2. `profileId` — `public.profiles.id` from `public.profiles`, used for `workout_sessions` and workout data logs.
3. **Runtime Environment Assertions** — Evaluates ID validity in dev mode (`import.meta.env.DEV`) to prevent cross-table reference errors.

---

## 8. Database Architecture & Migrations

The database consists of **13 migrations** defining profiles, workout sessions, and GymBuddy social tables:

| Migration | Focus |
|---|---|
| `20251007065544` | Initial core schema setup |
| `20251101134400`–`20251225093343` | Workouts, profiles, and feature extensions |
| `20260427000000_gymbuddy_schema.sql` | GymBuddy profiles, swipes, matches, messages, and session logs |

---

## 9. Routing Architecture

| Route | Purpose |
|---|---|
| `/auth` | Authentication (Sign in, Sign up, Guest) |
| `/onboarding` | 5-step personalization wizard |
| `/dashboard` | Primary dashboard |
| `/exercises` | Exercise directory |
| `/exercises/:muscleId` | Muscle-filtered exercise view |
| `/exercise/:id` | Detailed exercise view |
| `/generate-workout` | AI workout generator wizard |
| `/active-workout` | Real-time workout tracker |
| `/nutrition` | Nutrition hub |
| `/nutrition/questionnaire` | Macro calculation form |
| `/nutrition/roadmap` | Personalized nutrition roadmap |
| `/gymbuddy/discover` | Proximity radar candidate swiping |
| `/gymbuddy/matches` | Matched buddies & real-time chat |
| `/gymbuddy/setup` | GymBuddy social profile setup |
| `/gymbuddy/settings` | GymBuddy profile settings |

---

## 10. Summary of AI & Architectural Features

| # | Feature | Architectural Implementation | Key File |
|---|---|---|---|
| 1 | **Cloud Fitness Chat** | Google Gemini 1.5 Flash via Lovable Gateway (SSE) | `FitnessChat.tsx` + `fitness-chat/index.ts` |
| 2 | **Local Trainer Chatbot** | Browser-side NLP, TF-IDF, Cosine Similarity | `GymTrainerChat.tsx` |
| 3 | **Dual-Identity Context** | Explicit `authUserId` vs `profileId` isolation | `AuthContext.tsx` |
| 4 | **GymBuddy Radar & Cards** | Conic radar scanner + framer-motion card swiping | `GymBuddyRadar.tsx`, `GymBuddyCard.tsx` |
| 5 | **Nutrition Personalization** | Mifflin-St Jeor BMR/TDEE + Indian food engine | `NutritionRoadmap.tsx` |
| 6 | **Modular Variant System** | Isolated sibling `*-variants.ts` files | `badge-variants.ts`, `button-variants.ts`, etc. |

---

*End of Comprehensive Project Synopsis.*
