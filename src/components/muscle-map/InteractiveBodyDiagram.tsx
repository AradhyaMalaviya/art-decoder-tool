import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMuscleRoute, getExerciseGroupFromDiagramId } from "@/lib/muscleMapping";
import "./InteractiveBodyDiagram.css";

// ────────────────────────────────────────
// Muscle data with exercise counts & descriptions
// ────────────────────────────────────────
interface MuscleInfo {
  name: string;
  view: "front" | "back";
  exercises: number;
  description: string;
}

const muscleData: Record<string, MuscleInfo> = {
  neck: { name: "Neck", view: "front", exercises: 12, description: "The neck muscles support the head and enable a range of movements. Training includes neck curls, extensions, and isometric holds." },
  shoulders: { name: "Shoulders (Deltoids)", view: "front", exercises: 45, description: "The deltoids are responsible for arm rotation and lifting. Key exercises include shoulder press, lateral raises, and front raises." },
  chest: { name: "Chest (Pectorals)", view: "front", exercises: 52, description: "The pectoralis major and minor muscles are key for pushing movements. Train with bench press, push-ups, and chest flies." },
  biceps: { name: "Biceps", view: "front", exercises: 38, description: "The biceps brachii flexes the elbow and rotates the forearm. Classic exercises include barbell curls, hammer curls, and preacher curls." },
  forearms: { name: "Forearms", view: "front", exercises: 24, description: "Forearm muscles control wrist and finger movements. Build grip strength with wrist curls, reverse curls, and farmer walks." },
  abs: { name: "Abs (Rectus Abdominis)", view: "front", exercises: 67, description: 'The rectus abdominis is the "six-pack" muscle. Key exercises include crunches, leg raises, planks, and cable crunches.' },
  obliques: { name: "Obliques", view: "front", exercises: 34, description: "The oblique muscles enable torso rotation and lateral flexion. Train with Russian twists, side planks, and woodchops." },
  quads: { name: "Quadriceps", view: "front", exercises: 48, description: "The quadriceps extend the knee and are essential for walking, running, and jumping. Key exercises include squats, leg press, and lunges." },
  adductors: { name: "Adductors (Inner Thigh)", view: "front", exercises: 18, description: "The adductor muscles bring the legs together. Train with adductor machine, sumo squats, and Copenhagen planks." },
  calves_front: { name: "Calves (Tibialis)", view: "front", exercises: 22, description: "The tibialis anterior on the front of the lower leg helps with dorsiflexion. Train with toe raises and tibialis raises." },
  traps: { name: "Trapezius", view: "back", exercises: 28, description: "The trapezius extends from the neck to the mid-back. Key exercises include shrugs, face pulls, and upright rows." },
  rear_delts: { name: "Rear Deltoids", view: "back", exercises: 22, description: "The posterior deltoid is crucial for shoulder stability. Train with reverse flies, face pulls, and rear delt rows." },
  lats: { name: "Latissimus Dorsi", view: "back", exercises: 42, description: "The lats are the largest back muscles, enabling pulling movements. Key exercises include pull-ups, lat pulldowns, and rows." },
  rhomboids: { name: "Rhomboids", view: "back", exercises: 26, description: "The rhomboids retract the scapula. Strengthen with rows, reverse flies, and scapular squeezes." },
  lower_back: { name: "Lower Back (Erector Spinae)", view: "back", exercises: 32, description: "The erector spinae muscles run along the spine. Train with deadlifts, back extensions, and good mornings." },
  triceps: { name: "Triceps", view: "back", exercises: 36, description: "The triceps brachii extends the elbow. Key exercises include tricep dips, pushdowns, skull crushers, and close-grip bench press." },
  glutes: { name: "Glutes", view: "back", exercises: 44, description: "The gluteus muscles are the largest in the body. Build with hip thrusts, squats, deadlifts, and glute bridges." },
  hamstrings: { name: "Hamstrings", view: "back", exercises: 38, description: "The hamstrings flex the knee and extend the hip. Key exercises include Romanian deadlifts, leg curls, and Nordic curls." },
  calves_back: { name: "Calves (Gastrocnemius)", view: "back", exercises: 22, description: "The gastrocnemius and soleus enable plantar flexion. Train with standing and seated calf raises." },
};

