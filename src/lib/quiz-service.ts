"use client";

import type { QuizResult } from "@/types/news";
import { getItem, setItem, appendToArray } from "./storage";

const RESULTS_KEY = "globalnow_quiz_results";
const STREAK_KEY = "globalnow_quiz_streak";

export function getQuizResults(): QuizResult[] {
  return getItem<QuizResult[]>(RESULTS_KEY) || [];
}

export function saveQuizResult(result: QuizResult): void {
  appendToArray(RESULTS_KEY, result, 50);
  updateStreak(result);
}

function updateStreak(result: QuizResult): void {
  const streak = getItem<{ count: number; lastDate: string }>(STREAK_KEY) || {
    count: 0,
    lastDate: "",
  };
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  if (streak.lastDate === today) {
    // Already played today, don't update streak count
    return;
  }

  if (streak.lastDate === yesterday) {
    // Consecutive day
    streak.count += 1;
  } else if (streak.lastDate !== today) {
    // Streak broken
    streak.count = 1;
  }

  streak.lastDate = today;
  setItem(STREAK_KEY, streak);
}

export function getStreak(): number {
  const streak = getItem<{ count: number; lastDate: string }>(STREAK_KEY);
  if (!streak) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000)
    .toISOString()
    .split("T")[0];

  // Streak is only valid if last played today or yesterday
  if (streak.lastDate === today || streak.lastDate === yesterday) {
    return streak.count;
  }
  return 0;
}

export function getBestScore(): number {
  const results = getQuizResults();
  if (results.length === 0) return 0;
  return Math.max(...results.map((r) => r.score));
}

export function getAverageScore(): number {
  const results = getQuizResults();
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
  return Math.round((total / results.length) * 10) / 10;
}
