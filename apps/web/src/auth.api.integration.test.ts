import { describe, expect, it } from 'vitest'

type PublicUser = {
  id: string
  name: string
  email: string
}

type LoginResponse = {
  accessToken: string
  tokenType: string
}

const apiUrl = process.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  const body = (await response.json()) as T
  return { response, body }
}

describe('authentication API integration', () => {
  it('registers, logs in and reads the authenticated user', async () => {
    const email = `integration-${Date.now()}@example.com`
    const credentials = {
      name: 'Integration User',
      email,
      password: 'correct-horse',
    }

    const register = await request<PublicUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    expect(register.response.status).toBe(201)
    expect(register.body).toMatchObject({ name: credentials.name, email })

    const login = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: credentials.password }),
    })
    expect(login.response.status).toBe(200)
    expect(login.body.tokenType).toBe('Bearer')
    expect(login.body.accessToken).toEqual(expect.any(String))

    const me = await request<PublicUser>('/auth/me', {
      headers: { Authorization: `Bearer ${login.body.accessToken}` },
    })
    expect(me.response.status).toBe(200)
    expect(me.body).toMatchObject({ name: credentials.name, email })
  })
})
