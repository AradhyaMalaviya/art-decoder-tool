import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, Users, Target, ShieldCheck, RefreshCw } from "lucide-react";
import { GymBuddyProfile } from "@/lib/gymBuddyTypes";

interface GymBuddyRadarProps {
  profile: GymBuddyProfile | null;
  onRadiusChange?: (radius: number) => void;
  isScanning?: boolean;
}

// Structured targets simulating nearby active fitness partners
const SIMULATED_TARGETS = [
  { id: 1, x: 25, y: 35, name: "Aarav", split: "PPL Split", dist: "1.2 km", gender: "male" },
  { id: 2, x: 70, y: 20, name: "Meera", split: "Upper/Lower", dist: "2.8 km", gender: "female" },
  { id: 3, x: 15, y: 75, name: "Kabir", split: "Bro Split", dist: "3.5 km", gender: "male" },
  { id: 4, x: 80, y: 65, name: "Riya", split: "Full Body", dist: "4.9 km", gender: "female" },
  { id: 5, x: 50, y: 80, name: "Rohan", split: "Strength Split", dist: "7.1 km", gender: "male" },
  { id: 6, x: 30, y: 15, name: "Ananya", split: "PPL Split", dist: "9.3 km", gender: "female" },
  { id: 7, x: 85, y: 40, name: "Dev", split: "Upper/Lower", dist: "14.2 km", gender: "male" },
  { id: 8, x: 10, y: 45, name: "Ishaan", split: "Flexible Split", dist: "18.5 km", gender: "male" },
];

// Dynamic phase messages to simulate smart intelligence filtering (hoisted to module scope)
const SCANNING_PHASES = [
  "Pulsating sonar locator online...",
  "Scanning nearby gym locations...",
  "Comparing training times & splits...",
  "Filtering by target experience level...",
  "Calculating Mifflin calorie goals synergy...",
  "Connecting real-time match streams...",
];

