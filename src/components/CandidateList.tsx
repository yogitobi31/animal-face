import type { MatchResult } from '../types/animal';

export default function CandidateList({ result }: { result: MatchResult }) {
  const items = result.similarButRejected?.length ? result.similarButRejected : result.candidates.map((c)=>({label:c.baseAnimalLabel, score:c.score, reason:'세부 축 점수에서 대표 동물상에 밀렸습니다.'}));
  return <div className="space-y-2.5">{items.map((c) => <div key={`${c.label}-${c.score}`} className="candidate-item"><span className="candidate-name">{c.label}</span><span className="candidate-score">{c.score}%</span><p className='text-xs text-stone-600'>{c.reason}</p></div>)}</div>
}
