import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Utensils, Droplets, Pill, Download, ArrowRightLeft, IndianRupee } from "lucide-react";
import {
  getFoodsByMealRole,
  getFoodsByDietType,
  bulkingDayPlan,
  cuttingDayPlan,
  proteinSwaps,
  type FoodItem,
  type DietType
} from "@/data/indianFoodDatabase";

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
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const age = parseFloat(data.age);

    const bmr = data.gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultiplier = data.activityLevel === "sedentary" ? 1.2
      : data.activityLevel === "moderate" ? 1.55 : 1.725;

    let tdee = bmr * activityMultiplier;

    if (data.goal === "bulk") tdee += 500;
    else if (data.goal === "lean-bulk") tdee += 250;

    setCalories(Math.round(tdee));

    const protein = Math.round(weight * 2.2);
    const fats = Math.round((tdee * 0.25) / 9);
    const carbs = Math.round((tdee - (protein * 4) - (fats * 9)) / 4);

    setMacros({ protein, carbs, fats });
  };

  const getDietType = (): DietType => {
    if (userData?.dietaryPreference === "vegan") return "vegan";
    if (userData?.dietaryPreference === "vegetarian") return "veg";
    return "non-veg";
  };

  const getFilteredFoods = (role: string): FoodItem[] => {
    const dietType = getDietType();
    const allFoodsForRole = getFoodsByMealRole(role as Parameters<typeof getFoodsByMealRole>[0]);

    if (dietType === "vegan") {
      return allFoodsForRole.filter(f => f.dietType === "vegan");
    }
    if (dietType === "veg") {
      return allFoodsForRole.filter(f => f.dietType === "veg" || f.dietType === "vegan");
    }
    return allFoodsForRole;
  };

  const FoodCard = ({ food }: { food: FoodItem }) => (
    <div className="bg-card/50 border border-border/50 rounded-lg p-3 hover:bg-card/80 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-medium text-sm">{food.name}</h5>
        <span className={`text-xs px-2 py-0.5 rounded-full ${food.dietType === 'vegan' ? 'bg-green-500/20 text-green-400' :
            food.dietType === 'veg' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-red-500/20 text-red-400'
          }`}>
          {food.dietType === 'non-veg' ? '🔴' : '🟢'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{food.serving}</p>
      <div className="grid grid-cols-4 gap-1 text-xs">
        <div className="text-center">
          <div className="font-semibold text-primary">{food.protein}g</div>
          <div className="text-muted-foreground">Protein</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-accent">{food.carbs}g</div>
          <div className="text-muted-foreground">Carbs</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-secondary">{food.fat}g</div>
          <div className="text-muted-foreground">Fat</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-fitness-green">{food.calories}</div>
          <div className="text-muted-foreground">kcal</div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <IndianRupee className="w-3 h-3" />
        <span>{food.costRange}</span>
      </div>
    </div>
  );

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
  const currentMealPlan = userData.goal === "bulk" || userData.goal === "lean-bulk" ? bulkingDayPlan : cuttingDayPlan;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 primary-gradient bg-clip-text text-transparent">
              Your Personalized Indian Nutrition Roadmap 🇮🇳
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {planType === "workout" ? "Optimized for training and recovery with desi foods" : "Focused on muscle building through Indian nutrition"}
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

          {/* Sample Day Plan */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Sample {userData.goal === "bulk" || userData.goal === "lean-bulk" ? "Bulking" : "Cutting"} Day Plan
              </CardTitle>
              <CardDescription>
                {userData.goal === "bulk" || userData.goal === "lean-bulk"
                  ? "~2800-3000 kcal • ~175-185g protein"
                  : "~1600-1900 kcal • ~130-150g protein"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Meal</th>
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-left py-2 px-3">Foods</th>
                      <th className="text-left py-2 px-3">Protein</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMealPlan.map((item, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-card/50">
                        <td className="py-3 px-3 font-medium">{item.meal}</td>
                        <td className="py-3 px-3 text-muted-foreground">{item.time}</td>
                        <td className="py-3 px-3">{item.foods}</td>
                        <td className="py-3 px-3 text-primary font-semibold">{item.protein}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Content Based on Plan Type */}
          {planType === "workout" ? (
            <Tabs defaultValue="pre-workout" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="pre-workout">Pre-Workout</TabsTrigger>
                <TabsTrigger value="post-workout">Post-Workout</TabsTrigger>
                <TabsTrigger value="rest-day">Rest Day</TabsTrigger>
                <TabsTrigger value="supplements">Supplements</TabsTrigger>
                <TabsTrigger value="swaps">Food Swaps</TabsTrigger>
              </TabsList>

              <TabsContent value="pre-workout" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Pre-Workout Nutrition (60-90 min before)
                    </CardTitle>
                    <CardDescription>
                      40% Carbs • 30% Protein • 30% Fats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredFoods("pre-workout").slice(0, 9).map(food => (
                        <FoodCard key={food.id} food={food} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="post-workout" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-fitness-green" />
                      Post-Workout Nutrition (30-45 min after)
                    </CardTitle>
                    <CardDescription>
                      50% Protein • 40% Carbs • 10% Fats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredFoods("post-workout").slice(0, 9).map(food => (
                        <FoodCard key={food.id} food={food} />
                      ))}
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
                      ~{Math.round(calories * 0.85)} calories (15% reduction) • Maintain {macros.protein}g protein
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {getFilteredFoods("rest-day").slice(0, 9).map(food => (
                        <FoodCard key={food.id} food={food} />
                      ))}
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
                        <li>• <strong>Whey/Plant Protein:</strong> 25-30g post-workout (₹40-100/serving)</li>
                        <li>• <strong>Creatine Monohydrate:</strong> 5g daily (₹10-20/serving)</li>
                        <li>• <strong>Fish Oil/Omega-3:</strong> 2-3g daily</li>
                        <li>• <strong>Multivitamin:</strong> Once daily with meals</li>
                        <li>• <strong>Vitamin D3:</strong> 2000-4000 IU daily</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Desi Alternatives</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• <strong>Sattu:</strong> Natural pre-workout (₹6-15/serving)</li>
                        <li>• <strong>Coconut Water:</strong> Post-workout hydration (₹20-50)</li>
                        <li>• <strong>Buttermilk (Chaas):</strong> Rest day recovery (₹8-20)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="swaps" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRightLeft className="w-5 h-5 text-primary" />
                      Protein-Equivalent Food Swaps
                    </CardTitle>
                    <CardDescription>
                      Easily swap foods based on your diet preference or budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {proteinSwaps.map((swap, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/50">
                          <div className="flex-1 text-sm font-medium">{swap.item1}</div>
                          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                          <div className="flex-1 text-sm font-medium">{swap.item2}</div>
                          <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                            {swap.proteinDiff}
                          </div>
                        </div>
                      ))}
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
                    Morning (6-8 AM) 🌅
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Start with warm water + lemon for metabolism boost</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getFilteredFoods("breakfast").slice(0, 6).map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-fitness-green" />
                    Lunch (12-2 PM) 🍛
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getFilteredFoods("main-meal").slice(0, 6).map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-accent" />
                    Snacks (4-5 PM) 🥜
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {getFilteredFoods("snack").slice(0, 6).map(food => (
                      <FoodCard key={food.id} food={food} />
                    ))}
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

              {/* Food Swaps for Non-Workout */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    Protein-Equivalent Swaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {proteinSwaps.slice(0, 5).map((swap, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-card/50 rounded-lg border border-border/50">
                        <div className="flex-1 text-sm font-medium">{swap.item1}</div>
                        <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 text-sm font-medium">{swap.item2}</div>
                        <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                          {swap.proteinDiff}
                        </div>
                      </div>
                    ))}
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
