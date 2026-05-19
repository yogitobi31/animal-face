import type { MatchResult, BaseFeatures } from '../types/animal'
export type CachedAnalysis = { hash: string; features: BaseFeatures; result: MatchResult }
const CACHE_VERSION='v3'
const key=(hash:string)=>`animalFaceArchive:analysis:${CACHE_VERSION}:${hash}`
export const loadCached=(hash:string):CachedAnalysis|null=>{const raw=localStorage.getItem(key(hash));return raw?JSON.parse(raw):null}
export const saveCached=(data:CachedAnalysis)=>localStorage.setItem(key(data.hash),JSON.stringify(data))
