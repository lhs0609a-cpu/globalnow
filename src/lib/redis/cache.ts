import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  redis = new Redis({ url, token });
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
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
  const r = getRedis();
  if (!r) return;

  try {
    await r.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error('Redis cache set error:', error);
  }
}

export async function cacheDelete(key: string): Promise<void> {
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
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const data = await fetcher();
  await cacheSet(key, data, ttlSeconds);
  return data;
}
