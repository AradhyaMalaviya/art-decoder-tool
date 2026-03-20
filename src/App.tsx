import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Exercises = lazy(() => import("./pages/Exercises"));
const ExerciseDetail = lazy(() => import("./pages/ExerciseDetail"));
const GenerateWorkout = lazy(() => import("./pages/GenerateWorkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Nutrition = lazy(() => import("./pages/Nutrition"));
const NutritionQuestionnaire = lazy(() => import("./pages/NutritionQuestionnaire"));
const NutritionRoadmap = lazy(() => import("./pages/NutritionRoadmap"));
const ActiveWorkout = lazy(() => import("./pages/ActiveWorkout"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

const queryClient = new QueryClient();

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
    Loading...
  </div>
);

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
        <AnalyticsTracker />
        <AuthProvider>
          <Suspense fallback={<RouteLoader />}>
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
