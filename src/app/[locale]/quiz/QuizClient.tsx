"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { QuizQuestion as QuizQuestionType } from "@/types/news";
import { fetchNews, callAIQuiz } from "@/lib/api";
import {
  saveQuizResult,
  getStreak,
  getBestScore,
  getAverageScore,
} from "@/lib/quiz-service";
import QuizQuestion from "@/components/QuizQuestion";

type QuizState = "idle" | "loading" | "playing" | "results";

export default function QuizClient() {
  const [state, setState] = useState<QuizState>("idle");
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const t = useTranslations("Quiz");
  const tNav = useTranslations("Nav");

  const startQuiz = useCallback(async () => {
    setState("loading");
    setError(null);
    try {
      // Fetch recent headlines
      const news = await fetchNews({ pageSize: 20 });
      const headlines = news.articles
        .filter((a) => a.title !== "[Removed]")
        .map((a) => a.title)
        .slice(0, 15);

      if (headlines.length < 5) {
        setError(t("notEnoughNews"));
        setState("idle");
        return;
      }

      // Generate quiz via AI
      let quizQuestions;
      try {
        quizQuestions = await callAIQuiz(headlines);
      } catch {
        setAiUnavailable(true);
        setError(t("aiUnavailable"));
        setState("idle");
        return;
      }

      if (!quizQuestions || quizQuestions.length === 0) {
        setError(t("generateFailed"));
        setState("idle");
        return;
      }

      setQuestions(quizQuestions.slice(0, 5));
      setCurrentIndex(0);
      setAnswers([]);
      setState("playing");
    } catch {
      setError(t("generateFailed"));
      setState("idle");
    }
  }, [t]);

  const handleAnswer = (answerIdx: number) => {
    const newAnswers = [...answers, answerIdx];
    setAnswers(newAnswers);

    // Auto-advance after delay
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Quiz complete
        const score = newAnswers.reduce(
          (sum, a, i) => sum + (a === questions[i].correctIndex ? 1 : 0),
          0
        );
        saveQuizResult({
          score,
          total: questions.length,
          date: new Date().toISOString(),
          questions,
          answers: newAnswers,
        });
        setState("results");
      }
    }, 1500);
  };

  const score = answers.reduce(
    (sum, a, i) => sum + (a === questions[i]?.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          {tNav("home")}
        </Link>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {t("title")}
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {t("description")}
      </p>

      {/* Stats bar */}
      <div className="mb-6 flex gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <div className="flex-1">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {getStreak()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t("streak")}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {getBestScore()}/5
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t("bestScore")}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {getAverageScore()}/5
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t("averageScore")}
          </div>
        </div>
      </div>

      {/* Idle state */}
      {state === "idle" && (
        <div className="text-center">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
          <button
            onClick={startQuiz}
            disabled={aiUnavailable}
            className="rounded-xl bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("startQuiz")}
          </button>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            {t("quizInfo")}
          </p>
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="flex flex-col items-center py-12">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("generating")}
          </p>
        </div>
      )}

      {/* Playing */}
      {state === "playing" && questions[currentIndex] && (
        <QuizQuestion
          question={questions[currentIndex]}
          index={currentIndex}
          total={questions.length}
          selectedAnswer={
            answers.length > currentIndex ? answers[currentIndex] : null
          }
          onAnswer={handleAnswer}
        />
      )}

      {/* Results */}
      {state === "results" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 text-4xl font-bold">
            {score >= 4
              ? "🎉"
              : score >= 2
                ? "👍"
                : "📚"}
          </div>
          <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("resultTitle")}
          </h2>
          <p className="mb-4 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {score} / {questions.length}
          </p>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {score >= 4
              ? t("excellent")
              : score >= 2
                ? t("good")
                : t("keepTrying")}
          </p>
          <button
            onClick={() => {
              setState("idle");
              setQuestions([]);
              setAnswers([]);
              setCurrentIndex(0);
            }}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t("playAgain")}
          </button>
        </div>
      )}
    </div>
  );
}
