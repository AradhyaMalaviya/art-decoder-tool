import { useState, useMemo } from 'react';
import { Search, Dumbbell } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { exercises } from '@/data/exercises';

interface AddExerciseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExercise: (exerciseName: string, exerciseId?: string) => void;
}

export const AddExerciseDrawer = ({ open, onOpenChange, onSelectExercise }: AddExerciseDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return exercises;
    return exercises.filter(
      ex =>
        ex.name.toLowerCase().includes(term) ||
        ex.muscleGroup.toLowerCase().includes(term) ||
        ex.equipment.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, typeof exercises> = {};
    filteredExercises.forEach(ex => {
      if (!groups[ex.muscleGroup]) {
        groups[ex.muscleGroup] = [];
      }
      groups[ex.muscleGroup].push(ex);
    });
    return groups;
  }, [filteredExercises]);

  const handleSelect = (exerciseName: string, exerciseId: string) => {
    onSelectExercise(exerciseName, exerciseId);
    setSearchTerm('');
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            Add Exercise
          </DrawerTitle>
          <DrawerDescription>
            Search and select an exercise to add to your workout
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 pb-6" style={{ maxHeight: '60vh' }}>
          {Object.keys(groupedExercises).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No exercises found
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedExercises).map(([muscleGroup, groupExercises]) => (
                <div key={muscleGroup}>
                  <h3 className="text-sm font-semibold text-primary mb-2 sticky top-0 bg-background py-1">
                    {muscleGroup}
                  </h3>
                  <div className="space-y-1">
                    {groupExercises.map(exercise => (
                      <Button
                        key={exercise.id}
                        variant="ghost"
                        className="w-full justify-start h-auto py-3 px-3 hover:bg-primary/10"
                        onClick={() => handleSelect(exercise.name, exercise.id)}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-foreground">{exercise.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {exercise.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {exercise.equipment}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
