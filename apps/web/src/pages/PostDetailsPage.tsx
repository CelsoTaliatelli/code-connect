import { useEffect, useState } from 'react'
import { createComment, getPost, likePost, unlikePost, type PostDetails } from '../lib/authApi'
import { useAuth } from '../hooks/useAuth'
import { FeedLayout } from '../components/templates/FeedLayout'
import { PostThumbnail } from '../components/molecules/PostThumbnail'

export function PostDetailsPage() {
  const id = window.location.pathname.split('/').pop() ?? ''
  const { user } = useAuth()
  const [post, setPost] = useState<PostDetails | null>(null)
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { getPost(id).then(setPost).catch(() => setError('Post não encontrado.')) }, [id])
  if (error) return <FeedLayout search="" onSearch={() => undefined}><p role="alert">{error}</p></FeedLayout>
  if (!post) return <FeedLayout search="" onSearch={() => undefined}><p role="status">Carregando post...</p></FeedLayout>
  const handleLike = async () => { const result = post.likedByMe ? await unlikePost(post.id) : await likePost(post.id); setPost({ ...post, ...result }) }
  const handleComment = async (event: React.FormEvent) => { event.preventDefault(); if (!comment.trim()) return; try { const created = await createComment(post.id, comment); setPost({ ...post, comments: [...post.comments, created], commentsCount: post.commentsCount + 1 }); setComment('') } catch { setError('Não foi possível publicar o comentário.') } }
  return <FeedLayout search="" onSearch={() => undefined}><article className="post-detail"><PostThumbnail src={post.thumbnail} title={post.title} /><p className="feed-kicker">{post.author.name} · {new Date(post.createdAt).toLocaleDateString('pt-BR')}</p><h2>{post.title}</h2><p className="post-detail__content">{post.content}</p><button className={post.likedByMe ? 'post-action post-action--liked' : 'post-action'} disabled={!user} onClick={handleLike}>♥ {post.likesCount} curtidas</button></article><section className="comments"><h2>Comentários <span>{post.commentsCount}</span></h2>{post.comments.map((item) => <article className="comment" key={item.id}><strong>{item.author.name}</strong><p>{item.content}</p></article>)}{user ? <form onSubmit={handleComment} className="comment-form"><textarea aria-label="Novo comentário" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreva um comentário" /><button className="feed-primary" type="submit">Comentar</button></form> : <p>Faça login para comentar.</p>}</section></FeedLayout>
}