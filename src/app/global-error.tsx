"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mb-4 text-6xl">500</div>
          <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
