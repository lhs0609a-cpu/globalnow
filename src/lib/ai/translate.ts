import { hasTranslation, hasGroq, hasGemini } from '@/lib/demo/is-demo-mode';
import { cacheGetOrSet } from '@/lib/redis/cache';
import { PROMPTS } from '@/lib/ai/prompts';

/** Translate via Google Cloud Translation API */
async function translateViaGoogle(text: string): Promise<string | null> {
  if (!hasTranslation()) return null;

  try {
    const apiKey = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'ko',
          format: 'text',
        }),
      }
    );

    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText || null;
  } catch (error) {
    console.error('Google Translation error:', error);
    return null;
  }
}

/** Translate via Groq LLM */
async function translateViaGroq(text: string): Promise<string | null> {
  if (!hasGroq()) return null;

  try {
    const { generateWithGroq } = await import('@/lib/ai/groq');
    const result = await generateWithGroq(PROMPTS.translate(text));
    return result?.trim() || null;
  } catch (error) {
    console.error('Groq translation error:', error);
    return null;
  }
}

/** Translate via Gemini */
async function translateViaGemini(text: string): Promise<string | null> {
  if (!hasGemini()) return null;

  try {
    const { generateWithGemini } = await import('@/lib/ai/gemini');
    const result = await generateWithGemini(PROMPTS.translate(text));
    return result?.trim() || null;
  } catch (error) {
    console.error('Gemini translation error:', error);
    return null;
  }
}

/** Translate text to Korean with fallback chain: Google → Groq → Gemini → original */
export async function translateToKorean(text: string): Promise<string> {
  if (!text) return text;

  // If no translation services available at all, skip caching
  if (!hasTranslation() && !hasGroq() && !hasGemini()) return text;

  return cacheGetOrSet(
    `translate:${Buffer.from(text.slice(0, 100)).toString('base64')}`,
    async () => {
      // Try Google Translation API first
      const googleResult = await translateViaGoogle(text);
      if (googleResult) return googleResult;

      // Fallback to Groq
      const groqResult = await translateViaGroq(text);
      if (groqResult) return groqResult;

      // Fallback to Gemini
      const geminiResult = await translateViaGemini(text);
      if (geminiResult) return geminiResult;

      // All failed - return original
      return text;
    },
    86400
  );
}

/** Batch translate multiple texts to Korean */
export async function translateBatch(texts: string[]): Promise<string[]> {
  if (!texts.length) return [];
  if (!hasTranslation() && !hasGroq() && !hasGemini()) return texts;

  // Try Google batch translation (supports multiple queries)
  if (hasTranslation()) {
    try {
      const apiKey = process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;
      const res = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: texts,
            source: 'en',
            target: 'ko',
            format: 'text',
          }),
        }
      );

      const data = await res.json();
      const translations = data.data?.translations;
      if (translations && translations.length === texts.length) {
        return translations.map((t: { translatedText: string }) => t.translatedText);
      }
    } catch (error) {
      console.error('Google batch translation error:', error);
    }
  }

  // Fallback: translate individually via fallback chain
  return Promise.all(texts.map(t => translateToKorean(t)));
}
