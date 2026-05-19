import { useRef } from 'react';

import { saveCardImage } from '../lib/saveCardImage';
import type { MatchResult } from '../types/animal';
import AdSlotPlaceholder from './AdSlotPlaceholder';
import CandidateList from './CandidateList';
import ResultCard from './ResultCard';
import CollectibleResultCard from './CollectibleResultCard';

type ResultViewProps = {
  result: MatchResult | null;
  onRetry: () => void;
};

export default function ResultView({ result, onRetry }: ResultViewProps) {
  if (!result?.mainResult) {
    return <section className="result-page"><p className="text-sm text-stone-600">분석 중...</p></section>;
  }
  const exportRef = useRef<HTMLDivElement>(null);


  const handleShare = async () => {
    if (!navigator.share) return;
    try { await navigator.share({ title: 'Animal Face Archive', text: result.mainResult.name, url: location.href }); } catch {}
  };

  const handleSaveImage = async () => {
    if (!exportRef.current) return;
    try {
      await saveCardImage(exportRef.current);
    } catch (error) {
      console.error('[save-card-image] handleSaveImage failed', error);
      alert('카드 저장에 실패했어요. 네트워크/이미지 로딩 상태를 확인 후 다시 시도해 주세요.');
    }
  };

  return (
    <section className="result-page space-y-5">
      <ResultCard card={result.mainResult} score={result.score} insight={result.insight} />

      <div className='info-panel'><h3>대표 동물상</h3><p>{result.mainResult.name}</p></div>
      <div className='info-panel'><h3>섞인 동물상 비율</h3><ul>{result.candidates.map((c)=><li key={c.id}>{c.name} {c.blendRatio}%</li>)}</ul></div>
      <div className='info-panel'><h3>얼굴에서 가장 닮은 포인트 3가지</h3><ul>{result.candidates[0]?.reasons?.slice(0,3).map((b)=><li key={b}>{b}</li>)}</ul></div>
      <div className='info-panel'><h3>무표정일 때 보이는 동물상</h3><p>{result.candidates[1]?.name ?? result.mainResult.name}</p></div>
      <div className='info-panel'><h3>웃을 때 보이는 동물상</h3><p>{result.candidates[2]?.name ?? result.mainResult.name}</p></div>
      <div className='info-panel'><h3>사람들이 처음 볼 때 느끼는 인상</h3><p>{result.insight?.resemblanceExplanation}</p></div>
      <div className='info-panel'><h3>친해진 뒤 드러나는 반전 인상</h3><p>{result.insight?.primaryReason}</p></div>
      <div><h3 className="mb-2 text-sm font-medium text-stone-700">비슷한 후보 3개</h3><CandidateList result={result} /></div>
      {import.meta.env.DEV && result.scoreBreakdown && <div className='info-panel'><h3>디버그 스코어</h3><pre className='text-xs overflow-auto'>{JSON.stringify({userFaceVector: result.userFaceVector, ...result.scoreBreakdown}, null, 2)}</pre></div>}

      <div className="action-grid">
        <button onClick={onRetry} className="secondary-btn">다시 분석하기</button>
        <button onClick={handleSaveImage} className="primary-btn">이미지 저장하기</button>
        <button onClick={handleShare} className="secondary-btn full-width">공유하기</button>
      </div>

      <div className='sr-only' aria-hidden ref={exportRef}>
        {result.insight && <CollectibleResultCard card={result.mainResult} score={result.score} insight={result.insight} />}
      </div>

      <div className="pt-3 border-t border-stone-200/70 mt-2"><AdSlotPlaceholder compact /></div>
    </section>
  );
}
