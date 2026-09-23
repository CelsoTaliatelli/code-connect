import type { Post } from '../../lib/authApi'
import { PostThumbnail } from '../molecules/PostThumbnail'

function goTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function PostCard({ post, onLike, canInteract }: { post: Post; onLike?: (post: Post) => void; canInteract: boolean }) {
  return (
    <article className="post-card">
      <button type="button" className="post-card__media" onClick={() => goTo(`/posts/${post.id}`)} aria-label={`Abrir ${post.title}`}><PostThumbnail src={post.thumbnail} title={post.title} /></button>
      <div className="post-card__body">
        <div className="post-card__meta"><span>{post.author.name}</span><span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span></div>
        <button type="button" className="post-card__title" onClick={() => goTo(`/posts/${post.id}`)}>{post.title}</button>
        <p className="post-card__excerpt">{post.content}</p>
        <div className="post-card__actions">
          <button type="button" className={post.likedByMe ? 'post-action post-action--liked' : 'post-action'} disabled={!canInteract} onClick={() => onLike?.(post)} aria-label={canInteract ? 'Curtir post' : 'Faça login para curtir'} title={canInteract ? 'Curtir post' : 'Faça login para curtir'}><HeartIcon filled={post.likedByMe} /><span>{post.likesCount}</span></button>
          <button type="button" className="post-action" onClick={() => goTo(`/posts/${post.id}`)} aria-label="Ver comentários" title="Ver comentários"><CommentIcon /><span>{post.commentsCount}</span></button>
        </div>
      </div>
    </article>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-icon" fill={filled ? 'currentColor' : 'none'}><path d="M20.8 8.9c0 5.4-8.8 10.1-8.8 10.1S3.2 14.3 3.2 8.9A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.8 2.4Z" /></svg>
}

function CommentIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-icon" fill="none"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.4-.7L4 20l1.6-3.7A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /></svg>
}