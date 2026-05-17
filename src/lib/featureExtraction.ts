import type { BaseFeatures, EmotionVector } from '../types/animal'
const clamp=(v:number)=>Math.max(0,Math.min(100,v))
export function normalizeFeatures(f: BaseFeatures): BaseFeatures { return Object.fromEntries(Object.entries(f).map(([k,v])=>[k,clamp(v)])) as BaseFeatures }
// 기본 특징(얼굴 비율 지표)을 감성 축으로 선형 결합해 0~100으로 변환한다.
export function toEmotionVector(f0: BaseFeatures): EmotionVector {
  const f=normalizeFeatures(f0)
  const roundness = clamp(f.faceRoundness*0.45 + f.eyeRoundness*0.35 + (100-f.jawSharpness)*0.2)
  const sharpness = clamp(f.jawSharpness*0.5 + f.eyeSharpness*0.35 + f.overallSharpness*0.15)
  const softness = clamp(f.mouthSoftness*0.4 + f.overallSoftness*0.45 + (100-f.overallSharpness)*0.15)
  const elegance = clamp(f.symmetry*0.45 + (100-Math.abs(f.faceLength-60))*0.35 + (100-f.smileHint)*0.2)
  const playfulness = clamp(f.smileHint*0.45 + f.eyeRoundness*0.25 + (100-f.eyeSharpness)*0.3)
  const calmness = clamp(f.symmetry*0.3 + f.faceLength*0.2 + (100-f.smileHint)*0.25 + f.overallSoftness*0.25)
  const brightness = clamp(f.smileHint*0.5 + f.eyeRoundness*0.2 + f.mouthSoftness*0.3)
  const mystery = clamp(sharpness*0.45 + calmness*0.35 + (100-f.smileHint)*0.2)
  const warmth = clamp(f.mouthSoftness*0.35 + f.overallSoftness*0.35 + f.smileHint*0.3)
  return { roundness, sharpness, softness, elegance, playfulness, calmness, brightness, mystery, warmth }
}
export function pseudoFeaturesFromHash(hash:string): BaseFeatures {
  const take=(i:number)=>parseInt(hash.slice(i*2,i*2+2),16)
  const map=(i:number,min=20,max=92)=>Math.round(min+(take(i)/255)*(max-min))
  return normalizeFeatures({faceRoundness:map(0),faceLength:map(1),jawSharpness:map(2),eyeRoundness:map(3),eyeSharpness:map(4),eyeSpacing:map(5),mouthSoftness:map(6),smileHint:map(7),symmetry:map(8),overallSoftness:map(9),overallSharpness:map(10)})
}
