# FitBox — Comprehensive AI Fitness & Nutrition Platform

**FitBox** is a full-stack, AI-powered fitness and nutrition web application designed to provide an immersive, personalized health and wellness experience. Built with React 18, TypeScript, and Vite, FitBox combines cutting-edge AI technologies — including Google Gemini 1.5 Flash for real-time conversational assistance and a custom NLP engine for local intent recognition — with a rich interactive front-end.

## 🌟 Key Features

### 🤖 Dual AI Integration
- **Cloud-Based AI Fitness Chat:** Powered by Google Gemini 1.5 Flash for real-time, streaming conversational assistance on fitness programming and nutrition.
- **Local NLP Gym Trainer Chat:** A client-side, zero-latency chatbot operating entirely offline using intent classification and cosine similarity to provide instant exercise recommendations.
- **Inspiration-Based Physique Scoring:** An algorithm analyzing user-selected character presets (Goku, Thor, Captain America, etc.) to tailor workout and nutrition targets.

### 🏋️ Interactive Workout Experience
- **Interactive SVG Body Diagram:** A fully custom, anatomically accurate muscle map providing click-to-explore access to exercises by body part.
- **Exercise Directory:** Over 50+ exercises categorized by muscle group and difficulty, complete with video demonstrations and form instructions.
- **Personalized Workout Generator:** An intelligent wizard that creates custom routines based on user level and target muscles.
- **Real-Time Workout Tracker:** Monitor elapsed time, log sets, track reps/weights, and save progress directly to Supabase.

### 🥗 Indian Nutrition Engine
- **Algorithmic Nutrition Calculator:** Computes personalized calorie and macronutrient targets based on Mifflin-St Jeor BMR equations.
- **Culturally Specific Diet Plans:** Features an extensive database of Indian foods adapted for bulking, cutting, or recomposition.
- **Customizable Meal Roles:** Tailored suggestions for pre-workout, post-workout, and rest days, with vegetarian, non-vegetarian, and vegan options.

### 👤 User Capabilities & Onboarding
- **5-Step Personalization Wizard:** Collects body stats, inspiration, dietary restrictions, allergies, and workout schedules.
- **Authentication:** Secure user sign-up/sign-in or guest access, managed via Supabase Auth.

## 🚀 Technology Stack
- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context API
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Icons:** Lucide React

## 💻 Getting Started

To run the project locally on your machine, follow these steps:

### Prerequisites:
- Node.js & npm (v18+)

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
   Ensure your `.env` file in the project root is properly configured with your Supabase credentials. Here's what is expected:
   ```env
   VITE_SUPABASE_PROJECT_ID="..."
   VITE_SUPABASE_PUBLISHABLE_KEY="..."
   VITE_SUPABASE_URL="..."
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

## 🌐 Deployment
This application was scaffolded with Lovable. It can be seamlessly deployed using Lovable's one-click publish feature, or statically hosted on standard platforms. Custom domains are also fully supported.
