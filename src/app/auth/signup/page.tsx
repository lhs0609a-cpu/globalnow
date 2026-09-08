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

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setIsLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setError('현재 둘러보기 모드입니다. 홈에서 로그인 없이 뉴스를 읽을 수 있습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('이미 등록된 이메일입니다');
        } else {
          setError('회원가입 중 오류가 발생했습니다');
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <div className="w-full max-w-[22rem] text-center">
          <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <h2 className="t-headline-lg font-semibold tracking-tight text-slate-100">
            이메일을 확인해주세요
          </h2>
          <p className="mt-2 t-body-sm text-slate-500">
            {email}로 인증 링크를 보냈습니다.
            <br />
            링크를 눌러 가입을 완료해주세요.
          </p>
          <Link
            href="/auth/login"
            className="mt-5 inline-block t-body-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-[22rem]">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 t-title font-bold tracking-tight text-white">
            GN
          </span>
          <h1 className="t-headline-lg font-semibold tracking-tight text-slate-100">
            Global<span className="text-slate-500">now</span>
          </h1>
          <p className="mt-1 t-body-sm text-slate-500">새 계정을 만들어보세요</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-3.5 surface p-5"
        >
          {error && (
            <div className="rounded-lg bg-red-400/10 px-3.5 py-2.5 t-body-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="nickname" className="mb-1.5 block t-body-sm text-slate-400">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-600 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block t-body-sm text-slate-400">
              이메일
            </label>
            <input
              id="email"
              type="email"
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-600 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
              placeholder="6자 이상"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="mb-1.5 block t-body-sm text-slate-400">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="h-9 w-full rounded-lg border border-line-strong bg-fill-subtle px-3 text-[0.875rem] text-slate-100 transition-colors placeholder:text-slate-600 hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
              placeholder="비밀번호를 다시 입력하세요"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="h-9 w-full rounded-lg bg-accent text-[0.875rem] font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '가입 중…' : '회원가입'}
          </button>
        </form>

        <p className="mt-4 text-center t-body-sm text-slate-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
