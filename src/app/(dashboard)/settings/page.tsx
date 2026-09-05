'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/AppShell';
import { Card, CardDivider, CardHeader } from '@/components/ui/Card';
import { useTheme } from '@/components/ui/ThemeToggle';

/** 설정 화면 전용 토글. 세 곳에서 같은 마크업을 복사하고 있었다. */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
        checked ? 'bg-accent' : 'bg-fill-strong'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[1.125rem]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <p className="t-body-sm text-slate-200">{title}</p>
        <p className="mt-0.5 t-meta-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  // 예전에는 useState 만 붙어 있어 스위치가 켜져도 화면은 그대로였다
  const { theme, setTheme } = useTheme();
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
    <div className="max-w-2xl">
      <PageHeader title="설정" description="계정과 앱 동작을 관리합니다" />

      <div className="space-y-5">
        {/* Appearance */}
        <Card>
          <CardHeader title="외관" />
          <CardDivider />
          <div className="divide-y divide-line">
            <SettingRow title="다크 모드" description="어두운 테마 사용">
              <Toggle
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                label="다크 모드 전환"
              />
            </SettingRow>
            <SettingRow title="언어" description="인터페이스 언어">
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="h-8 rounded-lg border border-line-strong bg-fill-subtle px-2.5 text-[0.875rem] text-slate-100 transition-colors hover:border-line-strong focus:border-blue-500/50 focus:outline-none"
                aria-label="언어 선택"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </SettingRow>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="알림" />
          <CardDivider />
          <SettingRow title="이메일 알림" description="모닝 브리프 및 키워드 알림">
            <Toggle
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
              label="이메일 알림 전환"
            />
          </SettingRow>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader title="데이터" />
          <CardDivider />
          <div className="divide-y divide-line">
            <button
              type="button"
              onClick={handleExportBookmarks}
              disabled={exportLoading}
              className="w-full px-5 py-3.5 text-left transition-colors hover:bg-fill-subtle disabled:opacity-50"
            >
              <p className="t-body-sm text-slate-200">
                {exportLoading ? '내보내는 중…' : '북마크 내보내기'}
              </p>
              <p className="mt-0.5 t-meta-sm text-slate-500">
                저장한 뉴스를 CSV로 다운로드
              </p>
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full px-5 py-3.5 text-left transition-colors hover:bg-red-400/[0.06]"
            >
              <p className="t-body-sm text-red-400">
                {showDeleteConfirm ? '정말 삭제하시겠습니까? 다시 누르면 삭제됩니다' : '계정 삭제'}
              </p>
              <p className="mt-0.5 t-meta-sm text-red-400/60">
                모든 데이터가 영구적으로 삭제됩니다
              </p>
            </button>
          </div>
        </Card>

        {/* Legal */}
        <Card>
          <CardHeader title="법적 고지" />
          <CardDivider />
          <div className="divide-y divide-line">
            <a
              href="/terms"
              className="block px-5 py-3 t-body-sm text-slate-300 transition-colors hover:bg-fill-subtle hover:text-slate-100"
            >
              이용약관
            </a>
            <a
              href="/privacy"
              className="block px-5 py-3 t-body-sm text-slate-300 transition-colors hover:bg-fill-subtle hover:text-slate-100"
            >
              개인정보처리방침
            </a>
          </div>
        </Card>

        <p className="text-center t-meta-sm text-slate-600">GLOBALNOW v1.0.0</p>
      </div>
    </div>
  );
}
