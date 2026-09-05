'use client';

import { useCallback, useSyncExternalStore } from 'react';
import clsx from 'clsx';
import { Icon } from './Icon';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'gn-theme';

/**
 * 테마는 리액트 밖(<html data-theme>)에 산다.
 *
 * layout.tsx 의 블로킹 스크립트가 첫 페인트 전에 값을 심고, 이후에는 헤더와
 * 설정 화면 두 곳에서 바꾼다. 각자 useState 를 들면 한쪽에서 바꿨을 때 다른
 * 쪽 스위치가 옛 값을 그대로 보여준다. 그래서 DOM 을 단일 출처로 두고
 * useSyncExternalStore 로 구독한다.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** 서버에는 <html data-theme="dark"> 로 나간다 */
function getServerSnapshot(): Theme {
  return 'dark';
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* 저장소를 막아둔 브라우저에서는 이번 방문에만 적용된다 */
    }
    listeners.forEach(l => l());
  }, []);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  return { theme, setTheme, toggle };
}

/**
 * 헤더의 전환 버튼.
 *
 * 아이콘은 "지금 상태"가 아니라 "누르면 될 상태"를 보여준다. 어두운 화면에서
 * 해를 띄우면 누를 이유가 분명해진다.
 *
 * 어느 아이콘을 보일지는 자바스크립트가 아니라 CSS(.only-dark/.only-light)가
 * 고른다. 하이드레이션이 끝나기를 기다리면 라이트 사용자에게 해 아이콘이 한 번
 * 번쩍인 뒤 달로 바뀐다.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="테마 전환"
      title="테마 전환"
      className={clsx(
        'inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
        'text-slate-400 transition-colors hover:bg-fill-weak hover:text-slate-100',
        className
      )}
    >
      <Icon name="sun" className="only-dark h-[1.125rem] w-[1.125rem]" />
      <Icon name="moon" className="only-light h-[1.125rem] w-[1.125rem]" />
    </button>
  );
}