export function GymBuddyRadar({ profile, onRadiusChange, isScanning = true }: GymBuddyRadarProps) {
  const [radius, setRadius] = useState<number>(5);
  const [activeStep, setActiveStep] = useState<string>("Initializing secure radar sweep...");
  const [visibleTargets, setVisibleTargets] = useState(SIMULATED_TARGETS.slice(0, 4));
  const [hoveredTarget, setHoveredTarget] = useState<typeof SIMULATED_TARGETS[0] | null>(null);
  const [scanPing, setScanPing] = useState<boolean>(false);

  useEffect(() => {
    if (!isScanning) {
      setActiveStep("Idle. Pulse Scan to refresh targets.");
      return;
    }

    let phaseIndex = 0;
    const interval = setInterval(() => {
      setActiveStep(SCANNING_PHASES[phaseIndex]);
      phaseIndex = (phaseIndex + 1) % SCANNING_PHASES.length;
    }, 2500);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Adjust visible targets based on chosen search radius slider
  useEffect(() => {
    let count = 2;
    if (radius > 15) count = 8;
    else if (radius > 10) count = 6;
    else if (radius > 5) count = 4;
    
    setVisibleTargets(SIMULATED_TARGETS.slice(0, count));
    
    if (onRadiusChange) {
      onRadiusChange(radius);
    }
  }, [radius, onRadiusChange]);

  const triggerManualScan = () => {
    setScanPing(true);
    setActiveStep("Manual power sweep triggered!");
    setTimeout(() => {
      setScanPing(false);
      setActiveStep("Scanning nearby gym locations...");
    }, 1500);
  };

  const initials = (profile?.display_name || '').substring(0, 2).toUpperCase() || "FB";

  return (
    <div className="w-full max-w-sm mx-auto h-[600px] flex flex-col bg-card/95 backdrop-blur-md border border-border/80 rounded-3xl p-5 shadow-2xl overflow-hidden relative">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div className="flex items-center gap-2">
          <Compass className={`w-5 h-5 text-primary ${isScanning ? "animate-pulse" : ""}`} />
          <span className="text-sm font-bold tracking-wider uppercase text-muted-foreground">GymProximity Radar</span>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1 font-mono">
          <Users className="w-3.5 h-3.5" />
          {visibleTargets.length} Active
        </Badge>
      </div>

      {/* Radar Main Grid */}
      <div className="flex-1 relative rounded-full border border-border/40 bg-muted/10 overflow-hidden flex items-center justify-center p-4 aspect-square max-h-[310px] mx-auto w-full shadow-inner mb-6">
        
        {/* Radar Sweep Hand (Background Layer) */}
        {isScanning && (
          <div className="absolute inset-0 z-0 pointer-events-none radar-sweep-hand bg-conic-sweep opacity-20" />
        )}

        {/* Concentric Circle Guides */}
        <div className="absolute w-[85%] h-[85%] rounded-full border border-dashed border-border/30 flex items-center justify-center" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-border/20 flex items-center justify-center" />
        <div className="absolute w-[35%] h-[35%] rounded-full border border-dashed border-border/10 flex items-center justify-center" />
        
        {/* Crosshair grid lines */}
        <div className="absolute w-full h-[1px] bg-border/20 z-0" />
        <div className="absolute h-full w-[1px] bg-border/20 z-0" />

        {/* Dynamic Scan Ripple overlay */}
        {scanPing && (
          <div className="absolute inset-0 rounded-full border-4 border-primary/60 scale-100 opacity-100 transition-all duration-1000 ease-out animate-ping" />
        )}

        {/* Sonar pulses emanating from center */}
        {isScanning && (
          <>
            <div className="absolute w-12 h-12 rounded-full border border-primary/40 bg-primary/5 sonar-wave-1 pointer-events-none" />
            <div className="absolute w-12 h-12 rounded-full border border-primary/30 bg-primary/5 sonar-wave-2 pointer-events-none" />
            <div className="absolute w-12 h-12 rounded-full border border-primary/20 bg-primary/5 sonar-wave-3 pointer-events-none" />
          </>
        )}

        {/* Target dot highlights */}
        {visibleTargets.map((target) => (
          <div
            key={target.id}
            className="absolute z-20 cursor-pointer group"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            onMouseEnter={() => setHoveredTarget(target)}
            onMouseLeave={() => setHoveredTarget(null)}
          >
            {/* Glowing target point */}
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-orange-500 opacity-70 animate-ping group-hover:duration-300" />
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border border-background shadow-lg relative radar-target" />
            </div>
            
            {/* Target Label tooltip on hover */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border/60 text-popover-foreground text-[10px] py-1 px-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 font-semibold font-mono">
              {target.name} ({target.dist}) • <span className="text-primary">{target.split}</span>
            </div>
          </div>
        ))}

        {/* Center User Avatar */}
        <div className="relative z-30 shadow-2xl p-1 bg-background rounded-full border-2 border-primary">
          <Avatar className="w-14 h-14 bg-muted">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="font-bold text-primary bg-primary/10">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Target status tag display */}
      <div className="h-12 flex items-center justify-center text-center px-4 mb-4">
        {hoveredTarget ? (
          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span>Target acquired: {hoveredTarget.name} ({hoveredTarget.dist}) training {hoveredTarget.split}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold animate-pulse">
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
            <span>{activeStep}</span>
          </div>
        )}
      </div>

      {/* Controls Container */}
      <div className="space-y-4 pt-4 border-t border-border/60 mt-auto bg-card z-10">
        {/* Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">Search Distance Limit</span>
            <span className="font-mono text-primary font-bold">{radius} km</span>
          </div>
          <Slider
            defaultValue={[radius]}
            max={30}
            min={2}
            step={1}
            onValueChange={(val) => setRadius(val[0])}
            className="w-full cursor-pointer py-1"
          />
        </div>

        {/* Manual Scanner Sweep trigger */}
        <Button
          onClick={triggerManualScan}
          variant="outline"
          className="w-full text-xs font-bold tracking-wider rounded-xl hover:bg-muted border border-border/80 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Trigger Manual Sweep
        </Button>
      </div>

      {/* Embedded Conic Sweep background gradient styles */}
      <style>{`
        .bg-conic-sweep {
          background: conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.4) 0deg, rgba(59, 130, 246, 0) 90deg, rgba(59, 130, 246, 0) 360deg);
        }
      `}</style>
    </div>
  );
}
