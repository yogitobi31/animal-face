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
        <p className="text-xs tracking-[0.2em] uppercase text-stone-500">Animal Face Archive</p>
        <h1 className="text-3xl font-semibold tracking-tight">닮은 건 얼굴일까, 분위기일까.</h1>
        <p className="text-stone-700 leading-relaxed">
          당신과 가장 가까운 동물상을 카드처럼 담아드립니다.
        </p>
        <button onClick={onStart} className="primary-cta">
          사진으로 시작하기
        </button>
        <details className="text-xs text-stone-500 leading-relaxed">
          <summary className="cursor-pointer select-none text-stone-500 hover:text-stone-700 transition">
            신뢰성 · 개인정보 안내 보기
          </summary>
          <p className="mt-2">
            매번 바뀌는 랜덤 테스트가 아니며 얼굴 형태와 인상 요소를 기준으로 안정적으로 매칭합니다. 사진은
            외부 AI API로 전송되지 않습니다.
          </p>
        </details>
      </div>
    </section>
  );
}
