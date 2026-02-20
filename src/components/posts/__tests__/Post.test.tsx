import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Post } from '../Post'
import type { Post as PostType } from '../../../api/types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, params }: any) => (
    <a href={`${to}/${params?.postId || ''}`} data-testid="mock-link">
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 days ago'
}))

const longTextPost: PostType = {
  id: 1,
  title: 'Test Post Title',
  body: 'This is a very long post body that exceeds 150 characters. '.repeat(10) + 'This should definitely trigger the "Read more" button because it is way longer than 150 characters.',
  userId: 1,
  tags: ['react', 'testing', 'typescript'],
  reactions: { likes: 42, dislikes: 5 }
}

const shortTextPost: PostType = {
  id: 1,
  title: 'Test Post Title',
  body: 'This is a short post body.',
  userId: 1,
  tags: ['react', 'testing', 'typescript'],
  reactions: { likes: 42, dislikes: 5 }
}

describe('Post component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders post title and content correctly', () => {
    render(<Post post={shortTextPost} />)
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText(/This is a short post body/)).toBeInTheDocument()
    expect(screen.getByText('#react')).toBeInTheDocument()
    expect(screen.getByText('42 likes')).toBeInTheDocument()
    expect(screen.getByText('5 dislikes')).toBeInTheDocument()
  })

  it('toggles read more/less when button is clicked', () => {
    render(<Post post={longTextPost} />)
    
    const readMoreButton = screen.getByText('Read more')
    expect(readMoreButton).toBeInTheDocument()
    
    fireEvent.click(readMoreButton)
    
    const showLessButton = screen.getByText('Show less')
    expect(showLessButton).toBeInTheDocument()
    
    fireEvent.click(showLessButton)
    
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })

  it('handles like button click', () => {
    render(<Post post={shortTextPost} />)
    
    const likeButton = screen.getByText('Like').closest('button')
    expect(likeButton).toBeDefined()
    
    fireEvent.click(likeButton!)
    expect(likeButton).toHaveClass('bg-red-50 text-red-600')
    
    fireEvent.click(likeButton!)
    expect(likeButton).not.toHaveClass('bg-red-50')
  })

  it('does not show read more button for short posts', () => {
    render(<Post post={shortTextPost} />)
    
    const readMoreButton = screen.queryByText('Read more')
    expect(readMoreButton).not.toBeInTheDocument()
  })
})