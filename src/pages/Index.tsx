import { useState, useMemo } from "react";
import { HeroSection } from "@/components/HeroSection";
import { MuscleGroupFilter } from "@/components/MuscleGroupFilter";
import { ExerciseCard } from "@/components/ExerciseCard";
import { exercises } from "@/data/exercises";

const Index = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesGroup = selectedMuscleGroup === "All" || exercise.muscleGroup === selectedMuscleGroup;
      const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [selectedMuscleGroup, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      {/* Feature Cards */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Browse Exercises Card */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-8 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
              <div className="relative z-10">
                <div className="text-5xl mb-4">🏋️‍♀️</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Browse Exercises</h3>
                <p className="text-muted-foreground">
                  Explore our comprehensive exercise library organized by muscle groups
                </p>
              </div>
            </div>

            {/* Nutrition Card */}
            <a 
              href="https://www.healthline.com/nutrition" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-fitness-green/20 to-fitness-green/5 border border-fitness-green/30 p-8 hover:shadow-xl hover:shadow-fitness-green/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4">🥗</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Nutrition</h3>
                <p className="text-muted-foreground">
                  Learn about healthy eating and nutrition tips for optimal performance
                </p>
              </div>
              <div className="absolute top-4 right-4 text-fitness-green opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      {/* Exercise Directory */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Exercise Directory
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive collection of exercises organized by muscle groups
            </p>
          </div>

          {/* Muscle Group Filter */}
          <MuscleGroupFilter 
            selectedGroup={selectedMuscleGroup}
            onGroupSelect={setSelectedMuscleGroup}
          />

          {/* Exercise Results */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground text-center">
              Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} 
              {selectedMuscleGroup !== "All" && ` for ${selectedMuscleGroup}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ExerciseCard exercise={exercise} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️‍♀️</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No exercises found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find the exercises you're looking for.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-6 bg-card/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary">{exercises.length}+</div>
              <div className="text-sm md:text-base text-muted-foreground">Exercises</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-secondary">6</div>
              <div className="text-sm md:text-base text-muted-foreground">Muscle Groups</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent">3</div>
              <div className="text-sm md:text-base text-muted-foreground">Difficulty Levels</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-fitness-green">∞</div>
              <div className="text-sm md:text-base text-muted-foreground">Possibilities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;