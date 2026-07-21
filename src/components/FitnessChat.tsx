import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { exercises } from "@/data/exercises";
import { supabasePublishableKey, supabaseUrl } from "@/lib/env";

type Message = { role: "user" | "assistant"; content: string };

// Create a summary of available exercises for the AI
const getExerciseSummary = () => {
  const muscleGroups = [...new Set(exercises.map(e => e.muscleGroup))];
  const summary = muscleGroups.map(group => {
    const groupExercises = exercises.filter(e => e.muscleGroup === group);
    const byDifficulty = {
      Beginner: groupExercises.filter(e => e.difficulty === 'Beginner').map(e => e.name),
      Intermediate: groupExercises.filter(e => e.difficulty === 'Intermediate').map(e => e.name),
      Advanced: groupExercises.filter(e => e.difficulty === 'Advanced').map(e => e.name),
    };
    return `${group}: Beginner[${byDifficulty.Beginner.join(', ')}], Intermediate[${byDifficulty.Intermediate.join(', ')}], Advanced[${byDifficulty.Advanced.join(', ')}]`;
  }).join('\n');
  return summary;
};

export const FitnessChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! What do you feel like working out today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const CHAT_URL = `${supabaseUrl}/functions/v1/fitness-chat`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      // Get the session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      // Build headers with proper authentication
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "apikey": supabasePublishableKey,
      };
      
      // Add Authorization header if user is logged in
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      } else {
        // Use anon key for guests
        headers["Authorization"] = `Bearer ${supabasePublishableKey}`;
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          exerciseData: getExerciseSummary()
        }),
      });

      if (resp.status === 429 || resp.status === 402) {
        const error = await resp.json();
        toast({ title: "Error", description: error.error, variant: "destructive" });
        setIsLoading(false);
        return;
      }

      if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch (parseError) {
            console.warn("Failed to parse streaming chunk:", parseError);
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch (parseError) {
            console.warn("Failed to parse remaining chunk:", parseError);
          }
        }
      }

      setIsLoading(false);
    } catch (e) {
      console.error("Chat error:", e);
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render message content with proper link handling
  const renderMessageContent = (content: string, msgIdx: number) => {
    // Reset regex state by creating new instances
    const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s<>)"']+)/g;
    
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    // First check for markdown-style links
    const mdMatches = Array.from(content.matchAll(markdownRegex));
    if (mdMatches.length > 0) {
      mdMatches.forEach((mdMatch, i) => {
        const [fullMatch, linkText, url] = mdMatch;
        const index = mdMatch.index!;
        
        if (index > lastIndex) {
          parts.push(content.substring(lastIndex, index));
        }
        
        parts.push(
          <a
            key={`link-${msgIdx}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:text-primary/80 transition-all duration-300 underline decoration-2 underline-offset-2 inline-block mx-1"
          >
            🔗 {linkText}
          </a>
        );
        
        lastIndex = index + fullMatch.length;
      });
      
      if (lastIndex < content.length) {
        // Also check remaining text for plain URLs
        const remainingText = content.substring(lastIndex);
        const remainingUrlMatches = Array.from(remainingText.matchAll(urlRegex));
        if (remainingUrlMatches.length > 0) {
          let remainingLastIndex = 0;
          remainingUrlMatches.forEach((match, i) => {
            const url = match[0];
            const index = match.index!;
            if (index > remainingLastIndex) {
              parts.push(remainingText.substring(remainingLastIndex, index));
            }
            parts.push(
              <a key={`url-${msgIdx}-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                className="font-bold text-primary hover:text-primary/80 transition-all duration-300 underline decoration-2 underline-offset-2 inline-block mx-1">
                🔗 {url}
              </a>
            );
            remainingLastIndex = index + url.length;
          });
          if (remainingLastIndex < remainingText.length) {
            parts.push(remainingText.substring(remainingLastIndex));
          }
        } else {
          parts.push(remainingText);
        }
      }
      
      return <>{parts}</>;
    }

    // Fallback to plain URL detection - use matchAll to avoid lastIndex issues
    const urlMatches = Array.from(content.matchAll(urlRegex));
    if (urlMatches.length > 0) {
      lastIndex = 0;
      urlMatches.forEach((match, i) => {
        const url = match[0];
        const index = match.index!;
        
        if (index > lastIndex) {
          parts.push(content.substring(lastIndex, index));
        }
        
        parts.push(
          <a
            key={`url-${msgIdx}-${i}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary hover:text-primary/80 transition-all duration-300 underline decoration-2 underline-offset-2 inline-block mx-1"
          >
            🔗 Link
          </a>
        );
        
        lastIndex = index + url.length;
      });
      
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }
      
      return <>{parts}</>;
    }
    
    return content;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
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
      <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl border-2 border-primary/50 bg-background z-[70]">
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
        <h3 className="font-semibold">Fitness Coach AI</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/20 text-primary-foreground">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-card">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border-2 border-border text-foreground"
              }`}
            >
              {renderMessageContent(msg.content, idx)}
            </div>
          </div>
        ))}
        
        {/* Loading/Typing Indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-background border-2 border-border text-foreground rounded-lg p-3 shadow-md flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            disabled={isLoading}
            className="flex-1 bg-card border-border"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
    </>
  );
};
