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

const meets = (ok:boolean) => ok ? 1 : 0

export function matchAnimal(vectorInput: any, baseFeatures?: BaseFeatures): MatchResult {
  const safe = validateAnimalResultsDataset(animalResults)
  const userFaceVector = baseFeatures ? toUserFaceVector(baseFeatures) : profileForBaseAnimal('cat')
  const recentPrimaryDistribution = (globalThis as any).__animalPrimaryHistory ?? []

  const scored = safe.map((card) => {
    const profile = profileForBaseAnimal(card.baseAnimal)
    const diffs = K.map((k)=>({feature:k, diff:Math.abs(userFaceVector[k]-profile[k]), weighted:W[k]*Math.abs(userFaceVector[k]-profile[k])}))
    const structureKeys: FeatureKey[] = ['roundness','sharpness','eyeSize','eyeSharpness','eyeUpturn','faceLength','faceCompactness','facialSpacing']
    const expressionKeys: FeatureKey[] = ['mouthWarmth','smileEnergy','calmness']
    const moodKeys: FeatureKey[] = ['playfulness','elegance','wildness','cuteness','nobility','approachability','mysteriousness','softness']
    const styleKeys: FeatureKey[] = ['eyeDroopiness']
    const scorePart = (keys:FeatureKey[]) => clamp(100 - Math.sqrt(keys.reduce((s,k)=>s+W[k]*((userFaceVector[k]-profile[k])**2),0))*0.45)
    const facialStructureScore = scorePart(structureKeys)
    const expressionScore = scorePart(expressionKeys)
    const moodScore = scorePart(moodKeys)
    const photoStyleScore = scorePart(styleKeys)

    const rawScore = facialStructureScore*0.5 + expressionScore*0.25 + moodScore*0.2 + photoStyleScore*0.05

    let penaltyMultiplier = 1
    const evidenceReasons: string[] = []
    const catConditions = [
      meets(userFaceVector.eyeSharpness >= 64),
      meets(userFaceVector.eyeUpturn >= 60),
      meets(userFaceVector.calmness >= 63),
      meets(userFaceVector.facialSpacing <= 56),
      meets(userFaceVector.mouthWarmth <= 62),
      meets(userFaceVector.approachability <= 60),
      meets(userFaceVector.mysteriousness >= 64),
    ].reduce((a,b)=>a+b,0)
    const peacockConditions = [
      meets(userFaceVector.nobility >= 66),
      meets(userFaceVector.elegance >= 66),
      meets((userFaceVector.nobility+userFaceVector.elegance+userFaceVector.mysteriousness)/3 >= 67),
      meets(userFaceVector.sharpness >= 63),
      meets(userFaceVector.mysteriousness >= 64),
      meets(userFaceVector.softness + 8 < userFaceVector.elegance),
      meets(facialStructureScore >= 64),
    ].reduce((a,b)=>a+b,0)

    const base = card.baseAnimal
    if (base === '고양이' && catConditions < 3) {
      penaltyMultiplier *= 0.8
      evidenceReasons.push(`cat 조건 부족(${catConditions}/7)`)
    }
    if (base === '공작') {
      const styleHeavy = photoStyleScore > facialStructureScore && photoStyleScore > moodScore
      if (peacockConditions < 3) {
        penaltyMultiplier *= 0.7
        evidenceReasons.push(`peacock 조건 부족(${peacockConditions}/7)`)
      }
      if (styleHeavy) {
        penaltyMultiplier *= 0.65
        evidenceReasons.push('peacock 점수가 photoStyle 영향이 큼')
      }
    }

    const animalPenalty: Record<string, number> = { 고양이: 0.93, 공작: 0.9, 여우: 0.95, 곰: 1.04, 햄스터: 1.06, 양: 1.05, 펭귄: 1.04, 수달: 1.04, 너구리: 1.03 }
    penaltyMultiplier *= animalPenalty[base] ?? 1

    const evidenceRules: Record<string, number> = {
      사슴: meets(userFaceVector.softness>=60)+meets(userFaceVector.facialSpacing<=56 || userFaceVector.eyeSharpness>=58)+meets(userFaceVector.sharpness<=72),
      강아지: meets(userFaceVector.approachability>=62)+meets(userFaceVector.mouthWarmth>=60)+meets(userFaceVector.smileEnergy>=58),
      토끼: meets(userFaceVector.faceCompactness>=58)+meets(userFaceVector.cuteness>=62)+meets(userFaceVector.eyeSize>=60)+meets(userFaceVector.sharpness<=58),
      여우: meets(userFaceVector.sharpness>=66)+meets(userFaceVector.eyeUpturn>=60)+meets(userFaceVector.playfulness>=52 || userFaceVector.mysteriousness>=64)+meets(userFaceVector.softness<=66),
      곰: meets(userFaceVector.roundness>=62)+meets(userFaceVector.calmness>=60)+meets(userFaceVector.softness>=60)+meets(userFaceVector.wildness<=58),
      수달: meets(userFaceVector.playfulness>=58)+meets(userFaceVector.mouthWarmth>=58)+meets(userFaceVector.faceCompactness>=54)+meets(userFaceVector.approachability>=60),
      올빼미: meets(userFaceVector.eyeSharpness>=64)+meets(userFaceVector.calmness>=65)+meets(userFaceVector.nobility>=60)+meets(userFaceVector.smileEnergy<=58),
    }
    const ruleCount = evidenceRules[base]
    if (typeof ruleCount === 'number' && ruleCount < 3) {
      penaltyMultiplier *= 0.82
      evidenceReasons.push(`${base} minimum evidence 부족(${ruleCount}/4)`)
    }

    const finalScore = clamp(rawScore * penaltyMultiplier)
    const reasons = diffs.sort((a,b)=>a.diff-b.diff).slice(0,3).map(({feature})=>`${feature} 축이 ${card.baseAnimal}형과 가깝습니다`)

    return { ...card, score: Math.round(finalScore), rawScore, finalScore, penaltyMultiplier, reasons, evidenceReasons, categoryScores: { facialStructureScore, expressionScore, moodScore, photoStyleScore }, featureContributors: diffs.sort((a,b)=>a.weighted-b.weighted).slice(0,5) }
  }).sort((a,b)=>b.finalScore-a.finalScore)

  if (scored[0] && scored[1]) {
    const gap = scored[0].finalScore - scored[1].finalScore
    const top = scored[0]
    if ((top.baseAnimal === '고양이' || top.baseAnimal === '공작') && gap < 3) {
      const missingEvidence = top.evidenceReasons.some((r:string)=>r.includes('조건 부족') || r.includes('minimum evidence 부족'))
      if (missingEvidence) {
        const replacement = scored.slice(1).find((s)=>s.finalScore >= top.finalScore-4)
        if (replacement) {
          const idx = scored.findIndex((s)=>s.id === replacement.id)
          scored.splice(idx,1)
          scored.unshift(replacement)
        }
      }
    }
  }

  const top3 = scored.slice(0,3)
  const total = Math.max(0.0001, top3.reduce((s,c)=>s+c.finalScore,0))
  const candidates = top3.map((c)=>({ ...c, blendRatio: Math.round((c.finalScore/total)*100) }))
  if (candidates.length===3) candidates[0].blendRatio += 100 - candidates.reduce((s,c)=>s+c.blendRatio,0)

  const mainResult = candidates[0] ?? { ...safe[0], score:0, blendRatio:100, reasons:[] }
  const insight = baseFeatures ? buildResultInsight(baseFeatures, vectorInput, mainResult, mainResult.score) : undefined
  const top5 = scored.slice(0,5).map((s)=>({id:s.id,name:s.name,score:s.score}))
  const top10AnimalScores = scored.slice(0,10).map((s)=>({ id: s.id, name: s.name, baseAnimal: s.baseAnimal, rawScore: Number(s.rawScore.toFixed(2)), finalScore: Number(s.finalScore.toFixed(2)), penaltyMultiplier: Number(s.penaltyMultiplier.toFixed(3)) }))
  const featureImpact = K.map((k)=>({ feature:k, influence: Math.round(W[k]*Math.abs(userFaceVector[k]-profileForBaseAnimal(mainResult.baseAnimal)[k])) })).sort((a,b)=>b.influence-a.influence).slice(0,8)

  const primaryBase = (mainResult as any).baseAnimal
  const history = [...recentPrimaryDistribution, primaryBase].slice(-30)
  ;(globalThis as any).__animalPrimaryHistory = history
  const freq = history.reduce((acc:Record<string,number>, cur:string)=>{acc[cur]=(acc[cur]??0)+1; return acc}, {})
  const warnings = Object.entries(freq).filter(([,count]) => (count as number) / history.length >= 0.3).map(([animal, count]) => `Warning: ${animal} selected ${Math.round(((count as number)/history.length)*100)}% of recent results. Check scoring bias.`)

  const whyNotOtherAnimals = scored.slice(1,4).map((s)=> `${s.name}: ${s.evidenceReasons?.[0] ?? '상대적으로 핵심 얼굴 구조 유사도 점수가 더 낮았습니다.'}`)

  return { mainResult, candidates, score: mainResult.score, vector: vectorInput, features: baseFeatures, insight, userFaceVector, scoreBreakdown: { top5, primaryReason: candidates[0]?.reasons[0] ?? '', secondaryReason: candidates[1]?.reasons[0] ?? '', hiddenReason: candidates[2]?.reasons[0] ?? '', featureImpact, top10AnimalScores, primaryAnimal: candidates[0]?.name ?? '', secondaryAnimal: candidates[1]?.name ?? '', hiddenAnimal: candidates[2]?.name ?? '', blendRatio: candidates.map((c)=>({name:c.name,ratio:c.blendRatio})), confidence: Math.round((candidates[0]?.score ?? 0) - (candidates[1]?.score ?? 0) + 50), topFeatures: featureImpact.slice(0,3), whyNotOtherAnimals, warnings, catPeacockAudit: scored.filter((s)=>s.baseAnimal==='고양이' || s.baseAnimal==='공작').map((s)=>({name:s.name, selected:s.id===mainResult.id, evidenceReasons:s.evidenceReasons, categoryScores:s.categoryScores})), scoreByCategory: candidates.map((c:any)=>({name:c.name, ...c.categoryScores})) } }
}
