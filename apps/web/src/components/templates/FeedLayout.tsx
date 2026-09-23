import type { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

function goTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function FeedLayout({ children, search, onSearch, onPublish }: { children: ReactNode; search: string; onSearch: (value: string) => void; onPublish?: () => void }) {
  const { user, logout } = useAuth()

  return (
    <div className="feed-shell">
      <aside className="feed-sidebar">
        <button className="feed-brand" type="button" onClick={() => goTo('/')}>
          <span className="brand-mark"><span className="brand-mark__dot" /></span>
          <span className="brand-text"><span>code</span><span>connect</span></span>
        </button>
        <nav aria-label="Navegação principal" className="feed-nav">
          <button type="button" className="feed-nav__link feed-nav__link--active" onClick={() => goTo('/')}>Explorar</button>
          {user && <button type="button" className="feed-publish-link" onClick={onPublish}><PlusIcon /> Publicar</button>}
        </nav>
        <div className="feed-sidebar__bottom">
          {user ? <><span className="feed-user">{user.name}</span><button type="button" className="feed-nav__link" onClick={() => { logout(); goTo('/login') }}>Sair</button></> : <button type="button" className="feed-nav__link" onClick={() => goTo('/login')}>Login</button>}
        </div>
      </aside>
      <main className="feed-main">
        <header className="feed-header">
          <div><p className="feed-kicker">Comunidade</p><h1>{user ? `Olá, ${user.name}` : 'Descubra novas ideias'}</h1></div>
          <form className="feed-search" onSubmit={(event) => { event.preventDefault(); onSearch(search) }} role="search">
            <label htmlFor="post-search">Buscar posts</label>
            <input id="post-search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar por título, conteúdo ou autor" />
            <button type="submit" aria-label="Buscar posts" title="Buscar posts"><SearchIcon /></button>
          </form>
        </header>
        {children}
      </main>
    </div>
  )
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-icon"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
}

function PlusIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="feed-icon"><path d="M12 5v14M5 12h14" /></svg>
}