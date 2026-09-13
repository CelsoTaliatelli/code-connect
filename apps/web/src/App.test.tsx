import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/cadastro')
  })

  it('renders the register page shell', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /cadastro/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeTruthy()
    expect(screen.getByLabelText(/nome/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/senha/i)).toBeTruthy()
  })

  it('links from registration to login', () => {
    render(<App />)

    const loginLink = screen.getByRole('link', { name: /faça seu login/i })

    expect(loginLink.getAttribute('href')).toBe('/login')

    act(() => {
      window.history.pushState({}, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(screen.getByRole('heading', { name: /^login$/i })).toBeTruthy()
  })

  it('links from login to registration', () => {
    window.history.replaceState({}, '', '/login')
    render(<App />)

    const registerLink = screen.getByRole('link', { name: /cadastre-se/i })

    expect(registerLink.getAttribute('href')).toBe('/cadastro')

    act(() => {
      window.history.pushState({}, '', '/cadastro')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(screen.getByRole('heading', { name: /cadastro/i })).toBeTruthy()
  })

  it('changes pages when the authentication links are clicked', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: /faça seu login/i }))

    expect(window.location.pathname).toBe('/login')
  })
})
