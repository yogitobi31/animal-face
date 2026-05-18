import type { BaseFeatures, EmotionVector } from '../types/animal'

const clamp=(v:number)=>Math.max(0,Math.min(100,v))
const sigmoid=(v:number, center=50, steep=0.09)=>100/(1+Math.exp(-steep*(v-center)))

export function normalizeFeatures(f: BaseFeatures): BaseFeatures { return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,clamp(v)])) as BaseFeatures }

export function toEmotionVector(f0: BaseFeatures): EmotionVector {
  const f=normalizeFeatures(f0)

  const faceBalance = 100 - Math.abs(f.faceLength - 52) * 1.8
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

  return {
    roundness: clamp(sigmoid(roundness, 50, 0.11)),
    sharpness: clamp(sigmoid(sharpness, 52, 0.1)),
    softness: clamp(sigmoid(softness, 49, 0.1)),
    elegance: clamp(sigmoid(elegance, 53, 0.09)),
    playfulness: clamp(sigmoid(playfulness, 47, 0.1)),
    calmness: clamp(sigmoid(calmness, 50, 0.09)),
    brightness: clamp(sigmoid(brightness, 48, 0.1)),
    mystery: clamp(sigmoid(mystery, 52, 0.09)),
    warmth: clamp(sigmoid(warmth, 50, 0.1)),
  }
}
