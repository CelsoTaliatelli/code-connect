import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { expect, describe, it } from 'vitest'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

expect.extend(toHaveNoViolations)

const wcagAaRules = {
  runOnly: {
    type: 'tag' as const,
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
}

describe('accessibility', () => {
  it('has no WCAG 2.1 AA violations on the login page', async () => {
    const { container } = render(<LoginPage />)

    expect(await axe(container, wcagAaRules)).toHaveNoViolations()
  })

  it('has no WCAG 2.1 AA violations on the register page', async () => {
    const { container } = render(<RegisterPage />)

    expect(await axe(container, wcagAaRules)).toHaveNoViolations()
  })
})