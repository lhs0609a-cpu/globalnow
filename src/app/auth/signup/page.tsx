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
      alert('데모 모드에서는 회원가입할 수 없습니다');
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">이메일을 확인해주세요</h2>
          <p className="text-slate-400 text-sm mb-6">
            {email}로 인증 링크를 보냈습니다.<br />
            이메일의 링크를 클릭하여 가입을 완료해주세요.
          </p>
          <Link
            href="/auth/login"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">GN</span>
          </div>
          <h1 className="text-2xl font-bold text-white">GLOBAL<span className="text-blue-400">NOW</span></h1>
          <p className="text-slate-400 text-sm mt-2">새 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSignup} className="bg-slate-800 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="6자 이상"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">비밀번호 확인</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              className="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="비밀번호를 다시 입력하세요"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5 font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-4">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
