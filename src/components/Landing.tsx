export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="landing-shell">
      <div className="landing-backdrop" aria-hidden>
        <article className="sample-mini-card sample-a">
          <p className="sample-label">Animal Face Archive</p>
          <p className="sample-name">도도한 고양이</p>
          <p className="sample-meta">매칭률 93%</p>
        </article>
        <article className="sample-mini-card sample-b">
          <p className="sample-label">Animal Face Archive</p>
          <p className="sample-name">포근한 수달</p>
          <p className="sample-meta">매칭률 89%</p>
        </article>
        <article className="sample-mini-card sample-c">
          <p className="sample-label">Animal Face Archive</p>
          <p className="sample-name">은빛 여우</p>
          <p className="sample-meta">매칭률 91%</p>
        </article>
      </div>

      <div className="space-y-5 landing-content">
        <h1 className="text-3xl font-semibold tracking-tight">Animal Face Archive</h1>
        <p className="text-stone-700 leading-relaxed">
          매번 바뀌는 랜덤 테스트가 아닙니다. 얼굴의 형태와 인상 요소를 기준으로 안정적으로 매칭하며,
          사진은 외부 AI API로 전송되지 않습니다. 당신의 얼굴과 가장 가까운 동물상 카드를 찾아드립니다.
        </p>
        <button onClick={onStart} className="primary-cta">
          사진으로 시작하기
        </button>
      </div>
    </section>
  );
}
