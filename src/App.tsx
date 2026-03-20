import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import ExerciseDetail from "./pages/ExerciseDetail";
import GenerateWorkout from "./pages/GenerateWorkout";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Nutrition from "./pages/Nutrition";
import NutritionQuestionnaire from "./pages/NutritionQuestionnaire";
import NutritionRoadmap from "./pages/NutritionRoadmap";
import ActiveWorkout from "./pages/ActiveWorkout";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/exercises/:muscleId" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/exercise/:exerciseId" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
            <Route path="/generate-workout" element={<ProtectedRoute><GenerateWorkout /></ProtectedRoute>} />
            <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
            <Route path="/nutrition/questionnaire" element={<ProtectedRoute><NutritionQuestionnaire /></ProtectedRoute>} />
            <Route path="/nutrition/roadmap" element={<ProtectedRoute><NutritionRoadmap /></ProtectedRoute>} />
            <Route path="/workout/active" element={<ProtectedRoute><ActiveWorkout /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
