import { Timer, Square, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedSeconds: number;
  onFinish: () => void;
  isFinishing?: boolean;
}

export const WorkoutHeader = ({ workoutName, elapsedSeconds, onFinish, isFinishing }: WorkoutHeaderProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{workoutName}</h1>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Timer className="w-3.5 h-3.5" />
              <span className="text-sm font-mono">{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onFinish}
          disabled={isFinishing}
          className="gap-2"
        >
          <Square className="w-4 h-4" />
          {isFinishing ? 'Saving...' : 'Finish'}
        </Button>
      </div>
    </header>
  );
};
