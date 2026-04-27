import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useGymBuddyChat } from "@/hooks/useGymBuddyChat";
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, ArrowLeft, Check, CheckCheck, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkoutStreak } from "@/components/gymbuddy/WorkoutStreak";
import { GymBuddySessionModal } from "@/components/gymbuddy/GymBuddySessionModal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function GymBuddyChat() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { messages, loading, partner, sendMessage } = useGymBuddyChat(matchId || '');
  
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    try {
      setSending(true);
      await sendMessage(inputValue);
      setInputValue("");
    } catch (err: unknown) {
      toast({
        title: "Failed to send message",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  if (loading || !partner) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background h-screen overflow-hidden">
      <Header />
      
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate('/gymbuddy/matches')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={partner.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {partner.display_name?.substring(0,2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{partner.display_name}</h2>
          <p className="text-xs text-muted-foreground truncate">{partner.gym_location}</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 text-orange-500">
              <Target className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Match Details</SheetTitle>
            </SheetHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Shared Streak</h3>
                <WorkoutStreak matchId={matchId!} />
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  onClick={() => setSessionModalOpen(true)}
                >
                  Log Session
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <GymBuddySessionModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        matchId={matchId!}
        partnerName={partner.display_name}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
            <div className="bg-background rounded-full p-4 mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <p className="text-sm">Say hello to {partner.display_name}!</p>
            <p className="text-xs mt-1">Plan your next workout session together.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === user?.id;
            const showTime = index === 0 || 
              new Date(msg.sent_at!).getTime() - new Date(messages[index - 1].sent_at!).getTime() > 5 * 60 * 1000;
              
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {showTime && (
                  <span className="text-[10px] text-muted-foreground mb-1 mx-2">
                    {format(new Date(msg.sent_at!), 'MMM d, h:mm a')}
                  </span>
                )}
                <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMe && (
                    <Avatar className="h-6 w-6 shrink-0 mb-1">
                      <AvatarImage src={partner.avatar_url} />
                      <AvatarFallback className="text-[8px]">{partner.display_name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      isMe 
                        ? 'bg-primary text-primary-foreground rounded-br-sm' 
                        : 'bg-card text-card-foreground border rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                    {isMe && (
                      <span className="ml-2 inline-flex items-center align-middle opacity-70">
                        {msg.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${partner.display_name}...`}
            className="flex-1 rounded-full bg-muted/50 focus-visible:ring-primary/50"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputValue.trim() || sending}
            className="rounded-full shrink-0 shadow-sm"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
