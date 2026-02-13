import React, { useState } from 'react'
import { usePosts } from '../../hooks/usePosts'
import { PostList } from '../../components/posts/PostList'
import { Loader } from '../../components/ui/Loader'
import { Outlet, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const PostsIndexRoute: React.FC = () => {
  const [page] = useState(0)
  const limit = 50
  
  const { data, isLoading, error } = usePosts(limit, page * limit)

  if (isLoading) return <Loader />
  if (error) return <div className="text-red-500">Error loading posts</div>
  if (!data) return null

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
        <Link
          to="/posts/create"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </Link>
      </div>
      
      <PostList posts={data.posts} />
    </div>
  )
}

export const PostsRoute: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Outlet />
    </div>
  )
}