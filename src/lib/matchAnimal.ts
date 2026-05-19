import { animalResults } from '../data/animalResults'
import { validateAnimalResultsDataset } from './animalResultSafety'
import type { BaseFeatures, FaceGeometryVector, MatchResult } from '../types/animal'
import { buildResultInsight } from './resultInsights'
import { animalGeometryProfiles, profileForBaseAnimal } from './animalArchetypes'

const clamp = (v:number)=>Math.max(0,Math.min(100,v))
const gKeys: Array<keyof FaceGeometryVector> = [
  'faceRoundness','faceLength','faceCompactness','jawSoftness','jawSharpness','eyeSize','eyeRoundness','eyeLength','eyeUpturn','eyeDroopiness','eyeSpacing','eyeFocus','browEyeDistance','midfaceLength','nosePresence','noseSoftness','mouthWidth','mouthWarmth','smileOpenness','facialSpacing','featureContrast','symmetryImpression','visualWeight',
]

function toFaceGeometryVector(base: BaseFeatures): FaceGeometryVector {
  return {
    faceRoundness: base.faceRoundness,
    faceLength: base.faceLength,
    faceCompactness: clamp(100 - base.faceLength * 0.8),
    jawSoftness: clamp(100 - base.jawSharpness),
    jawSharpness: base.jawSharpness,
    eyeSize: clamp(base.eyeRoundness * 0.75 + 20),
    eyeRoundness: base.eyeRoundness,
    eyeLength: clamp(base.eyeSharpness * 0.8 + 10),
    eyeUpturn: clamp(base.eyeSharpness * 0.55 + (100-base.eyeRoundness) * 0.22),
    eyeDroopiness: clamp((100-base.eyeSharpness) * 0.5 + base.eyeRoundness * 0.3),
    eyeSpacing: base.eyeSpacing,
    eyeFocus: clamp(base.eyeSharpness * 0.65 + base.symmetry * 0.35),
    browEyeDistance: clamp((100-base.eyeSharpness) * 0.4 + base.faceLength * 0.3),
    midfaceLength: clamp(base.faceLength * 0.75 + (100-base.faceRoundness) * 0.25),
    nosePresence: clamp(base.overallSharpness * 0.55 + base.faceLength * 0.45),
    noseSoftness: clamp(base.overallSoftness * 0.6 + (100-base.overallSharpness) * 0.4),
    mouthWidth: clamp(base.mouthSoftness * 0.8 + 12),
    mouthWarmth: clamp(base.mouthSoftness * 0.6 + base.smileHint * 0.4),
    smileOpenness: base.smileHint,
    facialSpacing: base.eyeSpacing,
    featureContrast: clamp(Math.abs(base.overallSharpness - base.overallSoftness) * 1.4),
    symmetryImpression: base.symmetry,
    visualWeight: clamp(base.overallSharpness * 0.5 + base.faceLength * 0.25 + base.jawSharpness * 0.25),
  }
}

const mapAnimalKey = (baseAnimal: string) => {
  const s = baseAnimal.toLowerCase()
  if (s.includes('사슴') || s.includes('deer') || s.includes('stag')) return 'deer'
  if (s.includes('고양이') || s.includes('cat')) return 'cat'
  if (s.includes('강아지') || s.includes('dog') || s.includes('puppy')) return 'puppy'
  if (s.includes('토끼') || s.includes('rabbit')) return 'rabbit'
  if (s.includes('여우') || s.includes('fox')) return 'fox'
  if (s.includes('곰') || s.includes('bear')) return 'bear'
  if (s.includes('백조') || s.includes('swan')) return 'swan'
  if (s.includes('올빼미') || s.includes('owl')) return 'owl'
  if (s.includes('햄스터') || s.includes('hamster')) return 'hamster'
  if (s.includes('수달') || s.includes('otter')) return 'otter'
  return 'cat'
}

