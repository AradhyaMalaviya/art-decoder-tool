import { useGymBuddyStreak } from "@/hooks/useGymBuddyStreak";
import { Flame, Medal, Award, Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function WorkoutStreak({ matchId }: { matchId: string }) {
  const { streak, hasLoggedThisWeek, loading } = useGymBuddyStreak(matchId);

  if (loading) return <div className="h-20 animate-pulse bg-muted rounded-xl border"></div>;

  let milestoneIcon = null;
  let milestoneText = "";
  
  if (streak >= 26) {
    milestoneIcon = <Crown className="w-5 h-5 text-yellow-500" />;
    milestoneText = "6 Months!";
  } else if (streak >= 12) {
    milestoneIcon = <Award className="w-5 h-5 text-zinc-400" />;
    milestoneText = "3 Months!";
  } else if (streak >= 4) {
    milestoneIcon = <Medal className="w-5 h-5 text-amber-600" />;
    milestoneText = "1 Month!";
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-xl border">
       <div className="flex justify-between items-center">
         <div className="flex items-center gap-3">
           <div className={`p-2 rounded-full ${streak > 0 ? 'bg-orange-500/20 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
             <Flame className="w-5 h-5" />
           </div>
           <div>
             <div className="font-bold">{streak} Week{streak !== 1 ? 's' : ''}</div>
             <div className="text-xs text-muted-foreground">Shared Streak</div>
           </div>
         </div>
         {milestoneIcon && (
           <div className="flex flex-col items-center">
             {milestoneIcon}
             <span className="text-[10px] font-semibold text-muted-foreground mt-1">{milestoneText}</span>
           </div>
         )}
       </div>
       
       <div className="mt-2 space-y-2">
         <div className="flex justify-between text-xs">
           <span className="text-muted-foreground">This week</span>
           <span className={hasLoggedThisWeek ? "text-green-500 font-medium" : "text-muted-foreground"}>
             {hasLoggedThisWeek ? "Completed" : "Pending"}
           </span>
         </div>
         <Progress value={hasLoggedThisWeek ? 100 : 0} className="h-1.5" />
       </div>
    </div>
  );
}
