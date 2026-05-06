import { Link } from "react-router-dom";
import { Dumbbell, Utensils, MessageSquare, Activity, Trophy, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              FitBox
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link
              to="/auth"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Sign up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 max-w-5xl mx-auto">
        <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-6 animate-fade-in">
          Designed exclusively for Indian fitness enthusiasts
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Your AI Fitness Coach. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
            Built for India.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
          Track workouts, log Indian meals, get personalized AI coaching — all in one app designed for how India eats and trains.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/auth"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-base font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* Features Highlight */}
      <section id="features" className="py-20 bg-card/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to hit your goals</h2>
            <p className="text-muted-foreground text-lg">Powerful features without the premium price tag.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-indigo-500/10 transition-all">
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">🤖 AI Coaching</h3>
              <p className="text-muted-foreground text-sm">Chat with your personal AI trainer — available 24/7 for form checks, advice, and motivation.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-emerald-500/10 transition-all">
              <Utensils className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">🍛 Indian Nutrition</h3>
              <p className="text-muted-foreground text-sm">150+ Indian foods tracked with macros and estimated ₹ costs. From Dal Makhani to Soya Chunks.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-accent/10 transition-all">
              <Dumbbell className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">💪 Smart Workouts</h3>
              <p className="text-muted-foreground text-sm">Personalized workouts from a 50+ exercise library, complete with interactive muscle maps.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-blue-500/10 transition-all">
              <Activity className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">📊 Body Analytics</h3>
              <p className="text-muted-foreground text-sm">Track your physique score and body composition with an advanced 5-dimension scoring engine.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-purple-500/10 transition-all">
              <Trophy className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">🎮 Gamification</h3>
              <p className="text-muted-foreground text-sm">Earn badges, maintain streaks, unlock achievements and stay motivated every single day.</p>
            </div>
            <div className="bg-background/60 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm hover:shadow-slate-500/10 transition-all">
              <Shield className="w-10 h-10 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">🔒 Privacy First</h3>
              <p className="text-muted-foreground text-sm">Your data stays yours. Built with row-level security and a guest mode for maximum privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to start your FitBox journey?</h2>
        <Link
          to="/auth"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow transition-all hover:scale-105"
        >
          Sign Up Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>Made with ❤️ for Indian fitness enthusiasts</p>
      </footer>
    </div>
  );
}
