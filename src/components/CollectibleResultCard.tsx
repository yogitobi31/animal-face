import type { AnimalResult } from '../data/animalResults'
import type { ResultInsight } from '../lib/resultInsights'
import { rarityLabel } from '../lib/resultInsights'
import AnimalVisual from './AnimalVisual'

export default function CollectibleResultCard({ card, score, insight }: { card: AnimalResult; score: number; insight: ResultInsight }) {
  const rarity = rarityLabel(card.category)
  return (
    <div className={`collectible-card rarity-${rarity.toLowerCase()}`}>
      <div className="collectible-frame">
        <p className="archive-no">AFA-{card.id.slice(0, 8).toUpperCase()}</p>
        <p className="brand-mark">ANIMAL FACE ARCHIVE</p>
        <div className="collectible-art"><AnimalVisual result={card} /></div>
        <h2 className="collectible-name">{card.name}</h2>
        <div className="collectible-meta"><span>{rarity}</span><span>MATCH {score}%</span></div>
        <p className="collectible-copy">{insight.resemblanceExplanation}</p>
        <div className="collectible-traits">{insight.signatureTraits.slice(0,3).map((t)=><span key={t}>{t}</span>)}</div>
      </div>
    </div>
  )
}
