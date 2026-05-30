import { animalResults } from '../data/animalResults'
import { validateAnimalResultsDataset } from './animalResultSafety'
import type { BaseFeatures, FaceGeometryVector, MatchResult } from '../types/animal'
import { buildResultInsight } from './resultInsights'
import { animalGeometryProfiles, profileForBaseAnimal } from './animalArchetypes'

const clamp = (v:number)=>Math.max(0,Math.min(100,v))
const gKeys: Array<keyof FaceGeometryVector> = [
  'faceRoundness','faceLength','faceCompactness','jawSoftness','jawSharpness','eyeSize','eyeRoundness','eyeLength','eyeUpturn','eyeDroopiness','eyeSpacing','eyeFocus','browEyeDistance','midfaceLength','nosePresence','noseSoftness','mouthWidth','mouthWarmth','smileOpenness','facialSpacing','featureContrast','symmetryImpression','visualWeight',
]
const eyeKeys: Array<keyof FaceGeometryVector> = ['eyeSize','eyeRoundness','eyeLength','eyeUpturn','eyeDroopiness','eyeFocus','eyeSpacing']
const shapeKeys: Array<keyof FaceGeometryVector> = ['faceRoundness','faceLength','faceCompactness','jawSoftness','jawSharpness','facialSpacing','visualWeight']
const mouthKeys: Array<keyof FaceGeometryVector> = ['mouthWidth','mouthWarmth','smileOpenness','eyeFocus']

function toFaceGeometryVector(base: BaseFeatures): FaceGeometryVector { /* same */
  return { faceRoundness: base.faceRoundness, faceLength: base.faceLength, faceCompactness: clamp(100 - base.faceLength * 0.8), jawSoftness: clamp(100 - base.jawSharpness), jawSharpness: base.jawSharpness, eyeSize: clamp(base.eyeRoundness * 0.75 + 20), eyeRoundness: base.eyeRoundness, eyeLength: clamp(base.eyeSharpness * 0.8 + 10), eyeUpturn: clamp(base.eyeSharpness * 0.55 + (100-base.eyeRoundness) * 0.22), eyeDroopiness: clamp((100-base.eyeSharpness) * 0.5 + base.eyeRoundness * 0.3), eyeSpacing: base.eyeSpacing, eyeFocus: clamp(base.eyeSharpness * 0.65 + base.symmetry * 0.35), browEyeDistance: clamp((100-base.eyeSharpness) * 0.4 + base.faceLength * 0.3), midfaceLength: clamp(base.faceLength * 0.75 + (100-base.faceRoundness) * 0.25), nosePresence: clamp(base.overallSharpness * 0.55 + base.faceLength * 0.45), noseSoftness: clamp(base.overallSoftness * 0.6 + (100-base.overallSharpness) * 0.4), mouthWidth: clamp(base.mouthSoftness * 0.8 + 12), mouthWarmth: clamp(base.mouthSoftness * 0.6 + base.smileHint * 0.4), smileOpenness: base.smileHint, facialSpacing: base.eyeSpacing, featureContrast: clamp(Math.abs(base.overallSharpness - base.overallSoftness) * 1.4), symmetryImpression: base.symmetry, visualWeight: clamp(base.overallSharpness * 0.5 + base.faceLength * 0.25 + base.jawSharpness * 0.25) }
}
const mapAnimalKey = (baseAnimal: string) => { const s=baseAnimal.toLowerCase(); if (s.includes('공작')||s.includes('peacock')) return 'peacock'; if (s.includes('사슴')||s.includes('deer')||s.includes('stag')) return 'deer'; if (s.includes('고양이')||s.includes('cat')) return 'cat'; if (s.includes('강아지')||s.includes('dog')||s.includes('puppy')) return 'puppy'; if (s.includes('토끼')||s.includes('rabbit')) return 'rabbit'; if (s.includes('여우')||s.includes('fox')) return 'fox'; if (s.includes('곰')||s.includes('bear')) return 'bear'; if (s.includes('백조')||s.includes('swan')) return 'swan'; if (s.includes('올빼미')||s.includes('owl')) return 'owl'; if (s.includes('햄스터')||s.includes('hamster')) return 'hamster'; if (s.includes('수달')||s.includes('otter')) return 'otter'; return 'cat' }
const subScore=(geo:FaceGeometryVector, profile:Partial<FaceGeometryVector>, keys:Array<keyof FaceGeometryVector>)=>clamp(100-Math.sqrt(keys.reduce((s,k)=>s+((geo[k]-(profile[k]??50))**2),0)/keys.length)*1.8)

