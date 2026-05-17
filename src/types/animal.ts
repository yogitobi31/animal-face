export type EmotionVector = {
  roundness: number; sharpness: number; softness: number; elegance: number; playfulness: number; calmness: number; brightness: number; mystery: number; warmth: number;
}
export type BaseFeatures = {
  faceRoundness: number; faceLength: number; jawSharpness: number; eyeRoundness: number; eyeSharpness: number; eyeSpacing: number; mouthSoftness: number; smileHint: number; symmetry: number; overallSoftness: number; overallSharpness: number;
}
export type AnimalCard = { id: string; name: string; animalFamily: string; blend: string[]; rarity: 'common'|'rare'|'hidden'; imageUrl: string; illustrationKey: string; profile: EmotionVector; catchphrase: string; description: string; keywords: string[]; colorMood: string; }
export type MatchResult = { mainResult: AnimalCard; candidates: Array<AnimalCard & {score:number}>; score: number; vector: EmotionVector }
