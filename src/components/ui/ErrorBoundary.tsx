'use client';

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="surface px-6 py-10 text-center">
            <p className="t-title text-slate-200">화면을 그리지 못했습니다</p>
            <p className="t-body-sm mt-2 text-slate-500">일시적인 문제가 발생했습니다. 이 영역을 다시 불러와 주세요.</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="t-label mt-5 inline-flex h-9 items-center rounded-lg border border-line-strong bg-fill-subtle px-3.5 text-slate-200 transition-colors hover:bg-fill-weak hover:text-slate-100"
            >
              다시 시도
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
