//module
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button component', () => {
  it('renders with children and handles click', () => {
    const handleClick = vi.fn()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByText('Click me')
    expect(button).toBeDefined()
    
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state and disables button when isLoading is true', () => {
    const handleClick = vi.fn()
    
    render(<Button isLoading onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveProperty('disabled', true)
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies different variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary').className).toContain('bg-blue-600')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary').className).toContain('bg-gray-200')

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByText('Danger').className).toContain('bg-red-600')
  })
})