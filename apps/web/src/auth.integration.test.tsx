import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

type MockResponse = {
  ok: boolean
  status?: number
  json: () => Promise<unknown>
}

function response(body: unknown, ok = true, status = 200): MockResponse {
  return { ok, status, json: async () => body }
}

describe('authentication integration', () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<MockResponse>>()

  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/login')
    vi.stubGlobal('fetch', fetchMock)
    fetchMock.mockReset()
  })

  it('logs in, stores the token and loads the authenticated user', async () => {
    fetchMock
      .mockResolvedValueOnce(response({ accessToken: 'token-123', tokenType: 'Bearer' }))
      .mockResolvedValueOnce(response({ id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com' }))

    render(<App />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'correct-horse' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => expect(screen.getByRole('heading', { name: /olá, ada lovelace/i })).toBeTruthy())

    expect(window.localStorage.getItem('code-connect.access-token')).toBe('token-123')
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3000/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'ada@example.com', password: 'correct-horse' }),
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'http://localhost:3000/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' }),
      }),
    )

    fireEvent.click(screen.getByRole('button', { name: /sair/i }))
    await waitFor(() => expect(screen.getByRole('heading', { name: /^login$/i })).toBeTruthy())
    expect(window.localStorage.getItem('code-connect.access-token')).toBeNull()
  })

  it('registers and logs the user in automatically', async () => {
    window.history.replaceState({}, '', '/cadastro')
    fetchMock
      .mockResolvedValueOnce(response({ id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com' }, true, 201))
      .mockResolvedValueOnce(response({ accessToken: 'token-456', tokenType: 'Bearer' }))
      .mockResolvedValueOnce(response({ id: 'user-1', name: 'Ada Lovelace', email: 'ada@example.com' }))

    render(<App />)
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ada Lovelace' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'correct-horse' } })
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => expect(screen.getByRole('heading', { name: /olá, ada lovelace/i })).toBeTruthy())

    const registerRequest = fetchMock.mock.calls[0]
    expect(registerRequest[0]).toBe('http://localhost:3000/auth/register')
    expect(registerRequest[1]).toEqual(expect.objectContaining({ method: 'POST' }))
    expect(Object.keys(JSON.parse(String(registerRequest[1]?.body)))).toEqual(['name', 'email', 'password'])
    expect(JSON.parse(String(registerRequest[1]?.body))).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse',
    })
    expect(window.localStorage.getItem('code-connect.access-token')).toBe('token-456')
    expect(window.location.pathname).toBe('/')

    const loginRequest = fetchMock.mock.calls[1]
    expect(loginRequest[0]).toBe('http://localhost:3000/auth/login')
    expect(JSON.parse(String(loginRequest[1]?.body))).toEqual({
      email: 'ada@example.com',
      password: 'correct-horse',
    })
    expect(JSON.parse(String(loginRequest[1]?.body))).not.toHaveProperty('name')
  })

  it('does not send invalid registration data to the API', async () => {
    window.history.replaceState({}, '', '/cadastro')
    render(<App />)

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => expect(fetchMock).not.toHaveBeenCalled())
    expect(window.location.pathname).toBe('/cadastro')
  })

  it('renders the API error when credentials are rejected', async () => {
    fetchMock.mockResolvedValueOnce(response({ message: 'Invalid credentials' }, false, 401))

    render(<App />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'missing@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'wrong-password' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    expect((await screen.findByRole('alert')).textContent).toContain('Invalid credentials')
    expect(window.localStorage.getItem('code-connect.access-token')).toBeNull()
  })
})
