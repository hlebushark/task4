import React from 'react'
import { Post } from './Post'
import type { Post as PostType } from '../../api/types'

interface PostFeedProps {
  posts: PostType[]
}

export const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No posts yet</div>
        <p className="text-gray-500">Be the first to create a post!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}