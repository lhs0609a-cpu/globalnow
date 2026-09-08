'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError('현재 둘러보기 모드입니다. 홈에서 로그인 없이 뉴스를 읽을 수 있습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('현재 둘러보기 모드입니다. 홈에서 로그인 없이 뉴스를 읽을 수 있습니다.');
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError('Google 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-[22rem]">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 t-title font-bold tracking-tight text-white">
            GN
          </span>
          <h1 className="t-headline-lg font-semibold tracking-tight text-slate-100">
            Global<span className="text-slate-500">now</span>
          </h1>
          <p className="mt-1 t-body-sm text-slate-500">
            글로벌 뉴스 대시보드에 로그인
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-3.5 surface p-5"
        >
          {error && (
            <div role="alert" className="rounded-lg bg-red-400/10 px-3.5 py-2.5 t-body-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block t-body-sm text-slate-400">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-600 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block t-body-sm text-slate-400">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-600 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="h-9 w-full rounded-lg bg-accent text-[0.875rem] font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '로그인 중…' : '로그인'}
          </button>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-2 t-meta-sm text-slate-600">또는</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-line-strong bg-fill-subtle text-[0.875rem] font-semibold text-slate-200 transition-colors hover:border-line-strong hover:bg-fill"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 로그인
          </button>
        </form>

        <p className="mt-4 text-center t-body-sm text-slate-500">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
            회원가입
          </Link>
        </p>
        <Link href="/" className="action-text mt-4 flex">로그인 없이 둘러보기</Link>
      </div>
    </main>
  );
}
