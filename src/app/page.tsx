import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Footer } from '@/components/layout/Footer';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Landing Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">GN</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            GLOBAL<span className="text-blue-400">NOW</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 mb-2">
            전세계 주요 언론의 뉴스를 한눈에
          </p>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            28개 글로벌 미디어의 뉴스, 트렌드, 시장 데이터를 AI가 분석하여 한국어로 제공합니다.
            CEO를 위한 글로벌 뉴스 대시보드.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              로그인
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <span className="text-3xl mb-3 block">📊</span>
              <h3 className="text-white font-semibold mb-2">실시간 글로벌 뉴스</h3>
              <p className="text-slate-400 text-sm">28개 주요 미디어에서 수집한 뉴스를 카테고리별로 한국어로 제공</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="text-white font-semibold mb-2">AI So What? 분석</h3>
              <p className="text-slate-400 text-sm">각 뉴스의 핵심, 배경, 전망, 액션 아이템을 AI가 즉시 분석</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <span className="text-3xl mb-3 block">☀️</span>
              <h3 className="text-white font-semibold mb-2">모닝 브리프</h3>
              <p className="text-slate-400 text-sm">매일 아침 오늘 꼭 알아야 할 글로벌 뉴스 5가지를 요약</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <DashboardContent />
          </div>
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