// Map new diagram IDs to closest existing exercise route IDs
const routeMuscleMap: Record<string, string> = {
  neck: "shoulders",
  shoulders: "shoulders",
  chest: "chest",
  biceps: "biceps",
  forearms: "forearms",
  abs: "abs",
  obliques: "obliques",
  quads: "quads",
  adductors: "quads",
  calves_front: "calves",
  traps: "traps",
  rear_delts: "shoulders",
  lats: "lats",
  rhomboids: "back",
  lower_back: "lower_back",
  triceps: "triceps",
  glutes: "glutes",
  hamstrings: "hamstrings",
  calves_back: "calves",
};

// ────────────────────────────────────────
// SVG Generators
// ────────────────────────────────────────
interface MusclePathProps {
  d: string;
  muscle: string;
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onMouseEnter: (e: React.MouseEvent, muscleId: string) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onClick: (muscleId: string) => void;
}

const MusclePath = ({ d, muscle, hoveredMuscle, selectedMuscle, onMouseEnter, onMouseLeave, onMouseMove, onClick }: MusclePathProps) => {
  const classes = [
    "muscle-group",
    hoveredMuscle === muscle ? "hover" : "",
    selectedMuscle === muscle ? "active" : "",
  ].filter(Boolean).join(" ");

  return (
    <path
      d={d}
      className={classes}
      data-muscle={muscle}
      onMouseEnter={(e) => onMouseEnter(e, muscle)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onClick={() => onClick(muscle)}
      onTouchStart={(e) => { e.preventDefault(); onClick(muscle); }}
    />
  );
};

interface BodySVGProps {
  isMale: boolean;
  hoveredMuscle: string | null;
  selectedMuscle: string | null;
  onMouseEnter: (e: React.MouseEvent, muscleId: string) => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onClick: (muscleId: string) => void;
}

const FrontBodySVG = (props: BodySVGProps) => {
  const { isMale, ...handlers } = props;
  const mp = (d: string, muscle: string) => (
    <MusclePath key={`${muscle}-${d.slice(0,30)}`} d={d} muscle={muscle} {...handlers} />
  );

  return (
    <svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGradientFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3a3a4a", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#2a2a35", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Head */}
      <ellipse cx="100" cy="28" rx={isMale ? 20 : 19} ry="24" className="body-base" />

      {/* Neck */}
      {mp("M90 50 L90 68 L110 68 L110 50", "neck")}

      {/* Traps (Front) */}
      {mp("M90 68 L76 75 L76 82 L90 76 Z", "traps")}
      {mp("M110 68 L124 75 L124 82 L110 76 Z", "traps")}

      {/* Shoulders */}
      {mp("M76 75 Q60 78 48 90 Q42 105 45 120 L58 118 Q62 100 68 88 L76 82 Z", "shoulders")}
      {mp("M124 75 Q140 78 152 90 Q158 105 155 120 L142 118 Q138 100 132 88 L124 82 Z", "shoulders")}

      {/* Chest */}
      {mp("M76 82 Q68 85 65 95 Q63 108 68 116 L85 118 Q92 112 100 110 Q100 90 76 82", "chest")}
      {mp("M124 82 Q132 85 135 95 Q137 108 132 116 L115 118 Q108 112 100 110 Q100 90 124 82", "chest")}

      {/* Abs */}
      {mp("M85 120 L85 135 L100 135 L100 118 Q92 116 85 120", "abs")}
      {mp("M115 120 L115 135 L100 135 L100 118 Q108 116 115 120", "abs")}
      {mp("M85 135 L85 152 L100 152 L100 135 Z", "abs")}
      {mp("M115 135 L115 152 L100 152 L100 135 Z", "abs")}
      {mp("M85 152 L85 168 Q92 172 100 172 L100 152 Z", "abs")}
      {mp("M115 152 L115 168 Q108 172 100 172 L100 152 Z", "abs")}

      {/* Obliques */}
      {mp("M68 116 Q65 140 68 168 L85 168 L85 120 Q76 116 68 116", "obliques")}
      {mp("M132 116 Q135 140 132 168 L115 168 L115 120 Q124 116 132 116", "obliques")}

      {/* Biceps */}
      {mp("M45 120 Q38 128 35 145 Q35 165 42 175 L52 172 Q55 155 55 140 Q56 125 58 118 L45 120", "biceps")}
      {mp("M155 120 Q162 128 165 145 Q165 165 158 175 L148 172 Q145 155 145 140 Q144 125 142 118 L155 120", "biceps")}

      {/* Forearms */}
      {mp("M42 175 Q35 190 30 215 Q28 240 32 255 L45 258 Q48 235 50 210 Q52 188 52 172 L42 175", "forearms")}
      {mp("M158 175 Q165 190 170 215 Q172 240 168 255 L155 258 Q152 235 150 210 Q148 188 148 172 L158 175", "forearms")}

      {/* Hands */}
      <path d="M32 255 Q25 260 22 275 Q25 285 35 288 Q45 285 48 275 Q48 262 45 258 L32 255" className="body-base" />
      <path d="M168 255 Q175 260 178 275 Q175 285 165 288 Q155 285 152 275 Q152 262 155 258 L168 255" className="body-base" />

      {/* Hip */}
      <path d="M68 168 Q68 180 65 195 Q75 210 100 215 Q125 210 135 195 Q132 180 132 168 Q108 176 100 176 Q92 176 68 168" className="body-base" />

      {/* Adductors */}
      {mp("M85 200 L82 270 L94 270 L96 200 Q90 198 85 200", "adductors")}
      {mp("M115 200 L118 270 L106 270 L104 200 Q110 198 115 200", "adductors")}

      {/* Quads */}
      {mp("M65 195 Q52 220 48 250 Q48 275 52 295 L68 298 Q72 285 75 270 L82 270 L85 200 Q75 195 65 195", "quads")}
      {mp("M135 195 Q148 220 152 250 Q152 275 148 295 L132 298 Q128 285 125 270 L118 270 L115 200 Q125 195 135 195", "quads")}

      {/* Knees */}
      <ellipse cx="60" cy="305" rx="12" ry="8" className="body-base" />
      <ellipse cx="140" cy="305" rx="12" ry="8" className="body-base" />

      {/* Calves Front */}
      {mp("M52 310 Q48 335 50 360 L68 360 Q70 340 68 315 Q60 310 52 310", "calves_front")}
      {mp("M148 310 Q152 335 150 360 L132 360 Q130 340 132 315 Q140 310 148 310", "calves_front")}

      {/* Ankles */}
      <rect x="52" y="360" width="18" height="6" rx="2" className="body-base" />
      <rect x="130" y="360" width="18" height="6" rx="2" className="body-base" />

      {/* Feet */}
      <path d="M50 366 Q42 372 40 378 Q50 382 65 380 Q72 375 70 366 L50 366" className="body-base" />
      <path d="M150 366 Q158 372 160 378 Q150 382 135 380 Q128 375 130 366 L150 366" className="body-base" />
    </svg>
  );
};

