import { Dumbbell } from "lucide-react";

export function GymBuddyEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-[600px] w-full max-w-sm mx-auto p-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Dumbbell className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
      <p className="text-muted-foreground">
        No more gym partners nearby — check back soon 🏋️
      </p>
    </div>
  );
}
