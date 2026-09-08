import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
// Bounded process fallback also protects local/demo installs without Redis.
const memory = new Map<string, { value: unknown; expires: number }>();
const inFlight = new Map<string, Promise<unknown>>();
const MAX_ENTRIES = 200;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const local = memory.get(key);
  if (local && local.expires > Date.now()) return local.value as T;
  if (local) memory.delete(key);
  const r = getRedis();
  if (!r) return null;

  try {
    const data = await r.get<T>(key);
    return data;
  } catch (error) {
    console.error('Redis cache get error:', error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = 300
): Promise<void> {
  if (memory.size >= MAX_ENTRIES) memory.delete(memory.keys().next().value!);
  memory.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
  const r = getRedis();
  if (!r) return;

  try {
    await r.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error('Redis cache set error:', error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
  memory.delete(key);
  const r = getRedis();
  if (!r) return;

  try {
    await r.del(key);
  } catch (error) {
    console.error('Redis cache delete error:', error);
  }
}

export async function cacheGetOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;
  const request = (async () => {
    const cached = await cacheGet<T>(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    await cacheSet(key, data, ttlSeconds);
    return data;
  })();
  inFlight.set(key, request);
  try { return await request; }
  finally { if (inFlight.get(key) === request) inFlight.delete(key); }
}
