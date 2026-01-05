import { Dumbbell, CircleDot, Wrench, Cable, Activity } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EquipmentFilterProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

const equipmentOptions = [
  { id: "Bodyweight", label: "Bodyweight", icon: Activity },
  { id: "Dumbbells", label: "Dumbbells", icon: Dumbbell },
  { id: "Barbell", label: "Barbell", icon: CircleDot },
  { id: "Cable Machine", label: "Cable Machine", icon: Cable },
  { id: "Machine", label: "Machine", icon: Wrench },
  { id: "Bench", label: "Bench", icon: Wrench },
  { id: "Pull-up Bar", label: "Pull-up Bar", icon: Activity },
  { id: "Kettlebell", label: "Kettlebell", icon: Dumbbell },
];

export const EquipmentFilter = ({
  selectedEquipment,
  onEquipmentChange,
}: EquipmentFilterProps) => {
  const handleToggle = (equipmentId: string) => {
    if (selectedEquipment.includes(equipmentId)) {
      onEquipmentChange(selectedEquipment.filter((e) => e !== equipmentId));
    } else {
      onEquipmentChange([...selectedEquipment, equipmentId]);
    }
  };

  const clearFilters = () => {
    onEquipmentChange([]);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Equipment</h3>
        {selectedEquipment.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-3">
        {equipmentOptions.map((equipment) => {
          const Icon = equipment.icon;
          const isSelected = selectedEquipment.includes(equipment.id);

          return (
            <div
              key={equipment.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
              onClick={() => handleToggle(equipment.id)}
            >
              <Checkbox
                id={equipment.id}
                checked={isSelected}
                onCheckedChange={() => handleToggle(equipment.id)}
                className="pointer-events-none"
              />
              <Icon className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <Label
                htmlFor={equipment.id}
                className={`text-sm cursor-pointer flex-1 ${
                  isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {equipment.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
