"use client";

import LoginForm from "@/components/LoginForm";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900">
      <div className="p-4">
        <Link href="/">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Global
            <span className="text-blue-600 dark:text-blue-400">Now</span>
          </h1>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <LoginForm />
      </div>
    </div>
  );
}
