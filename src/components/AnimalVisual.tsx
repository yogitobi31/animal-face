import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { AnimalResult } from '../data/animalResults';
import { getIllustrationPath } from '../data/animalIllustrations';
import { normalizeAnimalResult } from '../lib/animalResultSafety';

type AnimalVisualProps = {
  result?: Partial<Pick<AnimalResult, 'id' | 'name' | 'palette' | 'baseAnimal' | 'moodTags' | 'illustrationKey'>> | null;
};

type ImageLoadStatus = 'idle' | 'loaded' | 'failed';

const silhouetteByAnimal: Record<string, string> = {
  고양이: 'M18 74 C28 55 40 47 53 47 C56 37 61 29 67 22 C73 30 77 37 81 47 C95 50 106 59 114 76 C101 93 82 102 64 103 C45 102 27 93 18 74 Z',
  강아지: 'M19 78 C24 58 38 50 50 50 C56 38 64 32 75 36 C80 45 84 53 88 60 C99 63 109 71 113 84 C99 98 82 104 64 104 C46 103 29 95 19 78 Z',
  여우: 'M15 83 C20 59 35 44 54 42 C60 29 66 22 74 18 C81 26 86 37 89 48 C102 55 110 67 113 83 C95 101 70 107 43 102 C31 98 21 92 15 83 Z',
  늑대: 'M16 84 C22 62 36 50 53 47 C57 34 62 24 70 18 C77 27 82 38 86 50 C99 56 108 67 112 83 C98 98 82 106 64 106 C45 106 29 98 16 84 Z',
  토끼: 'M24 86 C30 63 43 52 57 50 C56 39 56 29 58 16 C64 22 68 31 71 41 C74 31 79 23 86 18 C86 31 84 42 82 52 C93 56 103 64 109 78 C101 95 83 105 62 106 C45 106 31 99 24 86 Z',
  사슴: 'M22 85 C27 63 40 53 56 50 C57 39 60 30 66 23 C69 32 70 39 70 47 C75 41 82 33 92 29 C89 40 85 47 82 53 C95 58 105 67 110 82 C98 98 82 106 63 107 C45 107 30 99 22 85 Z',
  수달: 'M18 84 C27 66 44 59 63 60 C80 61 97 68 111 82 C101 96 85 104 67 105 C48 105 30 98 18 84 Z',
  곰: 'M18 83 C23 64 38 53 57 52 C62 44 69 41 77 44 C83 50 88 58 91 68 C101 72 109 80 112 91 C98 102 82 107 64 107 C46 107 30 101 18 83 Z',
  라쿤: 'M16 84 C22 63 37 52 56 51 C61 42 68 36 76 36 C82 44 85 53 87 61 C99 64 108 74 112 87 C96 101 79 108 60 108 C43 107 27 98 16 84 Z',
  다람쥐: 'M16 86 C20 69 32 56 48 52 C57 43 67 40 79 44 C90 52 96 64 99 77 C106 79 111 84 114 92 C100 104 82 110 61 110 C43 109 27 101 16 86 Z',
};
const defaultSilhouette = 'M18 82 C24 62 40 50 60 49 C80 49 98 60 112 80 C103 97 85 106 64 106 C44 106 27 99 18 82 Z';
const hashString = (value: string) => value.split('').reduce((acc, ch, index) => (acc + ch.charCodeAt(0) * (index + 17)) % 100000, 0);

export default function AnimalVisual({ result }: AnimalVisualProps) {
  const safeResult = normalizeAnimalResult(result, 'animal-visual');
  const illustrationPath = useMemo(() => getIllustrationPath(safeResult.illustrationKey), [safeResult.illustrationKey]);
  const [imageLoadStatus, setImageLoadStatus] = useState<ImageLoadStatus>('idle');
  const isPreviewMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1';

  useEffect(() => {
    setImageLoadStatus('idle');
  }, [illustrationPath, safeResult.id, safeResult.illustrationKey]);

  const shouldRenderImage = Boolean(illustrationPath) && imageLoadStatus !== 'failed';

  const [c1, c2, c3] = safeResult.palette;
  const hash = hashString(safeResult.illustrationKey);
  const variant = hash % 4;
  const rotation = (hash % 18) - 9;
  const intensity = 0.18 + (hash % 25) / 100;
  const patternId = `pattern-${safeResult.illustrationKey}-${safeResult.id}`;
  const silhouettePath = silhouetteByAnimal[safeResult.baseAnimal] ?? defaultSilhouette;
  const mood = safeResult.moodTags.length ? safeResult.moodTags.join(' · ') : '분위기 분석 중';

  const handleImageError = () => {
    setImageLoadStatus('failed');
    console.warn('[animal-illustration] failed to load image', {
      name: safeResult.name,
      illustrationKey: safeResult.illustrationKey,
      imageUrl: illustrationPath,
      loadFailed: true,
    });
  };

  return <div className={`animal-visual animal-visual-v${variant}`} style={{ '--av-c1': c1, '--av-c2': c2, '--av-c3': c3 } as CSSProperties}>
    {shouldRenderImage ? (
      <img
        key={`${safeResult.id}-${safeResult.illustrationKey}`}
        className="result-illustration"
        src={illustrationPath ?? undefined}
        alt={`${safeResult.name} 일러스트`}
        loading="eager"
        onLoad={() => setImageLoadStatus('loaded')}
        onError={handleImageError}
      />
    ) : (
      <>
        <div className="animal-visual-glow" style={{ opacity: intensity }} />
        <svg className="animal-visual-svg" viewBox="0 0 130 120" role="img" aria-label={`${safeResult.name} 분위기 일러스트`}>
      <defs>
        <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform={`rotate(${rotation})`}>
          <path d="M0 8 H16" stroke={c2} strokeWidth="0.75" opacity="0.24" />
          <path d="M8 0 V16" stroke={c1} strokeWidth="0.55" opacity="0.16" />
        </pattern>
        <linearGradient id={`${patternId}-line`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="60%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="130" height="120" fill={`url(#${patternId})`} opacity="0.55" />
      <path d={silhouettePath} fill={c3} opacity="0.13" />
      <path d={silhouettePath} fill="none" stroke={`url(#${patternId}-line)`} strokeWidth="1.7" opacity="0.72" />
      <path d="M20 90 C36 80 50 75 64 76 C80 76 95 82 112 95" className="animal-visual-curve-main" />
      <path d="M30 34 C46 24 69 22 97 32" className="animal-visual-curve-sub" />
        </svg>
        <div className="animal-visual-caption"><p>{safeResult.baseAnimal}</p><p>{mood}</p></div>
      </>
    )}
    {isPreviewMode && (
      <div className="animal-visual-debug">
        <p>key: {safeResult.illustrationKey}</p>
        <p>path: {illustrationPath ?? 'none'}</p>
        <p>status: {imageLoadStatus === 'failed' ? 'fallback' : imageLoadStatus}</p>
      </div>
    )}
  </div>;
}
