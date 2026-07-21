import { GymBuddyRadar } from "./GymBuddyRadar";
import { useGymBuddy } from "@/hooks/useGymBuddy";
import { AlertCircle } from "lucide-react";

export function GymBuddyEmpty() {
  const { profile } = useGymBuddy();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 text-center space-y-6 animate-in fade-in duration-300">
      
      {/* Caught up message banner */}
      <div className="bg-muted/40 border border-border/80 p-4 rounded-2xl w-full flex items-start gap-3 text-left">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-foreground">You're all caught up!</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            There are no new training partners inside your active perimeter. Change your radius below to scan wider.
          </p>
        </div>
      </div>

      {/* Proximity Radar dashboard */}
      <GymBuddyRadar 
        profile={profile} 
        isScanning={false} 
      />
    </div>
  );
}
