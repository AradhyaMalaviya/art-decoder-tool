import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { exercises } from "@/data/exercises";

type Message = { role: "user" | "assistant"; content: string };

// Get exercise recommendations based on body part
const getExercisesForBodyPart = (bodyPart: string) => {
    const normalizedPart = bodyPart.toLowerCase();

    // Map common terms to muscle groups
    const muscleGroupMap: Record<string, string> = {
        'chest': 'Chest',
        'back': 'Back',
        'legs': 'Legs',
        'leg': 'Legs',
        'arms': 'Arms',
        'arm': 'Arms',
        'bicep': 'Arms',
        'biceps': 'Arms',
        'tricep': 'Arms',
        'triceps': 'Arms',
        'shoulders': 'Shoulders',
        'shoulder': 'Shoulders',
        'core': 'Core',
        'abs': 'Core',
        'abdominals': 'Core',
    };

    const muscleGroup = Object.keys(muscleGroupMap).find(key =>
        normalizedPart.includes(key)
    );

    if (muscleGroup) {
        const targetGroup = muscleGroupMap[muscleGroup];
        return exercises.filter(e => e.muscleGroup === targetGroup);
    }

    return [];
};

// Format exercises for display
const formatExerciseList = (exerciseList: typeof exercises, difficulty?: string) => {
    let filtered = exerciseList;
    if (difficulty) {
        filtered = exerciseList.filter(e =>
            e.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
    }

    return filtered.slice(0, 5).map(e =>
        `• **${e.name}** (${e.difficulty}) - ${e.duration}, Equipment: ${e.equipment}`
    ).join('\n');
};

export const GymTrainerChat = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hey there, champ! 💪 I'm your personal gym trainer. What body part do you feel like working out today? We can hit chest, back, legs, arms, shoulders, or core!"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Generate AI-like response based on user input
    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Check if user is selecting a body part
        const bodyParts = ['chest', 'back', 'legs', 'leg', 'arms', 'arm', 'bicep', 'tricep', 'shoulders', 'shoulder', 'core', 'abs'];
        const mentionedBodyPart = bodyParts.find(part => lowerMessage.includes(part));

        if (mentionedBodyPart && !selectedBodyPart) {
            setSelectedBodyPart(mentionedBodyPart);
            const matchingExercises = getExercisesForBodyPart(mentionedBodyPart);

            if (matchingExercises.length > 0) {
                const beginnerExercises = formatExerciseList(matchingExercises, 'Beginner');
                const intermediateExercises = formatExerciseList(matchingExercises, 'Intermediate');

                return `Great choice! Let's build that ${mentionedBodyPart.charAt(0).toUpperCase() + mentionedBodyPart.slice(1)}! 🔥

Here are some exercises I recommend:

**For Beginners:**
${beginnerExercises || "• Check out our beginner-friendly options!"}

**For Intermediate:**
${intermediateExercises || "• Level up with these exercises!"}

What's your fitness level? Are you a beginner, intermediate, or advanced? I can give you more specific recommendations!`;
            }
        }

        // Check for difficulty level questions
        if (lowerMessage.includes('beginner') && selectedBodyPart) {
            const matchingExercises = getExercisesForBodyPart(selectedBodyPart);
            const beginnerList = formatExerciseList(matchingExercises, 'Beginner');

            return `Perfect! Starting smart is the key to long-term gains! 💪

Here are beginner-friendly ${selectedBodyPart} exercises:

${beginnerList}

**Pro Tips:**
• Focus on form over weight
• Start with 3 sets of 10-12 reps
• Rest 60-90 seconds between sets
• Don't forget to warm up!

Want me to explain how to do any of these exercises?`;
        }

        if ((lowerMessage.includes('intermediate') || lowerMessage.includes('advanced')) && selectedBodyPart) {
            const matchingExercises = getExercisesForBodyPart(selectedBodyPart);
            const level = lowerMessage.includes('advanced') ? 'Advanced' : 'Intermediate';
            const exerciseList = formatExerciseList(matchingExercises, level);

            return `Nice! Ready to push your limits! 🔥

Here are ${level.toLowerCase()} ${selectedBodyPart} exercises:

${exerciseList}

**Pro Tips:**
• Progressive overload is key - increase weight or reps each week
• ${level === 'Advanced' ? 'Consider supersets for intensity' : 'Focus on mind-muscle connection'}
• Aim for 4 sets of 8-12 reps
• Rest 90-120 seconds for compound movements

Which exercise do you want to learn more about?`;
        }

        // Check for "how to" or form questions
        if (lowerMessage.includes('how') || lowerMessage.includes('form') || lowerMessage.includes('technique')) {
            const mentionedExercise = exercises.find(e =>
                lowerMessage.includes(e.name.toLowerCase())
            );

            if (mentionedExercise) {
                return `Great question about **${mentionedExercise.name}**! Here's how to nail it:

**Exercise:** ${mentionedExercise.name}
**Target:** ${mentionedExercise.muscleGroup}
**Level:** ${mentionedExercise.difficulty}
**Sets/Reps:** ${mentionedExercise.duration}
**Equipment:** ${mentionedExercise.equipment}

${mentionedExercise.description || "Focus on controlled movements and proper breathing."}

**Form Tips:**
• Keep your core engaged throughout
• Control the movement - don't rush
• Breathe out on exertion
• If it hurts (sharp pain), stop immediately!

Ready to crush it? 💪 Anything else you want to know?`;
            }
        }

        // General fitness questions
        if (lowerMessage.includes('warm up') || lowerMessage.includes('warmup')) {
            return `Warming up is CRUCIAL! Here's a quick 5-minute routine:

1. **Jumping Jacks** - 30 seconds
2. **Arm Circles** - 20 seconds each direction
3. **Leg Swings** - 10 each leg
4. **Bodyweight Squats** - 10 reps
5. **Push-ups** - 5-10 reps

This gets blood flowing and reduces injury risk! 🔥

Ready to start your ${selectedBodyPart || 'workout'}?`;
        }

        if (lowerMessage.includes('rest') || lowerMessage.includes('recovery')) {
            return `Recovery is where the GAINS happen! 💤

**Rest Day Tips:**
• Sleep 7-9 hours for muscle repair
• Stay hydrated - aim for 2-3 liters daily
• Light stretching or walking is great
• Protein intake stays important on rest days

**Between Sets:**
• Compound exercises: 2-3 minutes
• Isolation exercises: 60-90 seconds
• Supersets: minimal rest

Your muscles grow when you rest, not when you lift! Need anything else?`;
        }

        // Default responses
        if (!selectedBodyPart) {
            return `I didn't catch which body part you want to train! 🤔

Pick one:
• **Chest** - Build that powerful upper body
• **Back** - Create that V-taper look
• **Legs** - Never skip leg day!
• **Arms** - Biceps and triceps gains
• **Shoulders** - Boulder shoulder time
• **Core** - Strong foundation

What's it gonna be, champ?`;
        }

        return `Great question! 💪 

I'm here to help you crush your ${selectedBodyPart} workout! You can ask me:
• Specific exercise recommendations
• How to perform exercises with proper form
• Tips for beginners or advanced trainers
• Warm-up and recovery advice

What do you want to know?`;
    };

    const sendMessage = async (overrideMessage?: string) => {
        const messageText = overrideMessage || input;
        if (!messageText.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: messageText };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        // Simulate AI thinking delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

        const response = generateResponse(messageText);
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
        setIsLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const resetChat = () => {
        setSelectedBodyPart(null);
        setMessages([
            {
                role: "assistant",
                content: "Hey there, champ! 💪 I'm your personal gym trainer. What body part do you feel like working out today? We can hit chest, back, legs, arms, shoulders, or core!"
            }
        ]);
    };

    // Render formatted message content
    const renderMessageContent = (content: string) => {
        // Convert **text** to bold
        const parts = content.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            // Handle line breaks
            return part.split('\n').map((line, j) => (
                <span key={`${i}-${j}`}>
                    {j > 0 && <br />}
                    {line}
                </span>
            ));
        });
    };

    // Only show for authenticated users
    if (!user) {
        return null;
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 z-50 animate-pulse"
                size="icon"
                title="Chat with your Gym Trainer"
            >
                <span className="text-2xl">💪</span>
            </Button>
        );
    }

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                onClick={() => setIsOpen(false)}
            />

            {/* Chat card */}
            <Card className="fixed bottom-6 right-6 w-[400px] h-[550px] flex flex-col shadow-2xl border-2 border-primary/50 bg-background z-[70]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💪</span>
                        <div>
                            <h3 className="font-bold">Your Gym Trainer</h3>
                            <p className="text-xs opacity-80">Always here to help you grow!</p>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetChat}
                            className="hover:bg-primary-foreground/20 text-primary-foreground h-8 w-8"
                            title="Start new conversation"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-primary-foreground/20 text-primary-foreground h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card/50">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-br-md"
                                        : "bg-background border border-border text-foreground rounded-bl-md"
                                    }`}
                            >
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {renderMessageContent(msg.content)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-background border border-border text-foreground rounded-2xl rounded-bl-md p-3 shadow-sm flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {!selectedBodyPart && messages.length <= 2 && (
                    <div className="px-4 pb-2 flex flex-wrap gap-2">
                        {['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core'].map(part => (
                            <Button
                                key={part}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                    sendMessage(part);
                                }}
                            >
                                {part}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-border bg-background rounded-b-lg">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask your trainer..."
                            disabled={isLoading}
                            className="flex-1 bg-card border-border focus:ring-primary"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </>
    );
};
