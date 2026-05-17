import type { BaseFeatures } from '../types/animal'
// 실서비스: MediaPipe Face Landmarker 연동. 개발/오프라인 실패 시 fallback으로 전환.
export async function extractFaceFeatures(image: HTMLImageElement): Promise<{features: BaseFeatures; multipleFaces: boolean}> {
  try {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision')
    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm')
    const landmarker = await FaceLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task' }, runningMode: 'IMAGE', numFaces: 3 })
    const res = landmarker.detect(image)
    if (!res.faceLandmarks.length) throw new Error('NO_FACE')
    const landmarks = res.faceLandmarks[0]
    const x=(i:number)=>landmarks[i].x, y=(i:number)=>landmarks[i].y
    const dist=(a:number,b:number)=>Math.hypot(x(a)-x(b),y(a)-y(b))
    const faceW=dist(234,454), faceH=dist(10,152)
    const features: BaseFeatures = {
      faceRoundness: (faceW/faceH)*70,
      faceLength: (faceH/faceW)*70,
      jawSharpness: (dist(172,397)/faceW)*120,
      eyeRoundness: ((dist(159,145)+dist(386,374))/2/faceW)*520,
      eyeSharpness: ((dist(33,133)+dist(362,263))/2/faceW)*200,
      eyeSpacing: (dist(133,362)/faceW)*120,
      mouthSoftness: (dist(61,291)/faceW)*150,
      smileHint: ((y(61)+y(291))/2-y(13))*260+50,
      symmetry: 100 - Math.abs((x(33)-x(1))-(x(1)-x(263)))*600,
      overallSoftness: ((dist(61,291)+dist(159,145))/faceW)*160,
      overallSharpness: ((dist(172,397)+dist(33,133))/faceW)*150
    }
    return { features, multipleFaces: res.faceLandmarks.length > 1 }
  } catch (e) {
    throw e
  }
}