export function matchAnimal(vectorInput: any, baseFeatures?: BaseFeatures): MatchResult {
  const safe = validateAnimalResultsDataset(animalResults)
  const geometry = baseFeatures ? toFaceGeometryVector(baseFeatures) : toFaceGeometryVector({ faceRoundness:50, faceLength:50, jawSharpness:50, eyeRoundness:50, eyeSharpness:50, eyeSpacing:50, mouthSoftness:50, smileHint:50, symmetry:50, overallSoftness:50, overallSharpness:50 })
  const scored = safe.map((card) => {
    const gProfile = animalGeometryProfiles[mapAnimalKey(card.baseAnimal)] ?? animalGeometryProfiles.cat
    const mood = profileForBaseAnimal(card.baseAnimal)
    const geometryScore = subScore(geometry, gProfile, gKeys)
    const expressionScore = subScore(geometry, gProfile, mouthKeys)
    const moodScore = clamp(((100 - Math.abs(geometry.faceRoundness - mood.roundness) * 0.7) + (100 - Math.abs(geometry.jawSharpness - mood.sharpness) * 0.7))/2)
    const photoStyleScore = 50
    const finalScore = clamp(geometryScore * 0.72 + expressionScore * 0.17 + moodScore * 0.08 + photoStyleScore * 0.03)
    return { ...card, geometryScore, expressionScore, moodScore, photoStyleScore, finalScore, eyeScore: subScore(geometry,gProfile,eyeKeys), faceShapeScore: subScore(geometry,gProfile,shapeKeys), mouthExpressionScore: subScore(geometry,gProfile,mouthKeys) }
  })
  const topGeometry = [...scored].sort((a,b)=>b.geometryScore-a.geometryScore)
  let primary = topGeometry[0]
  const checkCat = ()=>[geometry.eyeLength>=60,geometry.eyeUpturn>=50,geometry.eyeFocus>=62,geometry.mouthWarmth<=60,geometry.smileOpenness<=60,geometry.facialSpacing<=55,vectorInput?.calmness>=55].filter(Boolean).length>=4
  const checkPeacock=(c:any)=>[geometry.featureContrast>=58,geometry.visualWeight>=58,geometry.symmetryImpression>=60,geometry.eyeFocus>=62,geometry.featureContrast>=60,c.faceShapeScore>=60,geometry.facialSpacing>=50].filter(Boolean).length>=4
  if (mapAnimalKey(primary.baseAnimal)==='cat' && !checkCat()) primary = topGeometry.find((c)=>mapAnimalKey(c.baseAnimal)!=='cat') ?? primary
  if (mapAnimalKey(primary.baseAnimal)==='peacock' && !checkPeacock(primary)) primary = topGeometry.find((c)=>mapAnimalKey(c.baseAnimal)!=='peacock') ?? primary
  const ordered = [primary, ...[...scored].sort((a,b)=>b.finalScore-a.finalScore).filter((c)=>c.id!==primary.id)].slice(0,3)
  const scoreTotal = Math.max(1, ordered.reduce((s,c)=>s+c.finalScore,0))
  const rawRatios = ordered.map((c)=> (c.finalScore/scoreTotal)*100)
  const rounded = rawRatios.map((r)=>Math.round(r)); rounded[2] += 100 - (rounded[0]+rounded[1]+rounded[2])
  const candidates = ordered.map((c,idx)=>({ ...c, score: Math.round(c.finalScore), blendRatio: rounded[idx], reasons:[`geometry ${Math.round(c.geometryScore)}`,`eye ${Math.round(c.eyeScore)} / shape ${Math.round(c.faceShapeScore)} / mouth ${Math.round(c.mouthExpressionScore)}`]}))
  const eyeAnimal = [...scored].sort((a,b)=>b.eyeScore-a.eyeScore)[0]
  const faceShapeAnimal = [...scored].sort((a,b)=>b.faceShapeScore-a.faceShapeScore)[0]
  const mouthExpressionAnimal = [...scored].sort((a,b)=>b.mouthExpressionScore-a.mouthExpressionScore)[0]
  const faceEvidence = [
    { part:'눈매', feature:'eyeLength + eyeFocus', text:`눈의 가로 길이(${Math.round(geometry.eyeLength)})와 시선 집중도(${Math.round(geometry.eyeFocus)})가 높아 ${eyeAnimal.baseAnimalLabel} 요소가 감지됩니다.`},
    { part:'얼굴형', feature:'jawSoftness + facialSpacing', text:`턱선 부드러움(${Math.round(geometry.jawSoftness)})과 이목구비 간격(${Math.round(geometry.facialSpacing)})이 ${faceShapeAnimal.baseAnimalLabel} 프로파일에 가깝습니다.`},
    { part:'입매', feature:'mouthWarmth + smileOpenness', text:`입매 온도(${Math.round(geometry.mouthWarmth)})와 개방감(${Math.round(geometry.smileOpenness)})으로 ${mouthExpressionAnimal.baseAnimalLabel} 표정 점수가 높게 나왔습니다.`},
  ]
  const gap = Math.max(0, ordered[0].geometryScore - (ordered[1]?.geometryScore ?? 0))
  const evidencePassRate = clamp((faceEvidence.length/3)*100)
  const scoreGapConfidence = clamp(gap*6)
  const explanationSpecificity = 90
  let confidence = Math.round(ordered[0].geometryScore*0.45 + evidencePassRate*0.25 + scoreGapConfidence*0.15 + explanationSpecificity*0.15)
  if (ordered[0].geometryScore < 70) confidence = Math.min(confidence,74)
  if (faceEvidence.length < 3) confidence = Math.min(confidence,70)
  const confidenceLabel = confidence >= 85 ? '얼굴 구조 기준으로 매우 높은 닮음' : confidence >= 75 ? '얼굴 구조 기준으로 꽤 높은 닮음' : confidence >= 60 ? '분위기와 일부 얼굴 특징이 함께 맞는 닮음' : '혼합형에 가까운 약한 닮음'
  const similarButRejected = [...scored].sort((a,b)=>b.finalScore-a.finalScore).filter((c)=>!ordered.map(o=>o.id).includes(c.id)).slice(0,3).map((c)=>({label:c.baseAnimalLabel, score:Math.round(c.finalScore), reason:`유사 점수는 높지만 eye/shape/mouth 세부축에서 ${ordered[0].baseAnimalLabel}보다 약해 제외되었습니다.`}))

  return { mainResult: candidates[0], candidates, score:candidates[0].score, vector: vectorInput, features: baseFeatures, insight: baseFeatures ? buildResultInsight(baseFeatures, vectorInput, candidates[0], confidence) : undefined, faceEvidence, similarButRejected,
    scoreBreakdown:{ top5: topGeometry.slice(0,5).map((s)=>({id:s.id,name:s.name,score:Math.round(s.finalScore)})), primaryReason:'geometry 중심 primary 선출', secondaryReason:'secondary는 보조 축에서 유사', hiddenReason:'hidden은 표정축 유사', featureImpact:[], extractedFaceGeometryVector: geometry, primaryAnimal:candidates[0].baseAnimalLabel, secondaryAnimal:candidates[1]?.baseAnimalLabel, hiddenAnimal:candidates[2]?.baseAnimalLabel, eyeAnimal: {label: eyeAnimal.baseAnimalLabel, features: eyeKeys}, faceShapeAnimal: {label: faceShapeAnimal.baseAnimalLabel, features: shapeKeys}, mouthExpressionAnimal: {label: mouthExpressionAnimal.baseAnimalLabel, features: mouthKeys}, top10AnimalsByGeometryScore: topGeometry.slice(0,10).map((s)=>({id:s.id,name:s.name,geometryScore:Number(s.geometryScore.toFixed(2))})), top10AnimalsByFinalScore:[...scored].sort((a,b)=>b.finalScore-a.finalScore).slice(0,10).map((s)=>({id:s.id,name:s.name,finalScore:Number(s.finalScore.toFixed(2))})), blendRatioDebug: ordered.map((c,idx)=>({label:c.baseAnimalLabel,score:Number(c.finalScore.toFixed(2)),ratio:rounded[idx]})), confidenceDebug:{geometryScore:ordered[0].geometryScore,evidencePassRate,scoreGapConfidence,explanationSpecificity,confidence,confidenceLabel}, faceEvidence }
  }
}
