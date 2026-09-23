import { useState } from 'react'

export function PostThumbnail({ src, title }: { src: string | null; title: string }) {
  const [failed, setFailed] = useState(!src)
  if (failed) return <div className="post-thumbnail post-thumbnail--fallback" role="img" aria-label={`Thumbnail indisponível para ${title}`}><span>CC</span></div>
  return <img className="post-thumbnail" src={src ?? undefined} alt="" onError={() => setFailed(true)} />
}