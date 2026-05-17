export async function hashFile(file: File): Promise<string> {
  if (!crypto?.subtle) throw new Error('이 브라우저는 안전한 해시 기능을 지원하지 않습니다.')
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
