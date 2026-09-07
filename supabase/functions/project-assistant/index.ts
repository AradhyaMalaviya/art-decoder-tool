// @ts-expect-error - Deno globals are not configured in the host Vite project's tsconfig
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "gemini-2.5-flash-lite";
const MAX_CONTEXT_CHARS = 12000;
const MAX_TURNS = 20;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, projectContext } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured. Set GEMINI_API_KEY in Supabase secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const context = typeof projectContext === "string" && projectContext.length > MAX_CONTEXT_CHARS
      ? projectContext.slice(0, MAX_CONTEXT_CHARS) + "\n…(project context truncated)"
      : (projectContext ?? "(no project context provided)");

    const systemText = `You are the FitBox project assistant. Answer questions about THIS codebase: where files live, how routes/auth/Supabase/edge functions work, and how to extend the app. Use the PROJECT CONTEXT below as ground truth. Be concise and cite file paths like src/App.tsx. If the answer is not in the context, say so and suggest where to look. Never invent secrets, keys, or env values. Never reveal .env contents or service-role keys.\n\nPROJECT CONTEXT:\n${context}`;

    // Keep the prompt small: last N turns, drop old system messages from client.
    const turns: ChatMessage[] = messages
      .filter((m: ChatMessage) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .slice(-MAX_TURNS);

    const contents = turns.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, 4000) }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemText }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini error:", response.status, errorText.slice(0, 500));
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 400) {
        return new Response(JSON.stringify({ error: "Bad request to AI model. Please shorten your message." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `AI model error: ${response.status}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p.text ?? "").join("").trim()
      : "";

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason ?? data?.candidates?.[0]?.finishReason ?? "empty";
      console.error("Gemini empty reply:", blockReason);
      return new Response(JSON.stringify({ error: "AI returned an empty response. Try rephrasing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const e = error as Error;
    console.error("project-assistant error:", e.message);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
