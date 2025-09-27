import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/fitness-hero.jpg";

interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const HeroSection = ({ searchTerm, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Transform Your
          <span className="block primary-gradient bg-clip-text text-transparent animate-glow">
            Fitness Journey
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover targeted exercises organized by muscle groups. Build strength, endurance, and achieve your fitness goals.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Start Training
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Browse Exercises
          </Button>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm animate-pulse hidden md:block" />
      <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-secondary/20 backdrop-blur-sm animate-pulse hidden md:block" />
    </section>
  );
};