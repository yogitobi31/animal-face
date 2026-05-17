import type { AnimalCard } from '../types/animal';

const visualToneByIllustration: Record<string, string> = {
  'ivory-cat': 'tone-cat',
  'sun-dog': 'tone-sun',
  'moon-fox': 'tone-moon',
  'slate-wolf': 'tone-forest',
  'pearl-swan': 'tone-pearl',
  'night-panther-fox': 'tone-night',
};

const motifByIllustration: Record<string, string> = {
  'ivory-cat': 'motif-cat',
  'sun-dog': 'motif-sun',
  'moon-cat-fox': 'motif-moon',
  'river-otter': 'motif-otter',
  'mist-owl': 'motif-mist',
};

export default function ResultCard({ card, score }: { card: AnimalCard; score: number }) {
  const toneClass = visualToneByIllustration[card.illustrationKey] ?? 'tone-default';
  const motifClass = motifByIllustration[card.illustrationKey] ?? 'motif-default';

  return (
    <div id="result-card" className={`premium-result-card ${toneClass} ${motifClass}`}>
      <p className="result-label">당신의 동물상 카드는</p>
      <h2 className="result-name">{card.name}</h2>

      <div className="result-meta-row">
        <span className="result-category">카테고리 {card.animalFamily}</span>
        <span className="result-score-badge">매칭률 {score}%</span>
      </div>

      <div className="premium-art-area" aria-hidden>
        <svg className="animal-symbol" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="symbol-line line-main" d="M76 168C108 126 130 72 182 72C232 72 253 125 286 168" />
          <path className="symbol-line line-sub" d="M122 160C138 134 151 111 182 111C212 111 226 133 241 160" />
          <path className="symbol-line line-accent" d="M151 160C160 147 167 137 182 137C196 137 204 147 213 160" />
          <path className="symbol-ear ear-left" d="M137 76L159 40L169 81" />
          <path className="symbol-ear ear-right" d="M227 76L203 40L194 81" />
          <path className="symbol-wave wave-left" d="M81 146C106 138 117 121 131 103" />
          <path className="symbol-wave wave-right" d="M279 146C254 138 243 121 229 103" />
          <ellipse className="symbol-core" cx="182" cy="120" rx="38" ry="44" />
        </svg>
      </div>

      <p className="result-catchphrase">{card.catchphrase}</p>
      <p className="result-description">{card.description}</p>
      <p className="result-brand">Animal Face Archive</p>
    </div>
  );
}
