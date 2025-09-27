import { Badge } from "@/components/ui/badge";

interface MuscleGroupFilterProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

const muscleGroups = [
  { name: 'All', color: 'primary' },
  { name: 'Chest', color: 'energetic-orange' },
  { name: 'Back', color: 'fitness-green' },
  { name: 'Legs', color: 'power-purple' },
  { name: 'Arms', color: 'electric-blue' },
  { name: 'Shoulders', color: 'accent' },
  { name: 'Core', color: 'secondary' },
];

export const MuscleGroupFilter = ({ selectedGroup, onGroupSelect }: MuscleGroupFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {muscleGroups.map((group) => (
        <Badge
          key={group.name}
          variant={selectedGroup === group.name ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
            selectedGroup === group.name 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'border-border/50 hover:border-primary/50 hover:bg-primary/10 hover:text-primary'
          }`}
          onClick={() => onGroupSelect(group.name)}
        >
          {group.name}
        </Badge>
      ))}
    </div>
  );
};