export type EmotionVector = {
  roundness: number; sharpness: number; softness: number; elegance: number; playfulness: number; calmness: number; brightness: number; mystery: number; warmth: number;
}

export type BaseFeatures = {
  faceRoundness: number; faceLength: number; jawSharpness: number; eyeRoundness: number; eyeSharpness: number; eyeSpacing: number; mouthSoftness: number; smileHint: number; symmetry: number; overallSoftness: number; overallSharpness: number;
}

export type FeatureWeights = EmotionVector

export type AnimalCard = {
  id: string
  name: string
  baseAnimal: string
  category: string
  moodTags: string[]
  tagline: string
  description: string
  palette: string
  illustrationKey: string
  featureWeights: FeatureWeights
  rarity: 'common'|'rare'|'hidden'
}

export type MatchResult = { mainResult: AnimalCard; candidates: Array<AnimalCard & {score:number}>; score: number; vector: EmotionVector }
