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
            {this.state.error?.message && (
              <p className="t-body-sm mx-auto mt-1.5 max-w-sm break-all text-slate-500">
                {this.state.error.message}
              </p>
            )}
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
