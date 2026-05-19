import type { AnimalResult } from '../data/animalResults'
import type { ResultInsight } from '../lib/resultInsights'

export type EmotionVector = {
  roundness: number; sharpness: number; softness: number; elegance: number; playfulness: number; calmness: number; brightness: number; mystery: number; warmth: number;
}

export type BaseFeatures = {
  faceRoundness: number; faceLength: number; jawSharpness: number; eyeRoundness: number; eyeSharpness: number; eyeSpacing: number; mouthSoftness: number; smileHint: number; symmetry: number; overallSoftness: number; overallSharpness: number;
}

export type MatchResult = { mainResult: AnimalResult; candidates: Array<AnimalResult & {score:number}>; score: number; vector: EmotionVector; features?: BaseFeatures; insight?: ResultInsight }
