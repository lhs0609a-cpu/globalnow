'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/[0.08] bg-slate-800 shadow-2xl shadow-black/50',
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[0.9375rem] font-semibold text-slate-100">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-slate-100"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
