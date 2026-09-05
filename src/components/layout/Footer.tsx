import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-[var(--container)] flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-accent text-[0.5rem] font-bold text-white">
            GN
          </span>
          <span className="t-editorial t-title font-semibold text-slate-300">
            Global<span className="text-slate-500">now</span>
          </span>
        </div>

        <p className="t-meta-sm max-w-md font-normal text-slate-500 sm:text-center">
          모든 뉴스 콘텐츠는 각 발행사에 귀속됩니다. 정보 제공 목적으로 집계·번역합니다.
        </p>

        <div className="t-meta flex items-center gap-4 text-slate-500">
          <Link href="/privacy" className="transition-colors hover:text-slate-200">
            개인정보
          </Link>
          <Link href="/terms" className="transition-colors hover:text-slate-200">
            이용약관
          </Link>
          <Link href="/auth/login" className="transition-colors hover:text-slate-200">
            로그인
          </Link>
        </div>
      </div>
    </footer>
  );
}
