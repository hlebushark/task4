import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Post } from '../Post'
import type { Post as PostType } from '../../../api/types'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: any) => <a href="#">{children}</a>,
  useNavigate: () => vi.fn(),
}))

vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 days ago'
}))

const mockPost: PostType = {
  id: 1,
  title: 'Snapshot Test Post',
  body: 'This is a snapshot test post body. '.repeat(20), 
  userId: 1,
  tags: ['snapshot', 'testing'],
  reactions: { likes: 15, dislikes: 3 }
}

describe('Post snapshots', () => {
  it('matches collapsed post snapshot', () => {
    const { container } = render(<Post post={mockPost} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches post without tags snapshot', () => {
    const postWithoutTags = { ...mockPost, tags: [] }
    const { container } = render(<Post post={postWithoutTags} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches post with many reactions snapshot', () => {
    const postWithManyReactions = { 
      ...mockPost, 
      reactions: { likes: 999, dislikes: 10 }
    }
    const { container } = render(<Post post={postWithManyReactions} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})