import { useState } from 'react'
import Landing from './components/Landing'
import UploadPanel from './components/UploadPanel'
import AnalyzingView from './components/AnalyzingView'
import ResultView from './components/ResultView'
import ResultErrorBoundary from './components/ResultErrorBoundary'
import { hashFile } from './lib/imageHash'
import { loadCached, saveCached } from './lib/resultCache'
import { extractFaceFeatures } from './lib/faceLandmarks'
import { matchAnimal } from './lib/matchAnimal'
import { toEmotionVector } from './lib/featureExtraction'
import type { MatchResult } from './types/animal'

type Stage='landing'|'upload'|'analyzing'|'result'
export default function App(){
  const [stage,setStage]=useState<Stage>('landing');const [error,setError]=useState('');const [result,setResult]=useState<MatchResult|null>(null)
  const run=async(file:File)=>{setError(''); if(!file.type.startsWith('image/')) return setError('이미지 파일만 업로드할 수 있어요.'); if(file.size>12*1024*1024) return setError('파일이 너무 커요. 12MB 이하 이미지를 사용해 주세요.');
    setStage('analyzing');
    try{const hash=await hashFile(file); const cached=loadCached(hash); if(cached){setResult(cached.result);setStage('result');return}
      const img=new Image(); img.src=URL.createObjectURL(file); await img.decode();
      const out=await extractFaceFeatures(img)
      const vector=toEmotionVector(out.features)
      const matched=matchAnimal(vector)
      setResult(matched); saveCached({hash,features:out.features,result:matched}); setStage('result');
      if(out.multipleFaces) setError('여러 얼굴이 감지되어 가장 큰 얼굴 하나만 분석했어요.')
    }catch(e){
      const message=(e as Error).message||'분석 중 오류가 발생했습니다.'
      setError(message)
      setStage('upload')
    }
  }
  return <main className='mx-auto min-h-screen max-w-5xl px-4 py-8 overflow-x-hidden space-y-6 md:px-6 lg:px-8'>{stage==='landing'&&<Landing onStart={()=>setStage('upload')}/>} {stage==='upload'&&<UploadPanel onFile={run} error={error}/>} {stage==='analyzing'&&<AnalyzingView/>} {stage==='result'&&<><ResultErrorBoundary onReset={()=>{setResult(null);setStage('upload')}}><ResultView result={result} onRetry={()=>{setResult(null);setStage('upload')}}/></ResultErrorBoundary>{error&&<p className='text-xs text-amber-700'>{error}</p>}</>}</main>
}
