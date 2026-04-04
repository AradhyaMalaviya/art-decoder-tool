# FitBox — Comprehensive AI Fitness & Nutrition Platform

**FitBox** is a full-stack, AI-powered fitness and nutrition web application designed to provide an immersive, personalized health and wellness experience. Built with React 18, TypeScript, and Vite, FitBox combines cutting-edge AI technologies — including Google Gemini 1.5 Flash for real-time conversational assistance and a custom NLP engine for local intent recognition — with a rich interactive front-end.

## Project info
**URL**: https://lovable.dev/projects/12447993-e2b0-4dae-a52f-ceecc07f2345

Changes made via Lovable will be committed automatically to this repo

---

## 🌟 Key Features

### 🤖 Dual AI Integration
- **Cloud-Based AI Fitness Chat (Fitness Coach AI):** Powered by Google Gemini 1.5 Flash via a Supabase Edge Function (`fitness-chat`), providing real-time, streaming conversational assistance on fitness programming and nutrition. Supports markdown link rendering and inline URL detection.
- **Local NLP Gym Trainer Chat:** A client-side, zero-latency chatbot operating entirely offline using intent classification and cosine similarity to provide instant exercise recommendations by muscle group and difficulty level. Features quick-action body-part buttons, bold text formatting, and a dedicated reset/restart flow.
- **Inspiration-Based Physique Scoring:** An algorithm analyzing user-selected character presets (Goku, Thor, Captain America, etc.) to tailor workout and nutrition targets, with automatically generated training-focus tags and a numeric inspiration score.

### 🏋️ Interactive Workout Experience
- **Interactive SVG Body Diagram:** A fully custom, anatomically accurate muscle map (`MuscleMapContainer`, `BodyDiagram`) providing click-to-explore access to exercises by body part.
- **Exercise Directory:** Over 50+ exercises categorized across 6 muscle groups (Chest, Back, Legs, Arms, Shoulders, Core) and 3 difficulty levels, complete with video demonstrations, form instructions, equipment requirements, and duration estimates.
- **Personalized Workout Generator:** A multi-step wizard (`GenerateWorkout`) that creates custom routines based on user-selected fitness level (Beginner / Intermediate / Advanced) and target muscle groups, with animated transitions and visual feedback.
- **Real-Time Workout Tracker:** An active workout session page (`ActiveWorkout`) enabling users to monitor elapsed time, add exercises from a searchable drawer, log sets with reps/weights, and save completed workouts directly to Supabase via a dedicated `useWorkoutSave` hook. Includes finish-confirmation dialogs and completion stats.
- **Exercise Detail Pages:** Individual exercise pages (`ExerciseDetail`) with comprehensive breakdowns including form cues, video embeds, and related exercises.

### 🥗 Indian Nutrition Engine
- **Algorithmic Nutrition Calculator:** Computes personalized calorie and macronutrient targets based on Mifflin-St Jeor BMR equations, adjusted for activity level (sedentary / moderate / active) and goal (bulk / lean-bulk / cut).
- **Culturally Specific Diet Plans:** Features an extensive Indian food database (`indianFoodDatabase.ts`, 30 KB+) covering breakfast, main meals, snacks, pre-workout, post-workout, and rest-day foods — each with per-serving macros, calorie counts, diet type labels (veg / non-veg / vegan), and INR cost ranges.
- **Nutrition Questionnaire:** A guided questionnaire (`NutritionQuestionnaire`) collecting gender, age, weight, height, goal, dietary preference, and activity level to generate a personalized roadmap.
- **Nutrition Roadmap:** A comprehensive, tabbed nutrition plan (`NutritionRoadmap`) with:
  - Sample bulking/cutting day plans with meal timing
  - Pre-workout, post-workout, and rest-day food recommendations
  - Hydration goals and supplement guidance (including desi alternatives like Sattu, coconut water, buttermilk)
  - Protein-equivalent food swaps for budget and preference flexibility
  - Downloadable PDF plan support
- **Customizable Meal Roles:** Tailored suggestions for pre-workout, post-workout, rest days, breakfast, main meals, and snacks, with filtering for vegetarian, non-vegetarian, and vegan options.