export function matchAnimal(vectorInput: any, baseFeatures?: BaseFeatures): MatchResult {
  const safe = validateAnimalResultsDataset(animalResults)
  const geometry = baseFeatures ? toFaceGeometryVector(baseFeatures) : toFaceGeometryVector({ faceRoundness:50, faceLength:50, jawSharpness:50, eyeRoundness:50, eyeSharpness:50, eyeSpacing:50, mouthSoftness:50, smileHint:50, symmetry:50, overallSoftness:50, overallSharpness:50 })

  const scored = safe.map((card) => {
    const gProfile = animalGeometryProfiles[mapAnimalKey(card.baseAnimal)] ?? animalGeometryProfiles.cat
    const mood = profileForBaseAnimal(card.baseAnimal)
    const geometryDiff = gKeys.reduce((sum, k) => {
      const target = gProfile[k]
      if (typeof target !== 'number') return sum
      return sum + (geometry[k] - target) ** 2
    }, 0)
    const geometryCount = Object.keys(gProfile).length || 1
    const geometryScore = clamp(100 - Math.sqrt(geometryDiff / geometryCount) * 1.8)
    const expressionScore = clamp((
      100 - Math.abs(geometry.mouthWarmth - (gProfile.mouthWarmth ?? 50)) * 1.1 +
      100 - Math.abs(geometry.smileOpenness - (gProfile.smileOpenness ?? 50)) * 0.9 +
      100 - Math.abs(geometry.eyeFocus - (gProfile.eyeFocus ?? 50)) * 0.8
    ) / 3)
    const moodScore = clamp((
      100 - Math.abs(geometry.faceRoundness - mood.roundness) * 0.7 +
      100 - Math.abs(geometry.jawSharpness - mood.sharpness) * 0.7
    ) / 2)
    const photoStyleScore = 50

    const finalScore = clamp(geometryScore * 0.65 + expressionScore * 0.2 + moodScore * 0.1 + photoStyleScore * 0.05)
    const evidenceCount = [
      geometryScore >= 62,
      expressionScore >= 56,
      Math.abs(geometry.eyeFocus - (gProfile.eyeFocus ?? geometry.eyeFocus)) <= 18,
      Math.abs(geometry.faceRoundness - (gProfile.faceRoundness ?? geometry.faceRoundness)) <= 20,
    ].filter(Boolean).length

    return { ...card, geometryScore, expressionScore, moodScore, photoStyleScore, finalScore, evidenceCount }
  })

  const topGeometry = [...scored].sort((a,b)=>b.geometryScore-a.geometryScore)
  const geometryTop5 = topGeometry.slice(0,5)
  const finalTop3 = [...geometryTop5].sort((a,b)=> ((b.expressionScore+b.moodScore) - (a.expressionScore+a.moodScore)) || (b.photoStyleScore-a.photoStyleScore)).slice(0,3)

  const [first] = [finalTop3[0]]
  const primaryFallback = topGeometry[0]
  const primaryPick = first && first.geometryScore >= 58 ? first : primaryFallback
  const primaryAnimal = primaryPick ?? scored[0]
  const ordered = [primaryAnimal, ...finalTop3.filter((c)=>c.id!==primaryAnimal.id)].slice(0,3)

  const total = Math.max(1, ordered.reduce((s,c)=>s+c.finalScore,0))
  const candidates = ordered.map((c)=>({ ...c, score: Math.round(c.finalScore), blendRatio: Math.round((c.finalScore/total)*100), reasons: [
    `눈매/시선 구조 점수(${Math.round(c.geometryScore)})가 ${c.baseAnimal} 기준과 가깝습니다.`,
    `얼굴형·턱선 구조가 ${c.baseAnimal}형 프로파일에 근접합니다.`,
    `입매/표정 축 점수(${Math.round(c.expressionScore)})가 유지됩니다.`,
  ] }))
  if (candidates.length === 3) candidates[0].blendRatio += 100 - candidates.reduce((s,c)=>s+c.blendRatio,0)

  const gGap = Math.max(0, (topGeometry[0]?.geometryScore ?? 0) - (topGeometry[1]?.geometryScore ?? 0))
  const confidence = clamp(Math.round((primaryAnimal.geometryScore * 0.7) + (gGap * 2.2) + (primaryAnimal.evidenceCount >= 3 ? 8 : -8)))
  const confidenceLabel = primaryAnimal.geometryScore >= 68
    ? '얼굴 구조 기준으로 높은 닮음'
    : '분위기 유사도는 있으나 얼굴 구조 닮음은 약함'

  const whyNotOtherAnimals = topGeometry.slice(1,4).map((s)=> `${s.name}: geometryScore ${Math.round(s.geometryScore)}로 유사했지만, expression/mood 합산에서 우선순위가 낮았습니다.`)
  const primaryReason = `geometryScore ${Math.round(primaryAnimal.geometryScore)}점, 2위 대비 구조 점수 차이 ${gGap.toFixed(1)}점, evidence ${primaryAnimal.evidenceCount}/4 충족으로 primaryAnimal로 선택되었습니다.`

  const mainResult = candidates[0]
  const insight = baseFeatures ? buildResultInsight(baseFeatures, vectorInput, mainResult, mainResult.score) : undefined

  return {
    mainResult,
    candidates,
    score: mainResult.score,
    vector: vectorInput,
    features: baseFeatures,
    insight,
    userFaceVector: undefined,
    scoreBreakdown: {
      top5: topGeometry.slice(0,5).map((s)=>({id:s.id,name:s.name,score:Math.round(s.finalScore)})),
      secondaryReason: candidates[1]?.reasons?.[0] ?? '',
      hiddenReason: candidates[2]?.reasons?.[0] ?? '',
      featureImpact: [],
      extractedFaceGeometryVector: geometry,
      top10AnimalsByGeometryScore: topGeometry.slice(0,10).map((s)=>({id:s.id,name:s.name,geometryScore:Number(s.geometryScore.toFixed(2))})),
      top10AnimalsByFinalScore: [...scored].sort((a,b)=>b.finalScore-a.finalScore).slice(0,10).map((s)=>({id:s.id,name:s.name,finalScore:Number(s.finalScore.toFixed(2))})),
      scoreByCategory: ordered.map((c)=>({name:c.name,geometryScore:Number(c.geometryScore.toFixed(2)),expressionScore:Number(c.expressionScore.toFixed(2)),moodScore:Number(c.moodScore.toFixed(2)),photoStyleScore:Number(c.photoStyleScore.toFixed(2))})),
      primaryAnimal: mainResult.name,
      primaryReason,
      whyNotOtherAnimals,
      photoStyleImpactRatio: 5,
      confidence,
      confidenceLabel,
      ambiguousBlendNote: primaryAnimal.geometryScore < 60 ? `대표 동물 하나로 강하게 고정되기보다 얼굴형/눈매/입매 혼합형으로 해석하는 것이 정확합니다.` : undefined,
    },
  }
}
