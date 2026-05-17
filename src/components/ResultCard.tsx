import type { AnimalResult } from '../data/animalResults';
import AnimalVisual from './AnimalVisual';

export default function ResultCard({ card, score }: { card?: AnimalResult | null; score: number }) {
  if (!card) {
    return <div id="result-card" className="premium-result-card"><p className="result-label">분석 중...</p></div>;
  }
  return (
    <div id="result-card" className="premium-result-card">
      <p className="result-label">당신의 동물상 카드는</p>
      <h2 className="result-name">{card.name}</h2>

      <div className="result-meta-row">
        <span className="result-category">카테고리 {card.category}</span>
        <span className="result-score-badge">매칭률 {score}%</span>
      </div>

      <div className="premium-art-area">
        <AnimalVisual result={card} />
      </div>

      <p className="result-catchphrase">{card.tagline}</p>
      <p className="result-description">{card.description}</p>
      <p className="result-brand">Animal Face Archive</p>
    </div>
  );
}
