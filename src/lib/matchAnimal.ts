import { animalResults } from '../data/animalResults'
import { normalizeAnimalResult, validateAnimalResultsDataset } from './animalResultSafety'
import type { EmotionVector, MatchResult } from '../types/animal'

const w = { softness: 1, sharpness: 1.1, brightness: 0.9, calmness: 1, mystique: 1, playfulness: 0.9 }

export function matchAnimal(v: EmotionVector): MatchResult {
  const safeDataset = validateAnimalResultsDataset(animalResults)
  const ranked = safeDataset
    .map((card) => {
      const projected = {
        softness: v.softness,
        sharpness: v.sharpness,
        brightness: v.brightness,
        calmness: v.calmness,
        mystique: v.mystery,
        playfulness: v.playfulness,
      }
      const d = Math.sqrt(
        Object.entries(w).reduce((s, [k, weight]) => {
          const key = k as keyof typeof projected
          const diff = projected[key] - card.featureWeights[key]
          return s + weight * diff * diff
        }, 0),
      )
      const score = Math.max(0, Math.min(100, Math.round(100 - d / 2.5)))
      return { ...card, score }
    })
    .sort((a, b) => b.score - a.score)

  const fallback = normalizeAnimalResult(undefined, "fallback-animal")
  const mainResult = ranked[0] ?? { ...fallback, score: 0 }
  return { mainResult, candidates: ranked.slice(0, 3), score: mainResult.score ?? 0, vector: v }
}
