import type { BaseFeatures, EmotionVector } from '../types/animal'
import type { AnimalResult } from '../data/animalResults'

export type ResultInsight = {
  primaryReason: string
  signatureTraits: string[]
  resemblanceExplanation: string
  confidenceLabel: string
  featureBullets: string[]
  traitChips: string[]
}

const top3 = (items: Array<{label: string; score: number}>) => items.sort((a,b)=>b.score-a.score).slice(0,3).map(i=>i.label)

export function buildResultInsight(base: BaseFeatures, vector: EmotionVector, card: AnimalResult, score: number): ResultInsight {
  const bullets: Array<{label:string; text:string; score:number}> = [
    { label:'또렷한 눈매', text:'눈매가 또렷하고 시선 집중도가 높아 인상이 선명해요.', score: base.eyeSharpness },
    { label:'둥근 눈빛', text:'눈의 곡선이 부드러워 친근하고 귀여운 분위기가 살아나요.', score: base.eyeRoundness },
    { label:'부드러운 얼굴선', text:'턱선과 입매가 부드럽게 이어져 온화한 첫인상을 줘요.', score: base.overallSoftness },
    { label:'날렵한 윤곽', text:'턱선과 페이스 라인이 살아 있어 세련된 긴장감이 느껴져요.', score: base.overallSharpness },
    { label:'길고 정돈된 비율', text:'얼굴 길이 비율이 안정적이라 차분하고 우아한 무드가 납니다.', score: base.faceLength },
    { label:'밝은 미소 기운', text:'입꼬리와 입매의 상승감이 밝고 호감형 이미지를 만듭니다.', score: base.smileHint },
    { label:'균형 잡힌 대칭감', text:'좌우 밸런스가 좋아 정돈된 인상과 신뢰감을 더해줘요.', score: base.symmetry },
  ]
  const selected = bullets.sort((a,b)=>Math.abs(b.score-50)-Math.abs(a.score-50)).slice(0,3)

  const dominantTraits = top3([
    { label: '차분함', score: vector.calmness },
    { label: '신비감', score: vector.mystery },
    { label: '부드러움', score: vector.softness },
    { label: '선명함', score: vector.sharpness },
    { label: '발랄함', score: vector.playfulness },
    { label: '화사함', score: vector.brightness },
    { label: '우아함', score: vector.elegance },
    { label: '따뜻함', score: vector.warmth },
  ])

  const primary = selected[0]?.text ?? `${card.baseAnimal}상 특유의 분위기가 잘 살아 있어요.`
  const confidenceLabel = score >= 84 ? '얼굴 구조 기준으로 높은 닮음' : score >= 65 ? '구조 닮음이 확인됨' : '분위기 유사도는 있으나 얼굴 구조 닮음은 약함'

  return {
    primaryReason: primary,
    signatureTraits: dominantTraits,
    resemblanceExplanation: `${selected[0]?.label ?? '인상'}과 ${selected[1]?.label ?? '분위기'}이(가) 함께 보여서 ${card.baseAnimal}상 느낌이 자연스럽게 이어집니다.`,
    confidenceLabel,
    featureBullets: selected.map((s)=>s.text),
    traitChips: selected.map((s)=>s.label),
  }
}

export const rarityLabel = (category: string) => ({ classic:'CLASSIC', mood:'SIGNATURE', cute:'CHARM', rare:'RARE', hybrid:'HYBRID', 'rare-hybrid':'MYTHIC' }[category] ?? 'CLASSIC')
