'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('ko');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportBookmarks = async () => {
    setExportLoading(true);
    try {
      const res = await fetch('/api/user/bookmarks');
      const bookmarks = await res.json();
      const csv = ['제목,URL,저장일'].concat(
        (bookmarks || []).map((b: { title?: string; url?: string; createdAt?: string }) =>
          `"${b.title || ''}","${b.url || ''}","${b.createdAt || ''}"`
        )
      ).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `globalnow-bookmarks-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('북마크 내보내기에 실패했습니다');
    }
    setExportLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    alert('데모 모드에서는 계정을 삭제할 수 없습니다');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">설정</h1>

      {/* Appearance */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">외관</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">다크 모드</p>
              <p className="text-slate-400 text-xs">어두운 테마 사용</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-slate-600'}`}
              aria-label="다크 모드 전환"
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">언어</p>
              <p className="text-slate-400 text-xs">인터페이스 언어</p>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600"
              aria-label="언어 선택"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">알림</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm">이메일 알림</p>
              <p className="text-slate-400 text-xs">모닝 브리프 및 키워드 알림</p>
            </div>
            <button
              onClick={() => setEmailNotif(!emailNotif)}
              className={`w-11 h-6 rounded-full transition-colors relative ${emailNotif ? 'bg-blue-500' : 'bg-slate-600'}`}
              aria-label="이메일 알림 전환"
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${emailNotif ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">데이터</h2>
        <div className="space-y-3">
          <button
            onClick={handleExportBookmarks}
            disabled={exportLoading}
            className="w-full text-left px-4 py-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <p className="text-white text-sm">{exportLoading ? '내보내는 중...' : '북마크 내보내기'}</p>
            <p className="text-slate-400 text-xs">저장한 뉴스를 CSV로 다운로드</p>
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full text-left px-4 py-3 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            <p className="text-red-400 text-sm">{showDeleteConfirm ? '정말 삭제하시겠습니까? 다시 클릭하면 삭제됩니다' : '계정 삭제'}</p>
            <p className="text-red-400/60 text-xs">모든 데이터가 영구적으로 삭제됩니다</p>
          </button>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">법적 고지</h2>
        <div className="space-y-2">
          <a href="/terms" className="block text-blue-400 hover:text-blue-300 text-sm">이용약관</a>
          <a href="/privacy" className="block text-blue-400 hover:text-blue-300 text-sm">개인정보처리방침</a>
        </div>
      </div>

      {/* Info */}
      <div className="text-center text-slate-500 text-xs space-y-1">
        <p>GLOBALNOW v1.0.0</p>
      </div>
    </div>
  );
}
