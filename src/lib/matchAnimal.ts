import { animalResults } from '../data/animalResults'
import { normalizeAnimalResult, validateAnimalResultsDataset } from './animalResultSafety'
import type { EmotionVector, MatchResult } from '../types/animal'

const w = { softness: 1.05, sharpness: 1.2, brightness: 0.95, calmness: 1.05, mystique: 1.15, playfulness: 1 }

export function matchAnimal(v: EmotionVector): MatchResult {
  const safeDataset = validateAnimalResultsDataset(animalResults)
  const projected = {
    softness: v.softness,
    sharpness: v.sharpness,
    brightness: v.brightness,
    calmness: v.calmness,
    mystique: v.mystery,
    playfulness: v.playfulness,
  }

  const rawRank = safeDataset.map((card) => {
    const diffs = Object.entries(w).map(([k, weight]) => {
      const key = k as keyof typeof projected
      const diff = projected[key] - card.featureWeights[key]
      return { key, diff, weight }
    })
    const euclidean = Math.sqrt(diffs.reduce((s, it) => s + it.weight * it.diff * it.diff, 0))
    const manhattan = diffs.reduce((s, it) => s + Math.abs(it.diff) * it.weight, 0)
    const penalty = diffs.sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff)).slice(0, 2).reduce((s, it) => s + Math.abs(it.diff) * 0.12, 0)
    const distance = euclidean * 0.72 + manhattan * 0.28 + penalty
    return { ...card, distance }
  })

  const min = Math.min(...rawRank.map((r) => r.distance))
  const max = Math.max(...rawRank.map((r) => r.distance))
  const range = Math.max(1, max - min)

  const ranked = rawRank
    .map((card) => {
      const normalized = (card.distance - min) / range
      const score = Math.round(Math.max(0, Math.min(100, 100 - normalized * 85 - card.distance * 0.08)))
      return { ...card, score }
    })
    .sort((a, b) => b.score - a.score)

  const fallback = normalizeAnimalResult(undefined, 'fallback-animal')
  const mainResult = ranked[0] ?? { ...fallback, score: 0 }
  return { mainResult, candidates: ranked.slice(0, 3), score: mainResult.score ?? 0, vector: v }
}
