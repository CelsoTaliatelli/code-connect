import { useEffect, useState } from 'react'
import { createPost, getPosts, likePost, unlikePost, type Post } from '../lib/authApi'
import { useAuth } from '../hooks/useAuth'
import { FeedLayout } from '../components/templates/FeedLayout'
import { PostCard } from '../components/organisms/PostCard'

export function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({ title: '', content: '', thumbnail: '' })
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  const loadPosts = (term = search) => {
    setLoading(true)
    getPosts(term).then((response) => setPosts(response.items)).catch(() => setError('Não foi possível carregar os posts.')).finally(() => setLoading(false))
  }

  useEffect(() => {
    getPosts('').then((response) => setPosts(response.items)).catch(() => setError('Não foi possível carregar os posts.')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isComposerOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsComposerOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isComposerOpen])

  const handleLike = async (post: Post) => {
    try {
      const result = post.likedByMe ? await unlikePost(post.id) : await likePost(post.id)
      setPosts((current) => current.map((item) => item.id === post.id ? { ...item, ...result } : item))
    } catch { setError('Não foi possível atualizar a curtida.') }
  }

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const created = await createPost({ ...newPost, thumbnail: newPost.thumbnail || undefined })
      setPosts((current) => [created, ...current])
      setNewPost({ title: '', content: '', thumbnail: '' })
      setIsComposerOpen(false)
    } catch { setError('Preencha os campos do post corretamente.') }
  }

  return <FeedLayout search={search} onSearch={(value) => { setSearch(value); loadPosts(value) }} onPublish={() => setIsComposerOpen(true)}>
    {user && isComposerOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsComposerOpen(false) }}>
      <section className="post-modal" role="dialog" aria-modal="true" aria-labelledby="new-post-title">
        <div className="post-modal__header"><div><p className="feed-kicker">Compartilhe</p><h2 id="new-post-title">Crie um novo post</h2></div><button className="icon-button" type="button" onClick={() => setIsComposerOpen(false)} aria-label="Fechar" title="Fechar"><CloseIcon /></button></div>
        <form id="new-post" className="new-post" onSubmit={handleCreate}>
          <label>Título<input aria-label="Título do post" value={newPost.title} onChange={(event) => setNewPost({ ...newPost, title: event.target.value })} placeholder="Título do post" required /></label>
          <label>Conteúdo<textarea aria-label="Conteúdo do post" value={newPost.content} onChange={(event) => setNewPost({ ...newPost, content: event.target.value })} placeholder="O que você quer compartilhar?" required /></label>
          <label>Thumbnail <span>(opcional)</span><input aria-label="URL da thumbnail" value={newPost.thumbnail} onChange={(event) => setNewPost({ ...newPost, thumbnail: event.target.value })} placeholder="Cole a URL da imagem" /></label>
          <button className="feed-primary" type="submit">Publicar</button>
        </form>
      </section>
    </div>}
    <section className="feed-section" aria-labelledby="latest-posts"><div className="feed-section__heading"><h2 id="latest-posts">Posts recentes</h2><span>{posts.length} resultados</span></div>
      {loading ? <p role="status">Carregando posts...</p> : error ? <p role="alert">{error}</p> : posts.length ? <div className="posts-grid">{posts.map((post) => <PostCard key={post.id} post={post} canInteract={Boolean(user)} onLike={handleLike} />)}</div> : <p>Nenhum post encontrado.</p>}
    </section>
  </FeedLayout>
}

function CloseIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-icon"><path d="m6 6 12 12M18 6 6 18" /></svg> }