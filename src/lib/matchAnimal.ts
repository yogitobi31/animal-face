import { animalCards } from '../data/animalCards'
import type { EmotionVector, MatchResult } from '../types/animal'
const w={roundness:1.1,sharpness:1.1,softness:1,elegance:0.9,playfulness:0.8,calmness:0.8,brightness:0.8,mystery:0.9,warmth:1}
export function matchAnimal(v: EmotionVector): MatchResult {
  const ranked=animalCards.map((card)=>{
    const d=Math.sqrt(Object.entries(w).reduce((s,[k,weight])=>{const diff=v[k as keyof EmotionVector]-card.profile[k as keyof EmotionVector];return s+weight*diff*diff},0))
    const score=Math.max(0,Math.min(100,Math.round(100-d/3)))
    return {...card, score}
  }).sort((a,b)=>b.score-a.score)
  return { mainResult: ranked[0], candidates: ranked.slice(0,3), score: ranked[0].score, vector: v }
}
