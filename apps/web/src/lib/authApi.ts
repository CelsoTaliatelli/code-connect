export type PublicUser = {
  id: string
  name: string
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = LoginCredentials & {
  name: string
}

type LoginResponse = {
  accessToken: string
  tokenType: 'Bearer'
}

type ApiErrorBody = {
  message?: string | string[]
}

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const tokenStorageKey = 'code-connect.access-token'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message ?? 'Não foi possível concluir a solicitação.'

    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}

export function getAccessToken() {
  return window.localStorage.getItem(tokenStorageKey)
}

export function registerUser(credentials: RegisterCredentials) {
  return request<PublicUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    }),
  })
}

export function loginUser(credentials: LoginCredentials) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  })
}

export function getCurrentUser(token: string) {
  return request<PublicUser>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export type PostAuthor = { id: string; name: string }
export type PostComment = { id: string; content: string; createdAt: string; author: PostAuthor }
export type Post = {
  id: string
  title: string
  content: string
  thumbnail: string | null
  createdAt: string
  author: PostAuthor
  likesCount: number
  commentsCount: number
  likedByMe: boolean
}
export type PostDetails = Post & { comments: PostComment[] }
export type CreatePostInput = { title: string; content: string; thumbnail?: string }

export function getPosts(search = '', token = getAccessToken()) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  const query = params.toString()
  return request<{ items: Post[]; page: number; limit: number; hasMore: boolean }>(
    `/posts${query ? `?${query}` : ''}`,
    undefined,
    token ?? undefined,
  )
}

export function getPost(id: string, token = getAccessToken()) {
  return request<PostDetails>(`/posts/${id}`, undefined, token ?? undefined)
}

export function createPost(input: CreatePostInput, token = getAccessToken()) {
  return request<Post>('/posts', { method: 'POST', body: JSON.stringify(input) }, token ?? undefined)
}

export function likePost(id: string, token = getAccessToken()) {
  return request<{ likesCount: number; likedByMe: boolean }>(`/posts/${id}/likes`, { method: 'POST' }, token ?? undefined)
}

export function unlikePost(id: string, token = getAccessToken()) {
  return request<{ likesCount: number; likedByMe: boolean }>(`/posts/${id}/likes`, { method: 'DELETE' }, token ?? undefined)
}

export function createComment(id: string, content: string, token = getAccessToken()) {
  return request<PostComment>(`/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }, token ?? undefined)
}
