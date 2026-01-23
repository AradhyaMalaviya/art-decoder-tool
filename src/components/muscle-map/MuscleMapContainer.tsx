import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MuscleMapSVG } from "./MuscleMapSVG";
import { EquipmentFilter } from "./EquipmentFilter";
import { ExerciseResults } from "./ExerciseResults";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMuscleRoute, hasExercises } from "@/lib/muscleMapping";

export const MuscleMapContainer = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"front" | "back">("front");
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleMuscleClick = (muscleId: string, muscleGroup: string) => {
    // Check if muscle has exercises
    if (!hasExercises(muscleId)) {
      return; // Don't do anything if no exercises available
    }
    
    // Navigate to exercise page
    const route = getMuscleRoute(muscleId);
    navigate(route);
    
    // Also toggle selection for inline view (optional - can be removed if only navigation is desired)
    if (selectedMuscle === muscleGroup) {
      setSelectedMuscle(null);
    } else {
      setSelectedMuscle(muscleGroup);
    }
  };

  const handleReset = () => {
    setSelectedMuscle(null);
    setSelectedEquipment([]);
  };

  // Scroll to results on mobile when muscle is selected
  useEffect(() => {
    if (selectedMuscle && window.innerWidth < 1024 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedMuscle]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Interactive Muscle Map
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click on any muscle group to discover targeted exercises. Use equipment
              filters to find exercises that match your gym setup.
            </p>
          </div>

          {/* Main 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar - Equipment filters */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="sticky top-4">
                <EquipmentFilter
                  selectedEquipment={selectedEquipment}
                  onEquipmentChange={setSelectedEquipment}
                />
              </div>
            </div>

            {/* Center - Body Map */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-border p-6">
                {/* View Toggle */}
                <div className="flex justify-center gap-3 mb-6">
                  <button
                    onClick={() => setView("front")}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                      view === "front"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setView("back")}
                    className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 ${
                      view === "back"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Back View
                  </button>
                </div>

                {/* SVG Body Map */}
                <div className="flex justify-center">
                  <div className="w-full max-w-[350px] transition-all duration-500">
                    <MuscleMapSVG
                      view={view}
                      hoveredMuscle={hoveredMuscle}
                      selectedMuscle={selectedMuscle}
                      onMuscleHover={setHoveredMuscle}
                      onMuscleClick={handleMuscleClick}
                    />
                  </div>
                </div>

                {/* Selected muscle indicator */}
                {selectedMuscle && (
                  <div className="mt-6 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full text-sm font-medium border border-destructive/30">
                      <span>Selected: {selectedMuscle}</span>
                      <button
                        onClick={() => setSelectedMuscle(null)}
                        className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Hover hint */}
                {hoveredMuscle && !selectedMuscle && (
                  <div className="mt-6 text-center animate-fade-in">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/20">
                      Click to explore exercises
                    </div>
                  </div>
                )}

                {/* Reset button */}
                {(selectedMuscle || selectedEquipment.length > 0) && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right panel - Exercise results */}
            <div ref={resultsRef} className="lg:col-span-4 order-3">
              <div className="sticky top-4">
                <ExerciseResults
                  selectedMuscle={selectedMuscle}
                  selectedEquipment={selectedEquipment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
