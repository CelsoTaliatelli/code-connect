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

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
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