const BackBodySVG = (props: BodySVGProps) => {
  const { isMale, ...handlers } = props;
  const mp = (d: string, muscle: string) => (
    <MusclePath key={`${muscle}-${d.slice(0,30)}`} d={d} muscle={muscle} {...handlers} />
  );
  const yOff = isMale ? 180 : 185;
  const yOff2 = isMale ? 185 : 190;

  return (
    <svg viewBox="0 0 200 380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3a3a4a", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#2a2a35", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Head */}
      <ellipse cx="100" cy="30" rx={isMale ? 23 : 22} ry="27" className="body-base" />
      <ellipse cx="75" cy="30" rx="4" ry="7" className="body-base" />
      <ellipse cx="125" cy="30" rx="4" ry="7" className="body-base" />

      {/* Neck */}
      {mp("M88 54 C88 58 88 68 88 68 L112 68 C112 68 112 58 112 54", "neck")}

      {/* Upper Traps */}
      {mp("M88 68 Q100 62 112 68 L130 82 Q100 75 70 82 Z", "traps")}
      {/* Middle Traps */}
      {mp("M70 82 Q100 75 130 82 L125 110 Q100 105 75 110 Z", "traps")}

      {/* Rear Delts */}
      {mp("M70 82 L55 88 Q42 100 40 120 L55 125 Q60 105 70 95 L70 82", "rear_delts")}
      {mp("M130 82 L145 88 Q158 100 160 120 L145 125 Q140 105 130 95 L130 82", "rear_delts")}

      {/* Rhomboids */}
      {mp("M78 110 L78 135 Q100 130 122 135 L122 110 Q100 105 78 110", "rhomboids")}

      {/* Lats */}
      {mp(`M55 125 Q50 145 52 170 L70 ${yOff} L78 135 Q70 125 55 125`, "lats")}
      {mp(`M145 125 Q150 145 148 170 L130 ${yOff} L122 135 Q130 125 145 125`, "lats")}

      {/* Triceps */}
      {mp("M40 120 Q35 140 38 165 Q42 175 50 175 Q55 165 55 140 Q55 128 55 125 L40 120", "triceps")}
      {mp("M160 120 Q165 140 162 165 Q158 175 150 175 Q145 165 145 140 Q145 128 145 125 L160 120", "triceps")}

      {/* Lower Back */}
      {mp(`M78 135 Q100 130 122 135 L130 ${yOff} Q100 ${yOff2} 70 ${yOff} Z`, "lower_back")}

      {/* Forearms */}
      <path d="M50 175 Q38 185 32 215 Q30 240 35 255 Q42 258 48 252 Q52 230 55 200 Q55 185 50 175" className="body-base" />
      <path d="M150 175 Q162 185 168 215 Q170 240 165 255 Q158 258 152 252 Q148 230 145 200 Q145 185 150 175" className="body-base" />

      {/* Hands */}
      <ellipse cx="35" cy="268" rx="8" ry="14" className="body-base" />
      <ellipse cx="165" cy="268" rx="8" ry="14" className="body-base" />

      {/* Glutes */}
      {mp(`M70 ${yOff} Q60 195 58 215 Q60 235 75 240 Q90 235 100 225 Q100 ${yOff2} 70 ${yOff}`, "glutes")}
      {mp(`M130 ${yOff} Q140 195 142 215 Q140 235 125 240 Q110 235 100 225 Q100 ${yOff2} 130 ${yOff}`, "glutes")}

      {/* Hamstrings */}
      {mp("M58 240 Q55 270 55 300 Q58 312 68 315 L85 315 Q88 290 88 260 Q85 245 75 240 Q65 238 58 240", "hamstrings")}
      {mp("M142 240 Q145 270 145 300 Q142 312 132 315 L115 315 Q112 290 112 260 Q115 245 125 240 Q135 238 142 240", "hamstrings")}

      {/* Knees */}
      <ellipse cx="70" cy="320" rx="14" ry="8" className="body-base" />
      <ellipse cx="130" cy="320" rx="14" ry="8" className="body-base" />

      {/* Calves Back */}
      {mp("M55 325 Q52 342 55 358 Q60 368 72 368 Q82 365 85 358 Q88 342 85 325 Q72 330 55 325", "calves_back")}
      {mp("M145 325 Q148 342 145 358 Q140 368 128 368 Q118 365 115 358 Q112 342 115 325 Q128 330 145 325", "calves_back")}

      {/* Ankles */}
      <rect x="62" y="368" width="18" height="8" rx="3" className="body-base" />
      <rect x="120" y="368" width="18" height="8" rx="3" className="body-base" />

      {/* Feet */}
      <ellipse cx="71" cy="380" rx="14" ry="5" className="body-base" />
      <ellipse cx="129" cy="380" rx="14" ry="5" className="body-base" />
    </svg>
  );
};

