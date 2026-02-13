export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl font-bold text-gray-200 dark:text-gray-700">
          404
        </div>
        <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
          Page not found
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
