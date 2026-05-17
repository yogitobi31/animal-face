import { useRef } from 'react';

import { saveCardImage } from '../lib/saveCardImage';
import type { MatchResult } from '../types/animal';
import AdSlotPlaceholder from './AdSlotPlaceholder';
import CandidateList from './CandidateList';
import ResultCard from './ResultCard';

type ResultViewProps = {
  result: MatchResult;
  onRetry: () => void;
};

export default function ResultView({ result, onRetry }: ResultViewProps) {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!cardContainerRef.current) return;

    try {
      await saveCardImage(cardContainerRef.current);
    } catch {
      alert('저장 이미지 생성에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share?.({
        title: 'Animal Face Archive',
        text: result.mainResult.name,
        url: location.href,
      });
    } catch {
      // 사용자 취소 등 공유 실패는 무시
    }
  };

  return (
    <section className="space-y-4">
      <div ref={cardContainerRef}>
        <ResultCard card={result.mainResult} score={result.score} />
      </div>

      <div>
        <h3 className="mb-2 font-medium">비슷한 후보 3개</h3>
        <CandidateList result={result} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onRetry} className="rounded-xl bg-white p-3">
          다시 분석하기
        </button>

        <button
          onClick={handleSaveImage}
          className="rounded-xl bg-stone-900 p-3 text-white"
        >
          이미지 저장하기
        </button>

        <button
          onClick={handleShare}
          className="col-span-2 rounded-xl bg-white p-3"
        >
          공유하기
        </button>
      </div>

      <AdSlotPlaceholder compact />
      <AdSlotPlaceholder />
    </section>
  );
}
