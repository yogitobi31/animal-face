import { useRef } from 'react';
import { saveCardImage } from '../lib/saveCardImage';
import type { MatchResult } from '../types/animal';
import AdSlotPlaceholder from './AdSlotPlaceholder';
import CandidateList from './CandidateList';
import ResultCard from './ResultCard';
import CollectibleResultCard from './CollectibleResultCard';

type ResultViewProps = { result: MatchResult | null; onRetry: () => void; };

export default function ResultView({ result, onRetry }: ResultViewProps) {
  if (!result?.mainResult) return <section className="result-page"><p className="text-sm text-stone-600">분석 중...</p></section>;
  const exportRef = useRef<HTMLDivElement>(null);
  const debugMode = import.meta.env.DEV || new URLSearchParams(location.search).get('debug') === 'true';
  const handleShare = async () => { if (!navigator.share) return; try { await navigator.share({ title: 'Animal Face Archive', text: result.mainResult.variantName, url: location.href }); } catch {} };
  const handleSaveImage = async () => { if (!exportRef.current) return; await saveCardImage(exportRef.current); };

  return <section className="result-page space-y-5">
    <ResultCard card={result.mainResult} score={result.score} insight={result.insight} />
    <div className='info-panel'><h3>대표 동물상</h3><p className='text-xl font-bold'>{result.mainResult.baseAnimalLabel}</p><p>세부 타입: {result.mainResult.variantName}</p></div>
    <div className='info-panel'><h3>섞인 동물상 비율</h3><ul>{result.candidates.map((c)=><li key={c.id}>{c.baseAnimalLabel} {typeof c.blendRatio==='number'?`${c.blendRatio}%`:'계산 중'} <small className='ml-1 text-stone-500'>({c.variantName})</small></li>)}</ul></div>
    <div className='info-panel'><h3>얼굴에서 가장 닮은 포인트 3가지</h3><ul>{result.faceEvidence?.map((b)=><li key={b.part}><strong>{b.part}</strong>: {b.text} <small>({b.feature})</small></li>)}</ul></div>
    <div className='info-panel'><h3>눈매 기준으로 가까운 동물</h3><p>{(result.scoreBreakdown as any)?.eyeAnimal?.label}</p><small>기준: eyeSize, eyeRoundness, eyeLength, eyeUpturn, eyeDroopiness, eyeFocus, eyeSpacing</small></div>
    <div className='info-panel'><h3>얼굴형 기준으로 가까운 동물</h3><p>{(result.scoreBreakdown as any)?.faceShapeAnimal?.label}</p><small>기준: faceRoundness, faceLength, faceCompactness, jawSoftness, jawSharpness, facialSpacing, visualWeight</small></div>
    <div className='info-panel'><h3>입매/표정 기준으로 가까운 동물</h3><p>{(result.scoreBreakdown as any)?.mouthExpressionAnimal?.label}</p><small>기준: mouthWidth, mouthWarmth, smileOpenness, expressionSoftness, smileEnergy</small></div>
    <div><h3 className="mb-2 text-sm font-medium text-stone-700">비슷했지만 탈락한 후보</h3><CandidateList result={result} /></div>
    {debugMode && result.scoreBreakdown && <div className='info-panel'><h3>Result Debug Panel</h3><pre className='text-xs overflow-auto'>{JSON.stringify(result.scoreBreakdown, null, 2)}</pre></div>}
    <div className="action-grid"><button onClick={onRetry} className="secondary-btn">다시 분석하기</button><button onClick={handleSaveImage} className="primary-btn">이미지 저장하기</button><button onClick={handleShare} className="secondary-btn full-width">공유하기</button></div>
    <div className='sr-only' aria-hidden ref={exportRef}>{result.insight && <CollectibleResultCard card={result.mainResult} score={result.score} insight={result.insight} />}</div>
    <div className="pt-3 border-t border-stone-200/70 mt-2"><AdSlotPlaceholder compact /></div>
  </section>
}
