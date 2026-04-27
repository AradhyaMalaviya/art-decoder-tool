import React, { useState, useRef, useEffect } from 'react';
import { GymBuddyCandidate } from '@/lib/gymBuddyTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Heart, MapPin, Target, Dumbbell, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GymBuddyCardProps {
  candidate: GymBuddyCandidate;
  index: number; // 0 is top card
  onSwipe: (direction: 'left' | 'right', candidateId: string) => void;
}

export function GymBuddyCard({ candidate, index, onSwipe }: GymBuddyCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const SWIPE_THRESHOLD = 120;
  
  // Reset state if candidate changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setExitDirection(null);
  }, [candidate.id]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (index !== 0) return; // Only top card is draggable
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || index !== 0) return;
    
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || index !== 0) return;
    setIsDragging(false);
    
    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId);
    }

    if (dragOffset.x > SWIPE_THRESHOLD) {
      setExitDirection('right');
      setTimeout(() => onSwipe('right', candidate.id), 200);
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      setExitDirection('left');
      setTimeout(() => onSwipe('left', candidate.id), 200);
    } else {
      // Return to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (index !== 0) return;
    setExitDirection(direction);
    setTimeout(() => onSwipe(direction, candidate.id), 200);
  };

  // Stack styling
  const isTop = index === 0;
  const scale = exitDirection ? 1 : Math.max(0, 1 - index * 0.05);
  const translateY = exitDirection ? 0 : index * 10;
  
  // Drag styling
  const xPos = exitDirection === 'left' ? -window.innerWidth : exitDirection === 'right' ? window.innerWidth : dragOffset.x;
  const rotate = xPos * 0.05; // 5 deg per 100px
  
  const style: React.CSSProperties = {
    transform: `translate(${xPos}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    zIndex: 100 - index,
    position: index === 0 ? 'relative' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    touchAction: 'none', // Prevent scrolling on touch devices while dragging
    opacity: index > 2 ? 0 : 1, // Only show 3 cards max
    pointerEvents: isTop ? 'auto' : 'none'
  };

  const formatName = (str: string) => {
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const initials = candidate.display_name.substring(0, 2).toUpperCase();

  return (
    <Card 
      ref={cardRef}
      className="w-full max-w-sm mx-auto h-[600px] flex flex-col overflow-hidden bg-card/95 backdrop-blur-sm border-2 shadow-xl select-none"
      style={style}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe overlays */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: dragOffset.x > 50 ? Math.min((dragOffset.x - 50) / 100, 1) : 0 }}
      >
        <div className="border-4 border-green-500 text-green-500 text-4xl font-black px-6 py-2 rounded-xl transform -rotate-12 bg-background/50 backdrop-blur-sm">
          CONNECT 💪
        </div>
      </div>
      <div 
        className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: dragOffset.x < -50 ? Math.min((Math.abs(dragOffset.x) - 50) / 100, 1) : 0 }}
      >
        <div className="border-4 border-destructive text-destructive text-4xl font-black px-6 py-2 rounded-xl transform rotate-12 bg-background/50 backdrop-blur-sm">
          SKIP ✗
        </div>
      </div>

      {/* Card Content */}
      <div className="relative h-2/5 bg-muted flex items-center justify-center overflow-hidden">
        {candidate.avatar_url ? (
          <img src={candidate.avatar_url} alt={candidate.display_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">{initials}</span>
          </div>
        )}
        
        {/* Compatibility Score Overlay */}
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-primary">{candidate.compatibility_score}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{candidate.compatibility_label}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{candidate.display_name}, {candidate.age_range_min}-{candidate.age_range_max}</h2>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {candidate.gym_location}
            </div>
          </div>
          <Badge variant="secondary" className="uppercase text-xs tracking-wider">
            {candidate.experience_level}
          </Badge>
        </div>

        {candidate.bio && (
          <p className="text-sm italic border-l-2 border-primary/50 pl-3 text-muted-foreground">
            "{candidate.bio}"
          </p>
        )}

        <div className="space-y-3 mt-2">
          <div>
            <div className="flex items-center text-sm font-semibold mb-2">
              <Dumbbell className="w-4 h-4 mr-2 text-primary" />
              Workout Split
            </div>
            <Badge variant="outline">{formatName(candidate.workout_split)}</Badge>
          </div>

          <div>
            <div className="flex items-center text-sm font-semibold mb-2">
              <Target className="w-4 h-4 mr-2 text-primary" />
              Goals
            </div>
            <div className="flex flex-wrap gap-1">
              {candidate.fitness_goals.map(goal => (
                <Badge key={goal} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {formatName(goal)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center text-sm font-semibold mb-2">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Availability
            </div>
            <div className="flex flex-wrap gap-1">
              {candidate.preferred_timings.map(timing => (
                <Badge key={timing} variant="outline" className="border-muted-foreground/30">
                  {formatName(timing)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-background border-t flex justify-center gap-6 items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-110"
          onClick={(e) => { e.stopPropagation(); handleButtonSwipe('left'); }}
          disabled={!isTop}
        >
          <X className="w-6 h-6" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-14 h-14 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all hover:scale-110"
          onClick={(e) => { e.stopPropagation(); handleButtonSwipe('right'); }}
          disabled={!isTop}
        >
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </Card>
  );
}
