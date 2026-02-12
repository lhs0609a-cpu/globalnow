import type { Article } from "@/types/news";

const CACHE_KEY = "globalnow_articles";

export function getArticleId(article: Article): string {
  // URL-safe base64: / → _, + → -, = → .
  return btoa(encodeURIComponent(article.url))
    .replace(/\//g, "_")
    .replace(/\+/g, "-")
    .replace(/=/g, ".");
}

export function decodeArticleId(articleId: string): string | null {
  try {
    const base64 = articleId
      .replace(/_/g, "/")
      .replace(/-/g, "+")
      .replace(/\./g, "=");
    return decodeURIComponent(atob(base64));
  } catch {
    return null;
  }
}

export function cacheArticle(article: Article): void {
  try {
    const cache = getCache();
    const id = getArticleId(article);
    cache[id] = article;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage might be full or unavailable
  }
}

export function getCachedArticle(id: string): Article | null {
  try {
    const cache = getCache();
    return cache[id] || null;
  } catch {
    return null;
  }
}

function getCache(): Record<string, Article> {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
