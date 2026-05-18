import { animalResults } from '../data/animalResults'
import { normalizeAnimalResult, validateAnimalResultsDataset } from './animalResultSafety'
import type { BaseFeatures, EmotionVector, MatchResult } from '../types/animal'

const w = { softness: 1.05, sharpness: 1.2, brightness: 0.95, calmness: 1.05, mystique: 1.15, playfulness: 1 }

type BaseSignature = Pick<BaseFeatures, 'faceRoundness' | 'faceLength' | 'jawSharpness' | 'eyeRoundness' | 'eyeSharpness' | 'smileHint'>

const animalBaseTraits: Record<string, BaseSignature> = {
  cat: { faceRoundness: 52, faceLength: 56, jawSharpness: 64, eyeRoundness: 44, eyeSharpness: 68, smileHint: 38 },
  dog: { faceRoundness: 72, faceLength: 48, jawSharpness: 34, eyeRoundness: 74, eyeSharpness: 30, smileHint: 72 },
  fox: { faceRoundness: 42, faceLength: 66, jawSharpness: 82, eyeRoundness: 36, eyeSharpness: 82, smileHint: 48 },
  wolf: { faceRoundness: 36, faceLength: 74, jawSharpness: 78, eyeRoundness: 30, eyeSharpness: 76, smileHint: 26 },
  rabbit: { faceRoundness: 80, faceLength: 42, jawSharpness: 28, eyeRoundness: 86, eyeSharpness: 24, smileHint: 76 },
  deer: { faceRoundness: 46, faceLength: 72, jawSharpness: 52, eyeRoundness: 58, eyeSharpness: 46, smileHint: 42 },
  bear: { faceRoundness: 74, faceLength: 44, jawSharpness: 44, eyeRoundness: 52, eyeSharpness: 38, smileHint: 50 },
}

const baseW = { faceRoundness: 1.2, faceLength: 1.2, jawSharpness: 1.35, eyeRoundness: 1.1, eyeSharpness: 1.1, smileHint: 1 }

const parseAnimalKeys = (baseAnimal: string) => {
  const normalized = baseAnimal.toLowerCase().replace(/\s+/g, '')
  if (normalized.includes('여우')) return ['fox']
  if (normalized.includes('늑대')) return ['wolf']
  if (normalized.includes('강아지')) return ['dog']
  if (normalized.includes('고양이')) return ['cat']
  if (normalized.includes('토끼')) return ['rabbit']
  if (normalized.includes('사슴')) return ['deer']
  if (normalized.includes('곰')) return ['bear']
  return ['cat']
}

const blendTraits = (baseAnimal: string): BaseSignature => {
  const keys = parseAnimalKeys(baseAnimal)
  const traits = keys.map((key) => animalBaseTraits[key]).filter(Boolean)
  const count = Math.max(1, traits.length)
  return {
    faceRoundness: traits.reduce((s, t) => s + t.faceRoundness, 0) / count,
    faceLength: traits.reduce((s, t) => s + t.faceLength, 0) / count,
    jawSharpness: traits.reduce((s, t) => s + t.jawSharpness, 0) / count,
    eyeRoundness: traits.reduce((s, t) => s + t.eyeRoundness, 0) / count,
    eyeSharpness: traits.reduce((s, t) => s + t.eyeSharpness, 0) / count,
    smileHint: traits.reduce((s, t) => s + t.smileHint, 0) / count,
  }
}

export function matchAnimal(v: EmotionVector, baseFeatures?: BaseFeatures): MatchResult {
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
    const moodDistance = euclidean * 0.68 + manhattan * 0.32 + penalty

    const traits = blendTraits(card.baseAnimal)
    const baseDistance = baseFeatures
      ? Math.sqrt(
          (Object.entries(baseW) as Array<[keyof typeof baseW, number]>).reduce((s, [k, weight]) => {
            const diff = baseFeatures[k] - traits[k]
            return s + weight * diff * diff
          }, 0),
        )
      : 0

    const differentiationBonus = baseFeatures
      ? Math.abs(baseFeatures.faceRoundness - traits.faceRoundness) * 0.12 +
        Math.abs(baseFeatures.faceLength - traits.faceLength) * 0.11 +
        Math.abs(baseFeatures.jawSharpness - traits.jawSharpness) * 0.14
      : 0

    const distance = moodDistance + baseDistance * 0.46 + differentiationBonus * 0.22
    return { ...card, distance, moodDistance, baseDistance }
  })

  const min = Math.min(...rawRank.map((r) => r.distance))
  const max = Math.max(...rawRank.map((r) => r.distance))
  const range = Math.max(1, max - min)

  const ranked = rawRank
    .map((card) => {
      const normalized = (card.distance - min) / range
      const score = Math.round(Math.max(0, Math.min(100, 100 - normalized * 94 - card.distance * 0.06)))
      return { ...card, score }
    })
    .sort((a, b) => b.score - a.score || a.baseDistance - b.baseDistance || a.moodDistance - b.moodDistance)

  const fallback = normalizeAnimalResult(undefined, 'fallback-animal')
  const mainResult = ranked[0] ?? { ...fallback, score: 0 }
  return { mainResult, candidates: ranked.slice(0, 3), score: mainResult.score ?? 0, vector: v }
}
