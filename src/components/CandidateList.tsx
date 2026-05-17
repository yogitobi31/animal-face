import type { MatchResult } from '../types/animal'
export default function CandidateList({result}:{result:MatchResult}){return <div className='space-y-2'>{result.candidates.map((c)=><div key={c.id} className='rounded-xl bg-white/70 p-3 flex justify-between'><span>{c.name}</span><span>{c.score}%</span></div>)}</div>}
