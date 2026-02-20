import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '../Button'

describe('Button snapshots', () => {
  it('matches primary button snapshot', () => {
    const { container } = render(
      <Button variant="primary">Primary Button</Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches secondary button snapshot', () => {
    const { container } = render(
      <Button variant="secondary">Secondary Button</Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches danger button snapshot', () => {
    const { container } = render(
      <Button variant="danger">Danger Button</Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches loading button snapshot', () => {
    const { container } = render(
      <Button isLoading>Loading Button</Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})