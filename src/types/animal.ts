import type { AnimalResult } from '../data/animalResults'
import type { FeatureProfile } from '../lib/animalArchetypes'
import type { ResultInsight } from '../lib/resultInsights'

export type EmotionVector = {
  roundness: number; sharpness: number; softness: number; elegance: number; playfulness: number; calmness: number; brightness: number; mystery: number; warmth: number;
}

export type BaseFeatures = {
  faceRoundness: number; faceLength: number; jawSharpness: number; eyeRoundness: number; eyeSharpness: number; eyeSpacing: number; mouthSoftness: number; smileHint: number; symmetry: number; overallSoftness: number; overallSharpness: number;
}

export type FaceGeometryVector = {
  faceRoundness: number;
  faceLength: number;
  faceCompactness: number;
  jawSoftness: number;
  jawSharpness: number;
  eyeSize: number;
  eyeRoundness: number;
  eyeLength: number;
  eyeUpturn: number;
  eyeDroopiness: number;
  eyeSpacing: number;
  eyeFocus: number;
  browEyeDistance: number;
  midfaceLength: number;
  nosePresence: number;
  noseSoftness: number;
  mouthWidth: number;
  mouthWarmth: number;
  smileOpenness: number;
  facialSpacing: number;
  featureContrast: number;
  symmetryImpression: number;
  visualWeight: number;
}

export type BlendAnimal = AnimalResult & { score:number; blendRatio:number; reasons:string[] }
export type MatchResult = { mainResult: AnimalResult; candidates: BlendAnimal[]; score: number; vector: EmotionVector; features?: BaseFeatures; insight?: ResultInsight; userFaceVector?: FeatureProfile; scoreBreakdown?: { top5: Array<{id:string;name:string;score:number}>; primaryReason:string; secondaryReason:string; hiddenReason:string; featureImpact: Array<{feature:keyof FeatureProfile; influence:number}>; [key: string]: unknown } }
