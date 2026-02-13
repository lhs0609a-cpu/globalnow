import { NextRequest, NextResponse } from "next/server";
import { apiGuard } from "@/lib/api-security";

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// In-memory cache: hash -> { result, timestamp }
const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function hashKey(action: string, text: string, lang: string): string {
  // Simple hash for cache key
  const str = `${action}:${lang}:${text}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return String(hash);
}

function getPrompt(
  action: "summarize" | "translate" | "quiz",
  text: string,
  targetLang: string
): string {
  const langNames: Record<string, string> = {
    ko: "Korean",
    en: "English",
    ja: "Japanese",
  };
  const langName = langNames[targetLang] || "English";

  if (action === "summarize") {
    return `Summarize the following news article text in 2-3 concise sentences in ${langName}. Focus on the key facts and main point. Do not add any preamble or labels, just the summary:\n\n${text}`;
  }

  if (action === "quiz") {
    return `Based on these recent news headlines, create exactly 5 multiple-choice quiz questions that test knowledge of current events. Each question should have 4 options with exactly one correct answer.

Output ONLY a valid JSON array, no markdown, no code fences, no explanation. Format:
[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]

Headlines:
${text}`;
  }

  return `Translate the following text to ${langName}. Output only the translation, no preamble or labels:\n\n${text}`;
}

export async function POST(request: NextRequest) {
  const blocked = apiGuard(request, "ai");
  if (blocked) return blocked;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service is not available" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { action, text, targetLang = "ko" } = body;

    if (!action || !text) {
      return NextResponse.json(
        { error: "Missing action or text" },
        { status: 400 }
      );
    }

    if (!["summarize", "translate", "quiz"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Limit text length to prevent abuse (10KB for quiz with multiple headlines, 5KB for others)
    const maxLen = action === "quiz" ? 10000 : 5000;
    if (typeof text !== "string" || text.length > maxLen) {
      return NextResponse.json(
        { error: `Text too long. Maximum ${maxLen} characters` },
        { status: 400 }
      );
    }

    if (targetLang && !["ko", "en", "ja"].includes(targetLang)) {
      return NextResponse.json(
        { error: "Invalid target language. Allowed: ko, en, ja" },
        { status: 400 }
      );
    }

    // Check cache
    const key = hashKey(action, text, targetLang);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ result: cached.result });
    }

    const prompt = getPrompt(action, text, targetLang);

    const response = await fetch(GEMINI_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: action === "quiz" ? 2000 : 500,
          temperature: action === "quiz" ? 0.7 : 0.3,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errData);
      return NextResponse.json(
        { error: "AI API request failed" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!result) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 502 }
      );
    }

    // For quiz action, parse the JSON response
    if (action === "quiz") {
      try {
        // Strip markdown code fences if present
        const cleaned = result.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return NextResponse.json(
            { error: "Invalid quiz format" },
            { status: 502 }
          );
        }
        return NextResponse.json({ result: parsed });
      } catch {
        return NextResponse.json(
          { error: "Failed to parse quiz JSON" },
          { status: 502 }
        );
      }
    }

    // Cache the result
    cache.set(key, { result, timestamp: Date.now() });

    // Clean old cache entries periodically
    if (cache.size > 500) {
      const now = Date.now();
      for (const [k, v] of cache) {
        if (now - v.timestamp > CACHE_TTL) cache.delete(k);
      }
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
