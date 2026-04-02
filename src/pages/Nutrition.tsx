import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Nutrition = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20 px-6">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Fuel Your Muscles,
            <span className="block primary-gradient bg-clip-text text-transparent animate-glow">
              Transform Your Body 💪
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Choose your path to build muscle — with or without working out
          </p>

          {/* Choice Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Diet with Workout */}
            <Link to="/nutrition/questionnaire?type=workout">
              <Card className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
                <CardHeader>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏋️</div>
                  <CardTitle className="text-2xl">Diet with Workout</CardTitle>
                  <CardDescription className="text-base">
                    Get a customized nutrition plan for your training days, rest days, pre-workout, and post-workout nutrition.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-primary">
                    <span className="font-semibold">Get Started</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Diet without Workout */}
            <Link to="/nutrition/questionnaire?type=no-workout">
              <Card className="group hover:shadow-xl hover:shadow-fitness-green/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-fitness-green/30 bg-gradient-to-br from-fitness-green/10 to-fitness-green/5">
                <CardHeader>
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
                  <CardTitle className="text-2xl">Diet without Workout</CardTitle>
                  <CardDescription className="text-base">
                    Focus on building lean muscle through nutrition alone, with a structured meal roadmap.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-fitness-green">
                    <span className="font-semibold">Get Started</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-card/30 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-4xl">📊</div>
              <h3 className="text-xl font-semibold">Personalized Macros</h3>
              <p className="text-muted-foreground">
                Get customized protein, carb, and fat ratios based on your goals and activity level
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl">🍱</div>
              <h3 className="text-xl font-semibold">Meal Examples</h3>
              <p className="text-muted-foreground">
                Detailed meal ideas for every part of your day, adapted to your dietary preference
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl">⏰</div>
              <h3 className="text-xl font-semibold">Timing Guide</h3>
              <p className="text-muted-foreground">
                Learn when to eat for optimal muscle building and recovery
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Nutrition;
