import { getIllustrationPath } from '../data/animalIllustrations';
import type { AnimalCard } from '../types/animal';

export default function ResultCard({ card, score }: { card: AnimalCard; score: number }) {
  const illustrationPath = getIllustrationPath(card.illustrationKey);

  return (
    <div id="result-card" className="premium-result-card">
      <p className="result-label">당신의 동물상 카드는</p>
      <h2 className="result-name">{card.name}</h2>

      <div className="result-meta-row">
        <span className="result-category">카테고리 {card.category}</span>
        <span className="result-score-badge">매칭률 {score}%</span>
      </div>

      <div className="premium-art-area">
        {illustrationPath ? (
          <img
            src={illustrationPath}
            alt={`${card.name} 일러스트`}
            className="result-illustration"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="result-illustration-empty" role="img" aria-label="일러스트 준비 중">
            <p className="empty-title">Illustration Coming Soon</p>
            <p className="empty-caption">{card.illustrationKey}</p>
          </div>
        )}
      </div>

      <p className="result-catchphrase">{card.tagline}</p>
      <p className="result-description">{card.description}</p>
      <p className="result-brand">Animal Face Archive</p>
    </div>
  );
}
