import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; onReset?: () => void };
type State = { hasError: boolean };

export default class ResultErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[result-error-boundary] result rendering crashed', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 space-y-3">
          <p className="font-semibold">결과 화면을 불러오는 중 문제가 발생했어요.</p>
          <p>앱이 중단되지 않도록 복구했어요. 다시 분석하기를 눌러 재시도해 주세요.</p>
          <button className="secondary-btn" onClick={this.handleReset}>다시 분석하기</button>
        </section>
      );
    }

    return this.props.children;
  }
}
