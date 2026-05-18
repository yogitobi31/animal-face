import { matchAnimal } from '../src/lib/matchAnimal'
import type { BaseFeatures, EmotionVector } from '../src/types/animal'

const clamp=(v:number)=>Math.max(0,Math.min(100,v))
const spread=(v:number, center=50, gain=1.15)=>clamp(center + (v-center) * gain)

function toEmotionVector(f: BaseFeatures): EmotionVector {
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
  return { roundness: spread(roundness,50,1.2), sharpness: spread(sharpness,52,1.22), softness: spread(softness,49,1.16), elegance: spread(elegance,53,1.2), playfulness: spread(playfulness,47,1.22), calmness: spread(calmness,50,1.15), brightness: spread(brightness,48,1.24), mystery: spread(mystery,52,1.18), warmth: spread(warmth,50,1.16)}
}
const profiles: Record<string, BaseFeatures> = {
  'round-soft-face': { faceRoundness: 82, faceLength: 34, jawSharpness: 24, eyeRoundness: 80, eyeSharpness: 28, eyeSpacing: 48, mouthSoftness: 78, smileHint: 72, symmetry: 74, overallSoftness: 86, overallSharpness: 22 },
  'long-elegant-face': { faceRoundness: 36, faceLength: 84, jawSharpness: 54, eyeRoundness: 46, eyeSharpness: 58, eyeSpacing: 44, mouthSoftness: 52, smileHint: 40, symmetry: 90, overallSoftness: 48, overallSharpness: 62 },
  'sharp-intense-face': { faceRoundness: 30, faceLength: 78, jawSharpness: 88, eyeRoundness: 28, eyeSharpness: 90, eyeSpacing: 38, mouthSoftness: 24, smileHint: 18, symmetry: 64, overallSoftness: 24, overallSharpness: 92 },
  'playful-bright-face': { faceRoundness: 70, faceLength: 42, jawSharpness: 30, eyeRoundness: 82, eyeSharpness: 34, eyeSpacing: 52, mouthSoftness: 72, smileHint: 88, symmetry: 70, overallSoftness: 80, overallSharpness: 34 },
  'calm-mysterious-face': { faceRoundness: 42, faceLength: 72, jawSharpness: 72, eyeRoundness: 38, eyeSharpness: 74, eyeSpacing: 36, mouthSoftness: 36, smileHint: 26, symmetry: 88, overallSoftness: 34, overallSharpness: 76 }
}
for (const [name, base] of Object.entries(profiles)) {
  const matched = matchAnimal(toEmotionVector(base), base)
  console.log(`${name}: ${matched.candidates.map((c) => c.id).join(', ')}`)
}
