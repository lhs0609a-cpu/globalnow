import { hasTranslation } from '@/lib/demo/is-demo-mode';
import { cacheGetOrSet } from '@/lib/redis/cache';

export async function translateToKorean(text: string): Promise<string> {
  if (!text || !hasTranslation()) return text;

  return cacheGetOrSet(
    `translate:${Buffer.from(text.slice(0, 100)).toString('base64')}`,
    async () => {
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
        return data.data?.translations?.[0]?.translatedText || text;
      } catch (error) {
        console.error('Translation error:', error);
        return text;
      }
    },
    86400
  );
}
