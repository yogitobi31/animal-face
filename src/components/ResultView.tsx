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

      <div className='info-panel'>
        <h3>닮은 포인트</h3>
        <ul>{result.insight?.featureBullets.map((b)=><li key={b}>{b}</li>)}</ul>
      </div>
      <div className='info-panel'>
        <h3>시그니처 무드</h3>
        <div className='chip-row'>{result.insight?.signatureTraits.map((t)=><span key={t} className='trait-chip'>{t}</span>)}</div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-stone-700">비슷한 후보 3개</h3>
        <CandidateList result={result} />
      </div>

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
