"use client";

import type { QuizQuestion as QuizQuestionType } from "@/types/news";

interface QuizQuestionProps {
  question: QuizQuestionType;
  index: number;
  total: number;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
}

export default function QuizQuestion({
  question,
  index,
  total,
  selectedAnswer,
  onAnswer,
}: QuizQuestionProps) {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctIndex;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>
          {index + 1} / {total}
        </span>
        <div className="h-1 flex-1 mx-4 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          let className =
            "w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ";

          if (!answered) {
            className +=
              "border-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300";
          } else if (i === question.correctIndex) {
            className +=
              "border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300";
          } else if (i === selectedAnswer && !isCorrect) {
            className +=
              "border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300";
          } else {
            className +=
              "border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500";
          }

          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(i)}
              disabled={answered}
              className={className}
            >
              <span className="mr-2 font-medium">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            isCorrect
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
          }`}
        >
          {question.explanation}
        </div>
      )}
    </div>
  );
}