### 👤 User Capabilities & Onboarding
- **5-Step Personalization Wizard:** Collects:
  1. **Inspiration** — Upload up to 2 physique images or pick from character presets; auto-generates training focus tags and inspiration score
  2. **Diet** — Choose dietary preference (Omnivore, Vegetarian, Vegan, Eggetarian, Pescatarian) and set optional calorie target
  3. **Meals & Allergies** — Select meal routine (3 meals, 4–5 meals, or intermittent fasting with time-window), declare allergens with live parsing and common-allergen validation
  4. **Workout Time** — Set preferred training time (Morning, Afternoon, Evening, Flexible) with optional time range
  5. **Summary** — Full recap of all selections before submission, with visual tags and image preview
- **Authentication:** Secure user sign-up/sign-in or guest access, managed via Supabase Auth with protected routes and session-based API authentication.
- **Trainer Contact System:** A secure, dialog-based trainer contact feature (`TrainerContactButton`) that fetches contact details from a Supabase Edge Function (`get-trainer-contact`), with security logging and access control.

---

## 🚀 Technology Stack

| Layer                     | Technology                                        |
| ------------------------- | ------------------------------------------------- |
| **Frontend Framework**    | React 18 + TypeScript                             |
| **Build Tool**            | Vite 5                                            |
| **Styling**               | Tailwind CSS 3 + shadcn/ui (Radix UI primitives)  |
| **State Management**      | React Context API (Auth, Workout contexts)        |
| **Backend-as-a-Service**  | Supabase (PostgreSQL, Auth, Edge Functions)        |
| **AI / LLM**              | Google Gemini 1.5 Flash (via Supabase Edge Fn)    |
| **Data Fetching**         | TanStack React Query v5                           |
| **Forms**                 | React Hook Form + Zod validation                  |
| **Routing**               | React Router DOM v6                               |
| **Charts**                | Recharts                                          |
| **Icons**                 | Lucide React                                      |
| **Notifications**         | Sonner + Radix Toast                              |

---

## 📂 Project Structure

```
art-decoder-tool/
├── index.html                  # Entry HTML with OG/Twitter meta tags
├── src/
│   ├── App.tsx                 # Root component with routing & auth
│   ├── pages/
│   │   ├── Index.tsx           # Home — Muscle map, feature cards, stats
│   │   ├── Auth.tsx            # Sign-up / Sign-in
│   │   ├── Onboarding.tsx      # 5-step personalization wizard
│   │   ├── Exercises.tsx       # Exercise browsing by muscle group
│   │   ├── ExerciseDetail.tsx  # Single exercise deep-dive
│   │   ├── GenerateWorkout.tsx # Custom workout wizard
│   │   ├── ActiveWorkout.tsx   # Live workout session tracker
│   │   ├── Nutrition.tsx       # Nutrition hub
│   │   ├── NutritionQuestionnaire.tsx
│   │   ├── NutritionRoadmap.tsx
│   │   └── NotFound.tsx
│   ├── components/
│   │   ├── FitnessChat.tsx     # Gemini-powered AI chat
│   │   ├── GymTrainerChat.tsx  # Local NLP trainer chat
│   │   ├── BodyDiagram.tsx     # SVG muscle diagram
│   │   ├── MuscleMap.tsx       # Muscle map wrapper
│   │   ├── ExerciseCard.tsx    # Exercise grid card
│   │   ├── TrainerContactButton.tsx
│   │   ├── muscle-map/        # Muscle-map sub-components
│   │   ├── workout/           # Workout tracker sub-components
│   │   └── ui/                # shadcn/ui primitives
│   ├── contexts/               # AuthContext, WorkoutContext
│   ├── data/
│   │   ├── exercises.ts        # 50+ exercise definitions
│   │   └── indianFoodDatabase.ts # Indian food DB (30 KB+)
│   ├── hooks/                  # useWorkoutSave, useTrainerContact, etc.
│   ├── integrations/           # Supabase client setup
│   └── lib/                    # Utilities (onboarding helpers, cn, etc.)
├── supabase/
│   └── functions/
│       ├── fitness-chat/       # Gemini streaming AI edge function
│       └── get-trainer-contact/ # Trainer contact retrieval
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm**

### Installation

1. **Clone the repository and navigate into the project:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <project_directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create or update the `.env` file in the project root with your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID="..."
   VITE_SUPABASE_PUBLISHABLE_KEY="..."
   VITE_SUPABASE_URL="..."
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Build for production (optional):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment

This application was scaffolded with [Lovable](https://lovable.dev). It can be seamlessly deployed using Lovable's one-click publish feature, or statically hosted on standard platforms (Vercel, Netlify, etc.). Custom domains are fully supported.

---

## 📄 License

This project is proprietary. All rights reserved.
