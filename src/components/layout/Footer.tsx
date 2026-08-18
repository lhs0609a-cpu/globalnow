import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-slate-900">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-blue-500 text-[0.5rem] font-bold text-white">
            GN
          </span>
          <span className="font-medium text-slate-300">
            Global<span className="text-slate-500">now</span>
          </span>
        </div>

        <p className="max-w-md text-slate-500 sm:text-center">
          모든 뉴스 콘텐츠는 각 발행사에 귀속됩니다. 정보 제공 목적으로 집계·번역합니다.
        </p>

        <div className="flex items-center gap-4 text-slate-500">
          <Link href="/privacy" className="transition-colors hover:text-slate-300">
            개인정보
          </Link>
          <Link href="/terms" className="transition-colors hover:text-slate-300">
            이용약관
          </Link>
          <Link href="/auth/login" className="transition-colors hover:text-slate-300">
            로그인
          </Link>
        </div>
      </div>
    </footer>
  );
}
