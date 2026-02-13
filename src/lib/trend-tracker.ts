"use client";

import type { Article, TrendDataPoint } from "@/types/news";
import { getItem, setItem } from "./storage";

const STORAGE_KEY = "globalnow_trends";
const MAX_DAYS = 30;

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "because", "but", "and", "or", "if", "while", "about", "up", "down",
  "this", "that", "these", "those", "it", "its", "he", "she", "his",
  "her", "we", "they", "them", "what", "which", "who", "whom", "my",
  "your", "their", "our", "me", "him", "us", "says", "said", "new",
  "also", "like", "get", "make", "go", "know", "take", "see", "come",
  "think", "look", "want", "give", "use", "find", "tell", "ask", "work",
  "seem", "feel", "try", "leave", "call", "still", "one", "two",
  "first", "last", "long", "great", "little", "right", "old", "big",
  "high", "small", "large", "next", "early", "young", "important",
  "public", "bad", "good", "best", "world", "country", "year", "day",
  "reuters", "associated", "press", "news", "report", "reports",
  "according", "people", "time", "back", "way", "many", "much", "even",
  "well", "part", "much", "after", "years", "over", "could", "been",
  "than", "now", "state", "under", "removed",
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length >= 3 &&
        !STOP_WORDS.has(w) &&
        !/^\d+$/.test(w)
    );
  return [...new Set(words)];
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTrendData(): TrendDataPoint[] {
  return getItem<TrendDataPoint[]>(STORAGE_KEY) || [];
}

export function trackArticleKeywords(articles: Article[]): void {
  const today = getTodayKey();
  const data = getTrendData();

  // Find or create today's entry
  let todayEntry = data.find((d) => d.date === today);
  if (!todayEntry) {
    todayEntry = { date: today, counts: {} };
    data.unshift(todayEntry);
  }

  // Extract keywords and count
  for (const article of articles) {
    const text = `${article.title} ${article.description || ""}`;
    const keywords = extractKeywords(text);
    for (const kw of keywords) {
      todayEntry.counts[kw] = (todayEntry.counts[kw] || 0) + 1;
    }
  }

  // Remove entries older than MAX_DAYS
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - MAX_DAYS);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const filtered = data.filter((d) => d.date >= cutoffStr);

  setItem(STORAGE_KEY, filtered);
}

export function getTopKeywords(days: number = 7, limit: number = 5): { keyword: string; data: { date: string; count: number }[] }[] {
  const allData = getTrendData();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const recent = allData.filter((d) => d.date >= cutoffStr);

  // Aggregate totals
  const totals: Record<string, number> = {};
  for (const entry of recent) {
    for (const [kw, count] of Object.entries(entry.counts)) {
      totals[kw] = (totals[kw] || 0) + count;
    }
  }

  // Top keywords
  const sorted = Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([keyword]) => keyword);

  // Build time series for each
  // Generate all dates in range
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return sorted.map((keyword) => ({
    keyword,
    data: dates.map((date) => {
      const entry = recent.find((d) => d.date === date);
      return { date, count: entry?.counts[keyword] || 0 };
    }),
  }));
}
