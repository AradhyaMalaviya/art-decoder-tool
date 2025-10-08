import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Utensils, Droplets, Pill, Download } from "lucide-react";

interface UserData {
  gender: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  dietaryPreference: string;
  activityLevel: string;
}

const NutritionRoadmap = () => {
  const [searchParams] = useSearchParams();
  const planType = searchParams.get("type") || "workout";
  const [userData, setUserData] = useState<UserData | null>(null);
  const [calories, setCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    const stored = localStorage.getItem("nutritionUserData");
    if (stored) {
      const data = JSON.parse(stored);
      setUserData(data);
      calculateNutrition(data);
    }
  }, []);

  const calculateNutrition = (data: UserData) => {
    // Basic BMR calculation (Mifflin-St Jeor)
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const age = parseFloat(data.age);
    
    let bmr = data.gender === "male" 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    // Activity multiplier
    const activityMultiplier = data.activityLevel === "sedentary" ? 1.2 
      : data.activityLevel === "moderate" ? 1.55 : 1.725;
    
    let tdee = bmr * activityMultiplier;

    // Goal adjustment
    if (data.goal === "bulk") tdee += 500;
    else if (data.goal === "lean-bulk") tdee += 250;

    setCalories(Math.round(tdee));

    // Macro calculations (High protein for muscle building)
    const protein = Math.round(weight * 2.2); // 2.2g per kg
    const fats = Math.round((tdee * 0.25) / 9); // 25% of calories
    const carbs = Math.round((tdee - (protein * 4) - (fats * 9)) / 4);

    setMacros({ protein, carbs, fats });
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No data found. Please complete the questionnaire first.</p>
          <Link to="/nutrition">
            <Button>Go Back</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isVeg = userData.dietaryPreference === "vegetarian" || userData.dietaryPreference === "vegan";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 primary-gradient bg-clip-text text-transparent">
              Your Personalized Nutrition Roadmap
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {planType === "workout" ? "Optimized for training and recovery" : "Focused on muscle building through nutrition"}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-primary">{calories}</div>
                <div className="text-sm text-muted-foreground">Daily Calories</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-fitness-green">{macros.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-accent">{macros.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-secondary">{macros.fats}g</div>
                <div className="text-sm text-muted-foreground">Fats</div>
              </div>
            </div>

            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Plan (PDF)
            </Button>
          </div>

          {/* Content Based on Plan Type */}
          {planType === "workout" ? (
            <Tabs defaultValue="pre-workout" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pre-workout">Pre-Workout</TabsTrigger>
                <TabsTrigger value="post-workout">Post-Workout</TabsTrigger>
                <TabsTrigger value="rest-day">Rest Day</TabsTrigger>
                <TabsTrigger value="supplements">Supplements</TabsTrigger>
              </TabsList>

              <TabsContent value="pre-workout" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Pre-Workout Nutrition
                    </CardTitle>
                    <CardDescription>
                      Fuel your muscles 60-90 minutes before training
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Macronutrient Breakdown</h4>
                      <p className="text-muted-foreground">40% Carbs • 30% Protein • 30% Fats</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Example Meals</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {isVeg ? (
                          <>
                            <li>• Oats with banana, nuts, and plant protein shake</li>
                            <li>• Whole wheat toast with peanut butter and honey</li>
                            <li>• Greek yogurt with berries and granola</li>
                            <li>• Brown rice with tofu and vegetables</li>
                          </>
                        ) : (
                          <>
                            <li>• Oats with banana and whey protein</li>
                            <li>• Chicken breast with rice and vegetables</li>
                            <li>• Greek yogurt with honey and berries</li>
                            <li>• Whole wheat pasta with lean turkey</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="post-workout" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-fitness-green" />
                      Post-Workout Nutrition
                    </CardTitle>
                    <CardDescription>
                      Recovery and muscle repair within 30-45 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Macronutrient Breakdown</h4>
                      <p className="text-muted-foreground">50% Protein • 40% Carbs • 10% Fats</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Example Meals</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {isVeg ? (
                          <>
                            <li>• Plant protein shake with banana</li>
                            <li>• Paneer tikka with brown rice</li>
                            <li>• Lentil curry with quinoa</li>
                            <li>• Tofu scramble with sweet potato</li>
                          </>
                        ) : (
                          <>
                            <li>• Whey protein shake with banana</li>
                            <li>• Grilled chicken with sweet potato</li>
                            <li>• Eggs with brown rice and vegetables</li>
                            <li>• Salmon with quinoa and greens</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rest-day" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      Rest Day Nutrition
                    </CardTitle>
                    <CardDescription>
                      Support recovery while maintaining muscle mass
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Calorie Adjustment</h4>
                      <p className="text-muted-foreground">
                        ~{Math.round(calories * 0.85)} calories (15% reduction from training days)
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Keep Protein High</h4>
                      <p className="text-muted-foreground">Maintain {macros.protein}g protein for muscle recovery</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Example Daily Structure</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        {isVeg ? (
                          <>
                            <li>• Breakfast: Scrambled tofu with oats and nuts</li>
                            <li>• Lunch: Paneer rice bowl with vegetables</li>
                            <li>• Dinner: Lentil soup with quinoa and salad</li>
                            <li>• Snacks: Greek yogurt, nuts, fruits</li>
                          </>
                        ) : (
                          <>
                            <li>• Breakfast: Eggs with oats and berries</li>
                            <li>• Lunch: Chicken rice bowl with vegetables</li>
                            <li>• Dinner: Fish with sweet potato and greens</li>
                            <li>• Snacks: Cottage cheese, nuts, protein shake</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplements" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-secondary" />
                      Hydration & Supplements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        Hydration Goals
                      </h4>
                      <p className="text-muted-foreground">3-4 liters per day • More on training days</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Recommended Supplements</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Whey/Plant Protein:</strong> 25-30g post-workout</li>
                        <li>• <strong>Creatine Monohydrate:</strong> 5g daily</li>
                        <li>• <strong>Fish Oil/Omega-3:</strong> 2-3g daily</li>
                        <li>• <strong>Multivitamin:</strong> Once daily with meals</li>
                        <li>• <strong>Vitamin D3:</strong> 2000-4000 IU daily</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            // Non-Workout Plan
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-primary" />
                    Morning Routine (6-8 AM)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Start Your Day Right</h4>
                    <p className="text-muted-foreground mb-2">Begin with warm water + lemon for metabolism boost</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Breakfast Ideas</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      {isVeg ? (
                        <>
                          <li>• Oatmeal with nuts, seeds, and plant protein</li>
                          <li>• Whole wheat toast with avocado and tofu scramble</li>
                          <li>• Smoothie bowl with fruits, protein powder, and granola</li>
                        </>
                      ) : (
                        <>
                          <li>• Eggs (3-4) with whole wheat toast and avocado</li>
                          <li>• Oatmeal with whey protein and mixed berries</li>
                          <li>• Greek yogurt with granola and honey</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-fitness-green" />
                    Lunch (12-2 PM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">High-Protein Meals</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      {isVeg ? (
                        <>
                          <li>• Brown rice + lentil dal + mixed vegetables + salad</li>
                          <li>• Quinoa bowl with chickpeas, paneer, and tahini dressing</li>
                          <li>• Whole wheat pasta with tofu and vegetable sauce</li>
                        </>
                      ) : (
                        <>
                          <li>• Grilled chicken breast + brown rice + vegetables</li>
                          <li>• Salmon + quinoa + leafy greens</li>
                          <li>• Lean beef + sweet potato + broccoli</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-accent" />
                    Evening Snack (4-5 PM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Handful of mixed nuts (almonds, walnuts, cashews)</li>
                    <li>• Protein shake with banana</li>
                    <li>• Greek yogurt with berries</li>
                    <li>• Boiled eggs or hummus with veggie sticks</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-secondary" />
                    Dinner (7-9 PM)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Light, High-Protein Meals</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      {isVeg ? (
                        <>
                          <li>• Paneer tikka with mixed salad and cucumber raita</li>
                          <li>• Tofu stir-fry with vegetables and quinoa</li>
                          <li>• Chickpea curry with brown rice</li>
                        </>
                      ) : (
                        <>
                          <li>• Grilled fish + steamed vegetables + small portion of rice</li>
                          <li>• Chicken breast salad with olive oil dressing</li>
                          <li>• Turkey meatballs with zucchini noodles</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    Hydration & Daily Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Water Intake</h4>
                    <p className="text-muted-foreground">Aim for 3-4 liters throughout the day</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Key Principles</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Eat every 3-4 hours to maintain metabolism</li>
                      <li>• Never skip breakfast</li>
                      <li>• Keep dinner light and early</li>
                      <li>• Stay consistent with meal timing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NutritionRoadmap;
