import type { AnimalCard } from '../types/animal';

export default function ResultCard({ card, score }: { card: AnimalCard; score: number }) {
  return (
    <div id="result-card" className="premium-result-card">
      <p className="text-sm text-stone-500">당신의 동물상 카드는</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{card.name}</h2>

      <div className="result-meta-row">
        <span>카테고리 {card.animalFamily}</span>
        <span>매칭률 {score}%</span>
      </div>

      <div className="premium-art-area" aria-hidden>
        <div className="silhouette-orb" />
        <div className="face-line face-line-1" />
        <div className="face-line face-line-2" />
        <div className="face-line face-line-3" />
      </div>

      <p className="mt-4 text-sm font-medium text-stone-700">{card.catchphrase}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{card.description}</p>
      <p className="mt-4 text-xs tracking-[0.12em] text-stone-500">Animal Face Archive</p>
    </div>
  );
}
