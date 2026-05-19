import type { BaseFeatures, EmotionVector } from '../types/animal'

const clamp=(v:number)=>Math.max(0,Math.min(100,v))
const spread=(v:number, center=50, gain=1.35)=>clamp(center + (v-center) * gain)

function devLogFeatures(base: BaseFeatures, vector: EmotionVector) {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.debug('[animal-face] feature pipeline', { baseFeatures: base, emotionVector: vector })
  }
}

export function normalizeFeatures(f: BaseFeatures): BaseFeatures { return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,clamp(v)])) as BaseFeatures }

export function toEmotionVector(f0: BaseFeatures): EmotionVector {
  const f=normalizeFeatures(f0)

  const faceBalance = 100 - Math.abs(f.faceLength - 52) * 1.45
  const eyeSoftness = clamp(f.eyeRoundness * 0.7 + (100-f.eyeSharpness) * 0.3)
  const jawSoftness = 100 - f.jawSharpness
  const smileEnergy = clamp(f.smileHint * 0.75 + f.mouthSoftness * 0.25)
  const structureContrast = Math.abs(f.overallSharpness - f.overallSoftness)

  const roundness = clamp(f.faceRoundness*0.4 + eyeSoftness*0.3 + jawSoftness*0.3)
  const sharpness = clamp(f.jawSharpness*0.38 + f.eyeSharpness*0.32 + f.overallSharpness*0.3)
  const softness = clamp(f.mouthSoftness*0.34 + f.overallSoftness*0.4 + jawSoftness*0.26)
  const elegance = clamp(f.symmetry*0.36 + faceBalance*0.24 + (100-f.smileHint)*0.16 + (100-structureContrast)*0.24)
  const playfulness = clamp(smileEnergy*0.48 + f.eyeRoundness*0.25 + (100-f.eyeSpacing)*0.09 + (100-f.eyeSharpness)*0.18)
  const calmness = clamp(f.symmetry*0.34 + (100-smileEnergy)*0.24 + f.faceLength*0.18 + f.overallSoftness*0.24)
  const brightness = clamp(smileEnergy*0.5 + eyeSoftness*0.2 + f.mouthSoftness*0.3)
  const mystery = clamp(sharpness*0.42 + calmness*0.3 + (100-smileEnergy)*0.28)
  const warmth = clamp(softness*0.5 + brightness*0.3 + (100-f.eyeSharpness)*0.2)

  const vector: EmotionVector = {
    roundness: spread(roundness, 50, 1.2),
    sharpness: spread(sharpness, 52, 1.22),
    softness: spread(softness, 49, 1.16),
    elegance: spread(elegance, 53, 1.2),
    playfulness: spread(playfulness, 47, 1.22),
    calmness: spread(calmness, 50, 1.15),
    brightness: spread(brightness, 48, 1.24),
    mystery: spread(mystery, 52, 1.18),
    warmth: spread(warmth, 50, 1.16),
  }

  devLogFeatures(f, vector)
  return vector
}
