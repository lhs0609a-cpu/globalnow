export function isDemoMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '';
}

export function hasRedis(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export function hasGroq(): boolean {
  return !!process.env.GROQ_API_KEY;
}

export function hasGemini(): boolean {
  return !!process.env.GOOGLE_GEMINI_API_KEY;
}

export function hasTranslation(): boolean {
  return !!process.env.GOOGLE_CLOUD_TRANSLATION_API_KEY;
}

export function hasReddit(): boolean {
  return !!(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
}

export function hasResend(): boolean {
  return !!process.env.RESEND_API_KEY;
}
