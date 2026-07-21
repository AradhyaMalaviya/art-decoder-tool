import { useEffect } from "react";
import { GymBuddyProfile } from "@/lib/gymBuddyTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface GymBuddyMatchOverlayProps {
  currentUser: GymBuddyProfile;
  partner: GymBuddyProfile;
  onClose: () => void;
  onMessage: () => void;
}

export function GymBuddyMatchOverlay({ currentUser, partner, onClose, onMessage }: GymBuddyMatchOverlayProps) {
  useEffect(() => {
    // Haptic feedback
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate([15, 30, 15, 30]);
    }
    
    // Confetti burst
    const duration = 3000;
    const end = Date.now() + duration;
    let animationId: number;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#f97316', '#3b82f6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#f97316', '#3b82f6']
      });

      if (Date.now() < end) {
        animationId = requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="text-center p-6 max-w-md w-full">
        <h1 className="text-5xl font-black text-primary mb-2 transform -rotate-2">It's a Match! 🎉</h1>
        <p className="text-xl text-muted-foreground mb-12">You and {partner.display_name} have liked each other.</p>
        
        <div className="flex justify-center items-center gap-6 mb-12">
          <Avatar className="w-32 h-32 border-4 border-primary shadow-2xl bg-muted z-10">
            <AvatarImage src={currentUser.avatar_url} />
            <AvatarFallback className="text-4xl text-primary font-bold">{(currentUser.display_name || '').substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Avatar className="w-32 h-32 border-4 border-primary shadow-2xl bg-muted z-10">
            <AvatarImage src={partner.avatar_url} />
            <AvatarFallback className="text-4xl text-primary font-bold">{(partner.display_name || '').substring(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4 relative z-10">
          <Button size="lg" className="w-full text-lg h-14 rounded-full shadow-lg" onClick={onMessage}>
            <MessageCircle className="mr-2 h-5 w-5" />
            Start Chatting
          </Button>
          <Button variant="ghost" size="lg" className="w-full rounded-full" onClick={onClose}>
            Keep Swiping
          </Button>
        </div>
      </div>
    </div>
  );
}
