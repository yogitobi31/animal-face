import type { AnimalResult } from '../data/animalResults';
import type { ResultInsight } from '../lib/resultInsights';
import AnimalVisual from './AnimalVisual';

export default function ResultCard({ card, score, insight }: { card?: AnimalResult | null; score: number; insight?: ResultInsight }) {
  if (!card) return <div id="result-card" className="premium-result-card"><p className="result-label">분석 중...</p></div>;
  return (
    <div id="result-card" className="premium-result-card">
      <p className="result-label">당신의 동물상 카드는</p>
      <h2 className="result-name">{card.name}</h2>
      <div className="result-meta-row">
        <span className="result-category">카테고리 {card.category}</span>
        <span className="result-score-badge">매칭률 {score}% · 신뢰도 {insight?.confidenceLabel}</span>
      </div>
      <div className="premium-art-area"><AnimalVisual result={card} /></div>
      <p className="result-catchphrase">{insight?.primaryReason ?? card.tagline}</p>
      <p className="result-description">{insight?.resemblanceExplanation ?? card.description}</p>
      <div className='chip-row'>{insight?.traitChips.map((chip)=><span key={chip} className='trait-chip'>{chip}</span>)}</div>
      <p className="result-brand">Animal Face Archive</p>
    </div>
  );
}
