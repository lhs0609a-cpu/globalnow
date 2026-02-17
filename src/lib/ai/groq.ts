import { hasGroq } from '@/lib/demo/is-demo-mode';

export async function generateWithGroq(prompt: string, systemPrompt?: string): Promise<string | null> {
  if (!hasGroq()) return null;

  try {
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Groq API error:', error);
    return null;
  }
}
