import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const maxDuration = 60;

interface GenerateRequest {
  voice: string;
  audience: string;
  topic: string;
  length: string;
}

/* ================================
   Provider Setup (OpenAI or OpenRouter)
   - If OPENAI_API_KEY exists → use OpenAI
   - Else if OPENROUTER_API_KEY exists → use OpenRouter
   - Else → throw clean error
================================ */

const openaiProvider =
  process.env.OPENAI_API_KEY
    ? createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    : process.env.OPENROUTER_API_KEY
    ? createOpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        fetch: (url, options = {}) => {
          const headers = {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LinkedIn Post Creator",
            ...options.headers,
          };
          return fetch(url, { ...options, headers });
        },
      })
    : null;

function buildSystemPrompt(): string {
  return `You are a top-tier LinkedIn ghostwriter and content strategist.

You write posts that feel authentic, insightful, and native to LinkedIn.

Core writing principles:
- The first line MUST be a strong hook (under 15 words).
- Use short paragraphs (1–3 lines max).
- Write in a human, natural tone — never corporate or robotic.
- Present one clear insight, opinion, or lesson.
- End with a subtle call-to-action (question or invitation to engage).
- Avoid clichés like "I'm thrilled" or "Excited to announce".
- Avoid buzzwords and generic fluff.
- Do NOT use markdown formatting.
- Do NOT include explanations or meta commentary.
- Use at most 1 emoji (only if tone justifies it).
- Use at most 2 relevant hashtags at the very end (optional).

Formatting rules:
- No bullet points.
- No bold or special characters.
- Plain text only.

Respect LinkedIn’s 3000 character limit.

Output ONLY the final post text.`;
}

function buildUserPrompt(params: GenerateRequest): string {
  const voiceInstructions: Record<string, string> = {
    contrarian:
      "Take a bold stance. Challenge common beliefs. Open with a provocative or unpopular opinion. Be confident and direct.",
    authoritative:
      "Write with expertise and clarity. Reference real-world insight or experience. Sound credible and informed without arrogance.",
    friendly:
      "Conversational and warm. Use 'you' and 'we'. Make it feel like advice shared with a colleague.",
    humorous:
      "Professional but witty. Use light humor or clever framing while keeping the message insightful.",
    inspirational:
      "Motivating and reflective. Share a lesson, growth moment, or realization. Make it uplifting but grounded.",
    storytelling:
      "Start with a specific scene, moment, or personal experience. Build narrative tension before delivering the insight.",
  };

  const lengthInstructions: Record<string, string> = {
    short:
      "50–80 words. 3–5 short paragraphs. Punchy and impactful.",
    medium:
      "100–150 words. 5–8 short paragraphs. Balanced depth and readability.",
    long:
      "180–260 words. 8–12 short paragraphs. Deep exploration with practical insight.",
  };

  const voiceGuide =
    voiceInstructions[params.voice] || voiceInstructions.friendly;

  const lengthGuide =
    lengthInstructions[params.length] || lengthInstructions.medium;

  return `Write a LinkedIn post with the following specifications:

Topic:
${params.topic}

Target Audience:
${params.audience}

Tone:
${params.voice}

Tone Guidance:
${voiceGuide}

Length Requirement:
${lengthGuide}

Audience Targeting Rule:
Tailor the examples, challenges, and language specifically to ${params.audience}. Address their real-world professional concerns. Avoid generic advice.

Content Requirement:
Deliver one actionable insight or clear point of view. Make it practical and relevant.

Generate the post now.`;
}

/* ================================
            API Route
================================ */

export async function POST(req: Request) {
  try {
    if (!openaiProvider) {
      return new Response(
        JSON.stringify({
          error:
            "No API key configured. Please set OPENAI_API_KEY or OPENROUTER_API_KEY in .env.local",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { voice, audience, topic, length } =
      body as GenerateRequest;

    if (!voice || !audience || !topic) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required fields: voice, audience, and topic are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const safeParams: GenerateRequest = {
      voice: String(voice).slice(0, 200),
      audience: String(audience).slice(0, 500),
      topic: String(topic).slice(0, 1000),
      length: ["short", "medium", "long"].includes(String(length))
        ? String(length)
        : "medium",
    };

    const modelName = process.env.OPENAI_API_KEY
      ? "gpt-4o-mini"
      : "openai/gpt-4o-mini";

    const result = streamText({
      model: openaiProvider(modelName),
      system: buildSystemPrompt(),
      prompt: buildUserPrompt(safeParams),
      temperature: 0.8,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Generation error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate post. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
