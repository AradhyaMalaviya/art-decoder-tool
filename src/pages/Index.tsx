import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { MuscleMapContainer } from "@/components/muscle-map";
import { FitnessChat } from "@/components/FitnessChat";
import { exercises } from "@/data/exercises";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Interactive Muscle Map - Main Feature */}
      <MuscleMapContainer />
      
      {/* AI Fitness Chat */}
      <FitnessChat />
      
      {/* Feature Cards */}
      <section className="py-12 px-6 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Start Workout Card */}
            <Link 
              to="/workout/active"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-fitness-green/20 to-fitness-green/5 border border-fitness-green/30 p-8 hover:shadow-xl hover:shadow-fitness-green/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Start Workout</h3>
                <p className="text-muted-foreground">
                  Track your sets, reps, and weights in real-time
                </p>
              </div>
              <div className="absolute top-4 right-4 text-fitness-green opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Browse Exercises Card */}
            <Link 
              to="/exercises"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-8 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4">🏋️‍♀️</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Browse Exercises</h3>
                <p className="text-muted-foreground">
                  Explore our comprehensive exercise library
                </p>
              </div>
              <div className="absolute top-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Nutrition Card */}
            <Link 
              to="/nutrition"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 p-8 hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative z-10">
                <div className="text-5xl mb-4">🥗</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Nutrition</h3>
                <p className="text-muted-foreground">
                  Get personalized nutrition plans
                </p>
              </div>
              <div className="absolute top-4 right-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
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