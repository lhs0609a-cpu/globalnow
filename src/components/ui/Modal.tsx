'use client';

import { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Icon } from './Icon';

/** Native top layer provides focus containment, inert background and focus restoration. */
export function Modal({ isOpen, onClose, title = '상세 보기', children, className }: {
  isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const dialog = ref.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <dialog ref={ref} aria-labelledby={titleId} className={clsx('app-dialog surface max-w-lg overflow-y-auto shadow-[var(--shadow-pop)]', className)}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-2">
        <h2 id={titleId} className="t-title">{title}</h2>
        <button type="button" onClick={onClose} aria-label="닫기" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-fill"><Icon name="close" className="h-5 w-5" /></button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>, document.body,
  );
}
