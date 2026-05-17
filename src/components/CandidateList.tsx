import type { MatchResult } from '../types/animal';

export default function CandidateList({ result }: { result: MatchResult }) {
  return (
    <div className="space-y-2.5">
      {result.candidates.map((c) => (
        <div key={c.id} className="candidate-item">
          <span className="candidate-name">{c.name}</span>
          <span className="candidate-score">{c.score}%</span>
        </div>
      ))}
    </div>
  );
}