// ────────────────────────────────────────
// Main Component
// ────────────────────────────────────────
export const InteractiveBodyDiagram = () => {
  const navigate = useNavigate();

  // State
  const [currentGender, setCurrentGender] = useState<"male" | "female">("male");
  const [currentView, setCurrentView] = useState<"front" | "back">("front");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  // Tooltip
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Animated count
  const [displayCount, setDisplayCount] = useState(0);
  const animRef = useRef<number | null>(null);

  // Window width for responsive
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Animate count
  const animateCount = useCallback((target: number) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startTime = performance.now();
    const startVal = displayCount;
    const duration = 500;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(startVal + (target - startVal) * easeOut));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(update);
      }
    };
    animRef.current = requestAnimationFrame(update);
  }, [displayCount]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Handlers
  const handleMouseEnter = useCallback((e: React.MouseEvent, muscleId: string) => {
    const data = muscleData[muscleId];
    if (!data) return;
    setHoveredMuscle(muscleId);
    setTooltipText(data.name);
    setTooltipVisible(true);
    setTooltipPos({ x: e.clientX + 15, y: e.clientY - 10 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredMuscle(null);
    setTooltipVisible(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX + 15, y: e.clientY - 10 });
  }, []);

  const handleClick = useCallback((muscleId: string) => {
    const data = muscleData[muscleId];
    if (!data) return;
    setSelectedMuscle(muscleId);
    animateCount(data.exercises);
  }, [animateCount]);

  const handleExplore = useCallback(() => {
    if (!selectedMuscle) return;
    const routeId = routeMuscleMap[selectedMuscle] || selectedMuscle;
    // Use existing route system
    const exerciseGroup = getExerciseGroupFromDiagramId(routeId);
    if (exerciseGroup) {
      navigate(getMuscleRoute(routeId));
    } else {
      // Fallback: navigate with the ID directly
      navigate(`/exercises/${routeId}`);
    }
  }, [selectedMuscle, navigate]);

  const isMale = currentGender === "male";
  const selectedData = selectedMuscle ? muscleData[selectedMuscle] : null;

  const svgHandlers = {
    hoveredMuscle,
    selectedMuscle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    onClick: handleClick,
  };

  return (
    <>
      <div className="musclemap-root">
        {/* Header */}
        <header className="mm-header">
          <div className="mm-logo">
            <div className="mm-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
                <path d="M9 21l3-5 3 5" />
                <path d="M6 15l-2 6" />
                <path d="M18 15l2 6" />
              </svg>
            </div>
            <span className="mm-logo-text">MuscleMap</span>
          </div>

          <div className="mm-header-controls">
            <div className="mm-toggle-group">
              <button
                className={`mm-toggle-btn ${currentGender === "male" ? "active" : ""}`}
                onClick={() => setCurrentGender("male")}
                title="Male"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="14" r="5" />
                  <line x1="19" y1="5" x2="13.5" y2="10.5" />
                  <polyline points="15,5 19,5 19,9" />
                </svg>
              </button>
              <button
                className={`mm-toggle-btn ${currentGender === "female" ? "active" : ""}`}
                onClick={() => setCurrentGender("female")}
                title="Female"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="5" />
                  <line x1="12" y1="13" x2="12" y2="21" />
                  <line x1="9" y1="18" x2="15" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mm-main-content">
          {/* Instruction */}
          <div className="mm-instruction-banner">
            <p>
              👆 <strong>Hover</strong> over a muscle to highlight it •{" "}
              <strong>Click</strong> to see exercises
            </p>
          </div>

          {/* Mobile View Toggle */}
          {isMobile && (
            <div className="mm-mobile-view-toggle" style={{ display: "flex" }}>
              <button
                className={`mm-view-toggle-btn ${currentView === "front" ? "active" : ""}`}
                onClick={() => setCurrentView("front")}
              >
                Front
              </button>
              <button
                className={`mm-view-toggle-btn ${currentView === "back" ? "active" : ""}`}
                onClick={() => setCurrentView("back")}
              >
                Back
              </button>
            </div>
          )}

          {/* Body Diagram */}
          <div className="mm-body-diagram-container">
            {/* Front View */}
            {(!isMobile || currentView === "front") && (
              <div className="mm-body-view visible">
                <h3 className="mm-view-label">Front</h3>
                <div className="mm-body-wrapper">
                  <FrontBodySVG isMale={isMale} {...svgHandlers} />
                </div>
              </div>
            )}

            {/* Back View */}
            {(!isMobile || currentView === "back") && (
              <div className="mm-body-view visible">
                <h3 className="mm-view-label">Back</h3>
                <div className="mm-body-wrapper">
                  <BackBodySVG isMale={isMale} {...svgHandlers} />
                </div>
              </div>
            )}
          </div>

          {/* Muscle Info Panel */}
          <div className={`mm-muscle-info-panel ${selectedData ? "active" : ""}`}>
            <div className="mm-panel-header">
              <h2 className="mm-muscle-name">
                {selectedData ? selectedData.name : "Select a Muscle"}
              </h2>
              <span
                className={`mm-muscle-badge ${selectedData ? selectedData.view : ""}`}
              >
                {selectedData ? selectedData.view : "--"}
              </span>
            </div>
            <div className="mm-panel-body">
              <p className="mm-muscle-description">
                {selectedData
                  ? selectedData.description
                  : "Hover over or click on any muscle group on the body diagram to learn more about it and discover targeted exercises."}
              </p>
              <div className="mm-exercise-count">
                <span className="mm-count-number">{displayCount}</span>
                <span className="mm-count-label">Exercises Available</span>
              </div>
              <button
                className="mm-explore-btn"
                disabled={!selectedMuscle}
                onClick={handleExplore}
              >
                <span>Explore Exercises</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mm-footer">
          <p>Interactive anatomy diagram for fitness enthusiasts</p>
        </footer>
      </div>

      {/* Tooltip (rendered outside root for fixed positioning) */}
      <div
        className={`mm-tooltip ${tooltipVisible ? "visible" : ""}`}
        style={{ left: tooltipPos.x, top: tooltipPos.y }}
      >
        {tooltipText}
      </div>
    </>
  );
};
