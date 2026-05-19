import { animalResults } from '../data/animalResults'
import { validateAnimalResultsDataset } from './animalResultSafety'
import type { BaseFeatures, MatchResult } from '../types/animal'
import { buildResultInsight } from './resultInsights'
import type { FeatureKey, FeatureProfile } from './animalArchetypes'
import { profileForBaseAnimal } from './animalArchetypes'

const K: FeatureKey[] = ['roundness','sharpness','softness','eyeSize','eyeSharpness','eyeDroopiness','eyeUpturn','faceLength','faceCompactness','facialSpacing','mouthWarmth','smileEnergy','calmness','playfulness','elegance','wildness','cuteness','nobility','approachability','mysteriousness']
const W: Record<FeatureKey, number> = { roundness:1, sharpness:1.15, softness:1, eyeSize:1.05, eyeSharpness:1.1, eyeDroopiness:0.75, eyeUpturn:0.85, faceLength:1.2, faceCompactness:1.1, facialSpacing:1.15, mouthWarmth:1.05, smileEnergy:1.05, calmness:1.1, playfulness:0.95, elegance:1.1, wildness:0.9, cuteness:0.95, nobility:1, approachability:1, mysteriousness:1 }
const clamp=(v:number)=>Math.max(0,Math.min(100,v))

function toUserFaceVector(base: BaseFeatures): FeatureProfile {
  const eyeDroopiness = clamp(50 + (55-base.eyeSharpness)*0.35 + (base.eyeRoundness-50)*0.15)
  return {
    roundness: clamp(base.faceRoundness*0.72 + base.eyeRoundness*0.28),
    sharpness: clamp(base.jawSharpness*0.45 + base.eyeSharpness*0.35 + base.overallSharpness*0.2),
    softness: clamp(base.overallSoftness*0.42 + base.mouthSoftness*0.33 + (100-base.jawSharpness)*0.25),
    eyeSize: clamp(base.eyeRoundness*0.9 + 10),
    eyeSharpness: base.eyeSharpness,
    eyeDroopiness,
    eyeUpturn: clamp(base.eyeSharpness*0.55 + (100-base.eyeRoundness)*0.15 + 12),
    faceLength: base.faceLength,
    faceCompactness: clamp(100-base.faceLength*0.8),
    facialSpacing: base.eyeSpacing,
    mouthWarmth: clamp(base.mouthSoftness*0.6 + base.smileHint*0.4),
    smileEnergy: base.smileHint,
    calmness: clamp(base.symmetry*0.4 + base.overallSoftness*0.25 + base.faceLength*0.35),
    playfulness: clamp(base.smileHint*0.5 + base.eyeRoundness*0.3 + (100-base.eyeSharpness)*0.2),
    elegance: clamp(base.symmetry*0.5 + base.faceLength*0.25 + (100-base.smileHint)*0.25),
    wildness: clamp(base.jawSharpness*0.45 + base.overallSharpness*0.35 + base.eyeSharpness*0.2),
    cuteness: clamp(base.eyeRoundness*0.45 + base.faceRoundness*0.3 + base.mouthSoftness*0.25),
    nobility: clamp(base.symmetry*0.45 + base.faceLength*0.35 + (100-base.smileHint)*0.2),
    approachability: clamp(base.smileHint*0.45 + base.mouthSoftness*0.35 + (100-base.eyeSharpness)*0.2),
    mysteriousness: clamp(base.eyeSharpness*0.4 + (100-base.smileHint)*0.25 + base.overallSharpness*0.35),
  }
}

export function matchAnimal(vectorInput: any, baseFeatures?: BaseFeatures): MatchResult {
  const safe = validateAnimalResultsDataset(animalResults)
  const userFaceVector = baseFeatures ? toUserFaceVector(baseFeatures) : profileForBaseAnimal('cat')

  const scored = safe.map((card) => {
    const profile = profileForBaseAnimal(card.baseAnimal)
    const weightedDist = Math.sqrt(K.reduce((s,k)=> s + W[k] * ((userFaceVector[k]-profile[k])**2), 0))
    const score = clamp(100 - weightedDist * 0.35)
    const reasons = K.map((k)=>({k,delta:Math.abs(userFaceVector[k]-profile[k])})).sort((a,b)=>a.delta-b.delta).slice(0,3).map(({k})=>`${k} 축이 ${card.baseAnimal}형과 가깝습니다`)
    return { ...card, score: Math.round(score), rawScore: score, reasons }
  }).sort((a,b)=>b.rawScore-a.rawScore)

  const top3 = scored.slice(0,3)
  const total = Math.max(0.0001, top3.reduce((s,c)=>s+c.rawScore,0))
  const candidates = top3.map((c)=>({ ...c, blendRatio: Math.round((c.rawScore/total)*100) }))
  if (candidates.length===3) candidates[0].blendRatio += 100 - candidates.reduce((s,c)=>s+c.blendRatio,0)

  const mainResult = candidates[0] ?? { ...safe[0], score:0, blendRatio:100, reasons:[] }
  const insight = baseFeatures ? buildResultInsight(baseFeatures, vectorInput, mainResult, mainResult.score) : undefined
  const top5 = scored.slice(0,5).map((s)=>({id:s.id,name:s.name,score:s.score}))
  const featureImpact = K.map((k)=>({ feature:k, influence: Math.round(K.reduce((acc,kk)=>acc + (kk===k?W[k]*Math.abs(userFaceVector[k]-profileForBaseAnimal(mainResult.baseAnimal)[k]):0),0)) })).sort((a,b)=>b.influence-a.influence).slice(0,8)

  return { mainResult, candidates, score: mainResult.score, vector: vectorInput, features: baseFeatures, insight, userFaceVector, scoreBreakdown: { top5, primaryReason: candidates[0]?.reasons[0] ?? '', secondaryReason: candidates[1]?.reasons[0] ?? '', hiddenReason: candidates[2]?.reasons[0] ?? '', featureImpact } }
}
